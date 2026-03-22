import "server-only";

import {
  BBER_DB_DATA_CATEGORIES,
  type BberDbFilterKey,
  type BberDbFilterModel,
  buildBberDbApiSearchParams,
  buildBberDbFilterModel,
  buildBberDbSourceLine,
  getDefaultBberDbDataset,
  normalizeBberDbMetadataColumns,
  normalizeBberDbSourceMetadata,
} from "@/content-models/bberdb";
import {
  buildRgisMapViewModel,
  normalizeRgisFeatureCollection,
  RGIS_PAGE_CONTENT,
  type RgisAppliedQuery,
  type RgisGeoJsonFeatureCollection,
  type RgisInitialPageData,
  type RgisMapViewModel,
} from "@/content-models/rgis";
import {
  assertKnownBberDataBankTable,
  BberDataBankRouteError,
  fetchBberDataBankUpstreamJson,
  getBberDataBankDatasetCatalog,
  getBberDataBankFilterModel,
  mergeBberDataBankHiddenRequestedQuery,
} from "@/lib/bber-data-bank";
import type { RgisDownloadPayload } from "@/lib/rgis-downloads";

const RGIS_REST_ENDPOINT = "https://api.bber.unm.edu/api/data/rest/makemap";

type RgisUpstreamResponse = {
  type?: unknown;
  features?: unknown;
  metadata?: {
    table?: unknown;
    columns?: unknown;
  };
};

function buildRgisUpstreamUnavailableMessage(args: {
  tableName: string;
  detail?: string | null;
}) {
  const datasetLabel =
    assertKnownBberDataBankTable(args.tableName).label ?? args.tableName;
  const detail = args.detail?.trim();

  if (detail) {
    return `The upstream RGIS map service is currently unavailable for ${datasetLabel}. ${detail}`;
  }

  return `The upstream RGIS map service is currently unavailable for ${datasetLabel}.`;
}

function buildRgisApiSearchParams(query: RgisAppliedQuery) {
  const searchParams = buildBberDbApiSearchParams(query);
  const selectedYears = searchParams.get("periodyear");

  if (selectedYears) {
    searchParams.set("periodyear", `"${selectedYears}"`);
  }

  return searchParams;
}

function buildRgisApiUrl(query: RgisAppliedQuery) {
  return `${RGIS_REST_ENDPOINT}?${buildRgisApiSearchParams(query).toString()}`;
}

function getFirstMetadataTableRecord(rawValue: unknown) {
  if (Array.isArray(rawValue)) {
    return rawValue.find((record) => Boolean(record)) ?? null;
  }

  return rawValue;
}

function buildSelectedFilterLabel(
  filterModel: BberDbFilterModel,
  filterKey: "areatype" | "periodtype",
  fallbackValue: string | undefined,
) {
  const filter = filterModel.filters.find(
    (candidate) => candidate.key === filterKey,
  );

  if (!filter) {
    return fallbackValue ?? "";
  }

  return (
    filter.options.find(
      (option) => option.value === filterModel.draftQuery[filterKey],
    )?.label ??
    fallbackValue ??
    ""
  );
}

function buildEmptyRgisMapViewModel(args: {
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
    apiUrl: `${RGIS_REST_ENDPOINT}?${new URLSearchParams({ table: args.tableName }).toString()}`,
    description: args.description,
    sourceLine: buildBberDbSourceLine({
      query: { table: args.tableName },
      sourceLabel: args.source,
    }),
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
    availableYears: [],
    activeYear: "",
    metricOptions: [],
    defaultMetricKey: null,
    yearFrames: [],
    featureCount: 0,
  } satisfies RgisMapViewModel;
}

async function fetchRgisDataset(query: RgisAppliedQuery) {
  const dataset = assertKnownBberDataBankTable(query.table);
  const response = (await fetchBberDataBankUpstreamJson({
    endpoint: RGIS_REST_ENDPOINT,
    searchParams: buildRgisApiSearchParams(query),
    tableName: query.table,
    buildUnavailableMessage: (detail) =>
      buildRgisUpstreamUnavailableMessage({
        tableName: query.table,
        detail,
      }),
  })) as RgisUpstreamResponse;
  const featureCollection = {
    type: "FeatureCollection",
    features: normalizeRgisFeatureCollection(response.features),
  } satisfies RgisGeoJsonFeatureCollection;
  const metadataColumns = normalizeBberDbMetadataColumns(
    response.metadata?.columns,
  );
  const sourceMetadata = normalizeBberDbSourceMetadata(
    getFirstMetadataTableRecord(response.metadata?.table),
  );

  return {
    datasetLabel: dataset.label,
    query,
    apiUrl: buildRgisApiUrl(query),
    featureCollection,
    metadataColumns,
    sourceMetadata,
  };
}

export async function getRgisFilterModel(args: {
  tableName: string;
  requestedQuery?: Partial<Record<BberDbFilterKey, string>>;
}) {
  return getBberDataBankFilterModel({
    tableName: args.tableName,
    requestedQuery: args.requestedQuery,
    buildUnavailableMessage: (detail) =>
      buildRgisUpstreamUnavailableMessage({
        tableName: args.tableName,
        detail,
      }),
  });
}

export async function getRgisMapViewModel(args: {
  tableName: string;
  requestedQuery?: Partial<Record<BberDbFilterKey, string>>;
}) {
  const filterModel = await getRgisFilterModel(args);
  const dataset = await fetchRgisDataset(
    mergeBberDataBankHiddenRequestedQuery(
      filterModel,
      args.requestedQuery ?? {},
    ),
  );

  return buildRgisMapViewModel({
    datasetLabel: dataset.datasetLabel,
    query: dataset.query,
    apiUrl: dataset.apiUrl,
    features: dataset.featureCollection.features,
    metadataColumns: dataset.metadataColumns,
    sourceMetadata: dataset.sourceMetadata,
  });
}

export async function getRgisDownloadPayload(args: {
  tableName: string;
  requestedQuery?: Partial<Record<BberDbFilterKey, string>>;
}) {
  const filterModel = await getRgisFilterModel(args);
  const query = mergeBberDataBankHiddenRequestedQuery(
    filterModel,
    args.requestedQuery ?? {},
  );
  const dataset = await fetchRgisDataset(query);

  return {
    datasetLabel: dataset.datasetLabel,
    query,
    apiUrl: dataset.apiUrl,
    featureCollection: dataset.featureCollection,
    metadataColumns: dataset.metadataColumns,
    sourceMetadata: dataset.sourceMetadata,
    selectedAreatypeLabel: buildSelectedFilterLabel(
      filterModel,
      "areatype",
      query.areatype,
    ),
    selectedPeriodtypeLabel: buildSelectedFilterLabel(
      filterModel,
      "periodtype",
      query.periodtype,
    ),
  } satisfies RgisDownloadPayload;
}

export async function getRgisInitialPageData(): Promise<RgisInitialPageData> {
  const defaultDataset = getDefaultBberDbDataset();

  try {
    const initialFilterModel = await getRgisFilterModel({
      tableName: defaultDataset.tableName,
    });
    const initialMapModel = await getRgisMapViewModel({
      tableName: defaultDataset.tableName,
      requestedQuery: initialFilterModel.draftQuery,
    });

    return {
      pageContent: RGIS_PAGE_CONTENT,
      categoryOptions: Object.values(BBER_DB_DATA_CATEGORIES),
      datasetCatalog: getBberDataBankDatasetCatalog(),
      initialFilterModel,
      initialMapModel,
      initialMetadataErrorMessage: null,
      initialMapErrorMessage: null,
    };
  } catch (error) {
    const fallbackMessage =
      error instanceof Error
        ? error.message
        : "The default RGIS dataset could not be loaded from the upstream service.";
    const fallbackFilterModel = buildBberDbFilterModel({
      tableName: defaultDataset.tableName,
      supportedFilterKeys: [],
      optionsByKey: {},
    });

    return {
      pageContent: RGIS_PAGE_CONTENT,
      categoryOptions: Object.values(BBER_DB_DATA_CATEGORIES),
      datasetCatalog: getBberDataBankDatasetCatalog(),
      initialFilterModel: fallbackFilterModel,
      initialMapModel: buildEmptyRgisMapViewModel({
        datasetLabel: defaultDataset.label,
        tableName: defaultDataset.tableName,
        source: defaultDataset.source,
        description:
          "The default RGIS map could not be loaded during page initialization. Choose another dataset or try loading again.",
      }),
      initialMetadataErrorMessage: fallbackMessage,
      initialMapErrorMessage: fallbackMessage,
    };
  }
}

export { BberDataBankRouteError as RgisRouteError };
