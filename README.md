# UNM BBER Frontend

This file is the project overview, setup guide, and high-level feature map.
For concrete working rules, task workflow, and review expectations, read
[AGENTS.md](./AGENTS.md).

Canonical deep docs:

- [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)
- [docs/CMS_CONTRACT.md](./docs/CMS_CONTRACT.md)
- [docs/VISUALIZATION_GUIDE.md](./docs/VISUALIZATION_GUIDE.md)
- [docs/AGENT_NOTES.md](./docs/AGENT_NOTES.md)

Use them like this:

- `README.md`:
  product overview, setup, and feature map
- `AGENTS.md`:
  repo workflow, implementation rules, and review expectations
- `docs/ARCHITECTURE.md`:
  routing, boundaries, and shared infrastructure
- `docs/CMS_CONTRACT.md`:
  external data contracts and normalization rules
- `docs/VISUALIZATION_GUIDE.md`:
  chart, map, accessibility, and download behavior
- `docs/AGENT_NOTES.md`:
  recent accepted decisions and change history

## What this project is

This repository is a Next.js App Router implementation of the UNM Bureau of
Business and Economic Research website. It is being rebuilt as a first-party
app that will ship on `https://bber.unm.edu`.

The architecture is intentionally split into:

- local information architecture and low-churn editorial content
- server-only fetch and normalization layers for CMS and BBER REST data
- reusable page shells, chart primitives, and download flows
- explicit server/client boundaries that stay easy for humans to review

## High-level product map

Implemented or substantially built sections include:

- homepage and shared site shell
- About section with local static pages plus live CMS-backed staff and
  directors directories and profile pages
- Subscribers section with local content pages
- Research landing page plus live CMS-backed publications archive
- live CMS-backed news archive
- Data landing page with server-fetched previews
- NM Statewide dashboard, NM Economic Indicators, and CPI data pages
- BBER DB data portal with first-party filter, table, and download routes
- RGIS map explorer with shared selectors plus first-party map and download
  routes
- NM Data Users Conference pages from the BBER CMS feed
- local Open Data pages, Colonias pages, and NM Statewide Gross Receipts
  reference page
- explicit unfinished route files for remaining sections such as Counties,
  Places, and Tribal Areas

## Repo map

- `src/app/`:
  route files, layouts, loading states, and route handlers
- `src/content-models/`:
  local content plus app-owned normalized view models
- `src/lib/`:
  server-only adapters and fetch layers for CMS and BBER REST data
- `src/components/site/`:
  shared shells, navigation, section layouts, and download UI
- `src/visualizations/`:
  reusable chart renderers, helpers, and primitives
- `public/`:
  repo-owned first-party assets

Use these docs by task:

- routing, boundaries, and shared infrastructure:
  [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)
- external data rules and normalization contracts:
  [docs/CMS_CONTRACT.md](./docs/CMS_CONTRACT.md)
- charts, maps, downloads, and visualization boundaries:
  [docs/VISUALIZATION_GUIDE.md](./docs/VISUALIZATION_GUIDE.md)
- recent decisions and behavior changes:
  [docs/AGENT_NOTES.md](./docs/AGENT_NOTES.md)

## Key invariants

- Treat `https://bber.unm.edu` as this app's deployment host, not as an
  external dependency.
- Prefer root-relative internal links and repo-owned `public/` assets over
  hardcoded first-party absolute URLs.
- Treat CMS and BBER REST payloads as untrusted until they are validated and
  normalized on the server.
- Keep raw external payload parsing out of route components and presentation
  components.
- Derive changing chart copy, summaries, and download payloads from normalized
  live data rather than hardcoded values.
- When recreating a page from the live BBER site, inspect the live page and
  its network requests before deciding what should stay local versus come from
  CMS or BBER REST feeds.

## Development

Run the local dev server:

```bash
pnpm dev
```

Run validation:

```bash
pnpm lint
pnpm build
```

Check exact framework and dependency versions in
[package.json](./package.json).

## Deployment

AWS Amplify Gen 2 can use the root
[amplify.yml](./amplify.yml) build spec in this repo. It enables Corepack,
installs dependencies with `pnpm`, builds the Next.js app, publishes the
`.next` output, and caches both the local pnpm store and Next.js build cache.

The repo currently targets Next.js 16, while AWS Amplify's published SSR
support has historically lagged that line. Treat Amplify compatibility as an
active deployment concern and verify the actual hosting behavior on each
release.
