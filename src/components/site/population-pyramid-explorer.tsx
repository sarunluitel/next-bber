"use client";

import {
  PauseIcon,
  PlayIcon,
  StepBackIcon,
  StepForwardIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { PopulationPyramidChartModel } from "@/content-models/population-pyramid";
import { PopulationPyramidChart } from "@/visualizations/charts/external/population-pyramid";
import {
  buildPopulationPyramidFrameSummary,
  formatPopulationCount,
} from "@/visualizations/formatters/population-pyramid-formatters";

type PopulationPyramidExplorerProps = {
  chart: PopulationPyramidChartModel;
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

export function PopulationPyramidExplorer({
  chart,
}: PopulationPyramidExplorerProps) {
  const years = chart.frames.map((frame) => frame.year);
  const initialFrameIndex = getFrameIndexForYear(years, chart.initialYear);
  const [selectedFrameIndex, setSelectedFrameIndex] = useState(
    () => initialFrameIndex,
  );
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setSelectedFrameIndex(initialFrameIndex);
  }, [initialFrameIndex]);

  useEffect(() => {
    if (!isPlaying || chart.frames.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setSelectedFrameIndex((currentFrameIndex) => {
        return currentFrameIndex >= chart.frames.length - 1
          ? 0
          : currentFrameIndex + 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [chart.frames.length, isPlaying]);

  if (chart.frames.length === 0) {
    return (
      <Card className="border border-[var(--bber-border)] bg-white py-0 shadow-sm">
        <CardHeader className="px-6 pt-6">
          <CardTitle className="font-display text-2xl text-[var(--bber-red)]">
            No Population Frames Available
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <p className="text-sm leading-7 text-[var(--bber-ink)]/78">
            The upstream response did not include any plottable age-by-sex rows
            for this request.
          </p>
        </CardContent>
      </Card>
    );
  }

  const currentFrame = chart.frames[selectedFrameIndex] ?? chart.frames.at(-1);

  if (!currentFrame) {
    return null;
  }

  const frameSummary = buildPopulationPyramidFrameSummary(currentFrame);

  return (
    <div className="flex flex-col gap-6">
      <Card className="border border-[var(--bber-border)] bg-white py-0 shadow-sm">
        <CardHeader className="gap-3 px-6 pt-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--bber-red)]">
                Animated population pyramid
              </p>
              <CardTitle className="font-display text-3xl text-[var(--bber-red)] sm:text-4xl">
                {chart.chartTitle}
              </CardTitle>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--bber-ink)]/60">
                {chart.chartSubtitle}
              </p>
            </div>
            <div className="flex items-center gap-2 self-start">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsPlaying(false);
                  setSelectedFrameIndex((currentIndex) =>
                    currentIndex <= 0
                      ? chart.frames.length - 1
                      : currentIndex - 1,
                  );
                }}
              >
                <StepBackIcon data-icon="inline-start" />
                Previous
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsPlaying((currentValue) => !currentValue)}
              >
                {isPlaying ? (
                  <PauseIcon data-icon="inline-start" />
                ) : (
                  <PlayIcon data-icon="inline-start" />
                )}
                {isPlaying ? "Pause" : "Play"}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsPlaying(false);
                  setSelectedFrameIndex((currentIndex) =>
                    currentIndex >= chart.frames.length - 1
                      ? 0
                      : currentIndex + 1,
                  );
                }}
              >
                <StepForwardIcon data-icon="inline-start" />
                Next
              </Button>
            </div>
          </div>
          <p className="max-w-4xl text-base leading-8 text-[var(--bber-ink)]/80">
            {chart.summary}
          </p>
        </CardHeader>

        <CardContent className="flex flex-col gap-5 px-6 pb-6">
          <div className="rounded-[1.25rem] border border-[var(--bber-border)] bg-[var(--bber-sand)]/65 px-4 py-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--bber-red)]">
                  Selected year
                </p>
                <p className="font-display text-3xl text-[var(--bber-ink)]">
                  {currentFrame.yearLabel}
                </p>
              </div>
              <p className="max-w-3xl text-sm leading-7 text-[var(--bber-ink)]/78">
                {frameSummary}
              </p>
            </div>
            <div className="mt-4 flex flex-col gap-2">
              <label
                htmlFor="population-pyramid-year"
                className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--bber-ink)]/60"
              >
                Year scrubber
              </label>
              <input
                id="population-pyramid-year"
                type="range"
                min="0"
                max={String(Math.max(chart.frames.length - 1, 0))}
                step="1"
                value={selectedFrameIndex}
                onChange={(event) => {
                  setIsPlaying(false);
                  setSelectedFrameIndex(Number(event.target.value));
                }}
                className="w-full accent-[var(--bber-red)]"
              />
              <div className="flex items-center justify-between text-xs text-[var(--bber-ink)]/58">
                <span>{chart.coverage.startYear}</span>
                <span>{chart.coverage.endYear}</span>
              </div>
            </div>
          </div>

          <PopulationPyramidChart
            ariaLabel={frameSummary}
            frame={currentFrame}
            maxBandPopulation={chart.coverage.maxBandPopulation}
          />
        </CardContent>
      </Card>

      <Card className="border border-[var(--bber-border)] bg-white py-0 shadow-sm">
        <CardHeader className="px-6 pt-6">
          <CardTitle className="font-display text-2xl text-[var(--bber-ink)]">
            Current-Year Table
          </CardTitle>
          <p className="text-sm leading-7 text-[var(--bber-ink)]/75">
            The tabular fallback stays synchronized with the selected year so
            researchers can review exact values alongside the animated bars.
          </p>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Age group</TableHead>
                <TableHead>Male</TableHead>
                <TableHead>Female</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentFrame.bands.map((band) => (
                <TableRow key={`${currentFrame.year}-${band.ageGroupCode}`}>
                  <TableCell>{band.ageGroupLabel}</TableCell>
                  <TableCell>
                    {formatPopulationCount(band.malePopulation)}
                  </TableCell>
                  <TableCell>
                    {formatPopulationCount(band.femalePopulation)}
                  </TableCell>
                  <TableCell>
                    {formatPopulationCount(band.totalPopulation)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
