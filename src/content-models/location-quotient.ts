export type QcewSelection = {
  stfips: string;
  areatype: string;
  area?: string;
  periodtype: string;
  ownership: string;
};

export type QcewPinnedSelection = QcewSelection & {
  periodyear: number;
};

export type QcewMetadataOption = {
  value: string;
  label: string;
};

export type LocationQuotientRequestConfig = {
  local: QcewSelection;
  base: QcewSelection;
  baseTime: QcewPinnedSelection;
};

export type LocationQuotientSelectionSummary = {
  geographyLabel: string;
  geographyTypeLabel: string;
  ownershipLabel: string;
  periodLabel: string;
  summaryLabel: string;
};

export type LocationQuotientPoint = {
  year: number;
  yearLabel: string;
  industryCode: string;
  industryLabel: string;
  locationQuotient: number;
  growthSinceBaseYear: number;
  bubbleSize: number;
  localEmployment: number;
  baseEmployment: number;
  localIndustryShare: number;
  baseIndustryShare: number;
};

export type LocationQuotientFrame = {
  year: number;
  yearLabel: string;
  points: LocationQuotientPoint[];
};

export type LocationQuotientCoverage = {
  years: number[];
  startYear: number | null;
  endYear: number | null;
  hiddenIndustryCodes: string[];
  warningMessages: string[];
};

export type LocationQuotientSourceMetadata = {
  tableName: string;
  title: string;
  description: string;
  source: string;
  purpose: string;
  referenceTime: string;
  releaseSchedule: string;
  updatedAt: string | null;
};

export type LocationQuotientChartModel = {
  chartTitle: string;
  chartSubtitle: string;
  summary: string;
  frames: LocationQuotientFrame[];
  initialYear: number | null;
  baseYear: number;
  notes: string[];
  coverage: LocationQuotientCoverage;
};

export type LocationQuotientPageData = {
  eyebrow: string;
  title: string;
  description: string;
  methodology: string;
  requestConfig: LocationQuotientRequestConfig;
  localSelection: LocationQuotientSelectionSummary;
  baseSelection: LocationQuotientSelectionSummary;
  baseTimeSelection: LocationQuotientSelectionSummary;
  chart: LocationQuotientChartModel;
  sourceMetadata: LocationQuotientSourceMetadata;
};

export type QcewDataRow = {
  geographyName: string;
  year: number;
  periodType: string;
  industryCode: string;
  averageEmployment: number | null;
};

export type BuildLocationQuotientFramesResult = {
  frames: LocationQuotientFrame[];
  coverage: LocationQuotientCoverage;
};

const DEFAULT_LOCATION_QUOTIENT_CONFIG: LocationQuotientRequestConfig = {
  local: {
    stfips: "35",
    areatype: "01",
    area: "000000",
    periodtype: "01",
    ownership: "50",
  },
  base: {
    stfips: "00",
    areatype: "00",
    area: "000000",
    periodtype: "01",
    ownership: "50",
  },
  baseTime: {
    stfips: "35",
    areatype: "01",
    area: "000000",
    periodtype: "01",
    ownership: "50",
    periodyear: 2010,
  },
};

const FILTERED_INDUSTRY_CODES = new Set(["00", "10", "99"]);

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
    const parsedValue = Number(value.replace(/[$,%\s,]/g, ""));
    return Number.isFinite(parsedValue) ? parsedValue : null;
  }

  return null;
}

function buildObservationKey(year: number, industryCode: string) {
  return `${year}:${industryCode}`;
}

function buildGeographyLabel(
  geographyName: string,
  geographyTypeLabel: string,
) {
  if (geographyName === geographyTypeLabel) {
    return geographyName;
  }

  return `${geographyName} (${geographyTypeLabel})`;
}

function buildOptionLookup(options: QcewMetadataOption[]) {
  return new Map(options.map((option) => [option.value, option.label]));
}

function buildRowsByObservation(rows: QcewDataRow[]) {
  const rowsByObservation = new Map<string, QcewDataRow>();

  for (const row of rows) {
    rowsByObservation.set(buildObservationKey(row.year, row.industryCode), row);
  }

  return rowsByObservation;
}

function buildTotalsByYear(rows: QcewDataRow[]) {
  const totalsByYear = new Map<number, number>();

  for (const row of rows) {
    if (row.industryCode !== "00" || row.averageEmployment === null) {
      continue;
    }

    totalsByYear.set(row.year, row.averageEmployment);
  }

  return totalsByYear;
}

function buildIndustryRowsByCode(rows: QcewDataRow[]) {
  const rowsByCode = new Map<string, QcewDataRow>();

  for (const row of rows) {
    rowsByCode.set(row.industryCode, row);
  }

  return rowsByCode;
}

function collectYears(rows: QcewDataRow[]) {
  return new Set(rows.map((row) => row.year));
}

export function getDefaultLocationQuotientConfig() {
  return DEFAULT_LOCATION_QUOTIENT_CONFIG;
}

export function normalizeQcewMetadataOptions(
  rawValues: unknown,
  valueKey: string,
): QcewMetadataOption[] {
  if (!Array.isArray(rawValues)) {
    return [];
  }

  const seenValues = new Set<string>();
  const options: QcewMetadataOption[] = [];

  for (const rawValue of rawValues) {
    if (!rawValue || typeof rawValue !== "object") {
      continue;
    }

    const record = rawValue as Record<string, unknown>;
    const value = getStringValue(record, valueKey);

    if (!value || seenValues.has(value)) {
      continue;
    }

    const label = getStringValue(record, "displayname") ?? value;

    options.push({
      value,
      label,
    });
    seenValues.add(value);
  }

  return options;
}

export function normalizeQcewRows(rawRows: unknown): QcewDataRow[] {
  if (!Array.isArray(rawRows)) {
    return [];
  }

  const rows: QcewDataRow[] = [];

  for (const rawRow of rawRows) {
    if (!rawRow || typeof rawRow !== "object") {
      continue;
    }

    const record = rawRow as Record<string, unknown>;
    const geographyName = getStringValue(record, "geographyname") ?? "Unknown";
    const year = getNumberValue(record, "periodyear");
    const periodType = getStringValue(record, "periodtype") ?? "";
    const industryCode = getStringValue(record, "indcode");

    if (!year || !industryCode) {
      continue;
    }

    rows.push({
      geographyName,
      year,
      periodType,
      industryCode,
      averageEmployment: getNumberValue(record, "avgemp"),
    });
  }

  return rows.sort((leftRow, rightRow) => {
    if (leftRow.year === rightRow.year) {
      return leftRow.industryCode.localeCompare(rightRow.industryCode);
    }

    return leftRow.year - rightRow.year;
  });
}

export function normalizeLocationQuotientSourceMetadata(
  rawValue: unknown,
): LocationQuotientSourceMetadata {
  const record =
    rawValue && typeof rawValue === "object"
      ? (rawValue as Record<string, unknown>)
      : {};

  return {
    tableName: getStringValue(record, "table_name") ?? "qcew",
    title:
      getStringValue(record, "data_title") ??
      "Quarterly Census of Employment and Wages",
    description:
      getStringValue(record, "data_description") ??
      "Published employment and wage estimates by geography and industry.",
    source: getStringValue(record, "source") ?? "US Bureau of Labor Statistics",
    purpose: getStringValue(record, "purpose") ?? "",
    referenceTime: getStringValue(record, "reference_time") ?? "",
    releaseSchedule: getStringValue(record, "release_schedule") ?? "",
    updatedAt: getStringValue(record, "updated"),
  };
}

export function buildLocationQuotientSelectionSummary(args: {
  selection: QcewSelection;
  geographyName: string;
  areaTypeOptions: QcewMetadataOption[];
  ownershipOptions: QcewMetadataOption[];
  periodOptions: QcewMetadataOption[];
  pinnedYear?: number;
}): LocationQuotientSelectionSummary {
  const geographyTypeLookup = buildOptionLookup(args.areaTypeOptions);
  const ownershipLookup = buildOptionLookup(args.ownershipOptions);
  const periodLookup = buildOptionLookup(args.periodOptions);
  const geographyTypeLabel =
    geographyTypeLookup.get(args.selection.areatype) ?? args.selection.areatype;
  const ownershipLabel =
    ownershipLookup.get(args.selection.ownership) ?? args.selection.ownership;
  const periodLabel =
    periodLookup.get(args.selection.periodtype) ?? args.selection.periodtype;
  const geographyLabel = buildGeographyLabel(
    args.geographyName,
    geographyTypeLabel,
  );

  const summaryParts = [geographyLabel, ownershipLabel, periodLabel];

  if (args.pinnedYear) {
    summaryParts.push(`Base year ${args.pinnedYear}`);
  }

  return {
    geographyLabel,
    geographyTypeLabel,
    ownershipLabel,
    periodLabel,
    summaryLabel: summaryParts.join(" · "),
  };
}

export function buildLocationQuotientFrames(args: {
  localRows: QcewDataRow[];
  baseRows: QcewDataRow[];
  baseTimeRows: QcewDataRow[];
  localTotalRows: QcewDataRow[];
  baseTotalRows: QcewDataRow[];
  industryOptions: QcewMetadataOption[];
  minimumYear: number;
}): BuildLocationQuotientFramesResult {
  const localRowsByObservation = buildRowsByObservation(args.localRows);
  const baseRowsByObservation = buildRowsByObservation(args.baseRows);
  const baseTimeRowsByCode = buildIndustryRowsByCode(args.baseTimeRows);
  const localTotalsByYear = buildTotalsByYear(args.localTotalRows);
  const baseTotalsByYear = buildTotalsByYear(args.baseTotalRows);
  const industryLookup = buildOptionLookup(args.industryOptions);
  const candidateIndustryCodes = args.industryOptions
    .map((option) => option.value)
    .filter((industryCode) => !FILTERED_INDUSTRY_CODES.has(industryCode));
  const overlappingYears = Array.from(collectYears(args.localRows))
    .filter((year) => collectYears(args.baseRows).has(year))
    .filter((year) => localTotalsByYear.has(year) && baseTotalsByYear.has(year))
    .filter((year) => year >= args.minimumYear)
    .sort((leftYear, rightYear) => leftYear - rightYear);
  const missingBaseYearIndustryCodes = new Set<string>();
  const invalidObservationIndustryCodes = new Set<string>();
  const emptyYears = new Set<number>();
  const frames: LocationQuotientFrame[] = [];

  for (const year of overlappingYears) {
    const localTotalEmployment = localTotalsByYear.get(year);
    const baseTotalEmployment = baseTotalsByYear.get(year);
    const points: LocationQuotientPoint[] = [];

    if (
      localTotalEmployment === undefined ||
      baseTotalEmployment === undefined ||
      localTotalEmployment <= 0 ||
      baseTotalEmployment <= 0
    ) {
      emptyYears.add(year);
      continue;
    }

    for (const industryCode of candidateIndustryCodes) {
      const localRow = localRowsByObservation.get(
        buildObservationKey(year, industryCode),
      );
      const baseRow = baseRowsByObservation.get(
        buildObservationKey(year, industryCode),
      );
      const baseTimeRow = baseTimeRowsByCode.get(industryCode);
      const localEmployment = localRow?.averageEmployment ?? null;
      const baseEmployment = baseRow?.averageEmployment ?? null;
      const baseYearEmployment = baseTimeRow?.averageEmployment ?? null;

      if (baseYearEmployment === null || baseYearEmployment <= 0) {
        missingBaseYearIndustryCodes.add(industryCode);
        continue;
      }

      if (
        localEmployment === null ||
        baseEmployment === null ||
        localEmployment < 0 ||
        baseEmployment <= 0
      ) {
        invalidObservationIndustryCodes.add(industryCode);
        continue;
      }

      const localIndustryShare = localEmployment / localTotalEmployment;
      const baseIndustryShare = baseEmployment / baseTotalEmployment;

      if (localIndustryShare < 0 || baseIndustryShare <= 0) {
        invalidObservationIndustryCodes.add(industryCode);
        continue;
      }

      points.push({
        year,
        yearLabel: String(year),
        industryCode,
        industryLabel: industryLookup.get(industryCode) ?? industryCode,
        locationQuotient: localIndustryShare / baseIndustryShare,
        growthSinceBaseYear: localEmployment / baseYearEmployment - 1,
        bubbleSize: localEmployment,
        localEmployment,
        baseEmployment,
        localIndustryShare,
        baseIndustryShare,
      });
    }

    if (points.length === 0) {
      emptyYears.add(year);
      continue;
    }

    frames.push({
      year,
      yearLabel: String(year),
      points: points.sort((leftPoint, rightPoint) => {
        if (rightPoint.locationQuotient === leftPoint.locationQuotient) {
          return rightPoint.bubbleSize - leftPoint.bubbleSize;
        }

        return rightPoint.locationQuotient - leftPoint.locationQuotient;
      }),
    });
  }

  const warningMessages: string[] = [];

  if (overlappingYears.length === 0) {
    warningMessages.push(
      "No overlapping annual observations were available for the selected local and base geographies.",
    );
  }

  if (missingBaseYearIndustryCodes.size > 0) {
    warningMessages.push(
      `${missingBaseYearIndustryCodes.size} industries were omitted because the local base year does not report employment for them.`,
    );
  }

  if (invalidObservationIndustryCodes.size > 0) {
    warningMessages.push(
      `${invalidObservationIndustryCodes.size} industries were omitted because one or more yearly observations were missing or mathematically invalid for the LQ calculation.`,
    );
  }

  if (emptyYears.size > 0) {
    warningMessages.push(
      `${emptyYears.size} year${emptyYears.size === 1 ? "" : "s"} produced no plottable industries after validation.`,
    );
  }

  if (frames.length === 0) {
    warningMessages.push(
      "The current request did not return any industries that could be plotted after filtering aggregate rows and validating employment totals.",
    );
  }

  return {
    frames,
    coverage: {
      years: frames.map((frame) => frame.year),
      startYear: frames[0]?.year ?? null,
      endYear: frames[frames.length - 1]?.year ?? null,
      hiddenIndustryCodes: Array.from(FILTERED_INDUSTRY_CODES),
      warningMessages,
    },
  };
}
