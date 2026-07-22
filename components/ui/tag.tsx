import { cn } from "@/lib/utils";

export function Tag({
  children,
  className,
  tone = "neutral",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "neutral" | "accent";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-pill border px-2.5 py-1 text-eyebrow uppercase",
        tone === "accent"
          ? "border-accent/25 bg-accent-soft text-accent-hover"
          : "border-line bg-surface text-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}
