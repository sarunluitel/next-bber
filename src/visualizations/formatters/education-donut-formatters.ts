import type { EducationDonutChartModel } from "@/content-models/education-donut";

const COUNT_FORMATTER = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});

const PERCENT_FORMATTER = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export function formatEducationDonutCount(value: number) {
  return COUNT_FORMATTER.format(value);
}

export function formatEducationDonutShare(value: number) {
  return `${PERCENT_FORMATTER.format(value * 100)}%`;
}

export function buildEducationDonutAccessibilityLabel(
  chart: EducationDonutChartModel,
) {
  if (chart.slices.length === 0) {
    return chart.summary;
  }

  const topSlice = chart.slices[0];

  return `${chart.summary} Total adults 25 years and over: ${formatEducationDonutCount(chart.totalAdults)}. First legend item: ${topSlice.label}, ${formatEducationDonutShare(topSlice.share)}.`;
}
