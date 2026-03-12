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
