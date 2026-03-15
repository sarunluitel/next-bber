"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type {
  ExternalChartOption,
  ExternalChartPageData,
} from "@/content-models/external-bber";
import { BarGraph } from "@/visualizations/charts/external/bar-graph";
import {
  buildExternalTrendSummary,
  formatExternalAsOfDate,
  formatExternalChartMarginOfError,
  formatExternalChartValue,
} from "@/visualizations/formatters/external-chart-formatters";

type ExternalS0801ChartProps = {
  pageData: ExternalChartPageData;
};

export function ExternalS0801Chart({ pageData }: ExternalS0801ChartProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const trendSummary = buildExternalTrendSummary(pageData.chart.points);

  function updateSearchParams(
    nextValues: Partial<ExternalChartPageData["filters"]>,
    options?: { resetArea?: boolean },
  ) {
    const searchParams = new URLSearchParams();
    const nextFilters = {
      ...pageData.filters,
      ...nextValues,
    };

    if (options?.resetArea) {
      nextFilters.area = "";
    }

    if (nextFilters.metric) {
      searchParams.set("metric", nextFilters.metric);
    }

    if (nextFilters.areatype) {
      searchParams.set("areatype", nextFilters.areatype);
    }

    if (nextFilters.area) {
      searchParams.set("area", nextFilters.area);
    }

    if (nextFilters.periodtype) {
      searchParams.set("periodtype", nextFilters.periodtype);
    }

    startTransition(() => {
      router.push(`${pathname}?${searchParams.toString()}`, {
        scroll: false,
      });
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="border border-[var(--bber-border)] bg-white py-0 shadow-sm">
        <CardHeader className="gap-3 px-6 pt-6">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--bber-red)]">
                External API Demo
              </p>
              <CardTitle className="font-display text-3xl text-[var(--bber-red)] sm:text-4xl">
                {pageData.chart.chartTitle}
              </CardTitle>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--bber-ink)]/60">
                {pageData.chart.chartSubtitle}
              </p>
            </div>
            <p className="text-sm font-medium text-[var(--bber-ink)]/65">
              {isPending ? "Updating series..." : "Live BBER REST data"}
            </p>
          </div>
          <p className="max-w-4xl text-base leading-8 text-[var(--bber-ink)]/80">
            {pageData.chart.summary}
          </p>
        </CardHeader>

        <CardContent className="flex flex-col gap-6 px-6 pb-6">
          <div className="grid gap-4 xl:grid-cols-4">
            <FilterField
              label="Metric"
              value={pageData.filters.metric}
              selectedLabel={
                pageData.metricOptions.find(
                  (option) => option.value === pageData.filters.metric,
                )?.label ?? pageData.filters.metric
              }
              options={pageData.metricOptions}
              onValueChange={(metric) => updateSearchParams({ metric })}
            />
            <FilterField
              label="Geography Type"
              value={pageData.filters.areatype}
              selectedLabel={
                pageData.geographyTypeOptions.find(
                  (option) => option.value === pageData.filters.areatype,
                )?.label ?? pageData.filters.areatype
              }
              options={pageData.geographyTypeOptions}
              onValueChange={(areatype) =>
                updateSearchParams({ areatype }, { resetArea: true })
              }
            />
            <FilterField
              label="Geography"
              value={pageData.filters.area}
              selectedLabel={
                pageData.geographyOptions.find(
                  (option) => option.value === pageData.filters.area,
                )?.label ?? pageData.filters.area
              }
              options={pageData.geographyOptions}
              onValueChange={(area) => updateSearchParams({ area })}
            />
            <FilterField
              label="ACS Period"
              value={pageData.filters.periodtype}
              selectedLabel={
                pageData.periodOptions.find(
                  (option) => option.value === pageData.filters.periodtype,
                )?.label ?? pageData.filters.periodtype
              }
              options={pageData.periodOptions}
              onValueChange={(periodtype) => updateSearchParams({ periodtype })}
            />
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-[var(--bber-border)] bg-[var(--bber-sand)]/65 p-4">
              <p className="text-sm font-semibold text-[var(--bber-ink)]">
                Research summary
              </p>
              <p className="mt-2 text-sm leading-7 text-[var(--bber-ink)]/80">
                {trendSummary}
              </p>
            </div>

            {pageData.chart.points.length > 0 ? (
              <BarGraph
                ariaLabel={trendSummary}
                data={pageData.chart.points}
                unit={pageData.chart.unit}
                yAxisLabel={pageData.chart.yAxisLabel}
              />
            ) : (
              <div className="rounded-xl border border-dashed border-[var(--bber-border)] bg-[var(--bber-sand)]/40 px-5 py-8">
                <p className="font-display text-2xl text-[var(--bber-red)]">
                  No Data Available
                </p>
                <p className="mt-2 max-w-3xl text-sm leading-7 text-[var(--bber-ink)]/80">
                  The BBER API returned no published values for this metric,
                  geography, and period combination. Try another geography or
                  ACS period to continue exploring the series.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border border-[var(--bber-border)] bg-white py-0 shadow-sm">
        <CardHeader className="px-6 pt-6">
          <CardTitle className="font-display text-2xl text-[var(--bber-ink)]">
            Data Table
          </CardTitle>
          <p className="text-sm leading-7 text-[var(--bber-ink)]/75">
            A tabular fallback is included so researchers can review the exact
            values alongside the chart.
          </p>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          {pageData.chart.points.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Year</TableHead>
                  <TableHead>Estimate</TableHead>
                  <TableHead>Margin of Error</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageData.chart.points.map((point) => (
                  <TableRow key={`${point.metricKey}-${point.year}`}>
                    <TableCell>{point.yearLabel}</TableCell>
                    <TableCell>
                      {formatExternalChartValue(point.estimate, point.unit)}
                    </TableCell>
                    <TableCell>
                      {formatExternalChartMarginOfError(
                        point.marginOfError,
                        point.unit,
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm leading-7 text-[var(--bber-ink)]/75">
              No values are available to tabulate for this selection.
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="border border-[var(--bber-border)] bg-white py-0 shadow-sm">
        <CardHeader className="px-6 pt-6">
          <CardTitle className="font-display text-2xl text-[var(--bber-ink)]">
            Source and Notes
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 px-6 pb-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <MetadataBlock
              label="Source"
              value={pageData.sourceMetadata.source}
            />
            <MetadataBlock
              label="Table"
              value={`${pageData.sourceMetadata.tableName.toUpperCase()} · ${pageData.sourceMetadata.tableTitle}`}
            />
            <MetadataBlock
              label="As of"
              value={formatExternalAsOfDate(pageData.sourceMetadata.updatedAt)}
            />
            <MetadataBlock
              label="Reference Time"
              value={pageData.sourceMetadata.referenceTime || "Not reported"}
            />
            <MetadataBlock
              label="Release Schedule"
              value={pageData.sourceMetadata.releaseSchedule || "Not reported"}
            />
            <MetadataBlock
              label="Current Selection"
              value={pageData.chart.chartSubtitle}
            />
          </div>

          <Separator className="bg-[var(--bber-border)]" />

          <div className="space-y-3">
            <p className="text-sm leading-7 text-[var(--bber-ink)]/80">
              {pageData.sourceMetadata.tableDescription}
            </p>
            {pageData.sourceMetadata.purpose ? (
              <p className="text-sm leading-7 text-[var(--bber-ink)]/80">
                {pageData.sourceMetadata.purpose}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            {pageData.chart.notes.map((note) => (
              <p
                key={note}
                className="text-sm leading-7 text-[var(--bber-ink)]/75"
              >
                {note}
              </p>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

type FilterFieldProps = {
  label: string;
  value: string;
  selectedLabel: string;
  options: ExternalChartOption[];
  onValueChange: (value: string) => void;
};

function FilterField({
  label,
  value,
  selectedLabel,
  options,
  onValueChange,
}: FilterFieldProps) {
  return (
    <div className="space-y-2">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--bber-red)]">
        {label}
      </span>
      <Select
        value={value}
        onValueChange={(nextValue) => onValueChange(nextValue ?? value)}
      >
        <SelectTrigger
          aria-label={label}
          className="h-11 w-full rounded-md border-[var(--bber-border)] bg-white px-3 text-left text-sm text-[var(--bber-ink)]"
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

function MetadataBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[var(--bber-border)] bg-[var(--bber-sand)]/40 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--bber-red)]">
        {label}
      </p>
      <p className="mt-2 text-sm leading-7 text-[var(--bber-ink)]/80">
        {value}
      </p>
    </div>
  );
}
