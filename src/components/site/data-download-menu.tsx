"use client";

import { useState } from "react";
import {
  ApiEndpointDialog,
  readApiEndpointPayload,
} from "@/components/site/api-endpoint-dialog";
import {
  DataDownloadDropdown,
  type DownloadFormat,
} from "@/components/site/data-download-dropdown";
import type { ApiEndpointPayload } from "@/lib/chart-downloads";

type DataDownloadMenuProps = {
  apiRequestUrl: string;
  jsonDownloadUrl: string;
  csvDownloadUrl: string;
  disabled?: boolean;
};

export function DataDownloadMenu({
  apiRequestUrl,
  jsonDownloadUrl,
  csvDownloadUrl,
  disabled = false,
}: DataDownloadMenuProps) {
  const [apiDialogPayload, setApiDialogPayload] =
    useState<ApiEndpointPayload | null>(null);
  const [apiDialogErrorMessage, setApiDialogErrorMessage] = useState<
    string | null
  >(null);
  const [isApiDialogOpen, setIsApiDialogOpen] = useState(false);
  const [isApiDialogLoading, setIsApiDialogLoading] = useState(false);

  async function handleSelectFormat(format: DownloadFormat) {
    if (format === "json") {
      window.location.assign(jsonDownloadUrl);
      return;
    }

    if (format === "csv") {
      window.location.assign(csvDownloadUrl);
      return;
    }

    setIsApiDialogOpen(true);
    setIsApiDialogLoading(true);
    setApiDialogErrorMessage(null);

    try {
      const payload = await readApiEndpointPayload(apiRequestUrl);
      setApiDialogPayload(payload);
    } catch (error) {
      setApiDialogPayload(null);
      setApiDialogErrorMessage(
        error instanceof Error && error.message.trim().length > 0
          ? error.message
          : "The API endpoint could not be loaded.",
      );
    } finally {
      setIsApiDialogLoading(false);
    }
  }

  return (
    <>
      <DataDownloadDropdown
        disabled={disabled}
        onSelectFormat={handleSelectFormat}
      />

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
