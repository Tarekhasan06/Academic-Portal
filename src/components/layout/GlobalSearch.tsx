"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, Search, X } from "lucide-react";
import type { AcademicRecord } from "@/types/academic";
import { formatCouponDate } from "@/lib/dates";
import { getCourseStyle } from "@/lib/utils";
import { CourseTab, StatusWord, recordTypeLabel } from "@/components/wallet/primitives";

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
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const pool = q
      ? records.filter((r) =>
          [r.title, r.course, r.courseName, r.type, r.semester, r.notedBy ?? "", r.topics.join(" ")]
            .join(" ")
            .toLowerCase()
            .includes(q)
        )
      : records.filter((r) => r.category !== "playlist");
    return pool.slice(0, q ? 20 : 8);
  }, [records, query]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-navy/50 p-3 pt-[8vh] sm:p-4 sm:pt-[12vh]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Search the wallet"
    >
      <div
        className="slide-up w-full max-w-2xl overflow-hidden rounded-[10px] bg-coupon shadow-[0_24px_60px_-20px_rgba(13,27,61,0.7)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 bg-navy px-3 py-2.5 text-white">
          <Search className="h-5 w-5 shrink-0" strokeWidth={2.25} aria-hidden />
          <label htmlFor="global-search" className="sr-only">
            Search
          </label>
          <input
            id="global-search"
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search quizzes, notes, topics, people…"
            autoComplete="off"
            className="h-10 min-w-0 flex-1 bg-transparent text-[16px] text-white placeholder:text-white/55 focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-[4px] hover:bg-navy-2 cursor-pointer"
            aria-label="Close search"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          <p className="caps border-b border-hair px-4 py-2 text-[11.5px] tracking-[0.16em] text-ink-3">
            {query.trim() ? `${results.length} matching` : "Recent on the board"}
          </p>
          {results.length === 0 ? (
            <p className="px-4 py-10 text-center text-[15px] text-ink-2">
              {records.length === 0
                ? "Connect the Notion board to search Winter 2026 records."
                : `Nothing on the board matches “${query.trim()}”. Try a course code like 4709.`}
            </p>
          ) : (
            <ul className="divide-y divide-hair">
              {results.map((item) => {
                const course = getCourseStyle(item.course);
                const hasCourse = Boolean(item.course && item.course !== "General");
                return (
                  <li key={item.id}>
                    <a
                      href={item.link ?? item.notionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-stock focus-visible:bg-stock"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          {hasCourse && <CourseTab course={course} size="xs" />}
                          <span className="caps text-[11.5px] tracking-[0.14em] text-ink-3">
                            {recordTypeLabel(item)}
                          </span>
                          {item.status !== "To do" && (
                            <StatusWord status={item.status} className="text-[10px]" />
                          )}
                        </div>
                        <p className="mt-1 truncate text-[15px] font-medium text-navy">
                          {item.title}
                        </p>
                        {item.topics.length > 0 && (
                          <p className="truncate text-[13px] text-ink-2">{item.topics.join(" · ")}</p>
                        )}
                      </div>
                      {item.date && (
                        <span className="carbon hidden shrink-0 text-[12.5px] sm:block">
                          {formatCouponDate(item.date)}
                        </span>
                      )}
                      <ArrowUpRight className="h-4 w-4 shrink-0 text-ink-3" aria-hidden />
                    </a>
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
