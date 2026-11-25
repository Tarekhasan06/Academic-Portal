"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Activity, ExternalLink } from "lucide-react";
import type { AcademicRecord, CourseSummary } from "@/types/academic";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Select } from "@/components/ui/select";
import { formatDisplayDate, parseDateSafe } from "@/lib/dates";
import { getCourseStyle } from "@/lib/utils";

export function ProgressClient({
  logs,
  summaries,
}: {
  logs: AcademicRecord[];
  summaries: CourseSummary[];
}) {
  const [courseFilter, setCourseFilter] = useState("ALL");

  const filteredLogs = useMemo(() => {
    return logs
      .filter((l) => courseFilter === "ALL" || l.course === courseFilter)
      .sort((a, b) => {
        const da = parseDateSafe(a.date)?.getTime() ?? 0;
        const db = parseDateSafe(b.date)?.getTime() ?? 0;
        return db - da;
      });
  }, [logs, courseFilter]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Course Progress Overview</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {summaries.map(({ course, classLogsCount, completedCount, totalItems }) => {
            const pct =
              totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;
            return (
              <div
                key={course.code}
                className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-3.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <Link
                    href={`/courses/${course.slug}`}
                    className={`rounded-md border px-2 py-0.5 text-[11px] font-semibold ${course.badgeClass}`}
                  >
                    {course.code}
                  </Link>
                  <span className="text-xs font-medium text-slate-600">
                    {classLogsCount} classes
                  </span>
                </div>
                <p className="mt-2 truncate text-xs font-medium text-slate-800">
                  {course.shortName}
                </p>
                <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-teal-600 transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="mt-1 text-[11px] text-slate-500">
                  {completedCount}/{totalItems} tasks done
                </p>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-900">
          Chronological Class Log Timeline ({filteredLogs.length})
        </h2>
        <Select
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
          aria-label="Filter class logs by course"
        >
          <option value="ALL">All Courses</option>
          {summaries.map(({ course }) => (
            <option key={course.code} value={course.code}>
              {course.code}
            </option>
          ))}
        </Select>
      </div>

      {filteredLogs.length === 0 ? (
        <EmptyState
          title="No class logs found"
          description="Class Log entries from your Winter 2026 Notion board will appear here as a chronological timeline."
          icon={Activity}
        />
      ) : (
        <div className="relative space-y-4 border-l-2 border-slate-200 pl-6">
          {filteredLogs.map((log) => {
            const style = getCourseStyle(log.course);
            return (
              <div key={log.id} className="relative">
                <span
                  className={`absolute top-5 -left-[31px] h-3 w-3 rounded-full ring-4 ring-slate-50 ${style.dotClass}`}
                />
                <Card>
                  <CardContent className="flex flex-col justify-between gap-3 p-4 sm:flex-row sm:items-center">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          href={`/courses/${style.slug}`}
                          className={`rounded-md border px-2 py-0.5 text-xs font-semibold ${style.badgeClass}`}
                        >
                          {style.code}
                        </Link>
                        <span className="text-xs font-medium text-slate-500">
                          {formatDisplayDate(log.date)}
                        </span>
                        {log.notedBy && (
                          <span className="text-xs text-slate-500">
                            • Noted by {log.notedBy}
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-semibold text-slate-900 sm:text-base">
                        {log.title}
                      </h3>
                      {log.topics.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {log.topics.map((topic) => (
                            <Badge key={topic} variant="secondary">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    {log.link && (
                      <a
                        href={log.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                      >
                        Open Link
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
