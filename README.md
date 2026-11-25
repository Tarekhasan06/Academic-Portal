# Winter 2026 Academic Portal

A modern, responsive academic management portal built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and the **Notion API** (`@notionhq/client`). It transforms the Winter 2026 Course Board in Notion into an interactive portal designed for free deployment on Vercel.

## Architecture

`Notion Database → Notion API (Server-side, cached 5m) → Next.js App Router → Website UI`

- No separate database is required; Notion acts as the CMS.
- All Notion API calls run strictly server-side (`src/lib/notion.ts`).

## Tech Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS + shadcn/ui-style primitives
- `@notionhq/client`
- `lucide-react` & `date-fns`

## Environment Variables

Copy `.env.example` to `.env.local` and set:

```bash
NOTION_TOKEN=secret_your_notion_integration_token
NOTION_DATABASE_ID=your_notion_database_id
```

Make sure your Notion integration has read-only access to the Winter 2026 Course Board database. Never commit `.env.local`.

## Mapped Notion Properties

- `Title`, `Course`, `Course name`, `Date`, `Link`, `Marks`, `Noted by`, `Posted`, `Prep by`, `Semester`, `Status`, `Topics`, `Type`, `Countdown`, `Cutoff (days)`

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Deployment (Vercel)

1. Push this repository to GitHub.
2. Import the repository in Vercel.
3. Add `NOTION_TOKEN` and `NOTION_DATABASE_ID` in **Project Settings → Environment Variables**.
4. Deploy.
