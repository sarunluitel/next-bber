import { getSectionSidebarModel } from "pages";
import { SectionSidebar } from "@/components/site/section-sidebar";

type SectionPageShellProps = {
  pathname: string;
  children: React.ReactNode;
};

export function SectionPageShell({
  pathname,
  children,
}: SectionPageShellProps) {
  const sidebarModel = getSectionSidebarModel(pathname);

  if (!sidebarModel) {
    return (
      <div className="bg-[var(--bber-sand)]">
        <section className="mx-auto flex w-full max-w-[var(--site-max-width)] flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          {children}
        </section>
      </div>
    );
  }

  return (
    <div className="bg-[var(--bber-sand)]">
      <section className="mx-auto flex w-full max-w-[var(--site-max-width)] flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <SectionSidebar model={sidebarModel} variant="mobile" />

        <div className="grid gap-8 lg:grid-cols-[250px_minmax(0,1fr)]">
          <div className="hidden lg:block">
            <SectionSidebar model={sidebarModel} />
          </div>
          <div className="min-w-0">{children}</div>
        </div>
      </section>
    </div>
  );
}
