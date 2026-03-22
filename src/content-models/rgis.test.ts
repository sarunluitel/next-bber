import assert from "node:assert/strict";
import test from "node:test";
import { normalizeBberDbSourceMetadata } from "./bberdb.ts";
import {
  buildRgisFeatureIdFromProperties,
  buildRgisMapViewModel,
  buildRgisMetricOptions,
  buildRgisResultTitle,
  type RgisGeoJsonFeature,
} from "./rgis.ts";

const SAMPLE_COLUMNS = [
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
  {
    table_name: "s0801",
    column_name: "worker_female_e",
    display_name: "Workers - Female",
    column_description: "workers!!female workers",
  },
] as const;

function buildFeature(properties: Record<string, unknown>): RgisGeoJsonFeature {
  return {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [-106, 35],
    },
    properties,
  };
}

test("buildRgisMetricOptions pairs estimate and margin columns into one metric option", () => {
  const metricOptions = buildRgisMetricOptions({
    features: [
      buildFeature({
        geo_id: "0400000US35",
        periodyear: "2024",
        worker_total_e: 10,
        worker_total_m: 1,
        worker_female_e: 5,
      }),
    ],
    metadataColumns: [...SAMPLE_COLUMNS],
  });

  assert.deepEqual(
    metricOptions.map((metricOption) => metricOption.key),
    ["worker_total_e", "worker_female_e"],
  );
  assert.equal(metricOptions[0]?.marginKey, "worker_total_m");
  assert.deepEqual(metricOptions[0]?.helperBreadcrumbs, [
    "workers",
    "total workers",
  ]);
});

test("buildRgisFeatureIdFromProperties falls back to geography codes when geo_id is missing", () => {
  assert.equal(
    buildRgisFeatureIdFromProperties({
      stfips: "35",
      areatype: "04",
      area: "000001",
      name: "Bernalillo County",
      periodyear: "2025",
    }),
    "35:04:000001",
  );
});

test("buildRgisMapViewModel groups multi-year features into descending year frames", () => {
  const viewModel = buildRgisMapViewModel({
    datasetLabel: "S0801 : Commute Data",
    query: {
      table: "s0801",
      areatype: "01",
      periodyear: "2024,2023",
      periodtype: "61",
    },
    apiUrl:
      "https://api.bber.unm.edu/api/data/rest/makemap?table=s0801&areatype=01&periodtype=61&periodyear=%222024,2023%22",
    features: [
      buildFeature({
        geo_id: "0400000US35",
        name: "New Mexico",
        stfips: "35",
        areatype: "01",
        area: "000000",
        periodyear: "2023",
        periodtype: "61",
        period: "00",
        worker_total_e: 10,
        worker_total_m: 1,
        worker_female_e: 4,
      }),
      buildFeature({
        geo_id: "0400000US35",
        name: "New Mexico",
        stfips: "35",
        areatype: "01",
        area: "000000",
        periodyear: "2024",
        periodtype: "61",
        period: "00",
        worker_total_e: 12,
        worker_total_m: 2,
        worker_female_e: 6,
      }),
    ],
    metadataColumns: [...SAMPLE_COLUMNS],
    sourceMetadata: normalizeBberDbSourceMetadata({
      table_name: "s0801",
      data_title: "Commute Data",
      data_description: "Commuting characteristics.",
      source: "US Census Bureau American Community Survey",
      purpose: "Transportation analysis",
      reference_time: "Annual",
      release_schedule: "Annual",
      updated: "2020-01-31T00:00:00",
    }),
  });

  assert.deepEqual(viewModel.availableYears, ["2024", "2023"]);
  assert.equal(viewModel.activeYear, "2024");
  assert.equal(viewModel.defaultMetricKey, "worker_total_e");
  assert.equal(
    viewModel.yearFrames[0]?.featureSummaries[0]?.summaryFields[0]?.label,
    "GEO ID",
  );
  assert.equal(
    viewModel.yearFrames[0]?.featureSummaries[0]?.metricValues.worker_total_e
      .displayValue,
    "12 (±2)",
  );
});

test("buildRgisMapViewModel keeps one feature per geography in a year frame", () => {
  const viewModel = buildRgisMapViewModel({
    datasetLabel: "Gross Receipts",
    query: {
      table: "v_rp80",
      areatype: "04",
      periodyear: "2025,2024",
      periodtype: "03",
      indcode: "00",
      ownership: "00",
    },
    apiUrl:
      "https://api.bber.unm.edu/api/data/rest/makemap?table=v_rp80&areatype=04&periodtype=03&periodyear=%222025,2024%22&indcode=00&ownership=00",
    features: [
      buildFeature({
        geo_id: "0500000US35001",
        name: "Bernalillo County",
        stfips: "35",
        areatype: "04",
        area: "000001",
        periodyear: "2025",
        periodtype: "03",
        period: "10",
        release: "020526",
        worker_total_e: 10,
        worker_total_m: 1,
      }),
      buildFeature({
        geo_id: "0500000US35001",
        name: "Bernalillo County",
        stfips: "35",
        areatype: "04",
        area: "000001",
        periodyear: "2025",
        periodtype: "03",
        period: "11",
        release: "020526",
        worker_total_e: 12,
        worker_total_m: 2,
      }),
      buildFeature({
        geo_id: "0500000US35001",
        name: "Bernalillo County",
        stfips: "35",
        areatype: "04",
        area: "000001",
        periodyear: "2024",
        periodtype: "03",
        period: "11",
        release: "020425",
        worker_total_e: 8,
        worker_total_m: 1,
      }),
      buildFeature({
        geo_id: "0500000US35001",
        name: "Bernalillo County",
        stfips: "35",
        areatype: "04",
        area: "000001",
        periodyear: "2024",
        periodtype: "03",
        period: "12",
        release: "072925",
        worker_total_e: 14,
        worker_total_m: 3,
      }),
      buildFeature({
        geo_id: "0500000US35013",
        name: "Dona Ana County",
        stfips: "35",
        areatype: "04",
        area: "000013",
        periodyear: "2025",
        periodtype: "03",
        period: "11",
        release: "020526",
        worker_total_e: 20,
        worker_total_m: 4,
      }),
    ],
    metadataColumns: [...SAMPLE_COLUMNS],
    sourceMetadata: normalizeBberDbSourceMetadata({
      table_name: "v_rp80",
      data_title: "Gross Receipts",
      data_description: "Gross receipts by geography.",
      source: "NM Taxation & Revenue",
    }),
  });

  assert.equal(viewModel.yearFrames[0]?.year, "2025");
  assert.equal(viewModel.yearFrames[0]?.featureCollection.features.length, 2);
  assert.equal(viewModel.yearFrames[0]?.featureSummaries.length, 2);
  assert.equal(
    viewModel.yearFrames[0]?.featureSummaries
      .find((featureSummary) => featureSummary.name === "Bernalillo County")
      ?.summaryFields.find((field) => field.key === "period")?.value,
    "11",
  );
  assert.equal(
    viewModel.yearFrames[0]?.featureSummaries.find(
      (featureSummary) => featureSummary.name === "Bernalillo County",
    )?.metricValues.worker_total_e.displayValue,
    "12 (±2)",
  );
  assert.equal(viewModel.yearFrames[1]?.year, "2024");
  assert.equal(viewModel.yearFrames[1]?.featureCollection.features.length, 1);
  assert.equal(
    viewModel.yearFrames[1]?.featureSummaries[0]?.summaryFields.find(
      (field) => field.key === "period",
    )?.value,
    "12",
  );
});

test("buildRgisResultTitle compacts long geography lists", () => {
  assert.equal(
    buildRgisResultTitle([
      {
        id: "1",
        name: "Bernalillo County",
        geoId: "1",
        summaryFields: [],
        metricValues: {},
      },
      {
        id: "2",
        name: "Dona Ana County",
        geoId: "2",
        summaryFields: [],
        metricValues: {},
      },
      {
        id: "3",
        name: "Lea County",
        geoId: "3",
        summaryFields: [],
        metricValues: {},
      },
      {
        id: "4",
        name: "McKinley County",
        geoId: "4",
        summaryFields: [],
        metricValues: {},
      },
    ]),
    "Bernalillo County and 3 more geographies",
  );
});
