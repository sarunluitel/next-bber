"use client";

import * as Plot from "@observablehq/plot";
import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  buildExternalChartTooltip,
  formatExternalChartTick,
} from "@/visualizations/formatters/external-chart-formatters";
import type { ExternalChartRendererProps } from "./chart-types";

function useElementWidth() {
  const containerReference = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const element = containerReference.current;

    if (!element) {
      return;
    }

    const resizeObserver = new ResizeObserver(([entry]) => {
      const nextWidth = Math.floor(entry.contentRect.width);
      setContainerWidth(nextWidth);
    });

    resizeObserver.observe(element);
    return () => resizeObserver.disconnect();
  }, []);

  return { containerReference, containerWidth };
}

export function BarGraph({
  ariaLabel,
  data,
  unit,
  yAxisLabel,
}: ExternalChartRendererProps) {
  const plotId = useId();
  const plotReference = useRef<HTMLDivElement | null>(null);
  const { containerReference, containerWidth } = useElementWidth();

  useEffect(() => {
    const element = plotReference.current;

    if (!element || containerWidth === 0 || data.length === 0) {
      return;
    }

    const plot = Plot.plot({
      width: containerWidth,
      height: 380,
      marginTop: 24,
      marginRight: 18,
      marginBottom: 54,
      marginLeft: 70,
      x: {
        label: "Year",
        type: "band",
        tickRotate: containerWidth < 540 ? -35 : 0,
      },
      y: {
        label: yAxisLabel,
        grid: true,
        tickFormat: (value) => formatExternalChartTick(Number(value), unit),
      },
      marks: [
        Plot.ruleY([0], { stroke: "var(--bber-border)" }),
        Plot.barY(data, {
          x: "yearLabel",
          y: "estimate",
          fill: "var(--bber-red)",
          rx: 4,
          title: buildExternalChartTooltip,
        }),
        Plot.tip(
          data,
          Plot.pointerX({
            x: "yearLabel",
            y: "estimate",
            title: buildExternalChartTooltip,
            maxRadius: 60,
          }),
        ),
      ],
    });

    plot.setAttribute("aria-label", ariaLabel);
    plot.setAttribute("role", "img");
    plot.style.width = "100%";
    plot.style.height = "auto";
    plot.style.maxWidth = "100%";
    plot.style.overflow = "visible";
    plot.style.fontFamily = "var(--font-body)";
    plot.style.color = "var(--bber-ink)";
    plot.style.background = "transparent";

    element.replaceChildren(plot);
    return () => plot.remove();
  }, [ariaLabel, containerWidth, data, unit, yAxisLabel]);

  return (
    <div
      ref={containerReference}
      className={cn(
        "min-h-[22rem] w-full rounded-xl border border-[var(--bber-border)] bg-[linear-gradient(180deg,#fff_0%,#fbf8f2_100%)] p-3 sm:p-4",
      )}
    >
      <div id={plotId} ref={plotReference} className="w-full" />
    </div>
  );
}
