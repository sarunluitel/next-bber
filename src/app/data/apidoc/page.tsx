import Link from "next/link";
import { SectionPageShell } from "@/components/site/section-page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  API_DOCUMENTATION_OVERVIEW,
  API_DOCUMENTATION_PARAMETER_ROWS,
  API_DOCUMENTATION_SECTIONS,
} from "@/content-models/api-documentation";

function CodeBlock({ value }: { value: string }) {
  return (
    <pre className="overflow-x-auto rounded-2xl border border-[var(--bber-border)] bg-[var(--bber-ink)] px-4 py-4 text-sm leading-7 text-white">
      <code>{value}</code>
    </pre>
  );
}

function SectionHeading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-2">
      <h2 className="font-display text-2xl text-[var(--bber-red)] sm:text-3xl">
        {title}
      </h2>
      <p className="max-w-4xl text-base leading-8 text-[var(--bber-ink)]/80">
        {description}
      </p>
    </div>
  );
}

export default function ApiDocumentationPage() {
  return (
    <SectionPageShell pathname="/data/apidoc">
      <div className="space-y-8">
        <Card className="overflow-hidden border border-[var(--bber-border)] bg-[radial-gradient(circle_at_top_left,rgba(186,12,47,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(173,133,61,0.14),transparent_30%),linear-gradient(135deg,#fff_0%,#f8f3eb_50%,#efe3d0_100%)] py-0 shadow-sm">
          <CardContent className="grid gap-8 px-6 py-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(16rem,0.7fr)] lg:px-8 lg:py-10">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--bber-red)]">
                {API_DOCUMENTATION_OVERVIEW.eyebrow}
              </p>
              <h1 className="font-display text-4xl text-[var(--bber-red)] sm:text-5xl">
                {API_DOCUMENTATION_OVERVIEW.title}
              </h1>
              <p className="max-w-4xl text-base leading-8 text-[var(--bber-ink)]/80">
                {API_DOCUMENTATION_OVERVIEW.lead}
              </p>
            </div>

            <div className="grid gap-4">
              <Card className="border border-[var(--bber-border)] bg-white/90 shadow-none">
                <CardHeader className="px-5 pt-5 pb-3">
                  <CardTitle className="text-base text-[var(--bber-red)]">
                    Core Endpoint
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-5 pb-5">
                  <p className="break-all text-sm leading-7 text-[var(--bber-ink)]">
                    {API_DOCUMENTATION_OVERVIEW.restEndpoint}
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-[var(--bber-border)] bg-white/90 shadow-none">
                <CardHeader className="px-5 pt-5 pb-3">
                  <CardTitle className="text-base text-[var(--bber-red)]">
                    Example Repository
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-5 pb-5">
                  <Link
                    href={API_DOCUMENTATION_OVERVIEW.exampleRepository}
                    className="break-all text-sm leading-7 text-[var(--bber-red)] underline decoration-[color-mix(in_oklab,var(--bber-red),transparent_55%)] underline-offset-4"
                  >
                    {API_DOCUMENTATION_OVERVIEW.exampleRepository}
                  </Link>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-[var(--bber-border)] bg-white py-0 shadow-sm">
          <CardHeader className="px-6 pt-6">
            <SectionHeading
              title="Getting Started"
              description="Use the REST endpoint to request a table, limit the returned variables when needed, and filter observations by geography, time period, and other supported dimensions."
            />
          </CardHeader>
          <CardContent className="space-y-6 px-6 pb-6">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-[var(--bber-red)]">
                REST endpoint
              </h3>
              <CodeBlock value={API_DOCUMENTATION_OVERVIEW.restEndpoint} />
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-[var(--bber-red)]">
                Metadata endpoint
              </h3>
              <p className="text-sm leading-7 text-[var(--bber-ink)]/78">
                Metadata requests are useful for discovering available tables,
                variables, and valid filter values before scripting a query.
              </p>
              <CodeBlock value={API_DOCUMENTATION_OVERVIEW.metadataEndpoint} />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-[var(--bber-border)] bg-white py-0 shadow-sm">
          <CardHeader className="px-6 pt-6">
            <SectionHeading
              title="Request Parameters"
              description="The parameters below are commonly used across BBER REST datasets. Available fields can vary by table, so confirm table-level metadata before building production scripts."
            />
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <Table className="min-w-[42rem]">
              <TableHeader>
                <TableRow className="border-[var(--bber-border)]">
                  <TableHead className="w-[18%] text-[var(--bber-red)]">
                    Parameter
                  </TableHead>
                  <TableHead className="w-[55%] text-[var(--bber-red)]">
                    Description
                  </TableHead>
                  <TableHead className="text-[var(--bber-red)]">
                    Sample Values
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {API_DOCUMENTATION_PARAMETER_ROWS.map((row) => (
                  <TableRow
                    key={row.name}
                    className="border-[var(--bber-border)] align-top"
                  >
                    <TableCell className="font-mono text-xs text-[var(--bber-ink)]">
                      {row.name}
                    </TableCell>
                    <TableCell className="whitespace-normal text-sm leading-7 text-[var(--bber-ink)]/80">
                      {row.description}
                    </TableCell>
                    <TableCell className="whitespace-normal text-sm leading-7 text-[var(--bber-ink)]/80">
                      {row.sampleValues}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="grid gap-8 xl:grid-cols-2">
          <Card className="border border-[var(--bber-border)] bg-white py-0 shadow-sm">
            <CardHeader className="px-6 pt-6">
              <SectionHeading
                title="Time Filters"
                description="The `periodyear` parameter accepts both ranges and comma-separated selections, which makes it practical to request contiguous spans or selected benchmark years."
              />
            </CardHeader>
            <CardContent className="space-y-5 px-6 pb-6">
              {API_DOCUMENTATION_SECTIONS.rangeExamples.map((example) => (
                <CodeBlock key={example} value={example} />
              ))}
            </CardContent>
          </Card>

          <Card className="border border-[var(--bber-border)] bg-white py-0 shadow-sm">
            <CardHeader className="px-6 pt-6">
              <SectionHeading
                title="Variable Selection and Table Merging"
                description="When requesting multiple tables together, specify variables as `TABLENAME.VARIABLENAME` to distinguish fields cleanly and preserve a usable merged response."
              />
            </CardHeader>
            <CardContent className="space-y-4 px-6 pb-6">
              <CodeBlock value={API_DOCUMENTATION_SECTIONS.mergeExample} />
              <p className="text-sm leading-7 text-[var(--bber-ink)]/78">
                Merged results align on shared columns such as geography and
                time fields. Requesting the same variable name from two tables
                is not supported when those columns are already used for the
                merge.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 xl:grid-cols-2">
          <Card className="border border-[var(--bber-border)] bg-white py-0 shadow-sm">
            <CardHeader className="px-6 pt-6">
              <SectionHeading
                title="Response Format"
                description="API responses are returned in JSON with data rows and descriptive metadata packaged together."
              />
            </CardHeader>
            <CardContent className="space-y-4 px-6 pb-6">
              <CodeBlock value={API_DOCUMENTATION_SECTIONS.responseExample} />
              <div className="space-y-2 text-sm leading-7 text-[var(--bber-ink)]/78">
                <p>
                  <strong className="text-[var(--bber-red)]">data:</strong> the
                  observation rows returned for the request.
                </p>
                <p>
                  <strong className="text-[var(--bber-red)]">
                    metadata.columns:
                  </strong>{" "}
                  field-level descriptions and display labels.
                </p>
                <p>
                  <strong className="text-[var(--bber-red)]">
                    metadata.table:
                  </strong>{" "}
                  source-level information such as title, release timing, and
                  update date.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-[var(--bber-border)] bg-white py-0 shadow-sm">
            <CardHeader className="px-6 pt-6">
              <SectionHeading
                title="Map and Metadata Endpoints"
                description="Use the map endpoint for GEOJSON output and the metadata endpoint to inspect available tables, variables, and values before building a request."
              />
            </CardHeader>
            <CardContent className="space-y-5 px-6 pb-6">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-[var(--bber-red)]">
                  Map endpoint
                </h3>
                <CodeBlock value={API_DOCUMENTATION_OVERVIEW.mapEndpoint} />
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-[var(--bber-red)]">
                  Metadata examples
                </h3>
                {API_DOCUMENTATION_SECTIONS.metadataExamples.map((example) => (
                  <CodeBlock key={example} value={example} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SectionPageShell>
  );
}
