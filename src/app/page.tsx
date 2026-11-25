import { SetupBanner } from "@/components/layout/SetupBanner";
import { ActiveCoursesGrid } from "@/components/dashboard/ActiveCoursesGrid";
import { RecentClassLogs } from "@/components/dashboard/RecentClassLogs";
import { SemesterHeader } from "@/components/dashboard/SemesterHeader";
import { StatsSummary } from "@/components/dashboard/StatsSummary";
import { UpcomingList } from "@/components/dashboard/UpcomingList";
import { getDashboardSnapshot } from "@/lib/queries";

export const revalidate = 300;

export default async function DashboardPage() {
  const snapshot = await getDashboardSnapshot();

  return (
    <div className="space-y-6">
      <SetupBanner configured={snapshot.configured} error={snapshot.error} />

      <SemesterHeader
        activeCoursesCount={snapshot.courseSummaries.length}
        totalRecordsCount={snapshot.records.length}
        fetchedAt={snapshot.fetchedAt}
      />

      <StatsSummary
        pendingCount={snapshot.pendingTasks.length}
        completedCount={snapshot.completedTasks.length}
        upcomingQuizzesCount={snapshot.upcomingQuizzes.length}
        upcomingAssignmentsCount={snapshot.upcomingAssignments.length}
        completionRate={snapshot.completionRate}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <UpcomingList
          title="Upcoming Quizzes"
          items={snapshot.upcomingQuizzes}
          emptyTitle="No upcoming quizzes"
          emptyDescription="Upcoming quizzes from Notion will appear here once scheduled."
          viewAllHref="/assessments"
        />
        <UpcomingList
          title="Upcoming Assignments"
          items={snapshot.upcomingAssignments}
          emptyTitle="No upcoming assignments"
          emptyDescription="Pending assignments and lab submissions will appear here."
          viewAllHref="/assessments"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <UpcomingList
          title="Upcoming Events"
          items={snapshot.upcomingEvents}
          emptyTitle="No upcoming events"
          emptyDescription="Academic events, workshops, and seminars from Notion appear here."
          viewAllHref="/calendar"
        />
        <UpcomingList
          title="Pending Tasks"
          items={snapshot.pendingTasks}
          emptyTitle="No pending tasks"
          emptyDescription="All To do and In progress items are clear."
          viewAllHref="/assessments"
        />
      </div>

      <ActiveCoursesGrid summaries={snapshot.courseSummaries} />

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentClassLogs logs={snapshot.recentClassLogs} />
        <UpcomingList
          title="Recently Completed Tasks"
          items={snapshot.completedTasks}
          emptyTitle="No completed tasks yet"
          emptyDescription="Tasks marked Done in Notion will show up here."
          viewAllHref="/assessments"
        />
      </div>
    </div>
  );
}
