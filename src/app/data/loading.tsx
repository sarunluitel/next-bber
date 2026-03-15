import { SectionPageShell } from "@/components/site/section-page-shell";

export default function DataOverviewLoading() {
  return (
    <SectionPageShell pathname="/data/">
      <div className="flex flex-col gap-6">
        <div className="h-12 w-32 rounded-xl bg-[var(--bber-border)]/45" />
        <div className="flex flex-col gap-3">
          <div className="h-5 w-full max-w-5xl rounded-full bg-[var(--bber-border)]/30" />
          <div className="h-5 w-full max-w-4xl rounded-full bg-[var(--bber-border)]/24" />
          <div className="h-5 w-full max-w-[44rem] rounded-full bg-[var(--bber-border)]/20" />
        </div>
        <div className="grid gap-6 xl:grid-cols-2">
          <div className="min-h-[30rem] rounded-2xl border border-[var(--bber-border)] bg-white/70" />
          <div className="min-h-[30rem] rounded-2xl border border-[var(--bber-border)] bg-white/70" />
        </div>
      </div>
    </SectionPageShell>
  );
}
