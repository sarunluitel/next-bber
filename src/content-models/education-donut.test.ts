import assert from "node:assert/strict";
import test from "node:test";
import {
  buildEducationDonutChartModel,
  normalizeEducationDonutColumns,
  normalizeEducationDonutRow,
  normalizeEducationDonutSourceMetadata,
} from "./education-donut.ts";

const RAW_COLUMNS = [
  {
    column_name: "eduattain_25plus_less9_e",
    display_name: "Less Than 9th Grade",
    column_description: "Less than ninth grade",
  },
  {
    column_name: "eduattain_25plus_hsgradandequiv_e",
    display_name: "High School Grad",
    column_description: "High school graduate or equivalent",
  },
  {
    column_name: "eduattain_25plus_bachelor_e",
    display_name: "Bachelor's",
    column_description: "Bachelor's degree",
  },
];

test("normalizeEducationDonutRow keeps the first plottable dp02 row", () => {
  const row = normalizeEducationDonutRow([
    {
      geographyname: "New Mexico",
      periodtypename: "ACS 5-year estimates",
      periodyear: "2023",
      eduattain_25plus_less9_e: 10,
      eduattain_25plus_hsgradandequiv_e: 30,
      eduattain_25plus_bachelor_e: 20,
    },
  ]);

  assert.equal(row?.geographyName, "New Mexico");
  assert.equal(row?.year, 2023);
  assert.equal(row?.values.get("eduattain_25plus_hsgradandequiv_e"), 30);
});

test("buildEducationDonutChartModel calculates totals and shares from ordered slices", () => {
  const row = normalizeEducationDonutRow([
    {
      geographyname: "New Mexico",
      periodtypename: "ACS 5-year estimates",
      periodyear: "2023",
      eduattain_25plus_less9_e: 50,
      eduattain_25plus_hsgradandequiv_e: 150,
      eduattain_25plus_bachelor_e: 100,
    },
  ]);
  const columns = normalizeEducationDonutColumns(RAW_COLUMNS);
  const sourceMetadata = normalizeEducationDonutSourceMetadata({
    source: "US Census Bureau",
    reference_time: "One year lag",
  });
  const chart = buildEducationDonutChartModel({
    row,
    columns,
    sourceMetadata,
  });

  assert.equal(chart.totalAdults, 300);
  assert.equal(chart.slices.length, 3);
  assert.equal(chart.slices[1]?.label, "High School Grad");
  assert.equal(chart.slices[1]?.share.toFixed(4), "0.5000");
  assert.match(chart.summary, /High School Grad/i);
});

test("buildEducationDonutChartModel reports missing requested values", () => {
  const row = normalizeEducationDonutRow([
    {
      geographyname: "New Mexico",
      periodtypename: "ACS 5-year estimates",
      periodyear: "2023",
      eduattain_25plus_less9_e: 10,
    },
  ]);
  const columns = normalizeEducationDonutColumns(RAW_COLUMNS);
  const sourceMetadata = normalizeEducationDonutSourceMetadata({});
  const chart = buildEducationDonutChartModel({
    row,
    columns,
    sourceMetadata,
  });

  assert.equal(chart.slices.length, 1);
  assert.match(chart.warningMessages.join(" "), /did not publish values/i);
});
