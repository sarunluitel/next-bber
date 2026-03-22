import { StaticResourcePageView } from "@/components/site/static-resource-page-view";
import { OPEN_DATA_LANDING_PAGE } from "@/content-models/data-static-pages";

export default function OpenDataPage() {
  return <StaticResourcePageView page={OPEN_DATA_LANDING_PAGE} />;
}
