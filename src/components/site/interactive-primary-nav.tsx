"use client";

import { MenuIcon, SearchIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  getPageChildren,
  normalizePageUrl,
  type PageNode,
  Pages,
  pageHasChildren,
} from "pages";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

type InteractivePrimaryNavProps = {
  siteTitle: string;
};

function isActivePath(currentPathname: string, candidateUrl: string) {
  const normalizedCurrentPathname = normalizePageUrl(currentPathname);
  const normalizedCandidateUrl = normalizePageUrl(candidateUrl);

  if (normalizedCandidateUrl === "/") {
    return normalizedCurrentPathname === "/";
  }

  return (
    normalizedCurrentPathname === normalizedCandidateUrl ||
    normalizedCurrentPathname.startsWith(`${normalizedCandidateUrl}/`)
  );
}

function DesktopMenuItem({
  currentPathname,
  node,
}: {
  currentPathname: string;
  node: PageNode;
}) {
  const router = useRouter();
  const isActive = isActivePath(currentPathname, node.url);

  if (!pageHasChildren(node)) {
    return (
      <Link
        href={node.url}
        className={cn(
          "rounded-md px-3 py-2 text-[1.05rem] font-semibold text-[var(--bber-red)] transition-colors hover:bg-[var(--bber-sand)]",
          isActive ? "bg-[var(--bber-sand)]" : "",
        )}
      >
        {node.title}
      </Link>
    );
  }

  return (
    <MenubarMenu>
      <MenubarTrigger
        className={cn(
          "rounded-md px-3 py-2 text-[1.05rem] font-semibold text-[var(--bber-red)] hover:bg-[var(--bber-sand)]",
          isActive ? "bg-[var(--bber-sand)]" : "",
        )}
      >
        {node.title}
      </MenubarTrigger>
      <MenubarContent className="min-w-56 border border-[var(--bber-border)] bg-white">
        {Object.values(getPageChildren(node)).map((childNode) => {
          if (pageHasChildren(childNode)) {
            return <DesktopSubmenuItem key={childNode.url} node={childNode} />;
          }

          return (
            <MenubarItem
              key={childNode.url}
              onClick={() => router.push(childNode.url)}
              className="cursor-pointer text-[var(--bber-ink)]"
            >
              {childNode.title}
            </MenubarItem>
          );
        })}
      </MenubarContent>
    </MenubarMenu>
  );
}

function DesktopSubmenuItem({ node }: { node: PageNode }) {
  const router = useRouter();

  return (
    <MenubarSub>
      <MenubarSubTrigger className="cursor-default text-[var(--bber-ink)]">
        {node.title}
      </MenubarSubTrigger>
      <MenubarSubContent className="min-w-56 border border-[var(--bber-border)] bg-white">
        {Object.values(getPageChildren(node)).map((childNode) => {
          if (pageHasChildren(childNode)) {
            return <DesktopSubmenuItem key={childNode.url} node={childNode} />;
          }

          return (
            <MenubarItem
              key={childNode.url}
              onClick={() => router.push(childNode.url)}
              className="cursor-pointer text-[var(--bber-ink)]"
            >
              {childNode.title}
            </MenubarItem>
          );
        })}
      </MenubarSubContent>
    </MenubarSub>
  );
}

function MobileAccordionMenu({
  currentPathname,
  node,
  depth = 0,
}: {
  currentPathname: string;
  node: PageNode;
  depth?: number;
}) {
  const isActive = isActivePath(currentPathname, node.url);

  if (!pageHasChildren(node)) {
    return (
      <Link
        href={node.url}
        className={cn(
          "block rounded-md px-3 py-2 text-sm font-medium text-[var(--bber-ink)] transition-colors hover:bg-[var(--bber-sand)] hover:text-[var(--bber-red)]",
          isActive ? "bg-[var(--bber-sand)] text-[var(--bber-red)]" : "",
          depth > 0 ? "ml-3 border-l border-[var(--bber-border)] pl-4" : "",
        )}
      >
        {node.title}
      </Link>
    );
  }

  return (
    <Accordion multiple className="w-full">
      <AccordionItem
        value={node.url}
        className="border-b border-[var(--bber-border)]"
      >
        <AccordionTrigger
          className={cn(
            "px-3 py-3 text-sm font-semibold text-[var(--bber-red)] hover:no-underline",
            depth > 0 ? "ml-3 pl-4" : "",
          )}
        >
          {node.title}
        </AccordionTrigger>
        <AccordionContent className="space-y-2 pb-3">
          <Link
            href={node.url}
            className="ml-3 block rounded-md border-l border-[var(--bber-border)] px-4 py-2 text-sm font-medium text-[var(--bber-ink)] hover:bg-[var(--bber-sand)] hover:text-[var(--bber-red)]"
          >
            Overview
          </Link>
          {Object.values(getPageChildren(node)).map((childNode) => (
            <MobileAccordionMenu
              key={childNode.url}
              currentPathname={currentPathname}
              node={childNode}
              depth={depth + 1}
            />
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export function InteractivePrimaryNav({
  siteTitle,
}: InteractivePrimaryNavProps) {
  const pathname = usePathname();
  const topLevelPages = Object.values(Pages);

  return (
    <>
      <div className="hidden items-center gap-6 lg:flex">
        <Menubar className="h-auto gap-1 rounded-none border-none bg-transparent p-0 shadow-none ring-0">
          {topLevelPages.map((pageNode) => (
            <DesktopMenuItem
              key={pageNode.url}
              currentPathname={pathname}
              node={pageNode}
            />
          ))}
        </Menubar>

        <form
          action="/search"
          className="flex min-w-[280px] items-center gap-2"
        >
          <div className="relative w-full">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[var(--bber-stone)]" />
            <Input
              name="q"
              type="search"
              placeholder="Search"
              className="h-10 border-[var(--bber-border)] bg-white pl-9 text-sm"
            />
          </div>
          <Button
            type="submit"
            className="h-10 bg-[var(--bber-red)] px-4 text-white hover:bg-[var(--bber-red-strong)]"
          >
            Go
          </Button>
        </form>
      </div>

      <div className="flex lg:hidden">
        <Sheet>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon-lg"
                className="rounded-full text-[var(--bber-red)] hover:bg-[var(--bber-sand)] hover:text-[var(--bber-red)]"
              />
            }
          >
            <MenuIcon />
            <span className="sr-only">Toggle navigation</span>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-full max-w-[22rem] border-r border-[var(--bber-border)] bg-white"
          >
            <SheetHeader className="border-b border-[var(--bber-border)] px-5 pt-5 pb-4">
              <SheetTitle className="font-display text-2xl text-[var(--bber-red)]">
                {siteTitle}
              </SheetTitle>
              <SheetDescription className="text-sm text-[var(--bber-ink)]/70">
                Explore BBER data, research, news, and public resources.
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-5 overflow-y-auto px-5 py-5">
              <form action="/search" className="flex items-center gap-2">
                <div className="relative flex-1">
                  <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[var(--bber-stone)]" />
                  <Input
                    name="q"
                    type="search"
                    placeholder="Search"
                    className="h-10 border-[var(--bber-border)] bg-white pl-9"
                  />
                </div>
                <Button
                  type="submit"
                  className="h-10 bg-[var(--bber-red)] px-4 text-white hover:bg-[var(--bber-red-strong)]"
                >
                  Go
                </Button>
              </form>

              <div className="space-y-1">
                {topLevelPages.map((pageNode) => (
                  <MobileAccordionMenu
                    key={pageNode.url}
                    currentPathname={pathname}
                    node={pageNode}
                  />
                ))}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
