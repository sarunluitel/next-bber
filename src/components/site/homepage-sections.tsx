import { ArrowUpRightIcon, FileTextIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import type {
  BberNewsItem,
  BberPublicationItem,
} from "@/content-models/bber-homepage";
import type { HomepageStaticContent } from "@/content-models/homepage-content";

type FeedState<T> = {
  status: "ready" | "empty" | "error";
  items: T[];
  message?: string;
};

function formatNewsDate(dateValue: string) {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  }).format(date);
}

type FeedSectionProps<T extends BberNewsItem | BberPublicationItem> = {
  title: string;
  accentImage: HomepageStaticContent["sections"]["news"]["accentImage"];
  viewAllUrl: string;
  feed: FeedState<T>;
  emptyMessage: string;
  errorMessage: string;
  itemType: "news" | "publication";
};

export function FeedSection<T extends BberNewsItem | BberPublicationItem>({
  title,
  accentImage,
  viewAllUrl,
  feed,
  emptyMessage,
  errorMessage,
  itemType,
}: FeedSectionProps<T>) {
  return (
    <Card className="border border-[var(--bber-border)] bg-white py-0 shadow-sm">
      <CardHeader className="gap-4 px-6 pt-6">
        <div className="flex items-center justify-between gap-4">
          <CardTitle className="font-display text-[2rem] leading-none text-[var(--bber-red)]">
            {title}
          </CardTitle>
        </div>
        <Image
          src={accentImage.src}
          alt={accentImage.alt}
          width={accentImage.width}
          height={accentImage.height}
          sizes="(max-width: 1024px) calc(100vw - 3rem), 600px"
          className="h-auto w-full rounded-md border border-[var(--bber-border)] object-cover"
        />
      </CardHeader>
      <CardContent className="space-y-5 px-6 pb-6">
        {feed.status === "error" ? (
          <SectionStateMessage message={feed.message ?? errorMessage} />
        ) : null}

        {feed.status === "empty" ? (
          <SectionStateMessage message={emptyMessage} />
        ) : null}

        {feed.status === "ready"
          ? feed.items.map((item, itemIndex) => (
              <article key={item.id} className="space-y-3">
                {itemIndex > 0 ? (
                  <Separator className="mb-5 bg-[var(--bber-border)]" />
                ) : null}
                <h3 className="text-lg font-semibold leading-7 text-[var(--bber-ink)]">
                  <Link
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-start gap-2 text-balance text-[var(--bber-ink)] transition-colors hover:text-[var(--bber-red)]"
                  >
                    {item.title}
                    {itemType === "publication" ? (
                      <FileTextIcon className="mt-1 size-4 shrink-0 text-[var(--bber-red)]" />
                    ) : (
                      <ArrowUpRightIcon className="mt-1 size-4 shrink-0 text-[var(--bber-red)]" />
                    )}
                  </Link>
                </h3>
                <p className="line-clamp-4 text-sm leading-7 text-[var(--bber-ink)]/80">
                  {item.description}
                </p>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--bber-stone)]">
                  Date Published:{" "}
                  {itemType === "news"
                    ? formatNewsDate(item.publishedDate)
                    : item.publishedDate}
                </p>
              </article>
            ))
          : null}

        <Separator className="bg-[var(--bber-border)]" />
        <div className="flex justify-end">
          <Link
            href={viewAllUrl}
            className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--bber-red)] transition-colors hover:text-[var(--bber-red-strong)]"
          >
            View All
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function SectionStateMessage({ message }: { message: string }) {
  return (
    <div className="rounded-md border border-dashed border-[var(--bber-border)] bg-[var(--bber-sand)] px-4 py-5 text-sm leading-7 text-[var(--bber-ink)]/75">
      {message}
    </div>
  );
}

export function PromoCard({
  title,
  url,
  image,
}: HomepageStaticContent["promotions"][number]) {
  return (
    <Card className="overflow-hidden border border-[var(--bber-border)] bg-white py-0 shadow-sm">
      <CardHeader className="px-5 pt-5">
        <CardTitle className="font-display text-[1.75rem] leading-tight text-[var(--bber-red)]">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <Link href={url} className="group block overflow-hidden rounded-md">
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            sizes="(max-width: 1024px) calc(100vw - 3rem), 600px"
            className="h-auto w-full rounded-md border border-[var(--bber-border)] object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </Link>
      </CardContent>
    </Card>
  );
}

export function AboutBberSection({
  content,
}: {
  content: HomepageStaticContent["about"];
}) {
  return (
    <Card className="border border-[var(--bber-border)] bg-white py-0 shadow-sm">
      <CardHeader className="px-6 pt-6">
        <CardTitle className="font-display text-[2.3rem] text-[var(--bber-red)]">
          {content.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 px-6 pb-6">
        <p className="max-w-5xl text-base leading-8 text-[var(--bber-ink)]/80">
          {content.description}
        </p>

        <Table>
          <TableBody>
            {content.rows.map((row) => (
              <TableRow
                key={row.url}
                className="border-[var(--bber-border)] hover:bg-[var(--bber-sand)]/60"
              >
                <TableCell className="w-[220px] whitespace-normal py-4 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--bber-red)]">
                  <Link
                    href={row.url}
                    className="transition-colors hover:text-[var(--bber-red-strong)]"
                  >
                    {row.title}
                  </Link>
                </TableCell>
                <TableCell className="whitespace-normal py-4 text-sm leading-7 text-[var(--bber-ink)]/80">
                  {row.description}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
