"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, FolderOpen, PlayCircle, Search } from "lucide-react";
import type { AcademicRecord, CourseInfo } from "@/types/academic";
import { EntryCoupon } from "@/components/wallet/coupons";
import {
  CourseTab,
  EmptyTicket,
  FilterBar,
  SelectField,
  TabCaps,
  field,
} from "@/components/wallet/primitives";
import { cn, getCourseStyle } from "@/lib/utils";

/** Split "IPE 4513 CAD/CAM/CAE" into a code and a readable name. */
function splitCourseTitle(title: string): { code: string | null; name: string } {
  const m = title.match(/^([A-Za-z]{2,5}\s?\d{4})\s+(.*)$/);
  return m ? { code: m[1].toUpperCase(), name: m[2] } : { code: null, name: title };
}

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

  const resourceTypes = useMemo(
    () => Array.from(new Set(resources.map((r) => r.type))).sort(),
    [resources]
  );
  const allTopics = useMemo(() => {
    const set = new Set<string>();
    for (const r of resources) for (const t of r.topics) set.add(t);
    return Array.from(set).sort();
  }, [resources]);
  const semesters = useMemo(
    () => Array.from(new Set(playlists.map((p) => p.semester).filter(Boolean))).sort(),
    [playlists]
  );

  const q = search.trim().toLowerCase();
  const hay = (item: AcademicRecord) =>
    [item.title, item.course, item.courseName, item.type, item.semester, item.topics.join(" ")]
      .join(" ")
      .toLowerCase();

  const filteredResources = useMemo(
    () =>
      resources.filter((item) => {
        if (courseFilter !== "ALL" && item.course !== courseFilter) return false;
        if (categoryFilter !== "ALL" && item.type !== categoryFilter) return false;
        if (topicFilter !== "ALL" && !item.topics.includes(topicFilter)) return false;
        return !q || hay(item).includes(q);
      }),
    [resources, courseFilter, categoryFilter, topicFilter, q]
  );

  const filteredPlaylists = useMemo(
    () =>
      playlists
        .filter((item) => {
          if (semesterFilter !== "ALL" && item.semester !== semesterFilter) return false;
          if (courseFilter !== "ALL" && item.course !== courseFilter) return false;
          return !q || hay(item).includes(q);
        })
        .sort((a, b) => {
          // This semester's courses first, then alphabetical.
          const ac = a.course && a.course !== "General" ? 0 : 1;
          const bc = b.course && b.course !== "General" ? 0 : 1;
          return ac - bc || a.title.localeCompare(b.title);
        }),
    [playlists, semesterFilter, courseFilter, q]
  );

  return (
    <div className="space-y-5">
      <TabCaps
        label="Resource type"
        value={section}
        onChange={setSection}
        tabs={[
          { key: "resources", label: "Study resources", count: resources.length },
          { key: "playlists", label: "Class playlists", count: playlists.length },
        ]}
      />

      <FilterBar className={section === "resources" ? "grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]" : "grid-cols-2 sm:grid-cols-[2fr_1fr_1fr]"}>
        <label className="relative col-span-2 block lg:col-span-1">
          <span className="sr-only">Search {section}</span>
          <Search
            className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-navy"
            strokeWidth={2.25}
            aria-hidden
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={section === "resources" ? "Search books, questions, folders…" : "Search a course name or code…"}
            className={cn(field, "pl-9")}
          />
        </label>
        <SelectField label="Course" value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)}>
          <option value="ALL">All courses</option>
          {courses.map((c) => (
            <option key={c.code} value={c.code}>
              {c.code}
            </option>
          ))}
        </SelectField>
        {section === "resources" ? (
          <>
            <SelectField label="Category" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="ALL">All categories</option>
              {resourceTypes.map((t) => (
                <option key={t} value={t}>
                  {t.replace(/^[^\p{L}\p{N}]+/u, "")}
                </option>
              ))}
            </SelectField>
            <SelectField label="Topic" value={topicFilter} onChange={(e) => setTopicFilter(e.target.value)}>
              <option value="ALL">All topics</option>
              {allTopics.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </SelectField>
          </>
        ) : (
          <SelectField label="Semester" value={semesterFilter} onChange={(e) => setSemesterFilter(e.target.value)}>
            <option value="ALL">All semesters</option>
            {semesters.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </SelectField>
        )}
      </FilterBar>

      {section === "resources" ? (
        filteredResources.length === 0 ? (
          <EmptyTicket
            icon={FolderOpen}
            title="No study resources found"
            description="Previous questions, books and Drive folders typed Resource on the board appear here."
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {filteredResources.map((item) => (
              <EntryCoupon key={item.id} record={item} kind="Resource" />
            ))}
          </div>
        )
      ) : filteredPlaylists.length === 0 ? (
        <EmptyTicket
          icon={PlayCircle}
          title="No playlists found"
          description="Records typed Playlist on the board appear here, this semester's first."
        />
      ) : (
        <>
          <p className="text-[14px] text-ink-2" aria-live="polite">
            <span className="carbon text-[14px]">{filteredPlaylists.length}</span> playlists
          </p>
          <ul className="grid gap-x-6 overflow-hidden ticket md:grid-cols-2">
            {filteredPlaylists.map((item) => {
              const current = item.course && item.course !== "General";
              const course = getCourseStyle(item.course);
              const { code, name } = splitCourseTitle(item.title);
              const href = item.link ?? item.notionUrl;
              return (
                <li key={item.id} className="border-b border-hair">
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-[56px] items-center gap-3 px-4 py-2 transition-colors hover:bg-stock"
                  >
                    {current ? (
                      <CourseTab course={course} size="xs" />
                    ) : (
                      <span className="caps w-[66px] shrink-0 text-[12px] tracking-[0.1em] text-ink-3">
                        {code ?? "—"}
                      </span>
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[15px] text-navy">{current ? course.name : name}</span>
                      {item.semester && (
                        <span className="caps block text-[11px] tracking-[0.14em] text-ink-3">
                          {item.semester}
                        </span>
                      )}
                    </span>
                    <span className="caps flex shrink-0 items-center gap-1 text-[12px] tracking-[0.14em] text-jet">
                      Watch
                      <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2.25} aria-hidden />
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}
