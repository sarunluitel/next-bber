import { readFile } from "node:fs/promises";
import path from "node:path";
import {
  type BberDbMetadataColumn,
  getBberDbSelectedYearValues,
} from "@/content-models/bberdb";
import type {
  RgisAppliedQuery,
  RgisGeoJsonFeatureCollection,
} from "@/content-models/rgis";

type RgisXmlMetadata = {
  datasetLabel: string;
  query: RgisAppliedQuery;
  sourceLabel: string;
  sourceMetadata: {
    tableTitle: string;
    tableDescription: string;
    purpose: string;
    referenceTime: string;
    releaseSchedule: string;
    updatedAt: string | null;
  };
  metadataColumns: BberDbMetadataColumn[];
  featureCollection: RgisGeoJsonFeatureCollection;
  selectedAreatypeLabel: string;
  selectedPeriodtypeLabel: string;
};

const RGIS_XML_TEMPLATE_PATH = path.join(
  process.cwd(),
  "public",
  "RGIS_XML",
  "template.xml",
);

const XML_ESCAPE_REPLACEMENTS: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&apos;",
};

const WGS84_PRJ =
  'GEOGCS["WGS 84",DATUM["WGS_1984",SPHEROID["WGS 84",6378137,298.257223563]],PRIMEM["Greenwich",0],UNIT["degree",0.0174532925199433]]';

function escapeXml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (character) => XML_ESCAPE_REPLACEMENTS[character] ?? character,
  );
}

function replaceTemplateToken(template: string, token: string, value: string) {
  return template.replaceAll(`{{${token}}}`, escapeXml(value));
}

function parseIsoDate(dateValue: string | null) {
  if (!dateValue) {
    return "";
  }

  return dateValue.split("T")[0]?.replaceAll("-", "") ?? "";
}

function parseExtentBox(extentValue: unknown) {
  if (typeof extentValue !== "string") {
    return null;
  }

  const match = extentValue.match(
    /^BOX\(([-\d.]+)\s+([-\d.]+),([-\d.]+)\s+([-\d.]+)\)$/,
  );

  if (!match) {
    return null;
  }

  const west = Number(match[1]);
  const south = Number(match[2]);
  const east = Number(match[3]);
  const north = Number(match[4]);

  if (
    !Number.isFinite(west) ||
    !Number.isFinite(south) ||
    !Number.isFinite(east) ||
    !Number.isFinite(north)
  ) {
    return null;
  }

  return { west, south, east, north };
}

function buildBounds(featureCollection: RgisGeoJsonFeatureCollection) {
  let west = Number.POSITIVE_INFINITY;
  let south = Number.POSITIVE_INFINITY;
  let east = Number.NEGATIVE_INFINITY;
  let north = Number.NEGATIVE_INFINITY;

  for (const feature of featureCollection.features) {
    const extent = parseExtentBox(feature.properties.extent);

    if (!extent) {
      continue;
    }

    west = Math.min(west, extent.west);
    south = Math.min(south, extent.south);
    east = Math.max(east, extent.east);
    north = Math.max(north, extent.north);
  }

  if (!Number.isFinite(west)) {
    return {
      west: "",
      south: "",
      east: "",
      north: "",
    };
  }

  return {
    west: String(west),
    south: String(south),
    east: String(east),
    north: String(north),
  };
}

function buildAreaDomainValues(
  featureCollection: RgisGeoJsonFeatureCollection,
) {
  const areaEntries = new Map<string, string>();

  for (const feature of featureCollection.features) {
    const areaCode =
      typeof feature.properties.area === "string"
        ? feature.properties.area
        : null;
    const areaName =
      typeof feature.properties.name === "string"
        ? feature.properties.name
        : null;

    if (!areaCode || !areaName || areaEntries.has(areaCode)) {
      continue;
    }

    areaEntries.set(areaCode, areaName);
  }

  return Array.from(areaEntries.entries())
    .map(
      ([areaCode, areaName]) =>
        `<edom><edomv>${escapeXml(areaCode)}</edomv><edomvd>${escapeXml(areaName)}</edomvd><edomvds>${escapeXml(
          "UNM Bureau of Business and Economic Research",
        )}</edomvds></edom>`,
    )
    .join("");
}

function buildAttributeMetadata(metadataColumns: BberDbMetadataColumn[]) {
  return metadataColumns
    .map((column) => {
      const infoText = `${column.display_name}: ${column.column_description}`;

      return `<attr><attrlabl>${escapeXml(column.column_name)}</attrlabl><attrdef>${escapeXml(
        infoText,
      )}</attrdef><attrdefs>${escapeXml(
        "UNM Bureau of Business and Economic Research",
      )}</attrdefs><attrdomv><udom>${escapeXml(
        infoText,
      )}</udom></attrdomv></attr>`;
    })
    .join("");
}

function buildOverviewText(metadataColumns: BberDbMetadataColumn[]) {
  return metadataColumns
    .map((column) => `${column.column_name} - ${column.display_name}`)
    .join("\n");
}

export async function buildRgisXml(args: RgisXmlMetadata) {
  let template = await readFile(RGIS_XML_TEMPLATE_PATH, "utf8");
  const bounds = buildBounds(args.featureCollection);
  const loadedYears = getBberDbSelectedYearValues(args.query.periodyear).join(
    ", ",
  );

  template = replaceTemplateToken(
    template,
    "title",
    args.sourceMetadata.tableTitle || args.datasetLabel,
  );
  template = replaceTemplateToken(
    template,
    "abstract",
    args.sourceMetadata.tableDescription || args.datasetLabel,
  );
  template = replaceTemplateToken(
    template,
    "purpose",
    args.sourceMetadata.purpose ||
      "Support geographic analysis of BBER socioeconomic data.",
  );
  template = replaceTemplateToken(
    template,
    "pubdate",
    parseIsoDate(args.sourceMetadata.updatedAt),
  );
  template = replaceTemplateToken(
    template,
    "caldate",
    parseIsoDate(args.sourceMetadata.updatedAt),
  );
  template = replaceTemplateToken(
    template,
    "progress",
    args.sourceMetadata.releaseSchedule || "Complete",
  );
  template = replaceTemplateToken(
    template,
    "update",
    args.sourceMetadata.referenceTime || args.selectedPeriodtypeLabel,
  );
  template = replaceTemplateToken(template, "westbc", bounds.west);
  template = replaceTemplateToken(template, "eastbc", bounds.east);
  template = replaceTemplateToken(template, "southbc", bounds.south);
  template = replaceTemplateToken(template, "northbc", bounds.north);
  template = replaceTemplateToken(template, "indspref", args.datasetLabel);
  template = replaceTemplateToken(
    template,
    "ptvctcnt",
    String(args.featureCollection.features.length),
  );
  template = replaceTemplateToken(template, "enttypl", args.datasetLabel);
  template = replaceTemplateToken(template, "enttypds", args.sourceLabel);
  template = replaceTemplateToken(
    template,
    "metd",
    parseIsoDate(args.sourceMetadata.updatedAt),
  );
  template = replaceTemplateToken(
    template,
    "themekey",
    args.selectedAreatypeLabel,
  );
  template = replaceTemplateToken(
    template,
    "periodtype",
    args.selectedPeriodtypeLabel,
  );
  template = replaceTemplateToken(template, "periodyear", loadedYears);
  template = replaceTemplateToken(
    template,
    "attrlist",
    buildAttributeMetadata(args.metadataColumns),
  );
  template = replaceTemplateToken(
    template,
    "eaover",
    buildOverviewText(args.metadataColumns),
  );
  template = replaceTemplateToken(
    template,
    "geographydomains",
    buildAreaDomainValues(args.featureCollection),
  );
  template = replaceTemplateToken(template, "prj", WGS84_PRJ);

  return template;
}

export { WGS84_PRJ };
