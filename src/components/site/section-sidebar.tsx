import { ArrowLeftIcon, ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import type { SectionSidebarModel } from "pages";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type SectionSidebarProps = {
  model: SectionSidebarModel;
  variant?: "desktop" | "mobile";
};

export function SectionSidebar({
  model,
  variant = "desktop",
}: SectionSidebarProps) {
  if (variant === "mobile") {
    return <MobileSectionSidebar model={model} />;
  }

  return <DesktopSectionSidebar model={model} />;
}

function DesktopSectionSidebar({ model }: { model: SectionSidebarModel }) {
  return (
    <Card className="border border-[var(--bber-border)] bg-white py-0 shadow-sm lg:sticky lg:top-6">
      <CardHeader className="px-6 pt-6">
        <CardTitle className="font-display text-2xl text-[var(--bber-red)]">
          {model.sectionTitle}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 px-6 pb-6">
        <GoBackButton model={model} />
        <Separator className="bg-[var(--bber-border)]" />
        <SidebarItems items={model.items} />
      </CardContent>
    </Card>
  );
}

function MobileSectionSidebar({ model }: { model: SectionSidebarModel }) {
  const activeItem = model.items.find((item) => item.isActive) ?? null;
  const collapsedItems = activeItem
    ? model.items.filter((item) => !item.isActive)
    : model.items;

  return (
    <Card className="border border-[var(--bber-border)] bg-white py-0 shadow-sm lg:hidden">
      <CardHeader className="px-6 pt-6">
        <CardTitle className="font-display text-2xl text-[var(--bber-red)]">
          {model.sectionTitle}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 px-6 pb-6">
        <GoBackButton model={model} />

        {activeItem ? (
          <Button
            className="h-auto w-full justify-start whitespace-normal bg-[var(--bber-red)] py-4 text-left text-white opacity-100 disabled:cursor-default disabled:opacity-100"
            nativeButton={false}
            render={<Link href={activeItem.url} aria-current="page" />}
          >
            {activeItem.title}
          </Button>
        ) : null}

        {collapsedItems.length > 0 ? (
          <Accordion>
            <AccordionItem value="section-navigation" className="border-none">
              <AccordionTrigger className="rounded-md border border-[var(--bber-border)] px-4 py-3 font-semibold text-[var(--bber-red)] no-underline hover:no-underline">
                Explore this section
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                <div className="flex flex-col gap-3">
                  <SidebarItems items={collapsedItems} />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ) : null}
      </CardContent>
    </Card>
  );
}

function GoBackButton({ model }: { model: SectionSidebarModel }) {
  return (
    <Button
      variant="ghost"
      className="h-auto w-full justify-start px-0 text-left text-[var(--bber-red)] hover:bg-transparent hover:text-[var(--bber-red-strong)]"
      nativeButton={false}
      render={<Link href={model.goBackTarget.url} />}
    >
      <ArrowLeftIcon className="size-4" />
      Go Back
    </Button>
  );
}

function SidebarItems({ items }: { items: SectionSidebarModel["items"] }) {
  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => (
        <Button
          key={item.url}
          variant={item.isActive ? "default" : "outline"}
          nativeButton={false}
          className={
            item.isActive
              ? "h-auto w-full justify-start whitespace-normal bg-[var(--bber-red)] py-4 text-left text-white hover:bg-[var(--bber-red-strong)]"
              : "h-auto w-full justify-between gap-3 whitespace-normal border-[var(--bber-border)] bg-white py-4 text-left text-[var(--bber-red)] hover:bg-[var(--bber-sand)] hover:text-[var(--bber-red)]"
          }
          render={
            <Link
              href={item.url}
              aria-current={item.isActive ? "page" : undefined}
            />
          }
        >
          <span className="min-w-0 flex-1">{item.title}</span>
          {!item.isActive ? <ChevronRightIcon className="size-4" /> : null}
        </Button>
      ))}
    </div>
  );
}
