import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { researchPageContent } from "@/content-models/research-content";

type ResearchOverviewProps = {
  content: typeof researchPageContent;
};

export function ResearchOverview({ content }: ResearchOverviewProps) {
  return (
    <Card className="border border-[var(--bber-border)] bg-white py-0 shadow-sm">
      <CardContent className="grid gap-8 px-6 py-6 lg:grid-cols-[minmax(0,1.2fr)_280px]">
        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--bber-red)]">
              BBER Research
            </p>
            <h1 className="font-display text-4xl text-[var(--bber-red)] sm:text-5xl">
              {content.title}
            </h1>
            <p className="max-w-3xl text-base leading-8 text-[var(--bber-ink)]/80">
              {content.lead}
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <Image
              src={content.sampleImage.src}
              alt={content.sampleImage.alt}
              width={content.sampleImage.width}
              height={content.sampleImage.height}
              className="h-auto w-full max-w-[240px] rounded-lg border border-[var(--bber-border)] object-cover shadow-sm"
            />
            <div className="space-y-4">
              <p className="text-base leading-8 text-[var(--bber-ink)]/80">
                {content.methodsLead}
              </p>
              <ul className="grid gap-2 text-sm leading-7 text-[var(--bber-ink)]/80 sm:grid-cols-2">
                {content.methods.map((method) => (
                  <li
                    key={method}
                    className="rounded-md bg-[var(--bber-sand)] px-3 py-2"
                  >
                    {method}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {content.supportingParagraphs.map((paragraph) => (
            <p
              key={paragraph}
              className="text-base leading-8 text-[var(--bber-ink)]/80"
            >
              {paragraph}
            </p>
          ))}
        </div>

        <aside className="space-y-4">
          <h2 className="font-display text-2xl text-[var(--bber-red)]">
            Explore this section
          </h2>
          <div className="space-y-3">
            {content.sectionLinks.map((link) => (
              <Card
                key={link.url}
                className="border border-[var(--bber-border)] bg-[var(--bber-sand)] py-0 shadow-none"
              >
                <CardContent className="space-y-2 px-4 py-4">
                  <p className="font-semibold text-[var(--bber-ink)]">
                    {link.title}
                  </p>
                  <p className="text-sm leading-6 text-[var(--bber-ink)]/75">
                    {link.description}
                  </p>
                  <Button
                    variant="ghost"
                    className="h-auto px-0 text-[var(--bber-red)] hover:bg-transparent hover:text-[var(--bber-red-strong)]"
                    render={<Link href={link.url} />}
                  >
                    Open
                    <ArrowRightIcon className="size-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </aside>
      </CardContent>
    </Card>
  );
}
