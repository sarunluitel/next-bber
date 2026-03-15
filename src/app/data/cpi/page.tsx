import { CpiPageView } from "@/components/site/cpi-page-view";
import { getCpiPageData } from "@/lib/cpi";

export default async function CpiPage() {
  const { pageData, trendState, tableState } = await getCpiPageData();

  return (
    <CpiPageView
      pageData={pageData}
      trendState={trendState}
      tableState={tableState}
    />
  );
}
