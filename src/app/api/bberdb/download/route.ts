import { NextResponse } from "next/server";
import { parseBberDbRequestedQuery } from "@/content-models/bberdb";
import { BberDbRouteError, getBberDbDownloadPayload } from "@/lib/bberdb";
import {
  type ApiEndpointPayload,
  buildDatasetCsvZipBuffer,
  buildDownloadCsvZipFileName,
  buildDownloadJsonFileName,
} from "@/lib/chart-downloads";

function buildErrorResponse(error: unknown) {
  if (error instanceof BberDbRouteError) {
    return NextResponse.json(
      { message: error.message },
      { status: error.status },
    );
  }

  return NextResponse.json(
    { message: "The BBER download request could not be completed." },
    { status: 500 },
  );
}

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url);
    const format = requestUrl.searchParams.get("format");
    const { tableName, query } = parseBberDbRequestedQuery(
      requestUrl.searchParams,
    );

    if (!tableName) {
      throw new BberDbRouteError(
        400,
        "A table query parameter is required for BBER downloads.",
      );
    }

    if (format !== "api" && format !== "json" && format !== "csv") {
      throw new BberDbRouteError(400, "Unsupported BBER download format.");
    }

    const payload = await getBberDbDownloadPayload({
      tableName,
      requestedQuery: query,
    });

    if (format === "api") {
      return NextResponse.json({
        title: `${payload.datasetLabel} API Endpoint`,
        description:
          "Use this endpoint in your own workflow to retrieve the source data behind this table.",
        endpoints: [
          {
            label: payload.datasetLabel,
            apiUrl: payload.apiUrl,
          },
        ],
      } satisfies ApiEndpointPayload);
    }

    if (format === "json") {
      return new NextResponse(
        JSON.stringify(
          {
            tableName: payload.query.table,
            datasetLabel: payload.datasetLabel,
            query: payload.query,
            apiUrl: payload.apiUrl,
            metadata: payload.response.metadata ?? null,
            data: payload.rawRows,
          },
          null,
          2,
        ),
        {
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Content-Disposition": `attachment; filename="${buildDownloadJsonFileName(payload.datasetLabel)}"`,
          },
        },
      );
    }

    const zipBuffer = await buildDatasetCsvZipBuffer({
      chartTitle: payload.datasetLabel,
      response: payload.response,
      dataRows: payload.rawRows,
      metadataColumns: payload.metadataColumns,
    });

    return new NextResponse(new Uint8Array(zipBuffer), {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${buildDownloadCsvZipFileName(payload.datasetLabel)}"`,
      },
    });
  } catch (error) {
    return buildErrorResponse(error);
  }
}
