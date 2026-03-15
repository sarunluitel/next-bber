import JSZip from "jszip";
import type {
  BberTableMetadataColumn,
  BberTableResponse,
  RawRecord,
} from "@/lib/econindicators";

function escapeCsvValue(value: unknown) {
  if (value === null || value === undefined) {
    return "";
  }

  const normalizedValue = typeof value === "string" ? value : String(value);

  if (
    normalizedValue.includes(",") ||
    normalizedValue.includes('"') ||
    normalizedValue.includes("\n")
  ) {
    return `"${normalizedValue.replaceAll('"', '""')}"`;
  }

  return normalizedValue;
}

function buildCsvContent(headers: string[], rows: unknown[][]) {
  const headerRow = headers.map((header) => escapeCsvValue(header)).join(",");
  const dataRows = rows.map((row) =>
    row.map((value) => escapeCsvValue(value)).join(","),
  );

  return [headerRow, ...dataRows].join("\r\n");
}

function stripControlCharacters(value: string) {
  return Array.from(value)
    .filter((character) => {
      const characterCode = character.charCodeAt(0);
      return characterCode >= 32 && characterCode !== 127;
    })
    .join("");
}

function sanitizeDownloadFileName(value: string) {
  return stripControlCharacters(value)
    .replace(/[<>:"/\\|?*]/g, "")
    .trim()
    .replace(/\s+/g, " ");
}

function getTableMetadataRecord(response: BberTableResponse) {
  const metadataTable = response.metadata?.table;
  return metadataTable && typeof metadataTable === "object"
    ? (metadataTable as RawRecord)
    : null;
}

function buildRawColumnOrder(
  rows: RawRecord[],
  metadataColumns: BberTableMetadataColumn[],
) {
  const rowKeys = new Set(rows.flatMap((row) => Object.keys(row)));
  const orderedKeys: string[] = [];

  for (const column of metadataColumns) {
    if (
      rowKeys.has(column.column_name) &&
      !orderedKeys.includes(column.column_name)
    ) {
      orderedKeys.push(column.column_name);
    }
  }

  for (const key of rowKeys) {
    if (!orderedKeys.includes(key)) {
      orderedKeys.push(key);
    }
  }

  return orderedKeys;
}

function buildFormattedHeaderLookup(
  metadataColumns: BberTableMetadataColumn[],
) {
  const headerLookup = new Map<string, string>();

  for (const column of metadataColumns) {
    if (!headerLookup.has(column.column_name)) {
      headerLookup.set(column.column_name, column.display_name);
    }
  }

  return headerLookup;
}

export function buildChartJsonFileName(chartTitle: string) {
  return `${sanitizeDownloadFileName(chartTitle)}.json`;
}

export function buildChartCsvZipFileName(chartTitle: string) {
  return `${sanitizeDownloadFileName(chartTitle)}.zip`;
}

export async function buildChartCsvZipBuffer({
  chartTitle,
  response,
  dataRows,
  metadataColumns,
}: {
  chartTitle: string;
  response: BberTableResponse;
  dataRows: RawRecord[];
  metadataColumns: BberTableMetadataColumn[];
}) {
  const zip = new JSZip();
  const safeTitle = sanitizeDownloadFileName(chartTitle);
  const rawColumnOrder = buildRawColumnOrder(dataRows, metadataColumns);
  const formattedHeaderLookup = buildFormattedHeaderLookup(metadataColumns);
  const tableMetadataRecord = getTableMetadataRecord(response);

  const tableMetadataHeaders = tableMetadataRecord
    ? Object.keys(tableMetadataRecord)
    : ["message"];
  const tableMetadataRows = tableMetadataRecord
    ? [tableMetadataHeaders.map((key) => tableMetadataRecord[key])]
    : [["Table metadata not reported by upstream API"]];

  zip.file(
    `${safeTitle}_table_metadata.csv`,
    buildCsvContent(tableMetadataHeaders, tableMetadataRows),
  );

  zip.file(
    `${safeTitle}_columns_metadata.csv`,
    buildCsvContent(
      ["table_name", "column_name", "display_name", "column_description"],
      metadataColumns.map((column) => [
        column.table_name,
        column.column_name,
        column.display_name,
        column.column_description,
      ]),
    ),
  );

  zip.file(
    `${safeTitle}_formatted_data.csv`,
    buildCsvContent(
      rawColumnOrder.map(
        (columnKey) => formattedHeaderLookup.get(columnKey) ?? columnKey,
      ),
      dataRows.map((row) => rawColumnOrder.map((columnKey) => row[columnKey])),
    ),
  );

  zip.file(
    `${safeTitle}.csv`,
    buildCsvContent(
      rawColumnOrder,
      dataRows.map((row) => rawColumnOrder.map((columnKey) => row[columnKey])),
    ),
  );

  return zip.generateAsync({ type: "nodebuffer" });
}
