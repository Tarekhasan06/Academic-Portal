import type { AcademicRecord } from "@/types/academic";
import {
  formatCouponDate,
  formatShortDate,
  formatTime,
  getCountdown,
} from "@/lib/dates";
import { cn, getCourseStyle } from "@/lib/utils";
import {
  CourseTab,
  DCode,
  FareBox,
  OpenLink,
  Stamp,
  StatusWord,
  recordTypeLabel,
} from "@/components/wallet/primitives";

/* ------------------------------------------------------------------ */
/* The next leg: the big coupon that owns the first viewport.         */
/* ------------------------------------------------------------------ */

export function NextCoupon({
  record,
  index,
  total,
}: {
  record: AcademicRecord;
  index: number;
  total: number;
}) {
  const course = getCourseStyle(record.course);
  const countdown = getCountdown(record.date, record.countdown);
  const time = formatTime(record.date);
  const prep = record.prepBy ? formatShortDate(record.prepBy) : null;

  return (
    <article
      aria-label={`Next due: ${course.code} ${record.title}`}
      className="print-in relative overflow-hidden ticket"
    >
      <header className="flex h-10 items-stretch justify-between bg-navy text-white">
        <span className="flex items-stretch">
          <span className="grid min-w-10 place-items-center bg-navy-2 px-2 font-mono text-[17px] font-bold">
            {index}
          </span>
          <span className="caps flex items-center px-3 text-[13px] tracking-[0.16em]">
            Next leg
          </span>
        </span>
        <span className="flex items-stretch">
          <span className="caps hidden items-center px-3 text-[12px] tracking-[0.16em] text-white/70 sm:flex">
            Coupon {index} of {total}
          </span>
          <span className="caps flex items-center bg-jet px-3 text-[13px] tracking-[0.16em]">
            {recordTypeLabel(record)}
          </span>
        </span>
      </header>

      <div className="px-4 pt-4 sm:px-6">
        <div className="flex items-center gap-2">
          <CourseTab course={course} href={`/courses/${course.slug}`} />
          {course.isLab && (
            <span className="caps text-[11px] tracking-[0.14em] text-ink-3">Lab</span>
          )}
        </div>
        <p className="caps mt-2 text-[30px] leading-[0.98] font-bold tracking-[0.01em] text-navy sm:text-[44px]">
          {course.name}
        </p>
        <h2 className="mt-2 text-[18px] leading-snug font-medium text-navy sm:text-[20px]">
          {record.title}
        </h2>
      </div>

      <div className="mx-4 mt-4 grid grid-cols-[1.35fr_1fr_0.8fr] border-y-[1.5px] border-navy sm:mx-6">
        <FareBox label="Date" className="py-2 pr-2">
          {formatCouponDate(record.date)}
        </FareBox>
        <FareBox label="Time" className="border-l-[1.5px] border-navy py-2 pl-3">
          {time ?? "—"}
        </FareBox>
        <FareBox label="Marks" className="border-l-[1.5px] border-navy py-2 pl-3">
          {record.marks ?? "—"}
        </FareBox>
      </div>

      <div className="tear mt-4" style={{ "--notch": "var(--color-stock)" } as React.CSSProperties} />

      <div className="flex items-end justify-between gap-4 px-4 pt-3 pb-4 sm:px-6">
        <div>
          <span className="caps block text-[12px] tracking-[0.14em] text-ink-3">
            {countdown.overdue ? "Overdue" : "Boarding"}
          </span>
          <DCode countdown={countdown} className="mt-1 block text-[44px] tracking-[-0.05em]" />
          <span suppressHydrationWarning className="mt-1 block text-[14px] text-ink-2">
            {countdown.caption}
            {time ? ` · ${time}` : ""}
          </span>
        </div>
        <div className="flex flex-col items-end gap-2 text-right">
          {prep && (
            <span className="text-[13px] text-ink-2">
              Prep by <span className="carbon text-[13px]">{prep}</span>
            </span>
          )}
          {record.link ? (
            <OpenLink href={record.link} label="Open in Notion" variant="primary" />
          ) : (
            <a
              href={record.notionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="caps text-[12px] tracking-[0.14em] text-ink-2 underline decoration-dash decoration-2 hover:text-jet"
            >
              View on board
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

const TASK_CATEGORIES = new Set(["quiz", "assignment", "event", "other"]);

/* ------------------------------------------------------------------ */
/* A leg row: compact coupon with a perforated D-count stub.           */
/* ------------------------------------------------------------------ */

export function LegRow({
  record,
  showCourse = true,
  showDetails = false,
  className,
  stampDelay = 0,
}: {
  record: AcademicRecord;
  showCourse?: boolean;
  showDetails?: boolean;
  className?: string;
  stampDelay?: number;
}) {
  const course = getCourseStyle(record.course);
  const countdown = getCountdown(record.date, record.countdown);
  const done = record.status === "Done";
  const time = formatTime(record.date);
  const href = record.link ?? record.notionUrl;
  const isTask = TASK_CATEGORIES.has(record.category);
  const stubParts = formatCouponDate(record.date ?? record.posted).split(" ");
  const stubDay = stubParts.length === 3 ? stubParts[1] : null;
  const stubMonth = stubParts.length === 3 ? stubParts[2] : null;

  return (
    <li
      className={cn(
        "group relative flex min-h-[68px] items-stretch overflow-hidden ticket transition-shadow hover:shadow-[0_10px_20px_-16px_rgba(13,27,61,0.6)]",
        className
      )}
    >
      <div className="min-w-0 flex-1 px-3 py-2.5 sm:px-4">
        <div className="flex min-w-0 items-center gap-2">
          {showCourse && (
            <CourseTab
              course={course}
              size="xs"
              href={`/courses/${course.slug}`}
              className="relative z-10"
            />
          )}
          <span className="caps truncate text-[12px] tracking-[0.12em] text-ink-3">
            {showCourse ? course.shortName : recordTypeLabel(record)}
          </span>
        </div>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={cn("mt-1 block truncate text-[15.5px] leading-snug font-medium after:absolute after:inset-0 after:content-[''] hover:underline", done ? "text-ink-2 line-through decoration-ink-3" : "text-navy")}
        >
          {record.title}
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
        <p className="mt-0.5 truncate text-[13px] text-ink-2">
          <span className="carbon text-[12.5px] text-ink-2">{formatCouponDate(record.date)}</span>
          {time && <span className="carbon text-[12.5px] text-ink-2"> · {time}</span>}
          {showCourse ? ` · ${recordTypeLabel(record)}` : ""}
          {record.marks !== null && record.marks !== "" ? ` · ${record.marks} marks` : ""}
        </p>
        {showDetails && (record.topics.length > 0 || record.notedBy || record.prepBy) && (
          <p className="mt-1 text-[13px] leading-relaxed text-ink-2">
            {record.topics.length > 0 && <span>{record.topics.join(" · ")}</span>}
            {record.prepBy && <span> · Prep by {formatShortDate(record.prepBy)}</span>}
            {record.notedBy && <span> · Noted by {record.notedBy}</span>}
          </p>
        )}
      </div>

      <div className="perf-v relative flex w-[78px] shrink-0 flex-col items-center justify-center gap-1 sm:w-[92px]">
        {!isTask ? (
          <>
            <span className="carbon text-[22px] leading-none">
              {stubDay ?? "—"}
            </span>
            <span className="caps text-[11px] tracking-[0.14em] text-ink-3">
              {stubMonth ?? "Undated"}
            </span>
          </>
        ) : done ? (
          <Stamp animate delay={stampDelay} className="text-[14px]">
            Used
          </Stamp>
        ) : (
          <>
            <DCode countdown={countdown} className="text-[18px]" />
            <StatusWord status={record.status} overdue={countdown.overdue} className="text-[11px]" />
          </>
        )}
      </div>
    </li>
  );
}

/* ------------------------------------------------------------------ */
/* Entry card for notes, resources, playlists, class logs.            */
/* ------------------------------------------------------------------ */

export function EntryCoupon({
  record,
  kind,
  action,
}: {
  record: AcademicRecord;
  kind: string;
  action?: string;
}) {
  const course = getCourseStyle(record.course);
  const hasCourse = Boolean(record.course && record.course !== "General");
  const date = record.date ?? record.posted;

  return (
    <article className="flex h-full flex-col overflow-hidden ticket">
      <div className="flex items-center justify-between gap-2 px-4 pt-3">
        {hasCourse ? (
          <CourseTab course={course} size="xs" href={`/courses/${course.slug}`} />
        ) : (
          <span className="caps text-[12px] tracking-[0.14em] text-ink-3">{kind}</span>
        )}
        {date ? (
          <span className="carbon text-[12.5px] text-ink-2">{formatCouponDate(date)}</span>
        ) : record.semester && record.semester !== "Winter 2026" ? (
          <span className="caps text-[12px] tracking-[0.12em] text-ink-3">{record.semester}</span>
        ) : null}
      </div>
      <div className="flex-1 px-4 pt-2 pb-3">
        <h3 className="text-[16px] leading-snug font-medium text-navy">{record.title}</h3>
        {hasCourse && record.courseName && (
          <p className="mt-0.5 truncate text-[13px] text-ink-3">{course.name}</p>
        )}
        {record.topics.length > 0 && (
          <ul className="mt-2.5 flex flex-wrap gap-1.5">
            {record.topics.map((t) => (
              <li
                key={t}
                className="rounded-[3px] bg-lilac-2 px-1.5 py-0.5 text-[12.5px] leading-tight text-carbon"
              >
                {t}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="tear" style={{ "--notch": "var(--color-stock)" } as React.CSSProperties} />
      <div className="flex min-h-[52px] items-center justify-between gap-3 px-4 py-2">
        <span className="truncate text-[13px] text-ink-2">
          {record.notedBy ? (
            <>
              Noted by <span className="font-medium text-navy">{record.notedBy}</span>
            </>
          ) : (
            kind
          )}
        </span>
        {record.link ? (
          <OpenLink href={record.link} label={action ?? "Open"} />
        ) : (
          <a
            href={record.notionUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="caps shrink-0 text-[12px] tracking-[0.14em] text-ink-2 underline decoration-dash decoration-2 hover:text-jet"
          >
            On board
          </a>
        )}
      </div>
    </article>
  );
}
