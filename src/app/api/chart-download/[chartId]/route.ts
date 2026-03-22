import { NextResponse } from "next/server";
import type { NmStatewideChartId } from "@/content-models/nm-statewide-dashboard";
import {
  type ApiEndpointPayload,
  buildChartCsvZipFileName,
  buildChartDatasetsCsvZipBuffer,
  buildChartJsonFileName,
} from "@/lib/chart-downloads";
import { getNmStatewideChartDownloadPayload } from "@/lib/nm-statewide-dashboard";

export async function GET(
  request: Request,
  context: RouteContext<"/api/chart-download/[chartId]">,
) {
  const { chartId } = await context.params;
  const payload = await getNmStatewideChartDownloadPayload(
    chartId as NmStatewideChartId,
  );

  if (!payload) {
    return NextResponse.json(
      { message: "Chart download was not found." },
      { status: 404 },
    );
  }

  const requestUrl = new URL(request.url);
  const format = requestUrl.searchParams.get("format");

  if (format === "api") {
    return NextResponse.json({
      title: payload.chartTitle,
      description:
        "Use these endpoints in your own workflow to retrieve the source data behind this chart.",
      endpoints: payload.datasets.map((dataset) => ({
        label: dataset.label,
        apiUrl: dataset.apiUrl,
      })),
    } satisfies ApiEndpointPayload);
  }

  if (format === "json") {
    return new NextResponse(
      JSON.stringify(
        {
          chartId: payload.chartId,
          chartTitle: payload.chartTitle,
          datasets: payload.datasets.map((dataset) => ({
            label: dataset.label,
            apiUrl: dataset.apiUrl,
            metadata: dataset.response.metadata ?? null,
            data: dataset.dataRows,
          })),
        },
        null,
        2,
      ),
      {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Content-Disposition": `attachment; filename="${buildChartJsonFileName(payload.chartTitle)}"`,
        },
      },
    );
  }

  if (format === "csv") {
    const zipBuffer = await buildChartDatasetsCsvZipBuffer({
      chartTitle: payload.chartTitle,
      datasets: payload.datasets,
    });

    return new NextResponse(new Uint8Array(zipBuffer), {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${buildChartCsvZipFileName(payload.chartTitle)}"`,
      },
    });
  }

  return NextResponse.json(
    { message: "Unsupported download format." },
    { status: 400 },
  );
}
