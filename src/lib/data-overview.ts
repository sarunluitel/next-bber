import "server-only";

import {
  type DataOverviewLocationQuotientPreview,
  type DataOverviewPageData,
  type DataOverviewPopulationPyramidPreview,
  type DataOverviewPreviewState,
  dataOverviewContent,
} from "@/content-models/data-overview";
import {
  buildLocationQuotientFrames,
  getDefaultLocationQuotientConfig,
  normalizeLocationQuotientSourceMetadata,
  normalizeQcewMetadataOptions,
  normalizeQcewRows,
} from "@/content-models/location-quotient";
import {
  buildLocationQuotientSourceLine,
  buildPopulationPyramidSourceLine,
} from "@/content-models/nm-statewide-dashboard";
import {
  buildPopulationPyramidFrames,
  normalizePopulationPyramidRows,
  normalizePopulationPyramidSourceMetadata,
  type PopulationPyramidRequestConfig,
} from "@/content-models/population-pyramid";
import {
  fetchQcewMetadataValues,
  fetchQcewTable,
} from "@/lib/location-quotient";
import {
  buildPopulationPyramidApiUrl,
  fetchPopulationPyramidResponse,
} from "@/lib/population-pyramid";

const UNITED_STATES_POPULATION_PYRAMID_CONFIG: PopulationPyramidRequestConfig =
  {
    table: "pep_cc",
    areatype: "00",
    area: "000000",
    periodtype: "65",
    variables: ["tot_female", "tot_male", "agegrp", "time"],
  };

async function buildLocationQuotientPreview(): Promise<
  DataOverviewPreviewState<DataOverviewLocationQuotientPreview>
> {
  try {
    const requestConfig = getDefaultLocationQuotientConfig();
    const [
      localResponse,
      baseResponse,
      baseTimeResponse,
      localTotalResponse,
      baseTotalResponse,
      industryMetadata,
    ] = await Promise.all([
      fetchQcewTable(requestConfig.local),
      fetchQcewTable(requestConfig.base),
      fetchQcewTable(requestConfig.baseTime),
      fetchQcewTable(requestConfig.local, "00"),
      fetchQcewTable(requestConfig.base, "00"),
      fetchQcewMetadataValues(["indcode"]),
    ]);

    const sourceMetadata = normalizeLocationQuotientSourceMetadata(
      localResponse.metadata?.table,
    );
    const industryOptions = normalizeQcewMetadataOptions(
      industryMetadata,
      "indcode",
    );
    const framesResult = buildLocationQuotientFrames({
      localRows: normalizeQcewRows(localResponse.data),
      baseRows: normalizeQcewRows(baseResponse.data),
      baseTimeRows: normalizeQcewRows(baseTimeResponse.data),
      localTotalRows: normalizeQcewRows(localTotalResponse.data),
      baseTotalRows: normalizeQcewRows(baseTotalResponse.data),
      industryOptions,
      minimumYear: requestConfig.baseTime.periodyear,
      metricKey: "avgemp",
    });
    const latestFrame = framesResult.frames.at(-1);

    if (!latestFrame) {
      return {
        status: "error",
        message:
          "The latest location quotient comparison is temporarily unavailable.",
      };
    }

    return {
      status: "ready",
      preview: {
        title: "Location Quotient by Industry",
        subtitle: "New Mexico / United States",
        sourceLine: buildLocationQuotientSourceLine({
          coverage: framesResult.coverage,
          sourceMetadata,
        }),
        frames: framesResult.frames,
        initialYear: latestFrame.year,
        baseYear: requestConfig.baseTime.periodyear,
      },
    };
  } catch {
    return {
      status: "error",
      message:
        "The location quotient preview is temporarily unavailable. You can still explore the statewide dashboard from the section navigation.",
    };
  }
}

async function buildPopulationPyramidPreview(): Promise<
  DataOverviewPreviewState<DataOverviewPopulationPyramidPreview>
> {
  try {
    const response = await fetchPopulationPyramidResponse(
      UNITED_STATES_POPULATION_PYRAMID_CONFIG,
    );
    const rows = normalizePopulationPyramidRows(response.data);
    const sourceMetadata = normalizePopulationPyramidSourceMetadata(
      response.metadata?.table,
    );
    const frameResult = buildPopulationPyramidFrames(rows);
    const latestFrame = frameResult.frames.at(-1);

    if (!latestFrame) {
      return {
        status: "error",
        message:
          "The United States population pyramid preview is temporarily unavailable.",
      };
    }

    return {
      status: "ready",
      preview: {
        title: "Population Pyramid US",
        subtitle: "United States",
        sourceLine: buildPopulationPyramidSourceLine({
          coverage: frameResult.coverage,
          sourceMetadata,
        }),
        frames: frameResult.frames,
        initialYear: latestFrame.year,
        maxBandPopulation: frameResult.coverage.maxBandPopulation,
      },
    };
  } catch {
    return {
      status: "error",
      message:
        "The United States population pyramid preview is temporarily unavailable. The rest of the Data section remains available.",
    };
  }
}

export async function getDataOverviewPageData(): Promise<DataOverviewPageData> {
  const [locationQuotientPreview, populationPyramidPreview] = await Promise.all(
    [buildLocationQuotientPreview(), buildPopulationPyramidPreview()],
  );

  return {
    ...dataOverviewContent,
    locationQuotientPreview,
    populationPyramidPreview,
  };
}

export function getUnitedStatesPopulationPyramidApiUrl() {
  return buildPopulationPyramidApiUrl(UNITED_STATES_POPULATION_PYRAMID_CONFIG);
}
