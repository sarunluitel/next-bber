# ARCHITECTURE.md

## Overview

This project is a Next.js App Router site for the UNM Bureau of Business and
Economic Research. The current implementation focuses on a close recreation of
the public homepage while establishing the long-lived structure for CMS-driven
content and reusable shared chrome.

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

This keeps the UI code ready for a future CMS-backed pages feed without mixing
layout concerns with the data source.

### CMS feed boundaries

Live homepage feeds are fetched on the server only:

- `src/lib/cms/bber-homepage.ts` performs the server-side fetches with
  `revalidate: 3600`.
- `src/content-models/bber-homepage.ts` validates and normalizes raw CMS
  payloads into app-owned view models.
- Presentational components consume only normalized `BberNewsItem` and
  `BberPublicationItem` data.

## Route strategy

- `/` is the fully implemented homepage.
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
- route resolution for placeholders
- metadata and shell composition

### Client components

Use client components only where interaction is required:

- desktop dropdown navigation
- mobile sheet navigation
- accordion disclosure in the mobile menu

The homepage content itself remains server-rendered.

## Asset strategy

Stable homepage shell assets are stored locally in `public/bber/`:

- horizontal BBER logo
- hero image
- section header art
- conference and forecast promo banners

Live CMS feeds currently supply links and text, not layout-critical imagery.
