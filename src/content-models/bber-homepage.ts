const BBER_API_ORIGIN = "https://api.bber.unm.edu";

export type BberNewsItem = {
  id: string;
  title: string;
  publishedDate: string;
  description: string;
  href: string;
};

export type BberPublicationItem = {
  id: string;
  title: string;
  publishedDate: string;
  description: string;
  href: string;
  hrefKind: "pdf" | "external";
};

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

function getDescription(record: Record<string, unknown>) {
  return (
    normalizeWhitespace(getStringValue(record, "short_descr")) ??
    normalizeWhitespace(getStringValue(record, "content")) ??
    "No summary is available for this item yet."
  );
}

function normalizeWhitespace(value: string | null) {
  return value?.replace(/\s+/g, " ").trim() ?? null;
}

function buildAbsoluteAssetUrl(pathname: string) {
  return new URL(pathname, BBER_API_ORIGIN).toString();
}

export function normalizeBberNewsItems(payload: unknown): BberNewsItem[] {
  if (!Array.isArray(payload)) {
    return [];
  }

  return payload.flatMap((item, index) => {
    if (!isRecord(item)) {
      return [];
    }

    const title = getStringValue(item, "title");
    const href = getStringValue(item, "external_link");
    const publishedDate = getStringValue(item, "date");

    if (!title || !href || !publishedDate) {
      return [];
    }

    return [
      {
        id: String(item.id ?? `news-${index}`),
        title,
        href,
        publishedDate,
        description: getDescription(item),
      },
    ];
  });
}

export function normalizeBberPublicationItems(
  payload: unknown,
): BberPublicationItem[] {
  if (!Array.isArray(payload)) {
    return [];
  }

  return payload.flatMap((item, index) => {
    if (!isRecord(item)) {
      return [];
    }

    const title = getStringValue(item, "title");
    const publishedDate = getStringValue(item, "date");

    if (!title || !publishedDate) {
      return [];
    }

    const pdfAsset =
      isRecord(item.pdf) && getStringValue(item.pdf, "url")
        ? getStringValue(item.pdf, "url")
        : null;
    const externalLink = getStringValue(item, "external_link");
    const href = pdfAsset ? buildAbsoluteAssetUrl(pdfAsset) : externalLink;

    if (!href) {
      return [];
    }

    return [
      {
        id: String(item.id ?? `publication-${index}`),
        title,
        href,
        publishedDate,
        description: getDescription(item),
        hrefKind: pdfAsset ? "pdf" : "external",
      },
    ];
  });
}
