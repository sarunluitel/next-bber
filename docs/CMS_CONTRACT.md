# CMS_CONTRACT.md

For project overview and route map, read [README.md](../README.md).
For workflow rules, read [AGENTS.md](../AGENTS.md).

## Principle

The CMS and BBER REST APIs are external producers. The frontend is a strict
consumer.

That means:

- fetch external payloads on the server only
- validate the minimal required fields
- normalize into app-owned view models
- render from normalized models only

## Upstream source families

### CMS feeds

The app consumes live CMS data for:

- homepage news
- news archive and indexes
- publications archive and indexes
- staff and directors
- NM Data Users Conference pages

### BBER REST feeds

The app consumes BBER REST data for:

- metadata via `tablevariables` and `tablevalues`
- tabular data via `bbertable`
- map data via `makemap`
- CPI trend and annual table feeds

First-party route handlers may expose normalized API descriptor payloads that
point at those upstream endpoints instead of redirecting users there
immediately.

## Required pipeline

1. fetch raw payload on the server
2. validate only the fields needed to trust the shape
3. normalize to a repo-owned view model
4. render UI from that normalized model

Exact TypeScript shapes live in `src/content-models/`. This document captures
the durable behavioral rules rather than every field name.

## Normalization contracts by area

### Homepage, news, and publications

- drop incomplete or invalid entries rather than guessing missing data
- derive descriptions from the best available upstream summary field
- resolve publication links PDF-first when a PDF exists
- derive filter options from archive index payloads, not from ad hoc client
  parsing
- apply local text filtering only after archive items have been normalized

### About staff and directors

- keep the broader About section local, but treat staff and directors as
  explicitly CMS-backed
- split staff into current and past employees using `stoppedWorkingDate`
- treat `sortOrder` as ordering only; `sortOrder: 0` entries are still valid
- derive excerpt text from the first meaningful biography paragraphs
- normalize profile sections from the shared source description instead of
  letting the page parse raw body content directly

### BBER DB filter and query model

- keep the dataset catalog and category labels local to the repo
- derive supported filters from upstream metadata, but expose only the
  app-supported visible filter surface
- keep `/data/bberdb/` and `/data/rgis/` on the same shared query contract
- preserve `periodyear` as a comma-separated multi-year selection
- keep default table and selector behavior centralized in
  `src/content-models/bberdb.ts`
- degrade to inline upstream-unavailable states when the upstream service
  fails or times out instead of crashing the route

### BBER DB table model

- promote context columns such as geography, time, industry, and ownership
  ahead of metric columns
- prefer upstream metadata display names for headers
- map legacy negative sentinel values through the published exception labels
- derive result titles and source lines from the normalized row set and query
- keep rows newest-first by normalized time fields

### RGIS map model

- reuse the shared BBER data-bank dataset catalog, query rules, and filter
  model rather than creating an RGIS-only selector contract
- normalize the `makemap` payload into explicit year frames
- when one year contains repeated rows for the same geography, keep one feature
  per geography by preferring the newest release and then the highest period
- use a geography identity that can fall back from `geo_id` or `geoid` to
  `stfips:areatype:area`
- pair estimates with their matching margin-of-error fields in the metric list
- drive the map, side panel, API modal, and downloads from the same normalized
  payload
- spatial downloads must bundle the matching `<table>.xml` metadata sidecar

## Invariants

- page and presentation components must not parse raw CMS payloads
- page and presentation components must not parse raw BBER REST payloads
- incomplete upstream entries should be excluded rather than partially guessed
- local navigation and stable shell content are intentionally not CMS-backed
- research landing copy remains local even though publications are CMS-backed
- if upstream data fails, the affected page or section should degrade
  gracefully rather than crash the full route

## Current implementation locations

- homepage CMS fetches: `src/lib/cms/bber-homepage.ts`
- homepage normalization: `src/content-models/bber-homepage.ts`
- news fetches: `src/lib/cms/bber-news.ts`
- news normalization: `src/content-models/bber-news.ts`
- publications fetches: `src/lib/cms/bber-research.ts`
- publications normalization: `src/content-models/bber-research.ts`
- About people fetches: `src/lib/cms/bber-about.ts`
- About people normalization: `src/content-models/bber-about-people.ts`
- conference fetches: `src/lib/cms/bber-data-conferences.ts`
- conference normalization: `src/content-models/bber-data-conferences.ts`
- shared BBER data-bank metadata flow: `src/lib/bber-data-bank.ts`
- BBER DB fetches and normalization: `src/lib/bberdb.ts`,
  `src/content-models/bberdb.ts`
- RGIS fetches and normalization: `src/lib/rgis.ts`,
  `src/content-models/rgis.ts`
- RGIS spatial export builders: `src/lib/rgis-downloads.ts`,
  `src/lib/rgis-xml.ts`
