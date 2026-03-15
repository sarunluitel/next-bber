"use client";

import { DashboardChartCard } from "@/components/site/dashboard-chart-card";
import { DataDownloadMenu } from "@/components/site/data-download-menu";
import type { DashboardEducationDonutCard } from "@/content-models/nm-statewide-dashboard";
import { EducationDonutChart } from "@/visualizations/charts/external/education-donut-chart";

type EducationDonutChartCardProps = {
  card: DashboardEducationDonutCard;
};

export function EducationDonutChartCard({
  card,
}: EducationDonutChartCardProps) {
  return (
    <DashboardChartCard
      title={card.title}
      description={card.description}
      sourceLine={card.sourceLine}
      actions={
        <div className="flex w-full items-center justify-end">
          <DataDownloadMenu chartId={card.download.chartId} />
        </div>
      }
    >
      <EducationDonutChart
        ariaLabel={`${card.title} for ${card.geographyLabel} in ${card.yearLabel}`}
        slices={card.slices}
        totalAdults={card.totalAdults}
      />
    </DashboardChartCard>
  );
}
