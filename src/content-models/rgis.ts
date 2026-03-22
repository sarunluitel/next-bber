import {
  type BberDbAppliedQuery,
  type BberDbDataCategory,
  type BberDbDatasetCatalogEntry,
  type BberDbFilterModel,
  type BberDbMetadataColumn,
  type BberDbSourceMetadata,
  buildBberDbSourceLine,
  formatBberDbDisplayValue,
  getBberDbSentinelLabel,
} from "@/content-models/bberdb";

export const RGIS_PAGE_CONTENT = {
  path: "/data/rgis/",
  title: "RGIS Socioeconomic Data Tool",
  lead: "Explore geography-linked BBER data on an interactive map, compare places within the same dataset, and download the current GIS-ready results for research, teaching, and policy analysis.",
  backHref: "/data/",
  documentationHref: "/data/apidoc",
} as const;

export const RGIS_LOADING_STEPS = [
  "Getting all tables",
  "Getting table column values",
  "Putting the map together",
] as const;

export const RGIS_BASEMAP_OPTIONS = [
  {
    key: "Map",
    tileUrl: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
    options: {
      noWrap: true,
      maxZoom: 19,
    },
  },
  {
    key: "Satellite",
    tileUrl:
      "https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}",
    attribution:
      'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>',
    options: {
      noWrap: true,
      maxZoom: 20,
    },
  },
  {
    key: "Topography",
    tileUrl: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    attribution:
      'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
    options: {
      noWrap: true,
      maxZoom: 17,
    },
  },
  {
    key: "NightMode",
    tileUrl:
      "https://map1.vis.earthdata.nasa.gov/wmts-webmerc/VIIRS_CityLights_2012/default//GoogleMapsCompatible_Level8/{z}/{y}/{x}.jpg",
    attribution:
      'Imagery provided by NASA Earthdata GIBS (<a href="https://earthdata.nasa.gov">ESDIS</a>).',
    options: {
      noWrap: true,
      minZoom: 1,
      maxZoom: 8,
    },
  },
  {
    key: "CyclOSM",
    tileUrl:
      "https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png",
    attribution:
      "&copy; OpenStreetMap contributors, style by CyclOSM, tiles hosted by OSM France",
    options: {
      noWrap: true,
      maxZoom: 20,
    },
  },
  {
    key: "Railways",
    tileUrl: "https://{s}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png",
    attribution: "© OpenRailwayMap, © OpenStreetMap contributors",
    options: {
      maxZoom: 19,
      opacity: 0.9,
    },
  },
] as const;

export const RGIS_CONTEXT_FIELD_KEYS = [
  "stfips",
  "areatype",
  "area",
  "name",
  "extent",
  "geo_id",
  "periodyear",
  "periodtype",
  "period",
  "start_date",
  "end_date",
] as const;

const RGIS_SUMMARY_FIELD_ORDER = [
  "geo_id",
  "stfips",
  "areatype",
  "area",
  "name",
  "periodyear",
  "periodtype",
  "period",
] as const;

const RGIS_SUMMARY_FIELD_LABELS: Partial<Record<string, string>> = {
  geo_id: "GEO ID",
  stfips: "State Code",
  areatype: "Area Type",
  area: "Area Code",
  name: "Name",
  periodyear: "Year",
  periodtype: "Type of period",
  period: "Period",
};

type RgisGeometry = {
  type: string;
  coordinates?: unknown;
  geometries?: unknown;
};

export type RgisGeoJsonFeature = {
  type: "Feature";
  properties: Record<string, unknown>;
  geometry: RgisGeometry | null;
};

export type RgisGeoJsonFeatureCollection = {
  type: "FeatureCollection";
  features: RgisGeoJsonFeature[];
};

export type RgisAppliedQuery = BberDbAppliedQuery;

export type RgisMetricOption = {
  key: string;
  label: string;
  marginKey: string | null;
  description: string | null;
  helperBreadcrumbs: string[];
};

export type RgisFeatureMetricValue = {
  value: unknown;
  marginValue: unknown;
  choroplethValue: number | null;
  displayValue: string;
};

export type RgisFeatureSummaryField = {
  key: string;
  label: string;
  value: string;
};

export type RgisFeatureSummary = {
  id: string;
  name: string;
  geoId: string;
  summaryFields: RgisFeatureSummaryField[];
  metricValues: Record<string, RgisFeatureMetricValue>;
};

export type RgisYearFrame = {
  year: string;
  featureCollection: RgisGeoJsonFeatureCollection;
  featureSummaries: RgisFeatureSummary[];
};

export type RgisMapViewModel = {
  datasetLabel: string;
  tableName: string;
  query: RgisAppliedQuery;
  apiUrl: string;
  description: string;
  sourceLine: string;
  sourceMetadata: BberDbSourceMetadata;
  availableYears: string[];
  activeYear: string;
  metricOptions: RgisMetricOption[];
  defaultMetricKey: string | null;
  yearFrames: RgisYearFrame[];
  featureCount: number;
};

export type RgisInitialPageData = {
  pageContent: typeof RGIS_PAGE_CONTENT;
  categoryOptions: BberDbDataCategory[];
  datasetCatalog: readonly BberDbDatasetCatalogEntry[];
  initialFilterModel: BberDbFilterModel;
  initialMapModel: RgisMapViewModel;
  initialMetadataErrorMessage: string | null;
  initialMapErrorMessage: string | null;
};

function getStringValue(record: Record<string, unknown>, key: string) {
  const value = record[key];

  if (typeof value !== "string") {
    return null;
  }

  const trimmedValue = value.trim();
  return trimmedValue.length > 0 ? trimmedValue : null;
}

function getDisplayLabel(
  metadataLookup: Map<string, BberDbMetadataColumn>,
  key: string,
) {
  return (
    RGIS_SUMMARY_FIELD_LABELS[key] ??
    metadataLookup.get(key)?.display_name ??
    key
  );
}

function formatRgisNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatRgisDisplayValue(value: unknown) {
  const sentinelLabel = getBberDbSentinelLabel(value);

  if (sentinelLabel) {
    return sentinelLabel;
  }

  if (typeof value === "number") {
    return formatRgisNumber(value);
  }

  return formatBberDbDisplayValue(value);
}

export function buildRgisFeatureIdFromProperties(
  properties: Record<string, unknown>,
) {
  const geoId =
    getStringValue(properties, "geo_id") ?? getStringValue(properties, "geoid");
  const stateCode = getStringValue(properties, "stfips");
  const areaType = getStringValue(properties, "areatype");
  const areaCode = getStringValue(properties, "area");
  const geographyName = getStringValue(properties, "name");
  const areaIdentity = [stateCode, areaType, areaCode]
    .filter(Boolean)
    .join(":");

  return geoId || areaIdentity || geographyName || "";
}

function buildMetricDisplayValue(estimateValue: unknown, marginValue: unknown) {
  const estimateLabel = formatRgisDisplayValue(estimateValue);

  if (marginValue === null || marginValue === undefined || marginValue === "") {
    return estimateLabel;
  }

  return `${estimateLabel} (±${formatRgisDisplayValue(marginValue)})`;
}

function getChoroplethValue(value: unknown) {
  if (typeof value !== "number") {
    return null;
  }

  return value >= 0 ? value : null;
}

function buildHelperBreadcrumbs(description: string) {
  return description
    .split("!!")
    .map((part) => part.trim())
    .filter((part) => part.length > 0);
}

function isContextField(key: string) {
  return RGIS_CONTEXT_FIELD_KEYS.includes(
    key as (typeof RGIS_CONTEXT_FIELD_KEYS)[number],
  );
}

function isMarginField(key: string) {
  return key.endsWith("_m");
}

function getMetricPairKey(key: string) {
  if (!key.endsWith("_e")) {
    return null;
  }

  return `${key.slice(0, -2)}_m`;
}

export function normalizeRgisFeatureCollection(rawValue: unknown) {
  if (!Array.isArray(rawValue)) {
    return [] satisfies RgisGeoJsonFeature[];
  }

  return rawValue.flatMap((featureValue) => {
    if (!featureValue || typeof featureValue !== "object") {
      return [];
    }

    const featureRecord = featureValue as Record<string, unknown>;
    const properties =
      featureRecord.properties && typeof featureRecord.properties === "object"
        ? (featureRecord.properties as Record<string, unknown>)
        : null;
    const geometry =
      featureRecord.geometry && typeof featureRecord.geometry === "object"
        ? (featureRecord.geometry as RgisGeometry)
        : null;

    if (!properties) {
      return [];
    }

    return [
      {
        type: "Feature",
        properties,
        geometry,
      } satisfies RgisGeoJsonFeature,
    ];
  });
}

export function buildRgisMetricOptions(args: {
  features: RgisGeoJsonFeature[];
  metadataColumns: BberDbMetadataColumn[];
}) {
  const rowKeys = new Set(
    args.features.flatMap((feature) => Object.keys(feature.properties)),
  );
  const metadataLookup = new Map(
    args.metadataColumns.map((column) => [column.column_name, column]),
  );
  const metricKeys: string[] = [];

  for (const column of args.metadataColumns) {
    const columnKey = column.column_name;

    if (
      !rowKeys.has(columnKey) ||
      isContextField(columnKey) ||
      isMarginField(columnKey)
    ) {
      continue;
    }

    metricKeys.push(columnKey);
  }

  for (const feature of args.features) {
    for (const columnKey of Object.keys(feature.properties)) {
      if (
        metricKeys.includes(columnKey) ||
        isContextField(columnKey) ||
        isMarginField(columnKey)
      ) {
        continue;
      }

      metricKeys.push(columnKey);
    }
  }

  return metricKeys.map((metricKey) => {
    const metadata = metadataLookup.get(metricKey);

    return {
      key: metricKey,
      label: metadata?.display_name ?? metricKey,
      marginKey: rowKeys.has(getMetricPairKey(metricKey) ?? "")
        ? getMetricPairKey(metricKey)
        : null,
      description: metadata?.column_description?.trim().length
        ? metadata.column_description
        : null,
      helperBreadcrumbs: metadata?.column_description
        ? buildHelperBreadcrumbs(metadata.column_description)
        : [],
    } satisfies RgisMetricOption;
  });
}

function buildFeatureSummary(args: {
  feature: RgisGeoJsonFeature;
  metricOptions: RgisMetricOption[];
  metadataLookup: Map<string, BberDbMetadataColumn>;
}) {
  const geoId =
    getStringValue(args.feature.properties, "geo_id") ??
    getStringValue(args.feature.properties, "geoid") ??
    "";
  const year = getStringValue(args.feature.properties, "periodyear") ?? "";
  const featureId =
    buildRgisFeatureIdFromProperties(args.feature.properties) ||
    [geoId, year].filter(Boolean).join(":") ||
    crypto.randomUUID();

  return {
    id: featureId,
    name:
      getStringValue(args.feature.properties, "name") ??
      geoId ??
      "Selected geography",
    geoId,
    summaryFields: RGIS_SUMMARY_FIELD_ORDER.flatMap((fieldKey) => {
      if (!(fieldKey in args.feature.properties)) {
        return [];
      }

      return [
        {
          key: fieldKey,
          label: getDisplayLabel(args.metadataLookup, fieldKey),
          value: formatRgisDisplayValue(args.feature.properties[fieldKey]),
        } satisfies RgisFeatureSummaryField,
      ];
    }),
    metricValues: Object.fromEntries(
      args.metricOptions.map((metricOption) => {
        const value = args.feature.properties[metricOption.key];
        const marginValue = metricOption.marginKey
          ? args.feature.properties[metricOption.marginKey]
          : null;

        return [
          metricOption.key,
          {
            value,
            marginValue,
            choroplethValue: getChoroplethValue(value),
            displayValue: buildMetricDisplayValue(value, marginValue),
          } satisfies RgisFeatureMetricValue,
        ];
      }),
    ),
  } satisfies RgisFeatureSummary;
}

function compareYearsDescending(leftYear: string, rightYear: string) {
  const leftNumeric = Number(leftYear);
  const rightNumeric = Number(rightYear);

  if (Number.isFinite(leftNumeric) && Number.isFinite(rightNumeric)) {
    return rightNumeric - leftNumeric;
  }

  return rightYear.localeCompare(leftYear);
}

function getRgisFeatureIdentityKey(feature: RgisGeoJsonFeature) {
  return buildRgisFeatureIdFromProperties(feature.properties);
}

function getReleaseSortValue(feature: RgisGeoJsonFeature) {
  const releaseValue = getStringValue(feature.properties, "release");

  if (!releaseValue || !/^\d{6}$/.test(releaseValue)) {
    return Number.NaN;
  }

  const month = Number(releaseValue.slice(0, 2));
  const day = Number(releaseValue.slice(2, 4));
  const year = Number(releaseValue.slice(4, 6));

  if (
    !Number.isInteger(month) ||
    !Number.isInteger(day) ||
    !Number.isInteger(year)
  ) {
    return Number.NaN;
  }

  return Date.UTC(2000 + year, month - 1, day);
}

function getPeriodSortValue(feature: RgisGeoJsonFeature) {
  const periodValue = getStringValue(feature.properties, "period");

  if (!periodValue) {
    return Number.NaN;
  }

  return Number(periodValue);
}

function compareRgisFeaturesForYearFrame(
  leftFeature: RgisGeoJsonFeature,
  rightFeature: RgisGeoJsonFeature,
) {
  const leftRelease = getReleaseSortValue(leftFeature);
  const rightRelease = getReleaseSortValue(rightFeature);

  if (
    Number.isFinite(leftRelease) &&
    Number.isFinite(rightRelease) &&
    leftRelease !== rightRelease
  ) {
    return rightRelease - leftRelease;
  }

  const leftPeriod = getPeriodSortValue(leftFeature);
  const rightPeriod = getPeriodSortValue(rightFeature);

  if (
    Number.isFinite(leftPeriod) &&
    Number.isFinite(rightPeriod) &&
    leftPeriod !== rightPeriod
  ) {
    return rightPeriod - leftPeriod;
  }

  const leftName = getStringValue(leftFeature.properties, "name") ?? "";
  const rightName = getStringValue(rightFeature.properties, "name") ?? "";

  return leftName.localeCompare(rightName);
}

function buildYearFrameFeatures(features: RgisGeoJsonFeature[]) {
  const selectedFeaturesByGeography = new Map<string, RgisGeoJsonFeature>();

  for (const feature of features) {
    const featureIdentityKey =
      getRgisFeatureIdentityKey(feature) || crypto.randomUUID();
    const currentSelectedFeature =
      selectedFeaturesByGeography.get(featureIdentityKey);

    if (!currentSelectedFeature) {
      selectedFeaturesByGeography.set(featureIdentityKey, feature);
      continue;
    }

    if (compareRgisFeaturesForYearFrame(feature, currentSelectedFeature) < 0) {
      selectedFeaturesByGeography.set(featureIdentityKey, feature);
    }
  }

  return [...selectedFeaturesByGeography.values()].sort(
    compareRgisFeaturesForYearFrame,
  );
}

export function buildRgisResultTitle(featureSummaries: RgisFeatureSummary[]) {
  if (featureSummaries.length === 0) {
    return "Loaded RGIS data";
  }

  const names = Array.from(
    new Set(featureSummaries.map((featureSummary) => featureSummary.name)),
  );

  if (names.length === 1) {
    return names[0] ?? "Loaded RGIS data";
  }

  return `${names[0]} and ${String(names.length - 1)} more geographies`;
}

export function buildRgisMapViewModel(args: {
  datasetLabel: string;
  query: RgisAppliedQuery;
  apiUrl: string;
  features: RgisGeoJsonFeature[];
  metadataColumns: BberDbMetadataColumn[];
  sourceMetadata: BberDbSourceMetadata;
}) {
  const metadataLookup = new Map(
    args.metadataColumns.map((column) => [column.column_name, column]),
  );
  const metricOptions = buildRgisMetricOptions({
    features: args.features,
    metadataColumns: args.metadataColumns,
  });
  const featuresByYear = new Map<string, RgisGeoJsonFeature[]>();

  for (const feature of args.features) {
    const year =
      getStringValue(feature.properties, "periodyear") ?? "Unknown year";
    const yearFeatures = featuresByYear.get(year) ?? [];
    yearFeatures.push(feature);
    featuresByYear.set(year, yearFeatures);
  }

  const availableYears = Array.from(featuresByYear.keys()).sort(
    compareYearsDescending,
  );
  const yearFrames = availableYears.map((year) => {
    const yearFeatures = buildYearFrameFeatures(featuresByYear.get(year) ?? []);

    return {
      year,
      featureCollection: {
        type: "FeatureCollection",
        features: yearFeatures,
      },
      featureSummaries: [...yearFeatures]
        .map((feature) =>
          buildFeatureSummary({
            feature,
            metricOptions,
            metadataLookup,
          }),
        )
        .sort((leftFeature, rightFeature) =>
          leftFeature.name.localeCompare(rightFeature.name),
        ),
    } satisfies RgisYearFrame;
  });
  const activeYear = availableYears[0] ?? "";
  const sourceLabel = args.sourceMetadata.source || args.datasetLabel;

  return {
    datasetLabel: args.datasetLabel,
    tableName: args.query.table,
    query: args.query,
    apiUrl: args.apiUrl,
    description:
      args.sourceMetadata.tableDescription ||
      args.sourceMetadata.tableTitle ||
      args.datasetLabel,
    sourceLine: buildBberDbSourceLine({
      query: args.query,
      sourceLabel,
    }),
    sourceMetadata: args.sourceMetadata,
    availableYears,
    activeYear,
    metricOptions,
    defaultMetricKey: metricOptions[0]?.key ?? null,
    yearFrames,
    featureCount: args.features.length,
  } satisfies RgisMapViewModel;
}
