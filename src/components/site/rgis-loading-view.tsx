"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { RGIS_LOADING_STEPS } from "@/content-models/rgis";
import { cn } from "@/lib/utils";

export function RgisLoadingView() {
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveStepIndex((currentIndex) =>
        Math.min(currentIndex + 1, RGIS_LOADING_STEPS.length - 1),
      );
    }, 1200);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="space-y-6">
      <Card className="border border-[var(--bber-border)] bg-white py-0 shadow-sm">
        <CardHeader className="gap-3 px-6 pt-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--bber-red)]">
            Data Portal
          </p>
          <CardTitle className="font-display text-3xl text-[var(--bber-red)]">
            Loading RGIS Socioeconomic Data Tool
          </CardTitle>
          <p className="max-w-3xl text-sm leading-7 text-[var(--bber-ink)]/76">
            The page is assembling the current dataset catalog, filter values,
            and loaded map so the geographic view opens with the right context.
          </p>
        </CardHeader>
        <CardContent className="grid gap-4 px-6 pb-6 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)]">
          <div className="space-y-3">
            {RGIS_LOADING_STEPS.map((step, stepIndex) => {
              const isComplete = stepIndex < activeStepIndex;
              const isActive = stepIndex === activeStepIndex;

              return (
                <div
                  key={step}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm leading-6 transition-colors",
                    isActive
                      ? "border-[var(--bber-red)] bg-[color:color-mix(in_oklab,var(--bber-red),white_94%)] text-[var(--bber-ink)]"
                      : isComplete
                        ? "border-[var(--bber-border)] bg-[var(--bber-sand)]/75 text-[var(--bber-ink)]/78"
                        : "border-[var(--bber-border)] bg-white text-[var(--bber-ink)]/58",
                  )}
                >
                  <span
                    className={cn(
                      "size-2.5 rounded-full",
                      isActive
                        ? "animate-pulse bg-[var(--bber-red)]"
                        : isComplete
                          ? "bg-[var(--bber-red)]/70"
                          : "bg-[var(--bber-border)]",
                    )}
                  />
                  <span>{step}</span>
                </div>
              );
            })}
          </div>

          <div className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton
                  key={`filters-${String(index)}`}
                  className="h-11 rounded-2xl border border-[var(--bber-border)] bg-[var(--bber-sand)]/75"
                />
              ))}
            </div>
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
              <Skeleton className="min-h-[22rem] rounded-[2rem]" />
              <Skeleton className="min-h-[22rem] rounded-[2rem]" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
