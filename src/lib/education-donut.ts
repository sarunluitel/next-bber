import "server-only";

import {
  buildEducationDonutPageData,
  type EducationDonutPageData,
  getDefaultEducationDonutConfig,
  normalizeEducationDonutColumns,
  normalizeEducationDonutRow,
  normalizeEducationDonutSourceMetadata,
} from "@/content-models/education-donut";

const BBER_REST_ENDPOINT = "https://api.bber.unm.edu/api/data/rest/bbertable";

export type BberTableResponse = {
  data?: unknown;
  metadata?: {
    table?: unknown;
    columns?: unknown;
  };
};

export function buildEducationDonutApiUrl() {
  const requestConfig = getDefaultEducationDonutConfig();
  const searchParams = new URLSearchParams({
    table: requestConfig.table,
    areatype: requestConfig.areatype,
    area: requestConfig.area,
    periodyear: requestConfig.periodyear,
    periodtype: requestConfig.periodtype,
    variables: requestConfig.variables.join(","),
  });

  return `${BBER_REST_ENDPOINT}?${searchParams.toString()}`;
}

export async function fetchEducationDonutResponse() {
  const apiUrl = buildEducationDonutApiUrl();

  const response = await fetch(apiUrl, {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(
      `Educational attainment request failed with status ${response.status}.`,
    );
  }

  return (await response.json()) as BberTableResponse;
}

export async function getEducationDonutPageData(): Promise<EducationDonutPageData> {
  const response = await fetchEducationDonutResponse();
  const row = normalizeEducationDonutRow(response.data);
  const columns = normalizeEducationDonutColumns(response.metadata?.columns);
  const sourceMetadata = normalizeEducationDonutSourceMetadata(
    response.metadata?.table,
  );

  return buildEducationDonutPageData({
    row,
    columns,
    sourceMetadata,
  });
}
