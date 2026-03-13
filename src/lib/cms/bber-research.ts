import "server-only";

import {
  type BberPublicationFilters,
  normalizePublicationFilters,
  normalizePublicationIndexes,
  normalizePublicationRecords,
  publicationFiltersAreActive,
} from "@/content-models/bber-research";

const BBER_PUBLICATIONS_ENDPOINT =
  "https://api.bber.unm.edu/api/bber-research/publications";
const BBER_PUBLICATION_INDEXES_ENDPOINT =
  "https://api.bber.unm.edu/api/bber-research/publications/indexes";

export type PublicationsPageData = {
  filters: BberPublicationFilters;
  indexes: ReturnType<typeof normalizePublicationIndexes>;
  mode: "featured" | "filtered";
  items: ReturnType<typeof normalizePublicationRecords>;
};

async function fetchResearchJson(
  endpoint: string,
  searchParams?: URLSearchParams,
) {
  const url = searchParams?.size
    ? `${endpoint}?${searchParams.toString()}`
    : endpoint;
  const response = await fetch(url, {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(
      `BBER research request failed with status ${response.status}.`,
    );
  }

  return response.json();
}

function buildPublicationsQuery(filters: BberPublicationFilters) {
  const searchParams = new URLSearchParams();

  if (filters.year) {
    searchParams.set("year", filters.year);
  }

  if (filters.category) {
    searchParams.set("category", filters.category);
  }

  if (filters.community) {
    searchParams.set("community", filters.community);
  }

  searchParams.set("limit", "100");
  return searchParams;
}

export async function getPublicationsPageData(
  rawSearchParams: Record<string, string | string[] | undefined>,
): Promise<PublicationsPageData> {
  const filters = normalizePublicationFilters(rawSearchParams);
  const indexesPromise = fetchResearchJson(
    BBER_PUBLICATION_INDEXES_ENDPOINT,
  ).then(normalizePublicationIndexes);

  if (publicationFiltersAreActive(filters)) {
    const [indexes, items] = await Promise.all([
      indexesPromise,
      fetchResearchJson(
        BBER_PUBLICATIONS_ENDPOINT,
        buildPublicationsQuery(filters),
      ).then(normalizePublicationRecords),
    ]);

    return {
      filters,
      indexes,
      mode: "filtered",
      items,
    };
  }

  const [indexes, items] = await Promise.all([
    indexesPromise,
    fetchResearchJson(
      BBER_PUBLICATIONS_ENDPOINT,
      new URLSearchParams({ featured: "true" }),
    ).then(normalizePublicationRecords),
  ]);

  return {
    filters,
    indexes,
    mode: "featured",
    items,
  };
}
