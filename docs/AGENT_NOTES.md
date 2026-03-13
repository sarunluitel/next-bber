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
