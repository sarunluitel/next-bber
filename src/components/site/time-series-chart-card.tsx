"use client";

import { useMemo, useState } from "react";
import { ChartVariableMenu } from "@/components/site/chart-variable-menu";
import { DashboardChartCard } from "@/components/site/dashboard-chart-card";
import { DataDownloadMenu } from "@/components/site/data-download-menu";
import type { DashboardTimeSeriesCard } from "@/content-models/nm-statewide-dashboard";
import { LineGraph } from "@/visualizations/charts/external/line-graph";

type TimeSeriesChartCardProps = {
  card: DashboardTimeSeriesCard;
};

export function TimeSeriesChartCard({ card }: TimeSeriesChartCardProps) {
  const [selectedMetricValue, setSelectedMetricValue] = useState(
    card.defaultMetric,
  );
  const selectedMetric = useMemo(() => {
    return (
      card.metrics.find((metric) => metric.value === selectedMetricValue) ??
      card.metrics[0]
    );
  }, [card.metrics, selectedMetricValue]);

  return (
    <DashboardChartCard
      title={card.title}
      description={card.description}
      sourceLine={card.sourceLine}
      actions={
        <>
          <ChartVariableMenu
            selectedLabel={selectedMetric?.label ?? "Variable"}
            options={card.metrics.map((metric) => ({
              value: metric.value,
              label: metric.label,
            }))}
            onValueChange={setSelectedMetricValue}
          />
          <DataDownloadMenu chartId={card.download.chartId} />
        </>
      }
    >
      {selectedMetric && selectedMetric.points.length > 0 ? (
        <LineGraph
          ariaLabel={`${card.title} line chart for ${selectedMetric.label}`}
          data={selectedMetric.points}
          formatKind={selectedMetric.format}
          yAxisLabel={selectedMetric.yAxisLabel}
        />
      ) : (
        <div className="rounded-xl border border-dashed border-[var(--bber-border)] bg-[var(--bber-sand)]/60 px-4 py-8 text-sm leading-6 text-[var(--bber-ink)]/72">
          No published points are available for the selected series.
        </div>
      )}
    </DashboardChartCard>
  );
}
