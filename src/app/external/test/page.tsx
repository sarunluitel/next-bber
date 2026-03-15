import { ExternalS0801Chart } from "@/components/external/external-s0801-chart";
import { SectionPageShell } from "@/components/site/section-page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getExternalS0801PageData } from "@/lib/external-bber";

export default async function ExternalTestPage(
  props: PageProps<"/external/test">,
) {
  const searchParams = await props.searchParams;

  try {
    const pageData = await getExternalS0801PageData(searchParams);

    return (
      <SectionPageShell pathname="/external/test">
        <div className="flex flex-col gap-8">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--bber-red)]">
              External Data Visualization
            </p>
            <h1 className="font-display text-4xl text-[var(--bber-red)] sm:text-5xl">
              S0801 Commuting Series Prototype
            </h1>
            <p className="max-w-4xl text-base leading-8 text-[var(--bber-ink)]/80">
              This prototype reads directly from the BBER REST API, validates
              the published metadata on the server, and renders a reusable
              time-series chart frame for future external visualizations. It is
              intentionally opinionated about presentation so professors and
              economic researchers can review the source, period, and data
              values without leaving the page.
            </p>
          </div>

          <ExternalS0801Chart pageData={pageData} />
        </div>
      </SectionPageShell>
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "The chart data could not be loaded from the BBER API.";

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
            <p className="max-w-4xl text-base leading-8 text-[var(--bber-ink)]/80">
              The reusable chart shell is in place, but the external request did
              not complete successfully for this load.
            </p>
          </div>

          <Card className="border border-[var(--bber-border)] bg-white py-0 shadow-sm">
            <CardHeader className="px-6 pt-6">
              <CardTitle className="font-display text-2xl text-[var(--bber-red)]">
                Data Request Error
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <p className="text-sm leading-7 text-[var(--bber-ink)]/80">
                {errorMessage}
              </p>
            </CardContent>
          </Card>
        </div>
      </SectionPageShell>
    );
  }
}
