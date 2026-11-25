import {
  differenceInCalendarDays,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isPast,
  isSameDay,
  isSameMonth,
  isToday,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";

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

export function formatDisplayDate(
  value: string | null | undefined,
  pattern = "MMM d, yyyy"
): string {
  const parsed = parseDateSafe(value);
  if (!parsed) return "No date";
  return format(parsed, pattern);
}

export function formatShortDate(value: string | null | undefined): string {
  return formatDisplayDate(value, "MMM d");
}

export function getDaysRemaining(value: string | null | undefined): number | null {
  const parsed = parseDateSafe(value);
  if (!parsed) return null;
  return differenceInCalendarDays(startOfDay(parsed), startOfDay(new Date()));
}

export function formatCountdownLabel(
  dateStr: string | null | undefined,
  notionCountdown?: string | number | null
): { label: string; urgent: boolean; overdue: boolean } {
  const days = getDaysRemaining(dateStr);
  if (days !== null) {
    if (days < 0) {
      return {
        label: `${Math.abs(days)}d overdue`,
        urgent: true,
        overdue: true,
      };
    }
    if (days === 0) {
      return { label: "Due today", urgent: true, overdue: false };
    }
    if (days === 1) {
      return { label: "Tomorrow", urgent: true, overdue: false };
    }
    if (days <= 3) {
      return { label: `${days}d left`, urgent: true, overdue: false };
    }
    return { label: `${days}d left`, urgent: false, overdue: false };
  }

  if (notionCountdown !== null && notionCountdown !== undefined && String(notionCountdown).trim() !== "") {
    return {
      label: String(notionCountdown),
      urgent: false,
      overdue: false,
    };
  }

  return { label: "Unscheduled", urgent: false, overdue: false };
}

export function isUpcomingDate(
  value: string | null | undefined,
  withinDays?: number
): boolean {
  const days = getDaysRemaining(value);
  if (days === null) return false;
  if (days < 0) return false;
  if (typeof withinDays === "number") return days <= withinDays;
  return true;
}

export function isDatePast(value: string | null | undefined): boolean {
  const parsed = parseDateSafe(value);
  if (!parsed) return false;
  return isPast(endOfDayFallback(parsed));
}

function endOfDayFallback(date: Date): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
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

export { isSameDay, isSameMonth, isToday, format };
