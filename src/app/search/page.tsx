import { NotYetImplemented } from "@/components/site/not-yet-built";

export default async function SearchPage(props: PageProps<"/search">) {
  const { q } = await props.searchParams;
  const query = typeof q === "string" ? q.trim() : "";

  return (
    <NotYetImplemented
      pathname="/search"
      lead={
        query
          ? `Search for “${query}” is not available yet.`
          : "Search is not available yet."
      }
      statusTitle="Search Not Yet Available"
      statusMessage="Search is not available yet. Please check back soon."
    />
  );
}
