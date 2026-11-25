import type { Metadata } from "next";
import { SetupBanner } from "@/components/layout/SetupBanner";
import { CalendarClient } from "@/components/calendar/CalendarClient";
import { getPortalData } from "@/lib/notion";
import { getAllCoursesFromRecords } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Academic Calendar",
  description:
    "Interactive monthly and weekly academic calendar for Winter 2026 quizzes, assignments, and events.",
};

export const revalidate = 300;

export default async function CalendarPage() {
  const data = await getPortalData();
  const courses = getAllCoursesFromRecords(data.records);

  return (
    <div className="space-y-6">
      <SetupBanner configured={data.configured} error={data.error} />

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Academic Calendar
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Monthly and weekly view of quiz dates, assignment deadlines, and academic events from Notion.
        </p>
      </div>

      <CalendarClient records={data.records} courses={courses} />
    </div>
  );
}
