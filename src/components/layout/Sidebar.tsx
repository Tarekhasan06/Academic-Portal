"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  FolderKanban,
  GraduationCap,
  LayoutDashboard,
  NotebookPen,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/courses", label: "Courses", icon: BookOpen },
  { href: "/assessments", label: "Assessments", icon: ClipboardCheck },
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/notes", label: "Class Notes", icon: NotebookPen },
  { href: "/resources", label: "Resources", icon: FolderKanban },
  { href: "/progress", label: "Class Progress", icon: Activity },
];

export function Sidebar({
  onNavigate,
}: {
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col justify-between bg-white">
      <div>
        <div className="flex items-center gap-3 border-b border-slate-200/80 px-5 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-700 text-white shadow-xs">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">
              Winter 2026
            </p>
            <p className="truncate text-xs text-slate-500">Academic Portal</p>
          </div>
        </div>

        <nav className="space-y-1 p-3" aria-label="Primary Navigation">
          {NAV_ITEMS.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-teal-50 text-teal-800 ring-1 ring-teal-200/70"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0",
                    active ? "text-teal-700" : "text-slate-400"
                  )}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-slate-200/80 p-4">
        <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
          <p className="font-medium text-slate-800">Notion Sync Active</p>
          <p className="mt-0.5 text-[11px] text-slate-500">
            Server-cached 5 min refresh
          </p>
        </div>
      </div>
    </div>
  );
}
