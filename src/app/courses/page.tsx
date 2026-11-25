import type { Metadata } from "next";
import { SetupBanner } from "@/components/layout/SetupBanner";
import { CourseCard } from "@/components/courses/CourseCard";
import { getDashboardSnapshot } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Courses",
  description: "Winter 2026 course directory and per-course summaries.",
};

export const revalidate = 300;

export default async function CoursesPage() {
  const snapshot = await getDashboardSnapshot();

  return (
    <div className="space-y-6">
      <SetupBanner configured={snapshot.configured} error={snapshot.error} />

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Courses — Winter 2026
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Select a course to view announcements, quizzes, assignments, class notes, resources, playlists, and class progress.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {snapshot.courseSummaries.map((summary) => (
          <CourseCard key={summary.course.code} summary={summary} />
        ))}
      </div>
    </div>
  );
}
