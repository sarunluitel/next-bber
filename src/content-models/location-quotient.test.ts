import assert from "node:assert/strict";
import test from "node:test";
import {
  buildLocationQuotientFrames,
  type LocationQuotientMetricKey,
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
  metricValue: number | null;
  metricKey?: LocationQuotientMetricKey;
}): QcewDataRow {
  const metricKey = args.metricKey ?? "avgemp";

  return {
    geographyName: "Test geography",
    year: args.year,
    periodType: "01",
    industryCode: args.industryCode,
    establishments: metricKey === "estab" ? args.metricValue : null,
    averageEmployment: metricKey === "avgemp" ? args.metricValue : null,
    totalWages: metricKey === "totwage" ? args.metricValue : null,
    averageWeekWage: metricKey === "avgwkwage" ? args.metricValue : null,
    taxableWages: metricKey === "taxwage" ? args.metricValue : null,
    contributions: metricKey === "contrib" ? args.metricValue : null,
  };
}

test("buildLocationQuotientFrames calculates official-style share ratios and growth", () => {
  const result = buildLocationQuotientFrames({
    localRows: [
      buildRow({ year: 2010, industryCode: "11", metricValue: 20 }),
      buildRow({ year: 2010, industryCode: "21", metricValue: 10 }),
      buildRow({ year: 2020, industryCode: "11", metricValue: 30 }),
      buildRow({ year: 2020, industryCode: "21", metricValue: 15 }),
    ],
    baseRows: [
      buildRow({ year: 2010, industryCode: "11", metricValue: 10 }),
      buildRow({ year: 2010, industryCode: "21", metricValue: 20 }),
      buildRow({ year: 2020, industryCode: "11", metricValue: 15 }),
      buildRow({ year: 2020, industryCode: "21", metricValue: 25 }),
    ],
    baseTimeRows: [
      buildRow({ year: 2010, industryCode: "11", metricValue: 20 }),
      buildRow({ year: 2010, industryCode: "21", metricValue: 10 }),
    ],
    localTotalRows: [
      buildRow({ year: 2010, industryCode: "00", metricValue: 100 }),
      buildRow({ year: 2020, industryCode: "00", metricValue: 120 }),
    ],
    baseTotalRows: [
      buildRow({ year: 2010, industryCode: "00", metricValue: 200 }),
      buildRow({ year: 2020, industryCode: "00", metricValue: 220 }),
    ],
    industryOptions: INDUSTRY_OPTIONS,
    minimumYear: 2010,
    metricKey: "avgemp",
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
      buildRow({ year: 2015, industryCode: "10", metricValue: 99 }),
      buildRow({ year: 2015, industryCode: "11", metricValue: 25 }),
      buildRow({ year: 2015, industryCode: "21", metricValue: 8 }),
    ],
    baseRows: [
      buildRow({ year: 2015, industryCode: "10", metricValue: 100 }),
      buildRow({ year: 2015, industryCode: "11", metricValue: 10 }),
      buildRow({ year: 2015, industryCode: "21", metricValue: 4 }),
    ],
    baseTimeRows: [
      buildRow({ year: 2010, industryCode: "11", metricValue: 20 }),
    ],
    localTotalRows: [
      buildRow({ year: 2015, industryCode: "00", metricValue: 120 }),
    ],
    baseTotalRows: [
      buildRow({ year: 2015, industryCode: "00", metricValue: 200 }),
    ],
    industryOptions: INDUSTRY_OPTIONS,
    minimumYear: 2010,
    metricKey: "avgemp",
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
      buildRow({ year: 2015, industryCode: "11", metricValue: 12 }),
      buildRow({ year: 2016, industryCode: "11", metricValue: 14 }),
    ],
    baseRows: [
      buildRow({ year: 2015, industryCode: "11", metricValue: 9 }),
      buildRow({ year: 2016, industryCode: "11", metricValue: 10 }),
    ],
    baseTimeRows: [
      buildRow({ year: 2010, industryCode: "11", metricValue: 8 }),
    ],
    localTotalRows: [
      buildRow({ year: 2015, industryCode: "00", metricValue: 0 }),
      buildRow({ year: 2016, industryCode: "00", metricValue: 100 }),
    ],
    baseTotalRows: [
      buildRow({ year: 2015, industryCode: "00", metricValue: 100 }),
      buildRow({ year: 2016, industryCode: "00", metricValue: 110 }),
    ],
    industryOptions: INDUSTRY_OPTIONS,
    minimumYear: 2010,
    metricKey: "avgemp",
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

test("buildLocationQuotientFrames supports non-employment metrics", () => {
  const result = buildLocationQuotientFrames({
    localRows: [
      buildRow({
        year: 2015,
        industryCode: "11",
        metricValue: 1_000,
        metricKey: "totwage",
      }),
      buildRow({
        year: 2016,
        industryCode: "11",
        metricValue: 1_500,
        metricKey: "totwage",
      }),
    ],
    baseRows: [
      buildRow({
        year: 2015,
        industryCode: "11",
        metricValue: 1_200,
        metricKey: "totwage",
      }),
      buildRow({
        year: 2016,
        industryCode: "11",
        metricValue: 1_400,
        metricKey: "totwage",
      }),
    ],
    baseTimeRows: [
      buildRow({
        year: 2015,
        industryCode: "11",
        metricValue: 1_000,
        metricKey: "totwage",
      }),
    ],
    localTotalRows: [
      buildRow({
        year: 2015,
        industryCode: "00",
        metricValue: 10_000,
        metricKey: "totwage",
      }),
      buildRow({
        year: 2016,
        industryCode: "00",
        metricValue: 12_000,
        metricKey: "totwage",
      }),
    ],
    baseTotalRows: [
      buildRow({
        year: 2015,
        industryCode: "00",
        metricValue: 18_000,
        metricKey: "totwage",
      }),
      buildRow({
        year: 2016,
        industryCode: "00",
        metricValue: 20_000,
        metricKey: "totwage",
      }),
    ],
    industryOptions: INDUSTRY_OPTIONS,
    minimumYear: 2015,
    metricKey: "totwage",
  });

  assert.equal(result.frames.length, 2);
  assert.equal(result.frames[1].points[0]?.metricKey, "totwage");
  assert.equal(result.frames[1].points[0]?.localValue, 1_500);
});
