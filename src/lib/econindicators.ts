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

export type BberTableResponse = {
  data?: unknown;
  metadata?: {
    table?: unknown;
    columns?: unknown;
  };
};

export type RawRecord = Record<string, unknown>;

export type BberTableMetadataColumn = {
  table_name: string;
  column_name: string;
  display_name: string;
  column_description: string;
};

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

function getCurrentIndicatorEndYear() {
  return new Date().getUTCFullYear();
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

export function normalizeRawRows(rows: unknown) {
  if (!Array.isArray(rows)) {
    return [];
  }

  return rows.filter((row): row is RawRecord =>
    Boolean(row && typeof row === "object"),
  );
}

function filterIndicatorRows(
  rows: RawRecord[],
  responseFilters: Record<string, string> | undefined,
) {
  return rows.filter((record) =>
    matchesResponseFilters(record, responseFilters),
  );
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
  const pointsByTimestamp = new Map<number, EconIndicatorLinePoint>();

  for (const record of filterIndicatorRows(
    normalizeRawRows(rows),
    responseFilters,
  )) {
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

export function normalizeMetadataColumns(rawValue: unknown) {
  if (!Array.isArray(rawValue)) {
    return [];
  }

  return rawValue.flatMap((columnValue) => {
    if (!columnValue || typeof columnValue !== "object") {
      return [];
    }

    const record = columnValue as RawRecord;
    const tableName = getStringValue(record, "table_name");
    const columnName = getStringValue(record, "column_name");
    const displayName = getStringValue(record, "display_name");
    const columnDescription = getStringValue(record, "column_description");

    if (!tableName || !columnName || !displayName || !columnDescription) {
      return [];
    }

    return [
      {
        table_name: tableName,
        column_name: columnName,
        display_name: displayName,
        column_description: columnDescription,
      },
    ];
  });
}

export function buildIndicatorSearchParams(
  config: EconIndicatorCardConfig,
  endYear = getCurrentIndicatorEndYear(),
) {
  const queryEntries = Object.entries(config.query).filter(
    (entry): entry is [string, string] => typeof entry[1] === "string",
  );

  return new URLSearchParams({
    table: config.table,
    periodyear: buildYearRange(config.allStartYear, endYear),
    ...Object.fromEntries(queryEntries),
  });
}

export function buildIndicatorApiUrl(
  config: EconIndicatorCardConfig,
  endYear = getCurrentIndicatorEndYear(),
) {
  const searchParams = buildIndicatorSearchParams(config, endYear);
  return `${BBER_REST_ENDPOINT}?${searchParams.toString()}`;
}

export async function fetchIndicatorDataset(config: EconIndicatorCardConfig) {
  const searchParams = buildIndicatorSearchParams(config);
  const response = await fetchExternalBberJson(searchParams);
  const rawRows = normalizeRawRows(response.data);

  return {
    apiUrl: `${BBER_REST_ENDPOINT}?${searchParams.toString()}`,
    response,
    rawRows,
    filteredRows: filterIndicatorRows(rawRows, config.responseFilters),
    source: normalizeSourceMetadata(response.metadata?.table),
    metadataColumns: normalizeMetadataColumns(response.metadata?.columns),
  };
}

async function fetchIndicatorCard(
  config: EconIndicatorCardConfig,
): Promise<EconIndicatorCard> {
  const dataset = await fetchIndicatorDataset(config);

  return {
    id: config.id,
    title: config.title,
    eyebrow: config.eyebrow,
    description: config.description,
    apiUrl: dataset.apiUrl,
    defaultMetric: config.defaultMetric,
    metrics: config.metrics.map((metric) => ({
      ...metric,
      points: normalizeMetricPoints(
        dataset.filteredRows,
        metric.value,
        metric.label,
        undefined,
        config.dateColumn,
      ),
    })),
    source: dataset.source,
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
