import "server-only";

import {
  buildPopulationPyramidChartModel,
  buildPopulationPyramidFrames,
  getDefaultPopulationPyramidConfig,
  normalizePopulationPyramidRows,
  normalizePopulationPyramidSourceMetadata,
  type PopulationPyramidPageData,
} from "@/content-models/population-pyramid";

const BBER_REST_ENDPOINT = "https://api.bber.unm.edu/api/data/rest/bbertable";

type BberTableResponse = {
  data?: unknown;
  metadata?: {
    table?: unknown;
  };
};

async function fetchPopulationPyramidResponse() {
  const requestConfig = getDefaultPopulationPyramidConfig();
  const searchParams = new URLSearchParams({
    table: requestConfig.table,
    areatype: requestConfig.areatype,
    area: requestConfig.area,
    periodtype: requestConfig.periodtype,
    variables: requestConfig.variables.join(","),
  });
  const response = await fetch(
    `${BBER_REST_ENDPOINT}?${searchParams.toString()}`,
    {
      next: { revalidate: 3600 },
    },
  );

  if (!response.ok) {
    throw new Error(
      `Population pyramid request failed with status ${response.status}.`,
    );
  }

  return (await response.json()) as BberTableResponse;
}

export async function getPopulationPyramidPageData(): Promise<PopulationPyramidPageData> {
  const requestConfig = getDefaultPopulationPyramidConfig();
  const response = await fetchPopulationPyramidResponse();
  const rows = normalizePopulationPyramidRows(response.data);
  const sourceMetadata = normalizePopulationPyramidSourceMetadata(
    response.metadata?.table,
  );
  const frameResult = buildPopulationPyramidFrames(rows);
  const firstRow = rows[0];
  const geographyLabel = firstRow?.geographyName ?? "Selected geography";
  const periodLabel = firstRow?.periodLabel ?? "Annual estimates";

  return {
    eyebrow: "External Data Visualization",
    title: "Population Pyramid Prototype",
    description:
      "This page recreates the statewide population pyramid as a dedicated explorer, using the published BBER REST feed for age-by-sex annual population estimates.",
    methodology:
      "The server fetches the full annual `pep_cc` series, normalizes age-band rows into one frame per year, and keeps totals, labels, and fallback notes tied to the live response rather than hardcoded page values.",
    geographyLabel,
    requestConfig,
    chart: buildPopulationPyramidChartModel({
      geographyLabel,
      periodLabel,
      frames: frameResult.frames,
      coverage: frameResult.coverage,
      sourceMetadata,
    }),
    sourceMetadata,
  };
}
