# UNM BBER Frontend

This repository is a Next.js App Router implementation of the UNM Bureau of
Business and Economic Research website, starting with a close recreation of the
homepage now hosted by this application at [bber.unm.edu](https://bber.unm.edu/).

## Current scope

The app currently includes:

- a reusable site shell with shared header and footer
- a fully implemented homepage
- a fully implemented About section, including static services/history/helpful
  links/contact pages plus live CMS-backed staff and director directories and
  bio pages
- a live CMS-backed news archive at `/news`
- a local-content research landing page at `/research`
- a live CMS-backed publications page at `/research/publications`
- a live BBER REST API visualization prototype at `/external/test`
- a live BBER REST API economic indicators dashboard at `/data/econindicators/`
- live server-side CMS feeds for homepage news and publications
- a local `pages.ts` site tree used for navigation and placeholder routes
- a shared data-driven section sidebar for nested pages under Data, Research,
  Subscribers, and About
- a split-link primary navigation pattern so parent sections like `/about` and
  `/about/services` are directly reachable while still exposing child menus
- placeholder pages for the current navigation structure
- a search UI shell routed to a local placeholder page

## Content architecture

Stable site structure and homepage chrome content live locally:

- `src/content-models/pages.ts`
- `src/content-models/homepage-content.ts`
- `src/content-models/research-content.ts`
- `src/content-models/about-content.ts`
- `src/content-models/bber-about-people.ts`

Production-host rule:

- `https://bber.unm.edu` is the deployment host for this app, not an external
  dependency.
- Internal page links, downloads, and stable imagery should resolve through
  local routes or `public/` assets instead of hardcoded absolute
  `https://bber.unm.edu/...` URLs.

Live CMS feeds currently come from:

- `https://api.bber.unm.edu/api/bber-news?limit=3`
- `https://api.bber.unm.edu/api/bber-news/indexes`
- `https://api.bber.unm.edu/api/bber-news/?year=YYYY&month=M&limit=100`
- `https://api.bber.unm.edu/api/staff`
- `https://api.bber.unm.edu/api/directors`
- `https://api.bber.unm.edu/api/bber-research/publications?limit=5`
- `https://api.bber.unm.edu/api/bber-research/publications?featured=true`
- `https://api.bber.unm.edu/api/bber-research/publications/indexes`
- `https://api.bber.unm.edu/api/bber-research/publications?year=YYYY&category=ID&community=ID&limit=100`
- `https://api.bber.unm.edu/api/data/rest/metadata?api=tablevalues&table=s0801&variables=[...]`
- `https://api.bber.unm.edu/api/data/rest/bbertable?table=s0801&...`

Those payloads are fetched on the server, normalized into app-owned view
models, and then rendered by route-specific UI components.

The external chart prototype uses `@observablehq/plot` for the first reusable
time-series renderer while keeping normalization, formatting, and chart-frame
concerns separate for future visualization types.

The economic indicators dashboard extends that same pattern with a reusable line
renderer, a server-only adapter for multiple BBER REST tables, compact
dashboard-level time filtering, per-card metric selectors, and researcher-facing
download actions for API links, direct JSON, and CSV ZIP exports.

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

## Notes

- Navigation routes are powered by the local page tree, not a CMS.
- Parent items in the global header are both landing pages and menu groups:
  clicking the label navigates to the page, while the chevron opens the child
  menu with an `Overview` link first.
- Section sidebars are also powered by the local page tree, so section landing
  pages and leaf pages share one consistent navigation pattern.
- Shared imagery used by the homepage shell and research overview page is stored
  in `public/bber/`.
- Stable About page imagery that previously referenced the live site directly is
  now stored locally under `public/bber/about/`.
- Static About pages are local-content pages rendered through a dedicated About
  route layer, while staff and director directories/bio pages are fetched from
  the live CMS through the same route layer.
- The staff directory is split from the CMS feed into current employees and a
  collapsed `Past Employees` section based on `stoppedWorkingDate`.
- Homepage feed failures are handled with section-level empty or error states so
  the page still renders cleanly.
- News archive filters are URL-driven and mirror the live BBER year/month API
  contract.
- Publications filters are URL-driven so the page can be linked directly to a
  filtered archive view.
- The external chart prototype is also URL-driven so metric and selector state
  can be shared directly.
- The economic indicators dashboard recreates the live `/data/econindicators/`
  page with multiple charts on one page, a compact time toggle, a local search
  field for quickly narrowing cards, and shared Plot-based line rendering.
- The contact page uses a client-side mailto form for demo-safe interaction
  without introducing a backend email dependency.
