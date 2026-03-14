import Image from "next/image";
import Link from "next/link";
import { InteractivePrimaryNav } from "@/components/site/interactive-primary-nav";
import { Separator } from "@/components/ui/separator";
import { homepageStaticContent } from "@/content-models/homepage-content";

export function SiteHeader() {
  const { brand, utilityLinks } = homepageStaticContent;

  return (
    <header className="border-b border-[var(--bber-border)] bg-white">
      <div className="bg-[var(--bber-sand)]">
        <div className="mx-auto flex w-full max-w-[var(--site-max-width)] flex-wrap items-center justify-end gap-x-5 gap-y-2 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--bber-red)] sm:px-6 lg:px-8">
          {utilityLinks.map((utilityLink) => (
            <Link
              key={utilityLink.url}
              href={utilityLink.url}
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-[var(--bber-red-strong)]"
            >
              {utilityLink.title}
            </Link>
          ))}
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-[var(--site-max-width)] items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex min-w-0 items-center"
          aria-label={brand.siteTitle}
        >
          <Image
            src={brand.logo.src}
            alt={brand.logo.alt}
            width={brand.logo.width}
            height={brand.logo.height}
            loading="eager"
            sizes="(max-width: 640px) 220px, (max-width: 1024px) 280px, 320px"
            unoptimized
            className="h-auto w-[220px] min-w-0 sm:w-[280px] lg:w-[320px]"
          />
        </Link>

        <InteractivePrimaryNav siteTitle={brand.siteTitle} />
      </div>

      <Separator className="bg-[var(--bber-border)]" />
    </header>
  );
}
