"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ExternalLink, Search, X } from "lucide-react";
import type { AcademicRecord } from "@/types/academic";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { formatDisplayDate } from "@/lib/dates";
import { getCourseStyle, getStatusBadgeClass } from "@/lib/utils";

export function GlobalSearch({
  records,
  open,
  onClose,
}: {
  records: AcademicRecord[];
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return records.slice(0, 8);
    return records
      .filter((r) => {
        const haystack = [
          r.title,
          r.course,
          r.courseName,
          r.type,
          r.semester,
          r.notedBy ?? "",
          r.topics.join(" "),
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(q);
      })
      .slice(0, 15);
  }, [records, query]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/40 p-4 pt-16 backdrop-blur-xs"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Global search"
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-3">
          <Search className="h-4 w-4 text-slate-400" />
          <Input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search courses, quizzes, assignments, notes, topics..."
            className="border-0 px-1 shadow-none focus-visible:ring-0"
          />
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
            aria-label="Close search"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto p-2">
          {results.length === 0 ? (
            <p className="py-10 text-center text-sm text-slate-500">
              {records.length === 0
                ? "Connect your Notion database to search Winter 2026 records."
                : "No matching academic records found."}
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {results.map((item) => {
                const courseStyle = getCourseStyle(item.course);
                return (
                  <li
                    key={item.id}
                    className="flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 hover:bg-slate-50"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          href={`/courses/${courseStyle.slug}`}
                          onClick={onClose}
                          className={`rounded-md border px-1.5 py-0.5 text-[11px] font-medium ${courseStyle.badgeClass}`}
                        >
                          {courseStyle.code}
                        </Link>
                        <Badge variant="secondary" className="text-[11px]">
                          {item.type}
                        </Badge>
                        <span
                          className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${getStatusBadgeClass(
                            item.status
                          )}`}
                        >
                          {item.status}
                        </span>
                      </div>
                      <p className="mt-1 truncate text-sm font-medium text-slate-900">
                        {item.title}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {formatDisplayDate(item.date)}
                        {item.topics.length > 0
                          ? ` • ${item.topics.join(", ")}`
                          : ""}
                      </p>
                    </div>
                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
                      >
                        Open
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
