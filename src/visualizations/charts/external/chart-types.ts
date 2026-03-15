import type {
  EconIndicatorLinePoint,
  IndicatorFormatKind,
} from "@/content-models/econindicators";
import type {
  ExternalChartPoint,
  ExternalChartUnit,
} from "@/content-models/external-bber";

export type ExternalChartRendererProps = {
  ariaLabel: string;
  data: ExternalChartPoint[];
  unit: ExternalChartUnit;
  yAxisLabel: string;
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

export type LineGraphRendererProps = {
  ariaLabel: string;
  data: EconIndicatorLinePoint[];
  formatKind: IndicatorFormatKind;
  yAxisLabel: string;
};
