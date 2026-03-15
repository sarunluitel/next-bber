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
import type { NmStatewideChartId } from "@/content-models/nm-statewide-dashboard";

type DataDownloadMenuProps = {
  chartId: NmStatewideChartId;
};

function buildDownloadHref(
  chartId: NmStatewideChartId,
  format: "api" | "json" | "csv",
) {
  return `/api/chart-download/${chartId}?format=${format}`;
}

export function DataDownloadMenu({ chartId }: DataDownloadMenuProps) {
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
        <DownloadIcon data-icon="inline-start" className="size-3.5" />
        Download
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Data Download</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() =>
              window.open(
                buildDownloadHref(chartId, "api"),
                "_blank",
                "noopener,noreferrer",
              )
            }
          >
            <DatabaseIcon />
            API
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              window.location.assign(buildDownloadHref(chartId, "json"))
            }
          >
            <FileJsonIcon />
            JSON Data
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              window.location.assign(buildDownloadHref(chartId, "csv"))
            }
          >
            <FileSpreadsheetIcon />
            CSV Data (Excel)
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
