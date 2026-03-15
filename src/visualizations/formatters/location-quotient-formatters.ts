import type {
  LocationQuotientFrame,
  LocationQuotientPoint,
} from "@/content-models/location-quotient";
import { formatTimeSeriesValue } from "@/visualizations/formatters/external-chart-formatters";

const DECIMAL_FORMATTER = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const PERCENT_FORMATTER = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export function formatLocationQuotientValue(value: number) {
  return DECIMAL_FORMATTER.format(value);
}

export function formatLocationQuotientTick(value: number) {
  return DECIMAL_FORMATTER.format(value);
}

export function formatGrowthPercent(value: number) {
  return `${PERCENT_FORMATTER.format(value * 100)}%`;
}

export function formatLocationQuotientMetricValue(
  point: LocationQuotientPoint,
) {
  return formatTimeSeriesValue(point.localValue, point.formatKind, true);
}

export function formatLocationQuotientShare(value: number) {
  return formatGrowthPercent(value);
}

export function formatEmploymentCount(value: number) {
  return formatTimeSeriesValue(value, "count", true);
}

export function formatEmploymentShare(value: number) {
  return formatLocationQuotientShare(value);
}

export function buildLocationQuotientTooltip(point: LocationQuotientPoint) {
  return [
    `${point.industryLabel} · ${point.yearLabel}`,
    `LQ: ${formatLocationQuotientValue(point.locationQuotient)}`,
    `Growth since base year: ${formatGrowthPercent(point.growthSinceBaseYear)}`,
    `Local ${point.metricLabel}: ${formatTimeSeriesValue(point.localValue, point.formatKind, true)}`,
    `Local share: ${formatLocationQuotientShare(point.localShare)}`,
    `Reference share: ${formatLocationQuotientShare(point.baseShare)}`,
  ].join("\n");
}

export function buildLocationQuotientFrameSummary(
  frame: LocationQuotientFrame,
  baseYear: number,
) {
  if (frame.points.length === 0) {
    return `No industries could be plotted for ${frame.yearLabel} after validating the QCEW comparison inputs.`;
  }

  const highestQuotientPoint = [...frame.points].sort(
    (leftPoint, rightPoint) =>
      rightPoint.locationQuotient - leftPoint.locationQuotient,
  )[0];
  const fastestGrowthPoint = [...frame.points].sort(
    (leftPoint, rightPoint) =>
      rightPoint.growthSinceBaseYear - leftPoint.growthSinceBaseYear,
  )[0];
  const largestEmploymentPoint = [...frame.points].sort(
    (leftPoint, rightPoint) => rightPoint.bubbleSize - leftPoint.bubbleSize,
  )[0];

  return `${highestQuotientPoint.industryLabel} shows the highest specialization in ${frame.yearLabel} at an LQ of ${formatLocationQuotientValue(highestQuotientPoint.locationQuotient)}. ${fastestGrowthPoint.industryLabel} has the strongest local growth since ${baseYear} at ${formatGrowthPercent(fastestGrowthPoint.growthSinceBaseYear)}. ${largestEmploymentPoint.industryLabel} is the largest plotted local industry at ${formatLocationQuotientMetricValue(largestEmploymentPoint)}.`;
}
