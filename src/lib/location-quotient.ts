import "server-only";

import {
  buildLocationQuotientFrames,
  buildLocationQuotientSelectionSummary,
  getDefaultLocationQuotientConfig,
  type LocationQuotientPageData,
  type LocationQuotientRequestConfig,
  normalizeLocationQuotientSourceMetadata,
  normalizeQcewMetadataOptions,
  normalizeQcewRows,
  type QcewPinnedSelection,
  type QcewSelection,
} from "@/content-models/location-quotient";

const BBER_REST_ENDPOINT = "https://api.bber.unm.edu/api/data/rest/bbertable";
const BBER_METADATA_ENDPOINT =
  "https://api.bber.unm.edu/api/data/rest/metadata";

type BberTableResponse = {
  data?: unknown;
  metadata?: {
    table?: unknown;
  };
};

async function fetchExternalBberJson(
  endpoint: string,
  searchParams?: URLSearchParams,
) {
  const url = searchParams?.size
    ? `${endpoint}?${searchParams.toString()}`
    : endpoint;

  const response = await fetch(url, {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(
      `Location quotient request failed with status ${response.status}.`,
    );
  }

  return response.json();
}

function buildQcewSearchParams(
  selection: QcewSelection | QcewPinnedSelection,
  ownershipOverride?: string,
) {
  const searchParams = new URLSearchParams({
    table: "qcew",
    stfips: selection.stfips,
    areatype: selection.areatype,
    periodtype: selection.periodtype,
    ownership: ownershipOverride ?? selection.ownership,
  });

  if (selection.area) {
    searchParams.set("area", selection.area);
  }

  if ("periodyear" in selection) {
    searchParams.set("periodyear", String(selection.periodyear));
  }

  return searchParams;
}

async function fetchQcewTable(
  selection: QcewSelection | QcewPinnedSelection,
  ownershipOverride?: string,
) {
  return fetchExternalBberJson(
    BBER_REST_ENDPOINT,
    buildQcewSearchParams(selection, ownershipOverride),
  ) as Promise<BberTableResponse>;
}

async function fetchQcewMetadataValues(
  variableKeys: string[],
  searchFilters?: Record<string, string | undefined>,
) {
  const searchParams = new URLSearchParams({
    api: "tablevalues",
    table: "qcew",
    variables: `[${variableKeys.join(",")}]`,
  });

  if (searchFilters) {
    for (const [key, value] of Object.entries(searchFilters)) {
      if (value) {
        searchParams.set(key, value);
      }
    }
  }

  return fetchExternalBberJson(BBER_METADATA_ENDPOINT, searchParams);
}

function buildFallbackGeographyName(
  response: BberTableResponse,
  fallbackLabel: string,
) {
  const rows = normalizeQcewRows(response.data);
  return rows[0]?.geographyName ?? fallbackLabel;
}

function buildChartNotes(pageData: {
  sourceLabel: string;
  referenceTime: string;
  releaseSchedule: string;
  baseYear: number;
  localSelectionLabel: string;
  baseSelectionLabel: string;
}) {
  const notes = [
    `Location quotient compares the local industry employment share with the reference-area industry employment share for the same year.`,
    `Growth is measured as simple percent change in local employment since ${pageData.baseYear}.`,
    `Aggregate and unclassified rows (00, 10, and 99) are excluded from the bubble chart so each bubble represents a display sector.`,
    `Local comparison: ${pageData.localSelectionLabel}.`,
    `Reference comparison: ${pageData.baseSelectionLabel}.`,
    `Source: ${pageData.sourceLabel}.`,
  ];

  if (pageData.referenceTime) {
    notes.push(`Reference time: ${pageData.referenceTime}.`);
  }

  if (pageData.releaseSchedule) {
    notes.push(`Release schedule: ${pageData.releaseSchedule}.`);
  }

  return notes;
}

function buildLocationQuotientPageModel(args: {
  requestConfig: LocationQuotientRequestConfig;
  localResponse: BberTableResponse;
  baseResponse: BberTableResponse;
  baseTimeResponse: BberTableResponse;
  localTotalResponse: BberTableResponse;
  baseTotalResponse: BberTableResponse;
  areaTypeMetadata: unknown;
  periodMetadata: unknown;
  ownershipMetadata: unknown;
  industryMetadata: unknown;
}) {
  const sourceMetadata = normalizeLocationQuotientSourceMetadata(
    args.localResponse.metadata?.table,
  );
  const areaTypeOptions = normalizeQcewMetadataOptions(
    args.areaTypeMetadata,
    "areatype",
  );
  const periodOptions = normalizeQcewMetadataOptions(
    args.periodMetadata,
    "periodtype",
  );
  const ownershipOptions = normalizeQcewMetadataOptions(
    args.ownershipMetadata,
    "ownership",
  );
  const industryOptions = normalizeQcewMetadataOptions(
    args.industryMetadata,
    "indcode",
  );
  const localGeographyName = buildFallbackGeographyName(
    args.localResponse,
    args.requestConfig.local.stfips === "35" ? "New Mexico" : "Local geography",
  );
  const baseGeographyName = buildFallbackGeographyName(
    args.baseResponse,
    args.requestConfig.base.stfips === "00"
      ? "United States"
      : "Reference geography",
  );
  const localSelection = buildLocationQuotientSelectionSummary({
    selection: args.requestConfig.local,
    geographyName: localGeographyName,
    areaTypeOptions,
    ownershipOptions,
    periodOptions,
  });
  const baseSelection = buildLocationQuotientSelectionSummary({
    selection: args.requestConfig.base,
    geographyName: baseGeographyName,
    areaTypeOptions,
    ownershipOptions,
    periodOptions,
  });
  const baseTimeSelection = buildLocationQuotientSelectionSummary({
    selection: args.requestConfig.baseTime,
    geographyName: localGeographyName,
    areaTypeOptions,
    ownershipOptions,
    periodOptions,
    pinnedYear: args.requestConfig.baseTime.periodyear,
  });
  const framesResult = buildLocationQuotientFrames({
    localRows: normalizeQcewRows(args.localResponse.data),
    baseRows: normalizeQcewRows(args.baseResponse.data),
    baseTimeRows: normalizeQcewRows(args.baseTimeResponse.data),
    localTotalRows: normalizeQcewRows(args.localTotalResponse.data),
    baseTotalRows: normalizeQcewRows(args.baseTotalResponse.data),
    industryOptions,
    minimumYear: args.requestConfig.baseTime.periodyear,
  });
  const chartTitle = "Industry Specialization and Growth Portfolio";
  const chartSubtitle = `${localSelection.geographyLabel} compared with ${baseSelection.geographyLabel} · growth since ${args.requestConfig.baseTime.periodyear}`;

  return {
    eyebrow: "New Mexico Data",
    title: "Location Quotient Portfolio",
    description:
      "Compare industry concentration against a reference geography and see how each local sector has grown since the selected base year. Each bubble represents one industry in the current year, positioned by specialization on the x-axis and local employment growth on the y-axis.",
    methodology:
      "This view uses QCEW average employment. The location quotient is computed from annual employment shares, while growth is the local industry's percent change from the pinned base year to the selected frame year.",
    requestConfig: args.requestConfig,
    localSelection,
    baseSelection,
    baseTimeSelection,
    chart: {
      chartTitle,
      chartSubtitle,
      summary:
        "Industries to the right of LQ = 1 are more concentrated locally than in the reference geography. Industries above zero have added local employment since the base year.",
      frames: framesResult.frames,
      initialYear:
        framesResult.frames[framesResult.frames.length - 1]?.year ?? null,
      baseYear: args.requestConfig.baseTime.periodyear,
      notes: buildChartNotes({
        sourceLabel: sourceMetadata.source,
        referenceTime: sourceMetadata.referenceTime,
        releaseSchedule: sourceMetadata.releaseSchedule,
        baseYear: args.requestConfig.baseTime.periodyear,
        localSelectionLabel: localSelection.summaryLabel,
        baseSelectionLabel: baseSelection.summaryLabel,
      }),
      coverage: framesResult.coverage,
    },
    sourceMetadata,
  } satisfies LocationQuotientPageData;
}

export async function getLocationQuotientPageData() {
  const requestConfig = getDefaultLocationQuotientConfig();
  const [
    localResponse,
    baseResponse,
    baseTimeResponse,
    localTotalResponse,
    baseTotalResponse,
    sharedMetadata,
    industryMetadata,
  ] = await Promise.all([
    fetchQcewTable(requestConfig.local),
    fetchQcewTable(requestConfig.base),
    fetchQcewTable(requestConfig.baseTime),
    fetchQcewTable(requestConfig.local, "00"),
    fetchQcewTable(requestConfig.base, "00"),
    fetchQcewMetadataValues(["areatype", "periodtype", "ownership"]),
    fetchQcewMetadataValues(["indcode"]),
  ]);

  return buildLocationQuotientPageModel({
    requestConfig,
    localResponse,
    baseResponse,
    baseTimeResponse,
    localTotalResponse,
    baseTotalResponse,
    areaTypeMetadata: sharedMetadata,
    periodMetadata: sharedMetadata,
    ownershipMetadata: sharedMetadata,
    industryMetadata,
  });
}
