import { NextResponse } from "next/server";
import { parseBberDbRequestedQuery } from "@/content-models/bberdb";
import { BberDbRouteError, getBberDbFilterModel } from "@/lib/bberdb";

function buildErrorResponse(error: unknown) {
  if (error instanceof BberDbRouteError) {
    return NextResponse.json(
      { message: error.message },
      { status: error.status },
    );
  }

  return NextResponse.json(
    { message: "The BBER filter request could not be completed." },
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
      throw new BberDbRouteError(
        400,
        "A table query parameter is required for BBER filter metadata.",
      );
    }

    return NextResponse.json(
      await getBberDbFilterModel({
        tableName,
        requestedQuery: query,
      }),
    );
  } catch (error) {
    return buildErrorResponse(error);
  }
}
