"use client";

import {
  ArrowLeftIcon,
  LoaderCircleIcon,
  RefreshCwIcon,
  SearchIcon,
} from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { startTransition, useEffect, useMemo, useRef, useState } from "react";
import {
  buildErrorMessage,
  FilterSelect,
  findFilterSelectedLabel,
  findSelectedLabel,
  MetadataBanner,
  readJsonApiResponse,
  YearFilterMultiSelect,
} from "@/components/site/bber-data-bank-controls";
import { RgisDownloadMenu } from "@/components/site/rgis-download-menu";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  areBberDbQueriesEqual,
  type BberDbAppliedQuery,
  type BberDbDataCategory,
  type BberDbFilterModel,
  getBberDbDatasetCatalogForCategory,
} from "@/content-models/bberdb";
import {
  buildRgisResultTitle,
  type RgisFeatureSummary,
  type RgisInitialPageData,
  type RgisMapViewModel,
} from "@/content-models/rgis";

const RgisLeafletMap = dynamic(
  () =>
    import("@/components/site/rgis-leaflet-map").then(
      (module) => module.RgisLeafletMap,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="overflow-hidden rounded-[1.75rem] border border-[var(--bber-border)] bg-white p-4">
        <Skeleton className="min-h-[26rem] w-full rounded-[1.5rem] lg:min-h-[44rem]" />
      </div>
    ),
  },
);

type RgisPageViewProps = {
  pageData: RgisInitialPageData;
};

function buildFiltersHref(tableName: string) {
  return `/api/rgis/filters?table=${encodeURIComponent(tableName)}`;
}

function buildMapHref(query: BberDbAppliedQuery) {
  const searchParams = new URLSearchParams({
    table: query.table,
  });

  for (const [key, value] of Object.entries(query)) {
    if (key === "table" || !value) {
      continue;
    }

    searchParams.set(key, value);
  }

  return `/api/rgis/map?${searchParams.toString()}`;
}

function buildDisplayedFeature(
  mapModel: RgisMapViewModel,
  activeYear: string,
  hoveredFeatureId: string | null,
  pinnedFeatureId: string | null,
) {
  const activeFrame =
    mapModel.yearFrames.find((frame) => frame.year === activeYear) ??
    mapModel.yearFrames[0] ??
    null;

  if (!activeFrame) {
    return null;
  }

  if (pinnedFeatureId) {
    const pinnedFeature = activeFrame.featureSummaries.find(
      (feature) => feature.id === pinnedFeatureId,
    );

    if (pinnedFeature) {
      return pinnedFeature;
    }
  }

  if (hoveredFeatureId) {
    const hoveredFeature = activeFrame.featureSummaries.find(
      (feature) => feature.id === hoveredFeatureId,
    );

    if (hoveredFeature) {
      return hoveredFeature;
    }
  }

  return activeFrame.featureSummaries[0] ?? null;
}

function MetricRow({
  feature,
  metricKey,
  label,
  helperBreadcrumbs,
}: {
  feature: RgisFeatureSummary | null;
  metricKey: string;
  label: string;
  helperBreadcrumbs: string[];
}) {
  const metricValue = feature?.metricValues[metricKey];

  return (
    <label
      htmlFor={metricKey}
      className="grid cursor-pointer grid-cols-[1rem_minmax(0,1fr)_auto] items-start gap-3 border-b border-[var(--bber-border)] px-4 py-4 hover:bg-[var(--bber-sand)]/42"
    >
      <RadioGroupItem id={metricKey} value={metricKey} />
      <div className="min-w-0 space-y-1">
        <p className="text-sm leading-7 text-[var(--bber-ink)]">{label}</p>
        {helperBreadcrumbs.length > 0 ? (
          <p className="text-xs leading-6 text-[var(--bber-ink)]/58">
            {helperBreadcrumbs.join("  >  ")}
          </p>
        ) : null}
      </div>
      <p className="text-right text-sm leading-7 text-[var(--bber-ink)]/82">
        {metricValue?.displayValue ?? ""}
      </p>
    </label>
  );
}

export function RgisPageView({ pageData }: RgisPageViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<BberDbDataCategory>(
    pageData.categoryOptions[0] ?? "All",
  );
  const [draftSelection, setDraftSelection] = useState<BberDbAppliedQuery>(
    pageData.initialFilterModel.draftQuery,
  );
  const [draftFilterModel, setDraftFilterModel] =
    useState<BberDbFilterModel | null>(pageData.initialFilterModel);
  const [appliedSelection, setAppliedSelection] = useState<BberDbAppliedQuery>(
    pageData.initialMapModel.query,
  );
  const [appliedMapModel, setAppliedMapModel] = useState<RgisMapViewModel>(
    pageData.initialMapModel,
  );
  const [activeYear, setActiveYear] = useState(
    pageData.initialMapModel.activeYear,
  );
  const [selectedMetricKey, setSelectedMetricKey] = useState<string | null>(
    pageData.initialMapModel.defaultMetricKey,
  );
  const [hoveredFeatureId, setHoveredFeatureId] = useState<string | null>(null);
  const [pinnedFeatureId, setPinnedFeatureId] = useState<string | null>(null);
  const [metricSearchQuery, setMetricSearchQuery] = useState("");
  const [isMetadataLoading, setIsMetadataLoading] = useState(false);
  const [metadataErrorMessage, setMetadataErrorMessage] = useState<
    string | null
  >(pageData.initialMetadataErrorMessage);
  const [isMapLoading, setIsMapLoading] = useState(false);
  const [mapErrorMessage, setMapErrorMessage] = useState<string | null>(
    pageData.initialMapErrorMessage,
  );
  const metadataRequestIdRef = useRef(0);
  const mapRequestIdRef = useRef(0);
  const didAttemptInitialRecoveryRef = useRef(false);
  const visibleDatasetCatalog = useMemo(
    () => getBberDbDatasetCatalogForCategory(selectedCategory),
    [selectedCategory],
  );
  const datasetOptions = visibleDatasetCatalog.map((entry) => ({
    value: entry.tableName,
    label: entry.label,
  }));
  const selectedDatasetLabel = findSelectedLabel(
    draftSelection.table,
    datasetOptions,
    draftSelection.table,
  );
  const draftDiffersFromApplied = !areBberDbQueriesEqual(
    draftSelection,
    appliedSelection,
  );
  const canLoadDraft =
    !isMetadataLoading &&
    !isMapLoading &&
    draftFilterModel !== null &&
    metadataErrorMessage === null &&
    draftDiffersFromApplied;
  const activeFrame =
    appliedMapModel.yearFrames.find((frame) => frame.year === activeYear) ??
    appliedMapModel.yearFrames[0] ??
    null;
  const displayedFeature = buildDisplayedFeature(
    appliedMapModel,
    activeYear,
    hoveredFeatureId,
    pinnedFeatureId,
  );
  const visibleMetricOptions = appliedMapModel.metricOptions.filter(
    (metric) => {
      if (metricSearchQuery.trim().length === 0) {
        return true;
      }

      const normalizedSearchQuery = metricSearchQuery.toLowerCase();
      const searchableText = [
        metric.label,
        metric.description ?? "",
        ...metric.helperBreadcrumbs,
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedSearchQuery);
    },
  );
  const selectedMetricLabel =
    appliedMapModel.metricOptions.find(
      (metricOption) => metricOption.key === selectedMetricKey,
    )?.label ?? null;

  async function refreshDraftFilterModel(nextTableName: string) {
    const requestId = metadataRequestIdRef.current + 1;
    metadataRequestIdRef.current = requestId;
    setIsMetadataLoading(true);
    setMetadataErrorMessage(null);
    setDraftFilterModel(null);
    setDraftSelection({ table: nextTableName });

    try {
      const nextFilterModel = await readJsonApiResponse<BberDbFilterModel>(
        buildFiltersHref(nextTableName),
      );

      if (metadataRequestIdRef.current !== requestId) {
        return;
      }

      startTransition(() => {
        setDraftFilterModel(nextFilterModel);
        setDraftSelection(nextFilterModel.draftQuery);
      });
    } catch (error) {
      if (metadataRequestIdRef.current !== requestId) {
        return;
      }

      setMetadataErrorMessage(
        buildErrorMessage(
          error,
          "The RGIS filter request could not be completed.",
        ),
      );
    } finally {
      if (metadataRequestIdRef.current === requestId) {
        setIsMetadataLoading(false);
      }
    }
  }

  async function loadAppliedMap(nextQuery: BberDbAppliedQuery) {
    const requestId = mapRequestIdRef.current + 1;
    mapRequestIdRef.current = requestId;
    setIsMapLoading(true);
    setMapErrorMessage(null);

    try {
      const nextMapModel = await readJsonApiResponse<RgisMapViewModel>(
        buildMapHref(nextQuery),
      );

      if (mapRequestIdRef.current !== requestId) {
        return;
      }

      startTransition(() => {
        setAppliedSelection(nextMapModel.query);
        setAppliedMapModel(nextMapModel);
        setActiveYear(nextMapModel.activeYear);
        setSelectedMetricKey(nextMapModel.defaultMetricKey);
        setHoveredFeatureId(null);
        setPinnedFeatureId(null);
      });
    } catch (error) {
      if (mapRequestIdRef.current !== requestId) {
        return;
      }

      setMapErrorMessage(
        buildErrorMessage(
          error,
          "The RGIS map request could not be completed.",
        ),
      );
    } finally {
      if (mapRequestIdRef.current === requestId) {
        setIsMapLoading(false);
      }
    }
  }

  useEffect(() => {
    if (
      didAttemptInitialRecoveryRef.current ||
      (!pageData.initialMetadataErrorMessage &&
        !pageData.initialMapErrorMessage)
    ) {
      return;
    }

    didAttemptInitialRecoveryRef.current = true;

    void (async () => {
      const requestId = metadataRequestIdRef.current + 1;
      metadataRequestIdRef.current = requestId;
      setIsMetadataLoading(true);
      setMetadataErrorMessage(null);

      try {
        const nextFilterModel = await readJsonApiResponse<BberDbFilterModel>(
          buildFiltersHref(draftSelection.table),
        );

        if (metadataRequestIdRef.current !== requestId) {
          return;
        }

        startTransition(() => {
          setDraftFilterModel(nextFilterModel);
          setDraftSelection(nextFilterModel.draftQuery);
        });

        const nextMapRequestId = mapRequestIdRef.current + 1;
        mapRequestIdRef.current = nextMapRequestId;
        setIsMapLoading(true);
        setMapErrorMessage(null);

        try {
          const nextMapModel = await readJsonApiResponse<RgisMapViewModel>(
            buildMapHref(nextFilterModel.draftQuery),
          );

          if (mapRequestIdRef.current !== nextMapRequestId) {
            return;
          }

          startTransition(() => {
            setAppliedSelection(nextMapModel.query);
            setAppliedMapModel(nextMapModel);
            setActiveYear(nextMapModel.activeYear);
            setSelectedMetricKey(nextMapModel.defaultMetricKey);
          });
        } catch (error) {
          if (mapRequestIdRef.current !== nextMapRequestId) {
            return;
          }

          setMapErrorMessage(
            buildErrorMessage(
              error,
              "The RGIS map request could not be completed.",
            ),
          );
        } finally {
          if (mapRequestIdRef.current === nextMapRequestId) {
            setIsMapLoading(false);
          }
        }
      } catch (error) {
        if (metadataRequestIdRef.current !== requestId) {
          return;
        }

        setDraftFilterModel(null);
        setMetadataErrorMessage(
          buildErrorMessage(
            error,
            "The RGIS filter request could not be completed.",
          ),
        );
      } finally {
        if (metadataRequestIdRef.current === requestId) {
          setIsMetadataLoading(false);
        }
      }
    })();
  }, [
    draftSelection.table,
    pageData.initialMapErrorMessage,
    pageData.initialMetadataErrorMessage,
  ]);

  useEffect(() => {
    const normalizedActiveYear =
      appliedMapModel.yearFrames.find((frame) => frame.year === activeYear)
        ?.year ?? appliedMapModel.activeYear;

    if (normalizedActiveYear !== activeYear) {
      setActiveYear(normalizedActiveYear);
    }

    setHoveredFeatureId(null);
    setPinnedFeatureId(null);
  }, [activeYear, appliedMapModel]);

  function handleCategoryChange(nextCategory: string) {
    const normalizedCategory = nextCategory as BberDbDataCategory;
    const nextDatasetCatalog =
      getBberDbDatasetCatalogForCategory(normalizedCategory);

    setSelectedCategory(normalizedCategory);

    if (
      nextDatasetCatalog.some(
        (entry) => entry.tableName === draftSelection.table,
      )
    ) {
      return;
    }

    const nextTableName = nextDatasetCatalog[0]?.tableName;

    if (nextTableName) {
      void refreshDraftFilterModel(nextTableName);
    }
  }

  function handleDatasetChange(nextTableName: string) {
    if (nextTableName === draftSelection.table && draftFilterModel) {
      return;
    }

    void refreshDraftFilterModel(nextTableName);
  }

  function handleDraftFilterChange(filterKey: string, nextValue: string) {
    setDraftSelection((currentSelection) => ({
      ...currentSelection,
      [filterKey]: nextValue,
    }));
    setDraftFilterModel((currentModel) => {
      if (!currentModel) {
        return currentModel;
      }

      return {
        ...currentModel,
        draftQuery: {
          ...currentModel.draftQuery,
          [filterKey]: nextValue,
        },
        filters: currentModel.filters.map((filter) =>
          filter.key === filterKey ? { ...filter, value: nextValue } : filter,
        ),
      };
    });
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="overflow-hidden rounded-[2rem] border border-[var(--bber-border)] bg-[radial-gradient(circle_at_top_left,rgba(186,12,47,0.14),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(173,133,61,0.18),transparent_30%),linear-gradient(135deg,#fff_0%,#f7f2ea_48%,#eddcc4_100%)]">
        <div className="grid gap-8 px-6 py-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(17rem,0.85fr)] lg:px-8 lg:py-10">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--bber-red)]">
              Data Portal
            </p>
            <h1 className="font-display text-4xl text-[var(--bber-red)] sm:text-5xl">
              {pageData.pageContent.title}
            </h1>
            <p className="max-w-4xl text-base leading-8 text-[var(--bber-ink)]/80">
              {pageData.pageContent.lead}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href={pageData.pageContent.backHref}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--bber-border)] bg-white/90 px-4 py-2 text-sm font-medium text-[var(--bber-ink)] transition-colors hover:border-[var(--bber-red)] hover:text-[var(--bber-red)]"
              >
                <ArrowLeftIcon className="size-4" />
                Back to Data
              </Link>
              <Link
                href={pageData.pageContent.documentationHref}
                className="inline-flex items-center rounded-full border border-[var(--bber-border)] bg-transparent px-4 py-2 text-sm font-medium text-[var(--bber-red)] transition-colors hover:border-[var(--bber-red)] hover:bg-white/70"
              >
                API Documentation
              </Link>
            </div>
          </div>

          <Card className="border border-[var(--bber-border)]/80 bg-white/88 py-0 shadow-sm backdrop-blur">
            <CardHeader className="gap-3 px-6 pt-6">
              <CardTitle className="font-display text-2xl text-[var(--bber-ink)]">
                Loaded Result
              </CardTitle>
              <p className="text-sm leading-7 text-[var(--bber-ink)]/74">
                {appliedMapModel.datasetLabel} is currently loaded for{" "}
                {buildRgisResultTitle(activeFrame?.featureSummaries ?? [])}.
              </p>
            </CardHeader>
            <CardContent className="grid gap-4 px-6 pb-6 sm:grid-cols-2">
              <div className="rounded-2xl border border-[var(--bber-border)] bg-[var(--bber-sand)]/65 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--bber-red)]">
                  Geography
                </p>
                <p className="mt-2 font-display text-2xl text-[var(--bber-ink)]">
                  {activeFrame?.featureSummaries.length.toLocaleString(
                    "en-US",
                  ) ?? "0"}
                </p>
                <p className="mt-1 text-sm leading-7 text-[var(--bber-ink)]/72">
                  geograph
                  {activeFrame?.featureSummaries.length === 1 ? "y" : "ies"}{" "}
                  loaded
                </p>
              </div>
              <div className="rounded-2xl border border-[var(--bber-border)] bg-[var(--bber-sand)]/65 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--bber-red)]">
                  Source
                </p>
                <p className="mt-2 text-sm leading-7 text-[var(--bber-ink)]/80">
                  {appliedMapModel.sourceLine}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="border border-[var(--bber-border)] bg-white py-0 shadow-sm">
        <CardHeader className="gap-4 px-6 pt-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-2">
              <CardTitle className="font-display text-3xl text-[var(--bber-red)]">
                Select Data
              </CardTitle>
              <p className="max-w-4xl text-sm leading-7 text-[var(--bber-ink)]/76">
                Change categories, datasets, and map filters here. The loaded
                map and data panel stay in place until you click Load.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <RgisDownloadMenu
                appliedQuery={appliedSelection}
                draftQuery={draftSelection}
                canDownloadDraft={
                  draftFilterModel !== null && !isMetadataLoading
                }
                disabled={isMapLoading}
                draftUnavailableMessage={metadataErrorMessage}
              />
              <Button
                type="button"
                variant="default"
                disabled={!canLoadDraft}
                className="h-9 rounded-full bg-[var(--bber-red)] px-4 text-white hover:bg-[color:color-mix(in_oklab,var(--bber-red),black_8%)]"
                onClick={() => {
                  void loadAppliedMap(draftSelection);
                }}
              >
                {isMapLoading ? (
                  <LoaderCircleIcon className="size-4 animate-spin" />
                ) : (
                  <RefreshCwIcon className="size-4" />
                )}
                Load
              </Button>
            </div>
          </div>

          {metadataErrorMessage ? (
            <MetadataBanner tone="warning">
              {metadataErrorMessage}
            </MetadataBanner>
          ) : null}
          {isMetadataLoading ? (
            <MetadataBanner tone="neutral">
              Loading available filters for {selectedDatasetLabel}.
            </MetadataBanner>
          ) : null}
          {!isMetadataLoading &&
          !metadataErrorMessage &&
          draftDiffersFromApplied ? (
            <MetadataBanner tone="neutral">
              Your updated selections are ready. Select Load to refresh the map
              and panel below.
            </MetadataBanner>
          ) : null}
        </CardHeader>

        <CardContent className="grid gap-4 px-6 pb-6 md:grid-cols-2 xl:grid-cols-4">
          <FilterSelect
            label="Data Category"
            value={selectedCategory}
            selectedLabel={selectedCategory}
            options={pageData.categoryOptions.map((categoryOption) => ({
              value: categoryOption,
              label: categoryOption,
            }))}
            onValueChange={handleCategoryChange}
          />

          <FilterSelect
            label="Select Data"
            value={draftSelection.table}
            selectedLabel={selectedDatasetLabel}
            options={datasetOptions}
            onValueChange={handleDatasetChange}
          />

          {draftFilterModel?.filters.map((filter) => {
            const selectedValue = draftSelection[filter.key] ?? filter.value;

            if (filter.key === "periodyear") {
              return (
                <YearFilterMultiSelect
                  key={filter.key}
                  label={filter.label}
                  value={selectedValue}
                  options={filter.options}
                  disabled={isMetadataLoading}
                  onValueChange={(nextValue) =>
                    handleDraftFilterChange(filter.key, nextValue)
                  }
                />
              );
            }

            return (
              <FilterSelect
                key={filter.key}
                label={filter.label}
                value={selectedValue}
                selectedLabel={findFilterSelectedLabel(filter, draftSelection)}
                options={filter.options}
                disabled={isMetadataLoading}
                onValueChange={(nextValue) =>
                  handleDraftFilterChange(filter.key, nextValue)
                }
              />
            );
          })}
        </CardContent>
      </Card>

      <Card className="border border-[var(--bber-border)] bg-white py-0 shadow-sm">
        <CardHeader className="gap-4 px-6 pt-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--bber-red)]">
                Loaded Map
              </p>
              <CardTitle className="font-display text-3xl text-[var(--bber-red)]">
                {buildRgisResultTitle(activeFrame?.featureSummaries ?? [])}
              </CardTitle>
              <p className="max-w-4xl text-sm leading-7 text-[var(--bber-ink)]/76">
                {appliedMapModel.description}
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--bber-border)] bg-[var(--bber-sand)]/65 px-4 py-3 text-sm leading-7 text-[var(--bber-ink)]/78">
              <p className="font-medium text-[var(--bber-ink)]">
                {appliedMapModel.datasetLabel}
              </p>
              <p>{appliedMapModel.sourceLine}</p>
            </div>
          </div>

          {mapErrorMessage ? (
            <MetadataBanner tone="warning">{mapErrorMessage}</MetadataBanner>
          ) : null}
          {isMapLoading ? (
            <MetadataBanner tone="neutral">
              Loading the updated map. The current map and panel will remain
              visible until the refreshed results are ready.
            </MetadataBanner>
          ) : null}
        </CardHeader>

        <CardContent className="space-y-5 px-0 pb-6">
          <Separator className="bg-[var(--bber-border)]" />

          {appliedMapModel.availableYears.length > 1 ? (
            <div className="px-6">
              <div className="flex flex-col gap-3 rounded-2xl border border-[var(--bber-border)] bg-[var(--bber-sand)]/48 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--bber-red)]">
                  Active Year
                </p>
                <ToggleGroup
                  value={activeYear ? [activeYear] : []}
                  onValueChange={(nextYears) => {
                    const nextYear = Array.isArray(nextYears)
                      ? nextYears[0]
                      : null;

                    if (typeof nextYear === "string" && nextYear.length > 0) {
                      setActiveYear(nextYear);
                    }
                  }}
                  spacing={8}
                >
                  {appliedMapModel.availableYears.map((year) => (
                    <ToggleGroupItem
                      key={year}
                      value={year}
                      variant="outline"
                      className="rounded-full border-[var(--bber-border)] bg-white px-4 font-semibold text-[var(--bber-ink)] shadow-sm transition-[color,background-color,border-color,box-shadow,transform] hover:bg-white"
                      style={
                        activeYear === year
                          ? {
                              backgroundColor: "var(--bber-red)",
                              borderColor: "var(--bber-red)",
                              color: "white",
                              boxShadow:
                                "0 0 0 4px color-mix(in srgb, var(--bber-red) 16%, transparent), 0 10px 24px -16px var(--bber-red)",
                              transform: "scale(1.03)",
                            }
                          : undefined
                      }
                      aria-label={`Show ${year} RGIS map`}
                    >
                      {year}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>
            </div>
          ) : null}

          <div className="grid gap-6 px-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(22rem,0.9fr)]">
            <div className="space-y-4">
              <RgisLeafletMap
                yearFrame={activeFrame}
                activeMetricKey={selectedMetricKey}
                activeMetricLabel={selectedMetricLabel}
                highlightedFeatureId={hoveredFeatureId}
                pinnedFeatureId={pinnedFeatureId}
                onHoverFeature={(featureId) => {
                  if (pinnedFeatureId) {
                    return;
                  }

                  setHoveredFeatureId(featureId);
                }}
                onPinFeature={(featureId) => {
                  setPinnedFeatureId((currentFeatureId) =>
                    currentFeatureId === featureId ? null : featureId,
                  );
                  setHoveredFeatureId(null);
                }}
              />
            </div>

            <div className="min-w-0">
              <Card className="border border-[var(--bber-border)] bg-[var(--bber-sand)]/24 py-0 shadow-none">
                <CardHeader className="gap-4 px-5 pt-5">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--bber-red)]">
                      Geography Summary
                    </p>
                    <CardTitle className="font-display text-2xl text-[var(--bber-ink)]">
                      {displayedFeature?.name ?? "No geography loaded"}
                    </CardTitle>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {(displayedFeature?.summaryFields ?? []).map((field) => (
                      <div
                        key={field.key}
                        className="rounded-2xl border border-[var(--bber-border)] bg-white px-4 py-3"
                      >
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--bber-red)]">
                          {field.label}
                        </p>
                        <p className="mt-1 text-sm leading-7 text-[var(--bber-ink)]/82">
                          {field.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="relative">
                    <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--bber-ink)]/48" />
                    <Input
                      value={metricSearchQuery}
                      onChange={(event) =>
                        setMetricSearchQuery(event.target.value)
                      }
                      placeholder="Search metrics"
                      className="h-11 rounded-2xl border-[var(--bber-border)] bg-white pl-9"
                    />
                  </div>
                </CardHeader>

                <CardContent className="px-0 pb-0">
                  <ScrollArea className="h-[32rem] rounded-b-[inherit]">
                    {visibleMetricOptions.length > 0 ? (
                      <RadioGroup
                        value={selectedMetricKey ?? ""}
                        onValueChange={(nextValue) =>
                          setSelectedMetricKey(nextValue)
                        }
                        className="gap-0"
                      >
                        {visibleMetricOptions.map((metricOption) => (
                          <MetricRow
                            key={metricOption.key}
                            feature={displayedFeature}
                            metricKey={metricOption.key}
                            label={metricOption.label}
                            helperBreadcrumbs={metricOption.helperBreadcrumbs}
                          />
                        ))}
                      </RadioGroup>
                    ) : (
                      <div className="px-5 py-8 text-sm leading-7 text-[var(--bber-ink)]/72">
                        No metrics matched your search.
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
