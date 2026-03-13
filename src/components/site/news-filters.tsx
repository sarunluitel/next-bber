"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  BberNewsFilters,
  BberNewsIndexes,
} from "@/content-models/bber-news";

const ALL_FILTER_VALUE = "__all__";

type NewsFiltersProps = {
  filters: BberNewsFilters;
  indexes: BberNewsIndexes;
  searchPlaceholder: string;
};

function toSelectValue(value: string) {
  return value || ALL_FILTER_VALUE;
}

function fromSelectValue(value: string) {
  return value === ALL_FILTER_VALUE ? "" : value;
}

export function NewsFilters({
  filters,
  indexes,
  searchPlaceholder,
}: NewsFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [selectedYear, setSelectedYear] = useState(filters.year);
  const [selectedMonth, setSelectedMonth] = useState(filters.month);
  const [query, setQuery] = useState(filters.query);

  useEffect(() => {
    setSelectedYear(filters.year);
    setSelectedMonth(filters.month);
    setQuery(filters.query);
  }, [filters.month, filters.query, filters.year]);

  const monthOptions = selectedYear
    ? (indexes.monthsByYear[selectedYear] ?? [])
    : [];
  const hasActiveFilters = Boolean(selectedYear || selectedMonth || query);

  function applyFilters(nextFilters: BberNewsFilters) {
    const searchParams = new URLSearchParams();

    if (nextFilters.year) {
      searchParams.set("year", nextFilters.year);
    }

    if (nextFilters.year && nextFilters.month) {
      searchParams.set("month", nextFilters.month);
    }

    if (nextFilters.query) {
      searchParams.set("q", nextFilters.query);
    }

    const nextUrl = searchParams.size
      ? `${pathname}?${searchParams.toString()}`
      : pathname;

    startTransition(() => {
      router.push(nextUrl, { scroll: false });
    });
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.3fr)]">
        <FilterField
          label="View by Year"
          value={selectedYear}
          options={indexes.years}
          onValueChange={(nextYear) => {
            setSelectedYear(nextYear);
            if (!nextYear) {
              setSelectedMonth("");
              return;
            }

            const nextMonthOptions = indexes.monthsByYear[nextYear] ?? [];
            const monthStillExists = nextMonthOptions.some(
              (option) => option.value === selectedMonth,
            );

            if (!monthStillExists) {
              setSelectedMonth("");
            }
          }}
        />
        <FilterField
          label="View by Month"
          value={selectedMonth}
          options={monthOptions}
          disabled={!selectedYear}
          onValueChange={setSelectedMonth}
        />
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--bber-red)]">
            Search
          </span>
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={searchPlaceholder}
            className="h-11 border-[var(--bber-border)] bg-white"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          disabled={isPending}
          className="bg-[var(--bber-red)] text-white hover:bg-[var(--bber-red-strong)]"
          onClick={() =>
            applyFilters({
              year: selectedYear,
              month: selectedMonth,
              query: query.trim(),
            })
          }
        >
          {isPending ? "Loading..." : "Load"}
        </Button>

        {hasActiveFilters ? (
          <Button
            type="button"
            variant="outline"
            className="border-[var(--bber-border)] bg-white text-[var(--bber-red)] hover:bg-[var(--bber-sand)] hover:text-[var(--bber-red)]"
            onClick={() => {
              setSelectedYear("");
              setSelectedMonth("");
              setQuery("");
              applyFilters({
                year: "",
                month: "",
                query: "",
              });
            }}
          >
            Clear Filters
          </Button>
        ) : null}
      </div>
    </div>
  );
}
type FilterFieldProps = {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  disabled?: boolean;
  onValueChange: (value: string) => void;
};

function FilterField({
  label,
  value,
  options,
  disabled = false,
  onValueChange,
}: FilterFieldProps) {
  const selectedLabel =
    value.length > 0
      ? (options.find((option) => option.value === value)?.label ?? "All")
      : "All";

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--bber-red)]">
        {label}
      </span>
      <Select
        value={toSelectValue(value)}
        disabled={disabled}
        onValueChange={(nextValue) =>
          onValueChange(fromSelectValue(nextValue ?? ALL_FILTER_VALUE))
        }
      >
        <SelectTrigger
          aria-label={label}
          className="h-11 w-full rounded-md border-[var(--bber-border)] bg-white px-3 text-left text-sm text-[var(--bber-ink)]"
        >
          <SelectValue>{selectedLabel}</SelectValue>
        </SelectTrigger>
        <SelectContent className="border border-[var(--bber-border)] bg-white">
          <SelectItem value={ALL_FILTER_VALUE}>All</SelectItem>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
