import "server-only";

import {
  ECON_INDICATOR_CARD_CONFIGS,
  ECON_INDICATOR_RANGE_OPTIONS,
  type EconIndicatorCard,
  type EconIndicatorCardConfig,
  type EconIndicatorLinePoint,
  type EconIndicatorSourceMetadata,
  type EconIndicatorsPageData,
} from "@/content-models/econindicators";

const BBER_REST_ENDPOINT = "https://api.bber.unm.edu/api/data/rest/bbertable";

type BberTableResponse = {
  data?: unknown;
  metadata?: {
    table?: unknown;
  };
};

type RawRecord = Record<string, unknown>;

async function fetchExternalBberJson(searchParams: URLSearchParams) {
  const response = await fetch(
    `${BBER_REST_ENDPOINT}?${searchParams.toString()}`,
    {
      next: { revalidate: 3600 },
    },
  );

  if (!response.ok) {
    throw new Error(
      `Economic indicators request failed with status ${response.status}.`,
    );
  }

  return response.json() as Promise<BberTableResponse>;
}

function getStringValue(record: RawRecord, key: string) {
  const value = record[key];

  if (typeof value !== "string") {
    return null;
  }

  const trimmedValue = value.trim();
  return trimmedValue.length > 0 ? trimmedValue : null;
}

function getNumberValue(record: RawRecord, key: string) {
  const value = record[key];

  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim().length > 0) {
    const sanitizedValue = value.replace(/[$,%\s,]/g, "");
    const parsedValue = Number(sanitizedValue);
    return Number.isFinite(parsedValue) ? parsedValue : null;
  }

  return null;
}

function buildYearRange(startYear: number, endYear: number) {
  return `[${startYear}-${endYear}]`;
}

function parseIsoDate(value: string | null) {
  if (!value) {
    return null;
  }

  const parsedDate = new Date(value);
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
}

function buildDerivedDate(record: RawRecord) {
  const year = getNumberValue(record, "periodyear");
  const period = getNumberValue(record, "period") ?? 1;
  const periodType = getStringValue(record, "periodtype");

  if (!year) {
    return null;
  }

  if (periodType === "03" || periodType === "3") {
    return new Date(Date.UTC(year, Math.max(period - 1, 0), 1));
  }

  if (periodType === "04" || periodType === "4") {
    return new Date(Date.UTC(year, Math.max(period - 1, 0) * 3, 1));
  }

  if (periodType === "68") {
    return new Date(Date.UTC(year, 0, Math.max(period, 1)));
  }

  return new Date(Date.UTC(year, 0, 1));
}

function formatObservationDate(
  date: Date,
  granularity: "daily" | "monthly" | "annual",
) {
  if (granularity === "daily") {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    });
  }

  if (granularity === "monthly") {
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    });
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    timeZone: "UTC",
  });
}

function resolveObservationDate(record: RawRecord, dateColumn?: string) {
  const explicitDate =
    parseIsoDate(getStringValue(record, dateColumn ?? "")) ??
    parseIsoDate(getStringValue(record, "spdate")) ??
    parseIsoDate(getStringValue(record, "weekending")) ??
    parseIsoDate(getStringValue(record, "fileperiod")) ??
    parseIsoDate(getStringValue(record, "wtidate"));

  if (explicitDate) {
    return {
      date: explicitDate,
      granularity: "daily" as const,
    };
  }

  return {
    date: buildDerivedDate(record),
    granularity: "monthly" as const,
  };
}

function matchesResponseFilters(
  record: RawRecord,
  filters: Record<string, string> | undefined,
) {
  if (!filters) {
    return true;
  }

  return Object.entries(filters).every(([key, expectedValue]) => {
    const actualValue = getStringValue(record, key);
    return actualValue === expectedValue;
  });
}

function normalizeSourceMetadata(
  rawValue: unknown,
): EconIndicatorSourceMetadata {
  const record =
    rawValue && typeof rawValue === "object" ? (rawValue as RawRecord) : {};

  return {
    tableName: getStringValue(record, "table_name") ?? "",
    title: getStringValue(record, "data_title") ?? "",
    description: getStringValue(record, "data_description") ?? "",
    source: getStringValue(record, "source") ?? "",
    referenceTime: getStringValue(record, "reference_time") ?? "",
    releaseSchedule: getStringValue(record, "release_schedule") ?? "",
    updatedAt: getStringValue(record, "updated"),
  };
}

function normalizeMetricPoints(
  rows: unknown,
  metricKey: string,
  metricLabel: string,
  responseFilters?: Record<string, string>,
  dateColumn?: string,
): EconIndicatorLinePoint[] {
  if (!Array.isArray(rows)) {
    return [];
  }

  const pointsByTimestamp = new Map<number, EconIndicatorLinePoint>();

  for (const rawRow of rows) {
    if (!rawRow || typeof rawRow !== "object") {
      continue;
    }

    const record = rawRow as RawRecord;

    if (!matchesResponseFilters(record, responseFilters)) {
      continue;
    }

    const value = getNumberValue(record, metricKey);
    const resolvedDate = resolveObservationDate(record, dateColumn);

    if (value === null || !resolvedDate.date) {
      continue;
    }

    pointsByTimestamp.set(resolvedDate.date.getTime(), {
      dateIso: resolvedDate.date.toISOString(),
      timestamp: resolvedDate.date.getTime(),
      dateLabel: formatObservationDate(
        resolvedDate.date,
        resolvedDate.granularity,
      ),
      value,
      seriesKey: metricKey,
      seriesLabel: metricLabel,
    });
  }

  return Array.from(pointsByTimestamp.values()).sort(
    (leftPoint, rightPoint) => leftPoint.timestamp - rightPoint.timestamp,
  );
}

async function fetchIndicatorCard(
  config: EconIndicatorCardConfig,
): Promise<EconIndicatorCard> {
  const currentYear = new Date().getUTCFullYear();
  const queryEntries = Object.entries(config.query).filter(
    (entry): entry is [string, string] => typeof entry[1] === "string",
  );
  const searchParams = new URLSearchParams({
    table: config.table,
    periodyear: buildYearRange(config.allStartYear, currentYear),
    ...Object.fromEntries(queryEntries),
  });

  const response = await fetchExternalBberJson(searchParams);
  const source = normalizeSourceMetadata(response.metadata?.table);

  return {
    id: config.id,
    title: config.title,
    eyebrow: config.eyebrow,
    description: config.description,
    defaultMetric: config.defaultMetric,
    metrics: config.metrics.map((metric) => ({
      ...metric,
      points: normalizeMetricPoints(
        response.data,
        metric.value,
        metric.label,
        config.responseFilters,
        config.dateColumn,
      ),
    })),
    source,
  };
}

export async function getEconomicIndicatorsPageData(): Promise<EconIndicatorsPageData> {
  const cards = await Promise.all(
    ECON_INDICATOR_CARD_CONFIGS.map((config) => fetchIndicatorCard(config)),
  );

  return {
    cards,
    rangeOptions: ECON_INDICATOR_RANGE_OPTIONS,
  };
}
