import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("relative overflow-hidden rounded-xl bg-line/60", className)}>
      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/70 to-transparent motion-safe:animate-[shimmer_1.6s_infinite]" />
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="aspect-[4/5] w-full rounded-card" />
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-3.5 w-36" />
      <Skeleton className="h-3 w-14" />
    </div>
  );
}
