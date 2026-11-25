import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "outline";
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
        variant === "default" && "border-teal-200 bg-teal-50 text-teal-800",
        variant === "secondary" && "border-slate-200 bg-slate-100 text-slate-700",
        variant === "outline" && "border-slate-200 bg-white text-slate-700",
        className
      )}
      {...props}
    />
  );
}
