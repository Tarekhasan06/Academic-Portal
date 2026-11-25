import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { CourseSummary } from "@/types/academic";
import { formatCouponDate, getCountdown } from "@/lib/dates";
import { CourseTab, DCode } from "@/components/wallet/primitives";

/**
 * Every course as a route on a departures board: what's open, and
 * when its next leg is due.
 */
export function RoutesBoard({ summaries }: { summaries: CourseSummary[] }) {
  return (
    <div className="mt-3 overflow-hidden ticket">
      <div className="caps hidden grid-cols-[110px_1fr_90px_150px_88px_24px] gap-4 bg-navy px-4 py-2 text-[12px] tracking-[0.16em] text-white/80 md:grid">
        <span>Route</span>
        <span>Course</span>
        <span className="text-right">Open</span>
        <span>Next due</span>
        <span className="text-right">Count</span>
        <span />
      </div>
      <ul className="divide-y divide-hair">
        {summaries.map((s) => {
          const next = s.nextDue;
          const countdown = next ? getCountdown(next.date, next.countdown) : null;
          return (
            <li key={s.course.code}>
              <Link
                href={`/courses/${s.course.slug}`}
                className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 px-4 py-3 transition-colors hover:bg-stock md:grid-cols-[110px_1fr_90px_150px_88px_24px]"
              >
                <span className="flex items-center gap-2 md:block">
                  <CourseTab course={s.course} size="sm" />
                  <span className="truncate text-[15px] font-medium text-navy md:hidden">
                    {s.course.shortName}
                  </span>
                </span>
                <span className="hidden min-w-0 md:block">
                  <span className="block truncate text-[15px] font-medium text-navy">
                    {s.course.name}
                  </span>
                  <span className="caps text-[11.5px] tracking-[0.14em] text-ink-3">
                    {s.course.isLab ? "Lab / Project" : "Theory"} · {s.totalItems} on board
                  </span>
                </span>
                <span className="carbon hidden text-right text-[16px] md:block">
                  {s.pendingCount}
                </span>
                <span className="col-start-1 truncate text-[13px] text-ink-2 md:col-start-auto md:text-[14px]">
                  {next ? (
                    <>
                      <span className="carbon text-[13px] text-ink-2">{formatCouponDate(next.date)}</span>
                      <span className="md:hidden"> · </span>
                      <span className="md:block md:truncate">{next.title}</span>
                    </>
                  ) : (
                    <span className="text-ink-3">No open legs</span>
                  )}
                </span>
                <span className="col-start-2 row-span-2 row-start-1 flex items-center gap-2 justify-self-end md:col-start-auto md:row-span-1 md:row-start-auto">
                  {countdown ? (
                    <DCode countdown={countdown} className="text-[16px]" />
                  ) : (
                    <span className="caps text-[12px] tracking-[0.14em] text-ok">Clear</span>
                  )}
                </span>
                <ChevronRight className="hidden h-4 w-4 text-ink-3 md:block" aria-hidden />
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
