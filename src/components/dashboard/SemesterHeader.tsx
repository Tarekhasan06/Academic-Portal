import { Calendar, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDisplayDate } from "@/lib/dates";

export function SemesterHeader({
  activeCoursesCount,
  totalRecordsCount,
  fetchedAt,
}: {
  activeCoursesCount: number;
  totalRecordsCount: number;
  fetchedAt: string;
}) {
  return (
    <section className="rounded-2xl border border-slate-200/80 bg-gradient-to-r from-white via-white to-teal-50/60 p-6 shadow-xs">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="gap-1.5">
              <GraduationCap className="h-3.5 w-3.5" />
              Winter 2026 Semester
            </Badge>
            <Badge variant="secondary">
              {activeCoursesCount} Active Courses
            </Badge>
          </div>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Academic Portal Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Track upcoming quizzes, assignments, class logs, notes, and course progress from Notion.
          </p>
        </div>

        <div className="flex flex-col items-start gap-1 rounded-xl border border-slate-200/80 bg-white px-4 py-3 text-xs text-slate-500 sm:items-end">
          <span className="inline-flex items-center gap-1.5 font-medium text-slate-700">
            <Calendar className="h-3.5 w-3.5 text-teal-700" />
            {totalRecordsCount} Notion Records
          </span>
          <span>Synced {formatDisplayDate(fetchedAt, "MMM d, h:mm a")}</span>
        </div>
      </div>
    </section>
  );
}
