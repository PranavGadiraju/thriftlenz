"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type = "text", ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        "h-11 w-full rounded-xl border border-line bg-surface px-4 text-sm text-ink placeholder:text-muted-foreground",
        "transition-colors duration-200 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25",
        "aria-[invalid=true]:border-[#A5503F] aria-[invalid=true]:focus:ring-[#A5503F]/25",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";
