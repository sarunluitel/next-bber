"use client";

import { CopyIcon, ExternalLinkIcon, LoaderCircleIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ApiEndpointPayload } from "@/lib/chart-downloads";

type JsonApiError = {
  message?: string;
};

export async function readApiEndpointPayload(apiRequestUrl: string) {
  const response = await fetch(apiRequestUrl, {
    cache: "no-store",
  });
  const payload = (await response.json().catch(() => null)) as
    | ApiEndpointPayload
    | JsonApiError
    | null;

  if (!response.ok) {
    const message =
      payload && typeof payload === "object" && "message" in payload
        ? payload.message
        : null;

    throw new Error(message || "The API endpoint could not be loaded.");
  }

  return payload as ApiEndpointPayload;
}

type ApiEndpointDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payload: ApiEndpointPayload | null;
  isLoading?: boolean;
  errorMessage?: string | null;
};

export function ApiEndpointDialog({
  open,
  onOpenChange,
  payload,
  isLoading = false,
  errorMessage = null,
}: ApiEndpointDialogProps) {
  const [copiedEndpointUrl, setCopiedEndpointUrl] = useState<string | null>(
    null,
  );

  async function handleCopyEndpoint(apiUrl: string) {
    await navigator.clipboard.writeText(apiUrl);
    setCopiedEndpointUrl(apiUrl);

    window.setTimeout(() => {
      setCopiedEndpointUrl((currentUrl) =>
        currentUrl === apiUrl ? null : currentUrl,
      );
    }, 1500);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen);

        if (!nextOpen) {
          setCopiedEndpointUrl(null);
        }
      }}
    >
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{payload?.title ?? "API Endpoint"}</DialogTitle>
          <DialogDescription>
            {payload?.description ??
              "Use this endpoint in your own workflow to retrieve the source data behind this download."}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center gap-3 rounded-2xl border border-[var(--bber-border)] bg-[var(--bber-sand)]/35 p-4 text-sm leading-7 text-[var(--bber-ink)]/78">
            <LoaderCircleIcon className="size-4 animate-spin text-[var(--bber-red)]" />
            Loading API endpoint details.
          </div>
        ) : errorMessage ? (
          <div className="rounded-2xl border border-[color:color-mix(in_oklab,var(--bber-red),white_52%)] bg-[color:color-mix(in_oklab,var(--bber-red),white_92%)] p-4 text-sm leading-7 text-[var(--bber-ink)]/80">
            {errorMessage}
          </div>
        ) : payload ? (
          <div className="grid gap-4">
            {payload.endpoints.map((endpoint) => (
              <div
                key={`${endpoint.label}-${endpoint.apiUrl}`}
                className="rounded-2xl border border-[var(--bber-border)] bg-[var(--bber-sand)]/35 p-4"
              >
                {payload.endpoints.length > 1 ? (
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--bber-red)]">
                    {endpoint.label}
                  </p>
                ) : null}
                <code className="block overflow-x-auto whitespace-pre-wrap break-all text-sm leading-7 text-[var(--bber-ink)]">
                  {endpoint.apiUrl}
                </code>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleCopyEndpoint(endpoint.apiUrl)}
                  >
                    <CopyIcon data-icon="inline-start" />
                    {copiedEndpointUrl === endpoint.apiUrl
                      ? "Copied"
                      : "Copy Link"}
                  </Button>
                  <Button
                    onClick={() =>
                      window.open(
                        endpoint.apiUrl,
                        "_blank",
                        "noopener,noreferrer",
                      )
                    }
                  >
                    <ExternalLinkIcon data-icon="inline-start" />
                    Open Endpoint
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : null}

        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  );
}
