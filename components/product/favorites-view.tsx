"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Heart, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { PriceDisplay } from "@/components/ui/price-display";
import { ProductCardSkeleton } from "@/components/ui/skeleton";
import { useStore } from "@/context/store-context";
import { useToast } from "@/context/toast-context";
import { getProductById } from "@/lib/catalogue";

export function FavoritesView() {
  const { favorites, hydrated, removeFavorite, addToCart, isInCart } = useStore();
  const { toast } = useToast();

  if (!hydrated) {
    return (
      <ul className="grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-6 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <li key={index}>
            <ProductCardSkeleton />
          </li>
        ))}
      </ul>
    );
  }

  const saved = favorites
    .map((id) => getProductById(id))
    .filter((product): product is NonNullable<typeof product> => Boolean(product));

  if (saved.length === 0) {
    return (
      <EmptyState
        icon={<Heart className="h-6 w-6" aria-hidden="true" />}
        title="No favorites yet"
        description="Tap the heart on any piece to keep it here while you decide."
        actionLabel="Browse the collection"
        actionHref="/shop"
      />
    );
  }

  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-3 xl:grid-cols-4">
      <AnimatePresence initial={false}>
        {saved.map((product) => (
          <motion.li
            key={product.id}
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="group relative">
              <Link
                href={`/product/${product.slug}`}
                className="relative block aspect-[4/5] overflow-hidden rounded-card border border-line bg-surface shadow-card transition-all duration-300 ease-smooth hover:-translate-y-1 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-canvas motion-reduce:transform-none"
              >
                <Image
                  src={product.images[0]}
                  alt={`${product.brand} ${product.name}`}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-500 ease-smooth group-hover:scale-[1.04] motion-reduce:transform-none"
                />
              </Link>
              <button
                type="button"
                onClick={() => {
                  removeFavorite(product.id);
                  toast("Removed from favorites", `${product.brand} ${product.name}`);
                }}
                aria-label={`Remove ${product.name} from favorites`}
                className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface/90 text-ink-soft backdrop-blur-sm transition-colors hover:border-ink hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-3.5 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-eyebrow uppercase text-muted">{product.brand}</p>
                <h2 className="mt-1 text-[0.9375rem] leading-snug text-ink">
                  <Link
                    href={`/product/${product.slug}`}
                    className="transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
                  >
                    {product.name}
                  </Link>
                </h2>
                <p className="mt-1 text-[0.8125rem] text-muted">Size {product.size}</p>
              </div>
              <PriceDisplay value={product.price} className="mt-[1.125rem] shrink-0" />
            </div>

            {isInCart(product.id) ? (
              <Button asChild variant="subtle" size="sm" className="mt-4 w-full">
                <Link href="/cart">In your cart</Link>
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="mt-4 w-full"
                onClick={() => {
                  addToCart(product.id);
                  toast("Added to cart", `${product.brand} ${product.name}`);
                }}
              >
                Add to cart
              </Button>
            )}
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}
