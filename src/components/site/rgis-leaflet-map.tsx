"use client";

import L from "leaflet";
import { useEffect, useMemo, useRef } from "react";
import {
  buildRgisFeatureIdFromProperties,
  RGIS_BASEMAP_OPTIONS,
  type RgisYearFrame,
} from "@/content-models/rgis";
import { cn } from "@/lib/utils";

type RgisLeafletMapProps = {
  yearFrame: RgisYearFrame | null;
  activeMetricKey: string | null;
  activeMetricLabel: string | null;
  highlightedFeatureId: string | null;
  pinnedFeatureId: string | null;
  onHoverFeature: (featureId: string | null) => void;
  onPinFeature: (featureId: string) => void;
};

const RGIS_MAP_COLORS = [
  "#f7f2ea",
  "#ecdcc5",
  "#d8ba96",
  "#c28371",
  "#a74b5a",
  "#7f203d",
] as const;

const RGIS_NEUTRAL_FILL = "#ebe7de";

type LegendBucket = {
  min: number;
  max: number;
  color: string;
};

function getFeatureId(properties: Record<string, unknown>) {
  return buildRgisFeatureIdFromProperties(properties);
}

function getNumericMetricValue(
  properties: Record<string, unknown>,
  metricKey: string | null,
) {
  if (!metricKey) {
    return null;
  }

  const value = properties[metricKey];
  return typeof value === "number" && value >= 0 ? value : null;
}

function buildLegendBuckets(values: number[]) {
  if (values.length === 0) {
    return [] satisfies LegendBucket[];
  }

  const sortedValues = [...values].sort(
    (leftValue, rightValue) => leftValue - rightValue,
  );
  const bucketCount = Math.min(
    RGIS_MAP_COLORS.length,
    Math.max(1, Math.min(6, sortedValues.length)),
  );
  const buckets: LegendBucket[] = [];

  for (let bucketIndex = 0; bucketIndex < bucketCount; bucketIndex += 1) {
    const startIndex = Math.floor(
      (bucketIndex / bucketCount) * sortedValues.length,
    );
    const endIndex =
      Math.floor(((bucketIndex + 1) / bucketCount) * sortedValues.length) - 1;
    const min = sortedValues[startIndex] ?? sortedValues[0] ?? 0;
    const max = sortedValues[Math.max(startIndex, endIndex)] ?? min;

    buckets.push({
      min,
      max,
      color:
        RGIS_MAP_COLORS[bucketIndex] ?? RGIS_MAP_COLORS.at(-1) ?? "#7f203d",
    });
  }

  return buckets;
}

function formatLegendValue(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(value);
}

function fitFrameBounds(map: L.Map, bounds: L.LatLngBounds) {
  if (!bounds.isValid()) {
    return;
  }

  const longitudeSpan = Math.abs(bounds.getEast() - bounds.getWest());

  if (longitudeSpan >= 250) {
    map.fitWorld({
      padding: [24, 24],
    });
    map.setZoom(Math.min(map.getZoom(), 2.25));
    return;
  }

  map.fitBounds(bounds.pad(longitudeSpan >= 120 ? 0.16 : 0.08), {
    maxZoom: longitudeSpan >= 120 ? 3.5 : undefined,
  });
}

export function RgisLeafletMap({
  yearFrame,
  activeMetricKey,
  activeMetricLabel,
  highlightedFeatureId,
  pinnedFeatureId,
  onHoverFeature,
  onPinFeature,
}: RgisLeafletMapProps) {
  const mapElementRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const dataLayerRef = useRef<L.GeoJSON | null>(null);
  const legendBuckets = useMemo(() => {
    const validValues =
      yearFrame?.featureCollection.features
        .map((feature) =>
          getNumericMetricValue(feature.properties, activeMetricKey),
        )
        .filter((value): value is number => value !== null) ?? [];

    return buildLegendBuckets(validValues);
  }, [activeMetricKey, yearFrame]);

  useEffect(() => {
    if (!mapElementRef.current || mapRef.current) {
      return;
    }

    const baseLayers = Object.fromEntries(
      RGIS_BASEMAP_OPTIONS.map((basemapOption) => [
        basemapOption.key,
        L.tileLayer(basemapOption.tileUrl, {
          attribution: basemapOption.attribution,
          ...basemapOption.options,
          noWrap: false,
        }),
      ]),
    ) as Record<string, L.TileLayer>;
    const defaultLayer = baseLayers.Map ?? Object.values(baseLayers)[0] ?? null;

    const map = L.map(mapElementRef.current, {
      zoomSnap: 0.25,
      zoomDelta: 0.25,
      minZoom: 2,
      worldCopyJump: true,
      layers: defaultLayer ? [defaultLayer] : [],
    }).setView([34.35, -106], 6.5);

    L.control.layers(baseLayers).addTo(map);
    mapRef.current = map;

    return () => {
      dataLayerRef.current?.remove();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;

    if (!map) {
      return;
    }

    dataLayerRef.current?.remove();

    if (!yearFrame) {
      dataLayerRef.current = null;
      return;
    }

    const colorForValue = (value: number | null) => {
      if (value === null || legendBuckets.length === 0) {
        return RGIS_NEUTRAL_FILL;
      }

      const matchingBucket =
        legendBuckets.find(
          (bucket) => value >= bucket.min && value <= bucket.max,
        ) ?? legendBuckets.at(-1);

      return (
        matchingBucket?.color ?? RGIS_MAP_COLORS.at(-1) ?? RGIS_NEUTRAL_FILL
      );
    };

    const dataLayer = L.geoJSON(yearFrame.featureCollection as never, {
      style: (rawFeature) => {
        const properties = (rawFeature?.properties ?? {}) as Record<
          string,
          unknown
        >;
        const featureId = getFeatureId(properties);
        const isPinned = featureId === pinnedFeatureId;
        const isHighlighted = featureId === highlightedFeatureId;

        return {
          fillColor: colorForValue(
            getNumericMetricValue(properties, activeMetricKey),
          ),
          color:
            isPinned || isHighlighted
              ? "var(--bber-red)"
              : "rgba(36,49,64,0.75)",
          weight: isPinned ? 3 : isHighlighted ? 2.5 : 1,
          fillOpacity: activeMetricKey ? 0.82 : 0.35,
        };
      },
      onEachFeature: (rawFeature, layer) => {
        const properties = (rawFeature.properties ?? {}) as Record<
          string,
          unknown
        >;
        const featureId = getFeatureId(properties);

        layer.on("mouseover", () => {
          if (pinnedFeatureId) {
            return;
          }

          onHoverFeature(featureId);
        });

        layer.on("mouseout", () => {
          if (pinnedFeatureId) {
            return;
          }

          onHoverFeature(null);
        });

        layer.on("click", () => {
          onPinFeature(featureId);
        });
      },
    });

    dataLayer.addTo(map);
    dataLayerRef.current = dataLayer;

    const bounds = dataLayer.getBounds();

    fitFrameBounds(map, bounds);

    return () => {
      dataLayer.remove();
    };
  }, [
    activeMetricKey,
    highlightedFeatureId,
    legendBuckets,
    onHoverFeature,
    onPinFeature,
    pinnedFeatureId,
    yearFrame,
  ]);

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-[var(--bber-border)] bg-[var(--bber-sand)]/35">
      <div
        ref={mapElementRef}
        className="min-h-[26rem] w-full lg:min-h-[40rem]"
      />

      <div className="border-t border-[var(--bber-border)] bg-white/94 px-4 py-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 flex-1 rounded-2xl border border-[var(--bber-border)] bg-[var(--bber-sand)]/35 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--bber-red)]">
              Legend
            </p>
            <p className="mt-1 text-sm leading-6 text-[var(--bber-ink)]/78">
              {activeMetricLabel ?? "Select a metric to color the map."}
            </p>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
              {legendBuckets.length > 0 ? (
                legendBuckets.map((bucket, bucketIndex) => (
                  <div
                    key={`${bucket.color}-${String(bucketIndex)}`}
                    className="flex items-center gap-2 text-xs text-[var(--bber-ink)]/76"
                  >
                    <span
                      className="size-3 rounded-full border border-[var(--bber-border)]"
                      style={{ backgroundColor: bucket.color }}
                    />
                    <span>
                      {formatLegendValue(bucket.min)} to{" "}
                      {formatLegendValue(bucket.max)}
                    </span>
                  </div>
                ))
              ) : (
                <div className="flex items-center gap-2 text-xs text-[var(--bber-ink)]/68">
                  <span
                    className="size-3 rounded-full border border-[var(--bber-border)]"
                    style={{ backgroundColor: RGIS_NEUTRAL_FILL }}
                  />
                  <span>No mapped values for this selection</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-xs text-[var(--bber-ink)]/68">
                <span
                  className="size-3 rounded-full border border-[var(--bber-border)]"
                  style={{ backgroundColor: RGIS_NEUTRAL_FILL }}
                />
                <span>Missing or unavailable data</span>
              </div>
            </div>
          </div>

          <div
            className={cn(
              "rounded-2xl border border-[var(--bber-border)] bg-white px-4 py-3 text-xs leading-6 text-[var(--bber-ink)]/72 lg:max-w-[18rem]",
              !highlightedFeatureId && !pinnedFeatureId
                ? "opacity-80"
                : undefined,
            )}
          >
            {pinnedFeatureId
              ? "Click the highlighted geography again to clear the pinned selection."
              : "Hover over a geography to preview its values, or click to pin it."}
          </div>
        </div>
      </div>
    </div>
  );
}
