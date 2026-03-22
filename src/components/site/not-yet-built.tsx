import { findPageByUrl } from "pages";
import { PlaceholderPage } from "@/components/site/placeholder-page";

type NotYetImplementedProps = {
  pathname: string;
  title?: string;
  lead?: string;
  statusTitle?: string;
  statusMessage?: string;
};

export function NotYetImplemented({
  pathname,
  title,
  lead,
  statusTitle = "Not Yet Available",
  statusMessage = "This page is not available yet. Please check back soon.",
}: NotYetImplementedProps) {
  const resolvedPage = findPageByUrl(pathname);
  const resolvedTitle = title ?? resolvedPage?.node.title ?? "Page";
  const trail = resolvedPage?.trail ?? [
    {
      key: pathname,
      node: {
        title: resolvedTitle,
        url: pathname,
        children: {},
      },
    },
  ];

  return (
    <PlaceholderPage
      pathname={pathname}
      title={resolvedTitle}
      lead={
        lead ??
        `${resolvedTitle} content is being prepared for the BBER website.`
      }
      trail={trail}
      statusTitle={statusTitle}
      statusMessage={statusMessage}
    />
  );
}
