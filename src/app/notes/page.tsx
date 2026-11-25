import type { Metadata } from "next";
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

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Class Notes Library
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Browse lecture notes by course, date, and covered topics.
        </p>
      </div>

      <NotesClient notes={notes} courses={courses} />
    </div>
  );
}
