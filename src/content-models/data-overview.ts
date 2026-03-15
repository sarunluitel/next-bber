import { Pages } from "pages";
import type { LocationQuotientFrame } from "@/content-models/location-quotient";
import type { PopulationPyramidFrame } from "@/content-models/population-pyramid";

export type DataOverviewInlinePart =
  | {
      type: "text";
      value: string;
    }
  | {
      type: "link";
      label: string;
      href: string;
      external?: boolean;
    };

export type DataOverviewParagraph = DataOverviewInlinePart[];

export type DataOverviewLocationQuotientPreview = {
  title: string;
  subtitle: string;
  sourceLine: string;
  frames: LocationQuotientFrame[];
  initialYear: number | null;
  baseYear: number;
};

export type DataOverviewPopulationPyramidPreview = {
  title: string;
  subtitle: string;
  sourceLine: string;
  frames: PopulationPyramidFrame[];
  initialYear: number | null;
  maxBandPopulation: number;
};

export type DataOverviewPreviewState<TPreview> =
  | {
      status: "ready";
      preview: TPreview;
    }
  | {
      status: "error";
      message: string;
    };

export type DataOverviewPageData = {
  path: string;
  title: string;
  introParagraphs: DataOverviewParagraph[];
  beyondTitle: string;
  locationQuotientPreview: DataOverviewPreviewState<DataOverviewLocationQuotientPreview>;
  populationPyramidPreview: DataOverviewPreviewState<DataOverviewPopulationPyramidPreview>;
};

export const dataOverviewContent = {
  path: Pages.Data.url,
  title: "Data",
  introParagraphs: [
    [
      {
        type: "text",
        value:
          "BBER's socio-economic database is organized geographically. You can access New Mexico data at the levels of the state, counties, incorporated places, tribal areas, and colonias through the navigation in this section. The Data pages also include national indicators and tools that help place New Mexico in a broader context.",
      },
    ],
    [
      {
        type: "text",
        value:
          "Earth Data Analysis Center (EDAC) and BBER have collaborated for more than three decades to provide data for GIS work across New Mexico. The Resource Geographic Information System (",
      },
      {
        type: "link",
        label: "RGIS",
        href: "https://rgis.unm.edu/",
        external: true,
      },
      {
        type: "text",
        value:
          ") serves as the state's digital geospatial data clearinghouse. BBER's ",
      },
      {
        type: "link",
        label: "interactive RGIS tool",
        href: Pages.Data.children.RGIS.url,
      },
      {
        type: "text",
        value:
          " lets researchers combine selected economic data with Census geographies and build GIS-ready files for counties, cities, and metro areas.",
      },
    ],
    [
      {
        type: "text",
        value:
          "Consumer Price Index data for all Urban Consumers (CPI-U) are available ",
      },
      {
        type: "link",
        label: "on the CPI page",
        href: Pages.Data.children.CPI.url,
      },
      {
        type: "text",
        value: ".",
      },
    ],
    [
      {
        type: "text",
        value: "Need help finding a dataset or chart? ",
      },
      {
        type: "link",
        label: "Contact us",
        href: Pages.About_BBER.children.Contact.url,
      },
      {
        type: "text",
        value: " and we can help point you in the right direction.",
      },
    ],
  ],
  beyondTitle: "Beyond New Mexico",
} satisfies Omit<
  DataOverviewPageData,
  "locationQuotientPreview" | "populationPyramidPreview"
>;
