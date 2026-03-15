# ARCHITECTURE.md

## Overview

This project is a Next.js App Router site for the UNM Bureau of Business and
Economic Research. The current implementation focuses on a close recreation of
the public homepage plus the first real research routes while establishing the
long-lived structure for CMS-driven content and reusable shared chrome.

The app is expected to ship on `https://bber.unm.edu`, so that hostname should
be treated as the app's own production origin rather than as an external site
dependency.

## Current architectural shape

### Shared site shell

- `src/app/layout.tsx` owns the root document, metadata, and shared site shell.
- `src/components/site/site-header.tsx` is mostly server-rendered and hands only
  the interactive navigation layer to a client component.
- `src/components/site/site-footer.tsx` is shared across the homepage,
  placeholder routes, search, and not-found states.
- `src/components/site/interactive-primary-nav.tsx` uses a website-style split
  navigation pattern so parent IA nodes remain clickable pages instead of being
  trapped behind menu triggers.

### Local content boundaries

Stable, low-churn site content is modeled locally instead of being embedded in
JSX:

- `src/content-models/pages.ts` contains the site tree, helper functions for
  route resolution, and the navigation contract used by the header,
  placeholder routes, and section sidebars.
- `src/content-models/homepage-content.ts` contains utility-bar links, brand
  assets, homepage promo content, About BBER copy, and footer data.
- `src/content-models/research-content.ts` contains the stable copy and local
  imagery for the research landing page.
- `src/content-models/news-content.ts` contains the stable copy for the news
  archive page.
- `src/content-models/about-content.ts` contains the static About section
  content, including services, history, helpful links, and contact content.
- `src/content-models/colonias-content.ts` contains the Colonias methodology
  page content plus the county-grouped colonia map directory.
- `src/content-models/cpi.ts` contains the normalized CPI route model for the
  trend chart, annual table, source metadata, and supporting public copy.
- `src/content-models/location-quotient.ts` contains the QCEW request
  contract, metadata normalization helpers, LQ math, frame validation rules,
  and the page model for the location quotient portfolio.

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
- `src/lib/cms/bber-about.ts` performs the staff and directors fetches for the
  About section.
- `src/content-models/bber-about-people.ts` validates and normalizes raw staff
  and director payloads into the existing About page view models.
- `src/lib/cms/bber-data-conferences.ts` performs the NM Data Users Conference
  fetches for the conference index, archive group, and individual conference
  detail pages.
- `src/content-models/bber-data-conferences.ts` validates and normalizes the
  `bber-data-pages` conference payloads into app-owned index/detail page models
  and parses conference body content into renderable blocks.
- `src/lib/external-bber.ts` performs server-only fetches against the BBER REST
  metadata and `bbertable` endpoints for external chart routes.
- `src/content-models/external-bber.ts` validates selector values, curates the
  initial metric catalog, and normalizes raw REST responses into app-owned
  chart view models.
- `src/lib/econindicators.ts` performs server-only fetches against multiple
  BBER REST `bbertable` datasets for the economic indicators dashboard and
  normalizes each source into card-ready line-series models.
- `src/content-models/econindicators.ts` defines the dashboard card catalog,
  metric catalogs, response-level filters for noisy upstream datasets, and the
  shared line-series content contract.
- `src/lib/cpi.ts` performs server-only fetches against the BBER REST `v_cpi`
  and `cpitab` endpoints, normalizes the monthly trend and annual table
  separately, and keeps partial or failed sections reviewable in the page UI.
- `src/lib/location-quotient.ts` performs server-only fetches against QCEW
  table and metadata endpoints, requests both selected-ownership numerators and
  all-ownership denominators, and normalizes the joined result into frame-based
  bubble-scatter data.

The publications archive mirrors the live BBER contract:

- `featured=true` for the default publications view
- `indexes` for category, community, and year filter options
- `year`, `category`, and `community` query params for filtered results

The news archive mirrors the live BBER contract:

- `indexes` for available year/month combinations
- `year` and `month` query params for archive results
- a local `q` filter applied only after the raw archive response is normalized

The staff and directors pages mirror the live BBER contract:

- `GET /api/staff` for the current staff directory and current staff bios
- `GET /api/directors` for the director history directory and director bios
- staff are grouped by `stoppedWorkingDate`, with current employees in the main
  grid and past employees in a collapsed directory section
- profile routes are derived from the upstream `slug`

## Route strategy

- `/` is the fully implemented homepage.
- `/news` is a dynamic server-rendered archive page backed by live CMS data and
  URL-based filters.
- `/research` is a local-content landing page that matches the live research
  section structure.
- `/research/publications` is a dynamic server-rendered archive page backed by
  live CMS data and URL-based filters.
- `/about` is a real local-content section landing page.
- `/about/[...slug]` renders a hybrid About section:
  static section pages come from local content, while `/about/staff`,
  `/about/directors`, and their bio subpages are fetched from the live CMS and
  normalized before rendering.
- `/subscribers` is a real local-content section landing page.
- `/subscribers/[...slug]` renders local subscriber pages such as FOR-UNM
  access and the privacy policy through a dedicated content model rather than
  the generic placeholder route.
- `/external/test` is a dynamic server-rendered prototype route for external
  BBER REST data, currently seeded with the `s0801` commuting series and a
  reusable chart frame intended for future line, bar, and other statistical
  renderers.
- `/data/apidoc` is a local static documentation route for the public data API,
  with route-owned copy and examples instead of embedded backend tooling.
- `/data/colonias` is a local static section page for colonia methodology,
  downloads, and reference materials.
- `/data/colonias/nm-colonia-maps` is a local static directory page for
  county-grouped colonia map PDFs published through `api.bber.unm.edu`.
- `/data/cpi` is a dynamic server-rendered CPI route that reads the live BBER
  REST monthly trend and annual table endpoints while reusing the shared line
  renderer contract.
- `/data/location-quotient` is a dynamic server-rendered QCEW route that
  compares a local geography against a reference geography, computes
  location-quotient shares plus base-year growth on the server, and renders the
  result as an animated bubble portfolio with a synchronized industry table.
- `/data/nm-duc` is a live CMS-backed conference landing page that reads the
  `duc-index` record plus the `data-conferences` archive feed from
  `api.bber.unm.edu`.
- `/data/nm-duc/[slug]` renders individual conference pages from the same live
  archive contract and keeps dynamic params enabled so new conference slugs can
  resolve automatically after upstream updates.
- `/data/econindicators/` is a dynamic server-rendered dashboard route that
  recreates the live multi-chart indicators page from BBER REST sources while
  reusing one shared client line renderer across all cards.
- `/search` is a local placeholder route used by the shared search UI shell.
- `app/[...slug]/page.tsx` resolves known URLs from `pages.ts` and renders
  placeholder pages for the current navigation structure.
- Unknown paths use `notFound()` and fall through to `app/not-found.tsx`.

The placeholder route uses `generateStaticParams` and `dynamicParams = false` so
known nav paths are statically discoverable and unknown paths 404 cleanly.

## Section navigation strategy

Nested section pages use one shared sidebar pattern driven entirely by
`src/content-models/pages.ts`:

- `src/components/site/section-page-shell.tsx` applies the shared two-column
  section layout for pages that participate in section navigation.
- `src/components/site/section-sidebar.tsx` renders the sidebar with shadcn
  `Card`, `Button`, `Accordion`, and `Separator` primitives.
- `getSectionSidebarModel()` in `src/content-models/pages.ts` derives the
  sidebar model from a pathname instead of from route-local link lists.

Sidebar behavior is intentionally hybrid:

- section landing pages show their child pages
- leaf pages show their siblings under the same parent
- `Go Back` always targets the parent section, or `/` for top-level section
  roots

This keeps header navigation, placeholder routing, and left-rail section
navigation aligned to the same local information architecture source.

## Primary header navigation strategy

The global header navigation is also driven entirely from
`src/content-models/pages.ts`.

- `getPrimaryNavigationBranches()` and `getNavigationBranch()` derive recursive
  menu branches from the page tree.
- Every parent node stays a real page link.
- A separate chevron control opens the submenu on desktop and mobile.
- Each submenu begins with a synthetic `Overview` item that points to the
  parent page itself.
- Nested parents follow the same split-link pattern recursively.

This avoids the common site-navigation failure mode where parent landing pages
like `/about` or `/about/services` exist in the route tree but are unreachable
from the primary navigation because the menu trigger consumes the interaction.

## Server and client boundaries

### Server components

Use server components for:

- page rendering
- CMS fetching
- payload normalization handoff
- reading route search params for publications filters
- reading route search params for news filters
- route resolution for placeholders
- route resolution for local About pages and CMS-backed About people pages
- metadata and shell composition

### Client components

Use client components only where interaction is required:

- desktop dropdown navigation
- mobile sheet navigation
- accordion disclosure in the mobile menu
- split-link desktop and mobile header menu controls for parent pages
- accordion disclosure in the mobile section sidebar
- publications filter controls that update the URL with sanctioned query params
- news filter controls that update the URL with sanctioned query params
- the About contact form, which uses a client-side mailto handoff and live word
  count
- the collapsed past-employees disclosure on `/about/staff`

Homepage, research landing, and publication result content all remain
server-rendered. The news archive list is also server-rendered.

The Subscribers section uses the same server-rendered local-content pattern:

- route content comes from `src/content-models/subscribers-content.ts`
- `/subscribers/forunm/` may present access UI without simulating unsupported
  backend auth flows
- privacy and subscriber-information copy stay local and reviewable

The NM Data Users Conference section uses a CMS-backed long-form content
pattern:

- the route fetches the conference index page and archive feed on the server
- conference body content is normalized before rendering, including inline
  links, images, headings, lists, and local-route rewrites for first-party BBER
  links
- detail pages reuse the same archive feed so sidebar navigation and the latest
  conference card stay in sync with upstream content
- new conference pages must be discoverable from the archive feed without
  adding hardcoded slugs to the route layer

The external chart route keeps the same boundary:

- the page and data-fetch layer remain server-rendered
- selector interaction and Plot rendering live in a single client entry point
- chart renderers consume only normalized chart-series props, not raw API
  payloads

The economic indicators dashboard follows the same boundary:

- the route fetches and normalizes all indicator cards on the server
- upstream quirks such as ignored query filters or formatted currency strings
  are resolved inside the adapter layer rather than in the UI
- the dashboard client owns only presentation-level search, metric selection,
  and shared time-window filtering
- every card reuses the shared line renderer contract in
  `src/visualizations/charts/external/line-graph.tsx`

The CPI route follows the same visualization boundary:

- the route fetches the monthly trend and annual table on the server
- raw API payloads are normalized before reaching the page renderer
- the shared Plot-based line renderer receives only normalized time-series
  points and formatting metadata
- trend summary copy, latest values, and coverage labels are derived from the
  current normalized series rather than hardcoded into the page
- chart downloads are served through a local route handler so JSON exports and
  CSV ZIP generation stay server-owned and reusable across future dashboards
- the client only owns the download menu interaction and the API-link modal

The location quotient route follows the same visualization boundary:

- the route fetches local, reference, base-year, and denominator datasets on
  the server
- raw QCEW rows and metadata are normalized before they reach the client
- the client owns only frame playback, year selection, and synchronized table
  presentation
- the Plot renderer receives one normalized frame at a time instead of raw
  multi-year API payloads
- data-quality filtering for aggregate codes, missing base-year employment, and
  zero denominators stays inside the server normalization layer

The API documentation page follows a different boundary:

- route content is local and static rather than fetched from an external source
- the page documents supported read-only API behavior only
- unsupported backend-only features should be omitted from public UI instead of
  rendered as placeholders

The Colonias section follows a local-content boundary:

- live-site and network inspection should be performed before assuming a CMS
  source, because the page currently behaves like editorial content with linked
  files rather than a dedicated API feed
- page copy, downloadable resource metadata, and the county-grouped map
  directory live in a reviewable local content model
- published XLS, ZIP, and PDF assets still resolve to `api.bber.unm.edu`

## Asset strategy

Stable homepage shell assets are stored locally in `public/bber/`:

- horizontal BBER logo
- hero image
- section header art
- conference and forecast promo banners
- research overview sample image

Stable About-section shell assets are also stored locally in `public/bber/about/`
so the app does not depend on the current `bber.unm.edu/assets/**` host at
runtime.

Publication cards use remote CMS-hosted feature images through `next/image`
remote patterns limited to `https://api.bber.unm.edu/api/files/**`.

The About section still uses remote CMS images from one bounded upstream host:

- `https://api.bber.unm.edu/api/files/**` and
  `https://api.bber.unm.edu/uploads/**` for portraits and service imagery

Internal navigation inside local content models should use route constants from
`src/content-models/pages.ts` or root-relative paths. Do not hardcode
`https://bber.unm.edu/...` for first-party pages, because those links should
resolve within this app after deployment.
