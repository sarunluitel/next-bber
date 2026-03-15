"use client";

import { ChevronDownIcon, SlidersHorizontalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ChartVariableMenuProps = {
  label?: string;
  selectedLabel: string;
  options: {
    value: string;
    label: string;
  }[];
  onValueChange: (value: string) => void;
};

export function ChartVariableMenu({
  label = "Variables",
  selectedLabel,
  options,
  onValueChange,
}: ChartVariableMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="border-[var(--bber-border)] bg-white text-[var(--bber-ink)]"
          />
        }
      >
        <SlidersHorizontalIcon data-icon="inline-start" className="size-3.5" />
        {selectedLabel}
        <ChevronDownIcon data-icon="inline-end" className="size-3.5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{label}</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={
              options.find((option) => option.label === selectedLabel)?.value
            }
            onValueChange={onValueChange}
          >
            {options.map((option) => (
              <DropdownMenuRadioItem key={option.value} value={option.value}>
                {option.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
