import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { CourseInfo, RecordStatus } from "@/types/academic";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const WINTER_2026_COURSES: CourseInfo[] = [
  {
    code: "IPE 4705",
    slug: "ipe-4705",
    name: "Ergonomics and Safety Management",
    shortName: "Ergonomics & Safety",
    color: "#0284c7",
    badgeClass: "bg-sky-50 text-sky-700 border-sky-200",
    dotClass: "bg-sky-500",
    borderClass: "border-l-sky-500",
    isLab: false,
  },
  {
    code: "IPE 4706",
    slug: "ipe-4706",
    name: "Ergonomics and Safety Management Lab",
    shortName: "Ergonomics Lab",
    color: "#0d9488",
    badgeClass: "bg-teal-50 text-teal-700 border-teal-200",
    dotClass: "bg-teal-500",
    borderClass: "border-l-teal-500",
    isLab: true,
  },
  {
    code: "IPE 4709",
    slug: "ipe-4709",
    name: "Product Design II",
    shortName: "Product Design II",
    color: "#2563eb",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
    dotClass: "bg-blue-500",
    borderClass: "border-l-blue-500",
    isLab: false,
  },
  {
    code: "IPE 4710",
    slug: "ipe-4710",
    name: "Capstone Design II",
    shortName: "Capstone Design II",
    color: "#4f46e5",
    badgeClass: "bg-indigo-50 text-indigo-700 border-indigo-200",
    dotClass: "bg-indigo-500",
    borderClass: "border-l-indigo-500",
    isLab: true,
  },
  {
    code: "IPE 4715",
    slug: "ipe-4715",
    name: "Material Handling and Maintenance Management",
    shortName: "Material Handling",
    color: "#059669",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dotClass: "bg-emerald-500",
    borderClass: "border-l-emerald-500",
    isLab: false,
  },
  {
    code: "IPE 4716",
    slug: "ipe-4716",
    name: "Material Handling and Maintenance Management Lab",
    shortName: "Material Handling Lab",
    color: "#0891b2",
    badgeClass: "bg-cyan-50 text-cyan-700 border-cyan-200",
    dotClass: "bg-cyan-500",
    borderClass: "border-l-cyan-500",
    isLab: true,
  },
  {
    code: "IPE 4725",
    slug: "ipe-4725",
    name: "Supply Chain Management",
    shortName: "Supply Chain",
    color: "#d97706",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
    dotClass: "bg-amber-500",
    borderClass: "border-l-amber-500",
    isLab: false,
  },
  {
    code: "IPE 4785",
    slug: "ipe-4785",
    name: "Reliability and Maintenance Engineering",
    shortName: "Reliability Eng.",
    color: "#7c3aed",
    badgeClass: "bg-violet-50 text-violet-700 border-violet-200",
    dotClass: "bg-violet-500",
    borderClass: "border-l-violet-500",
    isLab: false,
  },
  {
    code: "IPE 4700",
    slug: "ipe-4700",
    name: "Project and Thesis I",
    shortName: "Thesis I",
    color: "#e11d48",
    badgeClass: "bg-rose-50 text-rose-700 border-rose-200",
    dotClass: "bg-rose-500",
    borderClass: "border-l-rose-500",
    isLab: true,
  },
  {
    code: "ME 4703",
    slug: "me-4703",
    name: "Noise and Vibration",
    shortName: "Noise & Vibration",
    color: "#ea580c",
    badgeClass: "bg-orange-50 text-orange-700 border-orange-200",
    dotClass: "bg-orange-500",
    borderClass: "border-l-orange-500",
    isLab: false,
  },
];

export function courseSlug(code: string): string {
  return code
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function normalizeCourseCode(value: string): string {
  return value.trim().toUpperCase().replace(/\s+/g, " ");
}

export function findCourseInfo(codeOrSlug: string): CourseInfo | undefined {
  const target = codeOrSlug.trim().toLowerCase();
  return WINTER_2026_COURSES.find(
    (c) =>
      c.slug === target ||
      c.code.toLowerCase() === target ||
      c.code.toLowerCase().replace(/\s+/g, "") === target.replace(/[-\s]+/g, "")
  );
}

export function getCourseStyle(courseCode: string): CourseInfo {
  const found = findCourseInfo(courseCode);
  if (found) return found;
  const normalized = normalizeCourseCode(courseCode || "General");
  return {
    code: normalized,
    slug: courseSlug(normalized),
    name: normalized,
    shortName: normalized,
    color: "#64748b",
    badgeClass: "bg-slate-100 text-slate-700 border-slate-200",
    dotClass: "bg-slate-500",
    borderClass: "border-l-slate-500",
    isLab: normalized.toLowerCase().includes("lab"),
  };
}

export function getStatusBadgeClass(status: RecordStatus): string {
  switch (status) {
    case "Done":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "In progress":
      return "bg-sky-50 text-sky-700 border-sky-200";
    case "To do":
    default:
      return "bg-amber-50 text-amber-700 border-amber-200";
  }
}
