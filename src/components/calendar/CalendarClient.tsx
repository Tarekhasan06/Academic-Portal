"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  addMonths,
  addWeeks,
  subMonths,
  subWeeks,
} from "date-fns";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  X,
} from "lucide-react";
import type { AcademicRecord, CourseInfo } from "@/types/academic";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import {
  format,
  formatDisplayDate,
  getMonthCalendarDays,
  getWeekCalendarDays,
  isSameDay,
  isSameMonth,
  isToday,
  parseDateSafe,
} from "@/lib/dates";
import { cn, getCourseStyle, getStatusBadgeClass } from "@/lib/utils";

export function CalendarClient({
  records,
  courses,
}: {
  records: AcademicRecord[];
  courses: CourseInfo[];
}) {
  const [view, setView] = useState<"month" | "week">("month");
  const [cursorDate, setCursorDate] = useState<Date>(() => new Date());
  const [courseFilter, setCourseFilter] = useState("ALL");
  const [selectedEvent, setSelectedEvent] = useState<AcademicRecord | null>(null);

  const scheduledRecords = useMemo(() => {
    return records.filter((r) => {
      if (!parseDateSafe(r.date)) return false;
      if (courseFilter !== "ALL" && r.course !== courseFilter) return false;
      return true;
    });
  }, [records, courseFilter]);

  const days = useMemo(() => {
    return view === "month"
      ? getMonthCalendarDays(cursorDate)
      : getWeekCalendarDays(cursorDate);
  }, [view, cursorDate]);

  const navigatePrev = () => {
    setCursorDate((d) => (view === "month" ? subMonths(d, 1) : subWeeks(d, 1)));
  };

  const navigateNext = () => {
    setCursorDate((d) => (view === "month" ? addMonths(d, 1) : addWeeks(d, 1)));
  };

  const upcomingEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return [...scheduledRecords]
      .filter((r) => {
        const d = parseDateSafe(r.date);
        return d ? d.getTime() >= today.getTime() : false;
      })
      .sort((a, b) => {
        const da = parseDateSafe(a.date)?.getTime() ?? 0;
        const db = parseDateSafe(b.date)?.getTime() ?? 0;
        return da - db;
      })
      .slice(0, 8);
  }, [scheduledRecords]);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        <Card>
          <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={navigatePrev} aria-label="Previous">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCursorDate(new Date())}>
                Today
              </Button>
              <Button variant="outline" size="icon" onClick={navigateNext} aria-label="Next">
                <ChevronRight className="h-4 w-4" />
              </Button>
              <h2 className="ml-2 text-base font-semibold text-slate-900">
                {format(cursorDate, "MMMM yyyy")}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <Select
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                aria-label="Filter calendar by course"
              >
                <option value="ALL">All Courses</option>
                {courses.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code}
                  </option>
                ))}
              </Select>

              <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5">
                <button
                  type="button"
                  onClick={() => setView("month")}
                  className={cn(
                    "rounded-md px-3 py-1 text-xs font-medium cursor-pointer",
                    view === "month" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600"
                  )}
                >
                  Month
                </button>
                <button
                  type="button"
                  onClick={() => setView("week")}
                  className={cn(
                    "rounded-md px-3 py-1 text-xs font-medium cursor-pointer",
                    view === "week" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600"
                  )}
                >
                  Week
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 text-center text-xs font-semibold text-slate-500">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((dayName) => (
              <div key={dayName} className="py-2.5">
                {dayName}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 divide-x divide-y divide-slate-200/80">
            {days.map((day) => {
              const dayEvents = scheduledRecords.filter((r) => {
                const parsed = parseDateSafe(r.date);
                return parsed ? isSameDay(parsed, day) : false;
              });
              const inCurrentMonth = isSameMonth(day, cursorDate);
              const today = isToday(day);

              return (
                <div
                  key={day.toISOString()}
                  className={cn(
                    "min-h-[96px] p-1.5 sm:min-h-[112px] sm:p-2",
                    !inCurrentMonth && view === "month" ? "bg-slate-50/70 text-slate-400" : "bg-white"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={cn(
                        "inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium",
                        today ? "bg-teal-700 text-white" : "text-slate-700"
                      )}
                    >
                      {format(day, "d")}
                    </span>
                  </div>

                  <div className="mt-1.5 space-y-1">
                    {dayEvents.slice(0, 3).map((ev) => {
                      const style = getCourseStyle(ev.course);
                      return (
                        <button
                          key={ev.id}
                          type="button"
                          onClick={() => setSelectedEvent(ev)}
                          className={`block w-full truncate rounded border px-1.5 py-0.5 text-left text-[11px] font-medium cursor-pointer ${style.badgeClass}`}
                          title={`${ev.course}: ${ev.title}`}
                        >
                          {ev.title}
                        </button>
                      );
                    })}
                    {dayEvents.length > 3 && (
                      <p className="px-1 text-[10px] font-medium text-slate-500">
                        +{dayEvents.length - 3} more
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        {selectedEvent && (
          <Card className="border-teal-200 bg-teal-50/30">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Event Details</CardTitle>
              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
                aria-label="Close event details"
              >
                <X className="h-4 w-4" />
              </button>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex flex-wrap gap-1.5">
                <Link
                  href={`/courses/${getCourseStyle(selectedEvent.course).slug}`}
                  className={`rounded-md border px-2 py-0.5 text-xs font-semibold ${
                    getCourseStyle(selectedEvent.course).badgeClass
                  }`}
                >
                  {selectedEvent.course}
                </Link>
                <Badge variant="secondary">{selectedEvent.type}</Badge>
                <span
                  className={`rounded-full border px-2 py-0.5 text-xs font-medium ${getStatusBadgeClass(
                    selectedEvent.status
                  )}`}
                >
                  {selectedEvent.status}
                </span>
              </div>
              <p className="font-semibold text-slate-900">{selectedEvent.title}</p>
              <p className="text-xs text-slate-600">
                Date: {formatDisplayDate(selectedEvent.date)}
              </p>
              {selectedEvent.topics.length > 0 && (
                <p className="text-xs text-slate-600">
                  Topics: {selectedEvent.topics.join(", ")}
                </p>
              )}
              {selectedEvent.marks !== null && (
                <p className="text-xs text-slate-600">
                  Marks: {selectedEvent.marks}
                </p>
              )}
              {selectedEvent.link && (
                <a
                  href={selectedEvent.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-teal-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-teal-800"
                >
                  Open Link
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CalendarDays className="h-4 w-4 text-teal-700" />
              Upcoming Deadlines & Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingEvents.length === 0 ? (
              <p className="text-xs text-slate-500">
                No upcoming dated records found in Notion.
              </p>
            ) : (
              <ul className="space-y-2.5">
                {upcomingEvents.map((ev) => {
                  const style = getCourseStyle(ev.course);
                  return (
                    <li key={ev.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedEvent(ev)}
                        className="w-full rounded-xl border border-slate-200/80 p-3 text-left transition-colors hover:bg-slate-50 cursor-pointer"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`rounded-md border px-1.5 py-0.5 text-[11px] font-medium ${style.badgeClass}`}
                          >
                            {ev.course}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            {formatDisplayDate(ev.date, "MMM d")}
                          </span>
                        </div>
                        <p className="mt-1.5 truncate text-xs font-semibold text-slate-900">
                          {ev.title}
                        </p>
                        <p className="mt-0.5 text-[11px] text-slate-500">
                          {ev.type} • {ev.status}
                        </p>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
