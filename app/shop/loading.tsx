import { ProductCardSkeleton, Skeleton } from "@/components/ui/skeleton";

export default function ShopLoading() {
  return (
    <div className="container py-12 sm:py-16">
      <Skeleton className="h-3 w-28" />
      <Skeleton className="mt-4 h-11 w-80 max-w-full" />
      <Skeleton className="mt-4 h-4 w-96 max-w-full" />
      <Skeleton className="mt-12 h-12 w-full rounded-pill" />
      <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-6 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <li key={index}>
            <ProductCardSkeleton />
          </li>
        ))}
      </ul>
    </div>
  );
}
