import type {
  ExternalChartPoint,
  ExternalChartUnit,
} from "@/content-models/external-bber";
import type {
  TimeSeriesPoint,
  ValueFormatKind,
} from "@/visualizations/chart-contracts";

const PERCENT_VALUE_FORMATTER = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const MINUTES_VALUE_FORMATTER = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const INTEGER_YEAR_FORMATTER = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});

function getNumericFormatter(unit: ExternalChartUnit) {
  return unit === "minutes" ? MINUTES_VALUE_FORMATTER : PERCENT_VALUE_FORMATTER;
}

export function formatExternalChartValue(
  value: number,
  unit: ExternalChartUnit,
) {
  const formattedValue = getNumericFormatter(unit).format(value);
  return unit === "minutes" ? `${formattedValue} min` : `${formattedValue}%`;
}

export function formatExternalChartTick(
  value: number,
  unit: ExternalChartUnit,
) {
  if (unit === "minutes") {
    return INTEGER_YEAR_FORMATTER.format(value);
  }

  return `${INTEGER_YEAR_FORMATTER.format(value)}%`;
}

export function formatExternalChartMarginOfError(
  value: number | null,
  unit: ExternalChartUnit,
) {
  if (value === null) {
    return "Not reported";
  }

  return formatExternalChartValue(value, unit);
}

export function buildExternalChartTooltip(point: ExternalChartPoint) {
  return [
    `${point.metricLabel} · ${point.yearLabel}`,
    `Estimate: ${formatExternalChartValue(point.estimate, point.unit)}`,
    `Margin of error: ${formatExternalChartMarginOfError(point.marginOfError, point.unit)}`,
    `Geography: ${point.geographyLabel}`,
    `Period: ${point.periodLabel}`,
  ].join("\n");
}

export function buildExternalTrendSummary(points: ExternalChartPoint[]) {
  if (points.length === 0) {
    return "No published values are available for the current selection.";
  }

  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];

  if (points.length === 1) {
    return `${firstPoint.metricLabel} is ${formatExternalChartValue(firstPoint.estimate, firstPoint.unit)} in ${firstPoint.yearLabel} for ${firstPoint.geographyLabel}.`;
  }

  let direction = "changed";

  if (lastPoint.estimate > firstPoint.estimate) {
    direction = "increased";
  } else if (lastPoint.estimate < firstPoint.estimate) {
    direction = "decreased";
  }

  return `${lastPoint.metricLabel} ${direction} from ${formatExternalChartValue(firstPoint.estimate, firstPoint.unit)} in ${firstPoint.yearLabel} to ${formatExternalChartValue(lastPoint.estimate, lastPoint.unit)} in ${lastPoint.yearLabel} for ${lastPoint.geographyLabel}.`;
}

export function formatExternalAsOfDate(value: string | null) {
  if (!value) {
    return "Not reported";
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return parsedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

const COUNT_VALUE_FORMATTER = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});

const COUNT_COMPACT_FORMATTER = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const CURRENCY_VALUE_FORMATTER = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const CURRENCY_COMPACT_FORMATTER = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});

const DECIMAL_VALUE_FORMATTER = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export function formatTimeSeriesValue(
  value: number,
  formatKind: ValueFormatKind,
  detailed = false,
) {
  if (formatKind === "percent") {
    return `${DECIMAL_VALUE_FORMATTER.format(value)}%`;
  }

  if (formatKind === "currency") {
    return detailed
      ? CURRENCY_VALUE_FORMATTER.format(value)
      : CURRENCY_COMPACT_FORMATTER.format(value);
  }

  if (formatKind === "count") {
    return detailed
      ? COUNT_VALUE_FORMATTER.format(value)
      : COUNT_COMPACT_FORMATTER.format(value);
  }

  if (formatKind === "index") {
    return DECIMAL_VALUE_FORMATTER.format(value);
  }

  return DECIMAL_VALUE_FORMATTER.format(value);
}

export function formatTimeSeriesTick(
  value: number,
  formatKind: ValueFormatKind,
) {
  if (formatKind === "currency") {
    return CURRENCY_COMPACT_FORMATTER.format(value);
  }

  if (formatKind === "count") {
    return COUNT_COMPACT_FORMATTER.format(value);
  }

  if (formatKind === "percent") {
    return `${Math.round(value)}%`;
  }

  return DECIMAL_VALUE_FORMATTER.format(value);
}

export function buildTimeSeriesTooltip(
  point: TimeSeriesPoint,
  formatKind: ValueFormatKind,
) {
  return [
    `${point.seriesLabel}`,
    `Date: ${point.dateLabel}`,
    `Value: ${formatTimeSeriesValue(point.value, formatKind, true)}`,
  ].join("\n");
}

export function buildTimeSeriesTrendSummary(
  points: TimeSeriesPoint[],
  label: string,
  formatKind: ValueFormatKind,
) {
  // Keep summary copy derived from the current series so it stays correct when
  // upstream loader scripts refresh the underlying data.
  if (points.length === 0) {
    return "No published values are available for the current time window.";
  }

  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];

  if (points.length === 1) {
    return `${label} is ${formatTimeSeriesValue(lastPoint.value, formatKind, true)} on ${lastPoint.dateLabel}.`;
  }

  let direction = "changed";

  if (lastPoint.value > firstPoint.value) {
    direction = "increased";
  } else if (lastPoint.value < firstPoint.value) {
    direction = "decreased";
  }

  return `${label} ${direction} from ${formatTimeSeriesValue(firstPoint.value, formatKind, true)} on ${firstPoint.dateLabel} to ${formatTimeSeriesValue(lastPoint.value, formatKind, true)} on ${lastPoint.dateLabel}.`;
}
