import Link from "next/link";
import { Activity, ArrowRight } from "lucide-react";
import type { AcademicRecord } from "@/types/academic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDisplayDate } from "@/lib/dates";
import { getCourseStyle } from "@/lib/utils";

export function RecentClassLogs({ logs }: { logs: AcademicRecord[] }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-teal-700" />
          <CardTitle>Recent Class Logs</CardTitle>
        </div>
        <Link
          href="/progress"
          className="inline-flex items-center gap-1 text-xs font-medium text-teal-700 hover:text-teal-800"
        >
          Full progress
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </CardHeader>
      <CardContent>
        {logs.length === 0 ? (
          <EmptyState
            title="No class logs recorded yet"
            description="Class Log items from your Winter 2026 Notion board will appear here chronologically."
            icon={Activity}
          />
        ) : (
          <div className="space-y-3">
            {logs.map((log) => {
              const course = getCourseStyle(log.course);
              return (
                <div
                  key={log.id}
                  className="flex flex-col justify-between gap-2 rounded-xl border border-slate-200/70 bg-slate-50/50 p-3.5 sm:flex-row sm:items-center"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/courses/${course.slug}`}
                        className={`rounded-md border px-1.5 py-0.5 text-[11px] font-medium ${course.badgeClass}`}
                      >
                        {course.code}
                      </Link>
                      <span className="text-xs text-slate-500">
                        {formatDisplayDate(log.date)}
                      </span>
                    </div>
                    <p className="mt-1 truncate text-sm font-medium text-slate-900">
                      {log.title}
                    </p>
                    {log.topics.length > 0 && (
                      <p className="mt-0.5 truncate text-xs text-slate-500">
                        Topics: {log.topics.join(", ")}
                      </p>
                    )}
                  </div>
                  {log.notedBy && (
                    <span className="shrink-0 text-xs text-slate-500">
                      Noted by {log.notedBy}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
