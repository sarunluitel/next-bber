import type {
  EducationDonutSlice,
  EducationDonutSourceMetadata,
} from "@/content-models/education-donut";
import type {
  LocationQuotientCoverage,
  LocationQuotientFrame,
  LocationQuotientMetricKey,
  LocationQuotientMetricOption,
  LocationQuotientRequestConfig,
  LocationQuotientSourceMetadata,
} from "@/content-models/location-quotient";
import type {
  PopulationPyramidCoverage,
  PopulationPyramidFrame,
  PopulationPyramidRequestConfig,
  PopulationPyramidSourceMetadata,
} from "@/content-models/population-pyramid";
import type {
  TimeSeriesPoint,
  ValueFormatKind,
} from "@/visualizations/chart-contracts";

export type DashboardDownloadHandle = {
  chartId: NmStatewideChartId;
};

export type DashboardTimeSeriesMetric = {
  value: string;
  label: string;
  format: ValueFormatKind;
  yAxisLabel: string;
  points: TimeSeriesPoint[];
};

export type DashboardTimeSeriesCard = {
  kind: "time-series";
  id: Extract<
    NmStatewideChartId,
    | "local-area-unemployment-statistics"
    | "unemployment-insurance-initial-claims"
    | "census-building-permits-survey"
  >;
  title: string;
  description: string;
  sourceLine: string;
  download: DashboardDownloadHandle;
  defaultMetric: string;
  metrics: DashboardTimeSeriesMetric[];
};

export type DashboardLocationQuotientMetric = LocationQuotientMetricOption & {
  frames: LocationQuotientFrame[];
  coverage: LocationQuotientCoverage;
  initialYear: number | null;
};

export type DashboardLocationQuotientCard = {
  kind: "location-quotient";
  id: "location-quotient-by-industry";
  title: string;
  description: string;
  sourceLine: string;
  download: DashboardDownloadHandle;
  requestConfig: LocationQuotientRequestConfig;
  defaultMetric: LocationQuotientMetricKey;
  baseYear: number;
  metrics: DashboardLocationQuotientMetric[];
};

export type DashboardPopulationPyramidCard = {
  kind: "population-pyramid";
  id: "population-pyramid-nm";
  title: string;
  description: string;
  sourceLine: string;
  download: DashboardDownloadHandle;
  requestConfig: PopulationPyramidRequestConfig;
  initialYear: number | null;
  frames: PopulationPyramidFrame[];
  coverage: PopulationPyramidCoverage;
};

export type DashboardEducationDonutCard = {
  kind: "donut";
  id: "highest-level-of-educational-attainment";
  title: string;
  description: string;
  sourceLine: string;
  download: DashboardDownloadHandle;
  totalAdults: number;
  slices: EducationDonutSlice[];
  yearLabel: string;
  geographyLabel: string;
};

export type NmStatewideChartCard =
  | DashboardLocationQuotientCard
  | DashboardEducationDonutCard
  | DashboardPopulationPyramidCard
  | DashboardTimeSeriesCard;

export type NmStatewideChartId =
  | "location-quotient-by-industry"
  | "highest-level-of-educational-attainment"
  | "population-pyramid-nm"
  | "local-area-unemployment-statistics"
  | "unemployment-insurance-initial-claims"
  | "census-building-permits-survey";

export type NmStatewideDashboardPageData = {
  title: string;
  description: string;
  cards: NmStatewideChartCard[];
};

export const NM_STATEWIDE_CHART_IDS = [
  "location-quotient-by-industry",
  "highest-level-of-educational-attainment",
  "population-pyramid-nm",
  "local-area-unemployment-statistics",
  "unemployment-insurance-initial-claims",
  "census-building-permits-survey",
] satisfies NmStatewideChartId[];

export const NM_STATEWIDE_LAUS_METRICS = [
  {
    value: "labforce",
    label: "Labor Force",
    format: "count",
    yAxisLabel: "People",
  },
  {
    value: "emplab",
    label: "Employement",
    format: "count",
    yAxisLabel: "People",
  },
  {
    value: "unemp",
    label: "Unemployment",
    format: "count",
    yAxisLabel: "People",
  },
  {
    value: "unemprate",
    label: "Unemployment Rate",
    format: "percent",
    yAxisLabel: "Percent",
  },
] satisfies Omit<DashboardTimeSeriesMetric, "points">[];

export const NM_STATEWIDE_INITIAL_CLAIMS_METRICS = [
  {
    value: "initialclaim",
    label: "Number of initial claims",
    format: "count",
    yAxisLabel: "Claims",
  },
  {
    value: "cclaims",
    label: "Continued Claims",
    format: "count",
    yAxisLabel: "Claims",
  },
  {
    value: "coveremp",
    label: "Covered Employment",
    format: "count",
    yAxisLabel: "People",
  },
  {
    value: "insured",
    label: "Insured unemployment rate",
    format: "percent",
    yAxisLabel: "Percent",
  },
] satisfies Omit<DashboardTimeSeriesMetric, "points">[];

export const NM_STATEWIDE_BUILDING_PERMITS_METRICS = [
  {
    value: "bldgs1",
    label: "Permits Bldg 1 unit",
    format: "count",
    yAxisLabel: "Permits",
  },
  {
    value: "units1",
    label: "Units Single",
    format: "count",
    yAxisLabel: "Units",
  },
  {
    value: "value1",
    label: "Value of Permits",
    format: "currency",
    yAxisLabel: "Dollars",
  },
  {
    value: "bldgs2",
    label: "Permits Bldg 2 units",
    format: "count",
    yAxisLabel: "Permits",
  },
  { value: "units2", label: "Units (2)", format: "count", yAxisLabel: "Units" },
  {
    value: "value2",
    label: "Value of Permits 2 units",
    format: "currency",
    yAxisLabel: "Dollars",
  },
  {
    value: "bldgs34",
    label: "bldgs34",
    format: "count",
    yAxisLabel: "Permits",
  },
  {
    value: "units34",
    label: "Number of units 3-4",
    format: "count",
    yAxisLabel: "Units",
  },
  {
    value: "value34",
    label: "Value of 3 to 4 Units",
    format: "currency",
    yAxisLabel: "Dollars",
  },
  {
    value: "bldgs5",
    label: "Permits Bldg 5+",
    format: "count",
    yAxisLabel: "Permits",
  },
  {
    value: "units5",
    label: "Number of units 5+",
    format: "count",
    yAxisLabel: "Units",
  },
  {
    value: "value5",
    label: "Value of 5+",
    format: "currency",
    yAxisLabel: "Dollars",
  },
  {
    value: "bldgs1r",
    label: "bldgs1r",
    format: "count",
    yAxisLabel: "Permits",
  },
  { value: "units1r", label: "units1r", format: "count", yAxisLabel: "Units" },
  {
    value: "value1r",
    label: "value1r",
    format: "currency",
    yAxisLabel: "Dollars",
  },
  {
    value: "bldgs2r",
    label: "bldgs2r",
    format: "count",
    yAxisLabel: "Permits",
  },
  { value: "units2r", label: "units2r", format: "count", yAxisLabel: "Units" },
  {
    value: "value2r",
    label: "value2r",
    format: "currency",
    yAxisLabel: "Dollars",
  },
  {
    value: "bldgs34r",
    label: "bldgs34r",
    format: "count",
    yAxisLabel: "Permits",
  },
  {
    value: "units34r",
    label: "units34r",
    format: "count",
    yAxisLabel: "Units",
  },
  {
    value: "value34r",
    label: "value34r",
    format: "currency",
    yAxisLabel: "Dollars",
  },
  {
    value: "bldgs5r",
    label: "bldgs5r",
    format: "count",
    yAxisLabel: "Permits",
  },
  { value: "units5r", label: "units5r", format: "count", yAxisLabel: "Units" },
  {
    value: "value5r",
    label: "value5r",
    format: "currency",
    yAxisLabel: "Dollars",
  },
] satisfies Omit<DashboardTimeSeriesMetric, "points">[];

export function buildSourceLineFromYearRange(args: {
  startYear: number | null;
  endYear: number | null;
  sourceLabel: string;
}) {
  if (args.startYear && args.endYear) {
    if (args.startYear === args.endYear) {
      return `Data Source: ${args.endYear} ${args.sourceLabel}`;
    }

    return `Data Source: ${args.startYear}-${args.endYear} ${args.sourceLabel}`;
  }

  if (args.endYear) {
    return `Data Source: ${args.endYear} ${args.sourceLabel}`;
  }

  return `Data Source: ${args.sourceLabel}`;
}

export function buildLocationQuotientSourceLine(args: {
  coverage: LocationQuotientCoverage;
  sourceMetadata: LocationQuotientSourceMetadata;
}) {
  return buildSourceLineFromYearRange({
    startYear: args.coverage.endYear,
    endYear: args.coverage.endYear,
    sourceLabel: args.sourceMetadata.source,
  });
}

export function buildPopulationPyramidSourceLine(args: {
  coverage: PopulationPyramidCoverage;
  sourceMetadata: PopulationPyramidSourceMetadata;
}) {
  return buildSourceLineFromYearRange({
    startYear: args.coverage.endYear,
    endYear: args.coverage.endYear,
    sourceLabel: args.sourceMetadata.source,
  });
}

export function buildEducationDonutSourceLine(args: {
  yearLabel: string;
  sourceMetadata: EducationDonutSourceMetadata;
}) {
  return args.sourceMetadata.source.includes("American Community Survey")
    ? `Data Source: ${args.yearLabel} ${args.sourceMetadata.source}`
    : `Data Source: ${args.yearLabel} ${args.sourceMetadata.source} American Community Survey`;
}
