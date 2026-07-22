"use client";

import Image from "next/image";
import Link from "next/link";
import { FavoriteButton } from "@/components/product/favorite-button";
import { PriceDisplay } from "@/components/ui/price-display";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

type ProductCardProps = {
  product: Product;
  priority?: boolean;
  className?: string;
};

export function ProductCard({ product, priority = false, className }: ProductCardProps) {
  const href = product.externalUrl ?? `/product/${product.slug}`;
  const isExternal = Boolean(product.externalUrl);

  return (
    <article className={cn("group relative", className)}>
      <div className="relative aspect-[4/5] overflow-hidden rounded-card border border-line bg-surface shadow-card transition-all duration-300 ease-smooth group-hover:-translate-y-1 group-hover:shadow-lift motion-reduce:transform-none motion-reduce:transition-none">
        <Image
          src={product.images[0]}
          alt={`${product.brand} ${product.name} in ${product.color.toLowerCase()}`}
          fill
          priority={priority}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 ease-smooth group-hover:scale-[1.04] motion-reduce:transform-none motion-reduce:transition-none"
        />
        <span className="absolute left-3 top-3 rounded-pill bg-canvas/85 px-2.5 py-1 text-eyebrow uppercase text-ink-soft backdrop-blur-sm">
          {product.source ?? product.condition}
        </span>
        {!isExternal && (
          <FavoriteButton
            productId={product.id}
            productName={`${product.brand} ${product.name}`}
            className="absolute right-3 top-3 z-20 opacity-100 transition-opacity duration-200 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
          />
        )}
      </div>

      <div className="mt-3.5 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-eyebrow uppercase text-muted">{product.brand}</p>
          <h3 className="mt-1 line-clamp-2 text-[0.9375rem] leading-snug text-ink">{product.name}</h3>
          <p className="mt-1 text-[0.8125rem] text-muted">Size {product.size}</p>
        </div>
        <PriceDisplay value={product.price} className="mt-[1.125rem] shrink-0" />
      </div>

      <Link
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer sponsored" : undefined}
        className="absolute inset-0 rounded-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-canvas"
      >
        <span className="sr-only">
          {`${product.brand} ${product.name}, size ${product.size}, ${formatPrice(product.price)}${isExternal ? ", opens on eBay" : ""}`}
        </span>
      </Link>
    </article>
  );
}
