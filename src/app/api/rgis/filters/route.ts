import { NextResponse } from "next/server";
import { parseBberDbRequestedQuery } from "@/content-models/bberdb";
import { getRgisFilterModel, RgisRouteError } from "@/lib/rgis";

function buildErrorResponse(error: unknown) {
  if (error instanceof RgisRouteError) {
    return NextResponse.json(
      { message: error.message },
      { status: error.status },
    );
  }

  return NextResponse.json(
    { message: "The RGIS filter request could not be completed." },
    { status: 500 },
  );
}

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url);
    const { tableName, query } = parseBberDbRequestedQuery(
      requestUrl.searchParams,
    );

    if (!tableName) {
      throw new RgisRouteError(
        400,
        "A table query parameter is required for RGIS filter metadata.",
      );
    }

    return NextResponse.json(
      await getRgisFilterModel({
        tableName,
        requestedQuery: query,
      }),
    );
  } catch (error) {
    return buildErrorResponse(error);
  }
}
