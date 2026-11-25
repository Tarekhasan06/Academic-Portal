import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  parseISO,
  startOfMonth,
  startOfWeek,
} from "date-fns";

/**
 * All academic dates belong to Dhaka. The server (Vercel) runs in UTC, so
 * every display and day-difference is computed in Asia/Dhaka explicitly;
 * that keeps "08:00" quizzes reading 08:00 and keeps server and browser
 * renders identical.
 */
export const PORTAL_TZ = "Asia/Dhaka";

export function parseDateSafe(value: string | null | undefined): Date | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  try {
    const parsed = parseISO(trimmed);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  } catch {
    // fallback below
  }
  const fallback = new Date(trimmed);
  return Number.isNaN(fallback.getTime()) ? null : fallback;
}

/** True when the Notion value carries a clock time, not just a day. */
export function hasTime(value: string | null | undefined): boolean {
  return Boolean(value && /T\d{2}:\d{2}/.test(value));
}

/** "2026-11-27" for the Dhaka calendar day a date falls on. */
export function dhakaDayKey(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: PORTAL_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

/** Day key for a Notion value; date-only strings are taken literally. */
export function recordDayKey(value: string | null | undefined): string | null {
  if (!value) return null;
  const v = value.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
  const parsed = parseDateSafe(v);
  return parsed ? dhakaDayKey(parsed) : null;
}

function keyToUtcMs(key: string): number {
  const [y, m, d] = key.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
}

function intl(value: string | null | undefined, opts: Intl.DateTimeFormatOptions): string | null {
  if (!value) return null;
  const v = value.trim();
  // Date-only values are calendar days; render them as such in UTC to avoid drift.
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) {
    return new Intl.DateTimeFormat("en-GB", { ...opts, timeZone: "UTC" }).format(
      new Date(keyToUtcMs(v))
    );
  }
  const parsed = parseDateSafe(v);
  if (!parsed) return null;
  return new Intl.DateTimeFormat("en-GB", { ...opts, timeZone: PORTAL_TZ }).format(parsed);
}

/** "THU 27 NOV" — the coupon date field. */
export function formatCouponDate(value: string | null | undefined): string {
  const out = intl(value, { weekday: "short", day: "2-digit", month: "short" });
  return out ? out.replace(",", "").toUpperCase() : "TBA";
}

/** "27 Nov 2026" */
export function formatDisplayDate(value: string | null | undefined): string {
  return intl(value, { day: "numeric", month: "short", year: "numeric" }) ?? "No date";
}

/** "27 Nov" */
export function formatShortDate(value: string | null | undefined): string {
  return intl(value, { day: "numeric", month: "short" }) ?? "No date";
}

/** "08:00", or null when the value is a day without a time. */
export function formatTime(value: string | null | undefined): string | null {
  if (!hasTime(value)) return null;
  return intl(value, { hour: "2-digit", minute: "2-digit", hour12: false });
}

/** "November 2026" style month heading for grouping. */
export function formatMonthHeading(value: string | null | undefined): string | null {
  return intl(value, { month: "long", year: "numeric" });
}

export function todayKey(now: Date = new Date()): string {
  return dhakaDayKey(now);
}

/** Calendar days from today (Dhaka) to the record's day. */
export function getDaysRemaining(
  value: string | null | undefined,
  now: Date = new Date()
): number | null {
  const key = recordDayKey(value);
  if (!key) return null;
  return Math.round((keyToUtcMs(key) - keyToUtcMs(todayKey(now))) / 86_400_000);
}

export type Countdown = {
  /** "D-03", "D-DAY", "D+02", "TBA" */
  code: string;
  /** "Tomorrow", "In 5 days", "2 days late", "Date to be announced" */
  caption: string;
  days: number | null;
  urgent: boolean;
  overdue: boolean;
};

export function getCountdown(
  dateStr: string | null | undefined,
  notionCountdown?: string | number | null
): Countdown {
  const days = getDaysRemaining(dateStr);
  if (days === null) {
    const fallback =
      notionCountdown !== null && notionCountdown !== undefined && String(notionCountdown).trim()
        ? String(notionCountdown)
        : "Date to be announced";
    return { code: "TBA", caption: fallback, days: null, urgent: false, overdue: false };
  }
  if (days < 0) {
    const n = Math.abs(days);
    return {
      code: `D+${String(n).padStart(2, "0")}`,
      caption: n === 1 ? "1 day late" : `${n} days late`,
      days,
      urgent: true,
      overdue: true,
    };
  }
  if (days === 0) {
    return { code: "D-DAY", caption: "Today", days, urgent: true, overdue: false };
  }
  return {
    code: `D-${String(days).padStart(2, "0")}`,
    caption: days === 1 ? "Tomorrow" : `In ${days} days`,
    days,
    urgent: days <= 2,
    overdue: false,
  };
}

export function isUpcomingDate(value: string | null | undefined, withinDays?: number): boolean {
  const days = getDaysRemaining(value);
  if (days === null || days < 0) return false;
  if (typeof withinDays === "number") return days <= withinDays;
  return true;
}

export function isDatePast(value: string | null | undefined): boolean {
  const days = getDaysRemaining(value);
  return days !== null && days < 0;
}

export function getMonthCalendarDays(referenceDate: Date): Date[] {
  const start = startOfWeek(startOfMonth(referenceDate), { weekStartsOn: 0 });
  const end = endOfWeek(endOfMonth(referenceDate), { weekStartsOn: 0 });
  return eachDayOfInterval({ start, end });
}

export function getWeekCalendarDays(referenceDate: Date): Date[] {
  const start = startOfWeek(referenceDate, { weekStartsOn: 0 });
  const end = endOfWeek(referenceDate, { weekStartsOn: 0 });
  return eachDayOfInterval({ start, end });
}

/** Local calendar key for a calendar cell built in the browser. */
export function localDayKey(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export { isSameDay, isSameMonth, isToday, format };
