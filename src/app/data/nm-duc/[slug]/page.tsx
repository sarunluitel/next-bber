import { notFound } from "next/navigation";
import { DataConferencePageView } from "@/components/site/data-conference-page-view";
import {
  getConferenceDetailPage,
  getConferenceStaticSlugs,
} from "@/lib/cms/bber-data-conferences";

export async function generateStaticParams() {
  return getConferenceStaticSlugs();
}

export default async function DataUsersConferenceDetailPage(
  props: PageProps<"/data/nm-duc/[slug]">,
) {
  const params = await props.params;
  const conferencePage = await getConferenceDetailPage(params.slug);

  if (!conferencePage) {
    notFound();
  }

  return <DataConferencePageView page={conferencePage} />;
}
