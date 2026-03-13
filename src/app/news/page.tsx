import { NewsPageView } from "@/components/site/news-page";
import { newsPageContent } from "@/content-models/news-content";
import { getNewsPageData } from "@/lib/cms/bber-news";

export default async function NewsPage(props: PageProps<"/news">) {
  const searchParams = await props.searchParams;
  const newsPageData = await getNewsPageData(searchParams);

  return <NewsPageView content={newsPageContent} data={newsPageData} />;
}
