"use client";

import {
  ChevronDownIcon,
  ChevronUpIcon,
  MenuIcon,
  SearchIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  getPrimaryNavigationBranches,
  type NavigationBranch,
  type NavigationBranchItem,
  normalizePageUrl,
  Pages,
} from "pages";
import { useEffect, useRef, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

const DESKTOP_OPEN_DELAY_MS = 120;
const DESKTOP_CLOSE_DELAY_MS = 180;

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

function branchItemIsActive(
  currentPathname: string,
  branchItem: NavigationBranchItem,
) {
  if (branchItem.isOverview) {
    return (
      normalizePageUrl(currentPathname) === normalizePageUrl(branchItem.url)
    );
  }

  if (branchItem.branch) {
    return isActivePath(currentPathname, branchItem.branch.url);
  }

  return isActivePath(currentPathname, branchItem.url);
}

function DesktopLinkItem({
  currentPathname,
  depth,
  item,
  onNavigate,
}: {
  currentPathname: string;
  depth: number;
  item: NavigationBranchItem;
  onNavigate: () => void;
}) {
  const isActive = branchItemIsActive(currentPathname, item);

  return (
    <Link
      href={item.url}
      onClick={onNavigate}
      className={cn(
        "block rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        depth === 0
          ? "text-[var(--bber-red)] hover:bg-[var(--bber-sand)]"
          : "text-[var(--bber-ink)] hover:bg-[var(--bber-sand)] hover:text-[var(--bber-red)]",
        item.isOverview
          ? "border border-[var(--bber-border)] bg-[var(--bber-sand)]/60"
          : "",
        isActive ? "bg-[var(--bber-sand)] text-[var(--bber-red)]" : "",
      )}
    >
      {item.title}
    </Link>
  );
}

function DesktopBranchMenu({
  branch,
  currentPathname,
  depth = 0,
  onNavigate,
}: {
  branch: NavigationBranch;
  currentPathname: string;
  depth?: number;
  onNavigate: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const branchRef = useRef<HTMLDivElement | null>(null);
  const openTimeoutRef = useRef<number | null>(null);
  const closeTimeoutRef = useRef<number | null>(null);
  const isActive = isActivePath(currentPathname, branch.url);

  const clearTimers = () => {
    if (openTimeoutRef.current) {
      window.clearTimeout(openTimeoutRef.current);
      openTimeoutRef.current = null;
    }

    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const openMenu = () => {
    clearTimers();
    setIsOpen(true);
  };

  const closeMenu = () => {
    clearTimers();
    setIsOpen(false);
  };

  const scheduleOpen = () => {
    clearTimers();
    openTimeoutRef.current = window.setTimeout(() => {
      setIsOpen(true);
    }, DESKTOP_OPEN_DELAY_MS);
  };

  const scheduleClose = () => {
    clearTimers();
    closeTimeoutRef.current = window.setTimeout(() => {
      setIsOpen(false);
    }, DESKTOP_CLOSE_DELAY_MS);
  };

  useEffect(() => {
    return () => {
      if (openTimeoutRef.current) {
        window.clearTimeout(openTimeoutRef.current);
      }

      if (closeTimeoutRef.current) {
        window.clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!branchRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handlePointerDown);
    }

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [isOpen]);

  const handleNavigate = () => {
    closeMenu();
    onNavigate();
  };

  return (
    <section
      ref={branchRef}
      aria-label={`${branch.title} navigation group`}
      className="relative"
      onMouseEnter={scheduleOpen}
      onMouseLeave={scheduleClose}
    >
      <div
        className={cn(
          "flex items-center rounded-lg transition-colors",
          depth === 0 ? "gap-0.5" : "gap-1 bg-white",
          isActive || isOpen ? "bg-[var(--bber-sand)]" : "",
        )}
      >
        <Link
          href={branch.url}
          onClick={handleNavigate}
          className={cn(
            "rounded-lg px-3 py-2 font-semibold transition-colors focus-visible:outline-none",
            depth === 0
              ? "text-[1.05rem] text-[var(--bber-red)] hover:bg-[var(--bber-sand)]"
              : "flex-1 text-sm text-[var(--bber-ink)] hover:text-[var(--bber-red)]",
          )}
        >
          {branch.title}
        </Link>
        <button
          type="button"
          aria-controls={`desktop-nav-${branch.key}`}
          aria-expanded={isOpen}
          aria-label={`Open ${branch.title} submenu`}
          onClick={() => {
            if (isOpen) {
              closeMenu();
              return;
            }

            openMenu();
          }}
          onFocus={openMenu}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.stopPropagation();
              closeMenu();
            }
          }}
          className={cn(
            "inline-flex size-7 items-center justify-center rounded-lg text-[var(--bber-red)] transition-colors hover:bg-[var(--bber-sand)] hover:text-[var(--bber-red)]",
            depth > 0
              ? "text-[var(--bber-ink)] hover:text-[var(--bber-red)]"
              : "",
          )}
        >
          {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </button>
      </div>

      {isOpen ? (
        <div
          id={`desktop-nav-${branch.key}`}
          className={cn(
            "absolute z-50 min-w-64 overflow-visible rounded-xl border border-[var(--bber-border)] bg-white p-2 shadow-xl",
            depth === 0 ? "top-full left-0 mt-3" : "top-0 left-full ml-2",
          )}
        >
          <div className="flex flex-col gap-1">
            {branch.items.map((item) => {
              if (item.branch) {
                return (
                  <DesktopBranchMenu
                    key={`${item.key}-${currentPathname}`}
                    branch={item.branch}
                    currentPathname={currentPathname}
                    depth={depth + 1}
                    onNavigate={onNavigate}
                  />
                );
              }

              return (
                <DesktopLinkItem
                  key={item.key}
                  currentPathname={currentPathname}
                  depth={depth + 1}
                  item={item}
                  onNavigate={handleNavigate}
                />
              );
            })}
          </div>
        </div>
      ) : null}
    </section>
  );
}

function MobileLinkItem({
  currentPathname,
  depth,
  item,
  onNavigate,
}: {
  currentPathname: string;
  depth: number;
  item: NavigationBranchItem;
  onNavigate: () => void;
}) {
  const isActive = branchItemIsActive(currentPathname, item);

  return (
    <Link
      href={item.url}
      onClick={onNavigate}
      className={cn(
        "block rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        depth > 0 ? "ml-3 border-l border-[var(--bber-border)] pl-4" : "",
        item.isOverview
          ? "bg-[var(--bber-sand)]/60 text-[var(--bber-red)]"
          : "text-[var(--bber-ink)] hover:bg-[var(--bber-sand)] hover:text-[var(--bber-red)]",
        isActive ? "bg-[var(--bber-sand)] text-[var(--bber-red)]" : "",
      )}
    >
      {item.title}
    </Link>
  );
}

function MobileBranchMenu({
  branch,
  currentPathname,
  depth = 0,
  onNavigate,
}: {
  branch: NavigationBranch;
  currentPathname: string;
  depth?: number;
  onNavigate: () => void;
}) {
  const isActive = isActivePath(currentPathname, branch.url);

  return (
    <Accordion multiple className="w-full">
      <AccordionItem
        value={branch.key}
        className={cn(
          "border-b border-[var(--bber-border)]",
          depth > 0 ? "ml-3" : "",
        )}
      >
        <div className="flex items-center gap-2 py-1">
          <Link
            href={branch.url}
            onClick={onNavigate}
            className={cn(
              "flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition-colors",
              depth === 0 ? "text-[var(--bber-red)]" : "text-[var(--bber-ink)]",
              isActive
                ? "bg-[var(--bber-sand)] text-[var(--bber-red)]"
                : "hover:bg-[var(--bber-sand)] hover:text-[var(--bber-red)]",
            )}
          >
            {branch.title}
          </Link>
          <AccordionTrigger
            className="h-10 flex-none rounded-lg border border-[var(--bber-border)] px-3 py-0 text-[var(--bber-red)] hover:bg-[var(--bber-sand)] hover:no-underline"
            aria-label={`Toggle ${branch.title} submenu`}
          />
        </div>
        <AccordionContent className="pb-3">
          <div className="flex flex-col gap-1">
            {branch.items.map((item) => {
              if (item.branch) {
                return (
                  <MobileBranchMenu
                    key={item.key}
                    branch={item.branch}
                    currentPathname={currentPathname}
                    depth={depth + 1}
                    onNavigate={onNavigate}
                  />
                );
              }

              return (
                <MobileLinkItem
                  key={item.key}
                  currentPathname={currentPathname}
                  depth={depth + 1}
                  item={item}
                  onNavigate={onNavigate}
                />
              );
            })}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export function InteractivePrimaryNav({
  siteTitle,
}: InteractivePrimaryNavProps) {
  const pathname = usePathname();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const topLevelPages = getPrimaryNavigationBranches(Pages);

  useEffect(() => {
    if (pathname) {
      setIsSheetOpen(false);
    }
  }, [pathname]);

  return (
    <>
      <div className="hidden items-center gap-6 lg:flex">
        <nav aria-label="Primary" className="flex items-center gap-2">
          {topLevelPages.map((pageEntry) => {
            if (!pageEntry.branch) {
              return (
                <Link
                  key={pageEntry.node.url}
                  href={pageEntry.node.url}
                  className={cn(
                    "rounded-lg px-3 py-2 text-[1.05rem] font-semibold text-[var(--bber-red)] transition-colors hover:bg-[var(--bber-sand)]",
                    isActivePath(pathname, pageEntry.node.url)
                      ? "bg-[var(--bber-sand)]"
                      : "",
                  )}
                >
                  {pageEntry.node.title}
                </Link>
              );
            }

            return (
              <DesktopBranchMenu
                key={`${pageEntry.node.url}-${pathname}`}
                branch={pageEntry.branch}
                currentPathname={pathname}
                onNavigate={() => undefined}
              />
            );
          })}
        </nav>

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
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
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

              <nav aria-label="Mobile primary" className="flex flex-col gap-1">
                {topLevelPages.map((pageEntry) => {
                  if (!pageEntry.branch) {
                    return (
                      <Link
                        key={pageEntry.node.url}
                        href={pageEntry.node.url}
                        onClick={() => setIsSheetOpen(false)}
                        className={cn(
                          "rounded-lg px-3 py-2 text-sm font-semibold text-[var(--bber-ink)] transition-colors hover:bg-[var(--bber-sand)] hover:text-[var(--bber-red)]",
                          isActivePath(pathname, pageEntry.node.url)
                            ? "bg-[var(--bber-sand)] text-[var(--bber-red)]"
                            : "",
                        )}
                      >
                        {pageEntry.node.title}
                      </Link>
                    );
                  }

                  return (
                    <MobileBranchMenu
                      key={pageEntry.node.url}
                      branch={pageEntry.branch}
                      currentPathname={pathname}
                      onNavigate={() => setIsSheetOpen(false)}
                    />
                  );
                })}
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
