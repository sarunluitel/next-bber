import "server-only";

import {
  BBER_DB_DATA_CATEGORIES,
  BBER_DB_DATASET_CATALOG,
  BBER_DB_PAGE_CONTENT,
  type BberDbAppliedQuery,
  type BberDbFilterKey,
  type BberDbInitialPageData,
  type BberDbMetadataColumn,
  type BberDbRawRecord,
  type BberDbSourceMetadata,
  type BberDbTableViewModel,
  buildBberDbApiSearchParams,
  buildBberDbColumns,
  buildBberDbFilterModel,
  buildBberDbResultTitle,
  buildBberDbSourceLine,
  buildBberDbTableRows,
  buildBberDbUpstreamUnavailableMessage,
  getBberDbDatasetCatalogForCategory,
  getDefaultBberDbDataset,
  normalizeBberDbMetadataColumns,
  normalizeBberDbRows,
  normalizeBberDbSourceMetadata,
} from "@/content-models/bberdb";
import {
  assertKnownBberDataBankTable,
  BberDataBankRouteError,
  fetchBberDataBankUpstreamJson,
  getBberDataBankFilterModel,
  mergeBberDataBankHiddenRequestedQuery,
} from "@/lib/bber-data-bank";

const BBER_REST_ENDPOINT = "https://api.bber.unm.edu/api/data/rest/bbertable";

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

export { BberDataBankRouteError as BberDbRouteError };

function buildBberDbApiUrl(query: BberDbAppliedQuery) {
  return `${BBER_REST_ENDPOINT}?${buildBberDbApiSearchParams(query).toString()}`;
}

async function fetchBberDbDataset(query: BberDbAppliedQuery) {
  const dataset = assertKnownBberDataBankTable(query.table);
  const response = (await fetchBberDataBankUpstreamJson({
    endpoint: BBER_REST_ENDPOINT,
    searchParams: buildBberDbApiSearchParams(query),
    tableName: query.table,
    buildUnavailableMessage: (detail) =>
      buildBberDbUpstreamUnavailableMessage({
        tableName: query.table,
        detail,
      }),
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
  return getBberDataBankFilterModel({
    tableName: args.tableName,
    requestedQuery: args.requestedQuery,
    buildUnavailableMessage: (detail) =>
      buildBberDbUpstreamUnavailableMessage({
        tableName: args.tableName,
        detail,
      }),
  });
}

export async function getBberDbTableViewModel(args: {
  tableName: string;
  requestedQuery?: Partial<Record<BberDbFilterKey, string>>;
}) {
  const filterModel = await getBberDbFilterModel(args);
  const dataset = await fetchBberDbDataset(
    mergeBberDataBankHiddenRequestedQuery(filterModel, args.requestedQuery ?? {}),
  );

  return buildBberDbTableViewModelFromDataset(dataset);
}

export async function getBberDbDownloadPayload(args: {
  tableName: string;
  requestedQuery?: Partial<Record<BberDbFilterKey, string>>;
}) {
  const filterModel = await getBberDbFilterModel(args);

  return fetchBberDbDataset(
    mergeBberDataBankHiddenRequestedQuery(filterModel, args.requestedQuery ?? {}),
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
