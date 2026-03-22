import { RgisPageView } from "@/components/site/rgis-page-view";
import { SectionPageShell } from "@/components/site/section-page-shell";
import { RGIS_PAGE_CONTENT } from "@/content-models/rgis";
import { getRgisInitialPageData } from "@/lib/rgis";

export const revalidate = 0;

export default async function RgisPage() {
  const pageData = await getRgisInitialPageData();

  return (
    <SectionPageShell pathname={RGIS_PAGE_CONTENT.path}>
      <RgisPageView pageData={pageData} />
    </SectionPageShell>
  );
}
