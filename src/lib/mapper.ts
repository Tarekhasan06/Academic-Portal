import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import type {
  AcademicRecord,
  RecordCategory,
  RecordStatus,
} from "@/types/academic";
import { findCourseInfo, normalizeCourseCode } from "@/lib/utils";

type NotionPropertyMap = PageObjectResponse["properties"];
type NotionPropertyValue = NotionPropertyMap[string];

function findProperty(
  properties: NotionPropertyMap,
  candidates: string[]
): NotionPropertyValue | undefined {
  const lowerEntries = Object.entries(properties).map(([key, val]) => [
    key.trim().toLowerCase(),
    val,
  ] as const);

  for (const candidate of candidates) {
    const exact = properties[candidate];
    if (exact) return exact;
    const lowered = candidate.trim().toLowerCase();
    const match = lowerEntries.find(([key]) => key === lowered);
    if (match) return match[1];
  }
  return undefined;
}

function readPlainText(prop?: NotionPropertyValue): string | null {
  if (!prop) return null;

  switch (prop.type) {
    case "title":
      return prop.title.map((t) => t.plain_text).join("").trim() || null;
    case "rich_text":
      return prop.rich_text.map((t) => t.plain_text).join("").trim() || null;
    case "select":
      return prop.select?.name?.trim() || null;
    case "status":
      return prop.status?.name?.trim() || null;
    case "multi_select":
      return prop.multi_select.map((s) => s.name).join(", ").trim() || null;
    case "url":
      return prop.url?.trim() || null;
    case "email":
      return prop.email?.trim() || null;
    case "phone_number":
      return prop.phone_number?.trim() || null;
    case "number":
      return prop.number !== null ? String(prop.number) : null;
    case "checkbox":
      return prop.checkbox ? "Yes" : "No";
    case "date":
      return prop.date?.start ?? null;
    case "created_time":
      return prop.created_time ?? null;
    case "last_edited_time":
      return prop.last_edited_time ?? null;
    case "people":
      return (
        prop.people
          .map((p) => ("name" in p && p.name ? p.name : p.id))
          .join(", ")
          .trim() || null
      );
    case "formula":
      if (prop.formula.type === "string") return prop.formula.string?.trim() || null;
      if (prop.formula.type === "number")
        return prop.formula.number !== null ? String(prop.formula.number) : null;
      if (prop.formula.type === "boolean")
        return prop.formula.boolean !== null ? String(prop.formula.boolean) : null;
      if (prop.formula.type === "date") return prop.formula.date?.start ?? null;
      return null;
    case "rollup":
      if (prop.rollup.type === "number")
        return prop.rollup.number !== null ? String(prop.rollup.number) : null;
      if (prop.rollup.type === "date") return prop.rollup.date?.start ?? null;
      if (prop.rollup.type === "array") {
        const joined = prop.rollup.array
          .map((item) => readPlainText(item as NotionPropertyValue))
          .filter(Boolean)
          .join(", ");
        return joined || null;
      }
      return null;
    default:
      return null;
  }
}

function readMultiValues(prop?: NotionPropertyValue): string[] {
  if (!prop) return [];
  if (prop.type === "multi_select") {
    return prop.multi_select.map((item) => item.name.trim()).filter(Boolean);
  }
  if (prop.type === "select" && prop.select?.name) {
    return [prop.select.name.trim()];
  }
  if (prop.type === "rich_text") {
    const raw = prop.rich_text.map((t) => t.plain_text).join("").trim();
    if (!raw) return [];
    return raw
      .split(/[,;|]/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

function readNumberOrString(prop?: NotionPropertyValue): string | number | null {
  if (!prop) return null;
  if (prop.type === "number") return prop.number;
  if (prop.type === "formula") {
    if (prop.formula.type === "number") return prop.formula.number;
    if (prop.formula.type === "string") return prop.formula.string?.trim() || null;
  }
  return readPlainText(prop);
}

function readNumberOnly(prop?: NotionPropertyValue): number | null {
  if (!prop) return null;
  if (prop.type === "number") return prop.number;
  if (prop.type === "formula" && prop.formula.type === "number") {
    return prop.formula.number;
  }
  const text = readPlainText(prop);
  if (!text) return null;
  const parsed = Number(text);
  return Number.isFinite(parsed) ? parsed : null;
}

function readDateRange(prop?: NotionPropertyValue): {
  start: string | null;
  end: string | null;
} {
  if (!prop) return { start: null, end: null };
  if (prop.type === "date") {
    return {
      start: prop.date?.start ?? null,
      end: prop.date?.end ?? null,
    };
  }
  if (prop.type === "formula" && prop.formula.type === "date") {
    return {
      start: prop.formula.date?.start ?? null,
      end: prop.formula.date?.end ?? null,
    };
  }
  if (prop.type === "created_time") {
    return { start: prop.created_time, end: null };
  }
  return { start: readPlainText(prop), end: null };
}

export function normalizeStatus(rawStatus: string | null): RecordStatus {
  const value = (rawStatus ?? "").trim().toLowerCase();
  if (
    value === "done" ||
    value === "completed" ||
    value === "complete" ||
    value === "submitted"
  ) {
    return "Done";
  }
  if (
    value === "in progress" ||
    value === "in-progress" ||
    value === "doing" ||
    value === "ongoing" ||
    value === "active"
  ) {
    return "In progress";
  }
  return "To do";
}

export function classifyRecordType(rawType: string | null): RecordCategory {
  const value = (rawType ?? "").trim().toLowerCase();
  if (!value) return "other";

  if (value.includes("quiz") || value.includes("ct") || value.includes("exam") || value.includes("viva")) {
    return "quiz";
  }
  if (value.includes("assign") || value.includes("homework") || value.includes("lab report") || value.includes("submission") || value.includes("project")) {
    return "assignment";
  }
  if (value.includes("announce") || value.includes("notice")) {
    return "announcement";
  }
  if (value.includes("syllabus")) {
    return "syllabus";
  }
  if (value.includes("playlist") || value.includes("recording") || value.includes("online class")) {
    return "playlist";
  }
  if (value.includes("class log") || value.includes("progress") || value.includes("class history") || value.includes("lecture log")) {
    return "class-log";
  }
  if (value.includes("note")) {
    return "note";
  }
  if (
    value.includes("resource") ||
    value.includes("book") ||
    value.includes("previous") ||
    value.includes("question") ||
    value.includes("material") ||
    value.includes("drive") ||
    value.includes("youtube") ||
    value.includes("slide")
  ) {
    return "resource";
  }
  if (value.includes("event") || value.includes("seminar") || value.includes("workshop")) {
    return "event";
  }
  return "other";
}

export function mapNotionPageToRecord(page: PageObjectResponse): AcademicRecord {
  const p = page.properties;

  const title =
    readPlainText(findProperty(p, ["Title", "Name", "Task", "Item"])) ??
    "Untitled Item";

  const rawCourse =
    readPlainText(findProperty(p, ["Course", "Course Code", "Code"])) ?? "";
  const rawCourseName =
    readPlainText(findProperty(p, ["Course name", "Course Name", "Subject"])) ?? "";

  const matchedCourse =
    findCourseInfo(rawCourse) ?? findCourseInfo(rawCourseName);

  const course = rawCourse
    ? normalizeCourseCode(rawCourse)
    : matchedCourse?.code ?? "General";

  const courseName =
    rawCourseName || matchedCourse?.name || course;

  const dateInfo = readDateRange(findProperty(p, ["Date", "Due Date", "Deadline"]));
  const link = readPlainText(findProperty(p, ["Link", "URL", "Resource Link"]));
  const marks = readNumberOrString(findProperty(p, ["Marks", "Score", "Weight"]));
  const notedBy = readPlainText(findProperty(p, ["Noted by", "Noted By", "Author"]));
  const postedProp = findProperty(p, ["Posted", "Posted Date", "Published"]);
  const posted = readPlainText(postedProp);
  const prepBy = readPlainText(findProperty(p, ["Prep by", "Prep By", "Prepared By"]));
  const semester =
    readPlainText(findProperty(p, ["Semester", "Term"])) ?? "Winter 2026";

  const rawStatus = readPlainText(findProperty(p, ["Status", "State"]));
  const status = normalizeStatus(rawStatus);

  const topics = readMultiValues(findProperty(p, ["Topics", "Topic", "Tags"]));
  const type = readPlainText(findProperty(p, ["Type", "Category"])) ?? "General";
  const category = classifyRecordType(type);

  const countdown = readNumberOrString(findProperty(p, ["Countdown", "Days Left"]));
  const cutoffDays = readNumberOnly(
    findProperty(p, ["Cutoff (days)", "Cutoff", "Cutoff Days"])
  );

  return {
    id: page.id,
    notionUrl: page.url,
    title,
    course,
    courseName,
    date: dateInfo.start,
    endDate: dateInfo.end,
    link,
    marks,
    notedBy,
    posted,
    prepBy,
    semester,
    status,
    rawStatus,
    topics,
    type,
    category,
    countdown,
    cutoffDays,
  };
}
