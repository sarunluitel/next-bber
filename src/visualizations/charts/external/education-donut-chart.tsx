"use client";

import type { PointerEvent as ReactPointerEvent } from "react";
import { useState } from "react";
import type { EducationDonutSlice } from "@/content-models/education-donut";
import {
  formatEducationDonutCount,
  formatEducationDonutShare,
} from "@/visualizations/formatters/education-donut-formatters";

type EducationDonutChartProps = {
  ariaLabel: string;
  slices: EducationDonutSlice[];
  totalAdults: number;
};

function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number,
) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;

  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function describeArc(args: {
  centerX: number;
  centerY: number;
  innerRadius: number;
  outerRadius: number;
  startAngle: number;
  endAngle: number;
}) {
  const outerStart = polarToCartesian(
    args.centerX,
    args.centerY,
    args.outerRadius,
    args.endAngle,
  );
  const outerEnd = polarToCartesian(
    args.centerX,
    args.centerY,
    args.outerRadius,
    args.startAngle,
  );
  const innerStart = polarToCartesian(
    args.centerX,
    args.centerY,
    args.innerRadius,
    args.startAngle,
  );
  const innerEnd = polarToCartesian(
    args.centerX,
    args.centerY,
    args.innerRadius,
    args.endAngle,
  );
  const largeArcFlag = args.endAngle - args.startAngle > 180 ? 1 : 0;

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${args.outerRadius} ${args.outerRadius} 0 ${largeArcFlag} 0 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerStart.x} ${innerStart.y}`,
    `A ${args.innerRadius} ${args.innerRadius} 0 ${largeArcFlag} 1 ${innerEnd.x} ${innerEnd.y}`,
    "Z",
  ].join(" ");
}

export function EducationDonutChart({
  ariaLabel,
  slices,
  totalAdults,
}: EducationDonutChartProps) {
  const [hoveredSliceVariable, setHoveredSliceVariable] = useState<
    string | null
  >(null);

  if (slices.length === 0 || totalAdults <= 0) {
    return (
      <div className="flex min-h-[18rem] items-center justify-center rounded-xl border border-dashed border-[var(--bber-border)] bg-white/70 px-6 py-10 text-center">
        <p className="max-w-sm text-sm leading-7 text-[var(--bber-ink)]/72">
          No donut slices are available for this request.
        </p>
      </div>
    );
  }

  const centerX = 180;
  const centerY = 180;
  const outerRadius = 126;
  const innerRadius = 76;
  const hoveredSlice =
    slices.find((slice) => slice.variable === hoveredSliceVariable) ?? null;
  let currentAngle = 0;

  function handlePointerMove(event: ReactPointerEvent<SVGSVGElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const scaleX = 360 / bounds.width;
    const scaleY = 360 / bounds.height;
    const x = (event.clientX - bounds.left) * scaleX;
    const y = (event.clientY - bounds.top) * scaleY;
    const dx = x - centerX;
    const dy = y - centerY;
    const radius = Math.sqrt(dx ** 2 + dy ** 2);

    if (radius <= innerRadius - 2 || radius > outerRadius + 4) {
      setHoveredSliceVariable(null);
      return;
    }

    let angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90;

    if (angle < 0) {
      angle += 360;
    }

    let startAngle = 0;

    for (const slice of slices) {
      const endAngle = startAngle + slice.share * 360;

      if (angle >= startAngle && angle <= endAngle) {
        setHoveredSliceVariable(slice.variable);
        return;
      }

      startAngle = endAngle;
    }

    setHoveredSliceVariable(null);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-[var(--bber-border)] bg-[linear-gradient(180deg,#fff_0%,#fbf8f2_100%)] p-3">
        <svg
          viewBox="0 0 360 360"
          role="img"
          aria-label={ariaLabel}
          className="mx-auto w-full max-w-[22rem] overflow-visible"
          onPointerMove={handlePointerMove}
          onMouseLeave={() => setHoveredSliceVariable(null)}
        >
          <title>{ariaLabel}</title>
          <g>
            {slices.map((slice) => {
              const startAngle = currentAngle;
              const endAngle = currentAngle + slice.share * 360;
              currentAngle = endAngle;
              const isActive = hoveredSliceVariable === slice.variable;

              return (
                <path
                  key={slice.variable}
                  d={describeArc({
                    centerX,
                    centerY,
                    innerRadius,
                    outerRadius,
                    startAngle,
                    endAngle,
                  })}
                  fill={slice.color}
                  stroke="rgba(255,255,255,0.96)"
                  strokeWidth={isActive ? "5" : "4"}
                  opacity={hoveredSliceVariable && !isActive ? 0.58 : 1}
                  style={{
                    transition: "opacity 160ms ease, stroke-width 160ms ease",
                  }}
                />
              );
            })}
          </g>

          <g>
            <circle
              cx={centerX}
              cy={centerY}
              r={innerRadius - 2}
              fill="white"
              stroke="rgba(220, 211, 199, 0.9)"
              strokeWidth="1.5"
            />
            {hoveredSlice ? (
              <>
                <text
                  x={centerX}
                  y={centerY - 20}
                  textAnchor="middle"
                  className="fill-[var(--bber-ink)] text-[10px] font-semibold uppercase tracking-[0.18em]"
                >
                  {hoveredSlice.label}
                </text>
                <text
                  x={centerX}
                  y={centerY + 8}
                  textAnchor="middle"
                  className="fill-[var(--bber-red)] text-[26px] font-semibold"
                >
                  {formatEducationDonutShare(hoveredSlice.share)}
                </text>
                <text
                  x={centerX}
                  y={centerY + 28}
                  textAnchor="middle"
                  className="fill-[var(--bber-ink)] text-[11px]"
                >
                  {formatEducationDonutCount(hoveredSlice.value)}
                </text>
              </>
            ) : (
              <>
                <text
                  x={centerX}
                  y={centerY - 10}
                  textAnchor="middle"
                  className="fill-[var(--bber-ink)] text-[11px] font-semibold uppercase tracking-[0.24em]"
                >
                  Adults 25+
                </text>
                <text
                  x={centerX}
                  y={centerY + 24}
                  textAnchor="middle"
                  className="fill-[var(--bber-red)] text-[30px] font-semibold"
                >
                  {formatEducationDonutCount(totalAdults)}
                </text>
              </>
            )}
          </g>
        </svg>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {slices.map((slice) => {
          const isActive = hoveredSliceVariable === slice.variable;

          return (
            <button
              key={slice.variable}
              type="button"
              className={`flex items-start gap-3 rounded-lg border px-3 py-2 text-left transition-colors ${
                isActive
                  ? "border-[var(--bber-red)] bg-[var(--bber-sand)]"
                  : "border-[var(--bber-border)] bg-white/88"
              }`}
              onMouseEnter={() => setHoveredSliceVariable(slice.variable)}
              onMouseLeave={() => setHoveredSliceVariable(null)}
            >
              <span
                aria-hidden="true"
                className="mt-1 size-3 shrink-0 rounded-full"
                style={{ backgroundColor: slice.color }}
              />
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-[var(--bber-ink)]">
                  {slice.label}
                </span>
                <span className="block text-xs leading-5 text-[var(--bber-ink)]/62">
                  {formatEducationDonutShare(slice.share)} ·{" "}
                  {formatEducationDonutCount(slice.value)}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
