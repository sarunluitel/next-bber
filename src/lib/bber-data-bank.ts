import "server-only";

import {
  BBER_DB_DATASET_CATALOG,
  BBER_DB_FILTER_KEYS,
  type BberDbAppliedQuery,
  type BberDbFilterKey,
  type BberDbFilterModel,
  type BberDbFilterOptionsMap,
  type BberDbVisibleFilterKey,
  buildBberDbFilterModel,
  findBberDbDatasetByTable,
  getBberDbVisibleFilterKeys,
  normalizeBberDbFilterOptions,
  normalizeBberDbSupportedFilterKeys,
} from "@/content-models/bberdb";

export const BBER_METADATA_ENDPOINT =
  "https://api.bber.unm.edu/api/data/rest/metadata";

const BBER_UPSTREAM_REVALIDATE_SECONDS = 3600;
const BBER_UPSTREAM_TIMEOUT_MILLISECONDS = 30000;

type BberDataBankMetadataResponse = {
  data?: unknown;
};

export class BberDataBankRouteError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "BberDataBankRouteError";
    this.status = status;
  }
}

export function unwrapBberDataBankMetadataResponse(response: unknown) {
  if (!response || typeof response !== "object") {
    return response;
  }

  return "data" in response
    ? (response as BberDataBankMetadataResponse).data
    : response;
}

function normalizeErrorDetail(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmedValue = value.replace(/\s+/g, " ").trim();
  return trimmedValue.length > 0 ? trimmedValue : null;
}

async function readUpstreamErrorDetail(response: Response) {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    try {
      const payload = (await response.json()) as Record<string, unknown>;
      return (
        normalizeErrorDetail(payload.message) ??
        normalizeErrorDetail(payload.error) ??
        normalizeErrorDetail(JSON.stringify(payload))
      );
    } catch {
      return null;
    }
  }

  try {
    return normalizeErrorDetail(await response.text());
  } catch {
    return null;
  }
}

export async function fetchBberDataBankUpstreamJson(args: {
  endpoint: string;
  searchParams?: URLSearchParams;
  tableName: string;
  buildUnavailableMessage: (detail?: string | null) => string;
}) {
  const url = args.searchParams?.size
    ? `${args.endpoint}?${args.searchParams.toString()}`
    : args.endpoint;
  let response: Response;

  try {
    response = await fetch(url, {
      next: { revalidate: BBER_UPSTREAM_REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(BBER_UPSTREAM_TIMEOUT_MILLISECONDS),
    });
  } catch (error) {
    const detail =
      error instanceof Error &&
      (error.name === "TimeoutError" ||
        error.message.toLowerCase().includes("abort"))
        ? "The upstream request timed out."
        : "The upstream request could not be completed.";

    throw new BberDataBankRouteError(502, args.buildUnavailableMessage(detail));
  }

  if (!response.ok) {
    throw new BberDataBankRouteError(
      502,
      args.buildUnavailableMessage(await readUpstreamErrorDetail(response)),
    );
  }

  return response.json() as Promise<unknown>;
}

export function assertKnownBberDataBankTable(tableName: string) {
  const dataset = findBberDbDatasetByTable(tableName);

  if (!dataset) {
    throw new BberDataBankRouteError(
      404,
      `The requested BBER data table "${tableName}" was not found in the local catalog.`,
    );
  }

  return dataset;
}

function pickVisibleRequestedQuery(
  requestedQuery: Partial<Record<BberDbFilterKey, string>>,
  visibleFilterKeys: readonly BberDbVisibleFilterKey[],
) {
  const visibleRequestedQuery: Partial<
    Record<BberDbVisibleFilterKey, string | undefined>
  > = {};

  for (const filterKey of visibleFilterKeys) {
    visibleRequestedQuery[filterKey] = requestedQuery[filterKey];
  }

  return visibleRequestedQuery;
}

export function mergeBberDataBankHiddenRequestedQuery(
  filterModel: BberDbFilterModel,
  requestedQuery: Partial<Record<BberDbFilterKey, string>>,
) {
  const normalizedQuery: BberDbAppliedQuery = {
    ...filterModel.draftQuery,
  };
  const visibleFilterKeys = new Set(filterModel.visibleFilterKeys);

  for (const filterKey of BBER_DB_FILTER_KEYS) {
    if (visibleFilterKeys.has(filterKey as BberDbVisibleFilterKey)) {
      continue;
    }

    const filterValue = requestedQuery[filterKey];

    if (filterValue) {
      normalizedQuery[filterKey] = filterValue;
    }
  }

  return normalizedQuery;
}

async function fetchTableVariables(
  tableName: string,
  buildUnavailableMessage: (detail?: string | null) => string,
) {
  return fetchBberDataBankUpstreamJson({
    endpoint: BBER_METADATA_ENDPOINT,
    searchParams: new URLSearchParams({
      api: "tablevariables",
      table: tableName,
    }),
    tableName,
    buildUnavailableMessage,
  });
}

async function fetchTableValues(args: {
  tableName: string;
  filterKeys: readonly BberDbVisibleFilterKey[];
  buildUnavailableMessage: (detail?: string | null) => string;
}) {
  if (args.filterKeys.length === 0) {
    return [];
  }

  return fetchBberDataBankUpstreamJson({
    endpoint: BBER_METADATA_ENDPOINT,
    searchParams: new URLSearchParams({
      api: "tablevalues",
      table: args.tableName,
      variables: `[${args.filterKeys.join(",")}]`,
    }),
    tableName: args.tableName,
    buildUnavailableMessage: args.buildUnavailableMessage,
  });
}

function buildOptionsMap(args: {
  filterKeys: readonly BberDbVisibleFilterKey[];
  rawValues: unknown;
}) {
  const optionsByKey: BberDbFilterOptionsMap = {};
  const normalizedValues = unwrapBberDataBankMetadataResponse(args.rawValues);

  for (const filterKey of args.filterKeys) {
    optionsByKey[filterKey] = normalizeBberDbFilterOptions(
      normalizedValues,
      filterKey,
    );
  }

  return optionsByKey;
}

export async function getBberDataBankFilterModel(args: {
  tableName: string;
  requestedQuery?: Partial<Record<BberDbFilterKey, string>>;
  buildUnavailableMessage: (detail?: string | null) => string;
}) {
  assertKnownBberDataBankTable(args.tableName);

  const rawVariables = await fetchTableVariables(
    args.tableName,
    args.buildUnavailableMessage,
  );
  const supportedFilterKeys = normalizeBberDbSupportedFilterKeys(
    unwrapBberDataBankMetadataResponse(rawVariables),
  );
  const visibleFilterKeys = getBberDbVisibleFilterKeys(supportedFilterKeys);
  const rawValues = await fetchTableValues({
    tableName: args.tableName,
    filterKeys: visibleFilterKeys,
    buildUnavailableMessage: args.buildUnavailableMessage,
  });

  return buildBberDbFilterModel({
    tableName: args.tableName,
    supportedFilterKeys,
    optionsByKey: buildOptionsMap({
      filterKeys: visibleFilterKeys,
      rawValues,
    }),
    requestedQuery: pickVisibleRequestedQuery(
      args.requestedQuery ?? {},
      visibleFilterKeys,
    ),
  });
}

export function getBberDataBankDatasetCatalog() {
  return BBER_DB_DATASET_CATALOG;
}
