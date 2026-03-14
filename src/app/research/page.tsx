import { ResearchOverview } from "@/components/site/research-overview";
import { SectionPageShell } from "@/components/site/section-page-shell";
import { researchPageContent } from "@/content-models/research-content";

export default function ResearchPage() {
  return (
    <SectionPageShell pathname="/research/">
      <div className="min-w-0">
        <ResearchOverview content={researchPageContent} />
      </div>
    </SectionPageShell>
  );
}
