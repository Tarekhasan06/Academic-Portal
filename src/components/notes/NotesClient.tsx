"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpDown, ExternalLink, NotebookPen, Search } from "lucide-react";
import type { AcademicRecord, CourseInfo } from "@/types/academic";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { formatDisplayDate, parseDateSafe } from "@/lib/dates";
import { getCourseStyle } from "@/lib/utils";

export function NotesClient({
  notes,
  courses,
}: {
  notes: AcademicRecord[];
  courses: CourseInfo[];
}) {
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("ALL");
  const [newestFirst, setNewestFirst] = useState(true);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = notes.filter((n) => {
      if (courseFilter !== "ALL" && n.course !== courseFilter) return false;
      if (q) {
        const hay = [
          n.title,
          n.course,
          n.courseName,
          n.notedBy ?? "",
          n.topics.join(" "),
        ]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    return [...list].sort((a, b) => {
      const da = parseDateSafe(a.date ?? a.posted)?.getTime() ?? 0;
      const db = parseDateSafe(b.date ?? b.posted)?.getTime() ?? 0;
      return newestFirst ? db - da : da - db;
    });
  }, [notes, search, courseFilter, newestFirst]);

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-2.5 left-3 h-4 w-4 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search note titles, topics, contributors..."
              className="pl-9"
            />
          </div>

          <Select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            aria-label="Filter notes by course"
          >
            <option value="ALL">All Courses</option>
            {courses.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code}
              </option>
            ))}
          </Select>

          <Button
            type="button"
            variant="outline"
            onClick={() => setNewestFirst((prev) => !prev)}
            className="gap-2"
          >
            <ArrowUpDown className="h-4 w-4" />
            {newestFirst ? "Newest first" : "Oldest first"}
          </Button>
        </CardContent>
      </Card>

      {filtered.length === 0 ? (
        <EmptyState
          title="No class notes found"
          description="Notes tagged as Class Note / Note in your Notion database will appear here."
          icon={NotebookPen}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((note) => {
            const style = getCourseStyle(note.course);
            return (
              <Card key={note.id} className="flex flex-col justify-between">
                <CardContent className="flex h-full flex-col justify-between p-5">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <Link
                        href={`/courses/${style.slug}`}
                        className={`rounded-md border px-2 py-0.5 text-xs font-semibold ${style.badgeClass}`}
                      >
                        {style.code}
                      </Link>
                      <span className="text-xs text-slate-500">
                        {formatDisplayDate(note.date ?? note.posted)}
                      </span>
                    </div>

                    <h2 className="mt-3 text-base font-semibold text-slate-900">
                      {note.title}
                    </h2>

                    {note.topics.length > 0 && (
                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        {note.topics.map((topic) => (
                          <Badge key={topic} variant="secondary">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                    <span className="text-xs text-slate-500">
                      {note.notedBy ? `Noted by ${note.notedBy}` : note.courseName}
                    </span>
                    {note.link && (
                      <a
                        href={note.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-medium text-teal-700 hover:underline"
                      >
                        Open note
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
