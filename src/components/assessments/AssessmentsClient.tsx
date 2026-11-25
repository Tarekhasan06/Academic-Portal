"use client";

import { useMemo, useState } from "react";
import { ArrowDownUp, ClipboardList, Search, X } from "lucide-react";
import type { AcademicRecord, CourseInfo } from "@/types/academic";
import { LegRow } from "@/components/wallet/coupons";
import {
  EmptyTicket,
  FilterBar,
  SectionHead,
  SelectField,
  btn,
  field,
} from "@/components/wallet/primitives";
import { getDaysRemaining, parseDateSafe } from "@/lib/dates";
import { cn } from "@/lib/utils";

export function AssessmentsClient({
  records,
  courses,
}: {
  records: AcademicRecord[];
  courses: CourseInfo[];
}) {
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState("ALL");
  const [sortAsc, setSortAsc] = useState(true);

  const uniqueTypes = useMemo(
    () => Array.from(new Set(records.map((r) => r.type))).sort(),
    [records]
  );

  const filtersActive =
    search !== "" ||
    courseFilter !== "ALL" ||
    typeFilter !== "ALL" ||
    statusFilter !== "ALL" ||
    dateFilter !== "ALL";

  const clear = () => {
    setSearch("");
    setCourseFilter("ALL");
    setTypeFilter("ALL");
    setStatusFilter("ALL");
    setDateFilter("ALL");
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = records.filter((item) => {
      if (courseFilter !== "ALL" && item.course !== courseFilter) return false;
      if (typeFilter !== "ALL" && item.type !== typeFilter) return false;
      if (statusFilter !== "ALL" && item.status !== statusFilter) return false;
      if (dateFilter !== "ALL") {
        const d = getDaysRemaining(item.date);
        if (d === null) return false;
        if (dateFilter === "WEEK" && (d < 0 || d > 7)) return false;
        if (dateFilter === "UPCOMING" && d < 0) return false;
        if (dateFilter === "PAST" && d >= 0) return false;
      }
      if (q) {
        const hay = [item.title, item.course, item.courseName, item.type, item.topics.join(" ")]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    return [...list].sort((a, b) => {
      const da = parseDateSafe(a.date)?.getTime() ?? Number.MAX_SAFE_INTEGER;
      const db = parseDateSafe(b.date)?.getTime() ?? Number.MAX_SAFE_INTEGER;
      return sortAsc ? da - db : db - da;
    });
  }, [records, search, courseFilter, typeFilter, statusFilter, dateFilter, sortAsc]);

  const groups = [
    {
      key: "open",
      title: "Open legs",
      items: filtered.filter(
        (r) => r.status !== "Done" && (r.category === "quiz" || r.category === "assignment")
      ),
    },
    {
      key: "notices",
      title: "Notices & syllabus",
      items: filtered.filter((r) => r.category === "announcement" || r.category === "syllabus"),
    },
    {
      key: "used",
      title: "Used",
      items: filtered.filter(
        (r) => r.status === "Done" && (r.category === "quiz" || r.category === "assignment")
      ),
    },
  ].filter((g) => g.items.length > 0);

  return (
    <div className="space-y-6">
      <FilterBar className="grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr_auto]">
        <label className="relative col-span-2 block lg:col-span-1">
          <span className="sr-only">Search assessments</span>
          <Search
            className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-navy"
            strokeWidth={2.25}
            aria-hidden
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search titles, topics…"
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
        <SelectField label="Type" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="ALL">All types</option>
          {uniqueTypes.map((t) => (
            <option key={t} value={t}>
              {t.replace(/^[^\p{L}\p{N}]+/u, "")}
            </option>
          ))}
        </SelectField>
        <SelectField label="Status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="ALL">Any status</option>
          <option value="To do">Open (to do)</option>
          <option value="In progress">Boarding (in progress)</option>
          <option value="Done">Used (done)</option>
        </SelectField>
        <SelectField label="Date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
          <option value="ALL">Any date</option>
          <option value="WEEK">Next 7 days</option>
          <option value="UPCOMING">Upcoming</option>
          <option value="PAST">Past</option>
        </SelectField>
        <button
          type="button"
          onClick={() => setSortAsc((v) => !v)}
          className={cn(btn.base, btn.secondary, btn.md, "col-span-2 whitespace-nowrap lg:col-span-1")}
          aria-label={sortAsc ? "Sorted soonest first; switch to latest first" : "Sorted latest first; switch to soonest first"}
        >
          <ArrowDownUp className="h-4 w-4" strokeWidth={2.25} aria-hidden />
          {sortAsc ? "Soonest" : "Latest"}
        </button>
      </FilterBar>

      <div className="flex items-center justify-between gap-3 text-[14px] text-ink-2" aria-live="polite">
        <span>
          <span className="carbon text-[14px]">{filtered.length}</span> of{" "}
          <span className="carbon text-[14px]">{records.length}</span> on the board
        </span>
        {filtersActive && (
          <button
            type="button"
            onClick={clear}
            className="caps inline-flex items-center gap-1 text-[12.5px] tracking-[0.14em] text-jet hover:text-jet-ink cursor-pointer"
          >
            <X className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
            Clear filters
          </button>
        )}
      </div>

      {groups.length === 0 ? (
        <EmptyTicket
          icon={ClipboardList}
          title={records.length === 0 ? "Board is empty" : "No legs match"}
          description={
            records.length === 0
              ? "Quizzes, assignments and notices appear here once the Notion board is connected."
              : "Nothing matches these filters. Clear one or search a course code like 4725."
          }
        />
      ) : (
        groups.map((g) => (
          <section key={g.key} aria-label={g.title}>
            <SectionHead title={g.title} count={g.items.length} as="h2" />
            <ul className="mt-3 space-y-2">
              {g.items.map((r, i) => (
                <LegRow key={r.id} record={r} showDetails stampDelay={Math.min(i * 60, 240)} />
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
