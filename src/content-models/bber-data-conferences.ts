import { Pages } from "pages";

const BBER_API_ORIGIN = "https://api.bber.unm.edu";
const BBER_SITE_ORIGIN = "https://bber.unm.edu";
const DATA_CONFERENCE_GROUP_SLUG = "data-conferences";
const DATA_CONFERENCE_INDEX_SLUG = "duc-index";

export type ConferenceArchiveItem = {
  id: string;
  title: string;
  slug: string;
  href: string;
  summary: string;
  publishedAt: string | null;
  updatedAt: string | null;
};

export type ConferenceContentBlock =
  | {
      kind: "heading";
      level: 2 | 3 | 4;
      text: string;
    }
  | {
      kind: "paragraph";
      text: string;
    }
  | {
      kind: "list";
      items: string[];
    }
  | {
      kind: "image";
      src: string;
      alt: string;
    };

export type ConferenceIndexPage = {
  kind: "index";
  title: string;
  slug: string;
  path: string;
  blocks: ConferenceContentBlock[];
  archive: ConferenceArchiveItem[];
  publishedAt: string | null;
  updatedAt: string | null;
};

export type ConferenceDetailPage = {
  kind: "detail";
  title: string;
  slug: string;
  path: string;
  blocks: ConferenceContentBlock[];
  archive: ConferenceArchiveItem[];
  publishedAt: string | null;
  updatedAt: string | null;
};

export type ConferencePage = ConferenceIndexPage | ConferenceDetailPage;

type ConferenceTextSegment =
  | { kind: "text"; value: string }
  | { kind: "link"; href: string; label: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getStringValue(
  record: Record<string, unknown>,
  key: string,
): string | null {
  const value = record[key];

  if (typeof value !== "string") {
    return null;
  }

  const trimmedValue = value.trim();
  return trimmedValue.length > 0 ? trimmedValue : null;
}

function getRecordValue(
  record: Record<string, unknown>,
  key: string,
): Record<string, unknown> | null {
  const value = record[key];
  return isRecord(value) ? value : null;
}

function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function normalizeInlineSource(value: string) {
  return value
    .replace(/\\([\\_*[\]()])/g, "$1")
    .replace(/\\-/g, "-")
    .replace(/\\\./g, ".")
    .replace(/<u>(.*?)<\/u>/gi, "$1")
    .replace(/<\/?strong>/gi, "")
    .replace(/<\/?em>/gi, "")
    .trim();
}

function stripMarkdownSyntax(value: string) {
  return normalizeWhitespace(
    normalizeInlineSource(value)
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, "$1")
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
      .replace(/<([^>\s]+)>/g, "$1")
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/__([^_]+)__/g, "$1")
      .replace(/\*([^*]+)\*/g, "$1")
      .replace(/_([^_]+)_/g, "$1"),
  );
}

function resolveApiAssetUrl(pathname: string) {
  if (/^https?:\/\//.test(pathname)) {
    return pathname;
  }

  if (pathname.startsWith("/api/files/") || pathname.startsWith("/uploads/")) {
    return new URL(pathname, BBER_API_ORIGIN).toString();
  }

  return pathname;
}

function normalizeSitePath(pathname: string) {
  if (pathname.startsWith(BBER_SITE_ORIGIN)) {
    const url = new URL(pathname);
    return `${url.pathname}${url.search}`;
  }

  if (pathname.startsWith("/")) {
    return pathname;
  }

  return pathname;
}

function resolveContentHref(pathname: string) {
  if (
    pathname.startsWith("mailto:") ||
    pathname.startsWith("tel:") ||
    pathname.startsWith("http://") ||
    pathname.startsWith("https://")
  ) {
    return pathname.startsWith(BBER_SITE_ORIGIN)
      ? normalizeSitePath(pathname)
      : pathname;
  }

  if (pathname.startsWith("/api/files/") || pathname.startsWith("/uploads/")) {
    return resolveApiAssetUrl(pathname);
  }

  return normalizeSitePath(pathname);
}

function parseImageBlock(block: string) {
  const imageMatch = block.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);

  if (!imageMatch) {
    return null;
  }

  const [, alt, src] = imageMatch;
  const normalizedSource = resolveApiAssetUrl(src.trim());

  return normalizedSource
    ? ({
        kind: "image",
        src: normalizedSource,
        alt: stripMarkdownSyntax(alt) || "Conference image",
      } satisfies ConferenceContentBlock)
    : null;
}

export function parseConferenceContentBlocks(content: string) {
  const blocks: ConferenceContentBlock[] = [];
  const lines = content.split("\n");
  let paragraphLines: string[] = [];
  let listItems: string[] = [];

  function flushParagraph() {
    if (paragraphLines.length === 0) {
      return;
    }

    const normalizedText = normalizeWhitespace(
      normalizeInlineSource(paragraphLines.join(" ")),
    );

    if (normalizedText) {
      blocks.push({
        kind: "paragraph",
        text: normalizedText,
      });
    }

    paragraphLines = [];
  }

  function flushList() {
    if (listItems.length === 0) {
      return;
    }

    blocks.push({
      kind: "list",
      items: listItems.map((item) =>
        normalizeWhitespace(normalizeInlineSource(item)),
      ),
    });
    listItems = [];
  }

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }

    const imageBlock = parseImageBlock(line);

    if (imageBlock) {
      flushParagraph();
      flushList();
      blocks.push(imageBlock);
      continue;
    }

    const headingMatch = line.match(/^(#{1,4})\s+(.+)$/);

    if (headingMatch) {
      flushParagraph();
      flushList();

      blocks.push({
        kind: "heading",
        level: Math.min(Math.max(headingMatch[1].length, 2), 4) as 2 | 3 | 4,
        text: stripMarkdownSyntax(headingMatch[2]),
      });
      continue;
    }

    const listMatch = line.match(/^(?:[-*•]|\d+\))\s+(.+)$/);

    if (listMatch) {
      flushParagraph();
      listItems.push(listMatch[1]);
      continue;
    }

    flushList();
    paragraphLines.push(line);
  }

  flushParagraph();
  flushList();

  return blocks;
}

function getConferenceSummary(blocks: ConferenceContentBlock[]) {
  const summaryBlock = blocks.find((block) => block.kind === "paragraph");

  if (summaryBlock && summaryBlock.kind === "paragraph") {
    return stripMarkdownSyntax(summaryBlock.text);
  }

  const listBlock = blocks.find((block) => block.kind === "list");

  if (listBlock && listBlock.kind === "list" && listBlock.items[0]) {
    return stripMarkdownSyntax(listBlock.items[0]);
  }

  return "Conference materials and details are available on this page.";
}

function normalizeConferenceArchiveItem(rawValue: unknown) {
  if (!isRecord(rawValue)) {
    return null;
  }

  const groupSlug = getStringValue(
    getRecordValue(rawValue, "page_group") ?? {},
    "slug",
  );
  const title = getStringValue(rawValue, "title");
  const slug = getStringValue(rawValue, "slug");
  const content = getStringValue(rawValue, "content") ?? "";

  if (
    (groupSlug && groupSlug !== DATA_CONFERENCE_GROUP_SLUG) ||
    !title ||
    !slug ||
    slug === DATA_CONFERENCE_INDEX_SLUG
  ) {
    return null;
  }

  const blocks = parseConferenceContentBlocks(content);

  return {
    id: String(rawValue.id ?? slug),
    title,
    slug,
    href: `/data/nm-duc/${slug}`,
    summary: getConferenceSummary(blocks),
    publishedAt: getStringValue(rawValue, "publishedAt"),
    updatedAt: getStringValue(rawValue, "updatedAt"),
  } satisfies ConferenceArchiveItem;
}

export function normalizeConferenceArchive(payload: unknown) {
  if (!Array.isArray(payload)) {
    return [];
  }

  return payload
    .flatMap((entry) => {
      const archiveItem = normalizeConferenceArchiveItem(entry);
      return archiveItem ? [archiveItem] : [];
    })
    .sort((leftConference, rightConference) => {
      const leftPublishedAt = leftConference.publishedAt
        ? Date.parse(leftConference.publishedAt)
        : Number.NEGATIVE_INFINITY;
      const rightPublishedAt = rightConference.publishedAt
        ? Date.parse(rightConference.publishedAt)
        : Number.NEGATIVE_INFINITY;

      if (leftPublishedAt !== rightPublishedAt) {
        return rightPublishedAt - leftPublishedAt;
      }

      return rightConference.title.localeCompare(leftConference.title);
    });
}

function normalizeConferencePageRecord(rawValue: unknown) {
  if (!isRecord(rawValue)) {
    return null;
  }

  const groupSlug = getStringValue(
    getRecordValue(rawValue, "page_group") ?? {},
    "slug",
  );
  const title = getStringValue(rawValue, "title");
  const slug = getStringValue(rawValue, "slug");
  const content = getStringValue(rawValue, "content");

  if (groupSlug !== DATA_CONFERENCE_GROUP_SLUG || !title || !slug || !content) {
    return null;
  }

  return {
    title,
    slug,
    blocks: parseConferenceContentBlocks(content),
    publishedAt: getStringValue(rawValue, "publishedAt"),
    updatedAt: getStringValue(rawValue, "updatedAt"),
  };
}

export function normalizeConferenceIndexPage(
  pagePayload: unknown,
  archivePayload: unknown,
) {
  const normalizedPage = normalizeConferencePageRecord(pagePayload);
  const archive = normalizeConferenceArchive(archivePayload);

  if (!normalizedPage || normalizedPage.slug !== DATA_CONFERENCE_INDEX_SLUG) {
    return null;
  }

  return {
    kind: "index",
    title: normalizedPage.title,
    slug: normalizedPage.slug,
    path: Pages.Data.children.NM_Data_Users_Conference.url,
    blocks: removeDuplicateArchiveBlocks(normalizedPage.blocks, archive),
    archive,
    publishedAt: normalizedPage.publishedAt,
    updatedAt: normalizedPage.updatedAt,
  } satisfies ConferenceIndexPage;
}

export function normalizeConferenceDetailPage(
  pagePayload: unknown,
  archivePayload: unknown,
) {
  const normalizedPage = normalizeConferencePageRecord(pagePayload);

  if (!normalizedPage || normalizedPage.slug === DATA_CONFERENCE_INDEX_SLUG) {
    return null;
  }

  return {
    kind: "detail",
    title: normalizedPage.title,
    slug: normalizedPage.slug,
    path: `/data/nm-duc/${normalizedPage.slug}`,
    blocks: normalizedPage.blocks,
    archive: normalizeConferenceArchive(archivePayload),
    publishedAt: normalizedPage.publishedAt,
    updatedAt: normalizedPage.updatedAt,
  } satisfies ConferenceDetailPage;
}

export function formatConferenceDate(value: string | null) {
  if (!value) {
    return "Not reported";
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return parsedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function renderableConferenceText(value: string) {
  return normalizeInlineSource(value);
}

export function conferenceTextToLinks(value: string) {
  const normalizedValue = renderableConferenceText(value);
  const linkPattern =
    /(!?\[([^\]]+)\]\(([^)]+)\))|(<(https?:\/\/[^>]+)>)|(mailto:[^\s]+)|(https?:\/\/[^\s]+)/g;
  const segments: ConferenceTextSegment[] = [];
  let lastIndex = 0;

  for (const match of normalizedValue.matchAll(linkPattern)) {
    const [fullMatch] = match;
    const matchIndex = match.index ?? 0;

    if (matchIndex > lastIndex) {
      segments.push({
        kind: "text",
        value: normalizedValue.slice(lastIndex, matchIndex),
      });
    }

    const markdownLabel = match[2];
    const markdownHref = match[3];
    const autoLinkHref = match[5];
    const mailtoHref = match[6];
    const bareUrlHref = match[7];
    const href = markdownHref ?? autoLinkHref ?? mailtoHref ?? bareUrlHref;

    if (href) {
      segments.push({
        kind: "link",
        href: resolveContentHref(href),
        label: stripMarkdownSyntax(markdownLabel ?? href),
      });
    } else {
      segments.push({
        kind: "text",
        value: fullMatch,
      });
    }

    lastIndex = matchIndex + fullMatch.length;
  }

  if (lastIndex < normalizedValue.length) {
    segments.push({
      kind: "text",
      value: normalizedValue.slice(lastIndex),
    });
  }

  return segments.filter((segment) => {
    return segment.kind === "link" || segment.value.length > 0;
  });
}

function removeDuplicateArchiveBlocks(
  blocks: ConferenceContentBlock[],
  archive: ConferenceArchiveItem[],
) {
  if (archive.length === 0) {
    return blocks;
  }

  const archiveHrefs = new Set(archive.map((item) => item.href));

  return blocks.filter((block, index) => {
    if (block.kind === "paragraph") {
      const normalizedText = stripMarkdownSyntax(block.text).toLowerCase();

      if (
        normalizedText.startsWith(
          "previous year's conference links for slide decks and recordings",
        )
      ) {
        return false;
      }
    }

    if (block.kind !== "list") {
      return true;
    }

    const listLinks = block.items.flatMap((item) =>
      conferenceTextToLinks(item).flatMap((segment) =>
        segment.kind === "link" ? [segment.href] : [],
      ),
    );

    if (listLinks.length === 0) {
      return true;
    }

    const previousBlock = blocks[index - 1];
    const hasPreviousParagraph =
      index > 0 &&
      previousBlock?.kind === "paragraph" &&
      stripMarkdownSyntax(previousBlock.text)
        .toLowerCase()
        .startsWith(
          "previous year's conference links for slide decks and recordings",
        );

    return !(
      hasPreviousParagraph && listLinks.every((href) => archiveHrefs.has(href))
    );
  });
}
