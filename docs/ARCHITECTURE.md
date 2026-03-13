# ARCHITECTURE.md

## Overview

This project is a Next.js App Router site for the UNM Bureau of Business and
Economic Research. The current implementation focuses on a close recreation of
the public homepage plus the first real research routes while establishing the
long-lived structure for CMS-driven content and reusable shared chrome.

## Current architectural shape

### Shared site shell

- `src/app/layout.tsx` owns the root document, metadata, and shared site shell.
- `src/components/site/site-header.tsx` is mostly server-rendered and hands only
  the interactive navigation layer to a client component.
- `src/components/site/site-footer.tsx` is shared across the homepage,
  placeholder routes, search, and not-found states.

### Local content boundaries

Stable, low-churn site content is modeled locally instead of being embedded in
JSX:

- `src/content-models/pages.ts` contains the site tree, helper functions for
  route resolution, and the navigation contract used by the header and
  placeholder routes.
- `src/content-models/homepage-content.ts` contains utility-bar links, brand
  assets, homepage promo content, About BBER copy, and footer data.
- `src/content-models/research-content.ts` contains the stable copy and local
  imagery for the research landing page.
- `src/content-models/news-content.ts` contains the stable copy for the news
  archive page.

This keeps the UI code ready for a future CMS-backed pages feed without mixing
layout concerns with the data source.

### CMS feed boundaries

Live CMS feeds are fetched on the server only:

- `src/lib/cms/bber-homepage.ts` performs the server-side fetches with
  `revalidate: 3600`.
- `src/content-models/bber-homepage.ts` validates and normalizes raw CMS
  payloads into app-owned view models.
- Presentational components consume only normalized `BberNewsItem` and
  `BberPublicationItem` data.
- `src/lib/cms/bber-news.ts` performs the news archive fetches and reads
  URL-based year, month, and query filters.
- `src/content-models/bber-news.ts` validates and normalizes the news archive
  payloads, derives filter options from the `indexes` feed, and applies
  server-side text filtering after normalization.
- `src/lib/cms/bber-research.ts` performs the publications archive fetches and
  switches between featured and filtered modes based on URL search params.
- `src/content-models/bber-research.ts` validates and normalizes publications
  archive payloads, taxonomy indexes, and filter values.

The publications archive mirrors the live BBER contract:

- `featured=true` for the default publications view
- `indexes` for category, community, and year filter options
- `year`, `category`, and `community` query params for filtered results

The news archive mirrors the live BBER contract:

- `indexes` for available year/month combinations
- `year` and `month` query params for archive results
- a local `q` filter applied only after the raw archive response is normalized

## Route strategy

- `/` is the fully implemented homepage.
- `/news` is a dynamic server-rendered archive page backed by live CMS data and
  URL-based filters.
- `/research` is a local-content landing page that matches the live research
  section structure.
- `/research/publications` is a dynamic server-rendered archive page backed by
  live CMS data and URL-based filters.
- `/search` is a local placeholder route used by the shared search UI shell.
- `app/[...slug]/page.tsx` resolves known URLs from `pages.ts` and renders
  placeholder pages for the current navigation structure.
- Unknown paths use `notFound()` and fall through to `app/not-found.tsx`.

The placeholder route uses `generateStaticParams` and `dynamicParams = false` so
known nav paths are statically discoverable and unknown paths 404 cleanly.

## Server and client boundaries

### Server components

Use server components for:

- page rendering
- CMS fetching
- payload normalization handoff
- reading route search params for publications filters
- reading route search params for news filters
- route resolution for placeholders
- metadata and shell composition

### Client components

Use client components only where interaction is required:

- desktop dropdown navigation
- mobile sheet navigation
- accordion disclosure in the mobile menu
- publications filter controls that update the URL with sanctioned query params
- news filter controls that update the URL with sanctioned query params

Homepage, research landing, and publication result content all remain
server-rendered. The news archive list is also server-rendered.

## Asset strategy

Stable homepage shell assets are stored locally in `public/bber/`:

- horizontal BBER logo
- hero image
- section header art
- conference and forecast promo banners
- research overview sample image

Publication cards use remote CMS-hosted feature images through `next/image`
remote patterns limited to `https://api.bber.unm.edu/api/files/**`.
