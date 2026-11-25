import type { Metadata } from "next";
import { PageHead } from "@/components/wallet/primitives";
import { SetupBanner } from "@/components/layout/SetupBanner";
import { CalendarClient } from "@/components/calendar/CalendarClient";
import { getPortalData } from "@/lib/notion";
import { getAllCoursesFromRecords } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Calendar",
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

      <PageHead
        title="Calendar"
        description="Quizzes, deadlines and notices by day. Tap a date to see what lands on it."
      />

      <CalendarClient records={data.records} courses={courses} />
    </div>
  );
}
