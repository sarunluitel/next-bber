"use client";

import {
  DatabaseIcon,
  DownloadIcon,
  FileJsonIcon,
  FileSpreadsheetIcon,
  type LucideIcon,
  MapIcon,
  PackageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type DownloadFormat = "api" | "json" | "csv" | "geojson" | "shp";

export type DownloadOption = {
  format: DownloadFormat;
  label: string;
  icon: LucideIcon;
};

export const DEFAULT_DOWNLOAD_OPTIONS = [
  {
    format: "api",
    label: "API",
    icon: DatabaseIcon,
  },
  {
    format: "json",
    label: "JSON Data",
    icon: FileJsonIcon,
  },
  {
    format: "csv",
    label: "CSV Data (Excel)",
    icon: FileSpreadsheetIcon,
  },
] satisfies readonly DownloadOption[];

export const RGIS_DOWNLOAD_OPTIONS = [
  {
    format: "api",
    label: "API",
    icon: DatabaseIcon,
  },
  {
    format: "geojson",
    label: "GeoJSON + XML",
    icon: MapIcon,
  },
  {
    format: "shp",
    label: "Shapefile + XML",
    icon: PackageIcon,
  },
] satisfies readonly DownloadOption[];

type DataDownloadDropdownProps = {
  disabled?: boolean;
  options?: readonly DownloadOption[];
  onSelectFormat: (format: DownloadFormat) => void;
};

export function DataDownloadDropdown({
  disabled = false,
  options = DEFAULT_DOWNLOAD_OPTIONS,
  onSelectFormat,
}: DataDownloadDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled}
            className="border-[var(--bber-border)] bg-white text-[var(--bber-ink)]"
          />
        }
      >
        <DownloadIcon data-icon="inline-start" className="size-3.5" />
        Download
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Data Download</DropdownMenuLabel>
          {options.map((option) => {
            const Icon = option.icon;

            return (
              <DropdownMenuItem
                key={option.format}
                onClick={() => onSelectFormat(option.format)}
              >
                <Icon />
                {option.label}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
