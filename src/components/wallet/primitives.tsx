import Link from "next/link";
import { ArrowUpRight, type LucideIcon } from "lucide-react";
import type { AcademicRecord, CourseInfo, RecordStatus } from "@/types/academic";
import type { Countdown } from "@/lib/dates";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Buttons and fields — standard controls, airline caps.              */
/* ------------------------------------------------------------------ */

export const btn = {
  base: "caps inline-flex items-center justify-center gap-2 rounded-[4px] text-[13px] tracking-[0.12em] transition-[background-color,color,box-shadow,transform] duration-150 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none",
  primary: "bg-jet text-white hover:bg-jet-ink shadow-[0_1px_0_#8f161b,0_6px_14px_-8px_rgba(215,38,45,0.7)]",
  secondary: "border-[1.5px] border-navy text-navy bg-coupon hover:bg-navy hover:text-white",
  quiet: "text-navy hover:bg-navy/5",
  md: "h-10 px-4",
  sm: "h-8 px-3 text-[12px]",
  icon: "h-10 w-10",
};

export const field =
  "h-10 w-full rounded-[4px] border-[1.5px] border-navy/25 bg-coupon px-3 text-[15px] text-navy placeholder:text-ink-3 transition-colors hover:border-navy/50 focus:border-navy focus:outline-none focus-visible:outline-2 focus-visible:outline-jet";

/* ------------------------------------------------------------------ */
/* Section heading: the "///" slash mark is the carrier's rule.       */
/* ------------------------------------------------------------------ */

export function SectionHead({
  title,
  count,
  action,
  as: Tag = "h2",
  className,
}: {
  title: string;
  count?: number | string;
  action?: { href: string; label: string };
  as?: "h1" | "h2" | "h3";
  className?: string;
}) {
  return (
    <div className={cn("flex items-end justify-between gap-3", className)}>
      <Tag className="caps flex flex-wrap items-baseline gap-x-2 text-[17px] tracking-[0.1em] text-navy">
        <span aria-hidden className="text-jet tracking-[-0.12em]">{"///"}</span>
        <span className="whitespace-nowrap">{title}</span>
        {count !== undefined && (
          <span className="font-mono text-[13px] font-bold tracking-normal whitespace-nowrap text-carbon">
            {count}
          </span>
        )}
      </Tag>
      {action && (
        <Link
          href={action.href}
          className="caps shrink-0 text-[12px] tracking-[0.14em] text-ink-2 underline decoration-dash decoration-2 underline-offset-4 hover:text-jet hover:decoration-jet"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Course tab: the course code reads like a flight number.            */
/* ------------------------------------------------------------------ */

export function CourseTab({
  course,
  href,
  size = "sm",
  className,
}: {
  course: CourseInfo;
  href?: string;
  size?: "xs" | "sm" | "md";
  className?: string;
}) {
  const classes = cn(
    "caps inline-flex shrink-0 items-center rounded-[3px] text-white tracking-[0.1em]",
    size === "xs" && "h-5 px-1.5 text-[11px]",
    size === "sm" && "h-6 px-2 text-[12px]",
    size === "md" && "h-7 px-2.5 text-[14px]",
    href && "transition-[filter] hover:brightness-125",
    className
  );
  const style = { backgroundColor: course.color };
  if (href) {
    return (
      <Link href={href} className={classes} style={style}>
        {course.code}
      </Link>
    );
  }
  return (
    <span className={classes} style={style}>
      {course.code}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Ruled fare box: label in tab caps, value in carbon.                */
/* ------------------------------------------------------------------ */

export function FareBox({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("min-w-0", className)}>
      <span className="caps block text-[11px] tracking-[0.14em] text-ink-3">{label}</span>
      <span className="carbon mt-0.5 block truncate text-[17px] leading-tight">{children}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Countdown stub and status marks.                                   */
/* ------------------------------------------------------------------ */

export function DCode({
  countdown,
  className,
}: {
  countdown: Countdown;
  className?: string;
}) {
  return (
    <span
      suppressHydrationWarning
      className={cn(
        "carbon leading-none",
        countdown.urgent && "text-jet",
        countdown.days === null && "text-ink-3",
        className
      )}
      aria-label={countdown.caption}
    >
      {countdown.code}
    </span>
  );
}

const STATUS_WORD: Record<RecordStatus, string> = {
  "To do": "Open",
  "In progress": "Boarding",
  Done: "Used",
};

export function StatusWord({
  status,
  overdue,
  className,
}: {
  status: RecordStatus;
  overdue?: boolean;
  className?: string;
}) {
  if (status === "Done") {
    return <Stamp className={className}>Used</Stamp>;
  }
  if (overdue) {
    return (
      <span className={cn("caps text-[12px] tracking-[0.14em] text-jet", className)}>Late</span>
    );
  }
  return (
    <span
      className={cn(
        "caps text-[12px] tracking-[0.14em]",
        status === "In progress" ? "text-carbon" : "text-ink-2",
        className
      )}
    >
      {STATUS_WORD[status]}
    </span>
  );
}

export function Stamp({
  children,
  className,
  animate,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
  delay?: number;
}) {
  return (
    <span
      className={cn("stamp text-[13px] text-jet", animate && "stamp-in", className)}
      style={animate ? ({ "--stamp-delay": `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* External link out of the wallet.                                   */
/* ------------------------------------------------------------------ */

export function OpenLink({
  href,
  label = "Open",
  variant = "secondary",
  className,
}: {
  href: string;
  label?: string;
  variant?: "primary" | "secondary" | "quiet";
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(btn.base, btn[variant], btn.sm, className)}
    >
      {label}
      <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2.25} aria-hidden />
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}

/* ------------------------------------------------------------------ */
/* Empty state on security-dot stock.                                 */
/* ------------------------------------------------------------------ */

export function EmptyTicket({
  title,
  description,
  icon: Icon,
  className,
}: {
  title: string;
  description: string;
  icon?: LucideIcon;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "security-dots flex flex-col items-center rounded-[6px] border-[1.5px] border-dashed border-dash px-6 py-10 text-center",
        className
      )}
    >
      {Icon && (
        <span className="mb-3 grid h-11 w-11 place-items-center rounded-full border-[1.5px] border-navy bg-coupon text-navy">
          <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
        </span>
      )}
      <p className="caps bg-coupon px-2 text-[16px] tracking-[0.1em] text-navy">{title}</p>
      <p className="mt-1.5 max-w-sm bg-coupon px-2 text-[14px] leading-relaxed text-ink-2">
        {description}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Brand mark: three jet-red slashes on navy.                         */
/* ------------------------------------------------------------------ */

export function BrandMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 24" className={className} aria-hidden>
      <path d="M8 2h9L9 22H0z" fill="#d7262d" />
      <path d="M20 2h9l-8 20h-9z" fill="#d7262d" />
      <path d="M32 2h8l-8 20h-8z" fill="#ffffff" />
    </svg>
  );
}

export function recordTypeLabel(record: AcademicRecord): string {
  // Notion types carry an emoji prefix ("📝 Quiz"); the wallet prints words only.
  return record.type.replace(/^[^\p{L}\p{N}]+/u, "").trim() || "Item";
}

/* ------------------------------------------------------------------ */
/* Page heading: big airline caps, one supporting line.               */
/* ------------------------------------------------------------------ */

export function PageHead({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="caps text-[32px] leading-none font-bold tracking-[0.04em] text-navy sm:text-[40px]">
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-[60ch] text-[15px] leading-relaxed text-ink-2">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Segmented tab caps, like the coupon book's tabbed heads.           */
/* ------------------------------------------------------------------ */

export function TabCaps<T extends string>({
  tabs,
  value,
  onChange,
  label,
}: {
  tabs: { key: T; label: string; count?: number }[];
  value: T;
  onChange: (key: T) => void;
  label: string;
}) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className="-mx-4 flex gap-1.5 overflow-x-auto border-b-[1.5px] border-navy px-4 sm:mx-0 sm:px-0"
    >
      {tabs.map((t) => {
        const active = t.key === value;
        return (
          <button
            key={t.key}
            role="tab"
            type="button"
            aria-selected={active}
            onClick={() => onChange(t.key)}
            className={cn(
              "caps -mb-[1.5px] flex h-10 shrink-0 items-center gap-2 rounded-t-[6px] border-[1.5px] px-3.5 text-[13.5px] tracking-[0.12em] transition-colors cursor-pointer",
              active
                ? "border-navy border-b-stock bg-stock text-navy"
                : "border-transparent text-ink-3 hover:text-navy"
            )}
          >
            {t.label}
            {typeof t.count === "number" && (
              <span
                className={cn(
                  "font-mono text-[12px] font-bold tracking-normal",
                  active ? "text-jet" : "text-ink-3"
                )}
              >
                {t.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Filter bar wrapper and select.                                     */
/* ------------------------------------------------------------------ */

export function FilterBar({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "grid gap-2 p-3 ticket sm:gap-3",
        className
      )}
    >
      {children}
    </div>
  );
}

export function SelectField({
  label,
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { label: string }) {
  return (
    <label className={cn("relative block min-w-0", className)}>
      <span className="sr-only">{label}</span>
      <select
        {...props}
        className={cn(
          field,
          "caps cursor-pointer appearance-none pr-8 text-[14px] tracking-[0.08em]"
        )}
      >
        {children}
      </select>
      <svg
        aria-hidden
        viewBox="0 0 12 12"
        className="pointer-events-none absolute top-1/2 right-3 h-3 w-3 -translate-y-1/2 text-navy"
      >
        <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    </label>
  );
}
