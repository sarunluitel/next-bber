import { PlaceholderPage } from "@/components/site/placeholder-page";

export default async function SearchPage(props: PageProps<"/search">) {
  const { q } = await props.searchParams;
  const query = typeof q === "string" ? q.trim() : "";

  return (
    <PlaceholderPage
      title="Search"
      lead={
        query
          ? `Search UI is in place for “${query}”. The final search backend can be connected here when that data source is ready.`
          : "Search UI is in place. The final search backend can be connected here when that data source is ready."
      }
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
