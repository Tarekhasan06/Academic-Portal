"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  CalendarDays,
  ClipboardList,
  FolderOpen,
  NotebookText,
  Route,
  Ticket,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BrandMark } from "@/components/wallet/primitives";

export type NavItem = {
  href: string;
  label: string;
  short: string;
  icon: LucideIcon;
};

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Today", short: "Today", icon: Ticket },
  { href: "/courses", label: "Courses", short: "Courses", icon: BookOpen },
  { href: "/assessments", label: "Assessments", short: "Assess", icon: ClipboardList },
  { href: "/calendar", label: "Calendar", short: "Calendar", icon: CalendarDays },
  { href: "/notes", label: "Class Notes", short: "Notes", icon: NotebookText },
  { href: "/resources", label: "Resources", short: "Resources", icon: FolderOpen },
  { href: "/progress", label: "Class Progress", short: "Progress", icon: Route },
];

export function isActivePath(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function Wordmark({ compact }: { compact?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5 text-white" aria-label="Winter 2026 home">
      <BrandMark className={compact ? "h-4 w-auto" : "h-5 w-auto"} />
      <span className="caps text-[19px] font-bold tracking-[0.14em] leading-none">
        Winter 2026
        {compact && <span className="text-white/70"> · IPE</span>}
        {!compact && (
          <span className="mt-1 block text-[11px] font-semibold tracking-[0.2em] text-white/65">
            IPE · Academic Portal
          </span>
        )}
      </span>
    </Link>
  );
}

export function Sidebar({ syncedLabel }: { syncedLabel: string }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-navy text-white">
      <div className="px-5 pt-6 pb-7">
        <Wordmark />
      </div>

      <nav aria-label="Primary" className="flex-1 px-3">
        <ul className="space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const active = isActivePath(pathname, item.href);
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "caps flex h-11 items-center gap-3 rounded-[4px] px-3 text-[15px] tracking-[0.12em] transition-colors",
                    active
                      ? "bg-navy-2 text-white"
                      : "text-white/70 hover:bg-navy-2/60 hover:text-white"
                  )}
                >
                  <span
                    className={cn(
                      "grid h-7 w-7 place-items-center rounded-[4px]",
                      active ? "bg-jet text-white" : "text-white/70"
                    )}
                  >
                    <Icon className="h-[17px] w-[17px]" strokeWidth={2} aria-hidden />
                  </span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="m-3 rounded-[6px] border border-white/15 px-4 py-3">
        <span className="caps block text-[11px] tracking-[0.18em] text-white/55">Board sync</span>
        <span className="mt-1 block font-mono text-[13px] font-bold text-white">{syncedLabel}</span>
        <span className="mt-0.5 block text-[12px] text-white/60">Notion · refreshes every 5 min</span>
      </div>
    </div>
  );
}
