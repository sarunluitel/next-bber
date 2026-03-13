import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { Pages } from "pages";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ResearchSectionNavProps = {
  currentUrl: string;
};

const researchLinks = [
  Pages.Research.children.Publications,
  Pages.Research.children.Presentation,
  Pages.Research.children.Projects,
];

function normalizeUrl(url: string) {
  return url === "/" ? url : url.replace(/\/+$/, "");
}

export function ResearchSectionNav({ currentUrl }: ResearchSectionNavProps) {
  const normalizedCurrentUrl = normalizeUrl(currentUrl);

  return (
    <Card className="border border-[var(--bber-border)] bg-white py-0 shadow-sm">
      <CardHeader className="px-6 pt-6">
        <CardTitle className="font-display text-2xl text-[var(--bber-red)]">
          Research
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 px-6 pb-6">
        <Button
          variant="ghost"
          className="h-auto w-full justify-start px-0 text-left text-[var(--bber-red)] hover:bg-transparent hover:text-[var(--bber-red-strong)]"
          render={<Link href={Pages.Home.url} />}
        >
          <ArrowLeftIcon className="size-4" />
          Go Back
        </Button>

        {researchLinks.map((link) => {
          const isActive = normalizeUrl(link.url) === normalizedCurrentUrl;

          return (
            <Button
              key={link.url}
              variant={isActive ? "default" : "outline"}
              className={
                isActive
                  ? "h-auto w-full justify-start whitespace-normal bg-[var(--bber-red)] py-4 text-left text-white hover:bg-[var(--bber-red-strong)]"
                  : "h-auto w-full justify-start whitespace-normal border-[var(--bber-border)] bg-white py-4 text-left text-[var(--bber-red)] hover:bg-[var(--bber-sand)] hover:text-[var(--bber-red)]"
              }
              render={<Link href={link.url} />}
            >
              {link.title}
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
}
