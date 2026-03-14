import { notFound } from "next/navigation";
import { AboutPageView } from "@/components/site/about-page-view";
import { findAboutPage } from "@/content-models/about-content";

export default function AboutPage() {
  const aboutPage = findAboutPage("/about/");

  if (!aboutPage) {
    notFound();
  }

  return <AboutPageView page={aboutPage} />;
}
