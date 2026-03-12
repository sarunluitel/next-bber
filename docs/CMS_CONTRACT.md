# CMS_CONTRACT.md

## Principle
The CMS is an external producer. The frontend is a strict consumer.

That means:
- raw CMS payloads are not trusted automatically
- server boundaries must validate payloads
- internal UI should consume normalized models, not raw documents

## Expected content entities
Initial expected entities include:
- article
- news item
- research paper
- presentation
- dataset page
- staff/profile page
- informational page

## Required pipeline
1. fetch raw payload
2. validate shape
3. normalize into internal model
4. render from internal model

## Invariants
- Page components must not become schema parsers.
- Missing optional fields should degrade gracefully.
- Unknown fields should not break rendering.
- Slugs and canonical identifiers should be explicit.
- Dates, authors, file links, and media references should be normalized before UI rendering.

## Suggested implementation pattern
- `content-models/schemas/*` for validators
- `content-models/normalizers/*` for mapping external payloads to internal models
- `content-models/types/*` for app-owned types

## Trigger for documentation updates
Update this file when:
- CMS schema changes
- field names change
- new content entity types are added
- normalization rules change
- rich text/media/file handling changes
