import type { Metadata } from "next";
import { PageHead } from "@/components/wallet/primitives";
import { SetupBanner } from "@/components/layout/SetupBanner";
import { NotesClient } from "@/components/notes/NotesClient";
import { getPortalData } from "@/lib/notion";
import { getAllCoursesFromRecords } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Class Notes",
  description: "Course-organized class notes library for Winter 2026.",
};

export const revalidate = 300;

export default async function NotesPage() {
  const data = await getPortalData();
  const notes = data.records.filter((r) => r.category === "note");
  const courses = getAllCoursesFromRecords(data.records);

  return (
    <div className="space-y-6">
      <SetupBanner configured={data.configured} error={data.error} />

      <PageHead
        title="Class notes"
        description="Lecture notes and Drive folders from the board, by course and date, with who noted them."
      />

      <NotesClient notes={notes} courses={courses} />
    </div>
  );
}
