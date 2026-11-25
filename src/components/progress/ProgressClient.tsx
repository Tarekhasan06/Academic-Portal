"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Route } from "lucide-react";
import type { AcademicRecord, CourseSummary } from "@/types/academic";
import {
  CourseTab,
  EmptyTicket,
  OpenLink,
  SectionHead,
  SelectField,
} from "@/components/wallet/primitives";
import { formatCouponDate, parseDateSafe } from "@/lib/dates";
import { getCourseStyle } from "@/lib/utils";

export function ProgressClient({
  logs,
  summaries,
}: {
  logs: AcademicRecord[];
  summaries: CourseSummary[];
}) {
  const [courseFilter, setCourseFilter] = useState("ALL");

  const filteredLogs = useMemo(
    () =>
      logs
        .filter((l) => courseFilter === "ALL" || l.course === courseFilter)
        .sort(
          (a, b) =>
            (parseDateSafe(b.date)?.getTime() ?? 0) - (parseDateSafe(a.date)?.getTime() ?? 0)
        ),
    [logs, courseFilter]
  );

  return (
    <div className="space-y-10">
      <section aria-label="Progress by course">
        <SectionHead title="Legs flown by course" />
        <ul className="mt-3 divide-y divide-hair overflow-hidden ticket">
          {summaries.map(({ course, classLogsCount, completedCount, pendingCount }) => {
            const total = completedCount + pendingCount;
            return (
              <li key={course.code}>
                <Link
                  href={`/courses/${course.slug}`}
                  className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-2 px-4 py-3 transition-colors hover:bg-stock md:grid-cols-[96px_1fr_280px_110px]"
                >
                  <CourseTab course={course} size="sm" />
                  <span className="truncate text-[15px] font-medium text-navy">{course.shortName}</span>
                  <span
                    className="col-span-2 flex h-4 gap-[3px] md:col-span-1"
                    role="img"
                    aria-label={`${completedCount} of ${total} tasks done`}
                  >
                    {total === 0 ? (
                      <span className="caps text-[11.5px] tracking-[0.14em] text-ink-3">No tasks yet</span>
                    ) : (
                      Array.from({ length: total }).map((_, i) => (
                        <span
                          key={i}
                          className="max-w-8 flex-1 rounded-[1px]"
                          style={
                            i < completedCount
                              ? { backgroundColor: course.color }
                              : { boxShadow: `inset 0 0 0 1.5px ${course.color}55` }
                          }
                        />
                      ))
                    )}
                  </span>
                  <span className="col-span-2 text-[13px] text-ink-2 md:col-span-1 md:text-right">
                    <span className="carbon text-[13px]">
                      {completedCount}/{total}
                    </span>{" "}
                    done · <span className="carbon text-[13px]">{classLogsCount}</span> classes
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-label="Class log">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <SectionHead title="Class log" count={filteredLogs.length} />
          <SelectField
            label="Filter class log by course"
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="w-44"
          >
            <option value="ALL">All courses</option>
            {summaries.map(({ course }) => (
              <option key={course.code} value={course.code}>
                {course.code}
              </option>
            ))}
          </SelectField>
        </div>

        {filteredLogs.length === 0 ? (
          <EmptyTicket
            className="mt-3"
            icon={Route}
            title="No class log yet"
            description="Each Class Log entry on the board becomes a stop on this itinerary, newest first."
          />
        ) : (
          <ol className="relative mt-4 space-y-3 pl-7 before:absolute before:top-2 before:bottom-2 before:left-[9px] before:border-l-2 before:border-dashed before:border-dash">
            {filteredLogs.map((log) => {
              const course = getCourseStyle(log.course);
              return (
                <li key={log.id} className="relative">
                  <span
                    aria-hidden
                    className="absolute top-4 -left-[25px] h-3.5 w-3.5 rounded-[2px] ring-4 ring-stock"
                    style={{ backgroundColor: course.color }}
                  />
                  <article className="px-4 py-3 ticket">
                    <div className="flex flex-wrap items-center gap-2">
                      <CourseTab course={course} size="xs" href={`/courses/${course.slug}`} />
                      <span className="carbon text-[12.5px] text-ink-2">{formatCouponDate(log.date)}</span>
                      {log.notedBy && (
                        <span className="text-[13px] text-ink-2">· Noted by {log.notedBy}</span>
                      )}
                    </div>
                    <h3 className="mt-1.5 text-[16px] font-medium text-navy">{log.title}</h3>
                    {log.topics.length > 0 && (
                      <ul className="mt-2 flex flex-wrap gap-1.5">
                        {log.topics.map((t) => (
                          <li key={t} className="rounded-[3px] bg-lilac-2 px-1.5 py-0.5 text-[12.5px] text-carbon">
                            {t}
                          </li>
                        ))}
                      </ul>
                    )}
                    {log.link && <OpenLink href={log.link} className="mt-3" />}
                  </article>
                </li>
              );
            })}
          </ol>
        )}
      </section>
    </div>
  );
}
