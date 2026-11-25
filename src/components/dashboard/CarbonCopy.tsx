import type { AcademicRecord } from "@/types/academic";
import { formatCouponDate, formatTime, getCountdown } from "@/lib/dates";
import { getCourseStyle } from "@/lib/utils";
import { recordTypeLabel } from "@/components/wallet/primitives";

/** Bars drawn from the record's Notion page id: same ticket, same barcode. */
function Barcode({ seed }: { seed: string }) {
  const hex = seed.replace(/[^0-9a-f]/gi, "").padEnd(32, "0").slice(0, 32);
  let x = 0;
  const bars: { x: number; w: number }[] = [];
  for (const ch of hex) {
    const n = parseInt(ch, 16);
    const w = 1 + (n % 3);
    bars.push({ x, w });
    x += w + 1 + ((n >> 2) % 2);
  }
  return (
    <svg
      viewBox={`0 0 ${x} 20`}
      preserveAspectRatio="none"
      className="h-12 w-full text-carbon"
      aria-hidden
    >
      {bars.map((b, i) => (
        <rect key={i} x={b.x} y={0} width={b.w} height={20} fill="currentColor" />
      ))}
    </svg>
  );
}

/**
 * The carbon copy: the lilac duplicate of the next coupon, every figure
 * struck in carbon, closed by a perforated stub with its barcode.
 */
export function CarbonCopy({
  record,
  index,
  openCount,
  usedCount,
  dueThisWeek,
}: {
  record: AcademicRecord | null;
  index: number;
  openCount: number;
  usedCount: number;
  dueThisWeek: number;
}) {
  const course = record ? getCourseStyle(record.course) : null;
  const countdown = record ? getCountdown(record.date, record.countdown) : null;
  const [dept, number] = course ? (course.code.match(/^(\S+)\s+(.*)$/)?.slice(1) ?? ["", course.code]) : ["", ""];
  const id = record ? record.id.replace(/-/g, "").slice(0, 12).toUpperCase() : "";

  return (
    <section
      aria-label="Carbon copy of the next coupon"
      className="overflow-hidden rounded-[6px] border-[1.5px] border-carbon/45 bg-lilac text-carbon"
    >
      <div className="flex h-10 items-center justify-between border-b-[1.5px] border-dashed border-carbon/40 px-4">
        <span className="caps text-[13px] tracking-[0.16em]">Carbon copy</span>
        <span className="caps text-[12px] tracking-[0.16em] opacity-85">
          {record ? `Coupon ${index} · duplicate` : "Winter 2026 · IPE"}
        </span>
      </div>

      {record && course && countdown ? (
        <>
          <div className="grid grid-cols-[1fr_auto] gap-4 px-4 pt-3">
            <div className="min-w-0">
              <span className="caps block text-[12px] tracking-[0.16em] opacity-85">{dept} route</span>
              <span className="block font-mono text-[64px] leading-[0.9] font-bold tracking-[-0.06em]">
                {number}
              </span>
              <span className="mt-1 block truncate text-[15px] font-medium text-navy">
                {recordTypeLabel(record)} · {record.title}
              </span>
            </div>
            <div className="border-l-[1.5px] border-dashed border-carbon/40 pl-4 text-right">
              <span className="caps block text-[12px] tracking-[0.16em] opacity-85">Count</span>
              <span className="block font-mono text-[34px] leading-none font-bold tracking-[-0.05em]">
                {countdown.code}
              </span>
            </div>
          </div>

          <dl className="mx-4 mt-3 grid grid-cols-3 border-y-[1.5px] border-dashed border-carbon/40">
            <div className="py-2">
              <dt className="caps text-[11px] tracking-[0.14em] opacity-85">Date</dt>
              <dd className="font-mono text-[14px] font-bold">{formatCouponDate(record.date)}</dd>
            </div>
            <div className="border-l-[1.5px] border-dashed border-carbon/40 py-2 pl-3">
              <dt className="caps text-[11px] tracking-[0.14em] opacity-85">Time</dt>
              <dd className="font-mono text-[14px] font-bold">{formatTime(record.date) ?? "—"}</dd>
            </div>
            <div className="border-l-[1.5px] border-dashed border-carbon/40 py-2 pl-3">
              <dt className="caps text-[11px] tracking-[0.14em] opacity-85">Seq</dt>
              <dd className="font-mono text-[14px] font-bold">
                {String(index).padStart(3, "0")}/{String(openCount).padStart(3, "0")}
              </dd>
            </div>
          </dl>

          <div className="px-4 pt-3 pb-3">
            <Barcode seed={record.id} />
            <div className="mt-1.5 flex flex-col gap-0.5 font-mono text-[12px] font-bold tracking-[0.12em] sm:flex-row sm:items-center sm:justify-between">
              <span className="whitespace-nowrap">{id.replace(/(.{4})(?=.)/g, "$1-")}</span>
              <span className="whitespace-nowrap tracking-normal opacity-90">
                {openCount} open · {usedCount} used · {dueThisWeek} this week
              </span>
            </div>
          </div>
        </>
      ) : (
        <p className="px-4 py-6 text-[15px]">
          No open coupon to copy. {usedCount} legs used this semester.
        </p>
      )}
    </section>
  );
}
