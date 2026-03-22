<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

This file defines how work should be done in this repository.
For the product overview, setup, and high-level feature map, read
[README.md](./README.md).

Canonical deep docs:

- [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)
- [docs/CMS_CONTRACT.md](./docs/CMS_CONTRACT.md)
- [docs/VISUALIZATION_GUIDE.md](./docs/VISUALIZATION_GUIDE.md)
- [docs/AGENT_NOTES.md](./docs/AGENT_NOTES.md)

Cross-links between these docs are pointers, not recursion. Read each file
once, follow the relevant links, and avoid rereading the same file in a loop.

## Repo-local skills

Check the `.agents/` folder for repo-local skills and workflow helpers before
starting implementation work. Use it to discover which task-specific skills are
present in this repository even when the runtime does not inject a skills list
automatically.

## Purpose

This repository is designed for AI-first development with human sign-off. The
codebase should stay readable, reviewable, and safe for both humans and
agents.

## First reads

Before changing code, read:

1. [package.json](./package.json) for exact versions and available tools
2. [README.md](./README.md) for project shape and feature map
3. task-relevant deep docs:
   - [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) for routing, boundaries,
     and shared infrastructure
   - [docs/CMS_CONTRACT.md](./docs/CMS_CONTRACT.md) for CMS and BBER REST
     normalization rules
   - [docs/VISUALIZATION_GUIDE.md](./docs/VISUALIZATION_GUIDE.md) for charts,
     maps, and download behavior
   - [docs/AGENT_NOTES.md](./docs/AGENT_NOTES.md) for recent accepted changes
4. the existing route, content-model, and server adapter files related to the
   task

## Default implementation posture

- For UI work, inspect existing `src/components/site/*` patterns first.
- Reuse existing shadcn/ui primitives and composed site components before
  building custom UI from scratch.
- Treat shadcn/ui as the preferred foundation for accessible interactive UI
  primitives unless the task requires a documented exception.
- Use Tailwind as the primary styling layer, and keep responsive behavior in
  scope for UI changes.
- For data routes, read the matching `src/content-models/*` and `src/lib/*`
  files before changing route UI.
- For live-page recreations, inspect the live page and network requests before
  deciding what is local content versus CMS or BBER REST content.

## Repo constitution

### Human-readable code is mandatory

- Prefer explicit names and straightforward control flow.
- Keep files reviewable by a human engineer without hidden abstractions.
- Prefer small composable helpers over broad, multipurpose utilities.

### Scope discipline matters

- Preserve architectural boundaries.
- Keep task scope narrow.
- Avoid opportunistic refactors unless they are required for correctness.
- Update documentation in the same task when behavior or contracts change.

### `bber.unm.edu` is first-party

- Treat `https://bber.unm.edu` as this application's own deployment host.
- Do not hardcode `https://bber.unm.edu/...` for internal links, downloads,
  images, or runtime fetches.
- Prefer route constants from `src/content-models/pages.ts`, root-relative
  paths, and repo-owned assets in `public/`.

### External data stays behind server normalization

- The CMS is a producer of JSON. The frontend is a consumer.
- Validate external payloads at server boundaries.
- Normalize external data into app-owned view models before rendering.
- Do not let page or presentation components parse raw CMS or BBER REST
  payloads.
- Treat schema drift as expected.

### Visualization rules are product rules

- D3 is the base layer for bespoke visualization work.
- Keep rendering, scale logic, formatting, and data normalization separable.
- Every chart or map should define empty, loading, and error states.
- Do not hardcode data-dependent public prose that should change with the
  dataset.
- Keep public UI copy audience-facing and publication-ready.

### Reuse existing shared infrastructure

- Reuse the shared download flow before inventing new download UI.
- `src/components/site/data-download-menu.tsx` owns the standard menu behavior.
- `src/components/site/api-endpoint-dialog.tsx` owns the shared API modal.
- `src/components/site/data-download-dropdown.tsx` owns the dropdown trigger.
- For `/data/bberdb/`, keep `periodyear` as a comma-separated multi-select
  contract in `src/content-models/bberdb.ts`.
- For `/data/rgis/`, extend the shared BBER data-bank stack rather than
  rebuilding dataset, selector, or download logic.
- RGIS spatial downloads must bundle the matching `<table>.xml` sidecar from
  the normalized loaded payload.

## Comment policy

- Prefer readable code over explanatory comments.
- Use comments for durable intent, invariants, and external contracts.
- Remove or update comments when behavior changes.

## Security and dependency guardrails

- Do not commit secrets or log secret values.
- Treat auth, data access, repositories, email sending, and route handlers as
  security-sensitive paths.
- Reuse existing libraries before adding new ones.
- Prefer official SDKs when possible.
- Keep `pnpm-lock.yaml` in sync with dependency changes.

## Refactor safety guardrails

- Preserve server/client boundaries such as `'use client'`, server-only
  modules, and route handlers.
- Do not casually move content models, chart primitives, or route structure.
- Prefer adapter layers over sweeping rewrites when integrating new CMS or
  visualization requirements.

## Agent workflow expectations

### Live page recreation workflow

When asked to recreate a page from `bber.unm.edu`:

1. inspect the live page in a browser
2. review the network requests
3. identify which requests come from `api.bber.unm.edu`
4. decide what is stable local content versus CMS or BBER REST content
5. implement the page using the existing route, content-model, and shared UI
   patterns
6. replace any temporary `https://bber.unm.edu/...` references with first-party
   local routes or repo-owned assets before handoff

Do not assume a page is static just because it looks editorial.

### Browser verification

When a change affects the UI, verify it in a browser-capable workflow when
available.

### Human review posture

Optimize for diffs that are easy to review:

- smaller files
- fewer unrelated edits
- explicit naming
- clear boundaries between content, transforms, and rendering

## Documentation update policy

Documentation must be updated in the same task when any of these change:

- dependency choices
- runtime behavior
- auth flow
- routing structure
- environment variables
- build or deployment pipeline
- linting or formatting rules
- security posture
- performance strategy
- external integrations
- data models
- folder structure
- framework major version

Update the relevant documents before handoff:

- [AGENTS.md](./AGENTS.md)
- [README.md](./README.md)
- [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)
- [docs/CMS_CONTRACT.md](./docs/CMS_CONTRACT.md)
- [docs/VISUALIZATION_GUIDE.md](./docs/VISUALIZATION_GUIDE.md)
- [docs/AGENT_NOTES.md](./docs/AGENT_NOTES.md)
- environment example files, when applicable

## Definition of done

- changes stay scoped to the request
- validation is run when practical, or blockers are documented precisely
- affected high-risk flows are manually checked when practical
- documentation is updated when triggered

## Final handoff requirement

Before completing any task, output exactly:

`Docs updated: yes/no`

If yes, list modified documentation files.
