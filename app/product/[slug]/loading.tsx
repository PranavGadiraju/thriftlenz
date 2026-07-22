import { ProductCardSkeleton, Skeleton } from "@/components/ui/skeleton";

export default function ProductLoading() {
  return (
    <div className="container py-8 sm:py-12">
      <Skeleton className="h-3 w-48" />
      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
        <Skeleton className="aspect-[4/5] w-full rounded-card" />
        <div className="space-y-4 lg:pt-4">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-10 w-72 max-w-full" />
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-[52px] w-full rounded-pill" />
        </div>
      </div>
      <ul className="mt-24 grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-6 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <li key={index}>
            <ProductCardSkeleton />
          </li>
        ))}
      </ul>
    </div>
  );
}
