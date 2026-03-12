# ARCHITECTURE.md

## Overview
This project is a Next.js App Router website for an economics research department. It combines structured content publishing with custom data visualization.

The system has two major responsibilities:
1. render CMS-driven content pages from JSON payloads
2. render trustworthy, maintainable D3-based visualizations

## Architectural shape

### Content flow
1. CMS emits JSON payloads for articles, papers, presentations, datasets, and related content.
2. Server-side loaders fetch those payloads.
3. Payloads are validated and normalized into stable internal models.
4. Pages and feature components render from normalized models, not raw CMS objects.

### Visualization flow
1. Raw data is fetched or received from CMS/API sources.
2. Data is validated and transformed into chart-ready structures.
3. D3 primitives compute scales, domains, layout, and interaction logic.
4. React components own composition and lifecycle, while D3 owns data-to-geometry behavior where appropriate.

## Initial content domains
These are expected, based on the public site shape and project description:
- home
- research
- data
- news or blog content
- research papers/publications
- research presentations
- about, services, and contact content

## Recommended boundaries

### Server-side boundaries
Use server components or route handlers for:
- CMS fetching
- payload validation
- secret-bearing integrations
- cache policy decisions
- expensive transforms that do not require the browser

### Client-side boundaries
Use client components only for:
- interactive charts
- UI interactions that require browser state
- filters, tabs, viewport-driven behavior, or chart tooltips

Do not move CMS parsing into client components.

## Route philosophy
- Use route groups only when they provide a real organizational benefit.
- Keep route names aligned with public IA.
- Avoid deeply nested routing without a product-level reason.
- Preserve predictable paths for content that may be indexed or shared.

## Documentation triggers
Update this file when any of the following change:
- routing structure
- rendering boundaries
- visualization architecture
- data normalization strategy
- major framework upgrades
- external service integration shape
