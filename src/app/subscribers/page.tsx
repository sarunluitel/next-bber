import { notFound } from "next/navigation";
import { SubscribersPageView } from "@/components/site/subscribers-page-view";
import { findSubscribersPage } from "@/content-models/subscribers-content";

export default function SubscribersPage() {
  const subscribersPage = findSubscribersPage("/subscribers/");

  if (!subscribersPage) {
    notFound();
  }

  return <SubscribersPageView page={subscribersPage} />;
}
