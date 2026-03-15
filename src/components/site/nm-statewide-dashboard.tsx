import { EducationDonutChartCard } from "@/components/site/education-donut-chart-card";
import { LocationQuotientChartCard } from "@/components/site/location-quotient-chart-card";
import { PopulationPyramidChartCard } from "@/components/site/population-pyramid-chart-card";
import { TimeSeriesChartCard } from "@/components/site/time-series-chart-card";
import type { NmStatewideDashboardPageData } from "@/content-models/nm-statewide-dashboard";

type NmStatewideDashboardProps = {
  pageData: NmStatewideDashboardPageData;
};

export function NmStatewideDashboard({ pageData }: NmStatewideDashboardProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h1 className="font-display text-4xl text-[var(--bber-red)] sm:text-5xl">
          {pageData.title}
        </h1>
        <p className="max-w-4xl text-base leading-8 text-[var(--bber-ink)]/80">
          {pageData.description}
        </p>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        {pageData.cards.map((card) => {
          if (card.kind === "location-quotient") {
            return <LocationQuotientChartCard key={card.id} card={card} />;
          }

          if (card.kind === "donut") {
            return <EducationDonutChartCard key={card.id} card={card} />;
          }

          if (card.kind === "population-pyramid") {
            return <PopulationPyramidChartCard key={card.id} card={card} />;
          }

          return <TimeSeriesChartCard key={card.id} card={card} />;
        })}
      </div>
    </div>
  );
}
