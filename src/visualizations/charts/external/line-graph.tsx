"use client";

import * as Plot from "@observablehq/plot";
import { useEffect, useRef, useState } from "react";
import {
  buildTimeSeriesTooltip,
  formatTimeSeriesTick,
} from "@/visualizations/formatters/external-chart-formatters";
import type { LineGraphRendererProps } from "./chart-types";

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

export function LineGraph({
  ariaLabel,
  data,
  formatKind,
  yAxisLabel,
}: LineGraphRendererProps) {
  const plotReference = useRef<HTMLDivElement | null>(null);
  const { containerReference, containerWidth } = useElementWidth();

  useEffect(() => {
    const element = plotReference.current;

    if (!element || data.length === 0 || containerWidth === 0) {
      return;
    }

    const plot = Plot.plot({
      width: containerWidth,
      height: 320,
      marginTop: 24,
      marginRight: 18,
      marginBottom: 42,
      marginLeft: 64,
      x: {
        type: "time",
        label: "",
      },
      y: {
        label: yAxisLabel,
        grid: true,
        tickFormat: (value) => formatTimeSeriesTick(Number(value), formatKind),
      },
      marks: [
        Plot.ruleY([0], { stroke: "var(--bber-border)" }),
        Plot.areaY(data, {
          x: (point) => new Date(point.dateIso),
          y: "value",
          curve: "catmull-rom",
          fill: "var(--bber-red)",
          fillOpacity: 0.08,
        }),
        Plot.line(data, {
          x: (point) => new Date(point.dateIso),
          y: "value",
          stroke: "var(--bber-red)",
          strokeWidth: 2.5,
          curve: "catmull-rom",
        }),
        Plot.dot(data, {
          x: (point) => new Date(point.dateIso),
          y: "value",
          fill: "white",
          stroke: "var(--bber-red)",
          r: containerWidth < 520 ? 3.25 : 4.5,
          title: (point) => buildTimeSeriesTooltip(point, formatKind),
        }),
        Plot.tip(
          data,
          Plot.pointerX({
            x: (point) => new Date(point.dateIso),
            y: "value",
            title: (point) => buildTimeSeriesTooltip(point, formatKind),
          }),
        ),
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
  }, [ariaLabel, containerWidth, data, formatKind, yAxisLabel]);

  return (
    <div
      ref={containerReference}
      className="min-h-[19rem] w-full rounded-xl border border-[var(--bber-border)] bg-[linear-gradient(180deg,#fff_0%,#fbf8f2_100%)] p-3 sm:p-4"
    >
      <div ref={plotReference} className="w-full" />
    </div>
  );
}
