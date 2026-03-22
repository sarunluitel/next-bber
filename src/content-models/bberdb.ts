export const BBER_DB_DATA_CATEGORIES = {
  ALL: "All",
  ECONOMIC: "Economic",
  POPULATION: "Population",
  SOCIAL: "Social",
} as const;

export type BberDbDataCategory =
  (typeof BBER_DB_DATA_CATEGORIES)[keyof typeof BBER_DB_DATA_CATEGORIES];

export type BberDbDatasetCatalogEntry = {
  label: string;
  tableName: string;
  categories: readonly BberDbDataCategory[];
  source: string;
  isDefault?: boolean;
};

const ALL = BBER_DB_DATA_CATEGORIES.ALL;
const ECONOMIC = BBER_DB_DATA_CATEGORIES.ECONOMIC;
const POPULATION = BBER_DB_DATA_CATEGORIES.POPULATION;
const SOCIAL = BBER_DB_DATA_CATEGORIES.SOCIAL;

export const BBER_DB_DATASET_CATALOG = [
  {
    label: "Gross Receipts",
    tableName: "v_rp80",
    categories: [ALL, ECONOMIC],
    source: "NM Taxation & Revenue",
  },
  {
    label: "Building Permits",
    tableName: "bldgprmtscensus",
    categories: [ALL, ECONOMIC, POPULATION],
    source: "US Census Bureau Building Permits Survey",
  },
  {
    label: "S0801 : Commute Data",
    tableName: "s0801",
    categories: [ALL, ECONOMIC],
    source: "US Census Bureau",
    isDefault: true,
  },
  {
    label: "H1 : Redistricting table with Occupancy Status (Housing) counts.",
    tableName: "h1",
    categories: [ALL, POPULATION],
    source: "US Census Bureau",
  },
  {
    label: "P1 : Redistricting table with Population and Race counts",
    tableName: "p1",
    categories: [ALL, POPULATION],
    source: "US Census Bureau",
  },
  {
    label:
      "P2 : Redistricting table with Hispanic or Latino, and not Hispanic or Latino by Race counts",
    tableName: "p2",
    categories: [ALL, POPULATION],
    source: "US Census Bureau",
  },
  {
    label:
      "P3 : Redistricting table with Race for the Population 18 Years and Over counts",
    tableName: "p3",
    categories: [ALL, POPULATION],
    source: "US Census Bureau",
  },
  {
    label:
      "P4 : Redistricting table with Hispanic or Latino, and not Hispanic or Latino by Race for the Population 18 Years and Over counts",
    tableName: "p4",
    categories: [ALL, POPULATION],
    source: "US Census Bureau",
  },
  {
    label:
      "P5 : Redistricting table with Group Quarters Population by Group Quarters Type counts",
    tableName: "p5",
    categories: [ALL, POPULATION],
    source: "US Census Bureau",
  },
  {
    label: "SF1P1 : Decennial Census Summary File 1 for Population Estimates",
    tableName: "sf1p1",
    categories: [ALL, POPULATION],
    source: "US Census Bureau",
  },
  {
    label: "Movers Data",
    tableName: "v_movers",
    categories: [ALL, POPULATION],
    source: "US Census Bureau",
  },
  {
    label: "Net Migration Data",
    tableName: "peptcomp",
    categories: [ALL, POPULATION],
    source: "US Census Bureau",
  },
  {
    label: "QCEW : Employment Data",
    tableName: "qcew",
    categories: [ALL, ECONOMIC],
    source: "US Bureau of Labor Statistics",
  },
  {
    label: "Housing",
    tableName: "v_housing_occupied",
    categories: [ALL, POPULATION],
    source: "US Census Bureau",
  },
  {
    label: "Labor Force Data",
    tableName: "v_labour_force",
    categories: [ALL, ECONOMIC],
    source: "US Census Bureau",
  },
  {
    label: "Education Attainment",
    tableName: "v_education_attainment",
    categories: [ALL, SOCIAL],
    source: "US Census Bureau",
  },
  {
    label: "Population",
    tableName: "v_population_growth",
    categories: [ALL, POPULATION],
    source: "US Census Bureau Population Estimate Program",
  },
  {
    label: "School Age Population",
    tableName: "v_school_age_population",
    categories: [ALL, POPULATION],
    source: "US Census Bureau",
  },
  {
    label: "PPP Loans",
    tableName: "v_ppp",
    categories: [ALL, ECONOMIC],
    source: "US Treasury Department",
  },
  {
    label: "S0101 : Summary Age and Sex",
    tableName: "s0101",
    categories: [ALL, POPULATION],
    source: "US Census Bureau",
  },
  {
    label: "S0802 : Transportation to Work",
    tableName: "S0802",
    categories: [ALL, ECONOMIC],
    source: "US Census Bureau",
  },
  {
    label: "Small Area Income and Poverty Estimates",
    tableName: "saipe",
    categories: [ALL, ECONOMIC],
    source: "Unknown",
  },
  {
    label: "Commercial Airline Passenger Traffic",
    tableName: "airstats",
    categories: [ALL, ECONOMIC],
    source: "Unknown",
  },
  {
    label: "B01001 : Age and Sex",
    tableName: "b01001",
    categories: [ALL, POPULATION],
    source: "US Census Bureau",
  },
  {
    label: "B01002 : Median Age by Sex",
    tableName: "b01002",
    categories: [ALL, POPULATION],
    source: "US Census Bureau",
  },
  {
    label: "B08007 : Sex of Workers by Place of Work",
    tableName: "b08007",
    categories: [ALL, ECONOMIC],
    source: "US Census Bureau",
  },
  {
    label: "B08008 : Sex of Workers by Place of Work",
    tableName: "b08008",
    categories: [ALL, ECONOMIC],
    source: "US Census Bureau",
  },
  {
    label: "B09019 : Household Type by Relationship",
    tableName: "b09019",
    categories: [ALL, SOCIAL],
    source: "US Census Bureau",
  },
  {
    label: "B11001 : Household Type",
    tableName: "b11001",
    categories: [ALL, SOCIAL],
    source: "US Census Bureau",
  },
  {
    label: "B11005 : Household Income Data",
    tableName: "b11005",
    categories: [ALL, ECONOMIC],
    source: "US Census Bureau",
  },
  {
    label: "B13016 : Women who had birthing in the past 12 months",
    tableName: "b13016",
    categories: [ALL, POPULATION],
    source: "US Census Bureau",
  },
  {
    label: "B14001 : School Enrollment by Level of School",
    tableName: "b14001",
    categories: [ALL, SOCIAL],
    source: "US Census Bureau",
  },
  {
    label: "B14002 : School Enrollment by Level of School",
    tableName: "b14002",
    categories: [ALL, SOCIAL],
    source: "US Census Bureau",
  },
  {
    label: "B14003 : Sex by School Enrollment by Type of School by Age ",
    tableName: "b14003",
    categories: [ALL, SOCIAL],
    source: "US Census Bureau",
  },
  {
    label: "B14004 : Sex by College or Graduate School",
    tableName: "b14004",
    categories: [ALL, SOCIAL],
    source: "US Census Bureau",
  },
  {
    label: "B15001 : Sex By Age By Educational Attainment",
    tableName: "b15001",
    categories: [ALL, SOCIAL],
    source: "US Census Bureau",
  },
  {
    label: "B15002 : Sex By Age By Educational Attainment",
    tableName: "b15002",
    categories: [ALL, SOCIAL],
    source: "US Census Bureau",
  },
  {
    label: "B15002A : Sex By Age By Educational Attainment",
    tableName: "b15002a",
    categories: [ALL, SOCIAL],
    source: "US Census Bureau",
  },
  {
    label: "B15002B : Sex By Age By Educational Attainment",
    tableName: "b15002b",
    categories: [ALL, SOCIAL],
    source: "US Census Bureau",
  },
  {
    label: "B15002C : Sex By Age By Educational Attainment",
    tableName: "b15002c",
    categories: [ALL, SOCIAL],
    source: "US Census Bureau",
  },
  {
    label: "B15002D : Sex By Age By Educational Attainment",
    tableName: "b15002d",
    categories: [ALL, SOCIAL],
    source: "US Census Bureau",
  },
  {
    label: "B15002E : Sex By Age By Educational Attainment",
    tableName: "b15002e",
    categories: [ALL, SOCIAL],
    source: "US Census Bureau",
  },
  {
    label: "B15002F : Sex By Age By Educational Attainment",
    tableName: "b15002f",
    categories: [ALL, SOCIAL],
    source: "US Census Bureau",
  },
  {
    label: "B15002G : Sex By Age By Educational Attainment",
    tableName: "b15002g",
    categories: [ALL, SOCIAL],
    source: "US Census Bureau",
  },
  {
    label: "B15002H : Sex By Age By Educational Attainment",
    tableName: "b15002h",
    categories: [ALL, SOCIAL],
    source: "US Census Bureau",
  },
  {
    label: "B15002I : Sex By Age By Educational Attainment",
    tableName: "b15002i",
    categories: [ALL, SOCIAL],
    source: "US Census Bureau",
  },
  {
    label: "B16002 : Detailed Household Language by Household",
    tableName: "b16002",
    categories: [ALL, SOCIAL],
    source: "US Census Bureau",
  },
  {
    label: "B16010 :  Educational Attainment and Employment Status",
    tableName: "b16010",
    categories: [ALL, ECONOMIC],
    source: "US Census Bureau",
  },
  {
    label: "B17003 : Poverty Status in the Past 12 Months",
    tableName: "b17003",
    categories: [ALL, ECONOMIC],
    source: "US Census Bureau",
  },
  {
    label: "B17026 : Ratio of Income to Poverty",
    tableName: "b17026",
    categories: [ALL, ECONOMIC],
    source: "US Census Bureau",
  },
  {
    label: "B19013 : Median Household Income",
    tableName: "B19013",
    categories: [ALL, ECONOMIC],
    source: "US Census Bureau",
  },
  {
    label: "B24010 : Sex by Occupation for the Civilian Population",
    tableName: "B24010",
    categories: [ALL, SOCIAL],
    source: "US Census Bureau",
  },
  {
    label:
      "B24116 : Detailed Occupation for the Civilian Employed Female Population",
    tableName: "B24116",
    categories: [ALL, SOCIAL],
    source: "US Census Bureau",
  },
  {
    label: "B27001 : Health Insurance Coverage Status by Sex by Age",
    tableName: "B27001",
    categories: [ALL, ECONOMIC],
    source: "US Census Bureau",
  },
  {
    label: "B27007 : Medicaid/Means-tested Public Coverage by Sex by Age",
    tableName: "B27007",
    categories: [ALL, ECONOMIC],
    source: "US Census Bureau",
  },
  {
    label: "B28001: Types of Computers in Household",
    tableName: "B28001",
    categories: [ALL, ECONOMIC, SOCIAL],
    source: "US Census Bureau",
  },
  {
    label: "B28002: Presence and Types of Internet Subscriptions in Household",
    tableName: "B28002",
    categories: [ALL, ECONOMIC, SOCIAL],
    source: "US Census Bureau",
  },
  {
    label:
      "B28003: Presence of a Computer and Type of Internet Subscription in Household",
    tableName: "B28003",
    categories: [ALL, ECONOMIC, SOCIAL],
    source: "US Census Bureau",
  },
  {
    label:
      "B28004: Household Income by Presence and Type of Internet Subscription",
    tableName: "B28004",
    categories: [ALL, ECONOMIC, SOCIAL],
    source: "US Census Bureau",
  },
  {
    label:
      "B28005: Age by Presence of a Computer and Types of Internet Subscription in Household",
    tableName: "B28005",
    categories: [ALL, ECONOMIC, SOCIAL],
    source: "US Census Bureau",
  },
  {
    label:
      "B28006: Educational Attainment by Presence of a Computer and Types of Internet Subscription in Household",
    tableName: "B28006",
    categories: [ALL, ECONOMIC, SOCIAL],
    source: "US Census Bureau",
  },
  {
    label:
      "B28007: Labor Force Status by Presence of a Computer and Types of Internet Subscription in Household",
    tableName: "B28007",
    categories: [ALL, ECONOMIC, SOCIAL],
    source: "US Census Bureau",
  },
  {
    label:
      "B28008: Presence of a Computer and Type of Internet Subscription in Household",
    tableName: "B28008",
    categories: [ALL, ECONOMIC, SOCIAL],
    source: "US Census Bureau",
  },
  {
    label:
      "B28009A: Presence of a Computer and Type of Internet Subscription in Household",
    tableName: "B28009A",
    categories: [ALL, ECONOMIC, SOCIAL],
    source: "US Census Bureau",
  },
  {
    label:
      "B28009B: Presence of a Computer and Type of Internet Subscription in Household",
    tableName: "B28009B",
    categories: [ALL, ECONOMIC, SOCIAL],
    source: "US Census Bureau",
  },
  {
    label:
      "B28009C: Presence of a Computer and Type of Internet Subscription in Household",
    tableName: "B28009C",
    categories: [ALL, ECONOMIC, SOCIAL],
    source: "US Census Bureau",
  },
  {
    label:
      "B28009D: Presence of a Computer and Type of Internet Subscription in Household",
    tableName: "B28009D",
    categories: [ALL, ECONOMIC, SOCIAL],
    source: "US Census Bureau",
  },
  {
    label:
      "B28009E: Presence of a Computer and Type of Internet Subscription in Household",
    tableName: "B28009E",
    categories: [ALL, ECONOMIC, SOCIAL],
    source: "US Census Bureau",
  },
  {
    label:
      "B28009F: Presence of a Computer and Type of Internet Subscription in Household",
    tableName: "B28009F",
    categories: [ALL, ECONOMIC, SOCIAL],
    source: "US Census Bureau",
  },
  {
    label:
      "B28009G: Presence of a Computer and Type of Internet Subscription in Household",
    tableName: "B28009G",
    categories: [ALL, ECONOMIC, SOCIAL],
    source: "US Census Bureau",
  },
  {
    label:
      "B28009H: Presence of a Computer and Type of Internet Subscription in Household",
    tableName: "B28009H",
    categories: [ALL, ECONOMIC, SOCIAL],
    source: "US Census Bureau",
  },
  {
    label:
      "B28009I: Presence of a Computer and Type of Internet Subscription in Household",
    tableName: "B28009I",
    categories: [ALL, ECONOMIC, SOCIAL],
    source: "US Census Bureau",
  },
  {
    label: "B28010: Computers in Household",
    tableName: "B28010",
    categories: [ALL, ECONOMIC, SOCIAL],
    source: "US Census Bureau",
  },
  {
    label: "B28011: Internet Subscriptions in Household",
    tableName: "B28011",
    categories: [ALL, ECONOMIC, SOCIAL],
    source: "US Census Bureau",
  },
  {
    label:
      "B28012: Age and Enrollment Status by Computer Ownership and Internet Subscription Status",
    tableName: "B28012",
    categories: [ALL, ECONOMIC, SOCIAL],
    source: "US Census Bureau",
  },
] satisfies readonly BberDbDatasetCatalogEntry[];

export const BBER_DB_DEFAULT_TABLE =
  BBER_DB_DATASET_CATALOG.find((entry) => entry.isDefault)?.tableName ??
  "s0801";

export const BBER_DB_PAGE_CONTENT = {
  path: "/data/bberdb/",
  title: "BBER Data Bank Database",
  lead: "Browse published BBER data tables by dataset, geography, year, and period for research, teaching, and policy analysis.",
  backHref: "/data/",
  documentationHref: "/data/apidoc",
} as const;

export const BBER_DB_FILTER_KEYS = [
  "stfips",
  "areatype",
  "area",
  "periodyear",
  "periodtype",
  "period",
  "indcode",
  "adjusted",
  "ownership",
] as const;

export type BberDbFilterKey = (typeof BBER_DB_FILTER_KEYS)[number];

export const BBER_DB_VISIBLE_FILTER_KEY_ORDER = [
  "areatype",
  "periodyear",
  "periodtype",
  "indcode",
  "ownership",
] as const;

export type BberDbVisibleFilterKey =
  (typeof BBER_DB_VISIBLE_FILTER_KEY_ORDER)[number];

export type BberDbFilterOption = {
  value: string;
  label: string;
};

export type BberDbFilterOptionsMap = Partial<
  Record<BberDbFilterKey, BberDbFilterOption[]>
>;

export type BberDbAppliedQuery = {
  table: string;
} & Partial<Record<BberDbFilterKey, string>>;

export type BberDbFilterDefinition = {
  key: BberDbVisibleFilterKey;
  label: string;
  value: string;
  options: BberDbFilterOption[];
};

export type BberDbFilterModel = {
  tableName: string;
  supportedFilterKeys: BberDbFilterKey[];
  visibleFilterKeys: BberDbVisibleFilterKey[];
  filters: BberDbFilterDefinition[];
  draftQuery: BberDbAppliedQuery;
};

export type BberDbMetadataColumn = {
  table_name: string;
  column_name: string;
  display_name: string;
  column_description: string;
};

export type BberDbRawRecord = Record<string, unknown>;

export type BberDbSourceMetadata = {
  tableName: string;
  tableTitle: string;
  tableDescription: string;
  source: string;
  purpose: string;
  referenceTime: string;
  releaseSchedule: string;
  updatedAt: string | null;
};

export type BberDbTableColumn = {
  key: string;
  header: string;
  description: string | null;
};

export type BberDbTableRow = {
  id: string;
  cells: string[];
};

export type BberDbTableViewModel = {
  datasetLabel: string;
  tableName: string;
  query: BberDbAppliedQuery;
  resultTitle: string;
  sourceLine: string;
  apiUrl: string;
  description: string;
  columns: BberDbTableColumn[];
  rows: BberDbTableRow[];
  rawRowCount: number;
  sourceMetadata: BberDbSourceMetadata;
};

function parseBberDbMultiValueSelection(value: string | undefined) {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((selectionPart) => selectionPart.trim())
    .filter((selectionPart) => selectionPart.length > 0);
}

function buildBberDbMultiValueSelection(values: string[]) {
  return values.join(",");
}

function formatBberDbYearSelection(value: string | undefined) {
  const selectedYears = parseBberDbMultiValueSelection(value);

  if (selectedYears.length === 0) {
    return null;
  }

  const numericYears = selectedYears
    .map((yearValue) => ({
      rawValue: yearValue,
      numericValue: Number(yearValue),
    }))
    .filter((yearValue) => Number.isFinite(yearValue.numericValue))
    .sort(
      (leftYear, rightYear) => leftYear.numericValue - rightYear.numericValue,
    );

  if (numericYears.length === selectedYears.length) {
    const groupedYears: string[] = [];
    let rangeStart = numericYears[0]?.numericValue ?? Number.NaN;
    let rangeEnd = rangeStart;

    for (let index = 1; index < numericYears.length; index += 1) {
      const currentYear = numericYears[index]?.numericValue ?? Number.NaN;

      if (currentYear === rangeEnd + 1) {
        rangeEnd = currentYear;
        continue;
      }

      groupedYears.push(
        rangeStart === rangeEnd
          ? String(rangeStart)
          : `${String(rangeStart)}-${String(rangeEnd)}`,
      );
      rangeStart = currentYear;
      rangeEnd = currentYear;
    }

    groupedYears.push(
      rangeStart === rangeEnd
        ? String(rangeStart)
        : `${String(rangeStart)}-${String(rangeEnd)}`,
    );

    if (groupedYears.length === 1) {
      return groupedYears[0];
    }

    if (groupedYears.length === 2) {
      return `${groupedYears[0]} and ${groupedYears[1]}`;
    }

    return `${groupedYears.slice(0, -1).join(", ")}, and ${groupedYears.at(-1)}`;
  }

  if (selectedYears.length === 1) {
    return selectedYears[0];
  }

  if (selectedYears.length === 2) {
    return `${selectedYears[0]} and ${selectedYears[1]}`;
  }

  return `${selectedYears.slice(0, -1).join(", ")}, and ${selectedYears.at(-1)}`;
}

export type BberDbInitialPageData = {
  pageContent: typeof BBER_DB_PAGE_CONTENT;
  categoryOptions: BberDbDataCategory[];
  datasetCatalog: readonly BberDbDatasetCatalogEntry[];
  initialFilterModel: BberDbFilterModel;
  initialTableModel: BberDbTableViewModel;
  initialMetadataErrorMessage: string | null;
  initialTableErrorMessage: string | null;
};

const BBER_DB_FILTER_LABELS: Record<BberDbVisibleFilterKey, string> = {
  areatype: "Select Geography",
  periodyear: "Select Data Year",
  periodtype: "Select Data Period Types",
  indcode: "Select Industry (NAICS)",
  ownership: "Select Ownership",
};

const BBER_DB_LEADING_CONTEXT_COLUMN_KEYS = [
  "geographyname",
  "geoid",
  "stfips",
  "areatypename",
  "areatype",
  "areaname",
  "area",
  "periodyear",
  "periodtypename",
  "periodtype",
  "period",
  "indcodename",
  "industryname",
  "indcode",
  "ownershipname",
  "ownership",
] as const;

const BBER_DB_COLUMN_HEADER_OVERRIDES: Partial<Record<string, string>> = {
  period: "Period",
};

export const BBER_DB_SENTINEL_LABELS = [
  "Not enough samples",
  "Too small sample",
  "Median in lowest interval",
  "Median in highest interval",
  "Statistical test is not appropriate",
  "Controlled estimate",
  "Too few samples",
  "Not applicable",
] as const;

function getStringValue(record: Record<string, unknown>, key: string) {
  const value = record[key];

  if (typeof value !== "string") {
    return null;
  }

  const trimmedValue = value.trim();
  return trimmedValue.length > 0 ? trimmedValue : null;
}

function getNumericSortValue(value: string) {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : Number.NaN;
}

function normalizeRequestedQueryValue(value: string | null | undefined) {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmedValue = value.trim();

  if (trimmedValue.length === 0) {
    return undefined;
  }

  if (
    trimmedValue.startsWith('"') &&
    trimmedValue.endsWith('"') &&
    trimmedValue.length >= 2
  ) {
    return trimmedValue.slice(1, -1);
  }

  return trimmedValue;
}

export function getDefaultBberDbDataset() {
  return (
    BBER_DB_DATASET_CATALOG.find(
      (entry) => entry.tableName === BBER_DB_DEFAULT_TABLE,
    ) ?? BBER_DB_DATASET_CATALOG[0]
  );
}

export function findBberDbDatasetByTable(tableName: string) {
  return BBER_DB_DATASET_CATALOG.find((entry) => entry.tableName === tableName);
}

export function getBberDbDatasetCatalogForCategory(
  category: BberDbDataCategory,
) {
  if (category === BBER_DB_DATA_CATEGORIES.ALL) {
    return BBER_DB_DATASET_CATALOG;
  }

  return BBER_DB_DATASET_CATALOG.filter((entry) =>
    entry.categories.some((entryCategory) => entryCategory === category),
  );
}

export function getBberDbVisibleFilterKeys(
  supportedFilterKeys: readonly BberDbFilterKey[],
) {
  return BBER_DB_VISIBLE_FILTER_KEY_ORDER.filter((key) =>
    supportedFilterKeys.includes(key),
  );
}

export function normalizeBberDbSupportedFilterKeys(rawColumns: unknown) {
  const columns = Array.isArray(rawColumns)
    ? rawColumns
    : rawColumns &&
        typeof rawColumns === "object" &&
        Array.isArray((rawColumns as { columns?: unknown }).columns)
      ? (rawColumns as { columns: unknown[] }).columns
      : null;

  if (!columns) {
    return [];
  }

  return BBER_DB_FILTER_KEYS.filter((key) => columns.includes(key));
}

export function normalizeBberDbFilterOptions(
  rawValues: unknown,
  filterKey: BberDbFilterKey,
) {
  if (!Array.isArray(rawValues)) {
    return [];
  }

  const seenValues = new Set<string>();
  const options: BberDbFilterOption[] = [];

  for (const rawValue of rawValues) {
    if (!rawValue || typeof rawValue !== "object") {
      continue;
    }

    const record = rawValue as Record<string, unknown>;
    const value = getStringValue(record, filterKey);

    if (!value || seenValues.has(value)) {
      continue;
    }

    options.push({
      value,
      label: getStringValue(record, "displayname") ?? value,
    });
    seenValues.add(value);
  }

  return sortBberDbFilterOptions(filterKey, options);
}

function sortBberDbFilterOptions(
  filterKey: BberDbFilterKey,
  options: BberDbFilterOption[],
) {
  if (filterKey !== "periodyear") {
    return options;
  }

  return [...options].sort((leftOption, rightOption) => {
    const leftNumericValue = getNumericSortValue(leftOption.value);
    const rightNumericValue = getNumericSortValue(rightOption.value);

    if (
      Number.isFinite(leftNumericValue) &&
      Number.isFinite(rightNumericValue)
    ) {
      return rightNumericValue - leftNumericValue;
    }

    return rightOption.value.localeCompare(leftOption.value);
  });
}

function selectDefaultBberDbFilterValue(
  filterKey: BberDbVisibleFilterKey,
  options: BberDbFilterOption[],
) {
  if (options.length === 0) {
    return "";
  }

  if (filterKey === "periodyear") {
    return [...options].sort((leftOption, rightOption) => {
      const leftNumericValue = getNumericSortValue(leftOption.value);
      const rightNumericValue = getNumericSortValue(rightOption.value);

      if (
        Number.isFinite(leftNumericValue) &&
        Number.isFinite(rightNumericValue)
      ) {
        return rightNumericValue - leftNumericValue;
      }

      return rightOption.value.localeCompare(leftOption.value);
    })[0]?.value;
  }

  if (filterKey === "periodtype") {
    return [...options].sort((leftOption, rightOption) => {
      const leftNumericValue = getNumericSortValue(leftOption.value);
      const rightNumericValue = getNumericSortValue(rightOption.value);

      if (
        Number.isFinite(leftNumericValue) &&
        Number.isFinite(rightNumericValue)
      ) {
        return rightNumericValue - leftNumericValue;
      }

      return rightOption.value.localeCompare(leftOption.value);
    })[0]?.value;
  }

  return options[0]?.value ?? "";
}

function resolveRequestedBberDbFilterValue(args: {
  filterKey: BberDbVisibleFilterKey;
  requestedValue: string | undefined;
  options: BberDbFilterOption[];
}) {
  if (!args.requestedValue) {
    return null;
  }

  if (args.filterKey !== "periodyear") {
    return args.options.some((option) => option.value === args.requestedValue)
      ? args.requestedValue
      : null;
  }

  const requestedValues = new Set(
    parseBberDbMultiValueSelection(args.requestedValue),
  );
  const normalizedValues = args.options
    .map((option) => option.value)
    .filter((value) => requestedValues.has(value));

  if (normalizedValues.length === 0) {
    return null;
  }

  return buildBberDbMultiValueSelection(normalizedValues);
}

export function buildBberDbDraftQuery(args: {
  tableName: string;
  visibleFilterKeys: readonly BberDbVisibleFilterKey[];
  optionsByKey: BberDbFilterOptionsMap;
  requestedQuery?: Partial<Record<BberDbVisibleFilterKey, string | undefined>>;
}) {
  const query: BberDbAppliedQuery = {
    table: args.tableName,
  };

  for (const filterKey of args.visibleFilterKeys) {
    const options = args.optionsByKey[filterKey] ?? [];
    const normalizedRequestedValue = resolveRequestedBberDbFilterValue({
      filterKey,
      requestedValue: args.requestedQuery?.[filterKey],
      options,
    });

    if (normalizedRequestedValue) {
      query[filterKey] = normalizedRequestedValue;
      continue;
    }

    const fallbackValue = selectDefaultBberDbFilterValue(filterKey, options);

    if (fallbackValue) {
      query[filterKey] = fallbackValue;
    }
  }

  return query;
}

export function buildBberDbFilterModel(args: {
  tableName: string;
  supportedFilterKeys: readonly BberDbFilterKey[];
  optionsByKey: BberDbFilterOptionsMap;
  requestedQuery?: Partial<Record<BberDbVisibleFilterKey, string | undefined>>;
}) {
  const visibleFilterKeys = getBberDbVisibleFilterKeys(
    args.supportedFilterKeys,
  );
  const draftQuery = buildBberDbDraftQuery({
    tableName: args.tableName,
    visibleFilterKeys,
    optionsByKey: args.optionsByKey,
    requestedQuery: args.requestedQuery,
  });

  return {
    tableName: args.tableName,
    supportedFilterKeys: [...args.supportedFilterKeys],
    visibleFilterKeys,
    filters: visibleFilterKeys.map((filterKey) => ({
      key: filterKey,
      label: BBER_DB_FILTER_LABELS[filterKey],
      value: draftQuery[filterKey] ?? "",
      options: sortBberDbFilterOptions(
        filterKey,
        args.optionsByKey[filterKey] ?? [],
      ),
    })),
    draftQuery,
  } satisfies BberDbFilterModel;
}

export function buildBberDbApiSearchParams(query: BberDbAppliedQuery) {
  const searchParams = new URLSearchParams({
    table: query.table,
  });

  for (const filterKey of BBER_DB_FILTER_KEYS) {
    const filterValue = query[filterKey];

    if (!filterValue) {
      continue;
    }

    searchParams.set(filterKey, filterValue);
  }

  return searchParams;
}

export function buildBberDbQuerySearchParams(query: BberDbAppliedQuery) {
  const searchParams = new URLSearchParams({
    table: query.table,
  });

  for (const filterKey of BBER_DB_FILTER_KEYS) {
    const filterValue = query[filterKey];

    if (!filterValue) {
      continue;
    }

    searchParams.set(filterKey, filterValue);
  }

  return searchParams;
}

export function parseBberDbRequestedQuery(
  searchParams: URLSearchParams | Iterable<[string, string]>,
) {
  const normalizedSearchParams =
    searchParams instanceof URLSearchParams
      ? searchParams
      : new URLSearchParams(Array.from(searchParams));
  const tableName = normalizeRequestedQueryValue(
    normalizedSearchParams.get("table"),
  );
  const query: Partial<Record<BberDbFilterKey, string>> = {};

  for (const filterKey of BBER_DB_FILTER_KEYS) {
    const filterValue = normalizeRequestedQueryValue(
      normalizedSearchParams.get(filterKey),
    );

    if (filterValue) {
      query[filterKey] = filterValue;
    }
  }

  return {
    tableName,
    query,
  };
}

export function areBberDbQueriesEqual(
  leftQuery: BberDbAppliedQuery,
  rightQuery: BberDbAppliedQuery,
) {
  if (leftQuery.table !== rightQuery.table) {
    return false;
  }

  return BBER_DB_FILTER_KEYS.every(
    (filterKey) =>
      (leftQuery[filterKey] ?? "") === (rightQuery[filterKey] ?? ""),
  );
}

export function getBberDbSelectedYearValues(value: string | undefined) {
  return parseBberDbMultiValueSelection(value);
}

export function normalizeBberDbSourceMetadata(
  rawValue: unknown,
): BberDbSourceMetadata {
  const record =
    rawValue && typeof rawValue === "object"
      ? (rawValue as Record<string, unknown>)
      : {};

  return {
    tableName: getStringValue(record, "table_name") ?? "",
    tableTitle: getStringValue(record, "data_title") ?? "",
    tableDescription: getStringValue(record, "data_description") ?? "",
    source: getStringValue(record, "source") ?? "",
    purpose: getStringValue(record, "purpose") ?? "",
    referenceTime: getStringValue(record, "reference_time") ?? "",
    releaseSchedule: getStringValue(record, "release_schedule") ?? "",
    updatedAt: getStringValue(record, "updated"),
  };
}

export function normalizeBberDbMetadataColumns(rawValue: unknown) {
  if (!Array.isArray(rawValue)) {
    return [];
  }

  return rawValue.flatMap((columnValue) => {
    if (!columnValue || typeof columnValue !== "object") {
      return [];
    }

    const columnRecord = columnValue as Record<string, unknown>;
    const tableName = getStringValue(columnRecord, "table_name");
    const columnName = getStringValue(columnRecord, "column_name");
    const displayName = getStringValue(columnRecord, "display_name");
    const columnDescription =
      getStringValue(columnRecord, "column_description") ?? "";

    if (!tableName || !columnName || !displayName) {
      return [];
    }

    return [
      {
        table_name: tableName,
        column_name: columnName,
        display_name: displayName,
        column_description: columnDescription,
      } satisfies BberDbMetadataColumn,
    ];
  });
}

export function normalizeBberDbRows(rawValue: unknown) {
  if (!Array.isArray(rawValue)) {
    return [];
  }

  return rawValue.filter((row): row is BberDbRawRecord =>
    Boolean(row && typeof row === "object"),
  );
}

export function getBberDbSentinelLabel(value: unknown) {
  const normalizedValue =
    typeof value === "string" ? Number(value.trim()) : value;

  if (
    typeof normalizedValue !== "number" ||
    !Number.isInteger(normalizedValue) ||
    normalizedValue >= 0
  ) {
    return null;
  }

  const sentinelIndex = Math.abs(normalizedValue) - 1;
  return BBER_DB_SENTINEL_LABELS[sentinelIndex] ?? null;
}

export function formatBberDbDisplayValue(value: unknown) {
  const sentinelLabel = getBberDbSentinelLabel(value);

  if (sentinelLabel) {
    return sentinelLabel;
  }

  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  if (
    typeof value === "number" ||
    typeof value === "boolean" ||
    typeof value === "bigint"
  ) {
    return String(value);
  }

  return JSON.stringify(value);
}

export function buildBberDbColumns(
  rows: BberDbRawRecord[],
  metadataColumns: BberDbMetadataColumn[],
) {
  const rowKeys = new Set(rows.flatMap((row) => Object.keys(row)));
  const orderedKeys: string[] = [];

  for (const preferredKey of BBER_DB_LEADING_CONTEXT_COLUMN_KEYS) {
    if (rowKeys.has(preferredKey) && !orderedKeys.includes(preferredKey)) {
      orderedKeys.push(preferredKey);
    }
  }

  for (const column of metadataColumns) {
    if (
      rowKeys.has(column.column_name) &&
      !orderedKeys.includes(column.column_name)
    ) {
      orderedKeys.push(column.column_name);
    }
  }

  for (const row of rows) {
    for (const key of Object.keys(row)) {
      if (!orderedKeys.includes(key)) {
        orderedKeys.push(key);
      }
    }
  }

  const metadataLookup = new Map(
    metadataColumns.map((column) => [column.column_name, column]),
  );

  return orderedKeys.map((key) => ({
    key,
    header:
      BBER_DB_COLUMN_HEADER_OVERRIDES[key] ??
      metadataLookup.get(key)?.display_name ??
      key,
    description: metadataLookup.get(key)?.column_description ?? null,
  })) satisfies BberDbTableColumn[];
}

function compareBberDbRows(
  leftRow: BberDbRawRecord,
  rightRow: BberDbRawRecord,
) {
  const leftYear = getStringValue(leftRow, "periodyear");
  const rightYear = getStringValue(rightRow, "periodyear");
  const leftYearNumeric = leftYear ? getNumericSortValue(leftYear) : Number.NaN;
  const rightYearNumeric = rightYear
    ? getNumericSortValue(rightYear)
    : Number.NaN;

  if (
    Number.isFinite(leftYearNumeric) &&
    Number.isFinite(rightYearNumeric) &&
    leftYearNumeric !== rightYearNumeric
  ) {
    return rightYearNumeric - leftYearNumeric;
  }

  if (leftYear && rightYear && leftYear !== rightYear) {
    return rightYear.localeCompare(leftYear);
  }

  const leftPeriod = getStringValue(leftRow, "period");
  const rightPeriod = getStringValue(rightRow, "period");
  const leftPeriodNumeric = leftPeriod
    ? getNumericSortValue(leftPeriod)
    : Number.NaN;
  const rightPeriodNumeric = rightPeriod
    ? getNumericSortValue(rightPeriod)
    : Number.NaN;

  if (
    Number.isFinite(leftPeriodNumeric) &&
    Number.isFinite(rightPeriodNumeric) &&
    leftPeriodNumeric !== rightPeriodNumeric
  ) {
    return rightPeriodNumeric - leftPeriodNumeric;
  }

  if (leftPeriod && rightPeriod && leftPeriod !== rightPeriod) {
    return rightPeriod.localeCompare(leftPeriod);
  }

  const leftGeography = getStringValue(leftRow, "geographyname");
  const rightGeography = getStringValue(rightRow, "geographyname");

  if (leftGeography && rightGeography && leftGeography !== rightGeography) {
    return leftGeography.localeCompare(rightGeography);
  }

  return 0;
}

export function buildBberDbTableRows(
  rows: BberDbRawRecord[],
  columns: BberDbTableColumn[],
) {
  return [...rows].sort(compareBberDbRows).map((row, rowIndex) => ({
    id:
      [
        formatBberDbDisplayValue(row.geographyname),
        formatBberDbDisplayValue(row.periodyear),
        formatBberDbDisplayValue(row.period),
        rowIndex,
      ].join("-") || String(rowIndex),
    cells: columns.map((column) => formatBberDbDisplayValue(row[column.key])),
  })) satisfies BberDbTableRow[];
}

export function buildBberDbResultTitle(rows: BberDbRawRecord[]) {
  const seenLabels = new Set<string>();
  const geographyLabels: string[] = [];

  for (const row of rows) {
    const geographyLabel = getStringValue(row, "geographyname");

    if (!geographyLabel || seenLabels.has(geographyLabel)) {
      continue;
    }

    seenLabels.add(geographyLabel);
    geographyLabels.push(geographyLabel);
  }

  if (geographyLabels.length === 0) {
    return "Table data";
  }

  if (geographyLabels.length === 1) {
    return geographyLabels[0];
  }

  if (geographyLabels.length <= 3) {
    return geographyLabels.join(" / ");
  }

  return `${geographyLabels[0]} and ${geographyLabels.length - 1} more geographies`;
}

export function buildBberDbSourceLine(args: {
  query: BberDbAppliedQuery;
  sourceLabel: string;
}) {
  const yearLabel = formatBberDbYearSelection(args.query.periodyear);

  if (yearLabel) {
    return `Data Source: ${yearLabel} ${args.sourceLabel}`.trim();
  }

  return `Data Source: ${args.sourceLabel}`.trim();
}

export function buildBberDbUpstreamUnavailableMessage(args: {
  tableName: string;
  detail?: string | null;
}) {
  const datasetLabel =
    findBberDbDatasetByTable(args.tableName)?.label ?? args.tableName;
  const detail = args.detail?.trim();

  if (detail) {
    return `The upstream BBER data service is currently unavailable for ${datasetLabel}. ${detail}`;
  }

  return `The upstream BBER data service is currently unavailable for ${datasetLabel}.`;
}
