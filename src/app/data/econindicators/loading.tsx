import { SectionPageShell } from "@/components/site/section-page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function EconomicIndicatorsLoading() {
  return (
    <SectionPageShell pathname="/data/econindicators/">
      <Card className="border border-[var(--bber-border)] bg-white py-0 shadow-sm">
        <CardHeader className="px-6 pt-6">
          <CardTitle className="font-display text-3xl text-[var(--bber-red)]">
            Loading economic indicators
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <p className="text-sm leading-7 text-[var(--bber-ink)]/78">
            Fetching the current dashboard series from the BBER REST API.
          </p>
        </CardContent>
      </Card>
    </SectionPageShell>
  );
}
