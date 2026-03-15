import { CalendarIcon, Clock3Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SectionPageShell } from "@/components/site/section-page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ConferenceContentBlock,
  type ConferencePage,
  conferenceTextToLinks,
  formatConferenceDate,
} from "@/content-models/bber-data-conferences";

export function DataConferencePageView({ page }: { page: ConferencePage }) {
  const newestConference = page.archive[0] ?? null;

  return (
    <SectionPageShell pathname="/data/nm-duc/">
      <div className="flex flex-col gap-8">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--bber-red)]">
            Data
          </p>
          {page.kind === "detail" ? (
            <Link
              href="/data/nm-duc/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--bber-red)] transition-colors hover:text-[var(--bber-red-strong)]"
            >
              Back to conference archive
            </Link>
          ) : null}
          <h1 className="font-display text-4xl text-[var(--bber-red)] sm:text-5xl">
            {page.title}
          </h1>
          {page.kind === "index" ? (
            <p className="max-w-4xl text-base leading-8 text-[var(--bber-ink)]/80">
              Conference programs, presentation materials, recordings, and
              related announcements are published here as they are updated by
              the BBER data team.
            </p>
          ) : (
            <p className="max-w-4xl text-base leading-8 text-[var(--bber-ink)]/80">
              Conference materials and related resources are published from the
              BBER conference archive and update automatically as the source
              content changes.
            </p>
          )}
        </div>

        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_21rem]">
          <div>
            <Card className="border border-[var(--bber-border)] bg-white py-0 shadow-sm">
              <CardContent className="space-y-6 px-6 py-6">
                {page.blocks.map((block, index) => (
                  <ConferenceBlockView
                    key={`${page.slug}-${block.kind}-${index}`}
                    block={block}
                  />
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col gap-6">
            {newestConference ? (
              <Card className="overflow-hidden border border-[var(--bber-border)] bg-[radial-gradient(circle_at_top_left,rgba(186,12,47,0.12),transparent_28%),linear-gradient(180deg,#fff_0%,#f8f3eb_100%)] py-0 shadow-sm">
                <CardHeader className="px-6 pt-6">
                  <CardTitle className="font-display text-3xl text-[var(--bber-red)]">
                    Latest Conference
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 px-6 pb-6">
                  <h2 className="font-display text-2xl text-[var(--bber-red)]">
                    {newestConference.title}
                  </h2>
                  <p className="text-sm leading-7 text-[var(--bber-ink)]/78">
                    {newestConference.summary}
                  </p>
                </CardContent>
              </Card>
            ) : null}

            <Card className="border border-[var(--bber-border)] bg-white py-0 shadow-sm">
              <CardHeader className="px-6 pt-6">
                <CardTitle className="font-display text-3xl text-[var(--bber-red)]">
                  Past Conferences
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <ul className="space-y-3">
                  {page.archive.map((conference) => {
                    const isActive = conference.slug === page.slug;

                    return (
                      <li key={conference.href}>
                        <Link
                          href={conference.href}
                          className={`block rounded-lg px-1 py-1 text-[var(--bber-red)] transition-colors hover:text-[var(--bber-red-strong)] ${
                            isActive ? "font-bold" : "font-normal"
                          }`}
                          aria-current={isActive ? "page" : undefined}
                        >
                          {conference.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </CardContent>
            </Card>

            <Card className="border border-[var(--bber-border)] bg-white py-0 shadow-sm">
              <CardHeader className="px-6 pt-6">
                <CardTitle className="font-display text-3xl text-[var(--bber-red)]">
                  Page Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 px-6 pb-6">
                <div className="flex items-start gap-3">
                  <CalendarIcon className="mt-1 size-4 text-[var(--bber-red)]" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--bber-red)]">
                      Published
                    </p>
                    <p className="text-sm leading-7 text-[var(--bber-ink)]/78">
                      {formatConferenceDate(page.publishedAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock3Icon className="mt-1 size-4 text-[var(--bber-red)]" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--bber-red)]">
                      Updated
                    </p>
                    <p className="text-sm leading-7 text-[var(--bber-ink)]/78">
                      {formatConferenceDate(page.updatedAt)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SectionPageShell>
  );
}

function ConferenceBlockView({ block }: { block: ConferenceContentBlock }) {
  if (block.kind === "image") {
    return (
      <div className="overflow-hidden rounded-2xl border border-[var(--bber-border)] bg-[var(--bber-sand)]/20">
        <div className="relative aspect-[16/9]">
          <Image
            src={block.src}
            alt={block.alt}
            fill
            sizes="(max-width: 1280px) 100vw, 60vw"
            className="object-cover"
          />
        </div>
      </div>
    );
  }

  if (block.kind === "heading") {
    if (block.level === 2) {
      return (
        <h2 className="font-display text-3xl text-[var(--bber-red)]">
          {block.text}
        </h2>
      );
    }

    if (block.level === 3) {
      return (
        <h3 className="font-display text-2xl text-[var(--bber-red)]">
          {block.text}
        </h3>
      );
    }

    return (
      <h4 className="text-lg font-semibold text-[var(--bber-red)]">
        {block.text}
      </h4>
    );
  }

  if (block.kind === "list") {
    return (
      <ul className="flex list-disc flex-col gap-3 pl-5 text-base leading-8 text-[var(--bber-ink)]/82">
        {block.items.map((item) => (
          <li key={item}>
            <InlineConferenceText value={item} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <p className="text-base leading-8 text-[var(--bber-ink)]/82">
      <InlineConferenceText value={block.text} />
    </p>
  );
}

function InlineConferenceText({ value }: { value: string }) {
  const segments = conferenceTextToLinks(value);

  return (
    <>
      {segments.map((segment, index) => {
        if (segment.kind === "text") {
          return <span key={`${segment.value}-${index}`}>{segment.value}</span>;
        }

        const isInternalLink =
          segment.href.startsWith("/") && !segment.href.startsWith("//");

        if (isInternalLink) {
          return (
            <Link
              key={`${segment.href}-${index}`}
              href={segment.href}
              className="font-semibold text-[var(--bber-red)] transition-colors hover:text-[var(--bber-red-strong)]"
            >
              {segment.label}
            </Link>
          );
        }

        return (
          <a
            key={`${segment.href}-${index}`}
            href={segment.href}
            className="font-semibold text-[var(--bber-red)] transition-colors hover:text-[var(--bber-red-strong)]"
            target="_blank"
            rel="noreferrer"
          >
            {segment.label}
          </a>
        );
      })}
    </>
  );
}
