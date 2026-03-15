import { PopulationPyramidPageView } from "@/components/site/population-pyramid-page-view";
import { SectionPageShell } from "@/components/site/section-page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPopulationPyramidPageData } from "@/lib/population-pyramid";

export default async function PopulationPyramidPage() {
  try {
    const pageData = await getPopulationPyramidPageData();

    return <PopulationPyramidPageView pageData={pageData} />;
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "The population pyramid visualization could not be loaded.";

    return (
      <SectionPageShell pathname="/external/pyramid-test">
        <Card className="border border-[var(--bber-border)] bg-white py-0 shadow-sm">
          <CardHeader className="px-6 pt-6">
            <CardTitle className="font-display text-3xl text-[var(--bber-red)]">
              Population Pyramid Data Request Error
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
