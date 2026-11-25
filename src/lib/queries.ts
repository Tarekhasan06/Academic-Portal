import { getPortalData } from "@/lib/notion";
import { getDaysRemaining, parseDateSafe } from "@/lib/dates";
import {
  WINTER_2026_COURSES,
  findCourseInfo,
  getCourseStyle,
} from "@/lib/utils";
import type {
  AcademicRecord,
  CourseInfo,
  CourseSummary,
  PortalDataResult,
} from "@/types/academic";

function compareByDateAsc(a: AcademicRecord, b: AcademicRecord): number {
  const da = parseDateSafe(a.date)?.getTime() ?? Number.MAX_SAFE_INTEGER;
  const db = parseDateSafe(b.date)?.getTime() ?? Number.MAX_SAFE_INTEGER;
  return da - db;
}

function compareByDateDesc(a: AcademicRecord, b: AcademicRecord): number {
  const da = parseDateSafe(a.date ?? a.posted)?.getTime() ?? 0;
  const db = parseDateSafe(b.date ?? b.posted)?.getTime() ?? 0;
  return db - da;
}

/**
 * The wallet order: what is due next first. Upcoming dated legs by date,
 * then the past week's missed legs (most recent first), then legs with no
 * date yet. Legs missed more than a week ago drop out of the wallet.
 */
export function orderLegs(records: AcademicRecord[]): AcademicRecord[] {
  const upcoming: AcademicRecord[] = [];
  const late: AcademicRecord[] = [];
  const tba: AcademicRecord[] = [];
  for (const r of records) {
    const d = getDaysRemaining(r.date);
    if (d === null) tba.push(r);
    else if (d >= 0) upcoming.push(r);
    else if (d >= -7) late.push(r);
  }
  return [
    ...upcoming.sort(compareByDateAsc),
    ...late.sort(compareByDateDesc),
    ...tba,
  ];
}

export function isAssessmentRecord(record: AcademicRecord): boolean {
  return (
    record.category === "quiz" ||
    record.category === "assignment" ||
    record.category === "announcement" ||
    record.category === "syllabus"
  );
}

export function isTaskRecord(record: AcademicRecord): boolean {
  return (
    record.category === "quiz" ||
    record.category === "assignment" ||
    record.category === "event" ||
    record.category === "other"
  );
}

export function getAllCoursesFromRecords(records: AcademicRecord[]): CourseInfo[] {
  const map = new Map<string, CourseInfo>();
  for (const c of WINTER_2026_COURSES) {
    map.set(c.code.toUpperCase(), c);
  }
  for (const r of records) {
    if (!r.course || r.course === "General") continue;
    const known = findCourseInfo(r.course) ?? findCourseInfo(r.courseName);
    if (!known) {
      const style = getCourseStyle(r.course);
      if (!map.has(style.code.toUpperCase())) {
        map.set(style.code.toUpperCase(), {
          ...style,
          name: r.courseName || style.name,
        });
      }
    }
  }
  return Array.from(map.values());
}

export function matchesCourse(record: AcademicRecord, courseCode: string): boolean {
  const target = courseCode.trim().toLowerCase().replace(/[-\s]+/g, "");
  const recCode = record.course.trim().toLowerCase().replace(/[-\s]+/g, "");
  const recName = record.courseName.trim().toLowerCase().replace(/[-\s]+/g, "");
  return recCode === target || recName === target;
}

export async function getDashboardSnapshot(): Promise<
  PortalDataResult & {
    upcomingQuizzes: AcademicRecord[];
    upcomingAssignments: AcademicRecord[];
    upcomingEvents: AcademicRecord[];
    pendingTasks: AcademicRecord[];
    completedTasks: AcademicRecord[];
    recentClassLogs: AcademicRecord[];
    courseSummaries: CourseSummary[];
    completionRate: number;
    legs: AcademicRecord[];
  }
> {
  const data = await getPortalData();
  const records = data.records;

  const isActiveUpcoming = (r: AcademicRecord) => {
    if (r.status === "Done") return false;
    const days = getDaysRemaining(r.date);
    if (days !== null && days < -1) return false;
    return true;
  };

  const upcomingQuizzes = records
    .filter((r) => r.category === "quiz" && isActiveUpcoming(r))
    .sort(compareByDateAsc);

  const upcomingAssignments = records
    .filter((r) => r.category === "assignment" && isActiveUpcoming(r))
    .sort(compareByDateAsc);

  const upcomingEvents = records
    .filter((r) => r.category === "event" && isActiveUpcoming(r))
    .sort(compareByDateAsc);

  const taskRecords = records.filter(isTaskRecord);
  const pendingTasks = taskRecords
    .filter((r) => r.status !== "Done")
    .sort(compareByDateAsc);
  const completedTasks = taskRecords
    .filter((r) => r.status === "Done")
    .sort(compareByDateDesc);

  const recentClassLogs = records
    .filter((r) => r.category === "class-log")
    .sort(compareByDateDesc)
    .slice(0, 6);

  const courses = getAllCoursesFromRecords(records);
  const courseSummaries: CourseSummary[] = courses.map((course) => {
    const courseRecords = records.filter((r) => matchesCourse(r, course.code));
    const courseTasks = courseRecords.filter(isTaskRecord);
    return {
      course,
      totalItems: courseRecords.length,
      pendingCount: courseTasks.filter((r) => r.status !== "Done").length,
      completedCount: courseTasks.filter((r) => r.status === "Done").length,
      quizzesCount: courseRecords.filter((r) => r.category === "quiz").length,
      assignmentsCount: courseRecords.filter((r) => r.category === "assignment").length,
      notesCount: courseRecords.filter((r) => r.category === "note").length,
      resourcesCount: courseRecords.filter((r) => r.category === "resource").length,
      playlistsCount: courseRecords.filter((r) => r.category === "playlist").length,
      classLogsCount: courseRecords.filter((r) => r.category === "class-log").length,
      nextDue: orderLegs(courseTasks.filter((r) => r.status !== "Done"))[0] ?? null,
    };
  });

  const completionRate =
    taskRecords.length > 0
      ? Math.round((completedTasks.length / taskRecords.length) * 100)
      : 0;

  const legs = orderLegs(pendingTasks);

  return {
    ...data,
    legs,
    upcomingQuizzes,
    upcomingAssignments,
    upcomingEvents,
    pendingTasks,
    completedTasks,
    recentClassLogs,
    courseSummaries,
    completionRate,
  };
}

export async function getCourseDetailData(codeOrSlug: string) {
  const data = await getPortalData();
  const course = findCourseInfo(codeOrSlug) ?? getCourseStyle(decodeURIComponent(codeOrSlug));
  const records = data.records.filter((r) => matchesCourse(r, course.code));

  return {
    ...data,
    course,
    records,
    announcements: records.filter(
      (r) => r.category === "announcement" || r.category === "syllabus"
    ),
    quizzes: records.filter((r) => r.category === "quiz").sort(compareByDateAsc),
    assignments: records
      .filter((r) => r.category === "assignment")
      .sort(compareByDateAsc),
    notes: records.filter((r) => r.category === "note").sort(compareByDateDesc),
    resources: records.filter((r) => r.category === "resource"),
    playlists: records.filter((r) => r.category === "playlist"),
    classLogs: records
      .filter((r) => r.category === "class-log")
      .sort(compareByDateDesc),
  };
}
