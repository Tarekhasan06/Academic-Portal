import type { Metadata } from "next";
import { SetupBanner } from "@/components/layout/SetupBanner";
import { PageHead } from "@/components/wallet/primitives";
import { AssessmentsClient } from "@/components/assessments/AssessmentsClient";
import { getPortalData } from "@/lib/notion";
import { getAllCoursesFromRecords, isAssessmentRecord } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Assessments",
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

      <PageHead
        title="Assessments"
        description="Every quiz, assignment and notice on the board. Filter by course or date; done legs keep their USED stamp."
      />

      <AssessmentsClient records={assessmentRecords} courses={courses} />
    </div>
  );
}
