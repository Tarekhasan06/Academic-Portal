import { AlertTriangle, Database } from "lucide-react";

export function SetupBanner({
  configured,
  error,
}: {
  configured: boolean;
  error: string | null;
}) {
  if (configured && !error) return null;

  if (!configured) {
    return (
      <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50/80 p-4 text-amber-950">
        <div className="flex items-start gap-3">
          <Database className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
          <div className="space-y-1 text-sm">
            <p className="font-semibold">Notion Integration Not Configured</p>
            <p className="text-xs leading-relaxed text-amber-900">
              Add <code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono">NOTION_TOKEN</code> and{" "}
              <code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono">NOTION_DATABASE_ID</code>{" "}
              to <code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono">.env.local</code>{" "}
              (or your Vercel Environment Variables) and share your Winter 2026 Notion database with the integration.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50/80 p-4 text-rose-950">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-rose-700" />
        <div className="space-y-1 text-sm">
          <p className="font-semibold">Unable to Fetch Notion Data</p>
          <p className="text-xs text-rose-800">{error}</p>
        </div>
      </div>
    </div>
  );
}
