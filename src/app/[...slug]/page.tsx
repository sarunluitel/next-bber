import { notFound } from "next/navigation";
import { findPageByUrl, getPageChildren, getStaticPageSlugs } from "pages";
import { PlaceholderPage } from "@/components/site/placeholder-page";

export const dynamicParams = false;

export function generateStaticParams() {
  return getStaticPageSlugs().map((slug) => ({ slug }));
}

export default async function PlaceholderRoutePage(
  props: PageProps<"/[...slug]">,
) {
  const { slug } = await props.params;
  const pathname = `/${slug.join("/")}`;
  const resolvedPage = findPageByUrl(pathname);

  if (!resolvedPage) {
    notFound();
  }

  return (
    <PlaceholderPage
      title={resolvedPage.node.title}
      lead={`${resolvedPage.node.title} is part of the BBER website and will be available soon.`}
      trail={resolvedPage.trail}
      statusTitle="Under Construction"
      statusMessage={`The ${resolvedPage.node.title} page is currently under construction.`}
      childLinks={Object.values(getPageChildren(resolvedPage.node)).map(
        (childNode) => ({
          title: childNode.title,
          url: childNode.url,
        }),
      )}
    />
  );
}
