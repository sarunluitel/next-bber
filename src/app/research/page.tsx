import { ResearchOverview } from "@/components/site/research-overview";
import { ResearchSectionNav } from "@/components/site/research-section-nav";
import { researchPageContent } from "@/content-models/research-content";

export default function ResearchPage() {
  return (
    <div className="bg-[var(--bber-sand)]">
      <section className="mx-auto grid w-full max-w-[1200px] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[250px_minmax(0,1fr)] lg:px-8 lg:py-14">
        <ResearchSectionNav currentUrl="/research/" />
        <ResearchOverview content={researchPageContent} />
      </section>
    </div>
  );
}
