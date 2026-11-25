import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import type { AcademicRecord } from "@/types/academic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { formatCountdownLabel, formatDisplayDate } from "@/lib/dates";
import { getCourseStyle, getStatusBadgeClass } from "@/lib/utils";

export function UpcomingList({
  title,
  items,
  emptyTitle,
  emptyDescription,
  viewAllHref,
}: {
  title: string;
  items: AcademicRecord[];
  emptyTitle: string;
  emptyDescription: string;
  viewAllHref?: string;
}) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>{title}</CardTitle>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="inline-flex items-center gap-1 text-xs font-medium text-teal-700 hover:text-teal-800"
          >
            View all
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </CardHeader>
      <CardContent className="flex-1">
        {items.length === 0 ? (
          <EmptyState title={emptyTitle} description={emptyDescription} />
        ) : (
          <ul className="space-y-3">
            {items.slice(0, 5).map((item) => {
              const course = getCourseStyle(item.course);
              const countdown = formatCountdownLabel(
                item.date,
                item.countdown
              );
              return (
                <li
                  key={item.id}
                  className={`flex items-start justify-between gap-3 rounded-xl border border-slate-200/80 border-l-4 ${course.borderClass} bg-slate-50/40 p-3.5 transition-colors hover:bg-slate-50`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Link
                        href={`/courses/${course.slug}`}
                        className={`rounded-md border px-1.5 py-0.5 text-[11px] font-medium ${course.badgeClass}`}
                      >
                        {course.code}
                      </Link>
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${getStatusBadgeClass(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                      {item.marks !== null && (
                        <span className="text-[11px] font-medium text-slate-500">
                          • {item.marks} marks
                        </span>
                      )}
                    </div>
                    <p className="mt-1.5 truncate text-sm font-semibold text-slate-900">
                      {item.title}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {formatDisplayDate(item.date)}
                      {item.topics.length > 0
                        ? ` • ${item.topics.slice(0, 3).join(", ")}`
                        : ""}
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-col items-end gap-1.5">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                        countdown.overdue
                          ? "bg-rose-100 text-rose-700"
                          : countdown.urgent
                            ? "bg-amber-100 text-amber-800"
                            : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {countdown.label}
                    </span>
                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-medium text-teal-700 hover:underline"
                      >
                        Link
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
