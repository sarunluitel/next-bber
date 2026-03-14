import { ArrowUpRightIcon, FileTextIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PublicationFilters } from "@/components/site/publication-filters";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import type { publicationsPageContent } from "@/content-models/research-content";
import type { PublicationsPageData } from "@/lib/cms/bber-research";

type PublicationsPageViewProps = {
  content: typeof publicationsPageContent;
  data: PublicationsPageData;
};

function formatPublicationDate(dateValue: string) {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function PublicationsPageView({
  content,
  data,
}: PublicationsPageViewProps) {
  const sectionHeading =
    data.mode === "featured" ? content.featuredHeading : content.resultsHeading;
  const resultLabel =
    data.mode === "featured"
      ? `${data.items.length} featured publications`
      : `${data.items.length} matching publications`;

  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--bber-red)]">
          Research / Publications
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
            Explore the archive
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 px-6 pb-6">
          <PublicationFilters
            categories={data.indexes.categories}
            communities={data.indexes.communities}
            years={data.indexes.years}
            filters={data.filters}
          />

          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--bber-stone)]">
              Or search the site
            </p>
            <form
              action={content.searchAction}
              className="flex flex-col gap-3 sm:flex-row"
            >
              <Input
                name="q"
                placeholder="Search research and publication content"
                className="h-11 border-[var(--bber-border)] bg-white"
              />
              <Button
                type="submit"
                className="h-11 bg-[var(--bber-red)] px-6 text-white hover:bg-[var(--bber-red-strong)]"
              >
                Search
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="font-display text-3xl text-[var(--bber-red)]">
            {sectionHeading}
          </h2>
          <p className="text-sm leading-7 text-[var(--bber-ink)]/70">
            {resultLabel}
          </p>
        </div>

        {data.items.length === 0 ? (
          <Card className="border border-dashed border-[var(--bber-border)] bg-white py-0 shadow-sm">
            <CardContent className="px-6 py-8 text-base leading-8 text-[var(--bber-ink)]/75">
              {content.emptyMessage}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {data.items.map((item) => (
              <Card
                key={item.id}
                className="overflow-hidden border border-[var(--bber-border)] bg-white py-0 shadow-sm"
              >
                <CardContent className="flex h-full flex-col p-0">
                  {item.image ? (
                    <div className="relative aspect-[3/1.35] overflow-hidden border-b border-[var(--bber-border)] bg-[var(--bber-sand)]">
                      <Image
                        src={item.image.src}
                        alt={item.image.alt}
                        width={item.image.width}
                        height={item.image.height}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : null}

                  <div className="flex h-full flex-col gap-4 px-6 py-6">
                    <div className="space-y-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--bber-stone)]">
                        {formatPublicationDate(item.publishedDate)}
                      </p>
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
                    </div>

                    <p className="text-sm leading-7 text-[var(--bber-ink)]/80">
                      {item.description}
                    </p>

                    {item.categories.length > 0 ||
                    item.communities.length > 0 ? (
                      <>
                        <Separator className="bg-[var(--bber-border)]" />
                        <div className="space-y-3">
                          {item.categories.length > 0 ? (
                            <TaxonomyRow
                              label="Categories"
                              values={item.categories}
                            />
                          ) : null}
                          {item.communities.length > 0 ? (
                            <TaxonomyRow
                              label="Communities"
                              values={item.communities}
                            />
                          ) : null}
                        </div>
                      </>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TaxonomyRow({ label, values }: { label: string; values: string[] }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--bber-red)]">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {values.map((value) => (
          <span
            key={`${label}-${value}`}
            className="rounded-full border border-[var(--bber-border)] bg-[var(--bber-sand)] px-3 py-1 text-xs font-medium text-[var(--bber-ink)]/75"
          >
            {value}
          </span>
        ))}
      </div>
    </div>
  );
}
