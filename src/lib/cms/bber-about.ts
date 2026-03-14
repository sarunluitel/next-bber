import "server-only";

import { normalizePageUrl } from "pages";
import type {
  AboutPeopleDirectoryPage,
  AboutPersonProfilePage,
} from "@/content-models/about-content";
import {
  normalizeDirectorsDirectoryPayload,
  normalizeStaffDirectoryPayload,
} from "@/content-models/bber-about-people";

const BBER_STAFF_ENDPOINT = "https://api.bber.unm.edu/api/staff";
const BBER_DIRECTORS_ENDPOINT = "https://api.bber.unm.edu/api/directors";

type AboutPeopleCollection = {
  directoryPage: AboutPeopleDirectoryPage;
  profilePages: AboutPersonProfilePage[];
};

async function fetchAboutJson(endpoint: string) {
  const response = await fetch(endpoint, {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(
      `BBER about request failed with status ${response.status}.`,
    );
  }

  return response.json();
}

export async function getStaffPages(): Promise<AboutPeopleCollection> {
  const rawPayload = await fetchAboutJson(BBER_STAFF_ENDPOINT);
  return normalizeStaffDirectoryPayload(rawPayload);
}

export async function getDirectorPages(): Promise<AboutPeopleCollection> {
  const rawPayload = await fetchAboutJson(BBER_DIRECTORS_ENDPOINT);
  return normalizeDirectorsDirectoryPayload(rawPayload);
}

export async function getAboutPeopleStaticSlugs() {
  try {
    const [staffPages, directorPages] = await Promise.all([
      getStaffPages(),
      getDirectorPages(),
    ]);

    return [...staffPages.profilePages, ...directorPages.profilePages].map(
      (page) => page.path.split("/").filter(Boolean).slice(1),
    );
  } catch {
    return [];
  }
}

export async function getAboutCmsPage(pathname: string) {
  const normalizedPathname = normalizePageUrl(pathname);

  if (
    normalizedPathname === normalizePageUrl("/about/staff/") ||
    normalizedPathname.startsWith(normalizePageUrl("/about/staff/"))
  ) {
    const staffPages = await getStaffPages();

    if (normalizedPathname === normalizePageUrl("/about/staff/")) {
      return staffPages.directoryPage;
    }

    return (
      staffPages.profilePages.find((page) => {
        return normalizePageUrl(page.path) === normalizedPathname;
      }) ?? null
    );
  }

  if (
    normalizedPathname === normalizePageUrl("/about/directors/") ||
    normalizedPathname.startsWith(normalizePageUrl("/about/directors/"))
  ) {
    const directorPages = await getDirectorPages();

    if (normalizedPathname === normalizePageUrl("/about/directors/")) {
      return directorPages.directoryPage;
    }

    return (
      directorPages.profilePages.find((page) => {
        return normalizePageUrl(page.path) === normalizedPathname;
      }) ?? null
    );
  }

  return null;
}
