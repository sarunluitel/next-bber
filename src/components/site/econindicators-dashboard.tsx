"use client";

import {
  CopyIcon,
  DatabaseIcon,
  DownloadIcon,
  ExternalLinkIcon,
  FileJsonIcon,
  FileSpreadsheetIcon,
  SearchIcon,
} from "lucide-react";
import { useDeferredValue, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
} from "@/content-models/econindicators";
import { cn } from "@/lib/utils";
import type { ValueFormatKind } from "@/visualizations/chart-contracts";
import { LineGraph } from "@/visualizations/charts/external/line-graph";
import {
  buildTimeSeriesTrendSummary,
  formatExternalAsOfDate,
  formatTimeSeriesValue,
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
  format: ValueFormatKind,
) {
  const latestPoint = points[points.length - 1];
  return latestPoint
    ? formatTimeSeriesValue(latestPoint.value, format, true)
    : "Not reported";
}

function buildChangeLabel(
  points: EconIndicatorLinePoint[],
  format: ValueFormatKind,
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

  return `${direction === "up" ? "Up" : "Down"} ${formatTimeSeriesValue(Math.abs(difference), format, true)} from previous observation`;
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
              New Mexico Data
            </p>
            <h1 className="font-display text-4xl text-[var(--bber-red)] sm:text-5xl">
              NM Economic Indicators
            </h1>
            <p className="max-w-4xl text-base leading-8 text-[var(--bber-ink)]/80">
              Track labor market conditions, energy activity, construction, air
              traffic, and financial indicators in one view. Use the search
              field, metric controls, and date range selector to focus on the
              measures most relevant to your analysis.
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
                Choose the period shown across the indicator panels.
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
                {visibleCards.length === 1 ? "" : "s"} shown.
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
  const trendSummary = buildTimeSeriesTrendSummary(
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

          <div className="flex flex-wrap items-center gap-3">
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

            <ChartDownloadMenu card={card} />
          </div>
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
              No values are available for this measure in the selected period.
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

function ChartDownloadMenu({ card }: { card: EconIndicatorCard }) {
  const [isApiDialogOpen, setIsApiDialogOpen] = useState(false);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied">("idle");
  const jsonDownloadUrl = `/api/econindicators/${card.id}/download?format=json`;
  const csvDownloadUrl = `/api/econindicators/${card.id}/download?format=csv`;

  async function handleCopyApiLink() {
    await navigator.clipboard.writeText(card.apiUrl);
    setCopyStatus("copied");

    window.setTimeout(() => {
      setCopyStatus("idle");
    }, 1500);
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="outline" size="sm" className="rounded-full" />
          }
        >
          <DownloadIcon data-icon="inline-start" />
          Download
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-56 rounded-xl border border-[var(--bber-border)] bg-white"
        >
          <DropdownMenuGroup>
            <DropdownMenuLabel>Data Download</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setIsApiDialogOpen(true)}>
              <DatabaseIcon />
              API
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => window.location.assign(jsonDownloadUrl)}
            >
              <FileJsonIcon />
              JSON Data
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => window.location.assign(csvDownloadUrl)}
            >
              <FileSpreadsheetIcon />
              CSV Data (Excel)
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isApiDialogOpen} onOpenChange={setIsApiDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>API Endpoint</DialogTitle>
            <DialogDescription>
              Use this endpoint in your own workflow to retrieve the source data
              behind this chart.
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-2xl border border-[var(--bber-border)] bg-[var(--bber-sand)]/35 p-4">
            <code className="block overflow-x-auto whitespace-pre-wrap break-all text-sm leading-7 text-[var(--bber-ink)]">
              {card.apiUrl}
            </code>
          </div>

          <DialogFooter showCloseButton>
            <Button variant="outline" onClick={handleCopyApiLink}>
              <CopyIcon data-icon="inline-start" />
              {copyStatus === "copied" ? "Copied" : "Copy Link"}
            </Button>
            <Button
              onClick={() =>
                window.open(card.apiUrl, "_blank", "noopener,noreferrer")
              }
            >
              <ExternalLinkIcon data-icon="inline-start" />
              Open Endpoint
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
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
