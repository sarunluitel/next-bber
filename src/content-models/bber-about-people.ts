import { Pages } from "pages";
import type {
  AboutContentSection,
  AboutImageAsset,
  AboutPeopleDirectoryPage,
  AboutPersonProfilePage,
} from "@/content-models/about-content";

const BBER_API_ORIGIN = "https://api.bber.unm.edu";
const FALLBACK_PORTRAIT_URL = `${BBER_API_ORIGIN}/api/files/Placeholder_7c2f30f5cc.jpeg`;

type RawCmsImageFormat = {
  url?: unknown;
  width?: unknown;
  height?: unknown;
};

type RawCmsImage = {
  alternativeText?: unknown;
  formats?: {
    large?: RawCmsImageFormat;
    medium?: RawCmsImageFormat;
    small?: RawCmsImageFormat;
    thumbnail?: RawCmsImageFormat;
  } | null;
  url?: unknown;
};

type RawStaffRecord = {
  slug?: unknown;
  name?: unknown;
  position?: unknown;
  email?: unknown;
  description?: unknown;
  stoppedWorkingDate?: unknown;
  sortOrder?: unknown;
  image?: RawCmsImage | null;
};

type RawDirectorRecord = {
  slug?: unknown;
  name?: unknown;
  email?: unknown;
  description?: unknown;
  tenureStart?: unknown;
  tenureEnd?: unknown;
  sortOrder?: unknown;
  image?: RawCmsImage | null;
};

type NormalizedAboutPerson = {
  email?: string;
  employmentLabel?: string;
  excerpt: string;
  image: AboutImageAsset;
  name: string;
  path: string;
  profileSections: AboutContentSection[];
  role: string;
  sidebarPath: string;
  slug: string;
  stoppedWorkingDate?: string;
  tenure?: string;
};

type NormalizedAboutPersonRecord = NormalizedAboutPerson & {
  sortOrder: number;
};

function isNormalizedAboutPerson(
  value: NormalizedAboutPersonRecord | null,
): value is NormalizedAboutPersonRecord {
  return value !== null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeOptionalText(value: unknown) {
  const normalizedText = normalizeText(value);
  return normalizedText.length > 0 ? normalizedText : undefined;
}

function normalizeSortOrder(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function resolveCmsAssetUrl(pathname: string) {
  if (pathname.startsWith("http://") || pathname.startsWith("https://")) {
    return pathname;
  }

  return `${BBER_API_ORIGIN}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
}

function resolvePortraitImage(
  name: string,
  image: RawCmsImage | null | undefined,
) {
  const preferredUrl =
    normalizeOptionalText(image?.formats?.medium?.url) ??
    normalizeOptionalText(image?.formats?.small?.url) ??
    normalizeOptionalText(image?.formats?.thumbnail?.url) ??
    normalizeOptionalText(image?.url);

  return {
    src: preferredUrl
      ? resolveCmsAssetUrl(preferredUrl)
      : FALLBACK_PORTRAIT_URL,
    alt: normalizeOptionalText(image?.alternativeText) ?? `Portrait of ${name}`,
    aspectRatio: "4 / 5",
  } satisfies AboutImageAsset;
}

function collapseWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function splitDescriptionBlocks(description: string) {
  return description
    .split(/\n\s*\n/)
    .map((block) => collapseWhitespace(block))
    .filter(Boolean);
}

function stripMarkdownLinkSyntax(value: string) {
  return value.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1 ($2)");
}

function parseStandaloneMarkdownLink(block: string) {
  const markdownLinkMatch = block.match(/^\[([^\]]+)\]\(([^)]+)\)$/);

  if (!markdownLinkMatch) {
    return null;
  }

  const [, title, href] = markdownLinkMatch;
  return {
    title: collapseWhitespace(title),
    href: collapseWhitespace(href),
  };
}

function parseStandaloneUrl(block: string) {
  if (!/^https?:\/\//.test(block)) {
    return null;
  }

  try {
    const url = new URL(block);
    return {
      title: url.hostname.replace(/^www\./, ""),
      href: url.toString(),
    };
  } catch {
    return null;
  }
}

function createFallbackBioSections() {
  return [
    {
      paragraphs: ["Biography information is not available right now."],
    },
  ] satisfies AboutContentSection[];
}

function createProfileSections(description: string) {
  const descriptionBlocks = splitDescriptionBlocks(description);

  if (descriptionBlocks.length === 0) {
    return createFallbackBioSections();
  }

  const sections: AboutContentSection[] = [];
  let currentSection: AboutContentSection = {};

  const pushCurrentSection = () => {
    if (
      currentSection.title ||
      currentSection.paragraphs?.length ||
      currentSection.links?.length
    ) {
      sections.push(currentSection);
    }

    currentSection = {};
  };

  for (const block of descriptionBlocks) {
    const headingMatch = block.match(/^#\s+(.+)$/);

    if (headingMatch) {
      pushCurrentSection();
      currentSection = {
        title: collapseWhitespace(headingMatch[1]),
      };
      continue;
    }

    const standaloneMarkdownLink = parseStandaloneMarkdownLink(block);
    if (standaloneMarkdownLink) {
      currentSection.links = [
        ...(currentSection.links ?? []),
        standaloneMarkdownLink,
      ];
      continue;
    }

    const standaloneUrl = parseStandaloneUrl(block);
    if (standaloneUrl) {
      currentSection.links = [...(currentSection.links ?? []), standaloneUrl];
      continue;
    }

    currentSection.paragraphs = [
      ...(currentSection.paragraphs ?? []),
      stripMarkdownLinkSyntax(block),
    ];
  }

  pushCurrentSection();
  return sections.length > 0 ? sections : createFallbackBioSections();
}

function createExcerpt(description: string) {
  const previewParagraphs = splitDescriptionBlocks(description).filter(
    (block) => {
      if (block.startsWith("#")) {
        return false;
      }

      if (parseStandaloneMarkdownLink(block)) {
        return false;
      }

      if (parseStandaloneUrl(block)) {
        return false;
      }

      return true;
    },
  );

  if (previewParagraphs.length === 0) {
    return "Biography information is not available right now.";
  }

  const previewCharacterLimit = 420;
  const accumulatedPreviewParagraphs: string[] = [];
  let currentCharacterCount = 0;

  for (const paragraph of previewParagraphs) {
    const normalizedParagraph = stripMarkdownLinkSyntax(paragraph);
    const paragraphLength =
      normalizedParagraph.length +
      (accumulatedPreviewParagraphs.length > 0 ? 1 : 0);

    accumulatedPreviewParagraphs.push(normalizedParagraph);
    currentCharacterCount += paragraphLength;

    if (currentCharacterCount >= previewCharacterLimit) {
      break;
    }
  }

  const combinedPreview = accumulatedPreviewParagraphs.join(" ");

  if (combinedPreview.length <= previewCharacterLimit) {
    return combinedPreview;
  }

  return `${combinedPreview.slice(0, previewCharacterLimit - 3).trimEnd()}...`;
}

function formatDirectorTenure(
  tenureStart: string | undefined,
  tenureEnd: string | undefined,
) {
  const startYear = tenureStart?.slice(0, 4);
  const endYear = tenureEnd?.slice(0, 4);

  if (startYear && endYear) {
    return `${startYear} to ${endYear}`;
  }

  if (startYear) {
    return `${startYear} to Present`;
  }

  return undefined;
}

function normalizeStaffRecord(
  rawRecord: unknown,
): NormalizedAboutPersonRecord | null {
  if (!isRecord(rawRecord)) {
    return null;
  }

  const record = rawRecord as RawStaffRecord;
  const slug = normalizeText(record.slug);
  const name = normalizeText(record.name);
  const role = normalizeText(record.position);
  const description = normalizeText(record.description);

  if (!slug || !name || !role || !description) {
    return null;
  }

  return {
    email: normalizeOptionalText(record.email),
    employmentLabel: normalizeOptionalText(record.stoppedWorkingDate)
      ? "Past Employee"
      : undefined,
    excerpt: createExcerpt(description),
    image: resolvePortraitImage(name, record.image),
    name,
    path: `${Pages.About_BBER.children.Staff.url}${slug}/`,
    profileSections: createProfileSections(description),
    role,
    sidebarPath: Pages.About_BBER.children.Staff.url,
    slug,
    sortOrder: normalizeSortOrder(record.sortOrder),
    stoppedWorkingDate: normalizeOptionalText(record.stoppedWorkingDate),
  };
}

function normalizeDirectorRecord(
  rawRecord: unknown,
): NormalizedAboutPersonRecord | null {
  if (!isRecord(rawRecord)) {
    return null;
  }

  const record = rawRecord as RawDirectorRecord;
  const slug = normalizeText(record.slug);
  const name = normalizeText(record.name);
  const description = normalizeText(record.description);

  if (!slug || !name || !description) {
    return null;
  }

  const tenure = formatDirectorTenure(
    normalizeOptionalText(record.tenureStart),
    normalizeOptionalText(record.tenureEnd),
  );

  return {
    email: normalizeOptionalText(record.email),
    excerpt: createExcerpt(description),
    image: resolvePortraitImage(name, record.image),
    name,
    path: `${Pages.About_BBER.children.Directors.url}${slug}/`,
    profileSections: createProfileSections(description),
    role: "Director",
    sidebarPath: Pages.About_BBER.children.Directors.url,
    slug,
    sortOrder: normalizeSortOrder(record.sortOrder),
    tenure,
  };
}

function buildDirectoryPage({
  currentPeople,
  lead,
  path,
  pastPeople,
  pastPeopleHeading,
  title,
}: {
  currentPeople: NormalizedAboutPerson[];
  lead: string;
  path: string;
  pastPeople?: NormalizedAboutPerson[];
  pastPeopleHeading?: string;
  title: string;
}) {
  return {
    path,
    title,
    lead,
    eyebrow: "About",
    sidebarPath: path,
    kind: "people-directory",
    currentPeople: currentPeople.map((person) => ({
      slug: person.slug,
      name: person.name,
      role: person.role,
      email: person.email,
      employmentLabel: person.employmentLabel,
      tenure: person.tenure,
      image: person.image,
      profilePath: person.path,
      excerpt: person.excerpt,
    })),
    pastPeople: pastPeople?.map((person) => ({
      slug: person.slug,
      name: person.name,
      role: person.role,
      email: person.email,
      employmentLabel: person.employmentLabel,
      tenure: person.tenure,
      image: person.image,
      profilePath: person.path,
      excerpt: person.excerpt,
    })),
    pastPeopleHeading,
  } satisfies AboutPeopleDirectoryPage;
}

function buildProfilePages({
  directoryPath,
  directoryTitle,
  people,
}: {
  directoryPath: string;
  directoryTitle: string;
  people: NormalizedAboutPerson[];
}) {
  return people.map((person) => {
    return {
      path: person.path,
      title: person.name,
      eyebrow: "About",
      sidebarPath: person.sidebarPath,
      kind: "person-profile",
      directoryPath,
      directoryTitle,
      person: {
        slug: person.slug,
        name: person.name,
        role: person.role,
        email: person.email,
        employmentLabel: person.employmentLabel,
        tenure: person.tenure,
        image: person.image,
        profilePath: person.path,
        excerpt: person.excerpt,
      },
      sections: person.profileSections,
    } satisfies AboutPersonProfilePage;
  });
}

export function normalizeStaffDirectoryPayload(rawPayload: unknown) {
  const normalizedPeople: NormalizedAboutPersonRecord[] = Array.isArray(
    rawPayload,
  )
    ? rawPayload.map(normalizeStaffRecord).filter(isNormalizedAboutPerson)
    : [];

  const people = normalizedPeople.sort((leftRecord, rightRecord) => {
    const sortOrderDifference = rightRecord.sortOrder - leftRecord.sortOrder;

    if (sortOrderDifference !== 0) {
      return sortOrderDifference;
    }

    return leftRecord.name.localeCompare(rightRecord.name);
  });

  const currentPeople = people.filter((person) => {
    return !person.stoppedWorkingDate;
  });
  const pastPeople = people.filter((person) => {
    return Boolean(person.stoppedWorkingDate);
  });

  return {
    directoryPage: buildDirectoryPage({
      path: Pages.About_BBER.children.Staff.url,
      title: "Staff",
      lead: "Meet the BBER team of researchers, analysts, and program staff supporting data, forecasting, and economic research in New Mexico.",
      currentPeople,
      pastPeople: pastPeople.length > 0 ? pastPeople : undefined,
      pastPeopleHeading: pastPeople.length > 0 ? "Past Employees" : undefined,
    }),
    profilePages: buildProfilePages({
      directoryPath: Pages.About_BBER.children.Staff.url,
      directoryTitle: "Staff",
      people,
    }),
  };
}

export function normalizeDirectorsDirectoryPayload(rawPayload: unknown) {
  const normalizedPeople: NormalizedAboutPersonRecord[] = Array.isArray(
    rawPayload,
  )
    ? rawPayload.map(normalizeDirectorRecord).filter(isNormalizedAboutPerson)
    : [];

  const people = normalizedPeople.sort((leftRecord, rightRecord) => {
    const sortOrderDifference = rightRecord.sortOrder - leftRecord.sortOrder;

    if (sortOrderDifference !== 0) {
      return sortOrderDifference;
    }

    return leftRecord.name.localeCompare(rightRecord.name);
  });

  return {
    directoryPage: buildDirectoryPage({
      path: Pages.About_BBER.children.Directors.url,
      title: "Directors",
      lead: "A history of BBER leadership from the bureau’s founding in 1945 through the present day.",
      currentPeople: people,
    }),
    profilePages: buildProfilePages({
      directoryPath: Pages.About_BBER.children.Directors.url,
      directoryTitle: "Directors",
      people,
    }),
  };
}
