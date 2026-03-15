export type EducationDonutRequestConfig = {
  table: "dp02";
  areatype: string;
  area: string;
  periodyear: string;
  periodtype: string;
  variables: string[];
};

export type EducationDonutSourceMetadata = {
  tableName: string;
  title: string;
  description: string;
  source: string;
  purpose: string;
  referenceTime: string;
  releaseSchedule: string;
  updatedAt: string | null;
};

export type EducationDonutColumnMetadata = {
  variable: string;
  label: string;
  description: string;
};

export type EducationDonutSlice = {
  variable: string;
  label: string;
  description: string;
  value: number;
  share: number;
  color: string;
};

export type EducationDonutChartModel = {
  chartTitle: string;
  chartSubtitle: string;
  summary: string;
  totalAdults: number;
  slices: EducationDonutSlice[];
  notes: string[];
  warningMessages: string[];
};

export type EducationDonutPageData = {
  eyebrow: string;
  title: string;
  description: string;
  methodology: string;
  geographyLabel: string;
  yearLabel: string;
  requestConfig: EducationDonutRequestConfig;
  chart: EducationDonutChartModel;
  sourceMetadata: EducationDonutSourceMetadata;
};

type EducationDonutRow = {
  geographyName: string;
  periodLabel: string;
  year: number;
  values: Map<string, number>;
};

type BuildEducationDonutChartModelArgs = {
  row: EducationDonutRow | null;
  columns: EducationDonutColumnMetadata[];
  sourceMetadata: EducationDonutSourceMetadata;
};

const EDUCATION_DONUT_VARIABLES = [
  "eduattain_25plus_less9_e",
  "eduattain_25plus_9to12nodiploma_e",
  "eduattain_25plus_hsgradandequiv_e",
  "eduattain_25plus_somecollegenodegree_e",
  "eduattain_25plus_associatedegree_e",
  "eduattain_25plus_bachelor_e",
  "eduattain_25plus_graduateorprofessionaldegree_e",
] as const;

const EDUCATION_DONUT_COLORS = [
  "#7A0019",
  "#A61E2D",
  "#C44E3B",
  "#D8A14E",
  "#E7C97A",
  "#5B7C99",
  "#243140",
] as const;

const DEFAULT_EDUCATION_DONUT_CONFIG: EducationDonutRequestConfig = {
  table: "dp02",
  areatype: "01",
  area: "000000",
  periodyear: "2023",
  periodtype: "60",
  variables: [...EDUCATION_DONUT_VARIABLES],
};

function getStringValue(record: Record<string, unknown>, key: string) {
  const value = record[key];

  if (typeof value !== "string") {
    return null;
  }

  const trimmedValue = value.trim();
  return trimmedValue.length > 0 ? trimmedValue : null;
}

function getNumberValue(record: Record<string, unknown>, key: string) {
  const value = record[key];

  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim().length > 0) {
    const parsedValue = Number(value.replace(/[,\s]/g, ""));
    return Number.isFinite(parsedValue) ? parsedValue : null;
  }

  return null;
}

function buildSummary({
  geographyLabel,
  yearLabel,
  largestSlice,
}: {
  geographyLabel: string;
  yearLabel: string;
  largestSlice: EducationDonutSlice | null;
}) {
  if (!largestSlice) {
    return `No published attainment estimates are available for ${geographyLabel} in ${yearLabel}.`;
  }

  return `${largestSlice.label} is the largest attainment group in ${geographyLabel} for ${yearLabel}, representing ${(largestSlice.share * 100).toFixed(1)}% of adults ages 25 and over.`;
}

export function getDefaultEducationDonutConfig() {
  return DEFAULT_EDUCATION_DONUT_CONFIG;
}

export function normalizeEducationDonutRow(rawRows: unknown) {
  if (!Array.isArray(rawRows)) {
    return null;
  }

  const firstValidRow = rawRows.find(
    (rawRow) => rawRow && typeof rawRow === "object",
  );

  if (!firstValidRow || typeof firstValidRow !== "object") {
    return null;
  }

  const record = firstValidRow as Record<string, unknown>;
  const geographyName = getStringValue(record, "geographyname");
  const periodLabel = getStringValue(record, "periodtypename");
  const year = getNumberValue(record, "periodyear");

  if (!geographyName || !periodLabel || year === null) {
    return null;
  }

  const values = new Map<string, number>();

  for (const variable of EDUCATION_DONUT_VARIABLES) {
    const value = getNumberValue(record, variable);

    if (value !== null) {
      values.set(variable, value);
    }
  }

  return {
    geographyName,
    periodLabel,
    year,
    values,
  } satisfies EducationDonutRow;
}

export function normalizeEducationDonutColumns(
  rawColumns: unknown,
): EducationDonutColumnMetadata[] {
  if (!Array.isArray(rawColumns)) {
    return [];
  }

  const columnsByVariable = new Map<string, EducationDonutColumnMetadata>();

  for (const rawColumn of rawColumns) {
    if (!rawColumn || typeof rawColumn !== "object") {
      continue;
    }

    const record = rawColumn as Record<string, unknown>;
    const variable = getStringValue(record, "column_name");

    if (!variable || !EDUCATION_DONUT_VARIABLES.includes(variable as never)) {
      continue;
    }

    columnsByVariable.set(variable, {
      variable,
      label: getStringValue(record, "display_name") ?? variable,
      description: getStringValue(record, "column_description") ?? "",
    });
  }

  return EDUCATION_DONUT_VARIABLES.map((variable) => {
    return (
      columnsByVariable.get(variable) ?? {
        variable,
        label: variable,
        description: "",
      }
    );
  });
}

export function normalizeEducationDonutSourceMetadata(
  rawValue: unknown,
): EducationDonutSourceMetadata {
  const record =
    rawValue && typeof rawValue === "object"
      ? (rawValue as Record<string, unknown>)
      : {};

  return {
    tableName: getStringValue(record, "table_name") ?? "dp02",
    title:
      getStringValue(record, "data_title") ??
      "ACS Data Profile - Selected Social Characteristics",
    description:
      getStringValue(record, "data_description") ??
      "Selected social characteristics from the American Community Survey.",
    source: getStringValue(record, "source") ?? "US Census Bureau",
    purpose: getStringValue(record, "purpose") ?? "",
    referenceTime: getStringValue(record, "reference_time") ?? "",
    releaseSchedule: getStringValue(record, "release_schedule") ?? "",
    updatedAt: getStringValue(record, "updated"),
  };
}

export function buildEducationDonutChartModel({
  row,
  columns,
  sourceMetadata,
}: BuildEducationDonutChartModelArgs): EducationDonutChartModel {
  const warningMessages: string[] = [];

  if (!row) {
    return {
      chartTitle: "Highest Level of Educational Attainment: 25 years +",
      chartSubtitle: "No published frame available",
      summary:
        "The upstream response did not include a plottable educational attainment record for this request.",
      totalAdults: 0,
      slices: [],
      notes: [
        "This chart uses the published `dp02` educational attainment estimate fields for adults ages 25 and over.",
      ],
      warningMessages: [
        "No plottable educational attainment values were returned by the upstream response.",
      ],
    };
  }

  const missingVariables = columns
    .map((column) => column.variable)
    .filter((variable) => !row.values.has(variable));

  if (missingVariables.length > 0) {
    warningMessages.push(
      `The upstream response did not publish values for ${missingVariables.length} requested attainment categories, so those slices were omitted from the donut and table.`,
    );
  }

  const slices: EducationDonutSlice[] = [];

  for (const [index, column] of columns.entries()) {
    const value = row.values.get(column.variable);

    if (value === undefined || value < 0) {
      continue;
    }

    slices.push({
      variable: column.variable,
      label: column.label,
      description: column.description,
      value,
      share: 0,
      color:
        EDUCATION_DONUT_COLORS[index % EDUCATION_DONUT_COLORS.length] ??
        EDUCATION_DONUT_COLORS[0],
    });
  }

  const totalAdults = slices.reduce((sum, slice) => sum + slice.value, 0);

  if (totalAdults <= 0) {
    warningMessages.push(
      "The response did not include a positive total across the requested attainment categories.",
    );
  }

  const slicesWithShares = slices.map((slice) => {
    return {
      ...slice,
      share: totalAdults > 0 ? slice.value / totalAdults : 0,
    };
  });

  const largestSlice =
    slicesWithShares.reduce<EducationDonutSlice | null>((largest, slice) => {
      if (!largest || slice.value > largest.value) {
        return slice;
      }

      return largest;
    }, null) ?? null;

  return {
    chartTitle: "Highest Level of Educational Attainment: 25 years +",
    chartSubtitle: `${row.geographyName} · ${row.year} · ${row.periodLabel}`,
    summary: buildSummary({
      geographyLabel: row.geographyName,
      yearLabel: String(row.year),
      largestSlice,
    }),
    totalAdults,
    slices: slicesWithShares,
    notes: [
      "Each slice uses the published ACS estimate for adults ages 25 and over in the selected educational attainment group.",
      "Shares are derived from the live total across the requested attainment categories rather than from hardcoded page copy.",
      `Source: ${sourceMetadata.source}. ${sourceMetadata.referenceTime}`.trim(),
    ],
    warningMessages,
  };
}

export function buildEducationDonutPageData(args: {
  row: EducationDonutRow | null;
  columns: EducationDonutColumnMetadata[];
  sourceMetadata: EducationDonutSourceMetadata;
}): EducationDonutPageData {
  const chart = buildEducationDonutChartModel(args);
  const geographyLabel = args.row?.geographyName ?? "Selected geography";
  const yearLabel = args.row ? String(args.row.year) : "Not available";

  return {
    eyebrow: "External Data Visualization",
    title: "Educational Attainment Donut",
    description:
      "This page recreates the statewide donut view for the highest educational attainment reported among New Mexico residents ages 25 and over.",
    methodology:
      "The server requests one published `dp02` ACS frame, maps the selected educational attainment variables into ordered donut slices, and derives the displayed shares from the live response before rendering the chart and audit table.",
    geographyLabel,
    yearLabel,
    requestConfig: getDefaultEducationDonutConfig(),
    chart,
    sourceMetadata: args.sourceMetadata,
  };
}
