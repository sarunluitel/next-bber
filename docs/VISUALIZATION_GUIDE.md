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
dashboard code should stay responsible only for card composition and selector
state.

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

## Invariants
- Do not bury business logic inside anonymous D3 callbacks when named helpers would be clearer.
- Do not bind raw CMS payloads directly to charts.
- Do not bind raw external REST payloads directly to charts.
- Do not mix fetching, parsing, and rendering into one chart component.
- Keep tooltip logic and formatting logic reviewable.
- If an upstream dataset ignores request filters or mixes multiple series in one
  response, resolve that in the server normalization layer before rendering.

## Trigger for documentation updates
Update this file when:
- chart architecture changes
- D3 usage conventions change
- accessibility strategy changes
- performance or rendering strategy changes
