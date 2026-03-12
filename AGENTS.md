<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->


## Purpose
This repository is designed for **AI-first development with human sign-off**. The codebase should be easy for both humans and coding agents to understand, modify, and verify.

The product is an economics research department website for BBER-style content and data publishing. Content is delivered from a CMS as JSON objects and rendered by the frontend. The dominant engineering concerns are:
- structured content rendering
- data visualization
- long-lived information architecture
- trustworthy server/client boundaries
- predictable debugging for agent workflows

This repository assumes:
- **Next.js App Router** on a current canary line when intentionally adopted
- Tailwind CSS for styling
- `shadcn/ui` with the **base** style system for UI primitives when appropriate
- D3 as the foundational charting layer for custom SVG visualizations
- AI agents operating with repo-local documentation, framework MCP access, and browser validation support

---

## Core Engineering Constitution

### 1) Human-readable code is mandatory
Because all generated code requires human sign-off, optimize for readability over cleverness.

Rules:
- Prefer long, specific variable and function names over compressed names.
- Prefer straightforward control flow over abstracted indirection.
- Prefer small composable utilities over large multipurpose helpers.
- Avoid introducing “magic” patterns that only make sense to a code generator.
- Every new file should be easy for a new engineer to understand without external context.

### 2) Agent-first does not mean agent-trusting
Agents may propose and implement changes, but the repository must stay safe for human review.

Rules:
- Preserve architectural boundaries.
- Keep task scope narrow.
- Avoid opportunistic refactors unless they are required to complete the task correctly.
- When behavior changes, update documentation in the same task.

### 3) Data visualization is a first-class concern
This is not a generic marketing site. Visualization quality, maintainability, accessibility, and data correctness are core product requirements.

Rules:
- D3 is the base charting layer for bespoke visualizations.
- Rendering logic, scale logic, formatting logic, and CMS-to-view transformation logic should remain separable.
- Charts must degrade gracefully when data is missing, partial, or malformed.
- Every visualization should define its empty state, loading state, and error state.
- Avoid hiding data assumptions inside component JSX.

### 4) CMS content is an external contract
The CMS is a producer of JSON. The frontend is a consumer. That boundary must be explicit.

Rules:
- Validate CMS payloads at server boundaries.
- Normalize external data into internal view models before rendering.
- Do not let page components become ad hoc parsers for raw CMS payloads.
- Treat schema drift as expected over time.

---

## Repository Priorities
In order of importance:
1. correctness and security
2. readability and reviewability
3. stable agent workflows
4. predictable content rendering
5. visualization maintainability
6. performance improvements that do not reduce clarity

---

## Comment Policy

### Required philosophy
- Avoid comments that paraphrase the implementation line-by-line.
- Comments should explain **why this exists** or **what invariant must stay true**, not what the next line does.

### Rules
- Prefer readable names, small functions, and composition before adding comments.
- Add comments only for durable intent that is hard to infer from code alone: invariants, architectural boundaries, non-obvious tradeoffs, and external contracts.
- Do not add narration comments that merely restate obvious code.
- If a comment describes behavior that changed, update or remove it in the same task.

### Good comment examples
- why a route must remain server-only
- why a CMS normalization step exists before rendering
- why a chart must preserve sort order from the source dataset
- why a cache boundary is intentionally narrow

### Bad comment examples
- comments that repeat variable assignments
- comments that explain obvious JSX branches
- comments that narrate “fetch data, then render UI”

---

## Security Guardrails
- Do not commit secrets or log raw secret values, tokens, passwords, or credential material.
- Do not weaken auth validation or session checks without explicit justification and documentation updates.
- Validate external/client payloads in API routes and server-side boundaries.
- Treat auth, data access, repositories, email sending, and API routes as security-sensitive paths.
- Assume CMS-delivered JSON is untrusted until validated.
- Keep environment variable access centralized when possible.

---

## Dependency Guardrails
- There is a legal requirement for all generated code to be signed off by a human engineer. Prefer long variable names, function names, and easy-to-follow architecture.
- Reuse existing libraries before adding new ones.
- Prefer official SDKs for cloud integrations unless there is a documented reason not to.
- Keep `pnpm-lock.yaml` in sync with dependency changes.
- Remove dependencies only after verifying they are unused in runtime/build paths.
- Do not add a charting abstraction on top of D3 unless there is a documented maintenance or delivery reason.

---

## Refactor Safety Guardrails
- Preserve server/client boundaries and runtime assumptions (`'use client'`, server-only modules, route handlers).
- Keep changes scoped and avoid mixing unrelated refactors into task work.
- Do not move content models, chart primitives, or route structure casually; those are high-blast-radius surfaces.
- Prefer adapter layers over sweeping rewrites when integrating new CMS or visualization requirements.

---

## Documentation Update Policy (Mandatory)
The agent MUST update documentation when ANY of the following occur:

- Dependency added
- Dependency removed
- Dependency swapped
- Deprecated/unmaintained/vulnerable package replaced
- Runtime behavior changed
- Auth flow changed
- Routing structure changed
- Environment variables added/removed/renamed
- Build pipeline changed
- Linting/formatting rules changed
- Security posture changed
- Performance strategy changed
- External integration changed
- Data model changed
- Folder structure refactored
- CI/CD logic changed
- Framework major version upgraded

Line count alone is NOT a sufficient trigger metric.

### Required documentation targets
At minimum, update whichever apply:
- `AGENTS.md`
- `docs/AGENT_NOTES.md` (decision/audit ledger)
- `README.md`
- `docs/ARCHITECTURE.md`
- `docs/CMS_CONTRACT.md`
- `docs/VISUALIZATION_GUIDE.md`
- environment example files

### Documentation Update Enforcement
- If any trigger applies, update the relevant documentation files before handoff.
- The absence of documentation changes when a trigger applies is considered an incomplete task.

---

## Definition of Done (Enforced)
- Changes are scoped to the request and maintain existing safeguards.
- Validation is run when practical (`type-check`, `lint`, `build`, targeted flows), or blockers are documented precisely.
- Manual verification is performed for affected high-risk flows (auth, tenant routing, database writes, CMS payload rendering, chart rendering) when those areas change.
- Documentation is updated when triggered.

---

## Final Handoff Requirement (Exact)
Before completing any task, output exactly:

`Docs updated: yes/no`

If yes, list modified documentation files.

---

## Agent Workflow Expectations

### MCP and runtime debugging
This repo is expected to run with the Next.js MCP server so agents can inspect runtime errors, logs, routes, and page metadata while the dev server is running.

### Browser verification
When a UI-affecting change is made, the agent should verify the result in a browser-capable workflow such as Playwright-backed validation when available.

### Human review posture
Agents should optimize for diffs that are easy to review:
- smaller files
- fewer unrelated edits
- explicit naming
- clear boundaries between content, transforms, and rendering

---

## Initial Product Shape
The public site structure should support content similar to an economics research department website with sections such as:
- homepage
- research
- data
- news/articles
- publications or research papers
- presentations
- about/services/contact

The CMS is expected to send JSON objects for content entities such as:
- article
- blog/news item
- research paper
- presentation
- dataset landing page
- profile or organizational page

Agents should preserve a distinction between:
- CMS raw payloads
- normalized domain models
- page-level data requirements
- UI rendering components

---

## Recommended Folder Intent
This is guidance, not a rigid requirement:

- `app/` → routing, layouts, server components, route handlers
- `components/` → reusable UI and composed feature components
- `lib/` → pure utilities, formatters, validators, server adapters
- `content-models/` → schemas, normalizers, domain types for CMS entities
- `visualizations/` → D3 primitives, chart compositions, interaction utilities
- `docs/` → architectural and operational documentation

Keep D3-heavy rendering logic out of generic utility folders.

---

## Package and Version Policy
The agent must read the repository `package.json` before making dependency-sensitive decisions.

Required checks before acting on dependencies:
- confirm actual installed versions
- confirm whether the project already includes an official solution
- confirm whether a new dependency duplicates existing capability
- confirm compatibility with Next.js canary choices

If `package.json` is unavailable, the agent must say so explicitly and avoid inventing exact installed versions.

---

## Framework and Tooling Assumptions
- Next.js MCP should be configured in `.mcp.json`.
- `shadcn/ui` skill context should be available to the agent when the project uses shadcn.
- Playwright may be used for browser verification and regression checks.
- Tailwind should remain the primary styling mechanism.
- UI work should favor composition over bespoke styling sprawl.

---

## Non-Negotiable Invariants
- Never bypass validation at external boundaries.
- Never hide schema assumptions inside presentational components.
- Never weaken security-sensitive paths casually.
- Never leave documentation stale after architecture or behavior changes.
- Never trade human reviewability for code golf.
