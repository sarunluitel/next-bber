import Link from "next/link";
import { DataOverviewLocationQuotientPreview } from "@/components/site/data-overview-location-quotient-preview";
import { DataOverviewPopulationPyramidPreview } from "@/components/site/data-overview-population-pyramid-preview";
import { SectionPageShell } from "@/components/site/section-page-shell";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type {
  DataOverviewInlinePart,
  DataOverviewPageData,
  DataOverviewParagraph,
} from "@/content-models/data-overview";

function InlinePart({ part }: { part: DataOverviewInlinePart }) {
  if (part.type === "text") {
    return <>{part.value}</>;
  }

  if (part.external) {
    return (
      <a
        href={part.href}
        target="_blank"
        rel="noreferrer"
        className="text-[var(--bber-red)] underline decoration-[color-mix(in_oklab,var(--bber-red),transparent_55%)] underline-offset-4"
      >
        {part.label}
      </a>
    );
  }

  return (
    <Link
      href={part.href}
      className="text-[var(--bber-red)] underline decoration-[color-mix(in_oklab,var(--bber-red),transparent_55%)] underline-offset-4"
    >
      {part.label}
    </Link>
  );
}

function RichParagraphView({
  paragraph,
}: {
  paragraph: DataOverviewParagraph;
}) {
  return (
    <p className="max-w-5xl text-base leading-8 text-[var(--bber-ink)]/82">
      {paragraph.map((part, index) => (
        <InlinePart
          key={`${part.type}-${index}-${part.type === "text" ? part.value : part.href}`}
          part={part}
        />
      ))}
    </p>
  );
}

function getParagraphKey(paragraph: DataOverviewParagraph) {
  return paragraph
    .map((part) =>
      part.type === "text" ? part.value : `${part.href}:${part.label}`,
    )
    .join("|");
}

function PreviewUnavailableCard({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <Card className="border border-[var(--bber-border)] bg-white py-0 shadow-sm">
      <CardHeader className="px-6 pt-6">
        <CardTitle className="text-xl leading-tight text-[var(--bber-ink)]">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="rounded-xl border border-dashed border-[var(--bber-border)] bg-[var(--bber-sand)]/60 px-4 py-8 text-sm leading-7 text-[var(--bber-ink)]/74">
          {message}
        </div>
      </CardContent>
    </Card>
  );
}

export function DataOverviewPageView({
  pageData,
}: {
  pageData: DataOverviewPageData;
}) {
  return (
    <SectionPageShell pathname={pageData.path}>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h1 className="font-display text-4xl text-[var(--bber-red)] sm:text-5xl">
            {pageData.title}
          </h1>
          {pageData.introParagraphs.map((paragraph) => (
            <RichParagraphView
              key={getParagraphKey(paragraph)}
              paragraph={paragraph}
            />
          ))}
        </div>

        <div className="flex flex-col gap-5">
          <h2 className="font-display text-3xl text-[var(--bber-red)] sm:text-4xl">
            {pageData.beyondTitle}
          </h2>

          <div className="grid gap-6 xl:grid-cols-2">
            {pageData.locationQuotientPreview.status === "ready" ? (
              <Card className="border border-[var(--bber-border)] bg-white py-0 shadow-sm">
                <CardContent className="px-6 py-6">
                  <DataOverviewLocationQuotientPreview
                    preview={pageData.locationQuotientPreview.preview}
                  />
                </CardContent>
                <CardFooter className="px-6 py-4 text-xs leading-5 text-[var(--bber-ink)]/55">
                  {pageData.locationQuotientPreview.preview.sourceLine}
                </CardFooter>
              </Card>
            ) : (
              <PreviewUnavailableCard
                title="Location Quotient by Industry"
                message={pageData.locationQuotientPreview.message}
              />
            )}

            {pageData.populationPyramidPreview.status === "ready" ? (
              <Card className="border border-[var(--bber-border)] bg-white py-0 shadow-sm">
                <CardContent className="px-6 py-6">
                  <DataOverviewPopulationPyramidPreview
                    preview={pageData.populationPyramidPreview.preview}
                  />
                </CardContent>
                <CardFooter className="px-6 py-4 text-xs leading-5 text-[var(--bber-ink)]/55">
                  {pageData.populationPyramidPreview.preview.sourceLine}
                </CardFooter>
              </Card>
            ) : (
              <PreviewUnavailableCard
                title="Population Pyramid US"
                message={pageData.populationPyramidPreview.message}
              />
            )}
          </div>
        </div>
      </div>
    </SectionPageShell>
  );
}
