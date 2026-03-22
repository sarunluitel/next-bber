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
- a fully implemented Subscribers section with local-content landing, privacy
  policy, and FOR-UNM access pages
- a live CMS-backed news archive at `/news`
- a local-content research landing page at `/research`
- a live CMS-backed publications page at `/research/publications`
- a local Data landing page at `/data` with live preview cards for
  location-quotient and U.S. population data
- a live BBER REST API statewide dashboard at `/data/nm-statewide/`
- a live BBER REST API economic indicators dashboard at `/data/econindicators/`
- a live BBER REST API CPI page at `/data/cpi`
- a live BBER REST API data portal at `/data/bberdb/` with staged dataset and
  filter loading plus first-party query/download routes
- a live BBER REST API RGIS map explorer at `/data/rgis/` with shared staged
  selectors, Leaflet choropleth rendering, first-party map/download routes,
  and multi-year year-frame switching
- a first-party API documentation page at `/data/apidoc`
- a local Open Data subsection at `/data/open-data/` with four local child
  resource pages for UNM, Albuquerque, the Sunshine Portal, and Data.gov
- a live CMS-backed NM Data Users Conference section at `/data/nm-duc/` with
  automatically discoverable conference detail pages
- a Colonias section at `/data/colonias/` with a local methodology page and a
  county-grouped colonia maps directory
- a local NM Statewide Gross Receipts reference page at
  `/data/nm-statewide/gross-receipts/`
- live server-side CMS feeds for homepage news and publications
- a local `pages.ts` site tree used for navigation and section sidebars
- a shared data-driven section sidebar for nested pages under Data, Research,
  Subscribers, and About
- a split-link primary navigation pattern so parent sections like `/about` and
  `/about/services` are directly reachable while still exposing child menus
- explicit `NotYetImplemented` route files for the remaining unfinished pages
- a search UI shell routed to a local `NotYetImplemented` page

## Content architecture

Stable site structure and homepage chrome content live locally:

- `src/content-models/pages.ts`
- `src/content-models/homepage-content.ts`
- `src/content-models/research-content.ts`
- `src/content-models/about-content.ts`
- `src/content-models/colonias-content.ts`
- `src/content-models/data-static-pages.ts`
- `src/content-models/subscribers-content.ts`
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
- `https://api.bber.unm.edu/api/data/rest/metadata?api=tablevariables&table=TABLE_NAME`
- `https://api.bber.unm.edu/api/data/rest/bbertable?table=s0801&...`
- `https://api.bber.unm.edu/api/data/rest/bbertable?table=TABLE_NAME&...`
- `https://api.bber.unm.edu/api/data/rest/bbertable?table=qcew&...`
- `https://api.bber.unm.edu/api/data/rest/bbertable?table=v_cpi&stfips=00&areatype=06&area=0000`
- `https://api.bber.unm.edu/api/data/rest/cpitab?areatype=00`
- `https://api.bber.unm.edu/api/data/rest/makemap?table=TABLE_NAME&...`
- `https://api.bber.unm.edu/api/bber-data-pages/duc-index`
- `https://api.bber.unm.edu/api/bber-data-pages?group=data-conferences`
- `https://api.bber.unm.edu/api/bber-data-pages/{slug}`

Those payloads are fetched on the server, normalized into app-owned view
models, and then rendered by route-specific UI components.

The Data landing page at `/data` is a local editorial route that mirrors the
live section overview while reusing server-fetched preview cards for the latest
location quotient and United States population pyramid frames.

The statewide dashboard at `/data/nm-statewide/` uses compact, reusable chart
cards for location quotient, educational attainment, population pyramid, and
three time-series feeds. Each card owns its variable selector, animation
controls when needed, muted source line, and shared API/JSON/CSV download menu
so the same primitives can move across dashboards without dragging page-sized
tables, summaries, or source panels with them.

The economic indicators dashboard extends that same pattern with a reusable line
renderer, a server-only adapter for multiple BBER REST tables, compact
dashboard-level time filtering, per-card metric selectors, and researcher-facing
download actions for API links, direct JSON, and CSV ZIP exports.

The CPI page reuses that same Observable Plot line renderer for the published
monthly CPI-U series while keeping the annual table and source metadata in a
separate server-normalized route model.

The BBER data portal at `/data/bberdb/` keeps the 75-table dataset catalog and
category labels local, derives visible filter controls from live
`tablevariables` and `tablevalues` metadata per table, and holds draft filter
changes separate from the currently loaded table until the user clicks `Load`.
The page exposes first-party filter, table, and download routes under
`/api/bberdb/*` so the same normalization boundary can later feed maps, charts,
and dashboards without re-parsing raw REST responses inside client components.
When the upstream API times out or rejects a table such as `sf1p1`, the page
now renders an inline upstream-unavailable state instead of crashing the route.
The loaded table keeps year options and row ordering newest-first, exposes
`periodyear` as a comma-separated multi-select that follows the public BBER API
contract, promotes geography/time/industry context columns ahead of metrics,
compacts long multi-geography titles, and wraps trailing qualifiers such as
`(Percent Allocated)` onto stacked header lines in the table UI. The route also
ships with a staged loading screen that cycles through table/filter status
messages while the initial server render is assembling the page.
The shared download stack now uses one API-endpoint modal across statewide
cards, economic indicators, and BBER DB queries, with first-party
`format=api` routes returning descriptor payloads for the reusable modal rather
than opening the upstream endpoint immediately.

The RGIS route at `/data/rgis/` extends that same shared data-bank stack
instead of building a second metadata pipeline. It reuses the local dataset
catalog, staged draft-versus-applied selector flow, and shared API endpoint
modal, but swaps the applied data fetch to the live `makemap` GeoJSON
endpoint. The loaded response is normalized once on the server and then drives
both a Leaflet choropleth map and the right-hand metric panel. Multi-year
queries stay comma-separated in the shared query model, the UI groups the
loaded features into explicit year frames with an active-year switcher, and
RGIS downloads now bundle `<table>.xml` metadata alongside GeoJSON and
shapefile exports through `/api/rgis/*`. The Leaflet map keeps its legend below
the map pane, uses a wide fit for world-spanning extents such as the full U.S.
view, and allows horizontal world wrapping instead of clamping drag movement to
one copy of the map.

The location quotient, donut, and population pyramid visualizations now live as
portable primitives inside the statewide dashboard instead of as standalone
prototype routes.

The API documentation page is a local, static route that presents public API
guidance for researchers and faculty while omitting unsupported backend-only
operations tooling from the rendered page.

The NM Data Users Conference section is driven directly from the BBER data-pages
API, with the conference index and detail slugs normalized on the server so new
conference pages can appear without hardcoded route edits.

The Colonias section is implemented as local structured content after live-site
inspection showed editorial copy and file links rather than a separate
`api.bber.unm.edu` content feed for the page itself.

The Open Data subsection and the NM Statewide Gross Receipts page are also now
implemented as local structured-content pages. They reuse a shared static
resource renderer so link-heavy pages can stay server-rendered, audience-facing,
and free of live BBER API dependencies when the live site is purely editorial.

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

## Deployment

AWS Amplify Gen 2 can use the root [amplify.yml](/Users/sarunsair/Documents/Projects/next-bber/amplify.yml) build
spec in this repo. It enables Corepack, installs dependencies with `pnpm`,
builds the Next.js app, publishes the `.next` output, and caches both the
local pnpm store and Next.js build cache between deploys.

Current deployment caveat:

- The repo currently uses Next.js `16.2.0`, while AWS Amplify's published SSR
  support still documents versions `12` through `15`. The included build spec
  is the closest supported shape for this app, but the hosting runtime may
  still need a future Amplify update before production deployment is reliable.

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
- Subscribers pages are local-content pages rendered through a dedicated
  Subscribers route layer, with the FOR-UNM page presenting the current access
  UI without inventing unsupported authentication behavior.
- The staff directory is split from the CMS feed into current employees and a
  collapsed `Past Employees` section based on `stoppedWorkingDate`.
- Homepage feed failures are handled with section-level empty or error states so
  the page still renders cleanly.
- News archive filters are URL-driven and mirror the live BBER year/month API
  contract.
- Publications filters are URL-driven so the page can be linked directly to a
  filtered archive view.
- The `/data` landing page now mirrors the live section overview with local
  editorial copy, shared Data-section navigation, and two server-fetched
  preview charts rendered from the same app-owned normalization boundary used
  elsewhere in the site, including compact play, pause, previous, and next
  controls for both preview timelines.
- The statewide dashboard recreates the live `/data/nm-statewide/` page with
  six compact chart cards, portable chart-level controls, and shared download
  actions backed by `/api/chart-download/[chartId]`.
- The economic indicators dashboard recreates the live `/data/econindicators/`
  page with multiple charts on one page, a compact time toggle, a local search
  field for quickly narrowing cards, and shared Plot-based line rendering.
- The CPI page reads the live `v_cpi` and `cpitab` endpoints on the server,
  renders the monthly CPI-U trend through the shared line graph component, and
  keeps the annual table tied to the same live data boundary.
- The `/data/bberdb/` portal keeps the dataset catalog local, derives filter
  controls from live metadata per table, and exposes first-party
  `/api/bberdb/filters`, `/api/bberdb/table`, and `/api/bberdb/download`
  routes so future runtime visualizations can reuse the same normalized query
  contract.
- The shared BBER data-bank default selection for both `/data/bberdb/` and
  `/data/rgis/` is now `Gross Receipts` (`v_rp80`) with `County`,
  `2025, 2024`, `Monthly`, `Total` industry, and `Total` ownership so both
  pages open on the same economic dataset and selector state.
- The BBER DB year filter is a true multi-select, and outgoing `periodyear`
  values must stay comma-separated to match the supported API contract already
  documented on `/data/apidoc`.
- The `/data/rgis/` route reuses that same shared query and metadata contract,
  but loads `makemap` GeoJSON for Leaflet rendering, keeps hover and pinned
  geography state client-side, and exposes `/api/rgis/filters`,
  `/api/rgis/map`, and `/api/rgis/download` for first-party map and export
  flows.
- RGIS downloads must keep the XML metadata sidecar with the spatial data.
  `GeoJSON + XML` and `Shapefile + XML` are delivered as zip archives built
  from the same normalized payload used by the map UI.
- The data portal intentionally fast-fails upstream metadata and table calls
  into inline error states so the page can still render and recover from
  temporary REST outages instead of failing the full route.
- The `/data/bberdb/` page itself now renders dynamically with a client-side
  recovery pass after degraded first loads, and the upstream adapter accepts
  the live `tablevariables` `{ columns: [...] }` payload shape before deriving
  visible filters.
- The API documentation page keeps the endpoint and parameter guidance local to
  this repo so the site can present supported API capabilities without
  exposing unfinished backend features in the public UI.
- Any visible site copy should read as finished audience-facing content for
  researchers, faculty, policymakers, students, and public-sector partners.
  Implementation notes, future-facing engineering rationale, and agent process
  language belong in comments or docs, not in rendered HTML.
- The NM Data Users Conference section mirrors the live `duc-index` and
  `group=data-conferences` API contract, and detail pages must stay data-driven
  so new conference records can render automatically when the upstream content
  changes.
- The Colonias routes keep their page copy and county-grouped map directory in a
  local content model while linking directly to the published BBER file assets
  on `api.bber.unm.edu`.
- The contact page uses a client-side mailto form for demo-safe interaction
  without introducing a backend email dependency.


# PERSONAL TODO
check all the publications  and presentation numbers on strapi
create 1 page demo for mrcog and center for women. show it on their site with new domain. 
