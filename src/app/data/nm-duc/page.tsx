import { notFound } from "next/navigation";
import { DataConferencePageView } from "@/components/site/data-conference-page-view";
import { getConferenceIndexPage } from "@/lib/cms/bber-data-conferences";

export default async function DataUsersConferencePage() {
  const conferencePage = await getConferenceIndexPage();

  if (!conferencePage) {
    notFound();
  }

  return <DataConferencePageView page={conferencePage} />;
}
