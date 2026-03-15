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

function appendChartDatasetToZip(args: {
  zip: JSZip;
  chartTitle: string;
  datasetLabel?: string;
  response: BberTableResponse;
  dataRows: RawRecord[];
  metadataColumns: BberTableMetadataColumn[];
}) {
  const safeTitle = sanitizeDownloadFileName(args.chartTitle);
  const safeDatasetLabel = args.datasetLabel
    ? sanitizeDownloadFileName(args.datasetLabel)
    : null;
  const filePrefix = safeDatasetLabel
    ? `${safeTitle}_${safeDatasetLabel}`
    : safeTitle;
  const rawColumnOrder = buildRawColumnOrder(
    args.dataRows,
    args.metadataColumns,
  );
  const formattedHeaderLookup = buildFormattedHeaderLookup(
    args.metadataColumns,
  );
  const tableMetadataRecord = getTableMetadataRecord(args.response);
  const tableMetadataHeaders = tableMetadataRecord
    ? Object.keys(tableMetadataRecord)
    : ["message"];
  const tableMetadataRows = tableMetadataRecord
    ? [tableMetadataHeaders.map((key) => tableMetadataRecord[key])]
    : [["Table metadata not reported by upstream API"]];

  args.zip.file(
    `${filePrefix}_table_metadata.csv`,
    buildCsvContent(tableMetadataHeaders, tableMetadataRows),
  );

  args.zip.file(
    `${filePrefix}_columns_metadata.csv`,
    buildCsvContent(
      ["table_name", "column_name", "display_name", "column_description"],
      args.metadataColumns.map((column) => [
        column.table_name,
        column.column_name,
        column.display_name,
        column.column_description,
      ]),
    ),
  );

  args.zip.file(
    `${filePrefix}_formatted_data.csv`,
    buildCsvContent(
      rawColumnOrder.map(
        (columnKey) => formattedHeaderLookup.get(columnKey) ?? columnKey,
      ),
      args.dataRows.map((row) =>
        rawColumnOrder.map((columnKey) => row[columnKey]),
      ),
    ),
  );

  args.zip.file(
    `${filePrefix}.csv`,
    buildCsvContent(
      rawColumnOrder,
      args.dataRows.map((row) =>
        rawColumnOrder.map((columnKey) => row[columnKey]),
      ),
    ),
  );
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
  appendChartDatasetToZip({
    zip,
    chartTitle,
    response,
    dataRows,
    metadataColumns,
  });

  return zip.generateAsync({ type: "nodebuffer" });
}

export async function buildChartDatasetsCsvZipBuffer(args: {
  chartTitle: string;
  datasets: {
    label: string;
    response: BberTableResponse;
    dataRows: RawRecord[];
    metadataColumns: BberTableMetadataColumn[];
  }[];
}) {
  const zip = new JSZip();

  for (const dataset of args.datasets) {
    appendChartDatasetToZip({
      zip,
      chartTitle: args.chartTitle,
      datasetLabel: dataset.label,
      response: dataset.response,
      dataRows: dataset.dataRows,
      metadataColumns: dataset.metadataColumns,
    });
  }

  return zip.generateAsync({ type: "nodebuffer" });
}
