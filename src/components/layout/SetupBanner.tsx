import { CloudOff, KeyRound } from "lucide-react";

export function SetupBanner({
  configured,
  error,
}: {
  configured: boolean;
  error: string | null;
}) {
  if (configured && !error) return null;

  const notConfigured = !configured;
  const Icon = notConfigured ? KeyRound : CloudOff;

  return (
    <div
      role="status"
      className="mb-5 flex items-start gap-3 rounded-[8px] border-[1.5px] border-jet bg-jet-wash px-4 py-3 text-navy"
    >
      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-jet" strokeWidth={2} aria-hidden />
      <div className="min-w-0 text-[14px] leading-relaxed">
        <p className="caps text-[15px] tracking-[0.12em] text-jet-ink">
          {notConfigured ? "Board not connected" : "Board unreachable"}
        </p>
        {notConfigured ? (
          <p className="text-ink-2">
            Add <code className="rounded-[3px] bg-coupon px-1 font-mono text-[13px]">NOTION_TOKEN</code>{" "}
            and{" "}
            <code className="rounded-[3px] bg-coupon px-1 font-mono text-[13px]">NOTION_DATABASE_ID</code>{" "}
            to <code className="rounded-[3px] bg-coupon px-1 font-mono text-[13px]">.env.local</code> or
            the Vercel project&apos;s environment variables, then share the Winter 2026 board with the
            integration.
          </p>
        ) : (
          <p className="break-words text-ink-2">
            Notion didn&apos;t answer, so the wallet is empty for now. It retries on the next refresh
            (every 5 min). Details: {error}
          </p>
        )}
      </div>
    </div>
  );
}
