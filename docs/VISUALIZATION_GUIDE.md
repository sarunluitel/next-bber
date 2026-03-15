# VISUALIZATION_GUIDE.md

## Purpose
This project uses D3 as the foundational charting layer for custom data
visualization.

Observable Plot is also allowed when it improves delivery speed for exploratory
or externally sourced statistical charts, provided the app still preserves
explicit data validation, normalization, and formatting boundaries.

## Rules
- Separate data validation, chart transformation, and SVG rendering concerns.
- Prefer reusable chart primitives over copy-pasted chart files.
- Empty, loading, and error states are part of the chart contract.
- Axes, scales, legends, and formatters should not be recreated ad hoc in each component when a shared primitive is appropriate.
- Accessibility is required: charts should expose titles, summaries, or tabular fallbacks where appropriate.
- If Plot is used, treat it as a rendering layer only. Data-source parsing,
  metric configuration, tooltip copy, and chart summaries should remain in
  app-owned modules.
- Any prose that depends on changing data, such as latest values, deltas,
  rankings, date spans, or narrative summaries, must be derived from the
  current normalized dataset at render time. Do not hardcode numbers or dates
  that can become stale after an upstream refresh script runs.
- Public-facing chart copy must read as finished site content for researchers,
  faculty, policy audiences, and grant reviewers. Keep implementation notes,
  migration context, and agent reasoning in comments or docs, not in rendered
  HTML.
- If a chart offers downloads, treat those exports as part of the visualization
  contract. API links, JSON payloads, and CSV/ZIP generation should be driven
  from the same normalized server boundary as the chart data rather than from
  ad hoc client transforms.
- Name shared chart infrastructure so it can move across dashboards without
  carrying page-specific language. Dataset or page terminology belongs in the
  config that initializes a chart, not in generic renderers, formatters, or
  export helpers.

## Recommended layering
- `content-models/` → metric catalogs, selector normalization, and external
  data contracts
- `visualizations/data/` → data shaping and statistical helpers
- `visualizations/scales/` → domain/range helpers
- `visualizations/primitives/` → low-level reusable SVG pieces
- `visualizations/charts/` → composed chart implementations
- `visualizations/formatters/` → labels, ticks, numeric/date formatting

For the current external-data work, keep one shared renderer contract per chart
family. The first reusable line renderer lives at
`src/visualizations/charts/external/line-graph.tsx`, while route-specific
dashboard code should stay responsible only for compact card composition and
selector state. Public data pages such as `/data/nm-statewide/`,
`/data/econindicators/`, and `/data/cpi` should reuse that same renderer when
they are presenting the same time-series shape instead of forking
page-specific line chart components.

For scatter or portfolio views such as the location quotient card on
`/data/nm-statewide/`, keep the same split:
- the server adapter owns all join logic, denominator rules, and data-quality filtering
- the chart-card client component owns frame selection, animation controls, and
  compact in-card tooltip state
- the Plot renderer receives only one already-normalized frame at a time

For mirrored bar views such as the population pyramid card on
`/data/nm-statewide/`, keep the same split:
- the server adapter owns age-band cleanup, total derivation, and annual frame construction
- the chart-card client component owns year playback, scrubber state, and
  hover detail
- the SVG renderer receives one already-normalized frame plus a shared domain maximum

For donut views such as the educational-attainment card on
`/data/nm-statewide/`, keep the same split:
- the server adapter owns variable ordering, metadata labels, total derivation,
  and missing-value warnings
- the chart-card client component owns the compact legend and hover state,
  including center-hover interactions
- the SVG renderer receives only already-normalized slices plus the shared
  total it should display in the center label

Portable chart primitives should stay compact by default:
- card-level controls such as variable selectors, play or pause buttons,
  download menus, and source lines belong inside the chart primitive by
  composition
- large explanatory panels, methodology sections, and always-visible tables do
  not belong inside dashboard chart cards
- if a page needs a table fallback, render it as a separate primitive or route
  concern instead of baking it into every chart card

## D3 usage philosophy
Use D3 for what it is best at:
- scales
- layouts
- shapes
- data transforms
- interaction math

Use React for what it is best at:
- component structure
- state ownership
- composition
- lifecycle coordination

Use Observable Plot for what it is best at:
- fast, reviewable statistical chart rendering
- responsive axes and marks for simple chart families
- tooltip and pointer interactions that do not justify a fully custom D3 scene
- animated frame-by-frame portfolio scatters when the temporal join logic is
  already resolved server-side

## Invariants
- Do not bury business logic inside anonymous D3 callbacks when named helpers would be clearer.
- Do not bind raw CMS payloads directly to charts.
- Do not bind raw external REST payloads directly to charts.
- Do not mix fetching, parsing, and rendering into one chart component.
- Keep tooltip logic and formatting logic reviewable.
- If an upstream dataset ignores request filters or mixes multiple series in one
  response, resolve that in the server normalization layer before rendering.
- Do not ship chart annotations or summaries that embed transient data values
  unless those values are computed from the live normalized series on each
  render.
- If a chart compares multiple upstream datasets to compute one metric, keep
  the mathematical contract reviewable in a named server helper instead of
  rebuilding it inside a client component or Plot callback.

## Trigger for documentation updates
Update this file when:
- chart architecture changes
- D3 usage conventions change
- accessibility strategy changes
- performance or rendering strategy changes
