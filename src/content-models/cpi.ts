import { Pages } from "pages";
import type { TimeSeriesPoint } from "@/visualizations/chart-contracts";

export type CpiSourceMetadata = {
  tableName: string;
  title: string;
  description: string;
  source: string;
  referenceTime: string;
  releaseSchedule: string;
  geography: string;
  updatedAt: string | null;
};

export type CpiAnnualTableRow = {
  year: number;
  monthValues: {
    january: number | null;
    february: number | null;
    march: number | null;
    april: number | null;
    may: number | null;
    june: number | null;
    july: number | null;
    august: number | null;
    september: number | null;
    october: number | null;
    november: number | null;
    december: number | null;
  };
  annualAverage: number | null;
  yearPercentageChange: number | null;
};

export type CpiMonthlyAverageRow = {
  monthValues: CpiAnnualTableRow["monthValues"];
  annualAverage: number | null;
};

export type CpiTrendSection = {
  title: string;
  description: string;
  chartTitle: string;
  chartSubtitle: string;
  summary: string;
  yAxisLabel: string;
  points: TimeSeriesPoint[];
  latestValue: number | null;
  latestDateLabel: string;
  coverageLabel: string;
  notes: string[];
};

export type CpiTableSection = {
  title: string;
  description: string;
  rows: CpiAnnualTableRow[];
  monthlyAverageRow: CpiMonthlyAverageRow | null;
};

export type CpiPageData = {
  path: string;
  eyebrow: string;
  title: string;
  lead: string;
  overviewParagraphs: ReadonlyArray<string>;
  trendSection: CpiTrendSection;
  tableSection: CpiTableSection;
  sourceMetadata: CpiSourceMetadata;
  resourceLinks: ReadonlyArray<{
    title: string;
    href: string;
  }>;
};

export const CPI_PAGE_OVERVIEW = {
  path: Pages.Data.children.CPI.url,
  eyebrow: "Data",
  title: "Consumer Price Index",
  lead: "Review the Consumer Price Index for All Urban Consumers, follow recent inflation readings, and reference annual CPI values for research, policy, and economic analysis.",
  overviewParagraphs: [
    "The Consumer Price Index for All Urban Consumers (CPI-U) tracks changes in prices paid by urban consumers for a representative basket of goods and services.",
    "The materials below present the U.S. city average monthly CPI series alongside annual reference values to support classroom use, policy review, and applied economic research.",
  ],
  trendTitle: "Monthly CPI Trend",
  trendDescription:
    "The chart shows the U.S. city average CPI-U series using the BLS base period of 1982-1984 = 100, offering a long-run view of changes in consumer prices over time.",
  tableTitle: "Annual CPI Table",
  tableDescription:
    "The table reports monthly CPI observations, annual averages, and year-over-year percentage change where published.",
  resourceLinks: [
    {
      title: "U.S. Bureau of Labor Statistics CPI program",
      href: "https://www.bls.gov/cpi/",
    },
    {
      title: "FRED CPI series reference",
      href: "https://fred.stlouisfed.org/series/CPIAUCSL",
    },
    {
      title: "BBER API documentation",
      href: Pages.Data.children.API_Documentation.url,
    },
  ],
} as const;
