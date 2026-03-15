import { ArrowUpRightIcon, MapIcon } from "lucide-react";
import Link from "next/link";
import { SectionPageShell } from "@/components/site/section-page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type {
  ColoniaCountyGroup,
  ColoniasNarrativeSection,
  ColoniasResourceLink,
} from "@/content-models/colonias-content";

const coloniaMapsCountyDisplayOrder = [
  "Chaves County",
  "Socorro County",
  "Sierra County",
  "Lincoln County",
  "Luna County",
  "Eddy County",
  "Hidalgo County",
  "Otero County",
  "Catron County",
  "Grant County",
  "Dona Ana County",
] as const;

function sortCountyGroupsForMapGrid(
  countyGroups: ReadonlyArray<ColoniaCountyGroup>,
) {
  const displayOrder = new Map<string, number>(
    coloniaMapsCountyDisplayOrder.map((countyName, index) => [
      countyName,
      index,
    ]),
  );

  // The map directory uses a fixed multi-column grid, so this explicit order
  // keeps the smaller county groups together before the larger directories.
  return [...countyGroups].sort((leftCountyGroup, rightCountyGroup) => {
    const leftOrder =
      displayOrder.get(leftCountyGroup.county) ?? Number.MAX_SAFE_INTEGER;
    const rightOrder =
      displayOrder.get(rightCountyGroup.county) ?? Number.MAX_SAFE_INTEGER;

    if (leftOrder !== rightOrder) {
      return leftOrder - rightOrder;
    }

    return leftCountyGroup.county.localeCompare(rightCountyGroup.county);
  });
}

function ResourceLink({
  resource,
  className,
}: {
  resource: ColoniasResourceLink;
  className?: string;
}) {
  const isInternalLink =
    resource.href.startsWith("/") && !resource.href.startsWith("//");

  if (isInternalLink) {
    return (
      <Link
        href={resource.href}
        className={
          className ??
          "inline-flex items-center gap-2 font-semibold text-[var(--bber-red)] transition-colors hover:text-[var(--bber-red-strong)]"
        }
      >
        {resource.title}
      </Link>
    );
  }

  return (
    <a
      href={resource.href}
      target="_blank"
      rel="noreferrer"
      className={
        className ??
        "inline-flex items-center gap-2 font-semibold text-[var(--bber-red)] transition-colors hover:text-[var(--bber-red-strong)]"
      }
    >
      {resource.title}
    </a>
  );
}

function NarrativeSection({ section }: { section: ColoniasNarrativeSection }) {
  return (
    <Card className="border border-[var(--bber-border)] bg-white py-0 shadow-sm">
      <CardContent className="space-y-4 px-6 py-6">
        {section.title ? (
          <h2 className="font-display text-3xl text-[var(--bber-red)]">
            {section.title}
          </h2>
        ) : null}
        {section.paragraphs.map((paragraph) => (
          <p
            key={paragraph}
            className="text-base leading-8 text-[var(--bber-ink)]/80"
          >
            {paragraph}
          </p>
        ))}
      </CardContent>
    </Card>
  );
}

export function ColoniasOverviewPageView({
  eyebrow,
  title,
  lead,
  heroParagraphs,
  heroLinks,
  downloadableResources,
  methodologySections,
  referenceLinks,
  pathname,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  heroParagraphs: ReadonlyArray<string>;
  heroLinks: ReadonlyArray<ColoniasResourceLink>;
  downloadableResources: ReadonlyArray<ColoniasResourceLink>;
  methodologySections: ReadonlyArray<ColoniasNarrativeSection>;
  referenceLinks: ReadonlyArray<ColoniasResourceLink>;
  pathname: string;
}) {
  return (
    <SectionPageShell pathname={pathname}>
      <div className="space-y-8">
        <Card className="overflow-hidden border border-[var(--bber-border)] bg-[radial-gradient(circle_at_top_left,rgba(186,12,47,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(173,133,61,0.14),transparent_30%),linear-gradient(135deg,#fff_0%,#f8f3eb_50%,#efe3d0_100%)] py-0 shadow-sm">
          <CardContent className="grid gap-8 px-6 py-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(16rem,0.8fr)] lg:px-8 lg:py-10">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--bber-red)]">
                {eyebrow}
              </p>
              <h1 className="font-display text-4xl text-[var(--bber-red)] sm:text-5xl">
                {title}
              </h1>
              <p className="max-w-4xl text-base leading-8 text-[var(--bber-ink)]/80">
                {lead}
              </p>
              <div className="space-y-4">
                {heroParagraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="text-base leading-8 text-[var(--bber-ink)]/82"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            <div className="grid gap-4">
              <Card className="border border-[var(--bber-border)] bg-white/90 shadow-none">
                <CardHeader className="px-5 pt-5 pb-3">
                  <CardTitle className="text-base text-[var(--bber-red)]">
                    Key Resources
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 px-5 pb-5">
                  {heroLinks.map((resource) => (
                    <ResourceLink key={resource.href} resource={resource} />
                  ))}
                </CardContent>
              </Card>

              <Card className="border border-[var(--bber-border)] bg-white/90 shadow-none">
                <CardHeader className="px-5 pt-5 pb-3">
                  <CardTitle className="text-base text-[var(--bber-red)]">
                    Reference Sources
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 px-5 pb-5">
                  {referenceLinks.map((resource) => (
                    <div key={resource.href} className="space-y-1">
                      <ResourceLink resource={resource} />
                      {resource.description ? (
                        <p className="text-sm leading-7 text-[var(--bber-ink)]/75">
                          {resource.description}
                        </p>
                      ) : null}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-[var(--bber-border)] bg-white py-0 shadow-sm">
          <CardHeader className="px-6 pt-6">
            <CardTitle className="font-display text-3xl text-[var(--bber-red)]">
              Downloadable Files
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-5 px-6 pb-6 md:grid-cols-2">
            {downloadableResources.map((resource) => (
              <Card
                key={resource.href}
                className="border border-[var(--bber-border)] bg-[var(--bber-sand)]/18 py-0 shadow-none"
              >
                <CardContent className="flex h-full flex-col gap-4 px-5 py-5">
                  <div className="space-y-2">
                    <h2 className="font-display text-2xl text-[var(--bber-red)]">
                      {resource.title}
                    </h2>
                    {resource.description ? (
                      <p className="text-sm leading-7 text-[var(--bber-ink)]/78">
                        {resource.description}
                      </p>
                    ) : null}
                  </div>
                  <div className="mt-auto">
                    <OpenResourceAction href={resource.href} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          {methodologySections.map((section, index) => (
            <NarrativeSection
              key={`${section.title ?? "section"}-${index}`}
              section={section}
            />
          ))}
        </div>
      </div>
    </SectionPageShell>
  );
}

export function ColoniaMapsPageView({
  eyebrow,
  title,
  lead,
  backHref,
  backLabel,
  introParagraphs,
  overviewLinks,
  counties,
  pathname,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  backHref: string;
  backLabel: string;
  introParagraphs: ReadonlyArray<string>;
  overviewLinks: ReadonlyArray<ColoniasResourceLink>;
  counties: ReadonlyArray<ColoniaCountyGroup>;
  pathname: string;
}) {
  const orderedCountyGroups = sortCountyGroupsForMapGrid(counties);

  return (
    <SectionPageShell pathname={pathname}>
      <div className="space-y-8">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--bber-red)]">
            {eyebrow}
          </p>
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--bber-red)] transition-colors hover:text-[var(--bber-red-strong)]"
          >
            {backLabel}
          </Link>
          <h1 className="font-display text-4xl text-[var(--bber-red)] sm:text-5xl">
            {title}
          </h1>
          <p className="max-w-4xl text-base leading-8 text-[var(--bber-ink)]/80">
            {lead}
          </p>
        </div>

        <Card className="border border-[var(--bber-border)] bg-white py-0 shadow-sm">
          <CardContent className="space-y-4 px-6 py-6">
            {introParagraphs.map((paragraph) => (
              <p
                key={paragraph}
                className="text-base leading-8 text-[var(--bber-ink)]/80"
              >
                {paragraph}
              </p>
            ))}
            <div className="flex flex-wrap gap-4">
              {overviewLinks.map((resource) => (
                <ResourceLink
                  key={resource.href}
                  resource={resource}
                  className="inline-flex items-center gap-2 font-semibold text-[var(--bber-red)] transition-colors hover:text-[var(--bber-red-strong)]"
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 xl:grid-cols-3">
          {orderedCountyGroups.map((countyGroup) => (
            <Card
              key={countyGroup.county}
              className="border border-[var(--bber-border)] bg-white py-0 shadow-sm"
            >
              <CardHeader className="px-6 pt-6">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-[var(--bber-sand)] text-[var(--bber-red)]">
                    <MapIcon className="size-5" />
                  </div>
                  <CardTitle className="font-display text-2xl text-[var(--bber-red)]">
                    {countyGroup.county}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <ul className="space-y-3">
                  {countyGroup.maps.map((map) => (
                    <li key={`${countyGroup.county}-${map.title}`}>
                      <a
                        href={map.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-start gap-2 text-sm leading-7 text-[var(--bber-red)] transition-colors hover:text-[var(--bber-red-strong)]"
                      >
                        <ArrowUpRightIcon className="mt-1 size-4 shrink-0" />
                        <span>{map.title}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </SectionPageShell>
  );
}

function OpenResourceAction({ href }: { href: string }) {
  const className =
    "inline-flex h-8 w-full items-center justify-center gap-1.5 rounded-lg border border-transparent bg-primary px-2.5 text-sm font-medium whitespace-nowrap text-primary-foreground transition-all hover:bg-primary/80 sm:w-auto";

  if (href.startsWith("/") && !href.startsWith("//")) {
    return (
      <Link href={href} className={className}>
        Open resource
      </Link>
    );
  }

  return (
    <a href={href} target="_blank" rel="noreferrer" className={className}>
      Open resource
    </a>
  );
}
