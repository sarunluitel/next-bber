import { ArrowUpRightIcon, MailIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AboutContactForm } from "@/components/site/about-contact-form";
import { SectionPageShell } from "@/components/site/section-page-shell";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type {
  AboutArticlePage,
  AboutContactPage,
  AboutContentSection,
  AboutForecastingPage,
  AboutHelpfulLinksPage,
  AboutImageAsset,
  AboutPage,
  AboutPeopleDirectoryPage,
  AboutPersonProfilePage,
  AboutPersonSummary,
  AboutServicesLandingPage,
} from "@/content-models/about-content";

type AboutPageViewProps = {
  page: AboutPage;
};

export function AboutPageView({ page }: AboutPageViewProps) {
  return (
    <SectionPageShell pathname={page.sidebarPath ?? page.path}>
      <div className="flex flex-col gap-8">
        <AboutPageHeading
          eyebrow={page.eyebrow ?? "About"}
          title={page.title}
          lead={page.lead}
        />

        {page.kind === "article" ? <ArticlePage page={page} /> : null}
        {page.kind === "services-landing" ? (
          <ServicesLandingPage page={page} />
        ) : null}
        {page.kind === "forecasting" ? <ForecastingPage page={page} /> : null}
        {page.kind === "people-directory" ? (
          <PeopleDirectoryPage page={page} />
        ) : null}
        {page.kind === "person-profile" ? (
          <PersonProfilePage page={page} />
        ) : null}
        {page.kind === "helpful-links" ? (
          <HelpfulLinksPage page={page} />
        ) : null}
        {page.kind === "contact" ? <ContactPage page={page} /> : null}
      </div>
    </SectionPageShell>
  );
}

function AboutPageHeading({
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

function ArticlePage({ page }: { page: AboutArticlePage }) {
  return (
    <div className="flex flex-col gap-8">
      {page.heroImage ? <FeatureImage asset={page.heroImage} /> : null}
      {page.sections.map((section, index) => (
        <ContentSectionCard
          key={`${page.path}-${index}`}
          section={section}
          titleClassName={index === 0 ? "text-[var(--bber-red)]" : undefined}
        />
      ))}
      {page.quotes?.length ? <QuoteGrid quotes={page.quotes} /> : null}
    </div>
  );
}

function ServicesLandingPage({ page }: { page: AboutServicesLandingPage }) {
  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-6 xl:grid-cols-2">
        {page.serviceFeatures.map((feature) => (
          <Card
            key={feature.href}
            className="overflow-hidden border border-[var(--bber-border)] bg-white py-0 shadow-sm"
          >
            <div className="relative aspect-[16/5]">
              <Image
                src={feature.image.src}
                alt={feature.image.alt}
                fill
                sizes="(max-width: 1280px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <CardHeader className="px-6 pt-6">
              <CardTitle className="font-display text-3xl text-[var(--bber-red)]">
                {feature.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-5 px-6 pb-6">
              <p className="text-base leading-8 text-[var(--bber-ink)]/80">
                {feature.description}
              </p>
              <Button
                nativeButton={false}
                render={<Link href={feature.href} />}
                className="w-full sm:w-auto"
              >
                Learn More
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {page.sections.map((section, index) => (
        <ContentSectionCard key={`${page.path}-${index}`} section={section} />
      ))}
    </div>
  );
}

function ForecastingPage({ page }: { page: AboutForecastingPage }) {
  return (
    <div className="flex flex-col gap-8">
      {page.heroImage ? <FeatureImage asset={page.heroImage} /> : null}

      {page.sections.map((section, index) => (
        <ContentSectionCard key={`${page.path}-${index}`} section={section} />
      ))}

      <div className="grid gap-6 xl:grid-cols-3">
        {page.subscriptionTiers.map((tier) => (
          <Card
            key={tier.title}
            className="border border-[var(--bber-border)] bg-white py-0 shadow-sm"
          >
            <CardHeader className="px-6 pt-6">
              <CardTitle className="font-display text-3xl text-[var(--bber-red)]">
                {tier.title}
              </CardTitle>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--bber-ink)]/65">
                {tier.price}
              </p>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <ul className="flex list-disc flex-col gap-3 pl-5 text-base leading-8 text-[var(--bber-ink)]/80">
                {tier.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {page.supportingImages?.length ? (
        <div className="grid gap-6 md:grid-cols-2">
          {page.supportingImages.map((image) => (
            <FeatureImage key={image.src} asset={image} />
          ))}
        </div>
      ) : null}

      <Card className="border border-[var(--bber-border)] bg-white py-0 shadow-sm">
        <CardContent className="px-6 py-6">
          <p className="text-base leading-8 text-[var(--bber-ink)]/80">
            Please email{" "}
            <Link
              href="mailto:bber@unm.edu"
              className="font-semibold text-[var(--bber-red)] transition-colors hover:text-[var(--bber-red-strong)]"
            >
              bber@unm.edu
            </Link>{" "}
            to subscribe or ask about the forecast.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function PeopleDirectoryPage({ page }: { page: AboutPeopleDirectoryPage }) {
  return (
    <div className="flex flex-col gap-8">
      <PeopleGrid people={page.currentPeople} />

      {page.pastPeople?.length ? (
        <Card className="border border-[var(--bber-border)] bg-white py-0 shadow-sm">
          <CardContent className="px-6 py-6">
            <Accordion>
              <AccordionItem value="past-employees" className="border-none">
                <AccordionTrigger className="rounded-lg border border-[var(--bber-border)] px-4 py-4 font-display text-2xl text-[var(--bber-red)] no-underline hover:no-underline">
                  {page.pastPeopleHeading ?? "Past Employees"}
                </AccordionTrigger>
                <AccordionContent className="pt-6">
                  <PeopleGrid people={page.pastPeople} />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

function PeopleGrid({ people }: { people: AboutPersonSummary[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {people.map((person) => (
        <Card
          key={person.profilePath}
          className="flex h-full flex-col overflow-hidden border border-[var(--bber-border)] bg-white py-0 shadow-sm"
        >
          <div className="relative aspect-[4/5] bg-[var(--bber-sand)]">
            <Image
              src={person.image.src}
              alt={person.image.alt}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
              className="object-cover"
            />
          </div>
          <CardHeader className="px-6 pt-6">
            <CardTitle className="font-display text-3xl text-[var(--bber-red)]">
              {person.name}
            </CardTitle>
            <div className="space-y-1">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--bber-ink)]/65">
                {person.tenure ?? person.role}
              </p>
              {person.tenure ? (
                <p className="text-sm leading-7 text-[var(--bber-ink)]/70">
                  {person.role}
                </p>
              ) : null}
            </div>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-5 px-6 pb-6">
            {person.email ? (
              <Link
                href={`mailto:${person.email}`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--bber-red)] transition-colors hover:text-[var(--bber-red-strong)]"
              >
                <MailIcon className="size-4" />
                {person.email}
              </Link>
            ) : null}
            <p
              className="flex-1 text-base leading-8 text-[var(--bber-ink)]/80"
              style={{
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 6,
                display: "-webkit-box",
                overflow: "hidden",
              }}
            >
              {person.excerpt}
            </p>
            <Button
              nativeButton={false}
              render={<Link href={person.profilePath} />}
              className="mt-auto w-full sm:w-auto"
            >
              View Bio
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function PersonProfilePage({ page }: { page: AboutPersonProfilePage }) {
  return (
    <div className="grid gap-8 xl:grid-cols-[320px_minmax(0,1fr)]">
      <Card className="overflow-hidden border border-[var(--bber-border)] bg-white py-0 shadow-sm">
        <div className="relative aspect-[4/5] bg-[var(--bber-sand)]">
          <Image
            src={page.person.image.src}
            alt={page.person.image.alt}
            fill
            sizes="(max-width: 1280px) 100vw, 320px"
            className="object-cover"
          />
        </div>
        <CardContent className="flex flex-col gap-4 px-6 py-6">
          <div className="space-y-1">
            <h2 className="font-display text-3xl text-[var(--bber-red)]">
              {page.person.name}
            </h2>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--bber-ink)]/65">
              {page.person.tenure ?? page.person.role}
            </p>
            {page.person.employmentLabel ? (
              <p className="text-sm leading-7 text-[var(--bber-ink)]/70">
                {page.person.employmentLabel}
              </p>
            ) : null}
            {page.person.tenure ? (
              <p className="text-sm leading-7 text-[var(--bber-ink)]/70">
                {page.person.role}
              </p>
            ) : null}
          </div>

          {page.person.email ? (
            <Link
              href={`mailto:${page.person.email}`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--bber-red)] transition-colors hover:text-[var(--bber-red-strong)]"
            >
              <MailIcon className="size-4" />
              {page.person.email}
            </Link>
          ) : null}

          <Button
            nativeButton={false}
            render={<Link href={page.directoryPath} />}
            variant="outline"
            className="w-full sm:w-auto"
          >
            Back to {page.directoryTitle}
          </Button>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-6">
        {page.sections.map((section, index) => (
          <ContentSectionCard key={`${page.path}-${index}`} section={section} />
        ))}
      </div>
    </div>
  );
}

function HelpfulLinksPage({ page }: { page: AboutHelpfulLinksPage }) {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      {page.groups.map((group) => (
        <Card
          key={group.title}
          className="border border-[var(--bber-border)] bg-white py-0 shadow-sm"
        >
          <CardHeader className="px-6 pt-6">
            <CardTitle className="font-display text-3xl text-[var(--bber-red)]">
              {group.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="flex flex-col gap-4">
              {group.links.map((link, index) => (
                <div key={`${group.title}-${link.title}-${link.href}`}>
                  <Link
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-start gap-2 text-base font-semibold leading-7 text-[var(--bber-ink)] transition-colors hover:text-[var(--bber-red)]"
                  >
                    {link.title}
                    <ArrowUpRightIcon className="mt-1 size-4 shrink-0 text-[var(--bber-red)]" />
                  </Link>
                  {index < group.links.length - 1 ? (
                    <Separator className="mt-4 bg-[var(--bber-border)]" />
                  ) : null}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ContactPage({ page }: { page: AboutContactPage }) {
  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
      <div className="flex flex-col gap-8">
        <AboutContactForm destinationEmail={page.formEmail} />

        <Card className="border border-[var(--bber-border)] bg-white py-0 shadow-sm">
          <CardHeader className="px-6 pt-6">
            <CardTitle className="font-display text-3xl text-[var(--bber-red)]">
              Find BBER
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-5 px-6 pb-6">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-[var(--bber-border)]">
              <Image
                src={page.mapImage.src}
                alt={page.mapImage.alt}
                fill
                sizes="(max-width: 1280px) 100vw, 60vw"
                className="object-cover"
              />
            </div>
            <p className="text-base leading-8 text-[var(--bber-ink)]/80">
              {page.locationSummary}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-6">
        {page.locations.map((location) => (
          <Card
            key={location.title}
            className="border border-[var(--bber-border)] bg-white py-0 shadow-sm"
          >
            <CardHeader className="px-6 pt-6">
              <CardTitle className="font-display text-3xl text-[var(--bber-red)]">
                {location.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="flex flex-col gap-1 text-base leading-8 text-[var(--bber-ink)]/80">
                {location.lines.map((line) => (
                  <p key={`${location.title}-${line}`}>{line}</p>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        <Card className="border border-[var(--bber-border)] bg-white py-0 shadow-sm">
          <CardHeader className="px-6 pt-6">
            <CardTitle className="font-display text-3xl text-[var(--bber-red)]">
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="flex flex-col gap-5">
              {page.contactLinks.map((link, index) => (
                <div key={`${link.title}-${link.href}`}>
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--bber-ink)]/65">
                    {link.title}
                  </p>
                  <Link
                    href={link.href}
                    target={
                      link.href.startsWith("mailto:") ? undefined : "_blank"
                    }
                    rel={
                      link.href.startsWith("mailto:") ? undefined : "noreferrer"
                    }
                    className="mt-1 inline-flex items-start gap-2 text-base font-semibold leading-7 text-[var(--bber-red)] transition-colors hover:text-[var(--bber-red-strong)]"
                  >
                    {link.description ?? link.href}
                    {!link.href.startsWith("mailto:") ? (
                      <ArrowUpRightIcon className="mt-1 size-4 shrink-0" />
                    ) : null}
                  </Link>
                  {index < page.contactLinks.length - 1 ? (
                    <Separator className="mt-5 bg-[var(--bber-border)]" />
                  ) : null}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function FeatureImage({ asset }: { asset: AboutImageAsset }) {
  return (
    <Card className="overflow-hidden border border-[var(--bber-border)] bg-white py-0 shadow-sm">
      <div
        className="relative"
        style={{ aspectRatio: asset.aspectRatio ?? "16 / 9" }}
      >
        <Image
          src={asset.src}
          alt={asset.alt}
          fill
          sizes="(max-width: 1280px) 100vw, 70vw"
          className="object-cover"
        />
      </div>
    </Card>
  );
}

function ContentSectionCard({
  section,
  titleClassName,
}: {
  section: AboutContentSection;
  titleClassName?: string;
}) {
  return (
    <Card className="border border-[var(--bber-border)] bg-white py-0 shadow-sm">
      {section.title ? (
        <CardHeader className="px-6 pt-6">
          <CardTitle
            className={`font-display text-3xl ${titleClassName ?? "text-[var(--bber-red)]"}`}
          >
            {section.title}
          </CardTitle>
        </CardHeader>
      ) : null}
      <CardContent className="flex flex-col gap-5 px-6 pb-6 pt-6">
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
          <div className="flex flex-col gap-4">
            {section.links.map((link) => (
              <div key={`${link.title}-${link.href}`}>
                <Link
                  href={link.href}
                  target={
                    link.href.startsWith("/") || link.href.startsWith("mailto:")
                      ? undefined
                      : "_blank"
                  }
                  rel={
                    link.href.startsWith("/") || link.href.startsWith("mailto:")
                      ? undefined
                      : "noreferrer"
                  }
                  className="inline-flex items-start gap-2 text-base font-semibold leading-7 text-[var(--bber-red)] transition-colors hover:text-[var(--bber-red-strong)]"
                >
                  {link.title}
                  {!link.href.startsWith("mailto:") ? (
                    <ArrowUpRightIcon className="mt-1 size-4 shrink-0" />
                  ) : null}
                </Link>
                {link.description ? (
                  <p className="mt-1 text-sm leading-7 text-[var(--bber-ink)]/70">
                    {link.description}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        ) : null}

        {section.note ? (
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--bber-ink)]/65">
            {section.note}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}

function QuoteGrid({
  quotes,
}: {
  quotes: {
    quote: string;
    attribution: string;
  }[];
}) {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      {quotes.map((quote) => (
        <Card
          key={quote.quote}
          className="border border-[var(--bber-border)] bg-white py-0 shadow-sm"
        >
          <CardContent className="flex flex-col gap-4 px-6 py-6">
            <p className="font-display text-2xl leading-9 text-[var(--bber-ink)]">
              {quote.quote}
            </p>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--bber-red)]">
              {quote.attribution}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
