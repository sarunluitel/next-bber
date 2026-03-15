import { notFound } from "next/navigation";
import { SubscribersPageView } from "@/components/site/subscribers-page-view";
import { findSubscribersPage } from "@/content-models/subscribers-content";

export default async function SubscribersChildPage(
  props: PageProps<"/subscribers/[...slug]">,
) {
  const params = await props.params;
  const slug = params.slug ?? [];
  const pathname = `/subscribers/${slug.join("/")}/`;
  const subscribersPage = findSubscribersPage(pathname);

  if (!subscribersPage) {
    notFound();
  }

  return <SubscribersPageView page={subscribersPage} />;
}
