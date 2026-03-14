import type { PageTrailEntry } from "pages";
import { SectionPageShell } from "@/components/site/section-page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type PlaceholderPageProps = {
  pathname: string;
  title: string;
  lead: string;
  trail: PageTrailEntry[];
  statusTitle?: string;
  statusMessage?: string;
};

export function PlaceholderPage({
  pathname,
  title,
  lead,
  trail,
  statusTitle = "Under Construction",
  statusMessage = "This page is currently under construction. Please check back soon.",
}: PlaceholderPageProps) {
  return (
    <SectionPageShell pathname={pathname}>
      <div className="flex flex-col gap-6">
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
          </CardContent>
        </Card>
      </div>
    </SectionPageShell>
  );
}
