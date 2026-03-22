import assert from "node:assert/strict";
import test from "node:test";
import {
  type BberDbFilterOptionsMap,
  buildBberDbApiSearchParams,
  buildBberDbColumns,
  buildBberDbFilterModel,
  buildBberDbResultTitle,
  buildBberDbSourceLine,
  buildBberDbTableRows,
  buildBberDbUpstreamUnavailableMessage,
  formatBberDbDisplayValue,
  normalizeBberDbFilterOptions,
  normalizeBberDbSupportedFilterKeys,
} from "./bberdb.ts";

function buildOptionsMap(
  entries: Partial<Record<string, { value: string; label: string }[]>>,
) {
  return entries as BberDbFilterOptionsMap;
}

test("normalizeBberDbSupportedFilterKeys preserves the shared filter-key order", () => {
  assert.deepEqual(
    normalizeBberDbSupportedFilterKeys([
      "period",
      "ownership",
      "unknown_column",
      "periodyear",
      "areatype",
      "stfips",
      "indcode",
      "periodtype",
      "area",
    ]),
    [
      "stfips",
      "areatype",
      "area",
      "periodyear",
      "periodtype",
      "period",
      "indcode",
      "ownership",
    ],
  );
});

test("normalizeBberDbSupportedFilterKeys accepts the live tablevariables payload shape", () => {
  assert.deepEqual(
    normalizeBberDbSupportedFilterKeys({
      table_name: "v_rp80",
      columns: [
        "release",
        "stfips",
        "areatype",
        "area",
        "periodyear",
        "periodtype",
        "period",
        "indcodty",
        "indcode",
        "ownership",
      ],
    }),
    [
      "stfips",
      "areatype",
      "area",
      "periodyear",
      "periodtype",
      "period",
      "indcode",
      "ownership",
    ],
  );
});

test("buildBberDbFilterModel resolves live-style defaults for s0801", () => {
  const filterModel = buildBberDbFilterModel({
    tableName: "s0801",
    supportedFilterKeys: normalizeBberDbSupportedFilterKeys([
      "stfips",
      "areatype",
      "area",
      "periodyear",
      "periodtype",
      "period",
    ]),
    optionsByKey: buildOptionsMap({
      areatype: [
        { value: "00", label: "State" },
        { value: "01", label: "County" },
      ],
      periodyear: [
        { value: "2022", label: "2022" },
        { value: "2024", label: "2024" },
        { value: "2023", label: "2023" },
      ],
      periodtype: [
        { value: "03", label: "Annual" },
        { value: "61", label: "Five-year" },
      ],
    }),
  });

  assert.deepEqual(filterModel.visibleFilterKeys, [
    "areatype",
    "periodyear",
    "periodtype",
  ]);
  assert.equal(filterModel.draftQuery.table, "s0801");
  assert.equal(filterModel.draftQuery.areatype, "00");
  assert.equal(filterModel.draftQuery.periodyear, "2024");
  assert.equal(filterModel.draftQuery.periodtype, "61");
  assert.deepEqual(
    filterModel.filters.find((filter) => filter.key === "periodyear")?.options,
    [
      { value: "2024", label: "2024" },
      { value: "2023", label: "2023" },
      { value: "2022", label: "2022" },
    ],
  );
});

test("normalizeBberDbFilterOptions sorts years descending", () => {
  assert.deepEqual(
    normalizeBberDbFilterOptions(
      [
        { periodyear: "2021", displayname: "2021" },
        { periodyear: "2024", displayname: "2024" },
        { periodyear: "2023", displayname: "2023" },
      ],
      "periodyear",
    ),
    [
      { value: "2024", label: "2024" },
      { value: "2023", label: "2023" },
      { value: "2021", label: "2021" },
    ],
  );
});

test("buildBberDbFilterModel adds industry and ownership defaults for v_rp80", () => {
  const filterModel = buildBberDbFilterModel({
    tableName: "v_rp80",
    supportedFilterKeys: normalizeBberDbSupportedFilterKeys([
      "stfips",
      "areatype",
      "area",
      "periodyear",
      "periodtype",
      "indcode",
      "ownership",
    ]),
    optionsByKey: buildOptionsMap({
      areatype: [{ value: "01", label: "County" }],
      periodyear: [
        { value: "2024", label: "2024" },
        { value: "2025", label: "2025" },
      ],
      periodtype: [
        { value: "01", label: "Monthly" },
        { value: "03", label: "Annual" },
      ],
      indcode: [
        { value: "00", label: "Total" },
        { value: "11", label: "Agriculture" },
      ],
      ownership: [
        { value: "00", label: "All ownership" },
        { value: "05", label: "Private" },
      ],
    }),
  });

  assert.deepEqual(filterModel.visibleFilterKeys, [
    "areatype",
    "periodyear",
    "periodtype",
    "indcode",
    "ownership",
  ]);
  assert.equal(filterModel.draftQuery.periodyear, "2025");
  assert.equal(filterModel.draftQuery.periodtype, "03");
  assert.equal(filterModel.draftQuery.indcode, "00");
  assert.equal(filterModel.draftQuery.ownership, "00");
});

test("buildBberDbFilterModel keeps requested multi-year selections in filter order", () => {
  const filterModel = buildBberDbFilterModel({
    tableName: "s0801",
    supportedFilterKeys: normalizeBberDbSupportedFilterKeys([
      "stfips",
      "areatype",
      "area",
      "periodyear",
      "periodtype",
    ]),
    optionsByKey: buildOptionsMap({
      areatype: [{ value: "01", label: "County" }],
      periodyear: [
        { value: "2025", label: "2025" },
        { value: "2024", label: "2024" },
        { value: "2023", label: "2023" },
      ],
      periodtype: [{ value: "03", label: "Annual" }],
    }),
    requestedQuery: {
      periodyear: "2023,2025,1999",
    },
  });

  assert.equal(filterModel.draftQuery.periodyear, "2025,2023");
  assert.equal(
    filterModel.filters.find((filter) => filter.key === "periodyear")?.value,
    "2025,2023",
  );
});

test("buildBberDbFilterModel still resolves defaults when the upstream table omits period", () => {
  const filterModel = buildBberDbFilterModel({
    tableName: "b01001",
    supportedFilterKeys: normalizeBberDbSupportedFilterKeys([
      "stfips",
      "areatype",
      "area",
      "periodyear",
      "periodtype",
    ]),
    optionsByKey: buildOptionsMap({
      areatype: [{ value: "00", label: "State" }],
      periodyear: [
        { value: "2021", label: "2021" },
        { value: "2023", label: "2023" },
      ],
      periodtype: [{ value: "61", label: "Five-year" }],
    }),
  });

  assert.deepEqual(filterModel.visibleFilterKeys, [
    "areatype",
    "periodyear",
    "periodtype",
  ]);
  assert.equal(filterModel.draftQuery.areatype, "00");
  assert.equal(filterModel.draftQuery.periodyear, "2023");
  assert.equal(filterModel.draftQuery.periodtype, "61");
});

test("buildBberDbApiSearchParams keeps multi-year selections comma separated", () => {
  const searchParams = buildBberDbApiSearchParams({
    table: "s0801",
    areatype: "01",
    periodyear: "2025,2023",
    periodtype: "03",
  });

  assert.equal(searchParams.get("periodyear"), "2025,2023");
  assert.equal(
    searchParams.toString(),
    "table=s0801&areatype=01&periodyear=2025%2C2023&periodtype=03",
  );
});

test("buildBberDbSourceLine formats selected years as readable ranges", () => {
  assert.equal(
    buildBberDbSourceLine({
      query: {
        table: "s0801",
        periodyear: "2024,2019,2018,2017,2016",
      },
      sourceLabel: "US Census Bureau American Community Survey",
    }),
    "Data Source: 2016-2019 and 2024 US Census Bureau American Community Survey",
  );
});

test("formatBberDbDisplayValue maps legacy sentinel codes", () => {
  assert.equal(formatBberDbDisplayValue(-8), "Not applicable");
  assert.equal(formatBberDbDisplayValue("-3"), "Median in lowest interval");
  assert.equal(formatBberDbDisplayValue("42"), "42");
});

test("buildBberDbColumns moves context columns ahead of metrics and prefers display names", () => {
  const columns = buildBberDbColumns(
    [
      {
        value: 10,
        geographyname: "New Mexico",
        geoid: "35",
        periodyear: "2024",
        period: "12",
        unexpected_column: "kept",
      },
    ],
    [
      {
        table_name: "s0801",
        column_name: "geographyname",
        display_name: "Geography Name",
        column_description: "Human-readable geography label",
      },
      {
        table_name: "s0801",
        column_name: "value",
        display_name: "Value",
        column_description: "Published estimate",
      },
      {
        table_name: "s0801",
        column_name: "geoid",
        display_name: "GEOID",
        column_description: "Geographic identifier",
      },
      {
        table_name: "s0801",
        column_name: "periodyear",
        display_name: "Year",
        column_description: "Published year",
      },
      {
        table_name: "s0801",
        column_name: "period",
        display_name: "which period",
        column_description: "Published period",
      },
    ],
  );

  assert.deepEqual(
    columns.map((column) => column.key),
    [
      "geographyname",
      "geoid",
      "periodyear",
      "period",
      "value",
      "unexpected_column",
    ],
  );
  assert.equal(columns[0]?.header, "Geography Name");
  assert.equal(columns[3]?.header, "Period");
  assert.equal(columns[4]?.header, "Value");
  assert.equal(columns[5]?.header, "unexpected_column");
});

test("buildBberDbTableRows sorts latest years first", () => {
  const rows = buildBberDbTableRows(
    [
      { geographyname: "Bernalillo County", periodyear: "2023", value: 1 },
      { geographyname: "Bernalillo County", periodyear: "2025", value: 2 },
      { geographyname: "Bernalillo County", periodyear: "2024", value: 3 },
    ],
    [
      { key: "geographyname", header: "Geography Name", description: null },
      { key: "periodyear", header: "Year", description: null },
      { key: "value", header: "Value", description: null },
    ],
  );

  assert.deepEqual(
    rows.map((row) => row.cells[1]),
    ["2025", "2024", "2023"],
  );
});

test("buildBberDbResultTitle compacts long geography lists", () => {
  assert.equal(
    buildBberDbResultTitle([
      { geographyname: "Bernalillo County" },
      { geographyname: "Dona Ana County" },
      { geographyname: "Lea County" },
      { geographyname: "McKinley County" },
    ]),
    "Bernalillo County and 3 more geographies",
  );
});

test("buildBberDbUpstreamUnavailableMessage keeps broken legacy tables visible but marks upstream failure", () => {
  const message = buildBberDbUpstreamUnavailableMessage({
    tableName: "sf1p1",
    detail: "Table with the name 'sf1p1' not found.",
  });

  assert.match(message, /currently unavailable/i);
  assert.match(message, /sf1p1/i);
  assert.match(message, /not found/i);
});
