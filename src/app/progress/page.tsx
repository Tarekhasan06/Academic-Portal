import type { Metadata } from "next";
import { SetupBanner } from "@/components/layout/SetupBanner";
import { ProgressClient } from "@/components/progress/ProgressClient";
import { getDashboardSnapshot } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Class Progress",
  description:
    "Chronological class history, topics covered, and course progress from Notion Class Log records.",
};

export const revalidate = 300;

export default async function ProgressPage() {
  const snapshot = await getDashboardSnapshot();
  const classLogs = snapshot.records.filter((r) => r.category === "class-log");

  return (
    <div className="space-y-6">
      <SetupBanner configured={snapshot.configured} error={snapshot.error} />

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Class Progress & History
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Track topics covered, lecture history, and course completion using Notion Class Log records.
        </p>
      </div>

      <ProgressClient
        logs={classLogs}
        summaries={snapshot.courseSummaries}
      />
    </div>
  );
}
