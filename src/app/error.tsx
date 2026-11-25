"use client";

import { useEffect } from "react";
import { RotateCcw } from "lucide-react";
import { Stamp, btn } from "@/components/wallet/primitives";
import { cn } from "@/lib/utils";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto mt-8 max-w-lg overflow-hidden text-center ticket">
      <div className="px-6 pt-8 pb-6">
        <Stamp animate className="text-[30px]">
          Void
        </Stamp>
        <h1 className="caps mt-5 text-[24px] font-bold tracking-[0.06em] text-navy">
          This page didn&apos;t load
        </h1>
        <p className="mt-1.5 text-[15px] text-ink-2">
          {error.message || "Something went wrong while reading the board."} Try again; if it keeps
          failing, the Notion board may be unreachable.
        </p>
      </div>
      <div className="tear" />
      <div className="px-6 py-4">
        <button type="button" onClick={reset} className={cn(btn.base, btn.primary, btn.md)}>
          <RotateCcw className="h-4 w-4" strokeWidth={2.25} aria-hidden />
          Try again
        </button>
      </div>
    </div>
  );
}
