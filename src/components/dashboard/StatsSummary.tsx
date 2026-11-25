import {
  CheckCircle2,
  ClipboardList,
  Clock,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function StatsSummary({
  pendingCount,
  completedCount,
  upcomingQuizzesCount,
  upcomingAssignmentsCount,
  completionRate,
}: {
  pendingCount: number;
  completedCount: number;
  upcomingQuizzesCount: number;
  upcomingAssignmentsCount: number;
  completionRate: number;
}) {
  const stats = [
    {
      label: "Pending Tasks",
      value: pendingCount,
      hint: `${upcomingQuizzesCount} quizzes • ${upcomingAssignmentsCount} assignments`,
      icon: Clock,
      accent: "bg-amber-50 text-amber-700",
    },
    {
      label: "Completed Tasks",
      value: completedCount,
      hint: "Marked Done in Notion",
      icon: CheckCircle2,
      accent: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Upcoming Quizzes",
      value: upcomingQuizzesCount,
      hint: "Scheduled assessments",
      icon: ClipboardList,
      accent: "bg-sky-50 text-sky-700",
    },
    {
      label: "Academic Progress",
      value: `${completionRate}%`,
      hint: "Task completion rate",
      icon: TrendingUp,
      accent: "bg-teal-50 text-teal-700",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.label}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium text-slate-500">
                    {item.label}
                  </p>
                  <p className="mt-1.5 text-2xl font-bold text-slate-900">
                    {item.value}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">{item.hint}</p>
                </div>
                <div className={`rounded-xl p-2.5 ${item.accent}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
