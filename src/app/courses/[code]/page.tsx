import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, BookOpen } from "lucide-react";
import { SetupBanner } from "@/components/layout/SetupBanner";
import { CourseDetailTabs } from "@/components/courses/CourseDetailTabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getCourseDetailData } from "@/lib/queries";
import { WINTER_2026_COURSES } from "@/lib/utils";

export const revalidate = 300;

export function generateStaticParams() {
  return WINTER_2026_COURSES.map((c) => ({ code: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>;
}): Promise<Metadata> {
  const { code } = await params;
  const detail = await getCourseDetailData(code);
  return {
    title: `${detail.course.code} — ${detail.course.name}`,
  };
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const detail = await getCourseDetailData(code);
  const { course } = detail;

  return (
    <div className="space-y-6">
      <SetupBanner configured={detail.configured} error={detail.error} />

      <div>
        <Link
          href="/courses"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-teal-700"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to all courses
        </Link>
      </div>

      <Card className={`border-l-4 ${course.borderClass}`}>
        <CardContent className="p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-md border px-2.5 py-0.5 text-xs font-semibold ${course.badgeClass}`}
                >
                  {course.code}
                </span>
                <Badge variant="secondary">Winter 2026</Badge>
                {course.isLab && <Badge variant="outline">Lab / Project</Badge>}
              </div>
              <h1 className="mt-2.5 flex items-center gap-2 text-2xl font-bold text-slate-900">
                <BookOpen className="h-6 w-6 text-teal-700" />
                {course.name}
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Course overview and dynamically filtered Notion records for {course.code}.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 rounded-xl bg-slate-50 px-4 py-3 text-center">
              <div>
                <p className="text-lg font-bold text-slate-900">
                  {detail.quizzes.length + detail.assignments.length}
                </p>
                <p className="text-[11px] text-slate-500">Assessments</p>
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900">
                  {detail.notes.length + detail.resources.length}
                </p>
                <p className="text-[11px] text-slate-500">Materials</p>
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900">
                  {detail.classLogs.length}
                </p>
                <p className="text-[11px] text-slate-500">Classes</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <CourseDetailTabs
        announcements={detail.announcements}
        quizzes={detail.quizzes}
        assignments={detail.assignments}
        notes={detail.notes}
        resources={detail.resources}
        playlists={detail.playlists}
        classLogs={detail.classLogs}
      />
    </div>
  );
}
