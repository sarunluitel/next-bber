import { RgisLoadingView } from "@/components/site/rgis-loading-view";
import { SectionPageShell } from "@/components/site/section-page-shell";

export default function RgisLoading() {
  return (
    <SectionPageShell pathname="/data/rgis/">
      <RgisLoadingView />
    </SectionPageShell>
  );
}
