"use client";

import { PauseIcon, PlayIcon } from "lucide-react";
import { startTransition, useEffect, useEffectEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { LocationQuotientChartModel } from "@/content-models/location-quotient";
import { cn } from "@/lib/utils";
import { LocationQuotientBubblePlot } from "@/visualizations/charts/external/location-quotient-bubble-plot";
import {
  buildLocationQuotientFrameSummary,
  formatEmploymentCount,
  formatEmploymentShare,
  formatGrowthPercent,
  formatLocationQuotientValue,
} from "@/visualizations/formatters/location-quotient-formatters";

type LocationQuotientExplorerProps = {
  chart: LocationQuotientChartModel;
};

function FrameInsightCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <Card className="border border-[var(--bber-border)] bg-white/90 py-0 shadow-sm">
      <CardContent className="space-y-1 px-5 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--bber-red)]">
          {label}
        </p>
        <p className="font-display text-2xl text-[var(--bber-ink)]">{value}</p>
        <p className="text-sm leading-7 text-[var(--bber-ink)]/72">{detail}</p>
      </CardContent>
    </Card>
  );
}

export function LocationQuotientExplorer({
  chart,
}: LocationQuotientExplorerProps) {
  const years = chart.frames.map((frame) => frame.year);
  const [selectedYear, setSelectedYear] = useState(
    chart.initialYear ?? years[0] ?? chart.baseYear,
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const currentFrame =
    chart.frames.find((frame) => frame.year === selectedYear) ??
    chart.frames[0];

  const stepFrame = useEffectEvent((direction: 1 | -1) => {
    if (years.length === 0) {
      return;
    }

    const currentIndex = Math.max(years.indexOf(selectedYear), 0);
    const nextIndex =
      (currentIndex + direction + years.length) % Math.max(years.length, 1);

    startTransition(() => {
      setSelectedYear(years[nextIndex] ?? selectedYear);
    });
  });

  useEffect(() => {
    if (!isPlaying || years.length < 2) {
      return;
    }

    const intervalId = window.setInterval(() => {
      stepFrame(1);
    }, 1500);

    return () => window.clearInterval(intervalId);
  }, [isPlaying, stepFrame, years.length]);

  if (!currentFrame) {
    return (
      <div className="rounded-[1.5rem] border border-dashed border-[var(--bber-border)] bg-[var(--bber-sand)] px-5 py-8 text-sm leading-7 text-[var(--bber-ink)]/76">
        No location quotient observations are available for the configured
        comparison.
      </div>
    );
  }

  const highestLqPoint = currentFrame.points[0];
  const largestEmploymentPoint = [...currentFrame.points].sort(
    (leftPoint, rightPoint) => rightPoint.bubbleSize - leftPoint.bubbleSize,
  )[0];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-3">
        <FrameInsightCard
          label="Frame year"
          value={currentFrame.yearLabel}
          detail={`${currentFrame.points.length} industries plotted after validation.`}
        />
        <FrameInsightCard
          label="Highest LQ"
          value={formatLocationQuotientValue(highestLqPoint.locationQuotient)}
          detail={highestLqPoint.industryLabel}
        />
        <FrameInsightCard
          label="Largest bubble"
          value={formatEmploymentCount(largestEmploymentPoint.localEmployment)}
          detail={largestEmploymentPoint.industryLabel}
        />
      </div>

      <Card className="border border-[var(--bber-border)] bg-white py-0 shadow-sm">
        <CardHeader className="space-y-4 px-6 pt-6">
          <div className="space-y-2">
            <CardTitle className="font-display text-3xl text-[var(--bber-red)]">
              {chart.chartTitle}
            </CardTitle>
            <p className="text-sm leading-7 text-[var(--bber-ink)]/75">
              {chart.chartSubtitle}
            </p>
          </div>
          <p className="text-sm leading-7 text-[var(--bber-ink)]/78">
            {chart.summary}
          </p>
          <p className="rounded-2xl border border-[var(--bber-border)] bg-[var(--bber-sand)] px-4 py-3 text-sm leading-7 text-[var(--bber-ink)]/78">
            {buildLocationQuotientFrameSummary(currentFrame, chart.baseYear)}
          </p>
        </CardHeader>
        <CardContent className="space-y-6 px-6 pb-6">
          <div className="grid gap-4 rounded-[1.5rem] border border-[var(--bber-border)] bg-[var(--bber-sand)] px-4 py-4 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                className="rounded-full border-[var(--bber-border)] bg-white"
                onClick={() => {
                  setIsPlaying(false);
                  stepFrame(-1);
                }}
              >
                Previous
              </Button>
              <Button
                type="button"
                className={cn(
                  "rounded-full",
                  isPlaying
                    ? "bg-[var(--bber-ink)] text-white hover:bg-[var(--bber-ink)]/90"
                    : "bg-[var(--bber-red)] text-white hover:bg-[var(--bber-red-strong)]",
                )}
                onClick={() => setIsPlaying((currentValue) => !currentValue)}
              >
                {isPlaying ? (
                  <PauseIcon className="mr-2 size-4" />
                ) : (
                  <PlayIcon className="mr-2 size-4" />
                )}
                {isPlaying ? "Pause" : "Play"}
              </Button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-4">
                <label
                  htmlFor="location-quotient-year"
                  className="text-sm font-semibold text-[var(--bber-ink)]"
                >
                  Observation year
                </label>
                <span className="font-display text-2xl text-[var(--bber-red)]">
                  {currentFrame.yearLabel}
                </span>
              </div>
              <input
                id="location-quotient-year"
                type="range"
                min={0}
                max={Math.max(years.length - 1, 0)}
                step={1}
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
                className="h-2 w-full accent-[var(--bber-red)]"
              />
              <div className="flex justify-between gap-3 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--bber-ink)]/55">
                <span>{chart.coverage.startYear ?? chart.baseYear}</span>
                <span>{chart.coverage.endYear ?? chart.baseYear}</span>
              </div>
            </div>

            <div className="flex justify-start lg:justify-end">
              <Button
                type="button"
                variant="outline"
                className="rounded-full border-[var(--bber-border)] bg-white"
                onClick={() => {
                  setIsPlaying(false);
                  stepFrame(1);
                }}
              >
                Next
              </Button>
            </div>
          </div>

          <LocationQuotientBubblePlot
            ariaLabel={`Location quotient bubble chart for ${currentFrame.yearLabel}`}
            frame={currentFrame}
            baseYear={chart.baseYear}
          />

          <div className="grid gap-4 rounded-[1.5rem] border border-[var(--bber-border)] bg-[var(--bber-sand)] px-5 py-5 lg:grid-cols-4">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--bber-red)]">
                Top-right quadrant
              </p>
              <p className="text-sm leading-7 text-[var(--bber-ink)]/76">
                More concentrated locally than the base area and growing since
                the base year.
              </p>
            </div>
            <Separator
              orientation="vertical"
              className="hidden h-auto bg-[var(--bber-border)] lg:block"
            />
            <div className="space-y-1 lg:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--bber-red)]">
                Reading the chart
              </p>
              <p className="text-sm leading-7 text-[var(--bber-ink)]/76">
                The vertical guide at LQ = 1 marks parity with the reference
                geography. The horizontal guide at zero separates industries
                that have added employment since the base year from those that
                remain below their base-year level.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <h3 className="font-display text-2xl text-[var(--bber-ink)]">
                Current-year sector table
              </h3>
              <p className="text-sm leading-7 text-[var(--bber-ink)]/72">
                The table uses the same frame shown in the bubble chart so the
                plotted positions, shares, and local employment levels are easy
                to audit.
              </p>
            </div>
            <div className="overflow-x-auto rounded-[1.5rem] border border-[var(--bber-border)]">
              <Table className="min-w-[64rem] bg-white">
                <TableHeader>
                  <TableRow className="border-[var(--bber-border)]">
                    <TableHead className="text-[var(--bber-red)]">
                      Industry
                    </TableHead>
                    <TableHead className="text-[var(--bber-red)]">LQ</TableHead>
                    <TableHead className="text-[var(--bber-red)]">
                      Growth Since {chart.baseYear}
                    </TableHead>
                    <TableHead className="text-[var(--bber-red)]">
                      Local Employment
                    </TableHead>
                    <TableHead className="text-[var(--bber-red)]">
                      Local Share
                    </TableHead>
                    <TableHead className="text-[var(--bber-red)]">
                      Reference Share
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentFrame.points.map((point) => (
                    <TableRow
                      key={`${point.year}:${point.industryCode}`}
                      className="border-[var(--bber-border)]"
                    >
                      <TableCell className="font-medium text-[var(--bber-ink)]">
                        {point.industryLabel}
                      </TableCell>
                      <TableCell>
                        {formatLocationQuotientValue(point.locationQuotient)}
                      </TableCell>
                      <TableCell>
                        {formatGrowthPercent(point.growthSinceBaseYear)}
                      </TableCell>
                      <TableCell>
                        {formatEmploymentCount(point.localEmployment)}
                      </TableCell>
                      <TableCell>
                        {formatEmploymentShare(point.localIndustryShare)}
                      </TableCell>
                      <TableCell>
                        {formatEmploymentShare(point.baseIndustryShare)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
