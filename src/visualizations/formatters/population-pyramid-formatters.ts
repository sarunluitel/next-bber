import type {
  PopulationPyramidBand,
  PopulationPyramidFrame,
} from "@/content-models/population-pyramid";

export function formatPopulationCount(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatCompactPopulation(value: number) {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(value >= 10_000_000 ? 0 : 1)}M`;
  }

  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(value >= 100_000 ? 0 : 1)}k`;
  }

  return formatPopulationCount(value);
}

export function buildPopulationPyramidTooltip(
  band: PopulationPyramidBand,
  yearLabel: string,
) {
  return [
    `${yearLabel} · Ages ${band.ageGroupLabel}`,
    `Male: ${formatPopulationCount(band.malePopulation)}`,
    `Female: ${formatPopulationCount(band.femalePopulation)}`,
    `Total: ${formatPopulationCount(band.totalPopulation)}`,
  ].join("\n");
}

export function buildPopulationPyramidFrameSummary(
  frame: PopulationPyramidFrame,
) {
  const femaleShare =
    frame.totalPopulation > 0
      ? (frame.femalePopulation / frame.totalPopulation) * 100
      : 0;

  return `${frame.yearLabel} population totals ${formatPopulationCount(frame.totalPopulation)} people. The largest age band is ${frame.largestBandLabel}, and females account for ${femaleShare.toFixed(1)}% of the total population.`;
}
