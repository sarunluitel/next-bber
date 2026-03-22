import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { SectionPageShell } from "@/components/site/section-page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type {
  StaticResourceLink,
  StaticResourceLinkGroup,
  StaticResourcePage,
  StaticResourceSection,
} from "@/content-models/data-static-pages";

function isInternalHref(href: string) {
  return href.startsWith("/") && !href.startsWith("//");
}

function ResourceAnchor({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className: string;
}) {
  if (isInternalHref(href)) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} target="_blank" rel="noreferrer" className={className}>
      {children}
    </a>
  );
}

function ResourceLinkItem({
  link,
  compact = false,
}: {
  link: StaticResourceLink;
  compact?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <ResourceAnchor
        href={link.href}
        className="font-semibold text-[var(--bber-red)] transition-colors hover:text-[var(--bber-red-strong)]"
      >
        {link.title}
      </ResourceAnchor>
      {link.description ? (
        <p
          className={
            compact
              ? "text-sm leading-6 text-[var(--bber-ink)]/75"
              : "text-sm leading-7 text-[var(--bber-ink)]/78"
          }
        >
          {link.description}
        </p>
      ) : null}
      {link.auxiliaryLinks?.length ? (
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm">
          {link.auxiliaryLinks.map((auxiliaryLink) => (
            <ResourceAnchor
              key={`${link.title}-${auxiliaryLink.href}`}
              href={auxiliaryLink.href}
              className="text-[var(--bber-ink)]/72 underline decoration-[var(--bber-border)] underline-offset-4 transition-colors hover:text-[var(--bber-red)]"
            >
              {auxiliaryLink.title}
            </ResourceAnchor>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function ResourceLinkGroupView({ group }: { group: StaticResourceLinkGroup }) {
  const columns =
    group.columns === 3
      ? "lg:grid-cols-3"
      : group.columns === 2
        ? "md:grid-cols-2"
        : undefined;

  if (group.layout === "cards") {
    return (
      <div className="flex flex-col gap-4">
        {group.title ? (
          <h3 className="font-display text-2xl text-[var(--bber-red)]">
            {group.title}
          </h3>
        ) : null}
        {group.description ? (
          <p className="text-sm leading-7 text-[var(--bber-ink)]/78">
            {group.description}
          </p>
        ) : null}
        <div className={`grid gap-4 ${columns ?? ""}`.trim()}>
          {group.links.map((link) => (
            <Card
              key={link.href}
              className="border border-[var(--bber-border)] bg-[var(--bber-sand)]/18 py-0 shadow-none"
            >
              <CardContent className="flex h-full flex-col gap-3 px-5 py-5">
                <ResourceLinkItem link={link} />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (group.layout === "compact") {
    return (
      <div className="flex flex-col gap-4">
        {group.title ? (
          <h3 className="font-display text-2xl text-[var(--bber-red)]">
            {group.title}
          </h3>
        ) : null}
        {group.description ? (
          <p className="text-sm leading-7 text-[var(--bber-ink)]/78">
            {group.description}
          </p>
        ) : null}
        <div className={`grid gap-4 ${columns ?? "md:grid-cols-2"}`.trim()}>
          {group.links.map((link) => (
            <div
              key={link.href}
              className="rounded-xl border border-[var(--bber-border)] bg-white px-4 py-4"
            >
              <ResourceLinkItem link={link} compact />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {group.title ? (
        <h3 className="font-display text-2xl text-[var(--bber-red)]">
          {group.title}
        </h3>
      ) : null}
      {group.description ? (
        <p className="text-sm leading-7 text-[var(--bber-ink)]/78">
          {group.description}
        </p>
      ) : null}
      <div className="flex flex-col gap-4">
        {group.links.map((link, index) => (
          <div key={link.href} className="flex flex-col gap-4">
            {index > 0 ? <Separator /> : null}
            <ResourceLinkItem link={link} />
          </div>
        ))}
      </div>
    </div>
  );
}

function StaticResourceSectionView({
  section,
}: {
  section: StaticResourceSection;
}) {
  return (
    <Card className="border border-[var(--bber-border)] bg-white py-0 shadow-sm">
      <CardContent className="flex flex-col gap-5 px-6 py-6">
        {section.title ? (
          <h2 className="font-display text-3xl text-[var(--bber-red)]">
            {section.title}
          </h2>
        ) : null}
        {section.note ? (
          <p className="text-sm leading-7 text-[var(--bber-ink)]/72">
            {section.note}
          </p>
        ) : null}
        {section.paragraphs?.map((paragraph) => (
          <p
            key={paragraph}
            className="text-base leading-8 text-[var(--bber-ink)]/80"
          >
            {paragraph}
          </p>
        ))}
        {section.linkGroups?.map((group) => (
          <ResourceLinkGroupView
            key={
              group.title ??
              group.description ??
              group.links[0]?.href ??
              "links"
            }
            group={group}
          />
        ))}
      </CardContent>
    </Card>
  );
}

export function StaticResourcePageView({ page }: { page: StaticResourcePage }) {
  return (
    <SectionPageShell pathname={page.path}>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--bber-red)]">
            {page.eyebrow}
          </p>
          <h1 className="font-display text-4xl text-[var(--bber-red)] sm:text-5xl">
            {page.title}
          </h1>
          <p className="max-w-4xl text-base leading-8 text-[var(--bber-ink)]/80">
            {page.lead}
          </p>
        </div>

        {page.backLink ? (
          <div>
            <ResourceAnchor
              href={page.backLink.href}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--bber-red)] transition-colors hover:text-[var(--bber-red-strong)]"
            >
              <ArrowLeftIcon className="size-4" />
              {page.backLink.label}
            </ResourceAnchor>
          </div>
        ) : null}

        {page.callouts?.length ? (
          <div className="grid gap-5 md:grid-cols-2">
            {page.callouts.map((callout) => (
              <Card
                key={callout.title}
                className="overflow-hidden border border-[var(--bber-border)] bg-[radial-gradient(circle_at_top_left,rgba(186,12,47,0.12),transparent_28%),linear-gradient(180deg,#fff_0%,#f8f3eb_100%)] py-0 shadow-sm"
              >
                <CardHeader className="px-6 pt-6">
                  <CardTitle className="font-display text-3xl text-[var(--bber-red)]">
                    {callout.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex h-full flex-col gap-5 px-6 pb-6">
                  <p className="text-base leading-8 text-[var(--bber-ink)]/80">
                    {callout.description}
                  </p>
                  {callout.href && callout.actionLabel ? (
                    <div className="mt-auto">
                      <ResourceAnchor
                        href={callout.href}
                        className="inline-flex min-h-8 w-full items-center justify-center rounded-lg bg-[var(--bber-red)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--bber-red-strong)] sm:w-auto"
                      >
                        {callout.actionLabel}
                      </ResourceAnchor>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : null}

        {page.sections.map((section) => (
          <StaticResourceSectionView
            key={
              section.title ??
              section.note ??
              section.paragraphs?.[0] ??
              page.path
            }
            section={section}
          />
        ))}
      </div>
    </SectionPageShell>
  );
}
