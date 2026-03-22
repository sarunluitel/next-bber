import assert from "node:assert/strict";
import test from "node:test";
import JSZip from "jszip";
import {
  buildRgisGeoJsonZipBuffer,
  buildRgisShapefileZipBuffer,
} from "./rgis-downloads.ts";

const SAMPLE_DOWNLOAD_PAYLOAD = {
  datasetLabel: "S0801 : Commute Data",
  query: {
    table: "s0801",
    areatype: "01",
    periodyear: "2024,2023",
    periodtype: "61",
  },
  apiUrl:
    "https://api.bber.unm.edu/api/data/rest/makemap?table=s0801&areatype=01&periodtype=61&periodyear=%222024,2023%22",
  featureCollection: {
    type: "FeatureCollection" as const,
    features: [
      {
        type: "Feature" as const,
        geometry: {
          type: "Point",
          coordinates: [-106, 35],
        },
        properties: {
          geo_id: "0400000US35",
          name: "New Mexico",
          area: "000000",
          extent: "BOX(-109.05017 31.33218,-103.00196 37.00023)",
          periodyear: "2024",
          periodtype: "61",
          period: "00",
          worker_total_e: 12,
          worker_total_m: 2,
        },
      },
    ],
  },
  metadataColumns: [
    {
      table_name: "s0801",
      column_name: "worker_total_e",
      display_name: "Workers",
      column_description: "workers!!total workers",
    },
    {
      table_name: "s0801",
      column_name: "worker_total_m",
      display_name: "Workers (Margin of Error)",
      column_description: "workers!!total workers",
    },
  ],
  sourceMetadata: {
    tableName: "s0801",
    tableTitle: "Commute Data",
    tableDescription: "Commuting characteristics.",
    source: "US Census Bureau American Community Survey",
    purpose: "Transportation analysis",
    referenceTime: "Annual",
    releaseSchedule: "Annual",
    updatedAt: "2020-01-31T00:00:00",
  },
  selectedAreatypeLabel: "County",
  selectedPeriodtypeLabel: "ACS 5-year estimates",
};

test("buildRgisGeoJsonZipBuffer includes the geojson file and xml metadata sidecar", async () => {
  const zipBuffer = await buildRgisGeoJsonZipBuffer(SAMPLE_DOWNLOAD_PAYLOAD);
  const zip = await JSZip.loadAsync(zipBuffer);
  const fileNames = Object.keys(zip.files).sort();

  assert.deepEqual(fileNames, ["s0801.geojson", "s0801.xml"]);
  const xmlContents = await zip.file("s0801.xml")?.async("string");
  assert.match(xmlContents ?? "", /County/);
  assert.match(xmlContents ?? "", /ACS 5-year estimates/);
});

test("buildRgisShapefileZipBuffer includes shapefile artifacts and xml metadata sidecar", async () => {
  const zipBuffer = await buildRgisShapefileZipBuffer(SAMPLE_DOWNLOAD_PAYLOAD);
  const zip = await JSZip.loadAsync(zipBuffer);
  const fileNames = Object.keys(zip.files).sort();

  assert.ok(fileNames.some((fileName) => fileName.endsWith(".shp")));
  assert.ok(fileNames.some((fileName) => fileName.endsWith(".shx")));
  assert.ok(fileNames.some((fileName) => fileName.endsWith(".dbf")));
  assert.ok(fileNames.some((fileName) => fileName.endsWith(".prj")));
  assert.ok(fileNames.includes("s0801.xml"));
});
