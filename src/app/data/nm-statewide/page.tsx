import { NmStatewideDashboard } from "@/components/site/nm-statewide-dashboard";
import { SectionPageShell } from "@/components/site/section-page-shell";
import { getNmStatewideDashboardPageData } from "@/lib/nm-statewide-dashboard";

export const revalidate = 3600;

export default async function NmStatewidePage() {
  const pageData = await getNmStatewideDashboardPageData();

  return (
    <SectionPageShell pathname="/data/nm-statewide/">
      <NmStatewideDashboard pageData={pageData} />
    </SectionPageShell>
  );
}
