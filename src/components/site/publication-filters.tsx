"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  BberPublicationFilterOption,
  BberPublicationFilters,
} from "@/content-models/bber-research";

const ALL_FILTER_VALUE = "__all__";

type PublicationFiltersProps = {
  categories: BberPublicationFilterOption[];
  communities: BberPublicationFilterOption[];
  years: BberPublicationFilterOption[];
  filters: BberPublicationFilters;
};

function toSelectValue(value: string) {
  return value || ALL_FILTER_VALUE;
}

function fromSelectValue(value: string) {
  return value === ALL_FILTER_VALUE ? "" : value;
}

export function PublicationFilters({
  categories,
  communities,
  years,
  filters,
}: PublicationFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [selectedCategory, setSelectedCategory] = useState(filters.category);
  const [selectedCommunity, setSelectedCommunity] = useState(filters.community);
  const [selectedYear, setSelectedYear] = useState(filters.year);

  useEffect(() => {
    setSelectedCategory(filters.category);
    setSelectedCommunity(filters.community);
    setSelectedYear(filters.year);
  }, [filters.category, filters.community, filters.year]);

  function applyFilters(nextFilters: BberPublicationFilters) {
    const searchParams = new URLSearchParams();

    if (nextFilters.category) {
      searchParams.set("category", nextFilters.category);
    }

    if (nextFilters.community) {
      searchParams.set("community", nextFilters.community);
    }

    if (nextFilters.year) {
      searchParams.set("year", nextFilters.year);
    }

    const nextUrl = searchParams.size
      ? `${pathname}?${searchParams.toString()}`
      : pathname;

    startTransition(() => {
      router.push(nextUrl, { scroll: false });
    });
  }

  const hasActiveFilters = Boolean(
    selectedCategory || selectedCommunity || selectedYear,
  );

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-3">
        <FilterField
          label="View by Category"
          value={selectedCategory}
          options={categories}
          onValueChange={setSelectedCategory}
        />
        <FilterField
          label="View by Community"
          value={selectedCommunity}
          options={communities}
          onValueChange={setSelectedCommunity}
        />
        <FilterField
          label="View by Year"
          value={selectedYear}
          options={years}
          onValueChange={setSelectedYear}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          disabled={isPending}
          className="bg-[var(--bber-red)] text-white hover:bg-[var(--bber-red-strong)]"
          onClick={() =>
            applyFilters({
              category: selectedCategory,
              community: selectedCommunity,
              year: selectedYear,
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
              setSelectedCategory("");
              setSelectedCommunity("");
              setSelectedYear("");
              applyFilters({
                category: "",
                community: "",
                year: "",
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
  options: BberPublicationFilterOption[];
  onValueChange: (value: string) => void;
};

function FilterField({
  label,
  value,
  options,
  onValueChange,
}: FilterFieldProps) {
  const selectedLabel =
    value.length > 0
      ? (options.find((option) => option.value === value)?.label ?? "All")
      : "All";

  return (
    <div className="space-y-2">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--bber-red)]">
        {label}
      </span>
      <Select
        value={toSelectValue(value)}
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
