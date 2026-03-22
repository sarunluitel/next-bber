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

The frontend also consumes these BBER REST data endpoints:

10. `GET https://api.bber.unm.edu/api/data/rest/metadata?api=tablevariables&table=TABLE_NAME`
11. `GET https://api.bber.unm.edu/api/data/rest/metadata?api=tablevalues&table=TABLE_NAME&variables=[...]`
12. `GET https://api.bber.unm.edu/api/data/rest/bbertable?table=TABLE_NAME&...`

First-party download routes can also expose normalized API descriptor payloads
that point at those upstream endpoints instead of redirecting immediately.

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

### `BberDbFilterModel`

Used by `/data/bberdb` and `GET /api/bberdb/filters`.

- `tableName: string`
- `supportedFilterKeys: BberDbFilterKey[]`
- `visibleFilterKeys: BberDbVisibleFilterKey[]`
- `filters: Array<{ key, label, value, options }>`
- `draftQuery: BberDbAppliedQuery`

Normalization rules:

- the 75-table dataset catalog and `Data Category` labels stay local to the
  repo
- `supportedFilterKeys` are derived by intersecting `tablevariables` with the
  shared app-owned filter-key union, whether the upstream metadata arrives as a
  raw array or a `{ columns: [...] }` object
- only the current live filter surface is exposed in `visibleFilterKeys`:
  `areatype`, `periodyear`, `periodtype`, plus conditional `indcode` and
  `ownership`
- `tablevalues` is fetched only for the visible filter keys of the currently
  selected table
- defaults match the live public behavior: first `areatype`, latest numeric
  `periodyear`, highest numeric `periodtype`, and first actual `indcode` or
  `ownership` option when present
- requested `periodyear` values may be a comma-separated year list, and the
  normalized query preserves only valid selected years in the published option
  order so one BBER DB query model can serve the page, downloads, and future
  visualizations
- the page route remains dynamic and the client retries the default query when
  the initial server render degrades because of a transient upstream failure

### `BberDbTableViewModel`

Used by `/data/bberdb` and `GET /api/bberdb/table`.

- `datasetLabel: string`
- `tableName: string`
- `query: BberDbAppliedQuery`
- `resultTitle: string`
- `sourceLine: string`
- `apiUrl: string`
- `description: string`
- `columns: Array<{ key, header, description }>`
- `rows: Array<{ id, cells }>`
- `rawRowCount: number`
- `sourceMetadata: BberDbSourceMetadata`

Normalization rules:

- the upstream `bbertable` response is fetched on the server only
- context columns such as geography, year, period, industry, and ownership are
  promoted ahead of metric columns when the upstream row shape includes them
- headers come from `metadata.columns[].display_name`, while column order
  follows the published metadata order with any unreported row keys appended
- known awkward system labels can be overridden in the normalized model, for
  example `period -> Period`
- trailing metric qualifiers such as `(Percent Allocated)` stay in the header
  string, but the table UI may render them on stacked lines to reduce width
- negative sentinel values `-1` through `-8` are mapped through the legacy
  `dataExceptions` labels, including `-8 => Not applicable`
- `resultTitle` is derived from unique `geographyname` values in the current
  row set and compacts long geography lists after the first label
- `sourceLine` is derived from the upstream table source and the applied year
  or year selection
- rows are sorted newest-first by `periodyear`, then `period`, before the
  rendered table model is returned
- when the upstream BBER REST service times out or rejects a selected table,
  the first-party page keeps rendering and exposes the failure as an inline
  upstream-unavailable state rather than crashing the route
- the route-level loading UI can show staged progress copy while the initial
  server render is still fetching metadata and the default table payload

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
- BBER data-portal fetches: `src/lib/bberdb.ts`
- BBER data-portal normalization: `src/content-models/bberdb.ts`
