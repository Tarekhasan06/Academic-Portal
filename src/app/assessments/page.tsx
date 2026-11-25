import type { Metadata } from "next";
import { SetupBanner } from "@/components/layout/SetupBanner";
import { AssessmentsClient } from "@/components/assessments/AssessmentsClient";
import { getPortalData } from "@/lib/notion";
import { getAllCoursesFromRecords, isAssessmentRecord } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Assessment Center",
  description:
    "Centralized quizzes, assignments, announcements, and syllabus updates for Winter 2026.",
};

export const revalidate = 300;

export default async function AssessmentsPage() {
  const data = await getPortalData();
  const assessmentRecords = data.records.filter(isAssessmentRecord);
  const courses = getAllCoursesFromRecords(data.records);

  return (
    <div className="space-y-6">
      <SetupBanner configured={data.configured} error={data.error} />

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Assessment Center
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Track quizzes, assignments, announcements, and syllabus updates across all courses.
        </p>
      </div>

      <AssessmentsClient records={assessmentRecords} courses={courses} />
    </div>
  );
}
