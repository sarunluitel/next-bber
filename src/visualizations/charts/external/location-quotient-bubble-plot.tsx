"use client";

import * as Plot from "@observablehq/plot";
import { useEffect, useRef, useState } from "react";
import type { LocationQuotientFrame } from "@/content-models/location-quotient";
import {
  buildLocationQuotientTooltip,
  formatGrowthPercent,
  formatLocationQuotientTick,
} from "@/visualizations/formatters/location-quotient-formatters";

type LocationQuotientBubblePlotProps = {
  ariaLabel: string;
  frame: LocationQuotientFrame;
  baseYear: number;
};

function useElementWidth() {
  const containerReference = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const element = containerReference.current;

    if (!element) {
      return;
    }

    const resizeObserver = new ResizeObserver(([entry]) => {
      setContainerWidth(Math.floor(entry.contentRect.width));
    });

    resizeObserver.observe(element);
    return () => resizeObserver.disconnect();
  }, []);

  return { containerReference, containerWidth };
}

function getBubbleFill(point: LocationQuotientFrame["points"][number]) {
  if (point.locationQuotient >= 1 && point.growthSinceBaseYear >= 0) {
    return "var(--bber-red)";
  }

  if (point.locationQuotient >= 1) {
    return "#9f5630";
  }

  if (point.growthSinceBaseYear >= 0) {
    return "#b58a3f";
  }

  return "var(--bber-ink)";
}

export function LocationQuotientBubblePlot({
  ariaLabel,
  frame,
  baseYear,
}: LocationQuotientBubblePlotProps) {
  const plotReference = useRef<HTMLDivElement | null>(null);
  const { containerReference, containerWidth } = useElementWidth();

  useEffect(() => {
    const element = plotReference.current;

    if (!element || frame.points.length === 0 || containerWidth === 0) {
      return;
    }

    const maximumLocationQuotient = Math.max(
      1.5,
      ...frame.points.map((point) => point.locationQuotient),
    );
    const growthExtent = frame.points.reduce(
      (extent, point) => ({
        min: Math.min(extent.min, point.growthSinceBaseYear),
        max: Math.max(extent.max, point.growthSinceBaseYear),
      }),
      { min: 0, max: 0 },
    );
    const padding = 0.08;
    const yDomain = [
      Math.min(-0.1, growthExtent.min - padding),
      Math.max(0.1, growthExtent.max + padding),
    ] as const;

    const plot = Plot.plot({
      width: containerWidth,
      height: 420,
      marginTop: 20,
      marginRight: 24,
      marginBottom: 52,
      marginLeft: 72,
      x: {
        label: "Location quotient (LQ)",
        domain: [0, maximumLocationQuotient * 1.08],
        grid: true,
        tickFormat: (value) => formatLocationQuotientTick(Number(value)),
      },
      y: {
        label: `Local employment growth since ${baseYear}`,
        domain: yDomain,
        grid: true,
        tickFormat: (value) => formatGrowthPercent(Number(value)),
      },
      r: {
        range: [10, 34],
      },
      marks: [
        Plot.ruleX([1], {
          stroke: "var(--bber-red-strong)",
          strokeOpacity: 0.75,
          strokeWidth: 2.25,
          strokeDasharray: "5 4",
        }),
        Plot.ruleY([0], {
          stroke: "var(--bber-red-strong)",
          strokeOpacity: 0.75,
          strokeWidth: 2.25,
          strokeDasharray: "5 4",
        }),
        Plot.dot(frame.points, {
          x: "locationQuotient",
          y: "growthSinceBaseYear",
          r: "bubbleSize",
          fill: (point) => getBubbleFill(point),
          fillOpacity: 0.82,
          stroke: "white",
          strokeWidth: 1.5,
          title: (point) => buildLocationQuotientTooltip(point),
        }),
      ],
    });

    plot.setAttribute("aria-label", ariaLabel);
    plot.setAttribute("role", "img");
    plot.style.width = "100%";
    plot.style.height = "auto";
    plot.style.maxWidth = "100%";
    plot.style.background = "transparent";
    plot.style.fontFamily = "var(--font-body)";
    plot.style.color = "var(--bber-ink)";

    element.replaceChildren(plot);
    return () => plot.remove();
  }, [ariaLabel, baseYear, containerWidth, frame]);

  return (
    <div
      ref={containerReference}
      className="min-h-[26rem] w-full rounded-[1.5rem] border border-[var(--bber-border)] bg-[linear-gradient(180deg,#fff_0%,#fbf8f2_100%)] p-3 sm:p-4"
    >
      <div ref={plotReference} className="w-full" />
    </div>
  );
}
