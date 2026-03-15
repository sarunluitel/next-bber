import assert from "node:assert/strict";
import test from "node:test";
import {
  buildPopulationPyramidFrames,
  type PopulationPyramidRow,
} from "./population-pyramid.ts";

function buildRow(args: {
  year: number;
  ageGroupCode: number;
  timeOrder?: number;
  malePopulation: number;
  femalePopulation: number;
}): PopulationPyramidRow {
  return {
    geographyName: "New Mexico",
    periodLabel: "Estimate (July1)",
    year: args.year,
    ageGroupCode: args.ageGroupCode,
    timeOrder: args.timeOrder ?? 0,
    malePopulation: args.malePopulation,
    femalePopulation: args.femalePopulation,
  };
}

test("buildPopulationPyramidFrames keeps ordered age bands and total rows", () => {
  const result = buildPopulationPyramidFrames([
    buildRow({
      year: 2023,
      ageGroupCode: 0,
      malePopulation: 100,
      femalePopulation: 120,
    }),
    buildRow({
      year: 2023,
      ageGroupCode: 2,
      malePopulation: 11,
      femalePopulation: 12,
    }),
    buildRow({
      year: 2023,
      ageGroupCode: 1,
      malePopulation: 10,
      femalePopulation: 13,
    }),
  ]);

  assert.equal(result.frames.length, 1);
  assert.equal(result.frames[0].totalPopulation, 220);
  assert.deepEqual(
    result.frames[0].bands.map((band) => band.ageGroupLabel),
    ["0 - 4", "5 - 9"],
  );
});

test("buildPopulationPyramidFrames derives totals when the total row is missing", () => {
  const result = buildPopulationPyramidFrames([
    buildRow({
      year: 2024,
      ageGroupCode: 1,
      malePopulation: 10,
      femalePopulation: 11,
    }),
    buildRow({
      year: 2024,
      ageGroupCode: 2,
      malePopulation: 12,
      femalePopulation: 13,
    }),
  ]);

  assert.equal(result.frames.length, 1);
  assert.equal(result.frames[0].malePopulation, 22);
  assert.equal(result.frames[0].femalePopulation, 24);
  assert.match(
    result.coverage.warningMessages.join(" "),
    /derived from the reported age bands/i,
  );
});

test("buildPopulationPyramidFrames ignores unknown age group codes", () => {
  const result = buildPopulationPyramidFrames([
    buildRow({
      year: 2022,
      ageGroupCode: 0,
      malePopulation: 90,
      femalePopulation: 110,
    }),
    buildRow({
      year: 2022,
      ageGroupCode: 1,
      malePopulation: 12,
      femalePopulation: 14,
    }),
    buildRow({
      year: 2022,
      ageGroupCode: 99,
      malePopulation: 500,
      femalePopulation: 500,
    }),
  ]);

  assert.equal(result.frames.length, 1);
  assert.deepEqual(
    result.frames[0].bands.map((band) => band.ageGroupCode),
    [1],
  );
  assert.equal(result.coverage.maxBandPopulation, 14);
});

test("buildPopulationPyramidFrames resolves duplicate age groups with the latest time order", () => {
  const result = buildPopulationPyramidFrames([
    buildRow({
      year: 2020,
      ageGroupCode: 1,
      timeOrder: 3,
      malePopulation: 10,
      femalePopulation: 11,
    }),
    buildRow({
      year: 2020,
      ageGroupCode: 1,
      timeOrder: 4,
      malePopulation: 12,
      femalePopulation: 13,
    }),
    buildRow({
      year: 2020,
      ageGroupCode: 0,
      timeOrder: 4,
      malePopulation: 100,
      femalePopulation: 120,
    }),
  ]);

  assert.equal(result.frames.length, 1);
  assert.equal(result.frames[0].bands.length, 1);
  assert.equal(result.frames[0].bands[0].malePopulation, 12);
  assert.match(
    result.coverage.warningMessages.join(" "),
    /duplicate age-band rows/i,
  );
});
