import "server-only";

import {
  BBER_DB_DATA_CATEGORIES,
  BBER_DB_DATASET_CATALOG,
  BBER_DB_FILTER_KEYS,
  BBER_DB_PAGE_CONTENT,
  type BberDbAppliedQuery,
  type BberDbFilterKey,
  type BberDbFilterModel,
  type BberDbFilterOptionsMap,
  type BberDbInitialPageData,
  type BberDbMetadataColumn,
  type BberDbRawRecord,
  type BberDbSourceMetadata,
  type BberDbTableViewModel,
  type BberDbVisibleFilterKey,
  buildBberDbApiSearchParams,
  buildBberDbColumns,
  buildBberDbFilterModel,
  buildBberDbResultTitle,
  buildBberDbSourceLine,
  buildBberDbTableRows,
  buildBberDbUpstreamUnavailableMessage,
  findBberDbDatasetByTable,
  getBberDbDatasetCatalogForCategory,
  getBberDbVisibleFilterKeys,
  getDefaultBberDbDataset,
  normalizeBberDbFilterOptions,
  normalizeBberDbMetadataColumns,
  normalizeBberDbRows,
  normalizeBberDbSourceMetadata,
  normalizeBberDbSupportedFilterKeys,
} from "@/content-models/bberdb";

const BBER_REST_ENDPOINT = "https://api.bber.unm.edu/api/data/rest/bbertable";
const BBER_METADATA_ENDPOINT =
  "https://api.bber.unm.edu/api/data/rest/metadata";
const BBER_UPSTREAM_REVALIDATE_SECONDS = 3600;
// The first metadata chain can be slower than follow-up requests while the
// upstream service warms its own caches, so give the server render enough time
// to succeed before we fall back to client-side recovery.
const BBER_UPSTREAM_TIMEOUT_MILLISECONDS = 30000;

type BberDbMetadataResponse = {
  data?: unknown;
};

type BberDbUpstreamTableResponse = {
  data?: unknown;
  metadata?: {
    table?: unknown;
    columns?: unknown;
  };
};

export type BberDbDownloadPayload = {
  datasetLabel: string;
  query: BberDbAppliedQuery;
  apiUrl: string;
  response: BberDbUpstreamTableResponse;
  rawRows: BberDbRawRecord[];
  metadataColumns: BberDbMetadataColumn[];
};

type BberDbDatasetPayload = BberDbDownloadPayload & {
  description: string;
  resultTitle: string;
  sourceLine: string;
  sourceMetadata: BberDbSourceMetadata;
};

export class BberDbRouteError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "BberDbRouteError";
    this.status = status;
  }
}

function unwrapBberDbMetadataResponse(response: unknown) {
  if (!response || typeof response !== "object") {
    return response;
  }

  return "data" in response
    ? (response as BberDbMetadataResponse).data
    : response;
}

function normalizeBberDbErrorDetail(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmedValue = value.replace(/\s+/g, " ").trim();
  return trimmedValue.length > 0 ? trimmedValue : null;
}

async function readBberDbUpstreamErrorDetail(response: Response) {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    try {
      const payload = (await response.json()) as Record<string, unknown>;
      return (
        normalizeBberDbErrorDetail(payload.message) ??
        normalizeBberDbErrorDetail(payload.error) ??
        normalizeBberDbErrorDetail(JSON.stringify(payload))
      );
    } catch {
      return null;
    }
  }

  try {
    return normalizeBberDbErrorDetail(await response.text());
  } catch {
    return null;
  }
}

async function fetchBberDbUpstreamJson(args: {
  endpoint: string;
  searchParams?: URLSearchParams;
  tableName: string;
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

    throw new BberDbRouteError(
      502,
      buildBberDbUpstreamUnavailableMessage({
        tableName: args.tableName,
        detail,
      }),
    );
  }

  if (!response.ok) {
    const detail = await readBberDbUpstreamErrorDetail(response);

    throw new BberDbRouteError(
      502,
      buildBberDbUpstreamUnavailableMessage({
        tableName: args.tableName,
        detail,
      }),
    );
  }

  return response.json() as Promise<unknown>;
}

function buildBberDbApiUrl(query: BberDbAppliedQuery) {
  return `${BBER_REST_ENDPOINT}?${buildBberDbApiSearchParams(query).toString()}`;
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

function mergeHiddenRequestedQuery(
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

function assertKnownBberDbTable(tableName: string) {
  const dataset = findBberDbDatasetByTable(tableName);

  if (!dataset) {
    throw new BberDbRouteError(
      404,
      `The requested BBER data table "${tableName}" was not found in the local catalog.`,
    );
  }

  return dataset;
}

async function fetchBberDbTableVariables(tableName: string) {
  return fetchBberDbUpstreamJson({
    endpoint: BBER_METADATA_ENDPOINT,
    searchParams: new URLSearchParams({
      api: "tablevariables",
      table: tableName,
    }),
    tableName,
  });
}

async function fetchBberDbTableValues(
  tableName: string,
  filterKeys: readonly BberDbVisibleFilterKey[],
) {
  if (filterKeys.length === 0) {
    return [];
  }

  return fetchBberDbUpstreamJson({
    endpoint: BBER_METADATA_ENDPOINT,
    searchParams: new URLSearchParams({
      api: "tablevalues",
      table: tableName,
      variables: `[${filterKeys.join(",")}]`,
    }),
    tableName,
  });
}

function buildBberDbOptionsMap(args: {
  filterKeys: readonly BberDbVisibleFilterKey[];
  rawValues: unknown;
}) {
  const optionsByKey: BberDbFilterOptionsMap = {};
  const normalizedValues = unwrapBberDbMetadataResponse(args.rawValues);

  for (const filterKey of args.filterKeys) {
    optionsByKey[filterKey] = normalizeBberDbFilterOptions(
      normalizedValues,
      filterKey,
    );
  }

  return optionsByKey;
}

async function fetchBberDbDataset(query: BberDbAppliedQuery) {
  const dataset = assertKnownBberDbTable(query.table);
  const response = (await fetchBberDbUpstreamJson({
    endpoint: BBER_REST_ENDPOINT,
    searchParams: buildBberDbApiSearchParams(query),
    tableName: query.table,
  })) as BberDbUpstreamTableResponse;
  const rawRows = normalizeBberDbRows(response.data);
  const metadataColumns = normalizeBberDbMetadataColumns(
    response.metadata?.columns,
  );
  const sourceMetadata = normalizeBberDbSourceMetadata(
    response.metadata?.table,
  );
  const sourceLabel = sourceMetadata.source || dataset.source;
  const resultTitle =
    rawRows.length > 0 ? buildBberDbResultTitle(rawRows) : dataset.label;

  return {
    datasetLabel: dataset.label,
    query,
    apiUrl: buildBberDbApiUrl(query),
    response,
    rawRows,
    metadataColumns,
    description:
      sourceMetadata.tableDescription ||
      sourceMetadata.tableTitle ||
      dataset.label,
    resultTitle,
    sourceLine: buildBberDbSourceLine({
      query,
      sourceLabel,
    }),
    sourceMetadata,
  } satisfies BberDbDatasetPayload;
}

function buildBberDbTableViewModelFromDataset(dataset: BberDbDatasetPayload) {
  const columns = buildBberDbColumns(dataset.rawRows, dataset.metadataColumns);

  return {
    datasetLabel: dataset.datasetLabel,
    tableName: dataset.query.table,
    query: dataset.query,
    resultTitle: dataset.resultTitle,
    sourceLine: dataset.sourceLine,
    apiUrl: dataset.apiUrl,
    description: dataset.description,
    columns,
    rows: buildBberDbTableRows(dataset.rawRows, columns),
    rawRowCount: dataset.rawRows.length,
    sourceMetadata: dataset.sourceMetadata,
  } satisfies BberDbTableViewModel;
}

function buildBberDbFallbackTableViewModel(args: {
  datasetLabel: string;
  tableName: string;
  source: string;
  description: string;
}) {
  return {
    datasetLabel: args.datasetLabel,
    tableName: args.tableName,
    query: {
      table: args.tableName,
    },
    resultTitle: args.datasetLabel,
    sourceLine: buildBberDbSourceLine({
      query: { table: args.tableName },
      sourceLabel: args.source,
    }),
    apiUrl: `${BBER_REST_ENDPOINT}?${new URLSearchParams({ table: args.tableName }).toString()}`,
    description: args.description,
    columns: [],
    rows: [],
    rawRowCount: 0,
    sourceMetadata: {
      tableName: args.tableName,
      tableTitle: args.datasetLabel,
      tableDescription: args.description,
      source: args.source,
      purpose: "",
      referenceTime: "",
      releaseSchedule: "",
      updatedAt: null,
    },
  } satisfies BberDbTableViewModel;
}

export async function getBberDbFilterModel(args: {
  tableName: string;
  requestedQuery?: Partial<Record<BberDbFilterKey, string>>;
}) {
  assertKnownBberDbTable(args.tableName);

  const rawVariables = await fetchBberDbTableVariables(args.tableName);
  const supportedFilterKeys = normalizeBberDbSupportedFilterKeys(
    unwrapBberDbMetadataResponse(rawVariables),
  );
  const visibleFilterKeys = getBberDbVisibleFilterKeys(supportedFilterKeys);
  const rawValues = await fetchBberDbTableValues(
    args.tableName,
    visibleFilterKeys,
  );

  return buildBberDbFilterModel({
    tableName: args.tableName,
    supportedFilterKeys,
    optionsByKey: buildBberDbOptionsMap({
      filterKeys: visibleFilterKeys,
      rawValues,
    }),
    requestedQuery: pickVisibleRequestedQuery(
      args.requestedQuery ?? {},
      visibleFilterKeys,
    ),
  });
}

export async function getBberDbTableViewModel(args: {
  tableName: string;
  requestedQuery?: Partial<Record<BberDbFilterKey, string>>;
}) {
  const filterModel = await getBberDbFilterModel(args);
  const dataset = await fetchBberDbDataset(
    mergeHiddenRequestedQuery(filterModel, args.requestedQuery ?? {}),
  );

  return buildBberDbTableViewModelFromDataset(dataset);
}

export async function getBberDbDownloadPayload(args: {
  tableName: string;
  requestedQuery?: Partial<Record<BberDbFilterKey, string>>;
}) {
  const filterModel = await getBberDbFilterModel(args);

  return fetchBberDbDataset(
    mergeHiddenRequestedQuery(filterModel, args.requestedQuery ?? {}),
  );
}

export async function getBberDbInitialPageData(): Promise<BberDbInitialPageData> {
  const defaultDataset = getDefaultBberDbDataset();

  try {
    const initialFilterModel = await getBberDbFilterModel({
      tableName: defaultDataset.tableName,
    });
    const initialTableModel = buildBberDbTableViewModelFromDataset(
      await fetchBberDbDataset(initialFilterModel.draftQuery),
    );

    return {
      pageContent: BBER_DB_PAGE_CONTENT,
      categoryOptions: Object.values(BBER_DB_DATA_CATEGORIES),
      datasetCatalog: getBberDbDatasetCatalogForCategory(
        BBER_DB_DATA_CATEGORIES.ALL,
      ),
      initialFilterModel,
      initialTableModel,
      initialMetadataErrorMessage: null,
      initialTableErrorMessage: null,
    };
  } catch (error) {
    const fallbackMessage =
      error instanceof Error
        ? error.message
        : "The default BBER data table could not be loaded from the upstream service.";
    const fallbackFilterModel = buildBberDbFilterModel({
      tableName: defaultDataset.tableName,
      supportedFilterKeys: [],
      optionsByKey: {},
    });

    return {
      pageContent: BBER_DB_PAGE_CONTENT,
      categoryOptions: Object.values(BBER_DB_DATA_CATEGORIES),
      datasetCatalog: getBberDbDatasetCatalogForCategory(
        BBER_DB_DATA_CATEGORIES.ALL,
      ),
      initialFilterModel: fallbackFilterModel,
      initialTableModel: buildBberDbFallbackTableViewModel({
        datasetLabel: defaultDataset.label,
        tableName: defaultDataset.tableName,
        source: defaultDataset.source,
        description:
          "The default BBER table could not be loaded during page initialization. Choose another dataset or try loading again.",
      }),
      initialMetadataErrorMessage: fallbackMessage,
      initialTableErrorMessage: fallbackMessage,
    };
  }
}

export function getBberDbDatasetCatalog() {
  return BBER_DB_DATASET_CATALOG;
}
