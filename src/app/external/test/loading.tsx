import { SectionPageShell } from "@/components/site/section-page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ExternalTestLoading() {
  return (
    <SectionPageShell pathname="/external/test">
      <div className="flex flex-col gap-6">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--bber-red)]">
            External Data Visualization
          </p>
          <h1 className="font-display text-4xl text-[var(--bber-red)] sm:text-5xl">
            S0801 Commuting Series Prototype
          </h1>
        </div>

        <Card className="border border-[var(--bber-border)] bg-white py-0 shadow-sm">
          <CardHeader className="px-6 pt-6">
            <CardTitle className="font-display text-2xl text-[var(--bber-ink)]">
              Loading chart data
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <p className="text-sm leading-7 text-[var(--bber-ink)]/75">
              Fetching metadata, geography options, and the requested time
              series from the BBER REST API.
            </p>
          </CardContent>
        </Card>
      </div>
    </SectionPageShell>
  );
}
