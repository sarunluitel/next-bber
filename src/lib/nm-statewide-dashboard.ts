import "server-only";

import type { EconIndicatorCardConfig } from "@/content-models/econindicators";
import {
  buildEducationDonutChartModel,
  getDefaultEducationDonutConfig,
  normalizeEducationDonutColumns,
  normalizeEducationDonutRow,
  normalizeEducationDonutSourceMetadata,
} from "@/content-models/education-donut";
import {
  buildLocationQuotientFrames,
  getDefaultLocationQuotientConfig,
  getLocationQuotientMetricOptions,
  normalizeLocationQuotientSourceMetadata,
  normalizeQcewMetadataOptions,
  normalizeQcewRows,
} from "@/content-models/location-quotient";
import {
  buildEducationDonutSourceLine,
  buildLocationQuotientSourceLine,
  buildPopulationPyramidSourceLine,
  buildSourceLineFromYearRange,
  type DashboardTimeSeriesMetric,
  NM_STATEWIDE_BUILDING_PERMITS_METRICS,
  NM_STATEWIDE_INITIAL_CLAIMS_METRICS,
  NM_STATEWIDE_LAUS_METRICS,
  type NmStatewideChartId,
  type NmStatewideDashboardPageData,
} from "@/content-models/nm-statewide-dashboard";
import {
  buildPopulationPyramidFrames,
  getDefaultPopulationPyramidConfig,
  normalizePopulationPyramidRows,
  normalizePopulationPyramidSourceMetadata,
} from "@/content-models/population-pyramid";
import {
  type BberTableMetadataColumn,
  buildIndicatorApiUrl,
  fetchIndicatorDataset,
  normalizeMetadataColumns,
  normalizeRawRows,
  type RawRecord,
} from "@/lib/econindicators";
import {
  buildEducationDonutApiUrl,
  fetchEducationDonutResponse,
} from "@/lib/education-donut";
import {
  buildLocationQuotientApiUrl,
  fetchQcewMetadataValues,
  fetchQcewTable,
} from "@/lib/location-quotient";
import {
  buildPopulationPyramidApiUrl,
  fetchPopulationPyramidResponse,
} from "@/lib/population-pyramid";

type DownloadableBberResponse = {
  data?: unknown;
  metadata?: {
    table?: unknown;
    columns?: unknown;
  };
};

export type ChartDownloadDataset = {
  label: string;
  apiUrl: string;
  response: DownloadableBberResponse;
  dataRows: RawRecord[];
  metadataColumns: BberTableMetadataColumn[];
};

export type ChartDownloadPayload = {
  chartId: NmStatewideChartId;
  chartTitle: string;
  datasets: ChartDownloadDataset[];
};

const LOCATION_QUOTIENT_SERIES_YEAR_COUNT = 8;

const LAUS_CONFIG = {
  id: "local-area-unemployment-statistics",
  title: "Local Area Unemployment Statistics (LAUS)",
  eyebrow: "Labor",
  description:
    "Monthly labor-force conditions for New Mexico, including employment, unemployment, and the statewide unemployment rate.",
  table: "labforce",
  query: {
    stfips: "35",
    areatype: "01",
    area: "000000",
    periodtype: "03",
    adjusted: "0",
    prelim: "0",
  },
  allStartYear: 2018,
  defaultMetric: "unemprate",
  metrics: NM_STATEWIDE_LAUS_METRICS.map((metric) => ({
    ...metric,
    description: metric.label,
  })),
} satisfies EconIndicatorCardConfig;

const INITIAL_CLAIMS_CONFIG = {
  id: "unemployment-insurance-initial-claims",
  title: "Unemployment Insurance Initial Claims",
  eyebrow: "Labor",
  description: "Weekly unemployment insurance claims activity for New Mexico.",
  table: "initialclaims",
  query: {
    stfips: "35",
    areatype: "01",
    area: "000000",
  },
  allStartYear: 2018,
  dateColumn: "weekending",
  defaultMetric: "initialclaim",
  metrics: NM_STATEWIDE_INITIAL_CLAIMS_METRICS.map((metric) => ({
    ...metric,
    description: metric.label,
  })),
} satisfies EconIndicatorCardConfig;

const BUILDING_PERMITS_CONFIG = {
  id: "census-building-permits-survey",
  title: "Census Building Permits Survey",
  eyebrow: "Construction",
  description:
    "Monthly residential building permit activity and permit values for New Mexico.",
  table: "bldgprmtscensus",
  query: {
    stfips: "35",
    areatype: "01",
    area: "000000",
    periodtype: "03",
  },
  allStartYear: 2018,
  defaultMetric: "bldgs1",
  metrics: NM_STATEWIDE_BUILDING_PERMITS_METRICS.map((metric) => ({
    ...metric,
    description: metric.label,
  })),
} satisfies EconIndicatorCardConfig;

function toDownloadDataset(args: {
  label: string;
  apiUrl: string;
  response: DownloadableBberResponse;
}) {
  return {
    label: args.label,
    apiUrl: args.apiUrl,
    response: args.response,
    dataRows: normalizeRawRows(args.response.data),
    metadataColumns: normalizeMetadataColumns(args.response.metadata?.columns),
  } satisfies ChartDownloadDataset;
}

function sliceLocationQuotientFramesToRecentYears(
  frames: ReturnType<typeof buildLocationQuotientFrames>["frames"],
) {
  if (frames.length <= LOCATION_QUOTIENT_SERIES_YEAR_COUNT) {
    return frames;
  }

  return frames.slice(-LOCATION_QUOTIENT_SERIES_YEAR_COUNT);
}

async function buildLocationQuotientCard() {
  const requestConfig = getDefaultLocationQuotientConfig();
  const [
    localResponse,
    baseResponse,
    baseTimeResponse,
    localTotalResponse,
    baseTotalResponse,
    industryMetadata,
  ] = await Promise.all([
    fetchQcewTable(requestConfig.local),
    fetchQcewTable(requestConfig.base),
    fetchQcewTable(requestConfig.baseTime),
    fetchQcewTable(requestConfig.local, "00"),
    fetchQcewTable(requestConfig.base, "00"),
    fetchQcewMetadataValues(["indcode"]),
  ]);

  const sourceMetadata = normalizeLocationQuotientSourceMetadata(
    localResponse.metadata?.table,
  );
  const industryOptions = normalizeQcewMetadataOptions(
    industryMetadata,
    "indcode",
  );
  const localRows = normalizeQcewRows(localResponse.data);
  const baseRows = normalizeQcewRows(baseResponse.data);
  const baseTimeRows = normalizeQcewRows(baseTimeResponse.data);
  const localTotalRows = normalizeQcewRows(localTotalResponse.data);
  const baseTotalRows = normalizeQcewRows(baseTotalResponse.data);
  const metrics = getLocationQuotientMetricOptions().map((metric) => {
    const result = buildLocationQuotientFrames({
      localRows,
      baseRows,
      baseTimeRows,
      localTotalRows,
      baseTotalRows,
      industryOptions,
      minimumYear: requestConfig.baseTime.periodyear,
      metricKey: metric.value,
    });
    const frames = sliceLocationQuotientFramesToRecentYears(result.frames);
    const coverage = {
      ...result.coverage,
      years: frames.map((frame) => frame.year),
      startYear: frames[0]?.year ?? null,
      endYear: frames.at(-1)?.year ?? null,
    };

    return {
      ...metric,
      frames,
      coverage,
      initialYear: frames.at(-1)?.year ?? null,
    };
  });
  const defaultMetric =
    metrics.find((metric) => metric.value === "avgemp") ?? metrics[0];

  return {
    kind: "location-quotient",
    id: "location-quotient-by-industry",
    title: "Location Quotient by Industry",
    description:
      "Compare New Mexico industry specialization and growth against the United States.",
    sourceLine: buildLocationQuotientSourceLine({
      coverage: defaultMetric.coverage,
      sourceMetadata,
    }),
    download: {
      chartId: "location-quotient-by-industry",
    },
    requestConfig,
    defaultMetric: defaultMetric.value,
    baseYear: requestConfig.baseTime.periodyear,
    metrics,
  } satisfies NmStatewideDashboardPageData["cards"][number];
}

async function buildEducationDonutCard() {
  const requestConfig = getDefaultEducationDonutConfig();
  const response = await fetchEducationDonutResponse();
  const row = normalizeEducationDonutRow(response.data);
  const columns = normalizeEducationDonutColumns(response.metadata?.columns);
  const sourceMetadata = normalizeEducationDonutSourceMetadata(
    response.metadata?.table,
  );
  const chart = buildEducationDonutChartModel({
    row,
    columns,
    sourceMetadata,
  });
  const geographyLabel = row?.geographyName ?? "New Mexico";
  const yearLabel = row ? String(row.year) : requestConfig.periodyear;

  return {
    kind: "donut",
    id: "highest-level-of-educational-attainment",
    title: "Highest Level of Educational Attainment: 25 years +",
    description:
      "Educational attainment estimates for New Mexico residents ages 25 and over.",
    sourceLine: buildEducationDonutSourceLine({
      yearLabel,
      sourceMetadata,
    }),
    download: {
      chartId: "highest-level-of-educational-attainment",
    },
    totalAdults: chart.totalAdults,
    slices: chart.slices,
    yearLabel,
    geographyLabel,
  } satisfies NmStatewideDashboardPageData["cards"][number];
}

async function buildPopulationPyramidCard() {
  const requestConfig = getDefaultPopulationPyramidConfig();
  const response = await fetchPopulationPyramidResponse();
  const rows = normalizePopulationPyramidRows(response.data);
  const coverage = buildPopulationPyramidFrames(rows);
  const sourceMetadata = normalizePopulationPyramidSourceMetadata(
    response.metadata?.table,
  );

  return {
    kind: "population-pyramid",
    id: "population-pyramid-nm",
    title: "Population Pyramid NM",
    description: "Annual statewide age and sex estimates for New Mexico.",
    sourceLine: buildPopulationPyramidSourceLine({
      coverage: coverage.coverage,
      sourceMetadata,
    }),
    download: {
      chartId: "population-pyramid-nm",
    },
    requestConfig,
    initialYear: coverage.frames.at(-1)?.year ?? null,
    frames: coverage.frames,
    coverage: coverage.coverage,
  } satisfies NmStatewideDashboardPageData["cards"][number];
}

function buildYearRangeFromPoints(points: DashboardTimeSeriesMetric["points"]) {
  const firstPoint = points[0] ?? null;
  const lastPoint = points.at(-1) ?? null;

  return {
    startYear: firstPoint
      ? new Date(firstPoint.dateIso).getUTCFullYear()
      : null,
    endYear: lastPoint ? new Date(lastPoint.dateIso).getUTCFullYear() : null,
  };
}

function buildTimeSeriesPoints(
  rows: RawRecord[],
  metric: EconIndicatorCardConfig["metrics"][number],
  dateColumn: string | undefined,
) {
  const pointsByTimestamp = new Map<
    number,
    { point: DashboardTimeSeriesMetric["points"][number]; precedence: number }
  >();

  for (const record of rows) {
    const rawValue = record[metric.value];
    const value =
      typeof rawValue === "number"
        ? rawValue
        : typeof rawValue === "string" && rawValue.trim().length > 0
          ? Number(rawValue.replace(/[$,%\s,]/g, ""))
          : null;

    if (value === null || !Number.isFinite(value)) {
      continue;
    }

    const explicitDate =
      typeof record[dateColumn ?? ""] === "string"
        ? new Date(record[dateColumn ?? ""] as string)
        : typeof record.weekending === "string"
          ? new Date(record.weekending)
          : typeof record.spdate === "string"
            ? new Date(record.spdate)
            : typeof record.fileperiod === "string"
              ? new Date(record.fileperiod)
              : typeof record.wtidate === "string"
                ? new Date(record.wtidate)
                : null;
    const year =
      typeof record.periodyear === "number"
        ? record.periodyear
        : typeof record.periodyear === "string"
          ? Number(record.periodyear)
          : null;
    const period =
      typeof record.period === "number"
        ? record.period
        : typeof record.period === "string"
          ? Number(record.period)
          : 1;
    const periodType =
      typeof record.periodtype === "string" ? record.periodtype : null;
    const resolvedDate =
      explicitDate && !Number.isNaN(explicitDate.getTime())
        ? explicitDate
        : year
          ? new Date(
              Date.UTC(
                year,
                periodType === "03" || periodType === "3"
                  ? Math.max(period - 1, 0)
                  : periodType === "04" || periodType === "4"
                    ? Math.max(period - 1, 0) * 3
                    : 0,
                1,
              ),
            )
          : null;

    if (!resolvedDate || Number.isNaN(resolvedDate.getTime())) {
      continue;
    }

    const timestamp = resolvedDate.getTime();
    const periodLabel =
      periodType === "03" || periodType === "3"
        ? resolvedDate.toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
            timeZone: "UTC",
          })
        : resolvedDate.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            timeZone: "UTC",
          });
    const precedence =
      record.prelim === "0" ? 2 : record.prelim === "1" ? 1 : 0;
    const currentPoint = pointsByTimestamp.get(timestamp);

    if (currentPoint && currentPoint.precedence > precedence) {
      continue;
    }

    pointsByTimestamp.set(timestamp, {
      precedence,
      point: {
        dateIso: resolvedDate.toISOString(),
        timestamp,
        dateLabel: periodLabel,
        value,
        seriesKey: metric.value,
        seriesLabel: metric.label,
      },
    });
  }

  return [...pointsByTimestamp.values()]
    .map((entry) => entry.point)
    .sort(
      (leftPoint, rightPoint) => leftPoint.timestamp - rightPoint.timestamp,
    );
}

async function buildCompactTimeSeriesCard(config: EconIndicatorCardConfig) {
  const dataset = await fetchIndicatorDataset(config);
  const metrics = config.metrics.map((metric) => ({
    value: metric.value,
    label: metric.label,
    format: metric.format,
    yAxisLabel: metric.yAxisLabel,
    points: buildTimeSeriesPoints(
      dataset.filteredRows,
      metric,
      config.dateColumn,
    ),
  }));
  const defaultMetric =
    metrics.find((metric) => metric.value === config.defaultMetric) ??
    metrics[0];
  const yearRange = buildYearRangeFromPoints(defaultMetric?.points ?? []);
  const sourceLabel =
    config.id === "local-area-unemployment-statistics"
      ? `${dataset.source.source} - Unadjusted`
      : dataset.source.source;

  return {
    kind: "time-series",
    id: config.id as Extract<
      NmStatewideChartId,
      | "local-area-unemployment-statistics"
      | "unemployment-insurance-initial-claims"
      | "census-building-permits-survey"
    >,
    title: config.title,
    description: config.description,
    sourceLine: buildSourceLineFromYearRange({
      startYear: yearRange.startYear,
      endYear: yearRange.endYear,
      sourceLabel,
    }),
    download: {
      chartId: config.id as Extract<
        NmStatewideChartId,
        | "local-area-unemployment-statistics"
        | "unemployment-insurance-initial-claims"
        | "census-building-permits-survey"
      >,
    },
    defaultMetric: config.defaultMetric,
    metrics,
  } satisfies NmStatewideDashboardPageData["cards"][number];
}

export async function getNmStatewideDashboardPageData(): Promise<NmStatewideDashboardPageData> {
  const [
    locationQuotientCard,
    educationDonutCard,
    populationPyramidCard,
    lausCard,
    initialClaimsCard,
    buildingPermitsCard,
  ] = await Promise.all([
    buildLocationQuotientCard(),
    buildEducationDonutCard(),
    buildPopulationPyramidCard(),
    buildCompactTimeSeriesCard(LAUS_CONFIG),
    buildCompactTimeSeriesCard(INITIAL_CLAIMS_CONFIG),
    buildCompactTimeSeriesCard(BUILDING_PERMITS_CONFIG),
  ]);

  return {
    title: "New Mexico Statewide Dashboard",
    description:
      "Welcome to the New Mexico Statewide Dashboard. This dashboard provides an insightful overview of key economic indicators, including employment rates, population trends, and educational attainment across the state. Use the sidebar on the left-hand side of the screen to navigate to another page.",
    cards: [
      locationQuotientCard,
      educationDonutCard,
      populationPyramidCard,
      lausCard,
      initialClaimsCard,
      buildingPermitsCard,
    ],
  };
}

export async function getNmStatewideChartDownloadPayload(
  chartId: NmStatewideChartId,
): Promise<ChartDownloadPayload | null> {
  if (chartId === "location-quotient-by-industry") {
    const requestConfig = getDefaultLocationQuotientConfig();
    const [
      localResponse,
      baseResponse,
      baseTimeResponse,
      localTotalResponse,
      baseTotalResponse,
    ] = await Promise.all([
      fetchQcewTable(requestConfig.local),
      fetchQcewTable(requestConfig.base),
      fetchQcewTable(requestConfig.baseTime),
      fetchQcewTable(requestConfig.local, "00"),
      fetchQcewTable(requestConfig.base, "00"),
    ]);

    return {
      chartId,
      chartTitle: "Location Quotient by Industry",
      datasets: [
        toDownloadDataset({
          label: "local",
          apiUrl: buildLocationQuotientApiUrl(requestConfig.local),
          response: localResponse,
        }),
        toDownloadDataset({
          label: "base",
          apiUrl: buildLocationQuotientApiUrl(requestConfig.base),
          response: baseResponse,
        }),
        toDownloadDataset({
          label: "base-time",
          apiUrl: buildLocationQuotientApiUrl(requestConfig.baseTime),
          response: baseTimeResponse,
        }),
        toDownloadDataset({
          label: "local-total",
          apiUrl: buildLocationQuotientApiUrl(requestConfig.local, "00"),
          response: localTotalResponse,
        }),
        toDownloadDataset({
          label: "base-total",
          apiUrl: buildLocationQuotientApiUrl(requestConfig.base, "00"),
          response: baseTotalResponse,
        }),
      ],
    };
  }

  if (chartId === "highest-level-of-educational-attainment") {
    const response = await fetchEducationDonutResponse();

    return {
      chartId,
      chartTitle: "Highest Level of Educational Attainment: 25 years +",
      datasets: [
        toDownloadDataset({
          label: "education-attainment",
          apiUrl: buildEducationDonutApiUrl(),
          response,
        }),
      ],
    };
  }

  if (chartId === "population-pyramid-nm") {
    const response = await fetchPopulationPyramidResponse();

    return {
      chartId,
      chartTitle: "Population Pyramid NM",
      datasets: [
        toDownloadDataset({
          label: "population-pyramid",
          apiUrl: buildPopulationPyramidApiUrl(),
          response,
        }),
      ],
    };
  }

  const config =
    chartId === "local-area-unemployment-statistics"
      ? LAUS_CONFIG
      : chartId === "unemployment-insurance-initial-claims"
        ? INITIAL_CLAIMS_CONFIG
        : chartId === "census-building-permits-survey"
          ? BUILDING_PERMITS_CONFIG
          : null;

  if (!config) {
    return null;
  }

  const dataset = await fetchIndicatorDataset(config);

  return {
    chartId,
    chartTitle: config.title,
    datasets: [
      {
        label: "series",
        apiUrl: buildIndicatorApiUrl(config),
        response: dataset.response,
        dataRows: dataset.filteredRows,
        metadataColumns: dataset.metadataColumns,
      },
    ],
  };
}
