export type ExternalChartUnit = "percent" | "minutes";

export type ExternalChartMetricOption = {
  value: string;
  label: string;
  unit: ExternalChartUnit;
  marginOfErrorKey?: string;
  description: string;
};

export type ExternalChartOption = {
  value: string;
  label: string;
};

export type ExternalChartFilters = {
  metric: string;
  areatype: string;
  area: string;
  periodtype: string;
};

export type ExternalChartPoint = {
  year: number;
  yearLabel: string;
  estimate: number;
  marginOfError: number | null;
  metricKey: string;
  metricLabel: string;
  unit: ExternalChartUnit;
  geographyLabel: string;
  periodLabel: string;
};

export type ExternalChartSourceMetadata = {
  tableName: string;
  tableTitle: string;
  tableDescription: string;
  source: string;
  purpose: string;
  referenceTime: string;
  releaseSchedule: string;
  updatedAt: string | null;
};

export type ExternalChartModel = {
  chartTitle: string;
  chartSubtitle: string;
  summary: string;
  yAxisLabel: string;
  unit: ExternalChartUnit;
  points: ExternalChartPoint[];
  notes: string[];
};

export type ExternalChartPageData = {
  filters: ExternalChartFilters;
  metricOptions: ExternalChartMetricOption[];
  geographyTypeOptions: ExternalChartOption[];
  geographyOptions: ExternalChartOption[];
  periodOptions: ExternalChartOption[];
  chart: ExternalChartModel;
  sourceMetadata: ExternalChartSourceMetadata;
};

const DEFAULT_METRIC_KEY = "worker16p_commutetowork_wfh_total_e";
const DEFAULT_AREATYPE = "01";
const DEFAULT_AREA = "000000";
const DEFAULT_PERIODTYPE = "60";

export const EXTERNAL_S0801_METRICS = [
  {
    value: "worker16p_commutetowork_wfh_total_e",
    label: "Worked from Home Share",
    unit: "percent",
    marginOfErrorKey: "worker16p_commutetowork_wfh_total_m",
    description: "Share of workers 16 years and over who worked from home.",
  },
  {
    value: "worker16p_commutetowork_cartrkvan_alone_total_e",
    label: "Drove Alone Share",
    unit: "percent",
    marginOfErrorKey: "worker16p_commutetowork_cartrkvan_alone_total_m",
    description: "Share of workers 16 years and over who drove alone to work.",
  },
  {
    value: "worker16p_commutetowork_cartrkvan_carpooled_total_e",
    label: "Carpooled Share",
    unit: "percent",
    marginOfErrorKey: "worker16p_commutetowork_cartrkvan_carpooled_total_m",
    description: "Share of workers 16 years and over who carpooled to work.",
  },
  {
    value: "worker16p_commutetowork_walked_total_e",
    label: "Walked Share",
    unit: "percent",
    marginOfErrorKey: "worker16p_commutetowork_walked_total_m",
    description: "Share of workers 16 years and over who walked to work.",
  },
  {
    value: "worker16p_commutetowork_publicnotaxi_total_e",
    label: "Public Transportation Share",
    unit: "percent",
    marginOfErrorKey: "worker16p_commutetowork_publicnotaxi_total_m",
    description:
      "Share of workers 16 years and over using public transportation, excluding taxicab.",
  },
  {
    value: "worker16pnowfh_ttimewrk_meanttimewrkmin_total_e",
    label: "Mean Travel Time",
    unit: "minutes",
    marginOfErrorKey: "worker16pnowfh_ttimewrk_meanttimewrkmin_total_m",
    description:
      "Mean travel time to work in minutes for workers who did not work from home.",
  },
] satisfies ExternalChartMetricOption[];

function getStringValue(
  record: Record<string, unknown>,
  key: string,
): string | null {
  const value = record[key];

  if (typeof value !== "string") {
    return null;
  }

  const trimmedValue = value.trim();
  return trimmedValue.length > 0 ? trimmedValue : null;
}

export function getDefaultExternalChartFilters(): ExternalChartFilters {
  return {
    metric: DEFAULT_METRIC_KEY,
    areatype: DEFAULT_AREATYPE,
    area: DEFAULT_AREA,
    periodtype: DEFAULT_PERIODTYPE,
  };
}

export function getExternalMetricOption(
  metricKey: string,
): ExternalChartMetricOption {
  return (
    EXTERNAL_S0801_METRICS.find((metric) => metric.value === metricKey) ??
    EXTERNAL_S0801_METRICS[0]
  );
}

export function normalizeExternalChartFilters(
  rawSearchParams: Record<string, string | string[] | undefined>,
): ExternalChartFilters {
  const defaults = getDefaultExternalChartFilters();

  return {
    metric:
      typeof rawSearchParams.metric === "string"
        ? rawSearchParams.metric
        : defaults.metric,
    areatype:
      typeof rawSearchParams.areatype === "string"
        ? rawSearchParams.areatype
        : defaults.areatype,
    area:
      typeof rawSearchParams.area === "string"
        ? rawSearchParams.area
        : defaults.area,
    periodtype:
      typeof rawSearchParams.periodtype === "string"
        ? rawSearchParams.periodtype
        : defaults.periodtype,
  };
}

export function normalizeExternalChartOptions(
  rawValues: unknown,
  variableKey: string,
): ExternalChartOption[] {
  if (!Array.isArray(rawValues)) {
    return [];
  }

  const seenValues = new Set<string>();
  const options: ExternalChartOption[] = [];

  for (const rawValue of rawValues) {
    if (!rawValue || typeof rawValue !== "object") {
      continue;
    }

    const record = rawValue as Record<string, unknown>;
    const value = getStringValue(record, variableKey);

    if (!value || seenValues.has(value)) {
      continue;
    }

    const displayName = getStringValue(record, "displayname") ?? value;
    options.push({ value, label: displayName });
    seenValues.add(value);
  }

  return options;
}

export function sortYearOptions(
  yearOptions: ExternalChartOption[],
): ExternalChartOption[] {
  return [...yearOptions].sort((leftOption, rightOption) => {
    return Number(leftOption.value) - Number(rightOption.value);
  });
}

export function sanitizeExternalChartValue(
  requestedValue: string,
  options: ExternalChartOption[],
  preferredFallback: string,
): string {
  if (options.some((option) => option.value === requestedValue)) {
    return requestedValue;
  }

  if (options.some((option) => option.value === preferredFallback)) {
    return preferredFallback;
  }

  return options[0]?.value ?? preferredFallback;
}

export function buildGeographyLabel(
  areaLabel: string,
  geographyTypeLabel: string,
): string {
  if (areaLabel === geographyTypeLabel) {
    return areaLabel;
  }

  return `${areaLabel} (${geographyTypeLabel})`;
}

function getNumberValue(
  record: Record<string, unknown>,
  key: string,
): number | null {
  const value = record[key];

  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsedValue = Number(value);
    return Number.isFinite(parsedValue) ? parsedValue : null;
  }

  return null;
}

export function normalizeExternalChartPoints(
  rawRows: unknown,
  metric: ExternalChartMetricOption,
  geographyLabel: string,
  periodLabel: string,
): ExternalChartPoint[] {
  if (!Array.isArray(rawRows)) {
    return [];
  }

  const points: ExternalChartPoint[] = [];

  for (const rawRow of rawRows) {
    if (!rawRow || typeof rawRow !== "object") {
      continue;
    }

    const record = rawRow as Record<string, unknown>;
    const year = getNumberValue(record, "periodyear");
    const estimate = getNumberValue(record, metric.value);

    if (!year || estimate === null) {
      continue;
    }

    points.push({
      year,
      yearLabel: String(year),
      estimate,
      marginOfError: metric.marginOfErrorKey
        ? getNumberValue(record, metric.marginOfErrorKey)
        : null,
      metricKey: metric.value,
      metricLabel: metric.label,
      unit: metric.unit,
      geographyLabel,
      periodLabel,
    });
  }

  return points.sort(
    (leftPoint, rightPoint) => leftPoint.year - rightPoint.year,
  );
}

export function normalizeExternalChartSourceMetadata(
  rawValue: unknown,
): ExternalChartSourceMetadata {
  const record =
    rawValue && typeof rawValue === "object"
      ? (rawValue as Record<string, unknown>)
      : {};

  return {
    tableName: getStringValue(record, "table_name") ?? "s0801",
    tableTitle: getStringValue(record, "data_title") ?? "S0801",
    tableDescription:
      getStringValue(record, "data_description") ??
      "This dataset contains one row for each geography and year.",
    source:
      getStringValue(record, "source") ??
      "US Census Bureau American Community Survey",
    purpose: getStringValue(record, "purpose") ?? "",
    referenceTime: getStringValue(record, "reference_time") ?? "",
    releaseSchedule: getStringValue(record, "release_schedule") ?? "",
    updatedAt: getStringValue(record, "updated"),
  };
}
