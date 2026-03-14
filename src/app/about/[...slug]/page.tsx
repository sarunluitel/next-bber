import { notFound } from "next/navigation";
import { AboutPageView } from "@/components/site/about-page-view";
import {
  findAboutPage,
  getAboutSubpageSlugs,
} from "@/content-models/about-content";
import {
  getAboutCmsPage,
  getAboutPeopleStaticSlugs,
} from "@/lib/cms/bber-about";

export const dynamicParams = true;

export async function generateStaticParams() {
  const [staticAboutSlugs, aboutPeopleSlugs] = await Promise.all([
    Promise.resolve(getAboutSubpageSlugs()),
    getAboutPeopleStaticSlugs(),
  ]);

  const uniqueSlugKeys = new Set<string>();

  return [...staticAboutSlugs, ...aboutPeopleSlugs]
    .filter((slug) => {
      const slugKey = slug.join("/");

      if (uniqueSlugKeys.has(slugKey)) {
        return false;
      }

      uniqueSlugKeys.add(slugKey);
      return true;
    })
    .map((slug) => ({ slug }));
}

export default async function AboutSubpage(
  props: PageProps<"/about/[...slug]">,
) {
  const { slug } = await props.params;
  const pathname = `/about/${slug.join("/")}`;
  const aboutCmsPage = await getAboutCmsPage(pathname);

  if (aboutCmsPage) {
    return <AboutPageView page={aboutCmsPage} />;
  }

  if (
    pathname.startsWith("/about/staff") ||
    pathname.startsWith("/about/directors")
  ) {
    notFound();
  }

  const aboutPage = findAboutPage(pathname);

  if (!aboutPage) {
    notFound();
  }

  return <AboutPageView page={aboutPage} />;
}
