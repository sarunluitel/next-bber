import { LocationQuotientPageView } from "@/components/site/location-quotient-page-view";
import { SectionPageShell } from "@/components/site/section-page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getLocationQuotientPageData } from "@/lib/location-quotient";

export default async function LocationQuotientPage() {
  try {
    const pageData = await getLocationQuotientPageData();

    return <LocationQuotientPageView pageData={pageData} />;
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "The location quotient visualization could not be loaded.";

    return (
      <SectionPageShell pathname="/data/location-quotient/">
        <Card className="border border-[var(--bber-border)] bg-white py-0 shadow-sm">
          <CardHeader className="px-6 pt-6">
            <CardTitle className="font-display text-3xl text-[var(--bber-red)]">
              Location Quotient Data Request Error
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <p className="text-sm leading-7 text-[var(--bber-ink)]/78">
              {message}
            </p>
          </CardContent>
        </Card>
      </SectionPageShell>
    );
  }
}
