import Link from "next/link";
import type { CourseSummary } from "@/types/academic";
import { formatCouponDate, getCountdown } from "@/lib/dates";
import { DCode } from "@/components/wallet/primitives";

/** A course as a boarding pass: route head, ruled counts, next-leg stub. */
export function CourseCard({ summary }: { summary: CourseSummary }) {
  const { course, nextDue } = summary;
  const countdown = nextDue ? getCountdown(nextDue.date, nextDue.countdown) : null;
  const materials = summary.notesCount + summary.resourcesCount + summary.playlistsCount;

  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group flex h-full flex-col overflow-hidden ticket transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_20px_-16px_rgba(13,27,61,0.6)]"
    >
      <div
        className="flex h-10 items-center justify-between px-4 text-white"
        style={{ backgroundColor: course.color }}
      >
        <span className="caps text-[16px] font-bold tracking-[0.14em]">{course.code}</span>
        <span className="caps text-[12px] tracking-[0.16em] text-white/85">
          {course.isLab ? "Lab / Project" : "Theory"}
        </span>
      </div>
      <h2 className="caps flex-1 px-4 pt-3 pb-3 text-[22px] leading-[1.05] font-bold tracking-[0.03em] text-navy group-hover:text-jet-ink">
        {course.name}
      </h2>

      <dl className="mx-4 grid grid-cols-3 border-y-[1.5px] border-navy">
        {[
          ["Open", summary.pendingCount],
          ["Used", summary.completedCount],
          ["Material", materials],
        ].map(([label, value], i) => (
          <div key={label as string} className={i > 0 ? "border-l-[1.5px] border-navy py-2 pl-3" : "py-2"}>
            <dt className="caps text-[11px] tracking-[0.14em] text-ink-3">{label}</dt>
            <dd className="carbon text-[18px]">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="tear mt-4" style={{ "--notch": "var(--color-stock)" } as React.CSSProperties} />
      <div className="flex min-h-[64px] items-center justify-between gap-3 px-4 py-3">
        {nextDue && countdown ? (
          <>
            <div className="min-w-0">
              <span className="caps block text-[11px] tracking-[0.14em] text-ink-3">Next leg</span>
              <span className="block truncate text-[14px] font-medium text-navy">{nextDue.title}</span>
              <span className="carbon block text-[12px] text-ink-2">{formatCouponDate(nextDue.date)}</span>
            </div>
            <DCode countdown={countdown} className="text-[22px]" />
          </>
        ) : (
          <>
            <span className="text-[14px] text-ink-2">No open legs on this route.</span>
            <span className="caps text-[13px] tracking-[0.14em] text-ok">Clear</span>
          </>
        )}
      </div>
    </Link>
  );
}
