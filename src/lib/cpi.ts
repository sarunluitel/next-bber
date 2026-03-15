import "server-only";

import {
  CPI_PAGE_OVERVIEW,
  type CpiAnnualTableRow,
  type CpiMonthlyAverageRow,
  type CpiPageData,
  type CpiSourceMetadata,
  type CpiTableSection,
  type CpiTrendSection,
} from "@/content-models/cpi";
import type { TimeSeriesPoint } from "@/visualizations/chart-contracts";
import {
  buildTimeSeriesTrendSummary,
  formatExternalAsOfDate,
} from "@/visualizations/formatters/external-chart-formatters";

const BBER_REST_ENDPOINT = "https://api.bber.unm.edu/api/data/rest";

type RawRecord = Record<string, unknown>;

type RawCpiResponse = {
  data?: unknown;
  metadata?: {
    table?: unknown;
    columns?: unknown;
  };
};

type CpiSectionState<T> = {
  status: "ready" | "empty" | "error";
  value: T;
  message?: string;
};

export type CpiPageDataResult = {
  pageData: CpiPageData;
  trendState: CpiSectionState<CpiTrendSection>;
  tableState: CpiSectionState<CpiTableSection>;
};

const MONTH_LABEL_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

const YEAR_LABEL_FORMATTER = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  timeZone: "UTC",
});

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
    const parsedValue = Number(value.trim());
    return Number.isFinite(parsedValue) ? parsedValue : null;
  }

  return null;
}

function normalizeRows(rows: unknown) {
  if (!Array.isArray(rows)) {
    return [];
  }

  return rows.filter((row): row is RawRecord =>
    Boolean(row && typeof row === "object"),
  );
}

async function fetchCpiJson(pathname: string, searchParams: URLSearchParams) {
  const response = await fetch(
    `${BBER_REST_ENDPOINT}/${pathname}?${searchParams.toString()}`,
    {
      next: { revalidate: 3600 },
    },
  );

  if (!response.ok) {
    throw new Error(`CPI request failed with status ${response.status}.`);
  }

  return response.json() as Promise<RawCpiResponse>;
}

function normalizeSourceMetadata(rawValue: unknown): CpiSourceMetadata {
  const record =
    rawValue && typeof rawValue === "object" ? (rawValue as RawRecord) : {};

  return {
    tableName: getStringValue(record, "table_name") ?? "cpi",
    title: getStringValue(record, "data_title") ?? "Consumer Price Index",
    description:
      getStringValue(record, "data_description") ??
      "The Consumer Price Index for All Urban Consumers.",
    source: getStringValue(record, "source") ?? "US Bureau of Labor Statistics",
    referenceTime: getStringValue(record, "reference_time") ?? "Multiple",
    releaseSchedule:
      getStringValue(record, "release_schedule") ?? "BLS release schedule",
    geography:
      getStringValue(record, "geography") ??
      "U.S. city average and related areas",
    updatedAt: getStringValue(record, "updated"),
  };
}

function buildTrendPointDate(row: RawRecord) {
  const year = getNumberValue(row, "periodyear");
  const period = getNumberValue(row, "period");

  if (!year || !period || period < 1 || period > 12) {
    return null;
  }

  return new Date(Date.UTC(year, period - 1, 1));
}

function normalizeTrendPoints(rows: unknown) {
  const normalizedRows = normalizeRows(rows);

  const points = normalizedRows
    .map((row) => {
      const value = getNumberValue(row, "value");
      const date = buildTrendPointDate(row);

      if (value === null || !date) {
        return null;
      }

      const seriesLabel =
        getStringValue(row, "geographyname") ?? "U.S. city average";

      return {
        dateIso: date.toISOString(),
        timestamp: date.getTime(),
        dateLabel: MONTH_LABEL_FORMATTER.format(date),
        value,
        seriesKey: "cpi-u",
        seriesLabel,
      } satisfies TimeSeriesPoint;
    })
    .filter((point): point is TimeSeriesPoint => point !== null)
    .sort(
      (leftPoint, rightPoint) => leftPoint.timestamp - rightPoint.timestamp,
    );

  return points;
}

function normalizeMonthlyValues(row: RawRecord) {
  return {
    january: getNumberValue(row, "January"),
    february: getNumberValue(row, "February"),
    march: getNumberValue(row, "March"),
    april: getNumberValue(row, "April"),
    may: getNumberValue(row, "May"),
    june: getNumberValue(row, "June"),
    july: getNumberValue(row, "July"),
    august: getNumberValue(row, "August"),
    september: getNumberValue(row, "September"),
    october: getNumberValue(row, "October"),
    november: getNumberValue(row, "November"),
    december: getNumberValue(row, "December"),
  };
}

function normalizeAnnualTable(rows: unknown) {
  const normalizedRows = normalizeRows(rows);
  let monthlyAverageRow: CpiMonthlyAverageRow | null = null;

  const annualRows = normalizedRows
    .map((row) => {
      const yearValue = getStringValue(row, "Year");

      if (yearValue === "Monthly Average") {
        monthlyAverageRow = {
          monthValues: normalizeMonthlyValues(row),
          annualAverage: getNumberValue(row, "AnnualAverage"),
        };

        return null;
      }

      const year = yearValue ? Number(yearValue) : null;

      if (!year || !Number.isFinite(year)) {
        return null;
      }

      return {
        year,
        monthValues: normalizeMonthlyValues(row),
        annualAverage: getNumberValue(row, "AnnualAverage"),
        yearPercentageChange: getNumberValue(row, "YearPercentageChange"),
      } satisfies CpiAnnualTableRow;
    })
    .filter((row): row is CpiAnnualTableRow => row !== null)
    .sort((leftRow, rightRow) => leftRow.year - rightRow.year);

  return {
    annualRows,
    monthlyAverageRow,
  };
}

function buildTrendSection(
  points: TimeSeriesPoint[],
  sourceMetadata: CpiSourceMetadata,
): CpiTrendSection {
  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];
  const coverageLabel =
    firstPoint && lastPoint
      ? `${YEAR_LABEL_FORMATTER.format(new Date(firstPoint.timestamp))}-${YEAR_LABEL_FORMATTER.format(new Date(lastPoint.timestamp))}`
      : "No published range available";

  return {
    title: CPI_PAGE_OVERVIEW.trendTitle,
    description: CPI_PAGE_OVERVIEW.trendDescription,
    chartTitle: "Consumer Price Index for All Urban Consumers",
    chartSubtitle:
      "U.S. city average, not seasonally adjusted (base period: 1982-1984 = 100)",
    summary: buildTimeSeriesTrendSummary(
      points,
      "Consumer Price Index",
      "index",
    ),
    yAxisLabel: "Index (1982-1984 = 100)",
    points,
    latestValue: lastPoint?.value ?? null,
    latestDateLabel: lastPoint?.dateLabel ?? "Not reported",
    coverageLabel,
    notes: [
      sourceMetadata.description,
      `Reference time: ${sourceMetadata.referenceTime}`,
      `Release schedule: ${sourceMetadata.releaseSchedule}`,
      `Updated: ${formatExternalAsOfDate(sourceMetadata.updatedAt)}`,
    ],
  };
}

function buildTableSection(
  annualRows: CpiAnnualTableRow[],
  monthlyAverageRow: CpiMonthlyAverageRow | null,
): CpiTableSection {
  return {
    title: CPI_PAGE_OVERVIEW.tableTitle,
    description: CPI_PAGE_OVERVIEW.tableDescription,
    rows: annualRows,
    monthlyAverageRow,
  };
}

function buildEmptyTrendSection(
  sourceMetadata: CpiSourceMetadata,
): CpiTrendSection {
  return {
    ...buildTrendSection([], sourceMetadata),
    summary: "No published monthly CPI observations are currently available.",
    latestDateLabel: "Not reported",
    notes: [
      "The monthly CPI series is temporarily unavailable from the data service.",
    ],
  };
}

function buildEmptyTableSection(): CpiTableSection {
  return {
    title: CPI_PAGE_OVERVIEW.tableTitle,
    description: CPI_PAGE_OVERVIEW.tableDescription,
    rows: [],
    monthlyAverageRow: null,
  };
}

export async function getCpiPageData(): Promise<CpiPageDataResult> {
  const trendSearchParams = new URLSearchParams({
    table: "v_cpi",
    stfips: "00",
    areatype: "06",
    area: "0000",
  });

  const tableSearchParams = new URLSearchParams({
    areatype: "00",
  });

  const [trendResult, tableResult] = await Promise.allSettled([
    fetchCpiJson("bbertable", trendSearchParams),
    fetchCpiJson("cpitab", tableSearchParams),
  ]);

  const sourceMetadata =
    trendResult.status === "fulfilled"
      ? normalizeSourceMetadata(trendResult.value.metadata?.table)
      : normalizeSourceMetadata(null);

  const trendPoints =
    trendResult.status === "fulfilled"
      ? normalizeTrendPoints(trendResult.value.data)
      : [];
  const normalizedTable =
    tableResult.status === "fulfilled"
      ? normalizeAnnualTable(tableResult.value.data)
      : { annualRows: [], monthlyAverageRow: null };

  const trendSection =
    trendPoints.length > 0
      ? buildTrendSection(trendPoints, sourceMetadata)
      : buildEmptyTrendSection(sourceMetadata);
  const tableSection = buildTableSection(
    normalizedTable.annualRows,
    normalizedTable.monthlyAverageRow,
  );

  return {
    pageData: {
      path: CPI_PAGE_OVERVIEW.path,
      eyebrow: CPI_PAGE_OVERVIEW.eyebrow,
      title: CPI_PAGE_OVERVIEW.title,
      lead: CPI_PAGE_OVERVIEW.lead,
      overviewParagraphs: CPI_PAGE_OVERVIEW.overviewParagraphs,
      trendSection,
      tableSection,
      sourceMetadata,
      resourceLinks: CPI_PAGE_OVERVIEW.resourceLinks,
    },
    trendState:
      trendResult.status === "rejected"
        ? {
            status: "error",
            value: trendSection,
            message: "The monthly CPI trend is temporarily unavailable.",
          }
        : trendPoints.length === 0
          ? {
              status: "empty",
              value: trendSection,
              message:
                "The data service did not return monthly CPI observations for this request.",
            }
          : {
              status: "ready",
              value: trendSection,
            },
    tableState:
      tableResult.status === "rejected"
        ? {
            status: "error",
            value: tableSection,
            message: "The annual CPI table is temporarily unavailable.",
          }
        : normalizedTable.annualRows.length === 0
          ? {
              status: "empty",
              value: buildEmptyTableSection(),
              message:
                "The data service did not return annual CPI rows for this request.",
            }
          : {
              status: "ready",
              value: tableSection,
            },
  };
}
