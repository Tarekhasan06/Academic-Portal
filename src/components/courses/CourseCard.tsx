import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import type { CourseSummary } from "@/types/academic";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export function CourseCard({ summary }: { summary: CourseSummary }) {
  const {
    course,
    totalItems,
    pendingCount,
    completedCount,
    quizzesCount,
    assignmentsCount,
    notesCount,
    resourcesCount,
  } = summary;

  return (
    <Link href={`/courses/${course.slug}`} className="group block">
      <Card className="h-full transition-all group-hover:border-teal-300 group-hover:shadow-sm">
        <CardContent className="flex h-full flex-col justify-between p-5">
          <div>
            <div className="flex items-center justify-between gap-2">
              <span
                className={`rounded-md border px-2 py-0.5 text-xs font-semibold ${course.badgeClass}`}
              >
                {course.code}
              </span>
              {course.isLab && <Badge variant="secondary">Lab / Project</Badge>}
            </div>

            <div className="mt-3 flex items-start gap-2.5">
              <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-slate-400 group-hover:text-teal-700" />
              <h2 className="text-base font-semibold text-slate-900 group-hover:text-teal-800">
                {course.name}
              </h2>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
              <span>Quizzes: {quizzesCount}</span>
              <span>Assignments: {assignmentsCount}</span>
              <span>Notes: {notesCount}</span>
              <span>Resources: {resourcesCount}</span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
            <span className="text-slate-500">
              {totalItems} total • {pendingCount} pending • {completedCount} done
            </span>
            <span className="inline-flex items-center gap-1 font-medium text-teal-700">
              Open
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
