import { CalendarClockIcon, DatabaseIcon, OrbitIcon } from "lucide-react";
import type { ReactNode } from "react";
import { LocationQuotientExplorer } from "@/components/site/location-quotient-explorer";
import { SectionPageShell } from "@/components/site/section-page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LocationQuotientPageData } from "@/content-models/location-quotient";
import { formatExternalAsOfDate } from "@/visualizations/formatters/external-chart-formatters";

type LocationQuotientPageViewProps = {
  pageData: LocationQuotientPageData;
};

function SummaryCard({
  icon,
  label,
  value,
  description,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  description: string;
}) {
  return (
    <Card className="border border-[var(--bber-border)] bg-white/90 py-0 shadow-sm">
      <CardContent className="flex gap-4 px-5 py-5">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[var(--bber-sand)] text-[var(--bber-red)]">
          {icon}
        </div>
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--bber-red)]">
            {label}
          </p>
          <p className="font-display text-2xl text-[var(--bber-ink)]">
            {value}
          </p>
          <p className="text-sm leading-7 text-[var(--bber-ink)]/72">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export function LocationQuotientPageView({
  pageData,
}: LocationQuotientPageViewProps) {
  return (
    <SectionPageShell pathname="/data/location-quotient/">
      <div className="flex flex-col gap-8">
        <div className="overflow-hidden rounded-[2rem] border border-[var(--bber-border)] bg-[radial-gradient(circle_at_top_left,rgba(186,12,47,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(173,133,61,0.2),transparent_34%),linear-gradient(135deg,#fff_0%,#f8f3eb_52%,#efe3d0_100%)]">
          <div className="grid gap-8 px-6 py-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)] lg:px-8 lg:py-10">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--bber-red)]">
                {pageData.eyebrow}
              </p>
              <h1 className="font-display text-4xl text-[var(--bber-red)] sm:text-5xl">
                {pageData.title}
              </h1>
              <p className="max-w-4xl text-base leading-8 text-[var(--bber-ink)]/80">
                {pageData.description}
              </p>
              <p className="max-w-4xl text-sm leading-7 text-[var(--bber-ink)]/75">
                {pageData.methodology}
              </p>
            </div>

            <Card className="border border-[var(--bber-border)]/80 bg-white/85 py-0 shadow-sm backdrop-blur">
              <CardHeader className="px-6 pt-6">
                <CardTitle className="font-display text-2xl text-[var(--bber-ink)]">
                  Comparison Setup
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 px-6 pb-6">
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--bber-red)]">
                    Local area
                  </p>
                  <p className="text-sm leading-7 text-[var(--bber-ink)]/78">
                    {pageData.localSelection.summaryLabel}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--bber-red)]">
                    Reference area
                  </p>
                  <p className="text-sm leading-7 text-[var(--bber-ink)]/78">
                    {pageData.baseSelection.summaryLabel}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--bber-red)]">
                    Growth baseline
                  </p>
                  <p className="text-sm leading-7 text-[var(--bber-ink)]/78">
                    {pageData.baseTimeSelection.summaryLabel}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <SummaryCard
            icon={<OrbitIcon className="size-5" />}
            label="Frame coverage"
            value={
              pageData.chart.coverage.startYear &&
              pageData.chart.coverage.endYear
                ? `${pageData.chart.coverage.startYear}-${pageData.chart.coverage.endYear}`
                : "Not available"
            }
            description="Only years with overlapping local and reference totals are plotted."
          />
          <SummaryCard
            icon={<CalendarClockIcon className="size-5" />}
            label="Base year"
            value={String(pageData.chart.baseYear)}
            description="Growth is measured against local employment in this annual benchmark year."
          />
          <SummaryCard
            icon={<DatabaseIcon className="size-5" />}
            label="Source updated"
            value={formatExternalAsOfDate(pageData.sourceMetadata.updatedAt)}
            description="Published metadata timestamp from the upstream QCEW table definition."
          />
        </div>

        {pageData.chart.coverage.warningMessages.length > 0 ? (
          <Card className="border border-[var(--bber-border)] bg-white py-0 shadow-sm">
            <CardHeader className="px-6 pt-6">
              <CardTitle className="font-display text-2xl text-[var(--bber-red)]">
                Data Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <ul className="flex flex-col gap-2 text-sm leading-7 text-[var(--bber-ink)]/78">
                {pageData.chart.coverage.warningMessages.map((message) => (
                  <li key={message}>{message}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ) : null}

        <LocationQuotientExplorer chart={pageData.chart} />

        <Card className="border border-[var(--bber-border)] bg-white py-0 shadow-sm">
          <CardHeader className="px-6 pt-6">
            <CardTitle className="font-display text-2xl text-[var(--bber-red)]">
              Methodology Notes
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <ul className="flex flex-col gap-2 text-sm leading-7 text-[var(--bber-ink)]/78">
              {pageData.chart.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </SectionPageShell>
  );
}
