"use client";

import { ArrowRight, Ruler } from "lucide-react";
import Link from "next/link";
import { FavoriteButton } from "@/components/product/favorite-button";
import { Button } from "@/components/ui/button";
import { useStore } from "@/context/store-context";
import { useToast } from "@/context/toast-context";
import type { Product } from "@/types";

export function ProductActions({ product }: { product: Product }) {
  const { addToCart, isInCart, hydrated } = useStore();
  const { toast } = useToast();
  const inCart = hydrated && isInCart(product.id);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        {inCart ? (
          <Button asChild size="lg" variant="outline" className="flex-1">
            <Link href="/cart">
              In your cart — view cart
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        ) : (
          <Button
            size="lg"
            className="flex-1"
            onClick={() => {
              addToCart(product.id);
              toast("Added to cart", `${product.brand} ${product.name}`);
            }}
          >
            Add to cart
          </Button>
        )}
        <FavoriteButton
          productId={product.id}
          productName={`${product.brand} ${product.name}`}
          variant="inline"
        />
      </div>

      <details className="group rounded-2xl border border-line bg-surface px-5 py-4">
        <summary className="flex cursor-pointer list-none items-center justify-between text-sm text-ink marker:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-canvas">
          <span className="flex items-center gap-2">
            <Ruler className="h-4 w-4 text-accent" aria-hidden="true" />
            Size and fit
          </span>
          <span className="text-eyebrow uppercase text-muted transition-transform group-open:rotate-180">
            ▾
          </span>
        </summary>
        <div className="mt-3 space-y-2 text-[0.8125rem] leading-relaxed text-muted">
          <p>
            Listed as size {product.size}. Vintage sizing runs differently from modern labels, so
            compare against a piece you already own.
          </p>
          <p>
            Measurements are taken flat and are available on request before you order. Returns are
            accepted within 14 days if the fit is wrong.
          </p>
        </div>
      </details>

      <Link
        href="/shop"
        className="inline-flex items-center gap-2 text-sm text-muted underline decoration-line-strong underline-offset-4 transition-colors hover:text-ink hover:decoration-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
      >
        Continue shopping
      </Link>
    </div>
  );
}
