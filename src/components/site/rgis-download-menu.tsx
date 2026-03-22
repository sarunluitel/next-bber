"use client";

import { useState } from "react";
import {
  ApiEndpointDialog,
  readApiEndpointPayload,
} from "@/components/site/api-endpoint-dialog";
import {
  DataDownloadDropdown,
  type DownloadFormat,
  RGIS_DOWNLOAD_OPTIONS,
} from "@/components/site/data-download-dropdown";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  areBberDbQueriesEqual,
  type BberDbAppliedQuery,
  buildBberDbQuerySearchParams,
  findBberDbDatasetByTable,
} from "@/content-models/bberdb";
import type { ApiEndpointPayload } from "@/lib/chart-downloads";

type RgisDownloadFormat = Extract<DownloadFormat, "api" | "geojson" | "shp">;

type RgisDownloadMenuProps = {
  appliedQuery: BberDbAppliedQuery;
  draftQuery: BberDbAppliedQuery;
  canDownloadDraft: boolean;
  disabled?: boolean;
  draftUnavailableMessage?: string | null;
};

function buildRgisDownloadHref(
  query: BberDbAppliedQuery,
  format: RgisDownloadFormat,
) {
  const searchParams = buildBberDbQuerySearchParams(query);
  searchParams.set("format", format);

  return `/api/rgis/download?${searchParams.toString()}`;
}

function triggerRgisDownload(
  query: BberDbAppliedQuery,
  format: RgisDownloadFormat,
) {
  window.location.assign(buildRgisDownloadHref(query, format));
}

export function RgisDownloadMenu({
  appliedQuery,
  draftQuery,
  canDownloadDraft,
  disabled = false,
  draftUnavailableMessage = null,
}: RgisDownloadMenuProps) {
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [pendingFormat, setPendingFormat] = useState<RgisDownloadFormat | null>(
    null,
  );
  const [isApiDialogOpen, setIsApiDialogOpen] = useState(false);
  const [isApiDialogLoading, setIsApiDialogLoading] = useState(false);
  const [apiDialogPayload, setApiDialogPayload] =
    useState<ApiEndpointPayload | null>(null);
  const [apiDialogErrorMessage, setApiDialogErrorMessage] = useState<
    string | null
  >(null);
  const draftDiffersFromApplied = !areBberDbQueriesEqual(
    draftQuery,
    appliedQuery,
  );
  const appliedDatasetLabel =
    findBberDbDatasetByTable(appliedQuery.table)?.label ?? appliedQuery.table;
  const draftDatasetLabel =
    findBberDbDatasetByTable(draftQuery.table)?.label ?? draftQuery.table;

  async function openApiDialog(query: BberDbAppliedQuery) {
    setIsApiDialogOpen(true);
    setIsApiDialogLoading(true);
    setApiDialogPayload(null);
    setApiDialogErrorMessage(null);

    try {
      setApiDialogPayload(
        await readApiEndpointPayload(buildRgisDownloadHref(query, "api")),
      );
    } catch (error) {
      setApiDialogErrorMessage(
        error instanceof Error && error.message.trim().length > 0
          ? error.message
          : "The API endpoint could not be loaded.",
      );
    } finally {
      setIsApiDialogLoading(false);
    }
  }

  function handleSelectFormat(format: DownloadFormat) {
    if (format !== "api" && format !== "geojson" && format !== "shp") {
      return;
    }

    if (!draftDiffersFromApplied) {
      if (format === "api") {
        void openApiDialog(appliedQuery);
        return;
      }

      triggerRgisDownload(appliedQuery, format);
      return;
    }

    setPendingFormat(format);
    setIsPromptOpen(true);
  }

  function handleSelectSource(query: BberDbAppliedQuery) {
    if (!pendingFormat) {
      return;
    }

    setIsPromptOpen(false);

    if (pendingFormat === "api") {
      void openApiDialog(query);
      setPendingFormat(null);
      return;
    }

    triggerRgisDownload(query, pendingFormat);
    setPendingFormat(null);
  }

  return (
    <>
      <DataDownloadDropdown
        disabled={disabled}
        options={RGIS_DOWNLOAD_OPTIONS}
        onSelectFormat={handleSelectFormat}
      />

      <Dialog
        open={isPromptOpen}
        onOpenChange={(nextOpen) => {
          setIsPromptOpen(nextOpen);

          if (!nextOpen) {
            setPendingFormat(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Choose download source</DialogTitle>
            <DialogDescription>
              The filter controls have changed since the last load. Choose
              whether to download the currently loaded map or the draft
              selection still waiting to be loaded.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3">
            <button
              type="button"
              className="rounded-xl border border-[var(--bber-border)] bg-[var(--bber-sand)] px-4 py-3 text-left transition-colors hover:border-[var(--bber-red)] hover:bg-white"
              onClick={() => handleSelectSource(appliedQuery)}
            >
              <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-[var(--bber-red)]">
                Loaded map
              </span>
              <span className="mt-1 block text-sm leading-7 text-[var(--bber-ink)]/80">
                {appliedDatasetLabel}
              </span>
            </button>

            <button
              type="button"
              disabled={!canDownloadDraft}
              className="rounded-xl border border-[var(--bber-border)] bg-white px-4 py-3 text-left transition-colors hover:border-[var(--bber-red)] disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => handleSelectSource(draftQuery)}
            >
              <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-[var(--bber-red)]">
                Draft selection
              </span>
              <span className="mt-1 block text-sm leading-7 text-[var(--bber-ink)]/80">
                {draftDatasetLabel}
              </span>
              {draftUnavailableMessage ? (
                <span className="mt-1 block text-xs leading-6 text-[var(--bber-ink)]/65">
                  {draftUnavailableMessage}
                </span>
              ) : null}
            </button>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsPromptOpen(false);
                setPendingFormat(null);
              }}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ApiEndpointDialog
        open={isApiDialogOpen}
        onOpenChange={(nextOpen) => {
          setIsApiDialogOpen(nextOpen);

          if (!nextOpen) {
            setApiDialogPayload(null);
            setApiDialogErrorMessage(null);
            setIsApiDialogLoading(false);
          }
        }}
        payload={apiDialogPayload}
        isLoading={isApiDialogLoading}
        errorMessage={apiDialogErrorMessage}
      />
    </>
  );
}
