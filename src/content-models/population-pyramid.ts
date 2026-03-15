export type PopulationPyramidRequestConfig = {
  table: "pep_cc";
  areatype: string;
  area: string;
  periodtype: string;
  variables: string[];
};

export type PopulationPyramidSourceMetadata = {
  tableName: string;
  title: string;
  description: string;
  source: string;
  purpose: string;
  referenceTime: string;
  releaseSchedule: string;
  updatedAt: string | null;
};

export type PopulationPyramidRow = {
  geographyName: string;
  periodLabel: string;
  year: number;
  ageGroupCode: number;
  timeOrder: number;
  malePopulation: number;
  femalePopulation: number;
};

export type PopulationPyramidBand = {
  ageGroupCode: number;
  ageGroupLabel: string;
  malePopulation: number;
  femalePopulation: number;
  totalPopulation: number;
};

export type PopulationPyramidFrame = {
  year: number;
  yearLabel: string;
  totalPopulation: number;
  malePopulation: number;
  femalePopulation: number;
  largestBandLabel: string;
  largestBandPopulation: number;
  bands: PopulationPyramidBand[];
};

export type PopulationPyramidCoverage = {
  years: number[];
  startYear: number | null;
  endYear: number | null;
  maxBandPopulation: number;
  warningMessages: string[];
};

export type PopulationPyramidChartModel = {
  chartTitle: string;
  chartSubtitle: string;
  summary: string;
  frames: PopulationPyramidFrame[];
  initialYear: number | null;
  notes: string[];
  coverage: PopulationPyramidCoverage;
};

export type PopulationPyramidPageData = {
  eyebrow: string;
  title: string;
  description: string;
  methodology: string;
  geographyLabel: string;
  requestConfig: PopulationPyramidRequestConfig;
  chart: PopulationPyramidChartModel;
  sourceMetadata: PopulationPyramidSourceMetadata;
};

export type BuildPopulationPyramidFramesResult = {
  frames: PopulationPyramidFrame[];
  coverage: PopulationPyramidCoverage;
};

const DEFAULT_POPULATION_PYRAMID_CONFIG: PopulationPyramidRequestConfig = {
  table: "pep_cc",
  areatype: "01",
  area: "000000",
  periodtype: "65",
  variables: ["tot_female", "tot_male", "agegrp", "time"],
};

const AGE_GROUP_LABELS = new Map<number, string>([
  [1, "0 - 4"],
  [2, "5 - 9"],
  [3, "10 - 14"],
  [4, "15 - 19"],
  [5, "20 - 24"],
  [6, "25 - 29"],
  [7, "30 - 34"],
  [8, "35 - 39"],
  [9, "40 - 44"],
  [10, "45 - 49"],
  [11, "50 - 54"],
  [12, "55 - 59"],
  [13, "60 - 64"],
  [14, "65 - 69"],
  [15, "70 - 74"],
  [16, "75 - 79"],
  [17, "80 - 84"],
  [18, "85 +"],
]);

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

function buildSummary(frame: PopulationPyramidFrame) {
  const femaleShare =
    frame.totalPopulation > 0
      ? (frame.femalePopulation / frame.totalPopulation) * 100
      : 0;

  return `The ${frame.yearLabel} frame peaks in ages ${frame.largestBandLabel}, and women account for ${femaleShare.toFixed(1)}% of the statewide population.`;
}

export function getDefaultPopulationPyramidConfig() {
  return DEFAULT_POPULATION_PYRAMID_CONFIG;
}

export function normalizePopulationPyramidRows(
  rawRows: unknown,
): PopulationPyramidRow[] {
  if (!Array.isArray(rawRows)) {
    return [];
  }

  const rows: PopulationPyramidRow[] = [];

  for (const rawRow of rawRows) {
    if (!rawRow || typeof rawRow !== "object") {
      continue;
    }

    const record = rawRow as Record<string, unknown>;
    const geographyName = getStringValue(record, "geographyname");
    const periodLabel = getStringValue(record, "periodtypename");
    const year = getNumberValue(record, "periodyear");
    const ageGroupCode = getNumberValue(record, "agegrp");
    const timeOrder = getNumberValue(record, "time") ?? 0;
    const malePopulation = getNumberValue(record, "tot_male");
    const femalePopulation = getNumberValue(record, "tot_female");

    if (
      !geographyName ||
      !periodLabel ||
      year === null ||
      ageGroupCode === null ||
      malePopulation === null ||
      femalePopulation === null
    ) {
      continue;
    }

    rows.push({
      geographyName,
      periodLabel,
      year,
      ageGroupCode,
      timeOrder,
      malePopulation,
      femalePopulation,
    });
  }

  return rows.sort((leftRow, rightRow) => {
    if (leftRow.year !== rightRow.year) {
      return leftRow.year - rightRow.year;
    }

    return leftRow.ageGroupCode - rightRow.ageGroupCode;
  });
}

export function normalizePopulationPyramidSourceMetadata(
  rawValue: unknown,
): PopulationPyramidSourceMetadata {
  const record =
    rawValue && typeof rawValue === "object"
      ? (rawValue as Record<string, unknown>)
      : {};

  return {
    tableName: getStringValue(record, "table_name") ?? "pep_cc",
    title:
      getStringValue(record, "data_title") ??
      "County Characteristics - Population Estimate Program",
    description:
      getStringValue(record, "data_description") ??
      "Published population estimates by age and sex.",
    source:
      getStringValue(record, "source") ??
      "US Census Bureau, Population Division",
    purpose: getStringValue(record, "purpose") ?? "",
    referenceTime: getStringValue(record, "reference_time") ?? "",
    releaseSchedule: getStringValue(record, "release_schedule") ?? "",
    updatedAt: getStringValue(record, "updated"),
  };
}

export function buildPopulationPyramidFrames(
  rows: PopulationPyramidRow[],
): BuildPopulationPyramidFramesResult {
  const rowsByYear = new Map<number, PopulationPyramidRow[]>();

  for (const row of rows) {
    const yearRows = rowsByYear.get(row.year) ?? [];
    yearRows.push(row);
    rowsByYear.set(row.year, yearRows);
  }

  const warningMessages: string[] = [];
  const derivedTotalYears: number[] = [];
  const duplicateAgeGroupYears: number[] = [];
  const missingBandYears: number[] = [];
  const frames: PopulationPyramidFrame[] = [];
  let maxBandPopulation = 0;

  for (const [year, yearRows] of [...rowsByYear.entries()].sort(
    ([leftYear], [rightYear]) => leftYear - rightYear,
  )) {
    const latestRowsByAgeGroup = new Map<number, PopulationPyramidRow>();

    for (const row of yearRows) {
      const previousRow = latestRowsByAgeGroup.get(row.ageGroupCode);

      if (previousRow) {
        duplicateAgeGroupYears.push(year);
      }

      if (!previousRow || row.timeOrder >= previousRow.timeOrder) {
        latestRowsByAgeGroup.set(row.ageGroupCode, row);
      }
    }

    const resolvedRows = [...latestRowsByAgeGroup.values()].sort(
      (leftRow, rightRow) => leftRow.ageGroupCode - rightRow.ageGroupCode,
    );
    const totalRow = resolvedRows.find((row) => row.ageGroupCode === 0) ?? null;
    const bands = resolvedRows
      .filter((row) => AGE_GROUP_LABELS.has(row.ageGroupCode))
      .map((row) => {
        const band: PopulationPyramidBand = {
          ageGroupCode: row.ageGroupCode,
          ageGroupLabel:
            AGE_GROUP_LABELS.get(row.ageGroupCode) ?? String(row.ageGroupCode),
          malePopulation: row.malePopulation,
          femalePopulation: row.femalePopulation,
          totalPopulation: row.malePopulation + row.femalePopulation,
        };

        maxBandPopulation = Math.max(
          maxBandPopulation,
          band.malePopulation,
          band.femalePopulation,
        );

        return band;
      })
      .sort((leftBand, rightBand) => {
        return leftBand.ageGroupCode - rightBand.ageGroupCode;
      });

    if (bands.length === 0) {
      continue;
    }

    if (bands.length !== AGE_GROUP_LABELS.size) {
      missingBandYears.push(year);
    }

    const summedMalePopulation = bands.reduce(
      (total, band) => total + band.malePopulation,
      0,
    );
    const summedFemalePopulation = bands.reduce(
      (total, band) => total + band.femalePopulation,
      0,
    );
    const malePopulation = totalRow?.malePopulation ?? summedMalePopulation;
    const femalePopulation =
      totalRow?.femalePopulation ?? summedFemalePopulation;
    const totalPopulation = malePopulation + femalePopulation;
    const largestBand =
      bands.reduce((largest, band) => {
        return band.totalPopulation > largest.totalPopulation ? band : largest;
      }, bands[0]) ?? bands[0];

    if (!totalRow) {
      derivedTotalYears.push(year);
    }

    frames.push({
      year,
      yearLabel: String(year),
      totalPopulation,
      malePopulation,
      femalePopulation,
      largestBandLabel: largestBand.ageGroupLabel,
      largestBandPopulation: largestBand.totalPopulation,
      bands,
    });
  }

  if (derivedTotalYears.length > 0) {
    warningMessages.push(
      `Published total rows were missing for ${derivedTotalYears.join(", ")}, so those annual totals were derived from the reported age bands.`,
    );
  }

  if (duplicateAgeGroupYears.length > 0) {
    const resolvedYears = [...new Set(duplicateAgeGroupYears)].sort(
      (leftYear, rightYear) => leftYear - rightYear,
    );

    warningMessages.push(
      `The upstream response published duplicate age-band rows for ${resolvedYears.join(", ")}. The latest time-stamped row for each age band is used in the chart.`,
    );
  }

  if (missingBandYears.length > 0) {
    warningMessages.push(
      `Some annual frames are missing one or more age bands in the upstream response: ${missingBandYears.join(", ")}.`,
    );
  }

  const years = frames.map((frame) => frame.year);

  if (frames.length === 0) {
    warningMessages.push(
      "The BBER API returned no plottable population pyramid rows for this configuration.",
    );
  }

  return {
    frames,
    coverage: {
      years,
      startYear: years[0] ?? null,
      endYear: years.at(-1) ?? null,
      maxBandPopulation,
      warningMessages,
    },
  };
}

export function buildPopulationPyramidChartModel(args: {
  geographyLabel: string;
  periodLabel: string;
  frames: PopulationPyramidFrame[];
  coverage: PopulationPyramidCoverage;
  sourceMetadata: PopulationPyramidSourceMetadata;
}): PopulationPyramidChartModel {
  const latestFrame = args.frames.at(-1) ?? null;
  const chartTitle = `${args.geographyLabel} Population Pyramid`;
  const chartSubtitle = `${args.periodLabel} age and sex estimates`;
  const notes = [`Source: ${args.sourceMetadata.source}.`];

  if (args.sourceMetadata.referenceTime) {
    notes.push(`Reference time: ${args.sourceMetadata.referenceTime}.`);
  }

  if (args.sourceMetadata.releaseSchedule) {
    notes.push(`Release schedule: ${args.sourceMetadata.releaseSchedule}.`);
  }

  return {
    chartTitle,
    chartSubtitle,
    summary: latestFrame
      ? buildSummary(latestFrame)
      : "No annual population pyramid frames are currently available for this geography.",
    frames: args.frames,
    initialYear: latestFrame?.year ?? null,
    notes,
    coverage: args.coverage,
  };
}
