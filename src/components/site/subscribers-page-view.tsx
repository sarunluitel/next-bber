import { LockIcon, MailIcon, ShieldCheckIcon } from "lucide-react";
import Link from "next/link";
import { SectionPageShell } from "@/components/site/section-page-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import type {
  SubscriberContentSection,
  SubscribersArticlePage,
  SubscribersLandingPage,
  SubscribersLoginPage,
  SubscribersPage,
} from "@/content-models/subscribers-content";

export function SubscribersPageView({ page }: { page: SubscribersPage }) {
  return (
    <SectionPageShell pathname={page.sidebarPath ?? page.path}>
      <div className="flex flex-col gap-8">
        <PageHeading
          eyebrow={page.eyebrow ?? "Subscribers"}
          title={page.title}
          lead={page.lead}
        />

        {page.kind === "landing" ? <LandingPage page={page} /> : null}
        {page.kind === "article" ? <ArticlePage page={page} /> : null}
        {page.kind === "login" ? <LoginPage page={page} /> : null}
      </div>
    </SectionPageShell>
  );
}

function PageHeading({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
}) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--bber-red)]">
        {eyebrow}
      </p>
      <h1 className="font-display text-4xl text-[var(--bber-red)] sm:text-5xl">
        {title}
      </h1>
      {lead ? (
        <p className="max-w-4xl text-base leading-8 text-[var(--bber-ink)]/80">
          {lead}
        </p>
      ) : null}
    </div>
  );
}

function LandingPage({ page }: { page: SubscribersLandingPage }) {
  return (
    <div className="flex flex-col gap-8">
      {page.sections.map((section, index) => (
        <ContentSectionCard key={`${page.path}-${index}`} section={section} />
      ))}

      <Card className="overflow-hidden border border-[var(--bber-border)] bg-[radial-gradient(circle_at_top_left,rgba(186,12,47,0.12),transparent_28%),linear-gradient(180deg,#fff_0%,#f8f3eb_100%)] py-0 shadow-sm">
        <CardHeader className="px-6 pt-6">
          <CardTitle className="font-display text-3xl text-[var(--bber-red)]">
            Subscriber Access
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 px-6 pb-6 md:grid-cols-2">
          {page.accessLinks.map((link) => (
            <Card
              key={link.href}
              className="border border-[var(--bber-border)] bg-white py-0 shadow-none"
            >
              <CardContent className="flex h-full flex-col gap-4 px-5 py-5">
                <div className="space-y-2">
                  <h2 className="font-display text-2xl text-[var(--bber-red)]">
                    {link.title}
                  </h2>
                  {link.description ? (
                    <p className="text-sm leading-7 text-[var(--bber-ink)]/78">
                      {link.description}
                    </p>
                  ) : null}
                </div>
                <Button
                  nativeButton={false}
                  render={<Link href={link.href} />}
                  className="w-full sm:w-auto"
                >
                  Open Page
                </Button>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function ArticlePage({ page }: { page: SubscribersArticlePage }) {
  return (
    <div className="flex flex-col gap-6">
      {page.sections.map((section, index) => (
        <ContentSectionCard key={`${page.path}-${index}`} section={section} />
      ))}
    </div>
  );
}

function LoginPage({ page }: { page: SubscribersLoginPage }) {
  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,0.95fr)_minmax(20rem,0.75fr)]">
      <Card className="border border-[var(--bber-border)] bg-white py-0 shadow-sm">
        <CardHeader className="px-6 pt-6">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-[var(--bber-sand)] text-[var(--bber-red)]">
              <LockIcon className="size-5" />
            </div>
            <div className="space-y-1">
              <CardTitle className="font-display text-3xl text-[var(--bber-red)]">
                Login
              </CardTitle>
              <p className="text-sm leading-7 text-[var(--bber-ink)]/78">
                Enter subscriber credentials to access FOR-UNM materials.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5 px-6 pb-6">
          <form className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="subscriber-username"
                className="text-sm font-medium text-[var(--bber-ink)]"
              >
                {page.usernameLabel}
              </label>
              <Input
                id="subscriber-username"
                type="text"
                name="username"
                autoComplete="username"
                placeholder="Enter your username"
                disabled
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="subscriber-password"
                className="text-sm font-medium text-[var(--bber-ink)]"
              >
                {page.passwordLabel}
              </label>
              <Input
                id="subscriber-password"
                type="password"
                name="current-password"
                autoComplete="current-password"
                placeholder="Enter your password"
                disabled
              />
            </div>

            <Button className="w-full sm:w-auto" disabled>
              {page.submitLabel}
            </Button>
          </form>

          <Separator />

          <p className="text-sm leading-7 text-[var(--bber-ink)]/78">
            {page.statusNote}
          </p>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-6">
        <Card className="border border-[var(--bber-border)] bg-white py-0 shadow-sm">
          <CardHeader className="px-6 pt-6">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-[var(--bber-sand)] text-[var(--bber-red)]">
                <ShieldCheckIcon className="size-5" />
              </div>
              <CardTitle className="font-display text-3xl text-[var(--bber-red)]">
                {page.supportTitle}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 px-6 pb-6">
            {page.supportParagraphs.map((paragraph) => (
              <p
                key={paragraph}
                className="text-sm leading-7 text-[var(--bber-ink)]/78"
              >
                {paragraph}
              </p>
            ))}
          </CardContent>
        </Card>

        <Card className="border border-[var(--bber-border)] bg-white py-0 shadow-sm">
          <CardContent className="space-y-4 px-6 py-6">
            {page.supportLinks.map((link) => (
              <div key={link.href} className="space-y-2">
                <Link
                  href={link.href}
                  className="inline-flex items-center gap-2 font-semibold text-[var(--bber-red)] transition-colors hover:text-[var(--bber-red-strong)]"
                >
                  <MailIcon className="size-4" />
                  {link.title}
                </Link>
                {link.description ? (
                  <p className="text-sm leading-7 text-[var(--bber-ink)]/78">
                    {link.description}
                  </p>
                ) : null}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ContentSectionCard({
  section,
}: {
  section: SubscriberContentSection;
}) {
  return (
    <Card className="border border-[var(--bber-border)] bg-white py-0 shadow-sm">
      <CardContent className="px-6 py-6">
        <div className="space-y-4">
          {section.title ? (
            <h2 className="font-display text-3xl text-[var(--bber-red)]">
              {section.title}
            </h2>
          ) : null}

          {section.note ? (
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--bber-ink)]/65">
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

          {section.bullets?.length ? (
            <ul className="flex list-disc flex-col gap-3 pl-5 text-base leading-8 text-[var(--bber-ink)]/80">
              {section.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          ) : null}

          {section.links?.length ? (
            <div className="grid gap-4 md:grid-cols-2">
              {section.links.map((link) => (
                <Card
                  key={link.href}
                  className="border border-[var(--bber-border)] bg-[var(--bber-sand)]/25 py-0 shadow-none"
                >
                  <CardContent className="space-y-2 px-5 py-5">
                    <Link
                      href={link.href}
                      className="font-semibold text-[var(--bber-red)] transition-colors hover:text-[var(--bber-red-strong)]"
                    >
                      {link.title}
                    </Link>
                    {link.description ? (
                      <p className="text-sm leading-7 text-[var(--bber-ink)]/78">
                        {link.description}
                      </p>
                    ) : null}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
