"use client";

import { useState } from "react";
import {
  Activity,
  Bell,
  ClipboardCheck,
  ExternalLink,
  FileText,
  FolderOpen,
  NotebookPen,
  PlayCircle,
} from "lucide-react";
import type { AcademicRecord } from "@/types/academic";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { formatCountdownLabel, formatDisplayDate } from "@/lib/dates";
import { cn, getStatusBadgeClass } from "@/lib/utils";

type TabKey =
  | "announcements"
  | "quizzes"
  | "assignments"
  | "notes"
  | "resources"
  | "playlists"
  | "progress";

export function CourseDetailTabs({
  announcements,
  quizzes,
  assignments,
  notes,
  resources,
  playlists,
  classLogs,
}: {
  announcements: AcademicRecord[];
  quizzes: AcademicRecord[];
  assignments: AcademicRecord[];
  notes: AcademicRecord[];
  resources: AcademicRecord[];
  playlists: AcademicRecord[];
  classLogs: AcademicRecord[];
}) {
  const [activeTab, setActiveTab] = useState<TabKey>("quizzes");

  const tabs: {
    key: TabKey;
    label: string;
    count: number;
    icon: typeof Bell;
  }[] = [
    { key: "quizzes", label: "Quizzes", count: quizzes.length, icon: ClipboardCheck },
    { key: "assignments", label: "Assignments", count: assignments.length, icon: FileText },
    { key: "announcements", label: "Announcements", count: announcements.length, icon: Bell },
    { key: "notes", label: "Class Notes", count: notes.length, icon: NotebookPen },
    { key: "resources", label: "Resources", count: resources.length, icon: FolderOpen },
    { key: "playlists", label: "Playlists", count: playlists.length, icon: PlayCircle },
    { key: "progress", label: "Class Progress", count: classLogs.length, icon: Activity },
  ];

  const activeItemsMap: Record<TabKey, AcademicRecord[]> = {
    announcements,
    quizzes,
    assignments,
    notes,
    resources,
    playlists,
    progress: classLogs,
  };

  const items = activeItemsMap[activeTab];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors cursor-pointer sm:text-sm",
                active
                  ? "bg-teal-700 text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[11px]",
                  active ? "bg-teal-800 text-white" : "bg-slate-100 text-slate-600"
                )}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {items.length === 0 ? (
        <EmptyState
          title={`No ${tabs.find((t) => t.key === activeTab)?.label.toLowerCase()} yet`}
          description="Records tagged with this course and type in your Notion database will appear here automatically."
        />
      ) : (
        <div className="grid gap-3">
          {items.map((item) => {
            const countdown = formatCountdownLabel(item.date, item.countdown);
            return (
              <Card key={item.id}>
                <CardContent className="flex flex-col justify-between gap-4 p-4 sm:flex-row sm:items-center">
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary">{item.type}</Badge>
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${getStatusBadgeClass(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                      {item.marks !== null && (
                        <Badge variant="outline">{item.marks} marks</Badge>
                      )}
                      {item.date && (
                        <span className="text-xs text-slate-500">
                          {formatDisplayDate(item.date)}
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-semibold text-slate-900 sm:text-base">
                      {item.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      {item.topics.length > 0 && (
                        <span>Topics: {item.topics.join(", ")}</span>
                      )}
                      {item.notedBy && <span>• Noted by {item.notedBy}</span>}
                      {item.prepBy && <span>• Prep by {item.prepBy}</span>}
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    {(activeTab === "quizzes" || activeTab === "assignments") && (
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-1 text-xs font-semibold",
                          countdown.overdue
                            ? "bg-rose-100 text-rose-700"
                            : countdown.urgent
                              ? "bg-amber-100 text-amber-800"
                              : "bg-slate-100 text-slate-600"
                        )}
                      >
                        {countdown.label}
                      </span>
                    )}
                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-teal-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-teal-800"
                      >
                        Open
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
