import { EconIndicatorsDashboard } from "@/components/site/econindicators-dashboard";
import { SectionPageShell } from "@/components/site/section-page-shell";
import { getEconomicIndicatorsPageData } from "@/lib/econindicators";

export default async function EconomicIndicatorsPage() {
  const pageData = await getEconomicIndicatorsPageData();

  return (
    <SectionPageShell pathname="/data/econindicators/">
      <EconIndicatorsDashboard pageData={pageData} />
    </SectionPageShell>
  );
}
