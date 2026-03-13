import { PublicationsPageView } from "@/components/site/publications-page";
import { publicationsPageContent } from "@/content-models/research-content";
import { getPublicationsPageData } from "@/lib/cms/bber-research";

export default async function PublicationsPage(
  props: PageProps<"/research/publications">,
) {
  const searchParams = await props.searchParams;
  const publicationsPageData = await getPublicationsPageData(searchParams);

  return (
    <PublicationsPageView
      content={publicationsPageContent}
      data={publicationsPageData}
    />
  );
}
