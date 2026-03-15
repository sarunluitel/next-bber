import { ActivityIcon, CalendarClockIcon, DatabaseIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { SectionPageShell } from "@/components/site/section-page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type {
  CpiAnnualTableRow,
  CpiPageData,
  CpiTableSection,
  CpiTrendSection,
} from "@/content-models/cpi";
import type { CpiPageDataResult } from "@/lib/cpi";
import { LineGraph } from "@/visualizations/charts/external/line-graph";
import {
  formatExternalAsOfDate,
  formatTimeSeriesValue,
} from "@/visualizations/formatters/external-chart-formatters";

const DECIMAL_FORMATTER = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const PERCENTAGE_FORMATTER = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function formatCpiNumber(value: number | null) {
  if (value === null) {
    return "-";
  }

  return DECIMAL_FORMATTER.format(value);
}

function formatCpiPercentage(value: number | null) {
  if (value === null) {
    return "-";
  }

  return `${PERCENTAGE_FORMATTER.format(value)}%`;
}

function ExternalResourceLink({
  title,
  href,
}: {
  title: string;
  href: string;
}) {
  const isInternalLink = href.startsWith("/") && !href.startsWith("//");

  if (isInternalLink) {
    return (
      <Link
        href={href}
        className="text-sm leading-7 text-[var(--bber-red)] underline decoration-[color-mix(in_oklab,var(--bber-red),transparent_55%)] underline-offset-4"
      >
        {title}
      </Link>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-sm leading-7 text-[var(--bber-red)] underline decoration-[color-mix(in_oklab,var(--bber-red),transparent_55%)] underline-offset-4"
    >
      {title}
    </a>
  );
}

function KeyStatCard({
  icon,
  label,
  value,
  description,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  description: string;
}) {
  return (
    <Card className="border border-[var(--bber-border)] bg-white/90 py-0 shadow-sm">
      <CardContent className="flex gap-4 px-5 py-5">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[var(--bber-sand)] text-[var(--bber-red)]">
          {icon}
        </div>
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--bber-red)]">
            {label}
          </p>
          <p className="font-display text-2xl text-[var(--bber-ink)]">
            {value}
          </p>
          <p className="text-sm leading-7 text-[var(--bber-ink)]/72">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function TrendSection({
  trendSection,
  trendState,
}: {
  trendSection: CpiTrendSection;
  trendState: CpiPageDataResult["trendState"];
}) {
  const latestValueLabel =
    trendSection.latestValue === null
      ? "Not reported"
      : formatTimeSeriesValue(trendSection.latestValue, "index", true);

  return (
    <Card className="border border-[var(--bber-border)] bg-white py-0 shadow-sm">
      <CardHeader className="space-y-3 px-6 pt-6">
        <div className="space-y-2">
          <h2 className="font-display text-3xl text-[var(--bber-red)]">
            {trendSection.title}
          </h2>
          <p className="max-w-4xl text-base leading-8 text-[var(--bber-ink)]/80">
            {trendSection.description}
          </p>
        </div>
        {trendState.message ? (
          <p className="rounded-2xl border border-[var(--bber-border)] bg-[var(--bber-sand)] px-4 py-3 text-sm leading-7 text-[var(--bber-ink)]/78">
            {trendState.message}
          </p>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-6 px-6 pb-6">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_19rem]">
          <div className="space-y-3">
            <div className="space-y-1">
              <h3 className="font-display text-2xl text-[var(--bber-ink)]">
                {trendSection.chartTitle}
              </h3>
              <p className="text-sm leading-7 text-[var(--bber-ink)]/72">
                {trendSection.chartSubtitle}
              </p>
            </div>
            <p className="text-sm leading-7 text-[var(--bber-ink)]/76">
              {trendSection.summary}
            </p>
          </div>

          <div className="grid gap-3">
            <KeyStatCard
              icon={<ActivityIcon className="size-5" />}
              label="Latest reading"
              value={latestValueLabel}
              description={`Published for ${trendSection.latestDateLabel}.`}
            />
            <KeyStatCard
              icon={<CalendarClockIcon className="size-5" />}
              label="Coverage"
              value={trendSection.coverageLabel}
              description="Published monthly observations in the current series."
            />
          </div>
        </div>

        {trendSection.points.length > 0 ? (
          <LineGraph
            ariaLabel="Monthly Consumer Price Index trend"
            data={trendSection.points}
            formatKind="index"
            yAxisLabel={trendSection.yAxisLabel}
          />
        ) : (
          <div className="rounded-2xl border border-dashed border-[var(--bber-border)] bg-[var(--bber-sand)] px-5 py-8 text-sm leading-7 text-[var(--bber-ink)]/76">
            No published monthly CPI observations are available to draw the
            chart at this time.
          </div>
        )}

        <div className="rounded-2xl border border-[var(--bber-border)] bg-[var(--bber-sand)] px-5 py-5">
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--bber-red)]">
            Source Notes
          </h3>
          <ul className="mt-3 flex flex-col gap-2 text-sm leading-7 text-[var(--bber-ink)]/76">
            {trendSection.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

function TableMonthCells({ row }: { row: CpiAnnualTableRow["monthValues"] }) {
  return (
    <>
      <TableCell>{formatCpiNumber(row.january)}</TableCell>
      <TableCell>{formatCpiNumber(row.february)}</TableCell>
      <TableCell>{formatCpiNumber(row.march)}</TableCell>
      <TableCell>{formatCpiNumber(row.april)}</TableCell>
      <TableCell>{formatCpiNumber(row.may)}</TableCell>
      <TableCell>{formatCpiNumber(row.june)}</TableCell>
      <TableCell>{formatCpiNumber(row.july)}</TableCell>
      <TableCell>{formatCpiNumber(row.august)}</TableCell>
      <TableCell>{formatCpiNumber(row.september)}</TableCell>
      <TableCell>{formatCpiNumber(row.october)}</TableCell>
      <TableCell>{formatCpiNumber(row.november)}</TableCell>
      <TableCell>{formatCpiNumber(row.december)}</TableCell>
    </>
  );
}

function AnnualTableSection({
  tableSection,
  tableState,
}: {
  tableSection: CpiTableSection;
  tableState: CpiPageDataResult["tableState"];
}) {
  return (
    <Card className="border border-[var(--bber-border)] bg-white py-0 shadow-sm">
      <CardHeader className="space-y-3 px-6 pt-6">
        <div className="space-y-2">
          <h2 className="font-display text-3xl text-[var(--bber-red)]">
            {tableSection.title}
          </h2>
          <p className="max-w-4xl text-base leading-8 text-[var(--bber-ink)]/80">
            {tableSection.description}
          </p>
        </div>
        {tableState.message ? (
          <p className="rounded-2xl border border-[var(--bber-border)] bg-[var(--bber-sand)] px-4 py-3 text-sm leading-7 text-[var(--bber-ink)]/78">
            {tableState.message}
          </p>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-5 px-6 pb-6">
        {tableSection.rows.length > 0 ? (
          <Table className="min-w-[72rem]">
            <TableHeader>
              <TableRow className="border-[var(--bber-border)]">
                <TableHead className="text-[var(--bber-red)]">Year</TableHead>
                <TableHead className="text-[var(--bber-red)]">Jan</TableHead>
                <TableHead className="text-[var(--bber-red)]">Feb</TableHead>
                <TableHead className="text-[var(--bber-red)]">Mar</TableHead>
                <TableHead className="text-[var(--bber-red)]">Apr</TableHead>
                <TableHead className="text-[var(--bber-red)]">May</TableHead>
                <TableHead className="text-[var(--bber-red)]">Jun</TableHead>
                <TableHead className="text-[var(--bber-red)]">Jul</TableHead>
                <TableHead className="text-[var(--bber-red)]">Aug</TableHead>
                <TableHead className="text-[var(--bber-red)]">Sep</TableHead>
                <TableHead className="text-[var(--bber-red)]">Oct</TableHead>
                <TableHead className="text-[var(--bber-red)]">Nov</TableHead>
                <TableHead className="text-[var(--bber-red)]">Dec</TableHead>
                <TableHead className="text-[var(--bber-red)]">
                  Annual Avg.
                </TableHead>
                <TableHead className="text-[var(--bber-red)]">
                  Annual % Chg.
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableSection.rows.map((row) => (
                <TableRow
                  key={row.year}
                  className="border-[var(--bber-border)]"
                >
                  <TableCell className="font-semibold text-[var(--bber-ink)]">
                    {row.year}
                  </TableCell>
                  <TableMonthCells row={row.monthValues} />
                  <TableCell>{formatCpiNumber(row.annualAverage)}</TableCell>
                  <TableCell>
                    {formatCpiPercentage(row.yearPercentageChange)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            {tableSection.monthlyAverageRow ? (
              <TableFooter className="border-[var(--bber-border)] bg-[var(--bber-sand)]/70 text-[var(--bber-ink)]">
                <TableRow className="border-[var(--bber-border)]">
                  <TableCell className="font-semibold">
                    Monthly Average
                  </TableCell>
                  <TableMonthCells
                    row={tableSection.monthlyAverageRow.monthValues}
                  />
                  <TableCell>
                    {formatCpiNumber(
                      tableSection.monthlyAverageRow.annualAverage,
                    )}
                  </TableCell>
                  <TableCell>-</TableCell>
                </TableRow>
              </TableFooter>
            ) : null}
          </Table>
        ) : (
          <div className="rounded-2xl border border-dashed border-[var(--bber-border)] bg-[var(--bber-sand)] px-5 py-8 text-sm leading-7 text-[var(--bber-ink)]/76">
            No published annual CPI rows are available to display at this time.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function CpiPageView({
  pageData,
  trendState,
  tableState,
}: {
  pageData: CpiPageData;
  trendState: CpiPageDataResult["trendState"];
  tableState: CpiPageDataResult["tableState"];
}) {
  return (
    <SectionPageShell pathname={pageData.path}>
      <div className="space-y-8">
        <Card className="overflow-hidden border border-[var(--bber-border)] bg-[radial-gradient(circle_at_top_left,rgba(186,12,47,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(173,133,61,0.14),transparent_30%),linear-gradient(135deg,#fff_0%,#f8f3eb_50%,#efe3d0_100%)] py-0 shadow-sm">
          <CardContent className="grid gap-8 px-6 py-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(17rem,0.75fr)] lg:px-8 lg:py-10">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--bber-red)]">
                {pageData.eyebrow}
              </p>
              <h1 className="font-display text-4xl text-[var(--bber-red)] sm:text-5xl">
                {pageData.title}
              </h1>
              <p className="max-w-4xl text-base leading-8 text-[var(--bber-ink)]/80">
                {pageData.lead}
              </p>
              <div className="flex flex-col gap-4">
                {pageData.overviewParagraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="max-w-4xl text-base leading-8 text-[var(--bber-ink)]/80"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            <div className="grid gap-4">
              <KeyStatCard
                icon={<DatabaseIcon className="size-5" />}
                label="Source"
                value={pageData.sourceMetadata.source}
                description={pageData.sourceMetadata.geography}
              />
              <KeyStatCard
                icon={<CalendarClockIcon className="size-5" />}
                label="Updated"
                value={formatExternalAsOfDate(
                  pageData.sourceMetadata.updatedAt,
                )}
                description={pageData.sourceMetadata.releaseSchedule}
              />
            </div>
          </CardContent>
        </Card>

        <TrendSection
          trendSection={pageData.trendSection}
          trendState={trendState}
        />

        <AnnualTableSection
          tableSection={pageData.tableSection}
          tableState={tableState}
        />

        <Card className="border border-[var(--bber-border)] bg-white py-0 shadow-sm">
          <CardHeader className="space-y-2 px-6 pt-6">
            <CardTitle className="font-display text-3xl text-[var(--bber-red)]">
              Source and Reference
            </CardTitle>
            <p className="max-w-4xl text-base leading-8 text-[var(--bber-ink)]/80">
              Data presented here draw on the U.S. Bureau of Labor Statistics
              CPI program and are distributed through the BBER data service for
              research and reference use.
            </p>
          </CardHeader>
          <CardContent className="space-y-5 px-6 pb-6">
            <div className="grid gap-5 lg:grid-cols-2">
              <div className="space-y-2 text-sm leading-7 text-[var(--bber-ink)]/78">
                <p>
                  <strong className="text-[var(--bber-red)]">Series:</strong>{" "}
                  {pageData.sourceMetadata.title}
                </p>
                <p>
                  <strong className="text-[var(--bber-red)]">
                    Reference time:
                  </strong>{" "}
                  {pageData.sourceMetadata.referenceTime}
                </p>
                <p>
                  <strong className="text-[var(--bber-red)]">
                    Release schedule:
                  </strong>{" "}
                  {pageData.sourceMetadata.releaseSchedule}
                </p>
              </div>
              <div className="space-y-2 text-sm leading-7 text-[var(--bber-ink)]/78">
                <p>
                  <strong className="text-[var(--bber-red)]">Table:</strong>{" "}
                  {pageData.sourceMetadata.tableName}
                </p>
                <p>
                  <strong className="text-[var(--bber-red)]">Updated:</strong>{" "}
                  {formatExternalAsOfDate(pageData.sourceMetadata.updatedAt)}
                </p>
                <p>
                  <strong className="text-[var(--bber-red)]">
                    Description:
                  </strong>{" "}
                  {pageData.sourceMetadata.description}
                </p>
              </div>
            </div>

            <Separator className="bg-[var(--bber-border)]" />

            <div className="space-y-3">
              <h2 className="font-display text-2xl text-[var(--bber-red)]">
                Additional Resources
              </h2>
              <div className="flex flex-col gap-2">
                {pageData.resourceLinks.map((resource) => (
                  <ExternalResourceLink
                    key={resource.href}
                    title={resource.title}
                    href={resource.href}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </SectionPageShell>
  );
}
