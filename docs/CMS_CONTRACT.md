# CMS_CONTRACT.md

## Principle
The CMS is an external producer. The frontend is a strict consumer.

That means:
- raw CMS payloads are not trusted automatically
- server boundaries must validate payloads
- internal UI should consume normalized models, not raw documents

## Current live homepage feeds

The homepage currently consumes two CMS endpoints:

1. `GET https://api.bber.unm.edu/api/bber-news?limit=3`
2. `GET https://api.bber.unm.edu/api/bber-research/publications?limit=5`

## Required pipeline

1. fetch raw payload on the server
2. validate the minimal required fields manually
3. normalize into app-owned view models
4. render from normalized models only

## Normalized models

### `BberNewsItem`

Used by the homepage news section.

- `id: string`
- `title: string`
- `publishedDate: string`
- `description: string`
- `href: string`

Normalization rules:

- `title` comes from `title`
- `publishedDate` comes from `date`
- `description` prefers `short_descr`, then `content`, then a fallback message
- `href` must come from `external_link`
- invalid or incomplete items are dropped

### `BberPublicationItem`

Used by the homepage publications section.

- `id: string`
- `title: string`
- `publishedDate: string`
- `description: string`
- `href: string`
- `hrefKind: "pdf" | "external"`

Normalization rules:

- `title` comes from `title`
- `publishedDate` comes from `date`
- `description` prefers `short_descr`, then `content`, then a fallback message
- `href` prefers `pdf.url` resolved against `https://api.bber.unm.edu`, then
  `external_link`
- invalid or incomplete items are dropped

## Invariants

- Homepage components must not parse raw CMS payloads.
- Incomplete entries should be excluded rather than partially guessed.
- Feed failures must degrade to section-level empty or error states.
- Local navigation and homepage chrome content are intentionally not CMS-backed
  at this stage.

## Current implementation locations

- server fetches: `src/lib/cms/bber-homepage.ts`
- normalization: `src/content-models/bber-homepage.ts`
- rendering: homepage section components under `src/components/site/`
