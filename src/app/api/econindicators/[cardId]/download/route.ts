import { NextResponse } from "next/server";
import { getEconIndicatorCardConfig } from "@/content-models/econindicators";
import {
  buildChartCsvZipBuffer,
  buildChartCsvZipFileName,
  buildChartJsonFileName,
} from "@/lib/chart-downloads";
import { fetchIndicatorDataset } from "@/lib/econindicators";

export async function GET(
  request: Request,
  context: RouteContext<"/api/econindicators/[cardId]/download">,
) {
  const { cardId } = await context.params;
  const cardConfig = getEconIndicatorCardConfig(cardId);

  if (!cardConfig) {
    return NextResponse.json(
      { message: "Economic indicator chart was not found." },
      { status: 404 },
    );
  }

  const requestUrl = new URL(request.url);
  const format = requestUrl.searchParams.get("format");
  const dataset = await fetchIndicatorDataset(cardConfig);

  if (format === "json") {
    return new NextResponse(
      JSON.stringify(
        {
          metadata: dataset.response.metadata ?? null,
          data: dataset.filteredRows,
        },
        null,
        2,
      ),
      {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Content-Disposition": `attachment; filename="${buildChartJsonFileName(cardConfig.title)}"`,
        },
      },
    );
  }

  if (format === "csv") {
    const zipBuffer = await buildChartCsvZipBuffer({
      chartTitle: cardConfig.title,
      response: dataset.response,
      dataRows: dataset.filteredRows,
      metadataColumns: dataset.metadataColumns,
    });

    return new NextResponse(new Uint8Array(zipBuffer), {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${buildChartCsvZipFileName(cardConfig.title)}"`,
      },
    });
  }

  return NextResponse.json(
    { message: "Unsupported download format." },
    { status: 400 },
  );
}
