import { BberDbLoadingView } from "@/components/site/bberdb-loading-view";
import { SectionPageShell } from "@/components/site/section-page-shell";

export default function BberDbLoading() {
  return (
    <SectionPageShell pathname="/data/bberdb/">
      <BberDbLoadingView />
    </SectionPageShell>
  );
}
