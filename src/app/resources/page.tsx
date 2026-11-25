import type { Metadata } from "next";
import { SetupBanner } from "@/components/layout/SetupBanner";
import { ResourcesClient } from "@/components/resources/ResourcesClient";
import { getPortalData } from "@/lib/notion";
import { getAllCoursesFromRecords } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Resources & Playlists",
  description:
    "Study materials, books, previous questions, Drive links, and online class playlists.",
};

export const revalidate = 300;

export default async function ResourcesPage() {
  const data = await getPortalData();
  const resources = data.records.filter((r) => r.category === "resource");
  const playlists = data.records.filter((r) => r.category === "playlist");
  const courses = getAllCoursesFromRecords(data.records);

  return (
    <div className="space-y-6">
      <SetupBanner configured={data.configured} error={data.error} />

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Resources & Online Class Playlists
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Previous questions, books, Drive folders, study materials, and semester-organized lecture playlists.
        </p>
      </div>

      <ResourcesClient
        resources={resources}
        playlists={playlists}
        courses={courses}
      />
    </div>
  );
}
