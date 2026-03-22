"use client";

import {
  ArrowLeftIcon,
  ChevronDownIcon,
  LoaderCircleIcon,
  RefreshCwIcon,
} from "lucide-react";
import Link from "next/link";
import {
  type ReactNode,
  startTransition,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { BberDbDownloadMenu } from "@/components/site/bberdb-download-menu";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
  areBberDbQueriesEqual,
  type BberDbAppliedQuery,
  type BberDbDataCategory,
  type BberDbFilterDefinition,
  type BberDbFilterModel,
  type BberDbInitialPageData,
  type BberDbTableViewModel,
  getBberDbDatasetCatalogForCategory,
  getBberDbSelectedYearValues,
} from "@/content-models/bberdb";
import { cn } from "@/lib/utils";

type BberDbPageViewProps = {
  pageData: BberDbInitialPageData;
};

type SelectOption = {
  value: string;
  label: string;
};

type JsonApiError = {
  message?: string;
};

async function readJsonApiResponse<T>(url: string) {
  const response = await fetch(url, {
    cache: "no-store",
  });
  const payload = (await response.json().catch(() => null)) as
    | T
    | JsonApiError
    | null;

  if (!response.ok) {
    const message =
      payload && typeof payload === "object" && "message" in payload
        ? payload.message
        : null;

    throw new Error(message || "The BBER data request could not be completed.");
  }

  return payload as T;
}

function buildFiltersHref(tableName: string) {
  return `/api/bberdb/filters?table=${encodeURIComponent(tableName)}`;
}

function buildTableHref(query: BberDbAppliedQuery) {
  const searchParams = new URLSearchParams({
    table: query.table,
  });

  for (const [key, value] of Object.entries(query)) {
    if (key === "table" || !value) {
      continue;
    }

    searchParams.set(key, value);
  }

  return `/api/bberdb/table?${searchParams.toString()}`;
}

function buildErrorMessage(error: unknown) {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return "The BBER data request could not be completed.";
}

function MetadataBanner({
  tone,
  children,
}: {
  tone: "neutral" | "warning";
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border px-4 py-3 text-sm leading-7",
        tone === "warning"
          ? "border-[color:color-mix(in_oklab,var(--bber-red),white_52%)] bg-[color:color-mix(in_oklab,var(--bber-red),white_92%)] text-[var(--bber-ink)]/80"
          : "border-[var(--bber-border)] bg-[var(--bber-sand)] text-[var(--bber-ink)]/76",
      )}
    >
      {children}
    </div>
  );
}

function FilterSelect({
  label,
  value,
  selectedLabel,
  options,
  disabled = false,
  onValueChange,
}: {
  label: string;
  value: string;
  selectedLabel: string;
  options: SelectOption[];
  disabled?: boolean;
  onValueChange: (value: string) => void;
}) {
  return (
    <div className="min-w-0">
      <Select
        value={value}
        onValueChange={(nextValue) => onValueChange(nextValue ?? value)}
      >
        <SelectTrigger
          aria-label={label}
          disabled={disabled}
          className="h-11 w-full rounded-2xl border-[var(--bber-border)] bg-white px-3 text-left text-sm text-[var(--bber-ink)]"
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

function buildSelectedYearSummary(
  selectedOptions: SelectOption[],
  fallbackLabel: string,
) {
  if (selectedOptions.length === 0) {
    return fallbackLabel;
  }

  if (selectedOptions.length <= 2) {
    return selectedOptions.map((option) => option.label).join(", ");
  }

  return `${selectedOptions
    .slice(0, 2)
    .map((option) => option.label)
    .join(", ")} +${String(selectedOptions.length - 2)} more`;
}

function buildNextYearSelection(args: {
  currentValue: string;
  toggledValue: string;
  nextChecked: boolean;
  options: SelectOption[];
}) {
  const selectedValues = new Set(
    getBberDbSelectedYearValues(args.currentValue),
  );

  if (args.nextChecked) {
    selectedValues.add(args.toggledValue);
  } else if (selectedValues.size > 1) {
    selectedValues.delete(args.toggledValue);
  }

  return args.options
    .map((option) => option.value)
    .filter((value) => selectedValues.has(value))
    .join(",");
}

function YearFilterMultiSelect({
  label,
  value,
  options,
  disabled = false,
  onValueChange,
}: {
  label: string;
  value: string;
  options: SelectOption[];
  disabled?: boolean;
  onValueChange: (value: string) => void;
}) {
  const selectedValues = getBberDbSelectedYearValues(value);
  const selectedValueSet = new Set(selectedValues);
  const selectedOptions = options.filter((option) =>
    selectedValueSet.has(option.value),
  );
  const selectedLabel = buildSelectedYearSummary(
    selectedOptions,
    "Select year",
  );

  return (
    <div className="min-w-0">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              type="button"
              variant="outline"
              disabled={disabled}
              className="h-11 w-full justify-between rounded-2xl border-[var(--bber-border)] bg-white px-3 text-left text-sm font-normal text-[var(--bber-ink)] hover:bg-white"
            />
          }
        >
          <span className="truncate">{selectedLabel}</span>
          <ChevronDownIcon data-icon="inline-end" className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="w-72 border border-[var(--bber-border)] bg-white"
        >
          <DropdownMenuGroup>
            <DropdownMenuLabel>{label}</DropdownMenuLabel>
            {options.map((option) => {
              const isSelected = selectedValueSet.has(option.value);

              return (
                <DropdownMenuCheckboxItem
                  key={option.value}
                  checked={isSelected}
                  closeOnClick={false}
                  disabled={isSelected && selectedValues.length === 1}
                  onCheckedChange={(nextChecked) => {
                    onValueChange(
                      buildNextYearSelection({
                        currentValue: value,
                        toggledValue: option.value,
                        nextChecked,
                        options,
                      }),
                    );
                  }}
                >
                  {option.label}
                </DropdownMenuCheckboxItem>
              );
            })}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function findSelectedLabel(
  value: string,
  options: SelectOption[],
  fallbackLabel: string,
) {
  return (
    options.find((option) => option.value === value)?.label ?? fallbackLabel
  );
}

function findFilterSelectedLabel(
  filter: BberDbFilterDefinition,
  selection: BberDbAppliedQuery,
) {
  const selectedValue = selection[filter.key] ?? filter.value ?? "";
  return (
    filter.options.find((option) => option.value === selectedValue)?.label ??
    selectedValue
  );
}

function renderTableHeaderLabel(header: string) {
  const headerLines = header
    .split(" - ")
    .flatMap((segment) => segment.match(/\([^()]+\)|[^()]+/g) ?? [segment])
    .map((segment) => segment.trim())
    .filter((segment) => segment.length > 0);

  if (headerLines.length <= 1) {
    return header;
  }

  return (
    <span className="flex min-w-0 flex-col">
      {headerLines.map((line, lineIndex) => (
        <span
          key={`${header}-${line}-${String(lineIndex)}`}
          className={
            lineIndex === 0
              ? undefined
              : "text-[0.92em] font-normal text-[var(--bber-ink)]/74"
          }
        >
          {line}
        </span>
      ))}
    </span>
  );
}

export function BberDbPageView({ pageData }: BberDbPageViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<BberDbDataCategory>(
    pageData.categoryOptions[0] ?? "All",
  );
  const [draftSelection, setDraftSelection] = useState<BberDbAppliedQuery>(
    pageData.initialFilterModel.draftQuery,
  );
  const [draftFilterModel, setDraftFilterModel] =
    useState<BberDbFilterModel | null>(pageData.initialFilterModel);
  const [appliedSelection, setAppliedSelection] = useState<BberDbAppliedQuery>(
    pageData.initialTableModel.query,
  );
  const [appliedTableModel, setAppliedTableModel] =
    useState<BberDbTableViewModel>(pageData.initialTableModel);
  const [isMetadataLoading, setIsMetadataLoading] = useState(false);
  const [metadataErrorMessage, setMetadataErrorMessage] = useState<
    string | null
  >(pageData.initialMetadataErrorMessage);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [tableErrorMessage, setTableErrorMessage] = useState<string | null>(
    pageData.initialTableErrorMessage,
  );
  const metadataRequestIdRef = useRef(0);
  const tableRequestIdRef = useRef(0);
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
    !isTableLoading &&
    draftFilterModel !== null &&
    metadataErrorMessage === null &&
    draftDiffersFromApplied;

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

      setMetadataErrorMessage(buildErrorMessage(error));
    } finally {
      if (metadataRequestIdRef.current === requestId) {
        setIsMetadataLoading(false);
      }
    }
  }

  async function loadAppliedTable(nextQuery: BberDbAppliedQuery) {
    const requestId = tableRequestIdRef.current + 1;
    tableRequestIdRef.current = requestId;
    setIsTableLoading(true);
    setTableErrorMessage(null);

    try {
      const nextTableModel = await readJsonApiResponse<BberDbTableViewModel>(
        buildTableHref(nextQuery),
      );

      if (tableRequestIdRef.current !== requestId) {
        return;
      }

      startTransition(() => {
        setAppliedSelection(nextTableModel.query);
        setAppliedTableModel(nextTableModel);
      });
    } catch (error) {
      if (tableRequestIdRef.current !== requestId) {
        return;
      }

      setTableErrorMessage(buildErrorMessage(error));
    } finally {
      if (tableRequestIdRef.current === requestId) {
        setIsTableLoading(false);
      }
    }
  }

  useEffect(() => {
    if (
      didAttemptInitialRecoveryRef.current ||
      (!pageData.initialMetadataErrorMessage &&
        !pageData.initialTableErrorMessage)
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

        const nextTableRequestId = tableRequestIdRef.current + 1;
        tableRequestIdRef.current = nextTableRequestId;
        setIsTableLoading(true);
        setTableErrorMessage(null);

        try {
          const nextTableModel =
            await readJsonApiResponse<BberDbTableViewModel>(
              buildTableHref(nextFilterModel.draftQuery),
            );

          if (tableRequestIdRef.current !== nextTableRequestId) {
            return;
          }

          startTransition(() => {
            setAppliedSelection(nextTableModel.query);
            setAppliedTableModel(nextTableModel);
          });
        } catch (error) {
          if (tableRequestIdRef.current !== nextTableRequestId) {
            return;
          }

          setTableErrorMessage(buildErrorMessage(error));
        } finally {
          if (tableRequestIdRef.current === nextTableRequestId) {
            setIsTableLoading(false);
          }
        }
      } catch (error) {
        if (metadataRequestIdRef.current !== requestId) {
          return;
        }

        setDraftFilterModel(null);
        setMetadataErrorMessage(buildErrorMessage(error));
      } finally {
        if (metadataRequestIdRef.current === requestId) {
          setIsMetadataLoading(false);
        }
      }
    })();
  }, [
    draftSelection.table,
    pageData.initialMetadataErrorMessage,
    pageData.initialTableErrorMessage,
  ]);

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

  async function handleLoadTable() {
    await loadAppliedTable(draftSelection);
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
                {appliedTableModel.datasetLabel} is currently loaded for{" "}
                {appliedTableModel.resultTitle}.
              </p>
            </CardHeader>
            <CardContent className="grid gap-4 px-6 pb-6 sm:grid-cols-2">
              <div className="rounded-2xl border border-[var(--bber-border)] bg-[var(--bber-sand)]/65 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--bber-red)]">
                  Table
                </p>
                <p className="mt-2 font-display text-2xl text-[var(--bber-ink)]">
                  {appliedTableModel.tableName}
                </p>
                <p className="mt-1 text-sm leading-7 text-[var(--bber-ink)]/72">
                  {appliedTableModel.rawRowCount.toLocaleString("en-US")} row
                  {appliedTableModel.rawRowCount === 1 ? "" : "s"} loaded
                </p>
              </div>
              <div className="rounded-2xl border border-[var(--bber-border)] bg-[var(--bber-sand)]/65 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--bber-red)]">
                  Source
                </p>
                <p className="mt-2 text-sm leading-7 text-[var(--bber-ink)]/80">
                  {appliedTableModel.sourceLine}
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
                Change categories, datasets, and metadata filters here. The
                loaded table below stays in place until you click Load.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <BberDbDownloadMenu
                appliedQuery={appliedSelection}
                draftQuery={draftSelection}
                canDownloadDraft={
                  draftFilterModel !== null && !isMetadataLoading
                }
                disabled={isTableLoading}
                draftUnavailableMessage={metadataErrorMessage}
              />
              <Button
                type="button"
                variant="default"
                disabled={!canLoadDraft}
                className="h-9 rounded-full bg-[var(--bber-red)] px-4 text-white hover:bg-[color:color-mix(in_oklab,var(--bber-red),black_8%)]"
                onClick={() => {
                  void handleLoadTable();
                }}
              >
                {isTableLoading ? (
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
              Your updated selections are ready. Select Load to refresh the
              table below.
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
                Loaded Table
              </p>
              <CardTitle className="font-display text-3xl text-[var(--bber-red)]">
                {appliedTableModel.resultTitle}
              </CardTitle>
              <p className="max-w-4xl text-sm leading-7 text-[var(--bber-ink)]/76">
                {appliedTableModel.description}
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--bber-border)] bg-[var(--bber-sand)]/65 px-4 py-3 text-sm leading-7 text-[var(--bber-ink)]/78">
              <p className="font-medium text-[var(--bber-ink)]">
                {appliedTableModel.datasetLabel}
              </p>
              <p>{appliedTableModel.sourceLine}</p>
            </div>
          </div>

          {tableErrorMessage ? (
            <MetadataBanner tone="warning">{tableErrorMessage}</MetadataBanner>
          ) : null}
          {isTableLoading ? (
            <MetadataBanner tone="neutral">
              Loading the updated table. The current results will remain visible
              until the refreshed table is ready.
            </MetadataBanner>
          ) : null}
        </CardHeader>

        <CardContent className="space-y-5 px-0 pb-6">
          <Separator className="bg-[var(--bber-border)]" />
          {appliedTableModel.rows.length > 0 ? (
            <div className="overflow-x-auto px-6">
              <Table className="min-w-max">
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    {appliedTableModel.columns.map((column) => (
                      <TableHead
                        key={column.key}
                        title={column.description ?? undefined}
                        className="min-w-[8rem] whitespace-normal bg-[var(--bber-sand)]/65 align-top text-[var(--bber-ink)]"
                      >
                        {renderTableHeaderLabel(column.header)}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appliedTableModel.rows.map((row) => (
                    <TableRow key={row.id}>
                      {appliedTableModel.columns.map((column, columnIndex) => (
                        <TableCell key={`${row.id}-${column.key}`}>
                          {row.cells[columnIndex]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="px-6">
              <div className="rounded-2xl border border-dashed border-[var(--bber-border)] bg-[var(--bber-sand)] px-5 py-8 text-sm leading-7 text-[var(--bber-ink)]/76">
                No rows were returned for the selected filters.
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
