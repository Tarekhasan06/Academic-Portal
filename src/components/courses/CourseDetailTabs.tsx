"use client";

import { useState } from "react";
import { Inbox } from "lucide-react";
import type { AcademicRecord } from "@/types/academic";
import { EntryCoupon, LegRow } from "@/components/wallet/coupons";
import { EmptyTicket, TabCaps } from "@/components/wallet/primitives";

type TabKey =
  | "quizzes"
  | "assignments"
  | "announcements"
  | "notes"
  | "resources"
  | "playlists"
  | "progress";

const LEG_TABS: TabKey[] = ["quizzes", "assignments"];

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
  const map: Record<TabKey, AcademicRecord[]> = {
    quizzes,
    assignments,
    announcements,
    notes,
    resources,
    playlists,
    progress: classLogs,
  };
  const tabs: { key: TabKey; label: string; count: number }[] = [
    { key: "quizzes", label: "Quizzes", count: quizzes.length },
    { key: "assignments", label: "Assignments", count: assignments.length },
    { key: "announcements", label: "Notices", count: announcements.length },
    { key: "notes", label: "Notes", count: notes.length },
    { key: "resources", label: "Resources", count: resources.length },
    { key: "playlists", label: "Playlists", count: playlists.length },
    { key: "progress", label: "Class log", count: classLogs.length },
  ];
  const firstWithItems = tabs.find((t) => t.count > 0)?.key ?? "quizzes";
  const [active, setActive] = useState<TabKey>(firstWithItems);
  const items = map[active];
  const label = tabs.find((t) => t.key === active)?.label ?? "";

  return (
    <section className="space-y-4" aria-label="Course records">
      <TabCaps tabs={tabs} value={active} onChange={setActive} label="Course records" />

      <div role="tabpanel" aria-label={label}>
        {items.length === 0 ? (
          <EmptyTicket
            icon={Inbox}
            title={`No ${label.toLowerCase()} yet`}
            description="Anything posted to the board for this course with this type shows up here on the next sync."
          />
        ) : LEG_TABS.includes(active) || active === "announcements" ? (
          <ul className="space-y-2">
            {items.map((r, i) => (
              <LegRow
                key={r.id}
                record={r}
                showCourse={false}
                showDetails
                stampDelay={Math.min(i * 60, 240)}
              />
            ))}
          </ul>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((r) => (
              <EntryCoupon
                key={r.id}
                record={r}
                kind={label}
                action={active === "playlists" ? "Watch" : "Open"}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
