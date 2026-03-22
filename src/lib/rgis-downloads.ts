import shpwrite from "@mapbox/shp-write";
import JSZip from "jszip";
import type {
  BberDbMetadataColumn,
  BberDbSourceMetadata,
} from "@/content-models/bberdb";
import type {
  RgisAppliedQuery,
  RgisGeoJsonFeatureCollection,
} from "@/content-models/rgis";
import { buildRgisXml, WGS84_PRJ } from "@/lib/rgis-xml";

export type RgisDownloadPayload = {
  datasetLabel: string;
  query: RgisAppliedQuery;
  apiUrl: string;
  featureCollection: RgisGeoJsonFeatureCollection;
  metadataColumns: BberDbMetadataColumn[];
  sourceMetadata: BberDbSourceMetadata;
  selectedAreatypeLabel: string;
  selectedPeriodtypeLabel: string;
};

function sanitizeFileStem(value: string) {
  return value
    .replace(/[<>:"/\\|?*]/g, "")
    .trim()
    .replace(/\s+/g, "_");
}

async function buildRgisXmlFile(payload: RgisDownloadPayload) {
  return buildRgisXml({
    datasetLabel: payload.datasetLabel,
    query: payload.query,
    sourceLabel: payload.sourceMetadata.source || payload.datasetLabel,
    sourceMetadata: payload.sourceMetadata,
    metadataColumns: payload.metadataColumns,
    featureCollection: payload.featureCollection,
    selectedAreatypeLabel: payload.selectedAreatypeLabel,
    selectedPeriodtypeLabel: payload.selectedPeriodtypeLabel,
  });
}

export async function buildRgisGeoJsonZipBuffer(payload: RgisDownloadPayload) {
  const zip = new JSZip();
  const fileStem = sanitizeFileStem(payload.query.table);

  zip.file(
    `${fileStem}.geojson`,
    JSON.stringify(payload.featureCollection, null, 2),
  );
  zip.file(`${fileStem}.xml`, await buildRgisXmlFile(payload));

  return zip.generateAsync({ type: "nodebuffer" });
}

export async function buildRgisShapefileZipBuffer(
  payload: RgisDownloadPayload,
) {
  const fileStem = sanitizeFileStem(payload.query.table);
  const shapefileFeatureCollection = {
    type: "FeatureCollection",
    features: payload.featureCollection.features.flatMap((feature) => {
      if (!feature.geometry) {
        return [];
      }

      return [
        {
          type: "Feature",
          geometry: feature.geometry as GeoJSON.Geometry,
          properties: feature.properties as GeoJSON.GeoJsonProperties,
        } satisfies GeoJSON.Feature,
      ];
    }),
  } satisfies GeoJSON.FeatureCollection;
  const shapefileArchive = await shpwrite.zip<"nodebuffer">(
    shapefileFeatureCollection,
    {
      filename: fileStem,
      folder: fileStem,
      outputType: "nodebuffer",
      compression: "STORE",
      prj: WGS84_PRJ,
    },
  );
  const zip = await JSZip.loadAsync(shapefileArchive);

  zip.file(`${fileStem}.xml`, await buildRgisXmlFile(payload));

  return zip.generateAsync({ type: "nodebuffer" });
}
