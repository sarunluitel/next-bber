import "server-only";

import {
  buildGeographyLabel,
  EXTERNAL_S0801_METRICS,
  type ExternalChartPageData,
  getDefaultExternalChartFilters,
  getExternalMetricOption,
  normalizeExternalChartFilters,
  normalizeExternalChartOptions,
  normalizeExternalChartPoints,
  normalizeExternalChartSourceMetadata,
  sanitizeExternalChartValue,
  sortYearOptions,
} from "@/content-models/external-bber";
import type { ExternalChartModel } from "@/visualizations/charts/external/chart-types";

const BBER_REST_ENDPOINT = "https://api.bber.unm.edu/api/data/rest/bbertable";
const BBER_METADATA_ENDPOINT =
  "https://api.bber.unm.edu/api/data/rest/metadata";
const DEFAULT_STFIPS = "35";

type BberTableResponse = {
  data?: unknown;
  metadata?: {
    table?: unknown;
  };
};

async function fetchExternalBberJson(
  endpoint: string,
  searchParams?: URLSearchParams,
) {
  const url = searchParams?.size
    ? `${endpoint}?${searchParams.toString()}`
    : endpoint;

  const response = await fetch(url, {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(
      `External BBER request failed with status ${response.status}.`,
    );
  }

  return response.json();
}

async function fetchS0801MetadataValues(variableKeys: string[]) {
  return fetchExternalBberJson(
    BBER_METADATA_ENDPOINT,
    new URLSearchParams({
      api: "tablevalues",
      table: "s0801",
      variables: `[${variableKeys.join(",")}]`,
    }),
  );
}

async function fetchS0801AreaValues(areatype: string) {
  return fetchExternalBberJson(
    BBER_METADATA_ENDPOINT,
    new URLSearchParams({
      api: "tablevalues",
      table: "s0801",
      variables: "[area]",
      stfips: DEFAULT_STFIPS,
      areatype,
    }),
  );
}

async function fetchS0801ChartData(options: {
  areatype: string;
  area: string;
  metricKey: string;
  marginOfErrorKey?: string;
  periodtype: string;
  years: string[];
}) {
  const variables = [options.metricKey, options.marginOfErrorKey]
    .filter((value): value is string => Boolean(value))
    .join(",");

  const searchParams = new URLSearchParams({
    table: "s0801",
    variables,
    stfips: DEFAULT_STFIPS,
    areatype: options.areatype,
    area: options.area,
    periodtype: options.periodtype,
    periodyear: options.years.join(","),
  });

  return fetchExternalBberJson(
    BBER_REST_ENDPOINT,
    searchParams,
  ) as Promise<BberTableResponse>;
}

function buildChartNotes({
  periodLabel,
  sourceLabel,
  referenceTime,
}: {
  periodLabel: string;
  sourceLabel: string;
  referenceTime: string;
}) {
  const notes = [`Source: ${sourceLabel}.`];

  if (periodLabel) {
    notes.push(`Series uses ${periodLabel.toLowerCase()}.`);
  }

  if (referenceTime) {
    notes.push(`Reference time: ${referenceTime}.`);
  }

  return notes;
}

function buildChartModel(options: {
  metricLabel: string;
  metricDescription: string;
  geographyLabel: string;
  periodLabel: string;
  points: ReturnType<typeof normalizeExternalChartPoints>;
  unit: ExternalChartModel["unit"];
  sourceLabel: string;
  referenceTime: string;
}): ExternalChartModel {
  return {
    chartTitle: `${options.metricLabel} Over Time`,
    chartSubtitle: `${options.geographyLabel} · ${options.periodLabel}`,
    summary: options.metricDescription,
    yAxisLabel:
      options.unit === "minutes" ? "Minutes" : "Share of workers (percent)",
    unit: options.unit,
    points: options.points,
    notes: buildChartNotes({
      periodLabel: options.periodLabel,
      sourceLabel: options.sourceLabel,
      referenceTime: options.referenceTime,
    }),
  };
}

export async function getExternalS0801PageData(
  rawSearchParams: Record<string, string | string[] | undefined>,
): Promise<ExternalChartPageData> {
  const requestedFilters = normalizeExternalChartFilters(rawSearchParams);
  const metadataValues = await fetchS0801MetadataValues([
    "stfips",
    "areatype",
    "periodyear",
    "periodtype",
  ]);

  const geographyTypeOptions = normalizeExternalChartOptions(
    metadataValues,
    "areatype",
  );
  const periodOptions = normalizeExternalChartOptions(
    metadataValues,
    "periodtype",
  );
  const yearOptions = sortYearOptions(
    normalizeExternalChartOptions(metadataValues, "periodyear"),
  );

  if (geographyTypeOptions.length === 0 || periodOptions.length === 0) {
    throw new Error(
      "S0801 metadata did not include the expected selector values.",
    );
  }

  const filtersWithDefaults = getDefaultExternalChartFilters();
  const selectedMetric = getExternalMetricOption(requestedFilters.metric);
  const selectedAreatype = sanitizeExternalChartValue(
    requestedFilters.areatype,
    geographyTypeOptions,
    filtersWithDefaults.areatype,
  );
  const selectedPeriodtype = sanitizeExternalChartValue(
    requestedFilters.periodtype,
    periodOptions,
    filtersWithDefaults.periodtype,
  );

  const geographyOptions = normalizeExternalChartOptions(
    await fetchS0801AreaValues(selectedAreatype),
    "area",
  );

  if (geographyOptions.length === 0) {
    throw new Error(
      "S0801 metadata did not include any geographies for the selected type.",
    );
  }

  const selectedArea = sanitizeExternalChartValue(
    requestedFilters.area,
    geographyOptions,
    filtersWithDefaults.area,
  );

  if (yearOptions.length === 0) {
    throw new Error("S0801 metadata did not include any available years.");
  }

  const chartResponse = await fetchS0801ChartData({
    areatype: selectedAreatype,
    area: selectedArea,
    metricKey: selectedMetric.value,
    marginOfErrorKey: selectedMetric.marginOfErrorKey,
    periodtype: selectedPeriodtype,
    years: yearOptions.map((yearOption) => yearOption.value),
  });

  const geographyTypeLabel =
    geographyTypeOptions.find((option) => option.value === selectedAreatype)
      ?.label ?? selectedAreatype;
  const geographyLabel =
    geographyOptions.find((option) => option.value === selectedArea)?.label ??
    selectedArea;
  const periodLabel =
    periodOptions.find((option) => option.value === selectedPeriodtype)
      ?.label ?? selectedPeriodtype;
  const sourceMetadata = normalizeExternalChartSourceMetadata(
    chartResponse.metadata?.table,
  );
  const chartPoints = normalizeExternalChartPoints(
    chartResponse.data,
    selectedMetric,
    buildGeographyLabel(geographyLabel, geographyTypeLabel),
    periodLabel,
  );

  return {
    filters: {
      metric: selectedMetric.value,
      areatype: selectedAreatype,
      area: selectedArea,
      periodtype: selectedPeriodtype,
    },
    metricOptions: EXTERNAL_S0801_METRICS,
    geographyTypeOptions,
    geographyOptions,
    periodOptions,
    chart: buildChartModel({
      metricLabel: selectedMetric.label,
      metricDescription: selectedMetric.description,
      geographyLabel: buildGeographyLabel(geographyLabel, geographyTypeLabel),
      periodLabel,
      points: chartPoints,
      unit: selectedMetric.unit,
      sourceLabel: sourceMetadata.source,
      referenceTime: sourceMetadata.referenceTime,
    }),
    sourceMetadata,
  };
}
