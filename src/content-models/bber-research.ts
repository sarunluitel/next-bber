const BBER_API_ORIGIN = "https://api.bber.unm.edu";

export type BberPublicationImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type BberPublicationRecord = {
  id: string;
  title: string;
  publishedDate: string;
  description: string;
  href: string;
  hrefKind: "pdf" | "external";
  categories: string[];
  communities: string[];
  image: BberPublicationImage | null;
};

export type BberPublicationFilterOption = {
  value: string;
  label: string;
};

export type BberPublicationIndexes = {
  years: BberPublicationFilterOption[];
  categories: BberPublicationFilterOption[];
  communities: BberPublicationFilterOption[];
};

export type BberPublicationFilters = {
  category: string;
  community: string;
  year: string;
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

function normalizeWhitespace(value: string | null) {
  return value?.replace(/\s+/g, " ").trim() ?? null;
}

function buildAbsoluteAssetUrl(pathname: string) {
  return new URL(pathname, BBER_API_ORIGIN).toString();
}

function getDescription(record: Record<string, unknown>) {
  return (
    normalizeWhitespace(getStringValue(record, "short_descr")) ??
    normalizeWhitespace(getStringValue(record, "content")) ??
    "No summary is available for this publication yet."
  );
}

function getTaxonomyLabels(
  value: unknown,
  key: "category" | "community",
): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((entry) => {
    if (!isRecord(entry)) {
      return [];
    }

    const label = getStringValue(entry, key);
    return label ? [label] : [];
  });
}

function getImage(record: Record<string, unknown>, title: string) {
  if (!isRecord(record.featureImage)) {
    return null;
  }

  const featureImage = record.featureImage;
  const alternativeText = getStringValue(featureImage, "alternativeText");
  const fallbackUrl = getStringValue(featureImage, "url");
  const fallbackWidth =
    typeof featureImage.width === "number" ? featureImage.width : 750;
  const fallbackHeight =
    typeof featureImage.height === "number" ? featureImage.height : 250;

  if (isRecord(featureImage.formats) && isRecord(featureImage.formats.small)) {
    const smallFormat = featureImage.formats.small;
    const smallUrl = getStringValue(smallFormat, "url");

    if (smallUrl) {
      return {
        src: buildAbsoluteAssetUrl(smallUrl),
        alt: alternativeText ?? `${title} feature image`,
        width: typeof smallFormat.width === "number" ? smallFormat.width : 500,
        height:
          typeof smallFormat.height === "number" ? smallFormat.height : 167,
      };
    }
  }

  if (!fallbackUrl) {
    return null;
  }

  return {
    src: buildAbsoluteAssetUrl(fallbackUrl),
    alt: alternativeText ?? `${title} feature image`,
    width: fallbackWidth,
    height: fallbackHeight,
  };
}

export function normalizePublicationFilters(
  rawSearchParams: Record<string, string | string[] | undefined>,
): BberPublicationFilters {
  const categoryValue = rawSearchParams.category;
  const communityValue = rawSearchParams.community;
  const yearValue = rawSearchParams.year;

  const category =
    typeof categoryValue === "string" && /^\d+$/.test(categoryValue)
      ? categoryValue
      : "";
  const community =
    typeof communityValue === "string" && /^\d+$/.test(communityValue)
      ? communityValue
      : "";
  const year =
    typeof yearValue === "string" && /^\d{4}$/.test(yearValue) ? yearValue : "";

  return {
    category,
    community,
    year,
  };
}

export function publicationFiltersAreActive(
  filters: BberPublicationFilters,
): boolean {
  return Boolean(filters.category || filters.community || filters.year);
}

export function normalizePublicationIndexes(
  payload: unknown,
): BberPublicationIndexes {
  if (!isRecord(payload)) {
    return {
      years: [],
      categories: [],
      communities: [],
    };
  }

  const years = Array.isArray(payload.dates)
    ? payload.dates.flatMap((value) =>
        typeof value === "number" || typeof value === "string"
          ? [
              {
                value: String(value),
                label: String(value),
              },
            ]
          : [],
      )
    : [];

  const categories = Array.isArray(payload.categories)
    ? payload.categories.flatMap((entry) => {
        if (!isRecord(entry)) {
          return [];
        }

        const value =
          typeof entry.id === "number" || typeof entry.id === "string"
            ? String(entry.id)
            : null;
        const label = getStringValue(entry, "category");

        if (!value || !label) {
          return [];
        }

        return [{ value, label }];
      })
    : [];

  const communities = Array.isArray(payload.communities)
    ? payload.communities.flatMap((entry) => {
        if (!isRecord(entry)) {
          return [];
        }

        const value =
          typeof entry.id === "number" || typeof entry.id === "string"
            ? String(entry.id)
            : null;
        const label = getStringValue(entry, "community");

        if (!value || !label) {
          return [];
        }

        return [{ value, label }];
      })
    : [];

  return {
    years,
    categories,
    communities,
  };
}

export function normalizePublicationRecords(
  payload: unknown,
): BberPublicationRecord[] {
  if (!Array.isArray(payload)) {
    return [];
  }

  return payload.flatMap((entry, index) => {
    if (!isRecord(entry)) {
      return [];
    }

    const title = getStringValue(entry, "title");
    const publishedDate = getStringValue(entry, "date");

    if (!title || !publishedDate) {
      return [];
    }

    const pdfAsset =
      isRecord(entry.pdf) && getStringValue(entry.pdf, "url")
        ? getStringValue(entry.pdf, "url")
        : null;
    const externalLink = getStringValue(entry, "external_link");
    const href = pdfAsset ? buildAbsoluteAssetUrl(pdfAsset) : externalLink;

    if (!href) {
      return [];
    }

    return [
      {
        id: String(entry.id ?? `publication-${index}`),
        title,
        publishedDate,
        description: getDescription(entry),
        href,
        hrefKind: pdfAsset ? "pdf" : "external",
        categories: getTaxonomyLabels(entry.categories, "category"),
        communities: getTaxonomyLabels(entry.communities, "community"),
        image: getImage(entry, title),
      },
    ];
  });
}
