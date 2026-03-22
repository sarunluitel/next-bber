import { NextResponse } from "next/server";
import { parseBberDbRequestedQuery } from "@/content-models/bberdb";
import type { ApiEndpointPayload } from "@/lib/chart-downloads";
import { getRgisDownloadPayload, RgisRouteError } from "@/lib/rgis";
import {
  buildRgisGeoJsonZipBuffer,
  buildRgisShapefileZipBuffer,
} from "@/lib/rgis-downloads";

export const runtime = "nodejs";

function buildErrorResponse(error: unknown) {
  if (error instanceof RgisRouteError) {
    return NextResponse.json(
      { message: error.message },
      { status: error.status },
    );
  }

  return NextResponse.json(
    { message: "The RGIS download request could not be completed." },
    { status: 500 },
  );
}

function buildArchiveFileName(tableName: string, extension: string) {
  const safeTableName = tableName.replace(/[<>:"/\\|?*]/g, "").trim() || "rgis";
  return `${safeTableName}.${extension}`;
}

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url);
    const format = requestUrl.searchParams.get("format");
    const { tableName, query } = parseBberDbRequestedQuery(
      requestUrl.searchParams,
    );

    if (!tableName) {
      throw new RgisRouteError(
        400,
        "A table query parameter is required for RGIS downloads.",
      );
    }

    if (format !== "api" && format !== "geojson" && format !== "shp") {
      throw new RgisRouteError(400, "Unsupported RGIS download format.");
    }

    const payload = await getRgisDownloadPayload({
      tableName,
      requestedQuery: query,
    });

    if (format === "api") {
      return NextResponse.json({
        title: `${payload.datasetLabel} API Endpoint`,
        description:
          "Use this endpoint in your own workflow to retrieve the source GeoJSON behind this map.",
        endpoints: [
          {
            label: payload.datasetLabel,
            apiUrl: payload.apiUrl,
          },
        ],
      } satisfies ApiEndpointPayload);
    }

    if (format === "geojson") {
      const zipBuffer = await buildRgisGeoJsonZipBuffer(payload);

      return new NextResponse(new Uint8Array(zipBuffer), {
        headers: {
          "Content-Type": "application/zip",
          "Content-Disposition": `attachment; filename="${buildArchiveFileName(payload.query.table, "zip")}"`,
        },
      });
    }

    const zipBuffer = await buildRgisShapefileZipBuffer(payload);

    return new NextResponse(new Uint8Array(zipBuffer), {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${buildArchiveFileName(payload.query.table, "zip")}"`,
      },
    });
  } catch (error) {
    return buildErrorResponse(error);
  }
}
