import "server-only";

import {
  type BberNewsFilters,
  filterNewsArchiveItems,
  normalizeNewsArchiveItems,
  normalizeNewsFilters,
  normalizeNewsIndexes,
} from "@/content-models/bber-news";

const BBER_NEWS_ENDPOINT = "https://api.bber.unm.edu/api/bber-news/";
const BBER_NEWS_INDEXES_ENDPOINT =
  "https://api.bber.unm.edu/api/bber-news/indexes";
const NEWS_RESULT_LIMIT = 100;

export type NewsPageData = {
  filters: BberNewsFilters;
  indexes: ReturnType<typeof normalizeNewsIndexes>;
  items: ReturnType<typeof normalizeNewsArchiveItems>;
  isTruncated: boolean;
};

async function fetchNewsJson(endpoint: string, searchParams?: URLSearchParams) {
  const url = searchParams?.size
    ? `${endpoint}?${searchParams.toString()}`
    : endpoint;

  const response = await fetch(url, {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`BBER news request failed with status ${response.status}.`);
  }

  return response.json();
}

function buildNewsQuery(filters: BberNewsFilters) {
  const searchParams = new URLSearchParams({
    year: filters.year,
    month: filters.month,
    limit: String(NEWS_RESULT_LIMIT),
  });

  return searchParams;
}

export async function getNewsPageData(
  rawSearchParams: Record<string, string | string[] | undefined>,
): Promise<NewsPageData> {
  const filters = normalizeNewsFilters(rawSearchParams);

  const [indexes, archiveItems] = await Promise.all([
    fetchNewsJson(BBER_NEWS_INDEXES_ENDPOINT).then(normalizeNewsIndexes),
    fetchNewsJson(BBER_NEWS_ENDPOINT, buildNewsQuery(filters)).then(
      normalizeNewsArchiveItems,
    ),
  ]);

  const items = filterNewsArchiveItems(archiveItems, filters.query);

  return {
    filters,
    indexes,
    items,
    isTruncated: archiveItems.length >= NEWS_RESULT_LIMIT,
  };
}
