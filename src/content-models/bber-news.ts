export type BberNewsArchiveItem = {
  id: string;
  title: string;
  publishedDate: string;
  description: string;
  href: string;
  hrefKind: "external" | "pdf";
};

export type BberNewsFilterOption = {
  value: string;
  label: string;
};

export type BberNewsMonthOption = BberNewsFilterOption & {
  year: string;
};

export type BberNewsIndexes = {
  years: BberNewsFilterOption[];
  monthsByYear: Record<string, BberNewsMonthOption[]>;
};

export type BberNewsFilters = {
  year: string;
  month: string;
  query: string;
};

const BBER_API_ORIGIN = "https://api.bber.unm.edu";

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

function getDescription(record: Record<string, unknown>) {
  return (
    normalizeWhitespace(getStringValue(record, "short_descr")) ??
    normalizeWhitespace(getStringValue(record, "content")) ??
    "No summary is available for this news item yet."
  );
}

function buildAbsoluteAssetUrl(pathname: string) {
  return new URL(pathname, BBER_API_ORIGIN).toString();
}

function isValidYear(value: string) {
  return /^\d{4}$/.test(value);
}

function isValidMonth(value: string) {
  return /^(?:[1-9]|1[0-2])$/.test(value);
}

function compareDescending(a: string, b: string) {
  return Number(b) - Number(a);
}

function getMonthLabel(monthIndex: number) {
  return new Intl.DateTimeFormat("en-US", { month: "long" }).format(
    new Date(Date.UTC(2024, monthIndex, 1)),
  );
}

export function normalizeNewsFilters(
  rawSearchParams: Record<string, string | string[] | undefined>,
): BberNewsFilters {
  const yearValue = rawSearchParams.year;
  const monthValue = rawSearchParams.month;
  const queryValue = rawSearchParams.q;

  const year =
    typeof yearValue === "string" && isValidYear(yearValue) ? yearValue : "";
  const month =
    typeof monthValue === "string" && isValidMonth(monthValue)
      ? monthValue
      : "";
  const query =
    typeof queryValue === "string" ? queryValue.trim().slice(0, 100) : "";

  return {
    year,
    month: year ? month : "",
    query,
  };
}

export function normalizeNewsIndexes(payload: unknown): BberNewsIndexes {
  if (!Array.isArray(payload) || !isRecord(payload[0])) {
    return {
      years: [],
      monthsByYear: {},
    };
  }

  const firstEntry = payload[0];
  const dateValues = Array.isArray(firstEntry.dates)
    ? firstEntry.dates.filter(
        (value): value is string => typeof value === "string",
      )
    : [];

  const years = Array.from(
    new Set(
      dateValues.flatMap((value) => {
        const year = value.slice(0, 4);
        return isValidYear(year) ? [year] : [];
      }),
    ),
  )
    .sort(compareDescending)
    .map((year) => ({ value: year, label: year }));

  const monthsByYear = dateValues.reduce<Record<string, BberNewsMonthOption[]>>(
    (accumulator, dateValue) => {
      const [year, month] = dateValue.split("-");

      if (!isValidYear(year) || !/^\d{2}$/.test(month)) {
        return accumulator;
      }

      const monthNumber = Number(month);
      const monthIndex = monthNumber - 1;

      if (monthIndex < 0 || monthIndex > 11) {
        return accumulator;
      }

      const existingOptions = accumulator[year] ?? [];

      if (
        existingOptions.some((option) => option.value === String(monthNumber))
      ) {
        return accumulator;
      }

      existingOptions.push({
        year,
        value: String(monthNumber),
        label: getMonthLabel(monthIndex),
      });
      existingOptions.sort(
        (left, right) => Number(right.value) - Number(left.value),
      );
      accumulator[year] = existingOptions;
      return accumulator;
    },
    {},
  );

  return {
    years,
    monthsByYear,
  };
}

export function normalizeNewsArchiveItems(
  payload: unknown,
): BberNewsArchiveItem[] {
  if (!Array.isArray(payload)) {
    return [];
  }

  return payload.flatMap((entry, index) => {
    if (!isRecord(entry)) {
      return [];
    }

    const title = getStringValue(entry, "title");
    const publishedDate = getStringValue(entry, "date");
    const externalLink = getStringValue(entry, "external_link");
    const pdfUrl = getStringValue(entry, "pdf_url");
    const href = pdfUrl ? buildAbsoluteAssetUrl(pdfUrl) : externalLink;

    if (!title || !publishedDate || !href) {
      return [];
    }

    return [
      {
        id: String(entry.id ?? `news-${index}`),
        title,
        publishedDate,
        description: getDescription(entry),
        href,
        hrefKind: pdfUrl ? "pdf" : "external",
      },
    ];
  });
}

export function filterNewsArchiveItems(
  items: BberNewsArchiveItem[],
  query: string,
) {
  if (!query) {
    return items;
  }

  const normalizedQuery = query.toLocaleLowerCase("en-US");

  return items.filter((item) => {
    const searchableText =
      `${item.title} ${item.description}`.toLocaleLowerCase("en-US");

    return searchableText.includes(normalizedQuery);
  });
}
