# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Students of one IPE (Industrial & Production Engineering) section at IUT, Winter 2026 semester. One classmate maintains the Notion course board; the whole section reads the portal. The dominant moment is a phone check between classes: "what's due, what's next, did I miss an announcement?" Longer laptop sessions happen for notes, resources and the calendar.

## Product Purpose

Turns the section's Notion "Winter 2026 Course Board" into a fast, read-only portal: upcoming quizzes and assignments, events, class logs and notes, resources and playlists, per-course progress. Success = a classmate knows what is due next within seconds of opening it, and never has to dig through Notion.

## Positioning

Built by a student for their own section, fed live from the board the class already maintains. It knows the actual Winter 2026 IPE course list (IPE 4705–4726 lectures and labs) and the section's own conventions (who prepped, who noted, cutoff days, marks).

## Operating Context

- Data: Notion database, fetched server-side, cached 5 minutes (`src/lib/notion.ts`). Properties: Title, Course, Course name, Date, Link, Marks, Noted by, Posted, Prep by, Semester, Status (To do / In progress / Done), Topics, Type, Countdown, Cutoff (days).
- Record categories: quiz, assignment, announcement, syllabus, event, note, resource, playlist, class-log, other.
- Routes: Dashboard, Courses (+ course detail), Assessments, Calendar, Class Notes, Resources, Class Progress. Global search (Ctrl/Cmd K).
- Deployed on Vercel (project `academic-portal`).

## Capabilities and Constraints

- Read-only; no auth, no writes back to Notion.
- Next.js 15 App Router, React 19, Tailwind v4, lucide-react, date-fns.
- Must degrade gracefully when Notion env vars are missing (setup banner) or the API errors.
- Primarily used on phones: thumb reach, fast first paint, legible at a glance.

## Evidence on Hand

Real data lives only in Notion. No testimonials, usage stats, or logos exist; do not fabricate them.

## Product Principles

1. "What's next" beats everything: urgency and due dates lead every surface.
2. Phone-first glanceability; depth is one tap away.
3. Trust the board: show who prepped/noted and when it synced; never invent data.
4. Every course is recognizable at a glance, consistently across pages.
