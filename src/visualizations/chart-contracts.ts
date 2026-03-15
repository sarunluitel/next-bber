export type ValueFormatKind =
  | "count"
  | "percent"
  | "currency"
  | "decimal"
  | "index";

export type TimeSeriesPoint = {
  dateIso: string;
  timestamp: number;
  dateLabel: string;
  value: number;
  seriesKey: string;
  seriesLabel: string;
};
