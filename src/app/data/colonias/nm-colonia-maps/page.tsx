import { ColoniaMapsPageView } from "@/components/site/colonias-page-view";
import { COLONIA_MAPS_PAGE } from "@/content-models/colonias-content";

export default function ColoniaMapsPage() {
  return (
    <ColoniaMapsPageView
      eyebrow={COLONIA_MAPS_PAGE.eyebrow}
      title={COLONIA_MAPS_PAGE.title}
      lead={COLONIA_MAPS_PAGE.lead}
      backHref={COLONIA_MAPS_PAGE.backHref}
      backLabel={COLONIA_MAPS_PAGE.backLabel}
      introParagraphs={COLONIA_MAPS_PAGE.introParagraphs}
      overviewLinks={COLONIA_MAPS_PAGE.overviewLinks}
      counties={COLONIA_MAPS_PAGE.counties}
      pathname={COLONIA_MAPS_PAGE.path}
    />
  );
}
