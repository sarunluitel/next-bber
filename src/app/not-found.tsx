import { PlaceholderPage } from "@/components/site/placeholder-page";

export default function NotFound() {
  return (
    <PlaceholderPage
      pathname="/404"
      title="Page Not Found"
      lead="The page you requested could not be found."
      statusTitle="Page Not Found"
      statusMessage="The page you requested could not be found."
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
