import { Client, isFullPage } from "@notionhq/client";
import { unstable_cache } from "next/cache";
import { mapNotionPageToRecord } from "@/lib/mapper";
import type { AcademicRecord, PortalDataResult } from "@/types/academic";

const NOTION_REVALIDATE_SECONDS = 300; // 5 minutes controlled refresh

function getNotionCredentials(): {
  token: string | undefined;
  databaseId: string | undefined;
  configured: boolean;
} {
  const token = process.env.NOTION_TOKEN?.trim();
  const databaseId = process.env.NOTION_DATABASE_ID?.trim();
  return {
    token,
    databaseId,
    configured: Boolean(token && databaseId),
  };
}

async function fetchAllNotionPages(
  token: string,
  databaseId: string
): Promise<AcademicRecord[]> {
  const client = new Client({ auth: token });
  const records: AcademicRecord[] = [];
  let cursor: string | undefined = undefined;
  let pageCount = 0;
  const maxPages = 20; // Safety guard for free Hobby plan timeout limits

  do {
    const response = await client.databases.query({
      database_id: databaseId,
      start_cursor: cursor,
      page_size: 100,
    });

    for (const result of response.results) {
      if (isFullPage(result)) {
        records.push(mapNotionPageToRecord(result));
      }
    }

    cursor = response.has_more ? response.next_cursor ?? undefined : undefined;
    pageCount += 1;
  } while (cursor && pageCount < maxPages);

  return records;
}

const getCachedNotionRecords = unstable_cache(
  async (token: string, databaseId: string): Promise<AcademicRecord[]> => {
    return fetchAllNotionPages(token, databaseId);
  },
  ["notion-winter-2026-records"],
  { revalidate: NOTION_REVALIDATE_SECONDS, tags: ["notion-records"] }
);

export async function getPortalData(): Promise<PortalDataResult> {
  const { token, databaseId, configured } = getNotionCredentials();
  const fetchedAt = new Date().toISOString();

  if (!configured || !token || !databaseId) {
    return {
      records: [],
      configured: false,
      error: null,
      fetchedAt,
    };
  }

  try {
    const records = await getCachedNotionRecords(token, databaseId);
    return {
      records,
      configured: true,
      error: null,
      fetchedAt,
    };
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "Unable to connect to the Notion database.";
    console.error("[Notion API Error]:", message);
    return {
      records: [],
      configured: true,
      error: message,
      fetchedAt,
    };
  }
}
