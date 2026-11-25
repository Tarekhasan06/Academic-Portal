"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MoreHorizontal, Search, X } from "lucide-react";
import type { AcademicRecord } from "@/types/academic";
import { NAV_ITEMS, Sidebar, Wordmark, isActivePath } from "@/components/layout/Sidebar";
import { GlobalSearch } from "@/components/layout/GlobalSearch";
import { cn } from "@/lib/utils";
import { PORTAL_TZ } from "@/lib/dates";

const TAB_ITEMS = NAV_ITEMS.slice(0, 4);
const MORE_ITEMS = NAV_ITEMS.slice(4);

function syncLabel(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  const t = new Intl.DateTimeFormat("en-GB", {
    timeZone: PORTAL_TZ,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d);
  const day = new Intl.DateTimeFormat("en-GB", {
    timeZone: PORTAL_TZ,
    day: "2-digit",
    month: "short",
  })
    .format(d)
    .toUpperCase();
  return `${day} · ${t}`;
}

export function AppShell({
  children,
  records,
  fetchedAt,
}: {
  children: React.ReactNode;
  records: AcademicRecord[];
  fetchedAt: string;
}) {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const synced = syncLabel(fetchedAt);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
      if (e.key === "Escape") setMoreOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    setMoreOpen(false);
  }, [pathname]);

  const moreActive = MORE_ITEMS.some((i) => isActivePath(pathname, i.href));

  return (
    <div className="min-h-dvh">
      <a
        href="#main"
        className="caps sr-only z-[60] rounded-[4px] bg-jet px-4 py-2 text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>

      {/* Desktop rail */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 lg:block">
        <Sidebar syncedLabel={synced} />
      </aside>

      <div className="flex min-h-dvh flex-col lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-navy text-white lg:bg-stock/90 lg:text-navy lg:backdrop-blur-md">
          <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6 lg:h-16 lg:px-10">
            <div className="lg:hidden">
              <Wordmark compact />
            </div>

            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="hidden h-10 w-full max-w-md items-center justify-between gap-3 rounded-[4px] border-[1.5px] border-navy/20 bg-coupon px-3 text-[15px] text-ink-3 transition-colors hover:border-navy/50 lg:flex cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Search className="h-4 w-4 text-navy" strokeWidth={2.25} aria-hidden />
                Search quizzes, notes, topics…
              </span>
              <kbd className="caps rounded-[3px] border border-hair px-1.5 text-[11px] tracking-[0.12em] text-ink-3">
                Ctrl K
              </kbd>
            </button>

            <span className="hidden font-mono text-[12px] font-bold text-ink-2 lg:block">
              <span className="caps mr-2 font-sans text-[11px] tracking-[0.18em] text-ink-3">
                Synced
              </span>
              {synced}
            </span>

            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-[4px] text-white transition-colors hover:bg-navy-2 lg:hidden cursor-pointer"
              aria-label="Search"
            >
              <Search className="h-5 w-5" strokeWidth={2.25} />
            </button>
          </div>
        </header>

        <main
          id="main"
          className="mx-auto w-full max-w-6xl flex-1 px-4 pt-5 pb-28 sm:px-6 lg:px-10 lg:pt-6 lg:pb-16"
        >
          {children}
        </main>
      </div>

      {/* Phone tab bar */}
      <nav
        aria-label="Primary"
        className="fixed inset-x-0 bottom-0 z-30 border-t border-navy-3 bg-navy pb-[env(safe-area-inset-bottom)] text-white lg:hidden"
      >
        <ul className="grid grid-cols-5">
          {TAB_ITEMS.map((item) => {
            const active = isActivePath(pathname, item.href);
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "caps flex h-16 flex-col items-center justify-center gap-1 text-[11.5px] tracking-[0.1em]",
                    active ? "text-white" : "text-white/60"
                  )}
                >
                  <span
                    className={cn(
                      "grid h-7 w-10 place-items-center rounded-[4px]",
                      active && "bg-jet"
                    )}
                  >
                    <Icon className="h-[18px] w-[18px]" strokeWidth={2} aria-hidden />
                  </span>
                  {item.short}
                </Link>
              </li>
            );
          })}
          <li>
            <button
              type="button"
              onClick={() => setMoreOpen((v) => !v)}
              aria-expanded={moreOpen}
              aria-controls="more-sheet"
              className={cn(
                "caps flex h-16 w-full flex-col items-center justify-center gap-1 text-[11.5px] tracking-[0.1em] cursor-pointer",
                moreActive || moreOpen ? "text-white" : "text-white/60"
              )}
            >
              <span
                className={cn(
                  "grid h-7 w-10 place-items-center rounded-[4px]",
                  moreActive && "bg-jet"
                )}
              >
                {moreOpen ? (
                  <X className="h-[18px] w-[18px]" strokeWidth={2} aria-hidden />
                ) : (
                  <MoreHorizontal className="h-[18px] w-[18px]" strokeWidth={2} aria-hidden />
                )}
              </span>
              More
            </button>
          </li>
        </ul>
      </nav>

      {/* More sheet (phones) */}
      {moreOpen && (
        <div className="fixed inset-0 z-20 lg:hidden" onClick={() => setMoreOpen(false)}>
          <div className="absolute inset-0 bg-navy/40" />
          <div
            id="more-sheet"
            onClick={(e) => e.stopPropagation()}
            className="slide-up absolute inset-x-0 bottom-16 mb-[env(safe-area-inset-bottom)] rounded-t-[12px] bg-coupon px-4 pt-4 pb-3 shadow-[0_-12px_30px_-12px_rgba(13,27,61,0.5)]"
          >
            <p className="caps px-1 text-[12px] tracking-[0.16em] text-ink-3">More in the wallet</p>
            <ul className="mt-2 divide-y divide-hair">
              {MORE_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = isActivePath(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className="caps flex h-14 items-center gap-3 px-1 text-[17px] tracking-[0.1em] text-navy"
                    >
                      <span
                        className={cn(
                          "grid h-9 w-9 place-items-center rounded-[4px] border-[1.5px] border-navy",
                          active && "border-jet bg-jet text-white"
                        )}
                      >
                        <Icon className="h-[18px] w-[18px]" strokeWidth={2} aria-hidden />
                      </span>
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <p className="mt-2 border-t border-hair px-1 pt-3 text-[13px] text-ink-2">
              Board synced <span className="carbon text-[12.5px]">{synced}</span> · refreshes every 5
              min
            </p>
          </div>
        </div>
      )}

      <GlobalSearch records={records} open={searchOpen} onClose={closeSearch} />
    </div>
  );
}
