import type { ReactNode } from "react";
import {
  Card,
  CardContent,
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
      <CardHeader className="gap-3 border-b border-[var(--bber-border)] px-4 py-4 sm:px-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-1">
            <CardTitle className="font-display text-lg text-[var(--bber-ink)] sm:text-xl">
              {title}
            </CardTitle>
            {description ? (
              <p className="text-sm leading-6 text-[var(--bber-ink)]/68">
                {description}
              </p>
            ) : null}
          </div>
          {actions ? (
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              {actions}
            </div>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="px-4 py-4 sm:px-5">{children}</CardContent>
      <CardFooter className="border-t border-[var(--bber-border)] bg-transparent px-4 py-3 text-xs leading-5 text-[var(--bber-ink)]/55 sm:px-5">
        {sourceLine}
      </CardFooter>
    </Card>
  );
}
