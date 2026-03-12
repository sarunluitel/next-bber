import { PlaceholderPage } from "@/components/site/placeholder-page";

export default function NotFound() {
  return (
    <PlaceholderPage
      title="Page Not Found"
      lead="The page you requested does not exist in the current BBER site map."
      trail={[
        {
          key: "NotFound",
          node: {
            title: "Page Not Found",
            url: "/404",
            children: {},
          },
        },
      ]}
    />
  );
}
