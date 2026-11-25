import type { Metadata } from "next";
import { PageHead } from "@/components/wallet/primitives";
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

      <PageHead
        title="Class progress"
        description="What each course has covered so far, from the board's class log."
      />

      <ProgressClient
        logs={classLogs}
        summaries={snapshot.courseSummaries}
      />
    </div>
  );
}
