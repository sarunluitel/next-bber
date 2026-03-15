"use client";

import { startTransition, useEffect, useMemo, useState } from "react";
import { ChartPlaybackControls } from "@/components/site/chart-playback-controls";
import type { DataOverviewLocationQuotientPreview as DataOverviewLocationQuotientPreviewModel } from "@/content-models/data-overview";
import { LocationQuotientBubblePlot } from "@/visualizations/charts/external/location-quotient-bubble-plot";

type DataOverviewLocationQuotientPreviewProps = {
  preview: DataOverviewLocationQuotientPreviewModel;
};

export function DataOverviewLocationQuotientPreview({
  preview,
}: DataOverviewLocationQuotientPreviewProps) {
  const years = useMemo(
    () => preview.frames.map((frame) => frame.year),
    [preview.frames],
  );
  const [selectedYear, setSelectedYear] = useState<number | null>(
    preview.initialYear,
  );
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setSelectedYear(preview.initialYear ?? years.at(-1) ?? null);
  }, [preview.initialYear, years]);

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
    preview.frames.find((frame) => frame.year === selectedYear) ??
    preview.frames.at(-1) ??
    null;

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
      <p className="text-sm leading-6 text-[var(--bber-ink)]/62">
        {preview.subtitle}
      </p>
      <LocationQuotientBubblePlot
        ariaLabel={`${preview.title} for ${currentFrame.yearLabel}`}
        frame={currentFrame}
        baseYear={preview.baseYear}
      />
    </div>
  );
}
