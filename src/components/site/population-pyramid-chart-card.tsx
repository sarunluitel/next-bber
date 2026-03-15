"use client";

import { useEffect, useState } from "react";
import { ChartPlaybackControls } from "@/components/site/chart-playback-controls";
import { DashboardChartCard } from "@/components/site/dashboard-chart-card";
import { DataDownloadMenu } from "@/components/site/data-download-menu";
import type { DashboardPopulationPyramidCard } from "@/content-models/nm-statewide-dashboard";
import { PopulationPyramidChart } from "@/visualizations/charts/external/population-pyramid";

type PopulationPyramidChartCardProps = {
  card: DashboardPopulationPyramidCard;
};

function getFrameIndexForYear(
  years: number[],
  requestedYear: number | null,
): number {
  if (requestedYear === null) {
    return Math.max(years.length - 1, 0);
  }

  const frameIndex = years.indexOf(requestedYear);
  return frameIndex >= 0 ? frameIndex : Math.max(years.length - 1, 0);
}

export function PopulationPyramidChartCard({
  card,
}: PopulationPyramidChartCardProps) {
  const years = card.frames.map((frame) => frame.year);
  const [selectedFrameIndex, setSelectedFrameIndex] = useState(() =>
    getFrameIndexForYear(years, card.initialYear),
  );
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setSelectedFrameIndex(getFrameIndexForYear(years, card.initialYear));
  }, [card.initialYear, years]);

  useEffect(() => {
    if (!isPlaying || years.length <= 1) {
      return;
    }

    const timerId = window.setInterval(() => {
      setSelectedFrameIndex((currentFrameIndex) =>
        currentFrameIndex >= years.length - 1 ? 0 : currentFrameIndex + 1,
      );
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [isPlaying, years.length]);

  const currentFrame =
    card.frames[selectedFrameIndex] ?? card.frames.at(-1) ?? null;

  return (
    <DashboardChartCard
      title={card.title}
      description={card.description}
      sourceLine={card.sourceLine}
      actions={
        <div className="flex w-full flex-wrap items-center justify-between gap-2">
          <ChartPlaybackControls
            isPlaying={isPlaying}
            onTogglePlayback={() =>
              setIsPlaying((currentValue) => !currentValue)
            }
            onPrevious={() => {
              setIsPlaying(false);
              setSelectedFrameIndex((currentFrameIndex) =>
                currentFrameIndex <= 0
                  ? card.frames.length - 1
                  : currentFrameIndex - 1,
              );
            }}
            onNext={() => {
              setIsPlaying(false);
              setSelectedFrameIndex((currentFrameIndex) =>
                currentFrameIndex >= card.frames.length - 1
                  ? 0
                  : currentFrameIndex + 1,
              );
            }}
          />
          <DataDownloadMenu chartId={card.download.chartId} />
        </div>
      }
    >
      {currentFrame ? (
        <div className="space-y-4">
          <div className="rounded-xl border border-[var(--bber-border)] bg-[var(--bber-sand)]/55 px-3 py-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--bber-red)]">
                Selected year
              </p>
              <p className="font-display text-2xl text-[var(--bber-ink)]">
                {currentFrame.yearLabel}
              </p>
            </div>
            <input
              type="range"
              min="0"
              max={String(Math.max(card.frames.length - 1, 0))}
              step="1"
              value={selectedFrameIndex}
              onChange={(event) => {
                setIsPlaying(false);
                setSelectedFrameIndex(Number(event.target.value));
              }}
              className="mt-3 w-full accent-[var(--bber-red)]"
              aria-label="Population pyramid year"
            />
            <div className="mt-1 flex items-center justify-between text-xs text-[var(--bber-ink)]/58">
              <span>{card.coverage.startYear}</span>
              <span>{card.coverage.endYear}</span>
            </div>
          </div>
          <PopulationPyramidChart
            ariaLabel={`${card.title} for ${currentFrame.yearLabel}`}
            frame={currentFrame}
            maxBandPopulation={card.coverage.maxBandPopulation}
          />
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-[var(--bber-border)] bg-[var(--bber-sand)]/60 px-4 py-8 text-sm leading-6 text-[var(--bber-ink)]/72">
          No annual population frames are available for this request.
        </div>
      )}
    </DashboardChartCard>
  );
}
