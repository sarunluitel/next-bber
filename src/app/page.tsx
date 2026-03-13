import Image from "next/image";
import {
  AboutBberSection,
  FeedSection,
  PromoCard,
} from "@/components/site/homepage-sections";
import { homepageStaticContent } from "@/content-models/homepage-content";
import { getHomepageFeeds } from "@/lib/cms/bber-homepage";

export default async function Home() {
  const homepageFeeds = await getHomepageFeeds();
  const { about, hero, promotions, sections } = homepageStaticContent;

  return (
    <div className="bg-[var(--bber-sand)]">
      <section className="mx-auto w-full max-w-[1200px] px-4 pt-6 sm:px-6 lg:px-8 lg:pt-8">
        <Image
          src={hero.src}
          alt={hero.alt}
          width={hero.width}
          height={hero.height}
          preload
          className="h-auto w-full rounded-lg border border-[var(--bber-border)] object-cover shadow-sm"
        />
      </section>

      <section className="mx-auto flex w-full max-w-[1200px] flex-col gap-10 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="grid gap-8 lg:grid-cols-2">
          <FeedSection
            title={sections.news.title}
            accentImage={sections.news.accentImage}
            viewAllUrl={sections.news.viewAllUrl}
            feed={homepageFeeds.news}
            emptyMessage={sections.news.emptyMessage}
            errorMessage={sections.news.errorMessage}
            itemType="news"
          />
          <FeedSection
            title={sections.publications.title}
            accentImage={sections.publications.accentImage}
            viewAllUrl={sections.publications.viewAllUrl}
            feed={homepageFeeds.publications}
            emptyMessage={sections.publications.emptyMessage}
            errorMessage={sections.publications.errorMessage}
            itemType="publication"
          />
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {promotions.map((promotion) => (
            <PromoCard key={promotion.url} {...promotion} />
          ))}
        </div>

        <AboutBberSection content={about} />
      </section>
    </div>
  );
}
