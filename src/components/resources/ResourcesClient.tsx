"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ExternalLink, FolderKanban, PlayCircle, Search } from "lucide-react";
import type { AcademicRecord, CourseInfo } from "@/types/academic";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { cn, getCourseStyle } from "@/lib/utils";

export function ResourcesClient({
  resources,
  playlists,
  courses,
}: {
  resources: AcademicRecord[];
  playlists: AcademicRecord[];
  courses: CourseInfo[];
}) {
  const [section, setSection] = useState<"resources" | "playlists">("resources");
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [topicFilter, setTopicFilter] = useState("ALL");
  const [semesterFilter, setSemesterFilter] = useState("ALL");

  const resourceTypes = useMemo(() => {
    return Array.from(new Set(resources.map((r) => r.type))).sort();
  }, [resources]);

  const allTopics = useMemo(() => {
    const set = new Set<string>();
    for (const r of resources) {
      for (const t of r.topics) set.add(t);
    }
    return Array.from(set).sort();
  }, [resources]);

  const semesters = useMemo(() => {
    return Array.from(new Set(playlists.map((p) => p.semester))).sort();
  }, [playlists]);

  const filteredResources = useMemo(() => {
    const q = search.trim().toLowerCase();
    return resources.filter((item) => {
      if (courseFilter !== "ALL" && item.course !== courseFilter) return false;
      if (categoryFilter !== "ALL" && item.type !== categoryFilter) return false;
      if (topicFilter !== "ALL" && !item.topics.includes(topicFilter)) return false;
      if (q) {
        const hay = [
          item.title,
          item.course,
          item.courseName,
          item.type,
          item.topics.join(" "),
        ]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [resources, search, courseFilter, categoryFilter, topicFilter]);

  const filteredPlaylists = useMemo(() => {
    const q = search.trim().toLowerCase();
    return playlists.filter((item) => {
      if (semesterFilter !== "ALL" && item.semester !== semesterFilter) return false;
      if (courseFilter !== "ALL" && item.course !== courseFilter) return false;
      if (q) {
        const hay = [
          item.title,
          item.course,
          item.courseName,
          item.semester,
          item.topics.join(" "),
        ]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [playlists, search, semesterFilter, courseFilter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        <button
          type="button"
          onClick={() => setSection("resources")}
          className={cn(
            "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors cursor-pointer",
            section === "resources"
              ? "bg-teal-700 text-white"
              : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
          )}
        >
          <FolderKanban className="h-4 w-4" />
          Study Resources ({resources.length})
        </button>
        <button
          type="button"
          onClick={() => setSection("playlists")}
          className={cn(
            "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors cursor-pointer",
            section === "playlists"
              ? "bg-teal-700 text-white"
              : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
          )}
        >
          <PlayCircle className="h-4 w-4" />
          Online Class Playlists ({playlists.length})
        </button>
      </div>

      <Card>
        <CardContent className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <Search className="pointer-events-none absolute top-2.5 left-3 h-4 w-4 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={
                section === "resources"
                  ? "Search books, questions, Drive links..."
                  : "Search class playlists..."
              }
              className="pl-9"
            />
          </div>

          <Select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            aria-label="Filter by course"
          >
            <option value="ALL">All Courses</option>
            {courses.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code}
              </option>
            ))}
          </Select>

          {section === "resources" ? (
            <>
              <Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                aria-label="Filter by resource type"
              >
                <option value="ALL">All Categories</option>
                {resourceTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </Select>

              <Select
                value={topicFilter}
                onChange={(e) => setTopicFilter(e.target.value)}
                aria-label="Filter by topic"
              >
                <option value="ALL">All Topics</option>
                {allTopics.map((topic) => (
                  <option key={topic} value={topic}>
                    {topic}
                  </option>
                ))}
              </Select>
            </>
          ) : (
            <Select
              value={semesterFilter}
              onChange={(e) => setSemesterFilter(e.target.value)}
              aria-label="Filter playlists by semester"
            >
              <option value="ALL">All Semesters</option>
              {semesters.map((sem) => (
                <option key={sem} value={sem}>
                  {sem}
                </option>
              ))}
            </Select>
          )}
        </CardContent>
      </Card>

      {section === "resources" ? (
        filteredResources.length === 0 ? (
          <EmptyState
            title="No study resources found"
            description="Previous questions, books, Google Drive folders, YouTube links, and study materials from Notion will appear here."
            icon={FolderKanban}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredResources.map((item) => {
              const style = getCourseStyle(item.course);
              return (
                <Card key={item.id} className="flex flex-col justify-between">
                  <CardContent className="flex h-full flex-col justify-between p-5">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          href={`/courses/${style.slug}`}
                          className={`rounded-md border px-2 py-0.5 text-xs font-semibold ${style.badgeClass}`}
                        >
                          {style.code}
                        </Link>
                        <Badge variant="secondary">{item.type}</Badge>
                      </div>
                      <h2 className="mt-3 text-base font-semibold text-slate-900">
                        {item.title}
                      </h2>
                      {item.topics.length > 0 && (
                        <div className="mt-2.5 flex flex-wrap gap-1.5">
                          {item.topics.map((t) => (
                            <Badge key={t} variant="outline">
                              {t}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                      <span className="truncate text-xs text-slate-500">
                        {item.courseName}
                      </span>
                      {item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-teal-700 hover:underline"
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
        )
      ) : filteredPlaylists.length === 0 ? (
        <EmptyState
          title="No online class playlists found"
          description="Items typed as Playlist / Online Class in Notion will appear here grouped by semester."
          icon={PlayCircle}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPlaylists.map((item) => {
            const style = getCourseStyle(item.course);
            return (
              <Card key={item.id} className="flex flex-col justify-between">
                <CardContent className="flex h-full flex-col justify-between p-5">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/courses/${style.slug}`}
                        className={`rounded-md border px-2 py-0.5 text-xs font-semibold ${style.badgeClass}`}
                      >
                        {style.code}
                      </Link>
                      <Badge>{item.semester}</Badge>
                    </div>
                    <h2 className="mt-3 text-base font-semibold text-slate-900">
                      {item.title}
                    </h2>
                    <p className="mt-1 text-xs text-slate-500">
                      {item.courseName}
                    </p>
                  </div>

                  <div className="mt-4 border-t border-slate-100 pt-3">
                    {item.link ? (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-teal-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-teal-800"
                      >
                        Watch Playlist
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    ) : (
                      <span className="text-xs text-slate-400">
                        No external URL attached
                      </span>
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
