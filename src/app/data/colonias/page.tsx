import { ColoniasOverviewPageView } from "@/components/site/colonias-page-view";
import { COLONIAS_OVERVIEW_PAGE } from "@/content-models/colonias-content";

export default function ColoniasPage() {
  return (
    <ColoniasOverviewPageView
      eyebrow={COLONIAS_OVERVIEW_PAGE.eyebrow}
      title={COLONIAS_OVERVIEW_PAGE.title}
      lead={COLONIAS_OVERVIEW_PAGE.lead}
      heroParagraphs={COLONIAS_OVERVIEW_PAGE.heroParagraphs}
      heroLinks={COLONIAS_OVERVIEW_PAGE.heroLinks}
      downloadableResources={COLONIAS_OVERVIEW_PAGE.downloadableResources}
      methodologySections={COLONIAS_OVERVIEW_PAGE.methodologySections}
      referenceLinks={COLONIAS_OVERVIEW_PAGE.referenceLinks}
      pathname={COLONIAS_OVERVIEW_PAGE.path}
    />
  );
}
