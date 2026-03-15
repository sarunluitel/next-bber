import type {
  ExternalChartPoint,
  ExternalChartUnit,
} from "@/content-models/external-bber";
import type {
  TimeSeriesPoint,
  ValueFormatKind,
} from "@/visualizations/chart-contracts";

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
  data: TimeSeriesPoint[];
  formatKind: ValueFormatKind;
  yAxisLabel: string;
};
