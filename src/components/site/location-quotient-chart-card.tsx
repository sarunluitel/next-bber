"use client";

import { startTransition, useEffect, useMemo, useState } from "react";
import { ChartPlaybackControls } from "@/components/site/chart-playback-controls";
import { ChartVariableMenu } from "@/components/site/chart-variable-menu";
import { DashboardChartCard } from "@/components/site/dashboard-chart-card";
import { DataDownloadMenu } from "@/components/site/data-download-menu";
import type { DashboardLocationQuotientCard } from "@/content-models/nm-statewide-dashboard";
import { LocationQuotientBubblePlot } from "@/visualizations/charts/external/location-quotient-bubble-plot";

type LocationQuotientChartCardProps = {
  card: DashboardLocationQuotientCard;
};

export function LocationQuotientChartCard({
  card,
}: LocationQuotientChartCardProps) {
  const [selectedMetricValue, setSelectedMetricValue] = useState(
    card.defaultMetric,
  );
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const selectedMetric = useMemo(() => {
    return (
      card.metrics.find((metric) => metric.value === selectedMetricValue) ??
      card.metrics[0]
    );
  }, [card.metrics, selectedMetricValue]);
  const years = selectedMetric?.frames.map((frame) => frame.year) ?? [];

  useEffect(() => {
    setSelectedYear(selectedMetric?.initialYear ?? years[0] ?? null);
  }, [selectedMetric?.initialYear, years]);

  useEffect(() => {
    if (!isPlaying || years.length <= 1 || selectedYear === null) {
      return;
    }

    const timerId = window.setInterval(() => {
      const currentIndex = Math.max(years.indexOf(selectedYear), 0);
      const nextIndex = currentIndex >= years.length - 1 ? 0 : currentIndex + 1;
      startTransition(() => {
        setSelectedYear(years[nextIndex] ?? selectedYear);
      });
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [isPlaying, selectedYear, years]);

  const currentFrame =
    selectedMetric?.frames.find((frame) => frame.year === selectedYear) ??
    selectedMetric?.frames.at(-1) ??
    null;

  return (
    <DashboardChartCard
      title={card.title}
      description={card.description}
      sourceLine={card.sourceLine}
      actions={
        <div className="flex w-full flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <ChartVariableMenu
              selectedLabel={selectedMetric?.label ?? "Variable"}
              options={card.metrics.map((metric) => ({
                value: metric.value,
                label: metric.label,
              }))}
              onValueChange={(nextMetric) => {
                setIsPlaying(false);
                setSelectedMetricValue(nextMetric as typeof card.defaultMetric);
              }}
            />
            <ChartPlaybackControls
              isPlaying={isPlaying}
              onTogglePlayback={() =>
                setIsPlaying((currentValue) => !currentValue)
              }
              onPrevious={() => {
                if (years.length === 0 || selectedYear === null) {
                  return;
                }

                setIsPlaying(false);
                const currentIndex = Math.max(years.indexOf(selectedYear), 0);
                const nextIndex =
                  currentIndex <= 0 ? years.length - 1 : currentIndex - 1;
                startTransition(() => {
                  setSelectedYear(years[nextIndex] ?? selectedYear);
                });
              }}
              onNext={() => {
                if (years.length === 0 || selectedYear === null) {
                  return;
                }

                setIsPlaying(false);
                const currentIndex = Math.max(years.indexOf(selectedYear), 0);
                const nextIndex =
                  currentIndex >= years.length - 1 ? 0 : currentIndex + 1;
                startTransition(() => {
                  setSelectedYear(years[nextIndex] ?? selectedYear);
                });
              }}
            />
          </div>
          <DataDownloadMenu
            apiRequestUrl={`/api/chart-download/${card.download.chartId}?format=api`}
            jsonDownloadUrl={`/api/chart-download/${card.download.chartId}?format=json`}
            csvDownloadUrl={`/api/chart-download/${card.download.chartId}?format=csv`}
          />
        </div>
      }
    >
      {selectedMetric && currentFrame ? (
        <div className="space-y-4">
          <div className="rounded-xl border border-[var(--bber-border)] bg-[var(--bber-sand)]/55 px-3 py-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--bber-red)]">
                Observation year
              </p>
              <p className="font-display text-2xl text-[var(--bber-ink)]">
                {currentFrame.yearLabel}
              </p>
            </div>
            <input
              type="range"
              min="0"
              max={String(Math.max(years.length - 1, 0))}
              step="1"
              value={Math.max(years.indexOf(currentFrame.year), 0)}
              onChange={(event) => {
                const nextYear = years[Number(event.target.value)];

                if (!nextYear) {
                  return;
                }

                setIsPlaying(false);
                startTransition(() => {
                  setSelectedYear(nextYear);
                });
              }}
              className="mt-3 w-full accent-[var(--bber-red)]"
              aria-label="Location quotient year"
            />
            <div className="mt-1 flex items-center justify-between text-xs text-[var(--bber-ink)]/58">
              <span>{selectedMetric.coverage.startYear ?? card.baseYear}</span>
              <span>{selectedMetric.coverage.endYear ?? card.baseYear}</span>
            </div>
          </div>
          <LocationQuotientBubblePlot
            ariaLabel={`${card.title} for ${currentFrame.yearLabel}`}
            frame={currentFrame}
            baseYear={card.baseYear}
          />
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-[var(--bber-border)] bg-[var(--bber-sand)]/60 px-4 py-8 text-sm leading-6 text-[var(--bber-ink)]/72">
          No location quotient observations are available for the selected
          metric.
        </div>
      )}
    </DashboardChartCard>
  );
}
