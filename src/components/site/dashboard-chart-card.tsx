import type { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type DashboardChartCardProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  sourceLine: string;
  className?: string;
};

export function DashboardChartCard({
  title,
  description,
  actions,
  children,
  sourceLine,
  className,
}: DashboardChartCardProps) {
  return (
    <Card
      className={`border border-[var(--bber-border)] bg-white py-0 shadow-sm ${className ?? ""}`}
    >
      <CardHeader className="gap-2 border-b border-[var(--bber-border)] px-4 py-3 sm:px-5">
        <div className="flex min-w-0 flex-col gap-1.5">
          <CardTitle className="text-balance text-lg leading-tight text-[var(--bber-ink)] sm:text-[1.35rem]">
            {title}
          </CardTitle>
          {description ? (
            <CardDescription className="max-w-[52ch] text-xs leading-5 text-[var(--bber-ink)]/66 sm:text-sm sm:leading-6">
              {description}
            </CardDescription>
          ) : null}
        </div>
        {actions ? (
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            {actions}
          </div>
        ) : null}
      </CardHeader>
      <CardContent className="px-4 py-4 sm:px-5">{children}</CardContent>
      <CardFooter className="border-t border-[var(--bber-border)] bg-transparent px-4 py-3 text-xs leading-5 text-[var(--bber-ink)]/55 sm:px-5">
        {sourceLine}
      </CardFooter>
    </Card>
  );
}
