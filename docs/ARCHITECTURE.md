# ARCHITECTURE.md

For project overview and setup, read [README.md](../README.md).
For workflow and task rules, read [AGENTS.md](../AGENTS.md).

## Overview

This app is a Next.js App Router site for the UNM Bureau of Business and
Economic Research. It combines:

- a local information architecture and stable editorial content layer
- server-only adapters for CMS and BBER REST data
- reusable section shells, navigation, chart, map, and download primitives
- explicit client islands only where interaction is required

The app is intended to ship on `https://bber.unm.edu`, so that hostname is a
first-party origin, not an upstream dependency.

## System model

### 1. Local information architecture

`src/content-models/pages.ts` is the navigation source of truth for:

- primary navigation
- section sidebars
- section landing pages
- explicit unfinished route ownership

Stable, low-churn editorial content is also modeled locally in
`src/content-models/` rather than embedded directly in JSX.

### 2. Server normalization boundaries

External data is fetched and normalized on the server before it reaches route
or presentation components.

Key adapter families:

- CMS feeds under `src/lib/cms/`
- BBER REST and dashboard adapters under `src/lib/`
- normalized route and content contracts under `src/content-models/`

Use [docs/CMS_CONTRACT.md](./CMS_CONTRACT.md) for the detailed normalization
rules.

### 3. Route composition

Routes in `src/app/` fall into four families:

- local editorial routes such as `/research`, `/subscribers`, `/data`,
  `/data/open-data/*`, `/data/colonias`, and
  `/data/nm-statewide/gross-receipts`
- live CMS-backed routes such as `/news`, `/research/publications`,
  `/about/staff`, `/about/directors`, and `/data/nm-duc`
- live BBER REST routes such as `/data/nm-statewide`, `/data/econindicators`,
  `/data/cpi`, `/data/bberdb`, and `/data/rgis`
- explicit unfinished routes that render `src/components/site/not-yet-built.tsx`

The App Router filesystem owns route ownership directly. Unfinished pages use
explicit route files rather than a generic catch-all placeholder route.

### 4. Client interaction surfaces

Client components should be limited to interaction-heavy surfaces:

- primary navigation menus and mobile disclosure
- section-sidebar disclosure
- filter controls that update URL or staged query state
- chart-card hover, playback, selector, and download interactions
- RGIS Leaflet map rendering and hover or pin state
- small page-local interaction surfaces such as the About contact form

Page rendering, external fetching, and normalization stay server-owned.

## Shared infrastructure

### Navigation

The site uses one local navigation model in `src/content-models/pages.ts`.

- header navigation and section sidebars derive from the same page tree
- parent pages remain clickable pages, not just menu triggers
- section sidebars show either children or siblings based on the current path

### Data downloads

Shared download infrastructure lives in `src/components/site/` and route
handlers under `src/app/api/`.

Key shared pieces:

- `data-download-menu.tsx`
- `data-download-dropdown.tsx`
- `api-endpoint-dialog.tsx`

These are reused across dashboards, BBER DB, and RGIS instead of being
reimplemented per page.

### Shared BBER data-bank stack

`/data/bberdb` and `/data/rgis` share the same metadata and selector boundary:

- shared dataset catalog and query rules in `src/content-models/bberdb.ts`
- shared metadata flow in `src/lib/bber-data-bank.ts`
- BBER DB table normalization in `src/lib/bberdb.ts`
- RGIS map normalization in `src/lib/rgis.ts` and
  `src/content-models/rgis.ts`

Keep `periodyear` comma-separated for multi-year queries, and treat RGIS
downloads as part of the same server-normalized contract.

## Server and client boundary rules

Use server components for:

- route rendering
- metadata
- CMS and BBER REST fetches
- normalization
- route-level search param handling
- page-shell composition

Use client components only for:

- UI state
- URL-updating controls
- staged filter forms
- chart and map interaction
- modals, menus, and disclosure widgets

Do not move external parsing or normalization into client components.

## Asset and host strategy

- repo-owned stable assets live in `public/`
- internal links should use route constants or root-relative paths
- do not hardcode `https://bber.unm.edu/...` for first-party pages or assets
- CMS-hosted images remain bounded to explicit remote patterns only where
  needed

## Deployment shape

The repo includes a root [amplify.yml](../amplify.yml) build spec for AWS
Amplify Gen 2. It enables Corepack, installs with `pnpm`, builds the app, and
publishes `.next`.

The app currently targets Next.js 16, so hosted behavior should be verified on
each deployment because Amplify support has historically lagged the latest Next
line.
