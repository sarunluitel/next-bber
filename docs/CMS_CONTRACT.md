# CMS_CONTRACT.md

## Principle
The CMS is an external producer. The frontend is a strict consumer.

That means:
- raw CMS payloads are not trusted automatically
- server boundaries must validate payloads
- internal UI should consume normalized models, not raw documents

## Current live feeds and archive endpoints

The frontend currently consumes these BBER CMS endpoints:

1. `GET https://api.bber.unm.edu/api/bber-news?limit=3`
2. `GET https://api.bber.unm.edu/api/bber-news/indexes`
3. `GET https://api.bber.unm.edu/api/bber-news/?year=YYYY&month=M&limit=100`
4. `GET https://api.bber.unm.edu/api/staff`
5. `GET https://api.bber.unm.edu/api/directors`
6. `GET https://api.bber.unm.edu/api/bber-research/publications?limit=5`
7. `GET https://api.bber.unm.edu/api/bber-research/publications?featured=true`
8. `GET https://api.bber.unm.edu/api/bber-research/publications/indexes`
9. `GET https://api.bber.unm.edu/api/bber-research/publications?year=YYYY&category=ID&community=ID&limit=100`

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

### `BberPublicationRecord`

Used by `/research/publications`.

- `id: string`
- `title: string`
- `publishedDate: string`
- `description: string`
- `href: string`
- `hrefKind: "pdf" | "external"`
- `categories: string[]`
- `communities: string[]`
- `image: { src, alt, width, height } | null`

Normalization rules:

- publication link resolution follows the same PDF-first rule as the homepage
- `categories` comes from each `categories[].category`
- `communities` comes from each `communities[].community`
- `image` prefers `featureImage.formats.small`, then `featureImage.url`, both
  resolved against `https://api.bber.unm.edu`
- entries without a valid title, date, or resolved link are dropped

### `BberAboutPersonDirectoryPage`

Used by `/about/staff` and `/about/directors`.

- `path: string`
- `title: string`
- `lead: string`
- `eyebrow: "About"`
- `sidebarPath: string`
- `kind: "people-directory"`
- `currentPeople: AboutPersonSummary[]`
- `pastPeople?: AboutPersonSummary[]`
- `pastPeopleHeading?: string`

Normalization rules:

- staff records come from `GET /api/staff`
- staff are split into `currentPeople` and `pastPeople`
- `stoppedWorkingDate` null or absent means current employee
- `stoppedWorkingDate` present means past employee
- the staff page renders `pastPeople` inside a collapsed `Past Employees`
  section, but those people still keep valid bio routes
- past staff bio pages also show a `Past Employee` label under the person’s
  role heading
- `sortOrder` is used only for ordering; `sortOrder: 0` records are still valid
  staff entries and must not be dropped
- directors come from `GET /api/directors`
- both collections are sorted by `sortOrder` descending to mirror the live site
- portrait images prefer `image.formats.medium.url`, then smaller CMS formats,
  then the root `image.url`, all resolved against `https://api.bber.unm.edu`
- staff portrait URLs may come back under either `/api/files/**` or
  `/uploads/**`, so both path families must be allowed by the Next image
  configuration
- excerpt text comes from the first non-heading paragraph in `description`

### `BberAboutPersonProfilePage`

Used by `/about/staff/[slug]` and `/about/directors/[slug]`.

- `path: string`
- `title: string`
- `eyebrow: "About"`
- `sidebarPath: string`
- `kind: "person-profile"`
- `directoryPath: string`
- `directoryTitle: string`
- `person: AboutPersonSummary`
- `sections: AboutContentSection[]`

Normalization rules:

- profile content comes from the same upstream staff/director records as the
  directory pages
- `description` is split into paragraphs at blank lines before rendering
- standalone Markdown links in the upstream description are normalized into
  structured link rows
- standalone Markdown headings such as `# In Memoriam ...` become section titles
- director tenure labels are derived from `tenureStart` and `tenureEnd` as
  `YYYY to YYYY` or `YYYY to Present`
- profile routes are keyed by the upstream `slug`

### `BberNewsArchiveItem`

Used by `/news`.

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
- `href` prefers `pdf_url` resolved against `https://api.bber.unm.edu`, then
  `external_link`
- invalid or incomplete items are dropped

### `BberNewsIndexes`

Used by `/news` filter controls.

- `years: Array<{ value: string; label: string }>`
- `monthsByYear: Record<string, Array<{ value: string; label: string; year: string }>>`

Normalization rules:

- the upstream `indexes` payload currently exposes `dates[]`
- `years` are derived from the date strings and sorted descending
- `monthsByYear` is derived from the same dates, grouped by year and sorted
  newest-to-oldest within each year
- month query param values must follow the live API contract, which is
  calendar-month numbering `1..12`
- invalid dates are dropped

### `BberPublicationIndexes`

Used by `/research/publications` filter controls.

- `years: Array<{ value: string; label: string }>`
- `categories: Array<{ value: string; label: string }>`
- `communities: Array<{ value: string; label: string }>`

Normalization rules:

- `years` are derived from `dates[]`
- category option values come from `id`, labels from `category`
- community option values come from `id`, labels from `community`
- invalid option entries are dropped

## Invariants

- Homepage components must not parse raw CMS payloads.
- Publications archive components must not parse raw CMS payloads or indexes.
- News archive components must not parse raw CMS payloads or indexes.
- Staff and director pages must not parse raw CMS payloads inside route or UI
  components.
- Incomplete entries should be excluded rather than partially guessed.
- Feed failures must degrade to section-level empty or error states.
- Local navigation and homepage chrome content are intentionally not CMS-backed
  at this stage.
- Research landing copy is intentionally local even though the archive itself is
  CMS-backed.
- The broader About section remains locally modeled, but staff and directors are
  explicitly CMS-backed because the live site sources them from `api.bber.unm.edu`.

## Current implementation locations

- server fetches: `src/lib/cms/bber-homepage.ts`
- normalization: `src/content-models/bber-homepage.ts`
- rendering: homepage section components under `src/components/site/`
- news archive fetches: `src/lib/cms/bber-news.ts`
- news archive normalization: `src/content-models/bber-news.ts`
- about people fetches: `src/lib/cms/bber-about.ts`
- about people normalization: `src/content-models/bber-about-people.ts`
- publications archive fetches: `src/lib/cms/bber-research.ts`
- publications archive normalization: `src/content-models/bber-research.ts`
