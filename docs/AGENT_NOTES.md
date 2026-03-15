# AGENT_NOTES.md

This file is the decision and audit ledger for architectural, dependency, workflow, and policy changes that affect how agents and humans work in this repository.

## Entry Template

### YYYY-MM-DD - Title
- **Status:** proposed | accepted | superseded
- **Area:** architecture | dependency | security | workflow | docs | performance | routing | auth | cms | visualization | build
- **Context:**
- **Decision:**
- **Why:**
- **Validation:**
- **Docs updated:**
- **Follow-up:**

---

## 2026-03-15 - Implement the `/data` section landing page with live previews
- **Status:** accepted
- **Area:** routing, visualization, architecture, docs
- **Context:** The Data section root still fell through to the generic
  placeholder route, while the live site already uses `/data/` as a real
  editorial landing page with section guidance and two lightweight preview
  visualizations under “Beyond New Mexico.”
- **Decision:** Add a dedicated `/data` route backed by a local content model,
  reuse the shared section shell and sidebar, and fetch the latest location
  quotient plus United States population pyramid frames on the server for two
  preview cards. Keep the editorial body local, keep the preview math in the
  existing normalization layer, and degrade gracefully when either preview feed
  fails instead of letting the page crash.
- **Why:** The Data landing page is part of the public information
  architecture, not just a navigation stub, and using the existing chart
  renderers for preview cards keeps the implementation compact and reviewable.
- **Validation:** Live-page and network inspection for
  [the production Data landing page](https://bber.unm.edu/data/), `pnpm lint`,
  `pnpm build`, Next.js MCP `get_errors`, and browser verification for the
  local `/data/` route with both preview charts rendered.
- **Docs updated:** `README.md`, `docs/AGENT_NOTES.md`,
  `docs/ARCHITECTURE.md`, `docs/VISUALIZATION_GUIDE.md`
- **Follow-up:** If the section later needs more preview cards, keep the page
  editorial-first and reuse the existing normalization helpers instead of
  adding a second dashboard-specific chart stack.

## 2026-03-15 - Add playback controls to `/data` preview charts
- **Status:** accepted
- **Area:** visualization, docs
- **Context:** The new `/data/` landing page shipped with live preview cards,
  but the location quotient and United States population pyramid previews were
  fixed to the latest year only.
- **Decision:** Pass the full frame series for both previews through the
  server-normalized page model and wrap each preview in a compact client
  controller with shared previous, play or pause, and next actions.
- **Why:** The landing page now matches the intended “Beyond New Mexico”
  interaction pattern without promoting those previews into full dashboard
  cards.
- **Validation:** `pnpm lint`, `pnpm build`, Next.js MCP `get_errors`, and
  browser verification on the local `/data/` route confirming the location
  quotient and population pyramid preview years advance through their time
  series.
- **Docs updated:** `README.md`, `docs/AGENT_NOTES.md`
- **Follow-up:** If the preview cards later gain scrubbers or download actions,
  keep the controls compact so the page remains an overview rather than a
  second dashboard surface.

## 2026-03-15 - Rebuild `/data/nm-statewide/` with portable chart cards
- **Status:** accepted
- **Area:** visualization, architecture, routing, docs
- **Context:** The live statewide dashboard is a dense six-chart page with
  compact in-card controls, hover-driven tooltips, and per-chart downloads, but
  the repo still reflected an earlier prototype phase where location quotient,
  population pyramid, and donut work lived on standalone routes with larger
  page wrappers, tables, and route-specific chrome.
- **Decision:** Replace the placeholder `/data/nm-statewide/` route with a
  production-style six-card dashboard, introduce a shared compact card shell
  plus reusable selector, playback, and download controls, generalize the QCEW
  location-quotient adapter to support the six production metrics, and add a
  shared `/api/chart-download/[chartId]` export route for API, JSON, and CSV
  ZIP downloads. Remove the standalone prototype routes for `/external/test`,
  `/external/pyramid-test`, `/external/donut`, and `/data/location-quotient`
  after their reusable normalization and rendering logic was folded into the
  dashboard primitives.
- **Why:** The live page needs dense reusable cards rather than page-sized chart
  experiences, and keeping controls plus downloads inside portable primitives
  makes the charting layer reusable across dashboards without carrying bulky
  tables, prose, or source panels into every use.
- **Validation:** Live-page and network inspection for
  [the production statewide dashboard](https://bber.unm.edu/data/nm-statewide/),
  `node --test src/content-models/location-quotient.test.ts`,
  `node --test src/content-models/nm-statewide-dashboard.test.ts`,
  `pnpm lint`, `pnpm build`, Next.js MCP `get_errors`, and browser verification
  on the local `/data/nm-statewide` route covering card rendering, selector
  changes, and location-quotient playback.
- **Docs updated:** `README.md`, `docs/AGENT_NOTES.md`,
  `docs/ARCHITECTURE.md`, `docs/VISUALIZATION_GUIDE.md`
- **Follow-up:** If future dashboards need tabular drill-downs, keep them as
  separate primitives or route-level additions instead of expanding the compact
  chart-card contract.

## 2026-03-15 - Add an educational attainment donut route from `dp02`
- **Status:** superseded
- **Area:** visualization, architecture, routing, docs
- **Context:** The live statewide dashboard includes a donut showing the
  highest educational attainment reported among adults ages 25 and over, and
  the repo needed a dedicated local route that recreates that chart from the
  published `dp02` REST response instead of freezing values into page markup.
- **Decision:** Add `/external/donut`, introduce a `dp02` content model plus
  server adapter, normalize the published attainment fields into ordered donut
  slices with live share and total derivation, and render the result with a
  dedicated SVG donut plus a synchronized audit table fallback.
- **Why:** This keeps the educational-attainment variable mapping, metadata
  labels, and share math reviewable on the server while matching the external
  chart architecture already established elsewhere in the repo.
- **Validation:** Live-page inspection and network inspection for
  `/data/nm-statewide/`, `node --test src/content-models/education-donut.test.ts`,
  `pnpm lint`, `pnpm build`, Next.js MCP `get_errors`, and browser verification
  for `/external/donut` confirming seven slices, seven audit rows, and the
  expected statewide 2023 total.
- **Docs updated:** `README.md`, `docs/AGENT_NOTES.md`,
  `docs/ARCHITECTURE.md`, `docs/VISUALIZATION_GUIDE.md`
- **Follow-up:** If this route later gains geography or year controls, keep
  the current server-normalized slice contract so the client does not become an
  ad hoc `dp02` parser.

## 2026-03-15 - Correct population pyramid orientation and frame controls
- **Status:** superseded
- **Area:** visualization, docs
- **Context:** The first `/external/pyramid-test` pass rendered age bands from
  youngest to oldest, and duplicate `pep_cc` rows in 2020-2022 surfaced as
  React key errors when the selected year changed.
- **Decision:** Reverse the chart display order so the oldest cohorts render at
  the top, deduplicate repeated age-band rows by keeping the latest `time`
  value per year and age group, and tighten the frame controller so previous,
  next, play, and pause operate on one stable selected-year state.
- **Why:** The pyramid now matches the expected visual convention and the
  client no longer reintroduces runtime errors while users scrub or autoplay
  through annual frames.
- **Validation:** `node --test src/content-models/population-pyramid.test.ts`,
  `pnpm lint`, `pnpm build`, Next.js MCP `get_errors`, and browser verification
  for `/external/pyramid-test` covering reversed age labels plus frame-control
  state changes.
- **Docs updated:** `docs/AGENT_NOTES.md`
- **Follow-up:** If the upstream API later exposes a cleaner deduped series,
  preserve the current server-side normalization guard until the new contract
  is verified.

## 2026-03-15 - Add a population pyramid prototype route from `pep_cc`
- **Status:** superseded
- **Area:** visualization, architecture, routing, docs
- **Context:** The live statewide dashboard includes a population pyramid fed by
  the `pep_cc` REST table, and the repo needed a dedicated local route that
  reproduces that annual age-by-sex animation with a clearer reviewable
  adapter boundary.
- **Decision:** Add `/external/pyramid-test`, introduce a `pep_cc` content
  model plus server adapter, normalize annual age-band rows into one frame per
  year, derive totals when the upstream total row is absent, and render the
  result through a client SVG pyramid explorer with playback controls and a
  synchronized current-year table.
- **Why:** This keeps the age-label mapping, total derivation, and animation
  state explicit and reviewable while matching the existing external-data page
  architecture used elsewhere in the repo.
- **Validation:** Live-page inspection and network inspection for
  `/data/nm-statewide/`, `node --test src/content-models/population-pyramid.test.ts`,
  `pnpm lint`, `pnpm build`, Next.js MCP `get_errors`, and browser verification
  for `/external/pyramid-test` including playback and year scrubber updates.
- **Docs updated:** `README.md`, `docs/AGENT_NOTES.md`,
  `docs/ARCHITECTURE.md`, `docs/VISUALIZATION_GUIDE.md`
- **Follow-up:** If this prototype later gains geography selectors, preserve
  the current server-normalized frame contract instead of moving age cleanup or
  total derivation into the client.

## 2026-03-15 - Add a QCEW location quotient portfolio route
- **Status:** superseded
- **Area:** visualization, architecture, routing, docs
- **Context:** The Data section needed a public location quotient view that can
  compare one configured geography with a reference geography, animate the
  yearly industry portfolio, and stay reusable for later geography swaps
  without hardcoding New Mexico-specific chart math into the client.
- **Decision:** Add `/data/location-quotient`, introduce a QCEW-specific server
  adapter plus page contract, fetch selected-ownership numerators alongside
  all-ownership denominator totals, compute BLS-style location quotients and
  local base-year growth on the server, and render the result through a client
  Plot bubble chart with playback controls and a synchronized audit table.
- **Why:** This keeps the multi-endpoint QCEW join logic reviewable, preserves
  the server/client boundary used by the other data pages, and avoids freezing
  transient specialization or growth statements into static copy.
- **Validation:** `node --test src/content-models/location-quotient.test.ts`,
  `pnpm lint`, `pnpm build`, Next.js MCP `get_errors`, and browser verification
  for `/data/location-quotient` including frame playback and table updates.
- **Docs updated:** `README.md`, `docs/AGENT_NOTES.md`,
  `docs/ARCHITECTURE.md`, `docs/VISUALIZATION_GUIDE.md`
- **Follow-up:** If the route later gains end-user geography selectors, keep
  the current request contract and server join rules intact rather than moving
  denominator logic into URL or client-only helpers.

## 2026-03-15 - Implement the CPI page with shared line-chart rendering
- **Status:** accepted
- **Area:** visualization, architecture, routing, docs
- **Context:** The Data navigation already exposed `/data/cpi`, and live-site inspection showed that the page reads monthly CPI trend data and an annual CPI table from `api.bber.unm.edu` rather than relying on static page-local values.
- **Decision:** Add a dedicated `/data/cpi` route, fetch `bbertable?table=v_cpi...` plus `cpitab?areatype=00` on the server, normalize the monthly trend, annual table, and source metadata into a CPI page model, and render the trend with the shared Observable Plot line renderer already used by other data pages.
- **Why:** This keeps the CPI page tied to the live API contract, avoids stale hardcoded summaries, and extends the shared chart system to another public research route without creating a one-off visualization stack.
- **Validation:** Live-page and network inspection for `/data/cpi/`, `pnpm lint`, `pnpm build`, Next.js MCP `get_errors`, and browser verification for the local `/data/cpi` route.
- **Docs updated:** `README.md`, `docs/AGENT_NOTES.md`, `docs/ARCHITECTURE.md`, `docs/VISUALIZATION_GUIDE.md`
- **Follow-up:** If the CPI page later needs downloads or comparison views, keep them on the same server-normalized contract instead of branching into client-only transforms.

## 2026-03-15 - Implement the Colonias section as local structured content
- **Status:** accepted
- **Area:** routing, public content, docs
- **Context:** The Data navigation already exposed `/data/colonias/`, but the route still fell through to placeholder content. Live-site inspection showed editorial content and file links for the Colonias pages rather than a dedicated `api.bber.unm.edu` page-data feed.
- **Decision:** Add dedicated `/data/colonias` and `/data/colonias/nm-colonia-maps` routes backed by a local Colonias content model, preserving the live methodology copy, downloadable file links, and county-grouped map directory while keeping published assets pointed at `api.bber.unm.edu`.
- **Why:** This gives the public site a finished Colonias section without inventing a CMS boundary that the live page does not currently expose.
- **Validation:** Live-page and network inspection for `/data/colonias/` and `/data/colonias/nm-colonia-maps/`, `pnpm lint`, `pnpm build`, and local browser verification for both routes.
- **Docs updated:** `README.md`, `docs/AGENT_NOTES.md`, `docs/ARCHITECTURE.md`
- **Follow-up:** If the live site later moves Colonias content into a dedicated API feed, preserve the current content model as the normalization target rather than pushing raw payloads directly into route components.

## 2026-03-15 - Implement the NM Data Users Conference section as live CMS-backed routes
- **Status:** accepted
- **Area:** routing, cms, architecture, docs
- **Context:** The live `/data/nm-duc/` section and its individual conference pages are delivered from `api.bber.unm.edu`, but the local app was still falling through to the generic placeholder route for this section.
- **Decision:** Add dedicated `/data/nm-duc` and `/data/nm-duc/[slug]` routes, fetch the `duc-index` record plus the `group=data-conferences` archive on the server, normalize the conference payloads into app-owned page models, and render both the index and detail pages from the live API. Keep detail routes data-driven so new conference slugs can resolve automatically after upstream updates.
- **Why:** Conference content and archive membership belong to the upstream CMS contract, and this section needs to stay current without manual route edits whenever a new conference page is published.
- **Validation:** Live-site network inspection for `/data/nm-duc/`, `pnpm lint`, `pnpm build`, Next.js MCP `get_errors`, and Playwright verification for `/data/nm-duc/` plus `/data/nm-duc/26th-annual-nm-data-users-conference-2024`.
- **Docs updated:** `README.md`, `docs/AGENT_NOTES.md`, `docs/ARCHITECTURE.md`
- **Follow-up:** If more `bber-data-pages` groups are recreated later, reuse the same server-normalization pattern and keep inline content rendering resilient to markdown-like CMS authoring.

## 2026-03-15 - Recreate the economic indicators dashboard with shared line rendering
- **Status:** accepted
- **Area:** visualization, architecture, routing, docs
- **Context:** The live `/data/econindicators/` page uses many BBER REST datasets on one dashboard, and the initial `/external/test` prototype needed to grow into a multi-chart route with tighter controls and a reusable line renderer.
- **Decision:** Add a real `/data/econindicators/` route backed by a server-only multi-table adapter, normalize indicator cards into a shared line-series model, reuse one Observable Plot line renderer across the dashboard, add a compact dashboard-level time toggle plus a search field, and handle upstream data quirks such as formatted currency strings, ignored response filters, and duplicated timestamps inside the adapter layer.
- **Why:** This keeps the page close to the live BBER experience while preserving clean boundaries between external contracts, normalization, and client rendering so the visualization system can expand into larger dashboard families safely.
- **Validation:** Live-site network inspection for `/data/econindicators/`, `pnpm lint`, `pnpm build`, Next.js MCP `get_errors`, and Playwright verification for the local dashboard with shared time-window switching.
- **Docs updated:** `README.md`, `docs/AGENT_NOTES.md`, `docs/ARCHITECTURE.md`, `docs/VISUALIZATION_GUIDE.md`
- **Follow-up:** Add a formal test harness for the indicator adapters, expand the dashboard card catalog to the remaining live tables, and decide whether per-card annotations or downloadable tables should become part of the shared chart frame.

## 2026-03-15 - Ban hardcoded data-dependent visualization copy
- **Status:** accepted
- **Area:** visualization, workflow, docs
- **Context:** Visualization pages will depend on upstream datasets that are refreshed by independent scripts, so any prose that embeds transient numbers or dates can silently go stale even when the chart itself still updates.
- **Decision:** Treat data-dependent copy as part of the visualization data contract. Trend summaries, latest-value callouts, change labels, rankings, and similar chart prose must always be computed from the current normalized dataset at render time rather than hardcoded into JSX or content models.
- **Why:** The project expects many more dashboards and chart types, and teams cannot realistically audit every chart by hand after every upstream data refresh.
- **Validation:** Reviewed the `/data/econindicators/` page and confirmed the trend summary, latest value, and change label are derived from normalized series points in `src/components/site/econindicators-dashboard.tsx` and `src/visualizations/formatters/external-chart-formatters.ts`.
- **Docs updated:** `AGENTS.md`, `docs/AGENT_NOTES.md`, `docs/VISUALIZATION_GUIDE.md`
- **Follow-up:** Keep this invariant in mind as future charts add richer annotations, downloadable tables, or narrated summaries.

## 2026-03-15 - Keep rendered UI copy audience-facing
- **Status:** accepted
- **Area:** workflow, visualization, docs
- **Context:** Public pages were still carrying internal framing such as "recreation" and other implementation-oriented wording that is inappropriate for external audiences reviewing the site.
- **Decision:** Treat rendered copy as audience-facing content by default. Internal process language, agent framing, migration notes, and implementation context belong in comments, docs, or commit history rather than in page HTML.
- **Why:** The site will be read by researchers, faculty, clients, and grant reviewers, so public copy must feel intentional and professional even while sections are still being built.
- **Validation:** Reviewed and updated the `/data/econindicators/` page copy to remove internal framing and replaced it with audience-oriented language.
- **Docs updated:** `AGENTS.md`, `docs/AGENT_NOTES.md`, `docs/VISUALIZATION_GUIDE.md`
- **Follow-up:** Apply the same review to future routes before handoff, especially dashboards, placeholders, and newly recreated pages.

## 2026-03-15 - Add researcher-facing chart downloads to the economic indicators dashboard
- **Status:** accepted
- **Area:** visualization, architecture, dependency, docs
- **Context:** Economic researchers need direct access to the chart source endpoint and export files for their own scripts, while the live indicators page already exposes API, JSON, and CSV-based downloads per chart.
- **Decision:** Add a per-card download menu on `/data/econindicators/`, show the upstream API endpoint in a modal, serve direct JSON downloads through a local route handler, and generate live-style CSV ZIP exports containing raw data, formatted data, table metadata, and columns metadata. Add `jszip` for ZIP generation.
- **Naming follow-up:** Keep shared export and chart helpers page-agnostic so future dashboards can reuse them without inheriting economic-indicators-specific naming. Reserve dataset-specific language for chart configuration and route-level wiring.
- **Why:** This keeps downloads consistent with the visualization data contract and avoids reimplementing export logic separately in each future chart.
- **Validation:** Live-site interaction review for the download menu, plus local validation through `pnpm lint`, `pnpm build`, and browser verification of per-card download actions.
- **Docs updated:** `README.md`, `docs/AGENT_NOTES.md`, `docs/ARCHITECTURE.md`, `docs/VISUALIZATION_GUIDE.md`
- **Follow-up:** Reuse the same export route pattern for future dashboard families and decide whether full-table exports should later expose user-controlled filters beyond the current chart scope.

## 2026-03-15 - Rebuild API documentation as a first-party public route
- **Status:** accepted
- **Area:** routing, docs, public content
- **Context:** The live `/data/apidoc` page is public documentation for researchers and faculty, but its operations-related section and conversion tooling do not reflect the currently implemented backend support.
- **Decision:** Add a local `/data/apidoc` route with static, site-owned API guidance and omit unsupported operations-related sections from the public page.
- **Why:** Public documentation should match supported behavior and remain appropriate for external academic and research audiences.
- **Validation:** Live-page review, `pnpm lint`, `pnpm build`, and browser verification of the local `/data/apidoc` route.
- **Docs updated:** `README.md`, `docs/AGENT_NOTES.md`, `docs/ARCHITECTURE.md`
- **Follow-up:** If backend support changes later, add new API documentation sections intentionally instead of restoring dormant tooling by default.

## 2026-03-15 - Implement Subscribers section as local content routes
- **Status:** accepted
- **Area:** routing, docs, public content
- **Context:** The Subscribers section was still falling through to placeholder pages even though the live site already exposes a real landing page, a privacy policy, and a FOR-UNM access page.
- **Decision:** Add dedicated `/subscribers` and `/subscribers/[...slug]` routes backed by a local subscribers content model, recreate the public-facing landing and privacy pages, and present the FOR-UNM access page with current subscriber guidance without pretending unsupported auth flows are active.
- **Why:** This gives the section finished public content now while preserving an honest boundary around backend-dependent subscriber authentication.
- **Validation:** Live-page review, `pnpm lint`, `pnpm build`, and browser verification for `/subscribers/`, `/subscribers/forunm/`, and `/subscribers/PrivacyPolicy/`.
- **Docs updated:** `README.md`, `docs/AGENT_NOTES.md`, `docs/ARCHITECTURE.md`
- **Follow-up:** If subscriber authentication is implemented later, wire the FOR-UNM page to the real auth boundary instead of replacing the content model or route structure.

## 2026-03-15 - Add reusable external S0801 chart foundation with Observable Plot
- **Status:** superseded
- **Area:** visualization, architecture, dependency, docs
- **Context:** The repository needed a first production-grade data visualization path for the BBER REST API that could start simple with one chart and still establish durable boundaries for future chart families and richer interactions.
- **Decision:** Add `@observablehq/plot`, create a server-only external-data fetch layer for the `s0801` REST contract, normalize selectors and chart data into app-owned view models, and ship `/external/test` as a reusable bar-chart prototype with metric, geography-type, geography, and ACS period controls plus source notes, summaries, and a tabular fallback.
- **Why:** This gives the site a professional external-data chart workflow without mixing raw API payload parsing into client rendering code, and it creates a stable renderer contract for upcoming line, sunburst, pyramid, and animated visualizations.
- **Validation:** `pnpm lint`, `pnpm build`, Next.js MCP `get_errors`, Playwright verification for `/external/test` on desktop and mobile, and interactive metric switching from worked-from-home share to mean travel time.
- **Docs updated:** `README.md`, `docs/AGENT_NOTES.md`, `docs/ARCHITECTURE.md`, `docs/VISUALIZATION_GUIDE.md`
- **Follow-up:** Expand the selector model to additional tables, decide which geographies should remain exposed by default for large area types, and add a formal test harness before the chart family grows further.

## 2026-03-12 - Establish AI-first repository constitution
- **Status:** accepted
- **Area:** workflow, docs, architecture
- **Context:** Repository is being started from scratch with a requirement to support agent-first development, human sign-off, Next.js MCP integration, Playwright-assisted browser verification, and shadcn-aware agent workflows.
- **Decision:** Create `AGENTS.md` as the primary operating constitution. Configure `.mcp.json` for Next.js MCP discovery. Establish documentation-update enforcement and a dedicated ledger for future decisions.
- **Why:** Agent productivity depends on durable local context, but human reviewability and security still need explicit guardrails.
- **Validation:** Documentation scaffold created. Runtime validation still required once the actual application and package manifest exist.
- **Docs updated:** `AGENTS.md`, `docs/AGENT_NOTES.md`, `docs/ARCHITECTURE.md`, `docs/CMS_CONTRACT.md`, `docs/VISUALIZATION_GUIDE.md`, `.mcp.json`
- **Follow-up:** Replace provisional assumptions with real package versions and actual app structure after project bootstrap.

## 2026-03-12 - Package-version verification requirement
- **Status:** accepted
- **Area:** dependency
- **Context:** Dependency decisions were requested to be grounded in the repository `package.json`, but no package manifest was provided alongside the planning request.
- **Decision:** Agents must explicitly read `package.json` before version-sensitive changes and must not invent exact versions when the manifest is unavailable.
- **Why:** Prevents false assumptions, broken install instructions, and stale dependency guidance.
- **Validation:** Policy recorded in `AGENTS.md` and this ledger.
- **Docs updated:** `AGENTS.md`, `docs/AGENT_NOTES.md`
- **Follow-up:** Once the repo is bootstrapped, add a baseline dependency snapshot entry here.

## 2026-03-12 - Implement BBER homepage shell and live homepage feeds
- **Status:** accepted
- **Area:** architecture, cms, routing, docs
- **Context:** The repository started as a minimal Next.js scaffold while local documentation described a future BBER-style information architecture and CMS boundary. The first implementation pass needed to recreate the public homepage closely, keep navigation data out of JSX, and establish a reusable shell for future pages.
- **Decision:** Implement a shared header/footer shell, a local `pages.ts` navigation tree with helper utilities, a local homepage content model for stable shell content, live server-side homepage feeds for news and publications, and a catch-all placeholder route backed by the page tree.
- **Why:** This creates a reviewable foundation that matches the BBER public IA, preserves explicit CMS normalization boundaries, and allows future page work to reuse the same shell without redoing routing or chrome.
- **Validation:** `pnpm lint`, `pnpm build`, browser verification for `/`, `/search?q=economy`, `/data/nm-statewide/industry-profiles`, mobile nav interaction, and route/error inspection through Next.js MCP.
- **Docs updated:** `README.md`, `docs/AGENT_NOTES.md`, `docs/ARCHITECTURE.md`, `docs/CMS_CONTRACT.md`
- **Follow-up:** Implement real content pages behind the placeholder routes, decide whether search becomes a real local index or a CMS-backed endpoint, and expand the CMS contract as more content types are integrated.

## 2026-03-13 - Align app favicon with live BBER branding
- **Status:** accepted
- **Area:** docs, routing
- **Context:** The recreated homepage still included the scaffold `favicon.ico`, while the live BBER site serves a square SVG brand mark as its primary favicon.
- **Decision:** Keep the live BBER square SVG at `src/app/icon.svg` and remove the scaffold `src/app/favicon.ico` so Next.js emits the branded icon through the App Router metadata file convention.
- **Why:** This avoids conflicting icon assets in the app root and keeps the recreated homepage aligned with the live site branding.
- **Validation:** `pnpm lint`, `pnpm build`, browser verification of generated icon links on `/`.
- **Docs updated:** `docs/AGENT_NOTES.md`
- **Follow-up:** If BBER later requires a dedicated Apple touch icon or mask icon, add those as explicit metadata assets instead of restoring scaffold defaults.

## 2026-03-13 - Reshape homepage promo area into a full-width second row
- **Status:** accepted
- **Area:** architecture, docs
- **Context:** The first homepage implementation placed the Data Users Conference and forecasting promotion cards in a narrow right sidebar, which made the main content area read as three stacked bands instead of two deliberate rows.
- **Decision:** Keep news and publications as the first two-column row, then move the two homepage promotions into a separate full-width second row below them. Rename the forecasting promo label to `FOR-UNM` to match the homepage language more closely.
- **Why:** This matches the intended visual hierarchy more closely and gives the two promotional banners the full content width they need on desktop.
- **Validation:** `pnpm lint`, `pnpm build`, browser verification of `/` at desktop and mobile widths.
- **Docs updated:** `docs/AGENT_NOTES.md`
- **Follow-up:** If later sections need to match the live homepage more literally, we can tune card heights and banner cropping without changing the content boundary.

## 2026-03-13 - Implement research landing and live publications archive
- **Status:** accepted
- **Area:** architecture, cms, routing, build, docs
- **Context:** The research section and publications archive still resolved to placeholder pages, while the live BBER site already exposed a stable research landing page and a publications archive driven by featured and filtered CMS endpoints.
- **Decision:** Replace `/research` with a local-content landing page and replace `/research/publications` with a live CMS-backed archive page that uses the same `featured`, `indexes`, and filtered publications endpoints as the live site. Add a small client filter control that updates approved query params in the URL, and allow remote publication images from `api.bber.unm.edu` through `next.config.ts`.
- **Why:** This establishes the first real non-homepage content section, keeps the CMS contract explicit, and makes the publications archive directly linkable through URL-based filters without pushing raw CMS parsing into the UI.
- **Validation:** `pnpm lint`, `pnpm build`, browser verification for `/research`, `/research/publications`, `/research/publications?year=2026`, and Next.js MCP runtime error inspection on port `3000`.
- **Docs updated:** `README.md`, `docs/AGENT_NOTES.md`, `docs/ARCHITECTURE.md`, `docs/CMS_CONTRACT.md`
- **Follow-up:** Implement the remaining research child routes, decide whether the publications archive should support pagination beyond the live site's `limit=100`, and revisit the filter control if the CMS later exposes a dedicated search endpoint for publications.

## 2026-03-13 - Remove implementation-facing placeholder copy from public pages
- **Status:** accepted
- **Area:** docs, routing
- **Context:** Several placeholder routes and the search page were rendering implementation-facing copy about site structure, content models, and future CMS wiring that was appropriate for internal development but not for a public-facing demo.
- **Decision:** Replace those public messages with neutral language such as `Under Construction` and `Page Not Found`, and remove the CMS reference from the publications lead copy.
- **Why:** Demo and production-facing pages should not expose internal implementation details or AI-oriented scaffolding language.
- **Validation:** Browser verification for `/search?q=test`, `/research/presentations`, `/does-not-exist`, plus `pnpm lint` and `pnpm build`.
- **Docs updated:** `docs/AGENT_NOTES.md`
- **Follow-up:** Keep future placeholder copy short, public-safe, and implementation-neutral by default.

## 2026-03-13 - Implement live CMS-backed news archive
- **Status:** accepted
- **Area:** architecture, cms, routing, docs
- **Context:** The main navigation already exposed `/news`, but the route still fell through to a placeholder page while the live BBER site uses a dedicated archive page backed by `bber-news/indexes` and filtered `bber-news` API responses.
- **Decision:** Replace the placeholder with a real `/news` route that fetches live archive data on the server, normalizes both the archive feed and the indexes feed, derives year/month filter options from the upstream date list, and exposes URL-based filters for `year`, `month`, and a local `q` search term.
- **Why:** This brings the public news section in line with the live site’s behavior, keeps the CMS boundary explicit, and makes filtered news archive views directly linkable.
- **Validation:** `pnpm lint`, `pnpm build`, browser verification for `/news`, `/news?year=2025`, `/news?year=2025&month=4`, `/news?q=creative`, and live-site network inspection confirming the upstream month contract.
- **Docs updated:** `README.md`, `docs/AGENT_NOTES.md`, `docs/ARCHITECTURE.md`, `docs/CMS_CONTRACT.md`
- **Follow-up:** If BBER later exposes a dedicated server-side keyword search for news, move the local `q` filtering from the frontend adapter into the CMS query contract.

## 2026-03-13 - Drive section sidebars from the shared page tree
- **Status:** accepted
- **Area:** architecture, routing, docs
- **Context:** Nested section pages were using either placeholder-only content or route-specific navigation UI, which made the left-rail experience inconsistent across Data, Research, Subscribers, and About.
- **Decision:** Extend `src/content-models/pages.ts` with parent, sibling, and sidebar-model helpers; add a shared `SectionSidebar` and `SectionPageShell`; and route both placeholder pages and real section pages through the same data-driven left-rail pattern.
- **Why:** Keeping section navigation derived from the same `Pages` tree as the global header avoids duplicated route lists and makes the current page, sibling pages, child pages, and parent-page `Go Back` behavior consistent across the site.
- **Validation:** `pnpm lint`, `pnpm build`, browser verification for `/data`, `/data/open-data`, `/data/open-data/unm`, `/research`, `/research/publications`, `/about/services`, `/subscribers/forunm`, mobile sidebar interaction, and Next.js MCP runtime error inspection on port `3000`.
- **Docs updated:** `README.md`, `docs/AGENT_NOTES.md`, `docs/ARCHITECTURE.md`
- **Follow-up:** When more real nested pages are implemented, keep them inside `SectionPageShell` so the section navigation stays centralized instead of reintroducing route-specific sidebars.

## 2026-03-13 - Widen the shared site container for large screens
- **Status:** accepted
- **Area:** architecture, docs
- **Context:** The shared layout shell was capped at `1200px`, which made the site feel artificially narrow on larger desktop displays and caused the homepage and section pages to occupy noticeably less than the available viewport width.
- **Decision:** Introduce a shared `--site-max-width` root variable set to `1440px` and apply it across the header, footer, homepage, news page, and section-page shell.
- **Why:** A single shared width token keeps the layout visually consistent while giving the site a more natural desktop footprint without stretching content to full-bleed widths.
- **Validation:** `pnpm lint`, `pnpm build`, and Playwright verification on `/` at a `1600px` viewport confirming a rendered content width of `1440px`.
- **Docs updated:** `docs/AGENT_NOTES.md`
- **Follow-up:** If later pages need different reading widths for specialized content or data views, layer those exceptions inside page content areas instead of shrinking the shared site shell again.

## 2026-03-13 - Implement the full About section as local structured content
- **Status:** accepted
- **Area:** architecture, routing, docs
- **Context:** The About section was still being served by placeholder pages even though the live BBER site has a substantial set of static section pages, service leaf pages, staff and director directories, profile subpages, a helpful links directory, and a contact page.
- **Decision:** Add a dedicated local About content model, a shared About page renderer, explicit `/about` and `/about/[...slug]` routes, and a small client-side mailto contact form. Keep the existing shared sidebar behavior by routing About pages through `SectionPageShell`, including service leaf pages and profile pages.
- **Why:** The About section content is stable enough to live locally, and a content-model-driven renderer keeps long-form copy, profile data, and outbound links out of route files while still matching the live site structure closely.
- **Validation:** `pnpm lint`, `pnpm build`, Playwright verification for `/about`, `/about/services`, `/about/services/research`, `/about/staff`, `/about/staff/michael-o-donnell`, `/about/directors`, `/about/helpfulLinks`, `/about/contact`, mobile verification for `/about/services/research` and `/about/contact`, and Next.js MCP runtime error inspection on port `3000`.
- **Docs updated:** `README.md`, `docs/AGENT_NOTES.md`, `docs/ARCHITECTURE.md`
- **Follow-up:** If the About section later moves into a CMS, keep the current local content model shapes as the normalization target instead of pushing raw remote content directly into the page renderer.

## 2026-03-13 - Correct the About people boundary to use live CMS feeds
- **Status:** accepted
- **Area:** architecture, cms, routing, workflow, docs
- **Context:** The first About implementation treated staff and directors as local structured content even though the live BBER site fetches those pages from `GET https://api.bber.unm.edu/api/staff` and `GET https://api.bber.unm.edu/api/directors`.
- **Decision:** Re-implement `/about/staff`, `/about/directors`, and their bio pages through a dedicated server-side CMS adapter and normalization layer while keeping the rest of the About section local. Also update `AGENTS.md` so future BBER page recreation tasks require network inspection before deciding whether a page is static or CMS-backed.
- **Why:** Staff and director data are an external CMS contract on the live site, and reproducing those pages locally would drift over time and hide the real source boundary that the frontend should preserve.
- **Validation:** Live-site network inspection for `/about/staff` and `/about/directors`, `pnpm lint`, `pnpm build`, browser verification for `/about/staff`, `/about/staff/michael-o-donnell`, `/about/directors`, `/about/directors/jeffrey-mitchell`, and Next.js MCP runtime error inspection on port `3000`.
- **Docs updated:** `AGENTS.md`, `README.md`, `docs/AGENT_NOTES.md`, `docs/ARCHITECTURE.md`, `docs/CMS_CONTRACT.md`
- **Follow-up:** If additional About subpages are recreated from the live site, inspect network traffic first and preserve any upstream CMS contracts instead of assuming editorial pages are static.

## 2026-03-13 - Make parent navigation items directly reachable
- **Status:** accepted
- **Area:** architecture, routing, docs
- **Context:** The first shared header implementation treated parent navigation items as menu triggers, which made landing pages such as `/about` and `/about/services` effectively unreachable from the primary navigation unless a user guessed the URL or used a sidebar link.
- **Decision:** Replace the trigger-only pattern with a split-link website navigation model across the shared header. Parent labels now navigate to their landing pages, adjacent chevrons open child menus, and every submenu begins with an `Overview` link derived from the same `Pages` tree.
- **Why:** This matches common website navigation conventions, keeps parent landing pages discoverable, and preserves one data-driven source of truth for both top-level and nested navigation branches.
- **Validation:** `pnpm lint`, `pnpm build`, Playwright verification for desktop navigation to `/about` and `/about/services`, nested `About > Services` submenu opening, mobile sheet navigation to `/about/services`, and Next.js MCP runtime error inspection on port `3000`.
- **Docs updated:** `README.md`, `docs/AGENT_NOTES.md`, `docs/ARCHITECTURE.md`
- **Follow-up:** If future information-architecture changes add deeper nesting, keep deriving the header structure from `pages.ts` instead of introducing route-local menu definitions.

## 2026-03-13 - Remove duplicated local About people content and group past staff from CMS
- **Status:** accepted
- **Area:** architecture, cms, routing, docs
- **Context:** The About route layer was already fetching staff and directors from the live CMS, but `about-content.ts` still contained duplicated local staff/director summaries and profile content. The staff page also needed to distinguish active and former employees from the upstream `stoppedWorkingDate` field.
- **Decision:** Remove local staff and director directory/profile content from `about-content.ts`, keep those routes exclusively CMS-backed, and update the staff directory normalization to split people into current employees and a collapsed `Past Employees` section while keeping direct bio routes valid.
- **Why:** This removes stale duplicate data from the local content model, keeps the CMS boundary honest, and matches the real staff lifecycle represented by the upstream payload.
- **Validation:** `pnpm lint`, `pnpm build`, browser verification for `/about/staff`, expanding the `Past Employees` section, direct navigation to a valid past employee bio route, `/about/directors`, and an invalid `/about/staff/[slug]` not-found check.
- **Docs updated:** `README.md`, `docs/AGENT_NOTES.md`, `docs/ARCHITECTURE.md`, `docs/CMS_CONTRACT.md`
- **Follow-up:** If the CMS later introduces separate active and alumni endpoints, keep the current grouped directory model as the normalization target rather than pushing endpoint-specific shapes into the UI.

## 2026-03-13 - Add former-staff label to past employee bio pages
- **Status:** accepted
- **Area:** cms, docs
- **Context:** Past staff were already grouped correctly on `/about/staff`, but their individual bio pages did not visibly indicate that they are former employees.
- **Decision:** Carry a former-staff label through the CMS-normalized staff profile model and render `Past Employee` on staff bio pages only when `stoppedWorkingDate` is present.
- **Why:** This keeps former staff status visible on direct profile pages without adding any corresponding label to current employees.
- **Validation:** `pnpm lint`, `pnpm build`, and browser verification for `/about/staff/wayne-rudnick`.
- **Docs updated:** `docs/CMS_CONTRACT.md`, `docs/AGENT_NOTES.md`
- **Follow-up:** If the design later adds richer employment-status metadata, keep it CMS-derived rather than hardcoding route-specific labels.

## 2026-03-13 - Keep sortOrder-zero staff entries in the CMS-backed staff directory
- **Status:** accepted
- **Area:** cms, docs
- **Context:** The `/about/staff` page was server-fetching live CMS data correctly, but the normalization layer was discarding every staff record whose `sortOrder` was `0`, which removed a large portion of the feed from both the directory and generated profile routes.
- **Decision:** Treat `sortOrder` as an ordering hint only. Records with `sortOrder: 0` remain valid staff entries, and ties now fall back to alphabetical ordering by name.
- **Why:** The live `GET /api/staff` feed currently contains many valid current and past staff records with `sortOrder: 0`, so using that field as a validity gate caused silent data loss.
- **Validation:** Live feed inspection showing 24 valid staff records with only 11 previously retained, `pnpm lint`, `pnpm build`, and browser verification for `/about/staff` confirming previously omitted staff now render.
- **Docs updated:** `docs/CMS_CONTRACT.md`, `docs/AGENT_NOTES.md`
- **Follow-up:** If BBER later formalizes directory ordering semantics, update the normalizer to match the upstream contract without turning ordering fields into required-presence validation.

## 2026-03-13 - Normalize people-card preview height and action alignment
- **Status:** accepted
- **Area:** architecture, docs
- **Context:** Staff and director cards were using variable-length bio previews, which caused uneven card heights and left the `View Bio` button at different vertical positions across a row.
- **Decision:** Increase the normalized preview budget modestly, clamp the rendered preview text to a consistent line count, and make the card body stretch so the `View Bio` action anchors to the bottom of each card.
- **Why:** This preserves a richer biography preview while keeping the card grid visually aligned and easier to scan.
- **Validation:** `pnpm lint`, `pnpm build`, Playwright verification for `/about/staff` and `/about/directors`, plus DOM checks confirming the first three `View Bio` buttons share the same vertical position on desktop.
- **Docs updated:** `docs/AGENT_NOTES.md`
- **Follow-up:** If the design later needs different preview density on mobile versus desktop, adjust the clamp count rather than reintroducing variable action placement.

## 2026-03-13 - Build people-card previews from multiple biography paragraphs
- **Status:** accepted
- **Area:** cms, docs
- **Context:** The first people-card preview normalizer only used the first biography paragraph, which made short opening paragraphs leave visually thin previews even when the next paragraph contained more useful summary content.
- **Decision:** Update the staff/director excerpt normalizer to accumulate multiple non-heading, non-link biography paragraphs until the preview target length is reached, then trim once at the end.
- **Why:** This keeps previews fuller and more representative of the biography while preserving the aligned card layout.
- **Validation:** `pnpm lint`, `pnpm build`, Playwright verification on `/about/staff`, and DOM checks confirming aligned `View Bio` buttons after the new preview logic.
- **Docs updated:** `docs/AGENT_NOTES.md`
- **Follow-up:** If later sections need more editorial control over previews, add an explicit CMS summary field instead of relying on paragraph accumulation heuristics.

## 2026-03-13 - Remove production-site coupling from local About content
- **Status:** accepted
- **Area:** routing, architecture, docs
- **Context:** The local About content model still hardcoded `https://bber.unm.edu/...` for stable image assets and for internal page links like research publications and presentations, even though this application is intended to replace the current site at that same hostname.
- **Decision:** Move stable About assets into `public/bber/about/`, switch internal About page links to the local route tree in `src/content-models/pages.ts`, remove the now-unused `bber.unm.edu` image remote pattern from `next.config.ts`, and update agent guidance to treat `bber.unm.edu` as the deployment host instead of an upstream dependency.
- **Why:** First-party pages and stable shell assets should resolve from this codebase after deployment, not from the site being replaced.
- **Validation:** `pnpm lint`, `pnpm build`, browser verification for `/about/services/research` confirming the bottom links stay on `localhost:3000`, plus repository search for remaining `https://bber.unm.edu` references.
- **Docs updated:** `AGENTS.md`, `README.md`, `docs/AGENT_NOTES.md`, `docs/ARCHITECTURE.md`
- **Follow-up:** Continue replacing remaining hardcoded `bber.unm.edu` references only when there is a confirmed local route or repo-owned asset to target, rather than guessing missing routes.
