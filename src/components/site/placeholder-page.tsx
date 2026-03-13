import Link from "next/link";
import type { PageTrailEntry } from "pages";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type PlaceholderPageProps = {
  title: string;
  lead: string;
  trail: PageTrailEntry[];
  statusTitle?: string;
  statusMessage?: string;
  childLinks?: Array<{
    title: string;
    url: string;
  }>;
};

export function PlaceholderPage({
  title,
  lead,
  trail,
  statusTitle = "Under Construction",
  statusMessage = "This page is currently under construction. Please check back soon.",
  childLinks = [],
}: PlaceholderPageProps) {
  return (
    <div className="bg-[var(--bber-sand)]">
      <section className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--bber-red)]">
            {trail.map(({ node }) => node.title).join(" / ")}
          </p>
          <h1 className="font-display text-4xl text-[var(--bber-red)] sm:text-5xl">
            {title}
          </h1>
          <p className="max-w-3xl text-base leading-7 text-[var(--bber-ink)]/80">
            {lead}
          </p>
        </div>

        <Card className="border border-[var(--bber-border)] bg-white py-0 shadow-sm">
          <CardHeader className="px-6 pt-6">
            <CardTitle className="font-display text-2xl text-[var(--bber-ink)]">
              {statusTitle}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 px-6 pb-6">
            <p className="text-sm leading-7 text-[var(--bber-ink)]/75">
              {statusMessage}
            </p>

            {childLinks.length > 0 ? (
              <>
                <Separator className="bg-[var(--bber-border)]" />
                <div className="space-y-3">
                  <h2 className="font-display text-xl text-[var(--bber-red)]">
                    Explore this section
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {childLinks.map((childLink) => (
                      <Button
                        key={childLink.url}
                        variant="outline"
                        className="border-[var(--bber-border)] bg-white text-[var(--bber-red)] hover:bg-[var(--bber-sand)] hover:text-[var(--bber-red)]"
                        render={<Link href={childLink.url} />}
                      >
                        {childLink.title}
                      </Button>
                    ))}
                  </div>
                </div>
              </>
            ) : null}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
