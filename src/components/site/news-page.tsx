import { ArrowUpRightIcon, FileTextIcon } from "lucide-react";
import Link from "next/link";
import { NewsFilters } from "@/components/site/news-filters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { newsPageContent } from "@/content-models/news-content";
import type { NewsPageData } from "@/lib/cms/bber-news";

type NewsPageViewProps = {
  content: typeof newsPageContent;
  data: NewsPageData;
};

function formatDisplayDate(dateValue: string) {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  }).format(date);
}

export function NewsPageView({ content, data }: NewsPageViewProps) {
  const sectionHeading =
    data.filters.year || data.filters.month || data.filters.query
      ? content.resultsHeading
      : content.featuredHeading;

  return (
    <div className="bg-[var(--bber-sand)]">
      <section className="mx-auto flex w-full max-w-[var(--site-max-width)] flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--bber-red)]">
            News
          </p>
          <h1 className="font-display text-4xl text-[var(--bber-red)] sm:text-5xl">
            {content.title}
          </h1>
          <p className="max-w-4xl text-base leading-8 text-[var(--bber-ink)]/80">
            {content.lead}
          </p>
        </div>

        <Card className="border border-[var(--bber-border)] bg-white py-0 shadow-sm">
          <CardHeader className="px-6 pt-6">
            <CardTitle className="font-display text-2xl text-[var(--bber-red)]">
              {content.filtersHeading}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <NewsFilters
              filters={data.filters}
              indexes={data.indexes}
              searchPlaceholder={content.searchPlaceholder}
            />
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="font-display text-3xl text-[var(--bber-red)]">
              {sectionHeading}
            </h2>
            <p className="text-sm leading-7 text-[var(--bber-ink)]/70">
              {data.items.length} items
            </p>
          </div>

          {data.items.length === 0 ? (
            <Card className="border border-dashed border-[var(--bber-border)] bg-white py-0 shadow-sm">
              <CardContent className="px-6 py-8 text-base leading-8 text-[var(--bber-ink)]/75">
                {content.emptyMessage}
              </CardContent>
            </Card>
          ) : (
            <Card className="border border-[var(--bber-border)] bg-white py-0 shadow-sm">
              <CardContent className="flex flex-col px-6 py-3">
                {data.items.map((item, index) => (
                  <div key={item.id}>
                    <article className="grid gap-4 py-5 md:grid-cols-[minmax(0,1fr)_180px] md:items-start md:gap-8">
                      <div className="flex flex-col gap-3">
                        <h3 className="text-2xl font-semibold leading-tight text-[var(--bber-ink)]">
                          <Link
                            href={item.href}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-start gap-2 transition-colors hover:text-[var(--bber-red)]"
                          >
                            {item.title}
                            {item.hrefKind === "pdf" ? (
                              <FileTextIcon className="mt-1 size-5 shrink-0 text-[var(--bber-red)]" />
                            ) : (
                              <ArrowUpRightIcon className="mt-1 size-5 shrink-0 text-[var(--bber-red)]" />
                            )}
                          </Link>
                        </h3>
                        <p className="text-base leading-8 text-[var(--bber-ink)]/80">
                          {item.description}
                        </p>
                        <p className="text-sm font-medium uppercase tracking-[0.12em] text-[var(--bber-stone)]">
                          Date Published:{" "}
                          {formatDisplayDate(item.publishedDate)}
                        </p>
                      </div>
                      <div className="flex items-start justify-start md:justify-end">
                        <Link
                          href={item.href}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--bber-red)] transition-colors hover:text-[var(--bber-red-strong)]"
                        >
                          Read More
                        </Link>
                      </div>
                    </article>
                    {index < data.items.length - 1 ? (
                      <Separator className="bg-[var(--bber-border)]" />
                    ) : null}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {data.isTruncated ? (
            <p className="text-sm leading-7 text-[var(--bber-ink)]/65">
              {content.truncatedMessage}
            </p>
          ) : null}
        </div>
      </section>
    </div>
  );
}
