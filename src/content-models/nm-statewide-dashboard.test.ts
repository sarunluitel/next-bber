import assert from "node:assert/strict";
import test from "node:test";
import {
  buildEducationDonutSourceLine,
  buildLocationQuotientSourceLine,
  buildPopulationPyramidSourceLine,
  buildSourceLineFromYearRange,
  NM_STATEWIDE_BUILDING_PERMITS_METRICS,
  NM_STATEWIDE_INITIAL_CLAIMS_METRICS,
  NM_STATEWIDE_LAUS_METRICS,
} from "./nm-statewide-dashboard.ts";

test("buildSourceLineFromYearRange renders single-year and range labels", () => {
  assert.equal(
    buildSourceLineFromYearRange({
      startYear: 2024,
      endYear: 2024,
      sourceLabel: "US Bureau of Labor Statistics - QCEW program",
    }),
    "Data Source: 2024 US Bureau of Labor Statistics - QCEW program",
  );

  assert.equal(
    buildSourceLineFromYearRange({
      startYear: 2018,
      endYear: 2025,
      sourceLabel: "US Bureau of Labor Statistics - Unadjusted",
    }),
    "Data Source: 2018-2025 US Bureau of Labor Statistics - Unadjusted",
  );
});

test("dashboard source-line helpers match the compact statewide format", () => {
  assert.equal(
    buildLocationQuotientSourceLine({
      coverage: {
        years: [2024],
        startYear: 2024,
        endYear: 2024,
        hiddenIndustryCodes: [],
        warningMessages: [],
      },
      sourceMetadata: {
        tableName: "qcew",
        title: "",
        description: "",
        source: "US Bureau of Labor Statistics - QCEW program",
        purpose: "",
        referenceTime: "",
        releaseSchedule: "",
        updatedAt: null,
      },
    }),
    "Data Source: 2024 US Bureau of Labor Statistics - QCEW program",
  );

  assert.equal(
    buildPopulationPyramidSourceLine({
      coverage: {
        years: [2024],
        startYear: 2010,
        endYear: 2024,
        maxBandPopulation: 100,
        warningMessages: [],
      },
      sourceMetadata: {
        tableName: "pep_cc",
        title: "",
        description: "",
        source: "US Census Bureau, Population Division",
        purpose: "",
        referenceTime: "",
        releaseSchedule: "",
        updatedAt: null,
      },
    }),
    "Data Source: 2024 US Census Bureau, Population Division",
  );

  assert.equal(
    buildEducationDonutSourceLine({
      yearLabel: "2023",
      sourceMetadata: {
        tableName: "dp02",
        title: "",
        description: "",
        source: "US Census Bureau",
        purpose: "",
        referenceTime: "",
        releaseSchedule: "",
        updatedAt: null,
      },
    }),
    "Data Source: 2023 US Census Bureau American Community Survey",
  );
});

test("statewide metric menus expose the production option counts", () => {
  assert.equal(NM_STATEWIDE_LAUS_METRICS.length, 4);
  assert.equal(NM_STATEWIDE_INITIAL_CLAIMS_METRICS.length, 4);
  assert.equal(NM_STATEWIDE_BUILDING_PERMITS_METRICS.length, 24);
});
