"use client";

import { useMemo, useState } from "react";
import { addMonths, addWeeks, subMonths, subWeeks } from "date-fns";
import { CalendarX2, ChevronLeft, ChevronRight } from "lucide-react";
import type { AcademicRecord, CourseInfo } from "@/types/academic";
import { LegRow } from "@/components/wallet/coupons";
import {
  EmptyTicket,
  SectionHead,
  SelectField,
  btn,
} from "@/components/wallet/primitives";
import {
  format,
  getMonthCalendarDays,
  getWeekCalendarDays,
  isSameMonth,
  localDayKey,
  recordDayKey,
  todayKey,
} from "@/lib/dates";
import { cn, getCourseStyle } from "@/lib/utils";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function keyToLocalDate(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function CalendarClient({
  records,
  courses,
}: {
  records: AcademicRecord[];
  courses: CourseInfo[];
}) {
  const today = todayKey();
  const [view, setView] = useState<"month" | "week">("month");
  const [cursor, setCursor] = useState<Date>(() => keyToLocalDate(today));
  const [selected, setSelected] = useState<string>(today);
  const [courseFilter, setCourseFilter] = useState("ALL");

  const byDay = useMemo(() => {
    const map = new Map<string, AcademicRecord[]>();
    for (const r of records) {
      if (courseFilter !== "ALL" && r.course !== courseFilter) continue;
      if (r.category === "playlist" || r.category === "resource") continue;
      const key = recordDayKey(r.date);
      if (!key) continue;
      const list = map.get(key) ?? [];
      list.push(r);
      map.set(key, list);
    }
    return map;
  }, [records, courseFilter]);

  const days = useMemo(
    () => (view === "month" ? getMonthCalendarDays(cursor) : getWeekCalendarDays(cursor)),
    [view, cursor]
  );

  const upcoming = useMemo(() => {
    return Array.from(byDay.entries())
      .filter(([k]) => k >= today)
      .sort(([a], [b]) => a.localeCompare(b))
      .flatMap(([, list]) => list)
      .filter((r) => r.status !== "Done")
      .slice(0, 6);
  }, [byDay, today]);

  const step = (dir: 1 | -1) =>
    setCursor((d) =>
      view === "month"
        ? dir === 1
          ? addMonths(d, 1)
          : subMonths(d, 1)
        : dir === 1
          ? addWeeks(d, 1)
          : subWeeks(d, 1)
    );

  const selectedItems = byDay.get(selected) ?? [];
  const selectedDate = keyToLocalDate(selected);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px] lg:gap-8">
      <div className="min-w-0 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => step(-1)}
              className={cn(btn.base, btn.secondary, btn.icon)}
              aria-label={view === "month" ? "Previous month" : "Previous week"}
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />
            </button>
            <button
              type="button"
              onClick={() => {
                setCursor(keyToLocalDate(today));
                setSelected(today);
              }}
              className={cn(btn.base, btn.secondary, btn.md)}
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              className={cn(btn.base, btn.secondary, btn.icon)}
              aria-label={view === "month" ? "Next month" : "Next week"}
            >
              <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
            </button>
            <h2 className="caps ml-2 text-[22px] font-bold tracking-[0.06em] text-navy" aria-live="polite">
              {format(cursor, "MMMM yyyy")}
            </h2>
          </div>

          <div className="flex w-full items-center gap-2 sm:w-auto">
            <SelectField
              label="Filter by course"
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="flex-1 sm:w-40 sm:flex-none"
            >
              <option value="ALL">All courses</option>
              {courses.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code}
                </option>
              ))}
            </SelectField>
            <div role="group" aria-label="Calendar view" className="flex rounded-[4px] border-[1.5px] border-navy p-0.5">
              {(["month", "week"] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  aria-pressed={view === v}
                  onClick={() => setView(v)}
                  className={cn(
                    "caps h-8 rounded-[2px] px-3 text-[13px] tracking-[0.12em] cursor-pointer",
                    view === v ? "bg-navy text-white" : "text-navy hover:bg-navy/5"
                  )}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-hidden ticket">
          <div className="caps grid grid-cols-7 bg-navy text-center text-[12px] tracking-[0.14em] text-white/80">
            {WEEKDAYS.map((d) => (
              <div key={d} className="py-2">
                <span className="sm:hidden">{d[0]}</span>
                <span className="hidden sm:inline">{d}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {days.map((day) => {
              const key = localDayKey(day);
              const items = byDay.get(key) ?? [];
              const inMonth = view === "week" || isSameMonth(day, cursor);
              const isToday = key === today;
              const isSelected = key === selected;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelected(key)}
                  aria-pressed={isSelected}
                  aria-label={`${format(day, "EEEE d MMMM")}, ${items.length} ${items.length === 1 ? "item" : "items"}`}
                  className={cn(
                    "relative flex flex-col items-stretch border-r border-b border-hair p-1 text-left transition-colors cursor-pointer sm:p-1.5",
                    view === "month" ? "min-h-[58px] sm:min-h-[104px]" : "min-h-[120px] sm:min-h-[180px]",
                    !inMonth && "bg-stock/70 text-ink-3",
                    isSelected ? "bg-lilac-2 outline-2 -outline-offset-2 outline-carbon" : "hover:bg-stock"
                  )}
                >
                  <span
                    className={cn(
                      "grid h-6 w-6 place-items-center self-start rounded-[3px] font-mono text-[12.5px] font-bold",
                      isToday ? "bg-jet text-white" : inMonth ? "text-navy" : "text-ink-3"
                    )}
                  >
                    {format(day, "d")}
                  </span>

                  {/* Phones: one square per item in its course colour. */}
                  {items.length > 0 && (
                    <span className="mt-1 flex flex-wrap gap-[3px] sm:hidden">
                      {items.slice(0, 4).map((r) => (
                        <span
                          key={r.id}
                          className="h-1.5 w-1.5 rounded-[1px]"
                          style={{ backgroundColor: getCourseStyle(r.course).color }}
                        />
                      ))}
                    </span>
                  )}

                  {/* Larger screens: titled chips. */}
                  <span className="mt-1 hidden space-y-1 sm:block">
                    {items.slice(0, view === "week" ? 6 : 2).map((r) => (
                      <span
                        key={r.id}
                        className={cn(
                          "block truncate rounded-[3px] px-1.5 py-0.5 text-[12px] leading-tight text-white",
                          r.status === "Done" && "line-through opacity-60"
                        )}
                        style={{ backgroundColor: getCourseStyle(r.course).color }}
                      >
                        {r.title}
                      </span>
                    ))}
                    {items.length > (view === "week" ? 6 : 2) && (
                      <span className="caps block px-1 text-[11px] tracking-[0.12em] text-ink-2">
                        +{items.length - (view === "week" ? 6 : 2)} more
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <section aria-label="Selected day">
          <SectionHead title={format(selectedDate, "EEE d MMM")} count={selectedItems.length} />
          {selectedItems.length === 0 ? (
            <EmptyTicket
              className="mt-3 py-8"
              icon={CalendarX2}
              title="Nothing on this day"
              description="Pick another date, or check the upcoming legs below."
            />
          ) : (
            <ul className="mt-3 space-y-2">
              {selectedItems.map((r) => (
                <LegRow key={r.id} record={r} />
              ))}
            </ul>
          )}
        </section>

        <section aria-label="Upcoming">
          <SectionHead title="Coming up" count={upcoming.length} />
          {upcoming.length === 0 ? (
            <p className="mt-3 text-[14px] text-ink-2">No dated legs ahead on the board.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {upcoming.map((r) => (
                <LegRow key={r.id} record={r} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
