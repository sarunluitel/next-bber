import { SectionPageShell } from "@/components/site/section-page-shell";

export default function NmStatewideLoading() {
  return (
    <SectionPageShell pathname="/data/nm-statewide/">
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="h-6 w-48 animate-pulse rounded-full bg-white/70" />
          <div className="h-12 w-full max-w-2xl animate-pulse rounded-2xl bg-white/70" />
        </div>
        <div className="grid gap-5 xl:grid-cols-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={String(index)}
              className="min-h-[24rem] animate-pulse rounded-xl border border-[var(--bber-border)] bg-white/70"
            />
          ))}
        </div>
      </div>
    </SectionPageShell>
  );
}
