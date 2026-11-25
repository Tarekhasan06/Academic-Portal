import type { Metadata } from "next";
import { SetupBanner } from "@/components/layout/SetupBanner";
import { CourseCard } from "@/components/courses/CourseCard";
import { PageHead } from "@/components/wallet/primitives";
import { getDashboardSnapshot } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Courses",
  description: "Every Winter 2026 IPE course with its open legs and next due date.",
};

export const revalidate = 300;

export default async function CoursesPage() {
  const snapshot = await getDashboardSnapshot();
  const theory = snapshot.courseSummaries.filter((s) => !s.course.isLab);
  const labs = snapshot.courseSummaries.filter((s) => s.course.isLab);

  return (
    <div className="space-y-8">
      <SetupBanner configured={snapshot.configured} error={snapshot.error} />
      <PageHead
        title="Courses"
        description="One boarding pass per course. Open a pass for its quizzes, assignments, notes, resources and class log."
      />

      {[
        { title: "Theory", list: theory },
        { title: "Labs & projects", list: labs },
      ].map(
        (group) =>
          group.list.length > 0 && (
            <section key={group.title} aria-label={group.title}>
              <h2 className="caps mb-3 flex items-baseline gap-2 text-[17px] tracking-[0.1em] text-navy">
                <span aria-hidden className="text-jet tracking-[-0.12em]">{"///"}</span>
                {group.title}
                <span className="font-mono text-[13px] font-bold tracking-normal text-carbon">
                  {group.list.length}
                </span>
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {group.list.map((summary) => (
                  <CourseCard key={summary.course.code} summary={summary} />
                ))}
              </div>
            </section>
          )
      )}
    </div>
  );
}
