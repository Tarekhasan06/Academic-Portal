"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpDown, ClipboardCheck, ExternalLink, Search } from "lucide-react";
import type { AcademicRecord, CourseInfo } from "@/types/academic";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { formatCountdownLabel, formatDisplayDate, parseDateSafe } from "@/lib/dates";
import { cn, getCourseStyle, getStatusBadgeClass } from "@/lib/utils";

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

  const uniqueTypes = useMemo(() => {
    return Array.from(new Set(records.map((r) => r.type))).sort();
  }, [records]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const now = new Date();

    const list = records.filter((item) => {
      if (courseFilter !== "ALL" && item.course !== courseFilter) return false;
      if (typeFilter !== "ALL" && item.type !== typeFilter) return false;
      if (statusFilter !== "ALL" && item.status !== statusFilter) return false;

      if (dateFilter !== "ALL") {
        const parsed = parseDateSafe(item.date);
        if (!parsed) return false;
        const diffDays = Math.ceil(
          (parsed.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (dateFilter === "WEEK" && (diffDays < 0 || diffDays > 7)) return false;
        if (dateFilter === "UPCOMING" && diffDays < 0) return false;
        if (dateFilter === "PAST" && diffDays >= 0) return false;
      }

      if (q) {
        const hay = [
          item.title,
          item.course,
          item.courseName,
          item.type,
          item.topics.join(" "),
        ]
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

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-6">
          <div className="relative lg:col-span-2">
            <Search className="pointer-events-none absolute top-2.5 left-3 h-4 w-4 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search quizzes, assignments, topics..."
              className="pl-9"
            />
          </div>

          <Select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            aria-label="Filter by course"
          >
            <option value="ALL">All Courses</option>
            {courses.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code}
              </option>
            ))}
          </Select>

          <Select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            aria-label="Filter by assessment type"
          >
            <option value="ALL">All Types</option>
            {uniqueTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>

          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by status"
          >
            <option value="ALL">All Statuses</option>
            <option value="To do">To do</option>
            <option value="In progress">In progress</option>
            <option value="Done">Done</option>
          </Select>

          <div className="flex gap-2">
            <Select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="flex-1"
              aria-label="Filter by date"
            >
              <option value="ALL">Any Date</option>
              <option value="WEEK">Next 7 days</option>
              <option value="UPCOMING">Upcoming</option>
              <option value="PAST">Past</option>
            </Select>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setSortAsc((prev) => !prev)}
              title="Toggle deadline sort order"
              aria-label="Sort by deadline"
            >
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {filtered.length === 0 ? (
        <EmptyState
          title="No assessments match your filters"
          description="Try clearing a filter or connect your Winter 2026 Notion board to see quizzes, assignments, announcements, and syllabus updates."
          icon={ClipboardCheck}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => {
            const course = getCourseStyle(item.course);
            const countdown = formatCountdownLabel(item.date, item.countdown);
            return (
              <Card
                key={item.id}
                className={cn("border-l-4", course.borderClass)}
              >
                <CardContent className="flex flex-col justify-between gap-4 p-4 sm:flex-row sm:items-center">
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/courses/${course.slug}`}
                        className={`rounded-md border px-2 py-0.5 text-xs font-semibold ${course.badgeClass}`}
                      >
                        {course.code}
                      </Link>
                      <Badge variant="secondary">{item.type}</Badge>
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClass(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                      {item.marks !== null && (
                        <Badge variant="outline">{item.marks} marks</Badge>
                      )}
                    </div>

                    <h2 className="text-base font-semibold text-slate-900">
                      {item.title}
                    </h2>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                      <span>Due: {formatDisplayDate(item.date)}</span>
                      {item.prepBy && <span>Prep by: {formatDisplayDate(item.prepBy)}</span>}
                      {item.posted && <span>Posted: {formatDisplayDate(item.posted)}</span>}
                      {item.topics.length > 0 && (
                        <span>Topics: {item.topics.join(" · ")}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2.5">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-1 text-xs font-semibold",
                        countdown.overdue
                          ? "bg-rose-100 text-rose-700"
                          : countdown.urgent
                            ? "bg-amber-100 text-amber-800"
                            : "bg-slate-100 text-slate-600"
                      )}
                    >
                      {countdown.label}
                    </span>

                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-teal-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-teal-800"
                      >
                        Open
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
