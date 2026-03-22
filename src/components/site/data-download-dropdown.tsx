"use client";

import {
  DatabaseIcon,
  DownloadIcon,
  FileJsonIcon,
  FileSpreadsheetIcon,
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

export type DownloadFormat = "api" | "json" | "csv";

type DataDownloadDropdownProps = {
  disabled?: boolean;
  onSelectFormat: (format: DownloadFormat) => void;
};

export function DataDownloadDropdown({
  disabled = false,
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
          <DropdownMenuItem onClick={() => onSelectFormat("api")}>
            <DatabaseIcon />
            API
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSelectFormat("json")}>
            <FileJsonIcon />
            JSON Data
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSelectFormat("csv")}>
            <FileSpreadsheetIcon />
            CSV Data (Excel)
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
