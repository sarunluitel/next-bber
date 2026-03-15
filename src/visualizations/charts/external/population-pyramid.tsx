"use client";

import { useEffect, useRef, useState } from "react";
import type { PopulationPyramidFrame } from "@/content-models/population-pyramid";
import {
  buildPopulationPyramidTooltip,
  formatCompactPopulation,
} from "@/visualizations/formatters/population-pyramid-formatters";

type PopulationPyramidChartProps = {
  ariaLabel: string;
  frame: PopulationPyramidFrame;
  maxBandPopulation: number;
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

function buildTickValues(maxBandPopulation: number) {
  const roughStep = maxBandPopulation / 4;

  if (roughStep <= 10_000) {
    return [10_000, 20_000, 30_000, 40_000].filter(
      (tick) => tick <= maxBandPopulation,
    );
  }

  const power = 10 ** Math.floor(Math.log10(roughStep));
  const step = Math.ceil(roughStep / power) * power;
  const ticks: number[] = [];

  for (let tick = step; tick < maxBandPopulation; tick += step) {
    ticks.push(tick);
  }

  return ticks;
}

export function PopulationPyramidChart({
  ariaLabel,
  frame,
  maxBandPopulation,
}: PopulationPyramidChartProps) {
  const { containerReference, containerWidth } = useElementWidth();

  const chartWidth = Math.max(containerWidth, 320);
  const chartHeight = frame.bands.length * 28 + 124;
  const margins = {
    top: 54,
    right: 30,
    bottom: 44,
    left: 30,
  };
  const centerGap = 86;
  const availableHalfWidth =
    (chartWidth - margins.left - margins.right - centerGap) / 2;
  const scaleValue = (value: number) =>
    maxBandPopulation > 0
      ? (value / maxBandPopulation) * availableHalfWidth
      : 0;
  const rowHeight = 24;
  const ticks = buildTickValues(maxBandPopulation);
  const centerX = margins.left + availableHalfWidth + centerGap / 2;
  const displayBands = [...frame.bands].reverse();

  return (
    <div
      ref={containerReference}
      className="min-h-[34rem] w-full rounded-[1.5rem] border border-[var(--bber-border)] bg-[linear-gradient(180deg,#fff_0%,#fbf8f2_100%)] p-3 sm:p-4"
    >
      {containerWidth > 0 ? (
        <svg
          role="img"
          aria-label={ariaLabel}
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="h-auto w-full"
        >
          <defs>
            <linearGradient id="male-fill" x1="0%" x2="100%">
              <stop offset="0%" stopColor="#39566e" />
              <stop offset="100%" stopColor="#5c829b" />
            </linearGradient>
            <linearGradient id="female-fill" x1="0%" x2="100%">
              <stop offset="0%" stopColor="#c17f5c" />
              <stop offset="100%" stopColor="var(--bber-red)" />
            </linearGradient>
          </defs>

          <text
            x={margins.left}
            y={28}
            className="fill-[var(--bber-red)] text-[13px] font-semibold uppercase tracking-[0.18em]"
          >
            Population by age and sex
          </text>
          <text
            x={margins.left}
            y={48}
            className="fill-[var(--bber-ink)] text-[14px]"
          >
            Males
          </text>
          <text
            x={chartWidth - margins.right}
            y={48}
            textAnchor="end"
            className="fill-[var(--bber-ink)] text-[14px]"
          >
            Females
          </text>

          {ticks.map((tick) => {
            const scaledTick = scaleValue(tick);
            const leftX = centerX - centerGap / 2 - scaledTick;
            const rightX = centerX + centerGap / 2 + scaledTick;

            return (
              <g key={tick}>
                <line
                  x1={leftX}
                  x2={leftX}
                  y1={margins.top - 6}
                  y2={chartHeight - margins.bottom + 4}
                  stroke="var(--bber-border)"
                  strokeDasharray="4 6"
                />
                <line
                  x1={rightX}
                  x2={rightX}
                  y1={margins.top - 6}
                  y2={chartHeight - margins.bottom + 4}
                  stroke="var(--bber-border)"
                  strokeDasharray="4 6"
                />
                <text
                  x={leftX}
                  y={chartHeight - 12}
                  textAnchor="middle"
                  className="fill-[var(--bber-stone)] text-[11px]"
                >
                  {formatCompactPopulation(tick)}
                </text>
                <text
                  x={rightX}
                  y={chartHeight - 12}
                  textAnchor="middle"
                  className="fill-[var(--bber-stone)] text-[11px]"
                >
                  {formatCompactPopulation(tick)}
                </text>
              </g>
            );
          })}

          <line
            x1={centerX}
            x2={centerX}
            y1={margins.top - 10}
            y2={chartHeight - margins.bottom + 4}
            stroke="var(--bber-red-strong)"
            strokeWidth="2"
          />

          {displayBands.map((band, index) => {
            const rowTop = margins.top + index * 28;
            const maleWidth = scaleValue(band.malePopulation);
            const femaleWidth = scaleValue(band.femalePopulation);
            const maleX = centerX - centerGap / 2 - maleWidth;
            const femaleX = centerX + centerGap / 2;
            const labelY = rowTop + rowHeight / 2 + 1;

            return (
              <g key={`${frame.year}-${band.ageGroupCode}`}>
                <title>
                  {buildPopulationPyramidTooltip(band, frame.yearLabel)}
                </title>
                <rect
                  x={maleX}
                  y={rowTop}
                  width={maleWidth}
                  height={rowHeight}
                  rx="4"
                  fill="url(#male-fill)"
                  style={{ transition: "all 450ms ease" }}
                />
                <rect
                  x={femaleX}
                  y={rowTop}
                  width={femaleWidth}
                  height={rowHeight}
                  rx="4"
                  fill="url(#female-fill)"
                  style={{ transition: "all 450ms ease" }}
                />
                <text
                  x={centerX}
                  y={labelY}
                  textAnchor="middle"
                  className="fill-[var(--bber-ink)] text-[11px] font-medium"
                >
                  {band.ageGroupLabel}
                </text>
              </g>
            );
          })}
        </svg>
      ) : null}
    </div>
  );
}
