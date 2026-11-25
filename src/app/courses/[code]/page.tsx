import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { SetupBanner } from "@/components/layout/SetupBanner";
import { CourseDetailTabs } from "@/components/courses/CourseDetailTabs";
import { CourseTab, DCode, FareBox } from "@/components/wallet/primitives";
import { formatCouponDate, getCountdown } from "@/lib/dates";
import { getCourseDetailData, orderLegs } from "@/lib/queries";
import { WINTER_2026_COURSES } from "@/lib/utils";

export const revalidate = 300;

export function generateStaticParams() {
  return WINTER_2026_COURSES.map((c) => ({ code: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>;
}): Promise<Metadata> {
  const { code } = await params;
  const detail = await getCourseDetailData(code);
  return { title: `${detail.course.code} ${detail.course.name}` };
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const detail = await getCourseDetailData(code);
  const { course } = detail;
  const open = orderLegs(
    [...detail.quizzes, ...detail.assignments].filter((r) => r.status !== "Done")
  );
  const next = open[0] ?? null;
  const countdown = next ? getCountdown(next.date, next.countdown) : null;

  return (
    <div className="space-y-6">
      <SetupBanner configured={detail.configured} error={detail.error} />

      <Link
        href="/courses"
        className="caps inline-flex items-center gap-1.5 text-[13px] tracking-[0.14em] text-ink-2 hover:text-jet"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={2.25} aria-hidden />
        All courses
      </Link>

      <section className="overflow-hidden ticket">
        <div className="flex items-center justify-between gap-3 px-5 py-3 text-white sm:px-7" style={{ backgroundColor: course.color }}>
          <span className="caps text-[13px] tracking-[0.16em]">Boarding pass · Winter 2026</span>
          <span className="caps text-[13px] tracking-[0.16em] opacity-85">
            {course.isLab ? "Lab / Project" : "Theory"}
          </span>
        </div>

        <div className="grid gap-6 px-5 pt-5 pb-6 sm:px-7 lg:grid-cols-[1fr_260px]">
          <div className="min-w-0">
            <CourseTab course={course} size="md" />
            <h1 className="caps mt-3 text-[34px] leading-[0.98] font-bold tracking-[0.02em] text-navy sm:text-[46px]">
              {course.name}
            </h1>
            <dl className="mt-5 grid max-w-xl grid-cols-3 border-y-[1.5px] border-navy">
              <FareBox label="Assessments" className="py-2">
                {detail.quizzes.length + detail.assignments.length}
              </FareBox>
              <FareBox label="Materials" className="border-l-[1.5px] border-navy py-2 pl-3">
                {detail.notes.length + detail.resources.length + detail.playlists.length}
              </FareBox>
              <FareBox label="Classes" className="border-l-[1.5px] border-navy py-2 pl-3">
                {detail.classLogs.length}
              </FareBox>
            </dl>
          </div>

          <div className="rounded-[8px] bg-lilac p-4 text-carbon lg:self-start">
            <span className="caps block text-[12px] tracking-[0.16em] opacity-85">Next leg</span>
            {next && countdown ? (
              <>
                <DCode countdown={countdown} className="mt-1 block text-[42px] tracking-[-0.05em]" />
                <p className="mt-2 text-[15px] font-medium text-navy">{next.title}</p>
                <p className="font-mono text-[13px] font-bold">{formatCouponDate(next.date)}</p>
              </>
            ) : (
              <p className="caps mt-1 text-[22px] font-bold tracking-[0.06em]">Clear</p>
            )}
            <p className="mt-3 border-t-[1.5px] border-dashed border-carbon/35 pt-2 text-[13px]">
              {open.length} open {open.length === 1 ? "leg" : "legs"} on this route
            </p>
          </div>
        </div>
      </section>

      <CourseDetailTabs
        announcements={detail.announcements}
        quizzes={detail.quizzes}
        assignments={detail.assignments}
        notes={detail.notes}
        resources={detail.resources}
        playlists={detail.playlists}
        classLogs={detail.classLogs}
      />
    </div>
  );
}
