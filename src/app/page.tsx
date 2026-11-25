import Link from "next/link";
import { Megaphone, Ticket } from "lucide-react";
import { SetupBanner } from "@/components/layout/SetupBanner";
import { LegRow, NextCoupon } from "@/components/wallet/coupons";
import { CarbonCopy } from "@/components/dashboard/CarbonCopy";
import { RoutesBoard } from "@/components/dashboard/RoutesBoard";
import {
  CourseTab,
  EmptyTicket,
  SectionHead,
  Stamp,
} from "@/components/wallet/primitives";
import { formatCouponDate, getDaysRemaining } from "@/lib/dates";
import { getCourseStyle } from "@/lib/utils";
import { getDashboardSnapshot } from "@/lib/queries";

export const revalidate = 300;

export default async function TodayPage() {
  const snapshot = await getDashboardSnapshot();
  const { legs } = snapshot;
  const [next, ...rest] = legs;
  const shown = rest.slice(0, 6);

  const notices = snapshot.records
    .filter((r) => r.category === "announcement" || r.category === "syllabus")
    .sort((a, b) => (b.date ?? b.posted ?? "").localeCompare(a.date ?? a.posted ?? ""))
    .slice(0, 4);

  const recentlyUsed = snapshot.completedTasks.slice(0, 2);
  const dueThisWeek = legs.filter((r) => {
    const d = getDaysRemaining(r.date);
    return d !== null && d >= 0 && d <= 7;
  }).length;

  return (
    <div className="space-y-9 lg:space-y-12">
      <SetupBanner configured={snapshot.configured} error={snapshot.error} />

      <h1 className="sr-only">Today: what&apos;s due next</h1>

      <div className="grid gap-x-8 gap-y-6 lg:grid-cols-12 lg:gap-y-10">
        <section aria-label="Next due" className="order-1 lg:col-span-7">
          {next ? (
            <NextCoupon record={next} index={1} total={legs.length} />
          ) : (
            <div className="relative overflow-hidden px-6 py-10 text-center ticket">
              <Stamp animate className="text-[28px]">
                Clear
              </Stamp>
              <p className="caps mt-5 text-[22px] font-bold tracking-[0.06em] text-navy">
                No open legs in the wallet
              </p>
              <p className="mt-1 text-[15px] text-ink-2">
                Every quiz and assignment on the board is done. New ones land here when they&apos;re
                posted.
              </p>
            </div>
          )}
        </section>

        <div className="order-3 mt-3 lg:order-2 lg:col-span-5 lg:mt-0 lg:self-start">
          <CarbonCopy
            record={next ?? null}
            index={1}
            openCount={legs.length}
            usedCount={snapshot.completedTasks.length}
            dueThisWeek={dueThisWeek}
          />
        </div>

        <section aria-label="Remaining legs" className="order-2 lg:order-3 lg:col-span-7">
          <SectionHead
            title="Remaining legs"
            count={`${rest.length} open · ${recentlyUsed.length} used`}
            action={{ href: "/assessments", label: "All assessments" }}
          />
          {shown.length === 0 && recentlyUsed.length === 0 ? (
            <EmptyTicket
              className="mt-3"
              icon={Ticket}
              title={next ? "Only one leg left" : "Nothing pending"}
              description="Quizzes, assignments and events marked To do on the board line up here, soonest first."
            />
          ) : (
            <ul className="mt-3 space-y-2">
              {shown.map((r) => (
                <LegRow key={r.id} record={r} />
              ))}
              {recentlyUsed.map((r, i) => (
                <LegRow key={r.id} record={r} stampDelay={120 + i * 120} />
              ))}
            </ul>
          )}
          {rest.length > shown.length && (
            <Link
              href="/assessments"
              className="caps mt-3 flex h-11 items-center justify-center rounded-[6px] border-[1.5px] border-dashed border-dash text-[13px] tracking-[0.14em] text-ink-2 hover:border-navy hover:text-navy"
            >
              + {rest.length - shown.length} more legs
            </Link>
          )}
        </section>

        <section aria-label="Notices" className="order-4 mt-3 lg:col-span-5 lg:mt-0">
          <SectionHead title="Notices" count={notices.length} />
          {notices.length === 0 ? (
            <EmptyTicket
              className="mt-3"
              icon={Megaphone}
              title="No notices"
              description="Announcements and syllabus updates posted to the board show up here."
            />
          ) : (
            <ol className="mt-3 divide-y divide-hair overflow-hidden ticket">
              {notices.map((n) => {
                const course = getCourseStyle(n.course);
                return (
                  <li key={n.id}>
                    <a
                      href={n.link ?? n.notionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-4 py-3 transition-colors hover:bg-stock"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <CourseTab course={course} size="xs" />
                        <span className="carbon text-[12.5px] text-ink-2">
                          {formatCouponDate(n.date ?? n.posted)}
                        </span>
                      </div>
                      <p className="mt-1.5 text-[15px] leading-snug text-navy">{n.title}</p>
                    </a>
                  </li>
                );
              })}
            </ol>
          )}
        </section>
      </div>

      <section>
        <SectionHead
          title="Routes this semester"
          count={snapshot.courseSummaries.length}
          action={{ href: "/courses", label: "All courses" }}
        />
        <RoutesBoard summaries={snapshot.courseSummaries} />
      </section>
    </div>
  );
}
