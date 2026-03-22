"use client";

import { ChevronDownIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
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
import {
  type BberDbAppliedQuery,
  type BberDbFilterDefinition,
  getBberDbSelectedYearValues,
} from "@/content-models/bberdb";
import { cn } from "@/lib/utils";

export type SelectOption = {
  value: string;
  label: string;
};

type JsonApiError = {
  message?: string;
};

export async function readJsonApiResponse<T>(url: string) {
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

    throw new Error(message || "The data request could not be completed.");
  }

  return payload as T;
}

export function buildErrorMessage(error: unknown, fallbackMessage: string) {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return fallbackMessage;
}

export function MetadataBanner({
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

export function FilterSelect({
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

export function YearFilterMultiSelect({
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

export function findSelectedLabel(
  value: string,
  options: SelectOption[],
  fallbackLabel: string,
) {
  return (
    options.find((option) => option.value === value)?.label ?? fallbackLabel
  );
}

export function findFilterSelectedLabel(
  filter: BberDbFilterDefinition,
  selection: BberDbAppliedQuery,
) {
  const selectedValue = selection[filter.key] ?? filter.value ?? "";
  return (
    filter.options.find((option) => option.value === selectedValue)?.label ??
    selectedValue
  );
}
