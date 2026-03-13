import "server-only";

import {
  type BberNewsItem,
  type BberPublicationItem,
  normalizeBberNewsItems,
  normalizeBberPublicationItems,
} from "@/content-models/bber-homepage";

const BBER_NEWS_ENDPOINT = "https://api.bber.unm.edu/api/bber-news?limit=3";
const BBER_PUBLICATIONS_ENDPOINT =
  "https://api.bber.unm.edu/api/bber-research/publications?limit=3";

export type FeedState<T> = {
  status: "ready" | "empty" | "error";
  items: T[];
  message?: string;
};

async function fetchHomepageJson(endpoint: string) {
  const response = await fetch(endpoint, {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`BBER CMS request failed with status ${response.status}.`);
  }

  return response.json();
}

function toFeedState<T>(
  settledResult: PromiseSettledResult<T[]>,
  errorMessage: string,
): FeedState<T> {
  if (settledResult.status === "rejected") {
    return {
      status: "error",
      items: [],
      message: errorMessage,
    };
  }

  if (settledResult.value.length === 0) {
    return {
      status: "empty",
      items: [],
    };
  }

  return {
    status: "ready",
    items: settledResult.value,
  };
}

export async function getHomepageFeeds() {
  const [newsResult, publicationsResult] = await Promise.allSettled([
    fetchHomepageJson(BBER_NEWS_ENDPOINT).then(normalizeBberNewsItems),
    fetchHomepageJson(BBER_PUBLICATIONS_ENDPOINT).then(
      normalizeBberPublicationItems,
    ),
  ]);

  return {
    news: toFeedState<BberNewsItem>(
      newsResult,
      "News releases are temporarily unavailable.",
    ),
    publications: toFeedState<BberPublicationItem>(
      publicationsResult,
      "Publications are temporarily unavailable.",
    ),
  };
}
