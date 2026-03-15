import { DataOverviewPageView } from "@/components/site/data-overview-page-view";
import { getDataOverviewPageData } from "@/lib/data-overview";

export default async function DataOverviewPage() {
  const pageData = await getDataOverviewPageData();

  return <DataOverviewPageView pageData={pageData} />;
}
