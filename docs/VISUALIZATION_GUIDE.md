# VISUALIZATION_GUIDE.md

## Purpose
This project uses D3 as the foundational charting layer for custom data visualization.

## Rules
- Separate data validation, chart transformation, and SVG rendering concerns.
- Prefer reusable chart primitives over copy-pasted chart files.
- Empty, loading, and error states are part of the chart contract.
- Axes, scales, legends, and formatters should not be recreated ad hoc in each component when a shared primitive is appropriate.
- Accessibility is required: charts should expose titles, summaries, or tabular fallbacks where appropriate.

## Recommended layering
- `visualizations/data/` → data shaping and statistical helpers
- `visualizations/scales/` → domain/range helpers
- `visualizations/primitives/` → low-level reusable SVG pieces
- `visualizations/charts/` → composed chart implementations
- `visualizations/formatters/` → labels, ticks, numeric/date formatting

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

## Invariants
- Do not bury business logic inside anonymous D3 callbacks when named helpers would be clearer.
- Do not bind raw CMS payloads directly to charts.
- Do not mix fetching, parsing, and rendering into one chart component.
- Keep tooltip logic and formatting logic reviewable.

## Trigger for documentation updates
Update this file when:
- chart architecture changes
- D3 usage conventions change
- accessibility strategy changes
- performance or rendering strategy changes
