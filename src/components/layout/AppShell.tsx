"use client";

import { useEffect, useState } from "react";
import { Menu, Search, X } from "lucide-react";
import type { AcademicRecord } from "@/types/academic";
import { Sidebar } from "@/components/layout/Sidebar";
import { GlobalSearch } from "@/components/layout/GlobalSearch";
import { Button } from "@/components/ui/button";

export function AppShell({
  children,
  records,
}: {
  children: React.ReactNode;
  records: AcademicRecord[];
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/80 text-slate-900">
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-slate-200/80 bg-white lg:block">
        <Sidebar />
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative z-50 w-72 max-w-[85vw] border-r border-slate-200 bg-white shadow-xl">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="absolute top-3.5 right-3 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
            <Sidebar onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex min-h-screen flex-col lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-slate-200/80 bg-white/85 px-4 backdrop-blur-md sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <span className="text-sm font-medium text-slate-500 lg:hidden">
              Winter 2026 Portal
            </span>
          </div>

          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="flex w-full max-w-sm items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-1.5 text-sm text-slate-500 transition-colors hover:border-slate-300 hover:bg-white cursor-pointer"
          >
            <span className="flex items-center gap-2 truncate">
              <Search className="h-4 w-4 text-slate-400" />
              <span className="truncate">Search courses, tasks, notes...</span>
            </span>
            <kbd className="hidden rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[11px] font-medium text-slate-400 sm:inline-block">
              Ctrl K
            </kbd>
          </button>
        </header>

        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>

      <GlobalSearch
        records={records}
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </div>
  );
}
