"use client";

import { useEffect } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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
    <Card className="mx-auto mt-10 max-w-lg border-rose-200">
      <CardContent className="flex flex-col items-center p-8 text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h2 className="text-lg font-semibold text-slate-900">
          Something went wrong
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          {error.message || "Unable to load this page right now."}
        </p>
        <Button onClick={reset} className="mt-5" variant="outline">
          <RotateCcw className="h-4 w-4" />
          Try again
        </Button>
      </CardContent>
    </Card>
  );
}
