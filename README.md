# UNM BBER Frontend

This repository is a Next.js App Router implementation of the UNM Bureau of
Business and Economic Research website, starting with a close recreation of the
homepage at [bber.unm.edu](https://bber.unm.edu/).

## Current scope

The app currently includes:

- a reusable site shell with shared header and footer
- a fully implemented homepage
- live server-side CMS feeds for homepage news and publications
- a local `pages.ts` site tree used for navigation and placeholder routes
- placeholder pages for the current navigation structure
- a search UI shell routed to a local placeholder page

## Content architecture

Stable site structure and homepage chrome content live locally:

- `src/content-models/pages.ts`
- `src/content-models/homepage-content.ts`

Live homepage feeds come from:

- `https://api.bber.unm.edu/api/bber-news?limit=3`
- `https://api.bber.unm.edu/api/bber-research/publications?limit=5`

Those payloads are fetched on the server, normalized into app-owned view
models, and then rendered by the homepage components.

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
- Shared imagery used by the homepage shell is stored in `public/bber/`.
- Homepage feed failures are handled with section-level empty or error states so
  the page still renders cleanly.
