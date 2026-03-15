import "server-only";

import {
  normalizeConferenceArchive,
  normalizeConferenceDetailPage,
  normalizeConferenceIndexPage,
} from "@/content-models/bber-data-conferences";

const BBER_DATA_PAGE_ENDPOINT = "https://api.bber.unm.edu/api/bber-data-pages";
const BBER_DUC_INDEX_ENDPOINT = `${BBER_DATA_PAGE_ENDPOINT}/duc-index`;
const BBER_DUC_GROUP_ENDPOINT = `${BBER_DATA_PAGE_ENDPOINT}?group=data-conferences`;

async function fetchConferenceJson(endpoint: string) {
  const response = await fetch(endpoint, {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(
      `BBER data conference request failed with status ${response.status}.`,
    );
  }

  return response.json();
}

export async function getConferenceIndexPage() {
  const [indexPayload, archivePayload] = await Promise.all([
    fetchConferenceJson(BBER_DUC_INDEX_ENDPOINT),
    fetchConferenceJson(BBER_DUC_GROUP_ENDPOINT),
  ]);

  return normalizeConferenceIndexPage(indexPayload, archivePayload);
}

export async function getConferenceDetailPage(slug: string) {
  const [pagePayload, archivePayload] = await Promise.all([
    fetchConferenceJson(`${BBER_DATA_PAGE_ENDPOINT}/${slug}`),
    fetchConferenceJson(BBER_DUC_GROUP_ENDPOINT),
  ]);

  return normalizeConferenceDetailPage(pagePayload, archivePayload);
}

export async function getConferenceStaticSlugs() {
  try {
    const archivePayload = await fetchConferenceJson(BBER_DUC_GROUP_ENDPOINT);
    return normalizeConferenceArchive(archivePayload).map((item) => ({
      slug: item.slug,
    }));
  } catch {
    return [];
  }
}
