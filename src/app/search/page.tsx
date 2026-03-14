import { PlaceholderPage } from "@/components/site/placeholder-page";

export default async function SearchPage(props: PageProps<"/search">) {
  const { q } = await props.searchParams;
  const query = typeof q === "string" ? q.trim() : "";

  return (
    <PlaceholderPage
      pathname="/search"
      title="Search"
      lead={
        query
          ? `Search for “${query}” is not available yet.`
          : "Search is currently under construction."
      }
      statusTitle="Under Construction"
      statusMessage="Search is currently under construction. Please try again later."
      trail={[
        {
          key: "Search",
          node: {
            title: "Search",
            url: "/search",
            children: {},
          },
        },
      ]}
    />
  );
}
