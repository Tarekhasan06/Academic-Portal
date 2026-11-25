export type RecordStatus = "To do" | "In progress" | "Done";

export type RecordCategory =
  | "quiz"
  | "assignment"
  | "announcement"
  | "syllabus"
  | "event"
  | "note"
  | "resource"
  | "playlist"
  | "class-log"
  | "other";

export interface CourseInfo {
  code: string;
  slug: string;
  name: string;
  shortName: string;
  color: string;
  badgeClass: string;
  dotClass: string;
  borderClass: string;
  isLab: boolean;
}

export interface AcademicRecord {
  id: string;
  notionUrl: string;
  title: string;
  course: string;
  courseName: string;
  date: string | null;
  endDate: string | null;
  link: string | null;
  marks: string | number | null;
  notedBy: string | null;
  posted: string | null;
  prepBy: string | null;
  semester: string;
  status: RecordStatus;
  rawStatus: string | null;
  topics: string[];
  type: string;
  category: RecordCategory;
  countdown: string | number | null;
  cutoffDays: number | null;
}

export interface PortalDataResult {
  records: AcademicRecord[];
  configured: boolean;
  error: string | null;
  fetchedAt: string;
}

export interface CourseSummary {
  course: CourseInfo;
  totalItems: number;
  pendingCount: number;
  completedCount: number;
  quizzesCount: number;
  assignmentsCount: number;
  notesCount: number;
  resourcesCount: number;
  playlistsCount: number;
  classLogsCount: number;
}
