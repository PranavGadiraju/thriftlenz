import { cn } from "@/lib/utils";

/**
 * The lens ring is the brand's signature mark: a viewfinder for what is worth keeping.
 * It reappears as a section divider glyph across the site.
 */
export function LensMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("h-5 w-5", className)} aria-hidden="true" fill="none">
      <circle cx="12" cy="12" r="9.25" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="12" cy="12" r="3.5" fill="currentColor" opacity="0.9" />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2", className)}>
      <LensMark className="h-[22px] w-[22px] text-accent" />
      <span className="font-display text-[1.375rem] leading-none tracking-[-0.03em] text-ink">
        Thrift<span className="italic">Lenz</span>
      </span>
    </span>
  );
}
