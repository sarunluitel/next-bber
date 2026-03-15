import type {
  TimeSeriesPoint,
  ValueFormatKind,
} from "@/visualizations/chart-contracts";

export type EconIndicatorRange = "1y" | "3y" | "5y" | "all";

export type EconIndicatorSourceMetadata = {
  tableName: string;
  title: string;
  description: string;
  source: string;
  referenceTime: string;
  releaseSchedule: string;
  updatedAt: string | null;
};

export type EconIndicatorLinePoint = TimeSeriesPoint;

export type EconIndicatorMetricSeries = {
  value: string;
  label: string;
  description: string;
  format: ValueFormatKind;
  yAxisLabel: string;
  points: EconIndicatorLinePoint[];
};

export type EconIndicatorCard = {
  id: string;
  title: string;
  eyebrow: string;
  description: string;
  apiUrl: string;
  defaultMetric: string;
  metrics: EconIndicatorMetricSeries[];
  source: EconIndicatorSourceMetadata;
};

export type EconIndicatorsPageData = {
  cards: EconIndicatorCard[];
  rangeOptions: {
    value: EconIndicatorRange;
    label: string;
  }[];
};

type EconIndicatorMetricConfig = {
  value: string;
  label: string;
  description: string;
  format: ValueFormatKind;
  yAxisLabel: string;
};

export type EconIndicatorCardConfig = {
  id: string;
  title: string;
  eyebrow: string;
  description: string;
  table: string;
  query: Record<string, string | undefined>;
  responseFilters?: Record<string, string>;
  allStartYear: number;
  dateColumn?: string;
  defaultMetric: string;
  metrics: EconIndicatorMetricConfig[];
};

export const ECON_INDICATOR_RANGE_OPTIONS = [
  { value: "1y", label: "1Y" },
  { value: "3y", label: "3Y" },
  { value: "5y", label: "5Y" },
  { value: "all", label: "All" },
] satisfies {
  value: EconIndicatorRange;
  label: string;
}[];

export const ECON_INDICATOR_CARD_CONFIGS = [
  {
    id: "labor-market",
    title: "Labor Force and Employment",
    eyebrow: "Labor",
    description:
      "Monthly labor-force conditions for New Mexico, including employment, unemployment, and the statewide unemployment rate.",
    table: "labforce",
    query: {
      stfips: "35",
      areatype: "01",
      area: "000000",
      periodtype: "03",
      adjusted: "0",
      prelim: "0",
    },
    allStartYear: 2018,
    defaultMetric: "unemprate",
    metrics: [
      {
        value: "unemprate",
        label: "Unemployment Rate",
        description: "Statewide unemployment rate.",
        format: "percent",
        yAxisLabel: "Percent",
      },
      {
        value: "labforce",
        label: "Labor Force",
        description: "People in the labor force.",
        format: "count",
        yAxisLabel: "People",
      },
      {
        value: "emplab",
        label: "Employment",
        description: "People employed.",
        format: "count",
        yAxisLabel: "People",
      },
      {
        value: "unemp",
        label: "Unemployment",
        description: "People unemployed.",
        format: "count",
        yAxisLabel: "People",
      },
    ],
  },
  {
    id: "initial-claims",
    title: "Initial Claims",
    eyebrow: "Labor",
    description:
      "Weekly unemployment-insurance claims activity for New Mexico, including initial and continued claims plus the insured unemployment rate.",
    table: "initialclaims",
    query: {
      stfips: "35",
      areatype: "01",
      area: "000000",
    },
    allStartYear: 2018,
    dateColumn: "weekending",
    defaultMetric: "initialclaim",
    metrics: [
      {
        value: "initialclaim",
        label: "Initial Claims",
        description: "Number of initial unemployment claims.",
        format: "count",
        yAxisLabel: "Claims",
      },
      {
        value: "cclaims",
        label: "Continued Claims",
        description: "Number of continued unemployment claims.",
        format: "count",
        yAxisLabel: "Claims",
      },
      {
        value: "insured",
        label: "Insured Unemployment Rate",
        description: "Insured unemployment rate.",
        format: "percent",
        yAxisLabel: "Percent",
      },
    ],
  },
  {
    id: "jolts",
    title: "Job Openings and Labor Turnover",
    eyebrow: "Labor",
    description:
      "Monthly JOLTS measures for New Mexico, covering openings, hires, quits, and total separations.",
    table: "jolts",
    query: {
      stfips: "35",
      areatype: "01",
      periodtype: "03",
    },
    allStartYear: 2018,
    defaultMetric: "jobopenrate",
    metrics: [
      {
        value: "jobopenrate",
        label: "Job Openings Rate",
        description: "Open positions as a rate.",
        format: "percent",
        yAxisLabel: "Percent",
      },
      {
        value: "jobopen",
        label: "Job Openings",
        description: "Number of open positions.",
        format: "count",
        yAxisLabel: "Open positions",
      },
      {
        value: "hires",
        label: "Hires",
        description: "Monthly hires.",
        format: "count",
        yAxisLabel: "Hires",
      },
      {
        value: "quits",
        label: "Quits",
        description: "Monthly quits.",
        format: "count",
        yAxisLabel: "Quits",
      },
      {
        value: "separations",
        label: "Separations",
        description: "Total monthly separations.",
        format: "count",
        yAxisLabel: "Separations",
      },
    ],
  },
  {
    id: "rig-count",
    title: "Active Oil and Gas Rigs",
    eyebrow: "Energy",
    description:
      "Monthly active rig count for New Mexico, reflecting drilling activity in the state.",
    table: "oilgasrigs",
    query: {
      stfips: "35",
      areatype: "77",
      periodtype: "03",
    },
    allStartYear: 2018,
    defaultMetric: "rigs",
    metrics: [
      {
        value: "rigs",
        label: "Active Rigs",
        description: "Number of active rigs.",
        format: "count",
        yAxisLabel: "Rigs",
      },
    ],
  },
  {
    id: "oil-severance",
    title: "Oil Severance",
    eyebrow: "Energy",
    description:
      "Monthly oil production and value measures from New Mexico severance reports.",
    table: "oilgasvol",
    query: {
      stfips: "35",
      areatype: "01",
      area: "000000",
      periodtype: "03",
    },
    responseFilters: {
      product: "All Oil products",
      landtype: "All",
    },
    allStartYear: 2020,
    defaultMetric: "grossvalue",
    metrics: [
      {
        value: "grossvalue",
        label: "Gross Value",
        description: "Monthly gross value of oil production.",
        format: "currency",
        yAxisLabel: "Dollars",
      },
      {
        value: "volume",
        label: "Volume",
        description: "Monthly production volume.",
        format: "count",
        yAxisLabel: "Volume",
      },
      {
        value: "price",
        label: "Price",
        description: "Average price per reporting period.",
        format: "currency",
        yAxisLabel: "Price",
      },
    ],
  },
  {
    id: "gas-severance",
    title: "Gas Severance",
    eyebrow: "Energy",
    description:
      "Monthly natural-gas production and value measures from New Mexico severance reports.",
    table: "oilgasvol",
    query: {
      stfips: "35",
      areatype: "01",
      area: "000000",
      periodtype: "03",
      product: "All Gas products",
    },
    responseFilters: {
      product: "All Gas products",
      landtype: "All",
    },
    allStartYear: 2020,
    defaultMetric: "grossvalue",
    metrics: [
      {
        value: "grossvalue",
        label: "Gross Value",
        description: "Monthly gross value of gas production.",
        format: "currency",
        yAxisLabel: "Dollars",
      },
      {
        value: "volume",
        label: "Volume",
        description: "Monthly gas production volume.",
        format: "count",
        yAxisLabel: "Volume",
      },
      {
        value: "price",
        label: "Price",
        description: "Average reported gas price.",
        format: "currency",
        yAxisLabel: "Price",
      },
    ],
  },
  {
    id: "air-traffic",
    title: "Albuquerque Air Traffic",
    eyebrow: "Mobility",
    description:
      "Passenger traffic at Albuquerque International Sunport, with both enplaned and deplaned counts.",
    table: "airstats",
    query: {
      area: "002000",
    },
    allStartYear: 2017,
    defaultMetric: "passengers",
    metrics: [
      {
        value: "passengers",
        label: "Passengers",
        description: "Total passengers.",
        format: "count",
        yAxisLabel: "Passengers",
      },
      {
        value: "enplaned",
        label: "Enplaned",
        description: "Boarding passengers.",
        format: "count",
        yAxisLabel: "Passengers",
      },
      {
        value: "deplaned",
        label: "Deplaned",
        description: "Arriving passengers.",
        format: "count",
        yAxisLabel: "Passengers",
      },
    ],
  },
  {
    id: "building-permits",
    title: "Residential Building Permits",
    eyebrow: "Construction",
    description:
      "Monthly state-level permitting activity and permit values for residential construction in New Mexico.",
    table: "bldgprmtscensus",
    query: {
      stfips: "35",
      areatype: "01",
      area: "000000",
      periodtype: "03",
    },
    allStartYear: 2018,
    defaultMetric: "units1",
    metrics: [
      {
        value: "units1",
        label: "Single-Family Units",
        description: "Single-family permitted units.",
        format: "count",
        yAxisLabel: "Units",
      },
      {
        value: "value1",
        label: "Single-Family Permit Value",
        description: "Value of single-family permits.",
        format: "currency",
        yAxisLabel: "Dollars",
      },
      {
        value: "bldgs5",
        label: "Buildings with 5+ Units",
        description: "Permits for buildings with five or more units.",
        format: "count",
        yAxisLabel: "Buildings",
      },
    ],
  },
  {
    id: "wti-price",
    title: "WTI Crude Price",
    eyebrow: "Markets",
    description:
      "West Texas Intermediate oil prices, one of the core market indicators referenced across the live dashboard.",
    table: "wti",
    query: {
      stfips: "00",
      areatype: "00",
      area: "000000",
    },
    allStartYear: 2018,
    dateColumn: "wtidate",
    defaultMetric: "wtivalue",
    metrics: [
      {
        value: "wtivalue",
        label: "WTI Price",
        description: "West Texas Intermediate crude oil price.",
        format: "currency",
        yAxisLabel: "Price",
      },
    ],
  },
  {
    id: "mortgage-rate",
    title: "30-Year Mortgage Rate",
    eyebrow: "Markets",
    description:
      "Average 30-year mortgage rate, included as a financing and housing-market signal.",
    table: "mortgage",
    query: {
      stfips: "00",
      areatype: "00",
      area: "000000",
    },
    allStartYear: 2018,
    defaultMetric: "rate",
    metrics: [
      {
        value: "rate",
        label: "30-Year Rate",
        description: "Average 30-year mortgage interest rate.",
        format: "percent",
        yAxisLabel: "Percent",
      },
    ],
  },
] satisfies EconIndicatorCardConfig[];

export function getEconIndicatorCardConfig(cardId: string) {
  return ECON_INDICATOR_CARD_CONFIGS.find((config) => config.id === cardId);
}
