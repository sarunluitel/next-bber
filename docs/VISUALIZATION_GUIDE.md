# VISUALIZATION_GUIDE.md

For project overview and route map, read [README.md](../README.md).
For workflow rules, read [AGENTS.md](../AGENTS.md).

## Purpose

This project treats data visualization as product infrastructure, not decorative
UI.

D3 is the foundational charting layer for bespoke visualization work.
Observable Plot is allowed when it speeds up delivery for chart families that
do not need a fully custom D3 scene, as long as server normalization and
formatting boundaries remain explicit.

## Core rules

- separate validation, normalization, rendering, and formatting concerns
- keep chart and map contracts reusable across pages
- define empty, loading, and error states as part of the visualization surface
- keep accessibility in scope with titles, summaries, or table fallbacks where
  appropriate
- derive public-facing chart copy, summaries, deltas, date spans, and rankings
  from normalized live data rather than hardcoded values
- keep public text audience-facing and publication-ready
- treat downloads as part of the same visualization contract, not as ad hoc
  client transforms

## Recommended layering

- `src/content-models/`:
  metric catalogs, selector normalization, and route-level view models
- `src/lib/`:
  external fetches, joins, filtering, and normalization
- `src/visualizations/`:
  chart renderers, scales, helpers, and primitives
- `src/components/site/`:
  page shells, chart cards, filters, and download UI

The server layer owns data trust and mathematical contracts. The client layer
owns only interaction and display state.

## Shared chart families

### Time-series pages

Pages such as `/data/nm-statewide`, `/data/econindicators`, `/data/cpi`, and
preview charts under `/data` should reuse shared line-rendering contracts when
they are presenting the same series shape.

### Bubble, pyramid, and donut cards

Keep the same split across compact chart-card families:

- server adapters own joins, filtering, denominator rules, ordering, totals,
  and data cleanup
- client chart cards own selector, playback, hover, and download interaction
- renderers receive already-normalized chart props

### Map pages

Use Leaflet when the product needs basemaps, GeoJSON overlays, fit-bounds
behavior, and geography interaction from server-normalized map payloads.

Map-specific rules:

- keep the map engine client-only
- normalize the GeoJSON, metric catalog, feature summaries, and export payloads
  before the client map mounts
- keep map downloads on the same normalized server contract as the rendered map
- when spatial downloads are offered, include the XML metadata sidecar in the
  same export contract

## Tool roles

Use D3 for:

- scales
- layouts
- shapes
- transforms
- interaction math

Use React for:

- component structure
- state ownership
- composition
- lifecycle coordination

Use Observable Plot for:

- fast, reviewable statistical chart rendering
- simple responsive chart families
- interactions that do not justify a fully custom D3 scene

## Invariants

- do not bind raw CMS payloads directly to charts
- do not bind raw BBER REST payloads directly to charts
- do not mix fetching, parsing, and rendering into one chart component
- keep tooltip and formatting logic named and reviewable
- resolve upstream quirks in the server normalization layer before rendering
- keep shared visualization infrastructure chart-agnostic and page-agnostic

## Update this doc when

- chart or map architecture changes
- visualization tool choices change
- accessibility strategy changes
- rendering or performance strategy changes
- download behavior changes
