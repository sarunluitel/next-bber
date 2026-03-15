"use client";

import { SearchIcon } from "lucide-react";
import { useDeferredValue, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type {
  EconIndicatorCard,
  EconIndicatorLinePoint,
  EconIndicatorRange,
  EconIndicatorsPageData,
  IndicatorFormatKind,
} from "@/content-models/econindicators";
import { cn } from "@/lib/utils";
import { LineGraph } from "@/visualizations/charts/external/line-graph";
import {
  buildIndicatorTrendSummary,
  formatExternalAsOfDate,
  formatIndicatorValue,
} from "@/visualizations/formatters/external-chart-formatters";

type EconIndicatorsDashboardProps = {
  pageData: EconIndicatorsPageData;
};

function filterPointsByRange(
  points: EconIndicatorLinePoint[],
  range: EconIndicatorRange,
) {
  if (points.length === 0 || range === "all") {
    return points;
  }

  const latestTimestamp = points[points.length - 1].timestamp;
  const latestDate = new Date(latestTimestamp);
  const yearsToSubtract = range === "1y" ? 1 : 3;

  const cutoffDate = new Date(
    Date.UTC(
      latestDate.getUTCFullYear() - yearsToSubtract,
      latestDate.getUTCMonth(),
      latestDate.getUTCDate(),
    ),
  );

  return points.filter((point) => point.timestamp >= cutoffDate.getTime());
}

function buildLatestValue(
  points: EconIndicatorLinePoint[],
  format: IndicatorFormatKind,
) {
  const latestPoint = points[points.length - 1];
  return latestPoint
    ? formatIndicatorValue(latestPoint.value, format, true)
    : "Not reported";
}

function buildChangeLabel(
  points: EconIndicatorLinePoint[],
  format: IndicatorFormatKind,
) {
  if (points.length < 2) {
    return "Not enough observations";
  }

  const latestPoint = points[points.length - 1];
  const previousPoint = points[points.length - 2];
  const difference = latestPoint.value - previousPoint.value;
  const direction = difference > 0 ? "up" : difference < 0 ? "down" : "flat";

  if (direction === "flat") {
    return `Flat from previous observation`;
  }

  return `${direction === "up" ? "Up" : "Down"} ${formatIndicatorValue(Math.abs(difference), format, true)} from previous observation`;
}

export function EconIndicatorsDashboard({
  pageData,
}: EconIndicatorsDashboardProps) {
  const [selectedRange, setSelectedRange] = useState<EconIndicatorRange>("all");
  const [searchValue, setSearchValue] = useState("");
  const [selectedMetrics, setSelectedMetrics] = useState<
    Record<string, string>
  >(() =>
    Object.fromEntries(
      pageData.cards.map((card) => [card.id, card.defaultMetric]),
    ),
  );
  const deferredSearchValue = useDeferredValue(searchValue);
  const normalizedSearchValue = deferredSearchValue.trim().toLowerCase();
  const visibleCards = useMemo(() => {
    if (!normalizedSearchValue) {
      return pageData.cards;
    }

    return pageData.cards.filter((card) => {
      const matchesCard =
        card.title.toLowerCase().includes(normalizedSearchValue) ||
        card.description.toLowerCase().includes(normalizedSearchValue) ||
        card.eyebrow.toLowerCase().includes(normalizedSearchValue);

      if (matchesCard) {
        return true;
      }

      return card.metrics.some((metric) =>
        `${metric.label} ${metric.description}`
          .toLowerCase()
          .includes(normalizedSearchValue),
      );
    });
  }, [normalizedSearchValue, pageData.cards]);

  return (
    <div className="flex flex-col gap-8">
      <div className="overflow-hidden rounded-[2rem] border border-[var(--bber-border)] bg-[radial-gradient(circle_at_top_left,rgba(186,12,47,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(173,133,61,0.18),transparent_30%),linear-gradient(135deg,#fff_0%,#f8f3eb_50%,#efe3d0_100%)]">
        <div className="grid gap-8 px-6 py-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(18rem,0.75fr)] lg:px-8 lg:py-10">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--bber-red)]">
              Dashboard Recreation
            </p>
            <h1 className="font-display text-4xl text-[var(--bber-red)] sm:text-5xl">
              NM Economic Indicators
            </h1>
            <p className="max-w-4xl text-base leading-8 text-[var(--bber-ink)]/80">
              This dashboard recreates the live economic indicators experience
              as a responsive, API-driven page inside the new app. Each chart
              shares the same line renderer, while metric selection stays
              compact and the time window is controlled once at the dashboard
              level.
            </p>

            <div className="max-w-xl">
              <label htmlFor="economic-indicator-search" className="sr-only">
                Search dashboard indicators
              </label>
              <div className="relative">
                <SearchIcon
                  data-icon="inline-start"
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--bber-ink)]/45"
                />
                <Input
                  id="economic-indicator-search"
                  value={searchValue}
                  onChange={(event) => setSearchValue(event.target.value)}
                  placeholder="Search indicators, measures, or topics"
                  className="h-12 rounded-full border-[var(--bber-border)] bg-white/90 pl-11 text-base shadow-sm"
                />
              </div>
            </div>
          </div>

          <Card className="border border-[var(--bber-border)]/80 bg-white/85 py-0 shadow-sm backdrop-blur">
            <CardHeader className="px-6 pt-6">
              <CardTitle className="font-display text-2xl text-[var(--bber-ink)]">
                Time Window
              </CardTitle>
              <p className="text-sm leading-7 text-[var(--bber-ink)]/70">
                Apply one concise time selector across the dashboard.
              </p>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <ToggleGroup
                value={[selectedRange]}
                onValueChange={(nextValue) => {
                  const nextRange = nextValue[0];

                  if (nextRange) {
                    setSelectedRange(nextRange as EconIndicatorRange);
                  }
                }}
                variant="outline"
                size="sm"
                spacing={1}
                aria-label="Dashboard time window"
                className="flex flex-wrap gap-2"
              >
                {pageData.rangeOptions.map((option) => (
                  <ToggleGroupItem
                    key={option.value}
                    className={cn(
                      "rounded-full border-[var(--bber-border)] bg-white px-4 text-[var(--bber-ink)]",
                      "data-[state=on]:border-[var(--bber-red)] data-[state=on]:bg-[var(--bber-red)] data-[state=on]:text-white",
                    )}
                    value={option.value}
                    aria-label={`Show ${option.label} of data`}
                  >
                    {option.label}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
              <p className="mt-4 text-sm leading-7 text-[var(--bber-ink)]/70">
                {visibleCards.length} indicator
                {visibleCards.length === 1 ? "" : "s"} currently visible.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {visibleCards.map((card) => {
          const selectedMetricKey =
            selectedMetrics[card.id] ?? card.defaultMetric;
          const selectedMetric =
            card.metrics.find((metric) => metric.value === selectedMetricKey) ??
            card.metrics[0];
          const visiblePoints = filterPointsByRange(
            selectedMetric.points,
            selectedRange,
          );

          return (
            <IndicatorCard
              key={card.id}
              card={card}
              selectedMetric={selectedMetric}
              visiblePoints={visiblePoints}
              onMetricChange={(nextMetric) =>
                setSelectedMetrics((currentSelections) => ({
                  ...currentSelections,
                  [card.id]: nextMetric,
                }))
              }
            />
          );
        })}
      </div>

      {visibleCards.length === 0 ? (
        <Card className="border border-dashed border-[var(--bber-border)] bg-white py-0 shadow-sm">
          <CardContent className="px-6 py-10">
            <p className="font-display text-2xl text-[var(--bber-red)]">
              No indicators match that search
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--bber-ink)]/78">
              Try a broader term such as labor, housing, energy, or markets.
            </p>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

function IndicatorCard({
  card,
  selectedMetric,
  visiblePoints,
  onMetricChange,
}: {
  card: EconIndicatorCard;
  selectedMetric: EconIndicatorCard["metrics"][number];
  visiblePoints: EconIndicatorLinePoint[];
  onMetricChange: (value: string) => void;
}) {
  const trendSummary = buildIndicatorTrendSummary(
    visiblePoints,
    selectedMetric.label,
    selectedMetric.format,
  );

  return (
    <Card className="border border-[var(--bber-border)] bg-white py-0 shadow-sm">
      <CardHeader className="gap-4 px-6 pt-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--bber-red)]">
              {card.eyebrow}
            </p>
            <CardTitle className="font-display text-3xl text-[var(--bber-red)]">
              {card.title}
            </CardTitle>
            <p className="max-w-2xl text-sm leading-7 text-[var(--bber-ink)]/78">
              {card.description}
            </p>
          </div>

          {card.metrics.length > 1 ? (
            <CompactMetricSelect
              label={`${card.title} metric`}
              value={selectedMetric.value}
              selectedLabel={selectedMetric.label}
              options={card.metrics.map((metric) => ({
                value: metric.value,
                label: metric.label,
              }))}
              onValueChange={onMetricChange}
            />
          ) : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-[var(--bber-border)] bg-[var(--bber-sand)]/55 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--bber-red)]">
              Latest Value
            </p>
            <p className="mt-2 font-display text-3xl text-[var(--bber-ink)]">
              {buildLatestValue(visiblePoints, selectedMetric.format)}
            </p>
          </div>
          <div className="rounded-2xl border border-[var(--bber-border)] bg-[var(--bber-sand)]/55 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--bber-red)]">
              Change
            </p>
            <p className="mt-2 text-sm leading-7 text-[var(--bber-ink)]/80">
              {buildChangeLabel(visiblePoints, selectedMetric.format)}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-5 px-6 pb-6">
        <div className="rounded-xl border border-[var(--bber-border)] bg-[var(--bber-sand)]/40 p-4">
          <p className="text-sm leading-7 text-[var(--bber-ink)]/80">
            {trendSummary}
          </p>
        </div>

        {visiblePoints.length > 0 ? (
          <LineGraph
            ariaLabel={trendSummary}
            data={visiblePoints}
            formatKind={selectedMetric.format}
            yAxisLabel={selectedMetric.yAxisLabel}
          />
        ) : (
          <div className="rounded-xl border border-dashed border-[var(--bber-border)] bg-[var(--bber-sand)]/40 px-5 py-8">
            <p className="font-display text-2xl text-[var(--bber-red)]">
              No published values
            </p>
            <p className="mt-2 text-sm leading-7 text-[var(--bber-ink)]/78">
              The selected metric does not have values in the current time
              window.
            </p>
          </div>
        )}

        <Separator className="bg-[var(--bber-border)]" />

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--bber-red)]">
              Source
            </p>
            <p className="text-sm leading-7 text-[var(--bber-ink)]/78">
              {card.source.source || "Not reported"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--bber-red)]">
              As Of
            </p>
            <p className="text-sm leading-7 text-[var(--bber-ink)]/78">
              {formatExternalAsOfDate(card.source.updatedAt)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--bber-red)]">
              Release Schedule
            </p>
            <p className="text-sm leading-7 text-[var(--bber-ink)]/78">
              {card.source.releaseSchedule || "Not reported"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--bber-red)]">
              Reference Time
            </p>
            <p className="text-sm leading-7 text-[var(--bber-ink)]/78">
              {card.source.referenceTime || "Not reported"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CompactMetricSelect({
  label,
  value,
  selectedLabel,
  options,
  onValueChange,
}: {
  label: string;
  value: string;
  selectedLabel: string;
  options: { value: string; label: string }[];
  onValueChange: (value: string) => void;
}) {
  return (
    <div className="min-w-0 xl:w-[15rem]">
      <Select
        value={value}
        onValueChange={(nextValue) => onValueChange(nextValue ?? value)}
      >
        <SelectTrigger
          aria-label={label}
          size="sm"
          className="h-9 w-full rounded-full border-[var(--bber-border)] bg-white px-3 text-left text-sm text-[var(--bber-ink)]"
        >
          <SelectValue>{selectedLabel}</SelectValue>
        </SelectTrigger>
        <SelectContent className="border border-[var(--bber-border)] bg-white">
          <SelectGroup>
            <SelectLabel>{label}</SelectLabel>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
