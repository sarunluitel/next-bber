"use client";

import { useEffect, useState } from "react";
import { ChartPlaybackControls } from "@/components/site/chart-playback-controls";
import type { DataOverviewPopulationPyramidPreview as DataOverviewPopulationPyramidPreviewModel } from "@/content-models/data-overview";
import { PopulationPyramidChart } from "@/visualizations/charts/external/population-pyramid";

type DataOverviewPopulationPyramidPreviewProps = {
  preview: DataOverviewPopulationPyramidPreviewModel;
};

function getFrameIndexForYear(years: number[], requestedYear: number | null) {
  if (requestedYear === null) {
    return Math.max(years.length - 1, 0);
  }

  const frameIndex = years.indexOf(requestedYear);
  return frameIndex >= 0 ? frameIndex : Math.max(years.length - 1, 0);
}

export function DataOverviewPopulationPyramidPreview({
  preview,
}: DataOverviewPopulationPyramidPreviewProps) {
  const years = preview.frames.map((frame) => frame.year);
  const [selectedFrameIndex, setSelectedFrameIndex] = useState(() =>
    getFrameIndexForYear(years, preview.initialYear),
  );
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setSelectedFrameIndex(getFrameIndexForYear(years, preview.initialYear));
  }, [preview.initialYear, years]);

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
    preview.frames[selectedFrameIndex] ?? preview.frames.at(-1) ?? null;

  if (!currentFrame) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-baseline gap-2">
          <p className="text-xl leading-tight text-[var(--bber-ink)]">
            {preview.title}
          </p>
          <p className="text-lg text-[var(--bber-red)]">
            {currentFrame.yearLabel}
          </p>
        </div>
        <ChartPlaybackControls
          isPlaying={isPlaying}
          onTogglePlayback={() => setIsPlaying((currentValue) => !currentValue)}
          onPrevious={() => {
            setIsPlaying(false);
            setSelectedFrameIndex((currentFrameIndex) =>
              currentFrameIndex <= 0
                ? preview.frames.length - 1
                : currentFrameIndex - 1,
            );
          }}
          onNext={() => {
            setIsPlaying(false);
            setSelectedFrameIndex((currentFrameIndex) =>
              currentFrameIndex >= preview.frames.length - 1
                ? 0
                : currentFrameIndex + 1,
            );
          }}
        />
      </div>
      <p className="text-sm leading-6 text-[var(--bber-ink)]/62">
        {preview.subtitle}
      </p>
      <PopulationPyramidChart
        ariaLabel={`${preview.title} for ${currentFrame.yearLabel}`}
        frame={currentFrame}
        maxBandPopulation={preview.maxBandPopulation}
        showDetailLabel={false}
      />
    </div>
  );
}
