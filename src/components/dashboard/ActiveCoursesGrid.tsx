import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import type { CourseSummary } from "@/types/academic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ActiveCoursesGrid({
  summaries,
}: {
  summaries: CourseSummary[];
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-teal-700" />
          <CardTitle>Active Courses — Winter 2026</CardTitle>
        </div>
        <Link
          href="/courses"
          className="inline-flex items-center gap-1 text-xs font-medium text-teal-700 hover:text-teal-800"
        >
          All courses
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {summaries.map(({ course, pendingCount, completedCount, totalItems }) => (
            <Link
              key={course.code}
              href={`/courses/${course.slug}`}
              className="group rounded-xl border border-slate-200/80 bg-white p-3.5 transition-all hover:border-teal-300 hover:shadow-xs"
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`rounded-md border px-2 py-0.5 text-[11px] font-semibold ${course.badgeClass}`}
                >
                  {course.code}
                </span>
                <span className={`h-2 w-2 rounded-full ${course.dotClass}`} />
              </div>
              <p className="mt-2 line-clamp-2 min-h-[2.25rem] text-xs font-semibold text-slate-800 group-hover:text-teal-800">
                {course.name}
              </p>
              <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-500">
                <span>{totalItems} items</span>
                <span>
                  {pendingCount} due • {completedCount} done
                </span>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
