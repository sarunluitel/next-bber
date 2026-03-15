import assert from "node:assert/strict";
import test from "node:test";
import {
  buildLocationQuotientFrames,
  type QcewDataRow,
  type QcewMetadataOption,
} from "./location-quotient.ts";

const INDUSTRY_OPTIONS: QcewMetadataOption[] = [
  { value: "00", label: "Total" },
  { value: "10", label: "Legacy aggregate" },
  { value: "11", label: "Agriculture" },
  { value: "21", label: "Mining" },
  { value: "99", label: "Unclassified" },
];

function buildRow(args: {
  year: number;
  industryCode: string;
  averageEmployment: number | null;
}): QcewDataRow {
  return {
    geographyName: "Test geography",
    year: args.year,
    periodType: "01",
    industryCode: args.industryCode,
    averageEmployment: args.averageEmployment,
  };
}

test("buildLocationQuotientFrames calculates official-style share ratios and growth", () => {
  const result = buildLocationQuotientFrames({
    localRows: [
      buildRow({ year: 2010, industryCode: "11", averageEmployment: 20 }),
      buildRow({ year: 2010, industryCode: "21", averageEmployment: 10 }),
      buildRow({ year: 2020, industryCode: "11", averageEmployment: 30 }),
      buildRow({ year: 2020, industryCode: "21", averageEmployment: 15 }),
    ],
    baseRows: [
      buildRow({ year: 2010, industryCode: "11", averageEmployment: 10 }),
      buildRow({ year: 2010, industryCode: "21", averageEmployment: 20 }),
      buildRow({ year: 2020, industryCode: "11", averageEmployment: 15 }),
      buildRow({ year: 2020, industryCode: "21", averageEmployment: 25 }),
    ],
    baseTimeRows: [
      buildRow({ year: 2010, industryCode: "11", averageEmployment: 20 }),
      buildRow({ year: 2010, industryCode: "21", averageEmployment: 10 }),
    ],
    localTotalRows: [
      buildRow({ year: 2010, industryCode: "00", averageEmployment: 100 }),
      buildRow({ year: 2020, industryCode: "00", averageEmployment: 120 }),
    ],
    baseTotalRows: [
      buildRow({ year: 2010, industryCode: "00", averageEmployment: 200 }),
      buildRow({ year: 2020, industryCode: "00", averageEmployment: 220 }),
    ],
    industryOptions: INDUSTRY_OPTIONS,
    minimumYear: 2010,
  });

  assert.equal(result.frames.length, 2);
  assert.deepEqual(result.coverage.hiddenIndustryCodes, ["00", "10", "99"]);

  const currentFrame = result.frames[1];
  const agriculturePoint = currentFrame.points.find(
    (point) => point.industryCode === "11",
  );
  const miningPoint = currentFrame.points.find(
    (point) => point.industryCode === "21",
  );

  assert.ok(agriculturePoint);
  assert.ok(miningPoint);
  assert.equal(agriculturePoint?.locationQuotient.toFixed(4), "3.6667");
  assert.equal(agriculturePoint?.growthSinceBaseYear.toFixed(4), "0.5000");
  assert.equal(miningPoint?.locationQuotient.toFixed(4), "1.1000");
  assert.equal(miningPoint?.growthSinceBaseYear.toFixed(4), "0.5000");
});

test("buildLocationQuotientFrames filters aggregate codes and drops industries with missing base-year employment", () => {
  const result = buildLocationQuotientFrames({
    localRows: [
      buildRow({ year: 2015, industryCode: "10", averageEmployment: 99 }),
      buildRow({ year: 2015, industryCode: "11", averageEmployment: 25 }),
      buildRow({ year: 2015, industryCode: "21", averageEmployment: 8 }),
    ],
    baseRows: [
      buildRow({ year: 2015, industryCode: "10", averageEmployment: 100 }),
      buildRow({ year: 2015, industryCode: "11", averageEmployment: 10 }),
      buildRow({ year: 2015, industryCode: "21", averageEmployment: 4 }),
    ],
    baseTimeRows: [
      buildRow({ year: 2010, industryCode: "11", averageEmployment: 20 }),
    ],
    localTotalRows: [
      buildRow({ year: 2015, industryCode: "00", averageEmployment: 120 }),
    ],
    baseTotalRows: [
      buildRow({ year: 2015, industryCode: "00", averageEmployment: 200 }),
    ],
    industryOptions: INDUSTRY_OPTIONS,
    minimumYear: 2010,
  });

  assert.equal(result.frames.length, 1);
  assert.deepEqual(
    result.frames[0].points.map((point) => point.industryCode),
    ["11"],
  );
  assert.match(
    result.coverage.warningMessages.join(" "),
    /omitted because the local base year does not report employment/i,
  );
});

test("buildLocationQuotientFrames omits years with zero denominators", () => {
  const result = buildLocationQuotientFrames({
    localRows: [
      buildRow({ year: 2015, industryCode: "11", averageEmployment: 12 }),
      buildRow({ year: 2016, industryCode: "11", averageEmployment: 14 }),
    ],
    baseRows: [
      buildRow({ year: 2015, industryCode: "11", averageEmployment: 9 }),
      buildRow({ year: 2016, industryCode: "11", averageEmployment: 10 }),
    ],
    baseTimeRows: [
      buildRow({ year: 2010, industryCode: "11", averageEmployment: 8 }),
    ],
    localTotalRows: [
      buildRow({ year: 2015, industryCode: "00", averageEmployment: 0 }),
      buildRow({ year: 2016, industryCode: "00", averageEmployment: 100 }),
    ],
    baseTotalRows: [
      buildRow({ year: 2015, industryCode: "00", averageEmployment: 100 }),
      buildRow({ year: 2016, industryCode: "00", averageEmployment: 110 }),
    ],
    industryOptions: INDUSTRY_OPTIONS,
    minimumYear: 2010,
  });

  assert.deepEqual(
    result.frames.map((frame) => frame.year),
    [2016],
  );
  assert.match(
    result.coverage.warningMessages.join(" "),
    /produced no plottable industries/i,
  );
});
