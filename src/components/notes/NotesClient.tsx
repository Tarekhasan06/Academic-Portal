"use client";

import { useMemo, useState } from "react";
import { ArrowDownUp, NotebookText, Search } from "lucide-react";
import type { AcademicRecord, CourseInfo } from "@/types/academic";
import { EntryCoupon } from "@/components/wallet/coupons";
import { EmptyTicket, FilterBar, SelectField, btn, field } from "@/components/wallet/primitives";
import { parseDateSafe } from "@/lib/dates";
import { cn } from "@/lib/utils";

export function NotesClient({
  notes,
  courses,
}: {
  notes: AcademicRecord[];
  courses: CourseInfo[];
}) {
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("ALL");
  const [newestFirst, setNewestFirst] = useState(true);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = notes.filter((n) => {
      if (courseFilter !== "ALL" && n.course !== courseFilter) return false;
      if (q) {
        const hay = [n.title, n.course, n.courseName, n.notedBy ?? "", n.topics.join(" ")]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    return [...list].sort((a, b) => {
      const da = parseDateSafe(a.date ?? a.posted)?.getTime() ?? 0;
      const db = parseDateSafe(b.date ?? b.posted)?.getTime() ?? 0;
      return newestFirst ? db - da : da - db;
    });
  }, [notes, search, courseFilter, newestFirst]);

  return (
    <div className="space-y-5">
      <FilterBar className="sm:grid-cols-[2fr_1fr_auto]">
        <label className="relative block">
          <span className="sr-only">Search notes</span>
          <Search
            className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-navy"
            strokeWidth={2.25}
            aria-hidden
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search titles, topics, who noted…"
            className={cn(field, "pl-9")}
          />
        </label>
        <SelectField label="Course" value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)}>
          <option value="ALL">All courses</option>
          {courses.map((c) => (
            <option key={c.code} value={c.code}>
              {c.code}
            </option>
          ))}
        </SelectField>
        <button
          type="button"
          onClick={() => setNewestFirst((v) => !v)}
          className={cn(btn.base, btn.secondary, btn.md, "whitespace-nowrap")}
        >
          <ArrowDownUp className="h-4 w-4" strokeWidth={2.25} aria-hidden />
          {newestFirst ? "Newest first" : "Oldest first"}
        </button>
      </FilterBar>

      <p className="text-[14px] text-ink-2" aria-live="polite">
        <span className="carbon text-[14px]">{filtered.length}</span> notes
      </p>

      {filtered.length === 0 ? (
        <EmptyTicket
          icon={NotebookText}
          title="No class notes found"
          description={
            notes.length === 0
              ? "Records typed Class Note on the board appear here."
              : "Nothing matches. Try another course or a topic word."
          }
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((note) => (
            <EntryCoupon key={note.id} record={note} kind="Class note" action="Open" />
          ))}
        </div>
      )}
    </div>
  );
}
