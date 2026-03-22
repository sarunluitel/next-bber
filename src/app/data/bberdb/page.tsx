import { BberDbPageView } from "@/components/site/bberdb-page-view";
import { SectionPageShell } from "@/components/site/section-page-shell";
import { BBER_DB_PAGE_CONTENT } from "@/content-models/bberdb";
import { getBberDbInitialPageData } from "@/lib/bberdb";

// Keep the page request dynamic so a transient upstream outage does not leave
// the entire portal stuck serving a cached fallback shell.
export const revalidate = 0;

export default async function BberDbPage() {
  const pageData = await getBberDbInitialPageData();

  return (
    <SectionPageShell pathname={BBER_DB_PAGE_CONTENT.path}>
      <BberDbPageView pageData={pageData} />
    </SectionPageShell>
  );
}
