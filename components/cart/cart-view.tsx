"use client";

import { motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { MAX_QUANTITY_PER_ITEM, useStore } from "@/context/store-context";
import { useToast } from "@/context/toast-context";
import { getProductById } from "@/lib/catalogue";
import { SHIPPING_FLAT, formatPrice } from "@/lib/format";

export function CartView() {
  const { cart, hydrated, removeFromCart, setQuantity } = useStore();
  const { toast } = useToast();

  const lines = cart
    .map((line) => ({ line, product: getProductById(line.productId) }))
    .filter((entry): entry is { line: typeof entry.line; product: NonNullable<typeof entry.product> } =>
      Boolean(entry.product),
    );

  if (!hydrated) {
    return (
      <div className="grid gap-12 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          {[0, 1].map((key) => (
            <Skeleton key={key} className="h-36 w-full rounded-card" />
          ))}
        </div>
        <Skeleton className="h-64 w-full rounded-card" />
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <EmptyState
        icon={<ShoppingBag className="h-6 w-6" aria-hidden="true" />}
        title="Your cart is empty"
        description="Pieces you add will wait here. Nothing is reserved until checkout, so favourites move quickly."
        actionLabel="Browse the collection"
        actionHref="/shop"
      />
    );
  }

  const subtotal = lines.reduce((total, { line, product }) => total + product.price * line.quantity, 0);
  const total = subtotal + SHIPPING_FLAT;

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_340px] lg:items-start">
      <ul className="divide-y divide-line border-y border-line">
        {lines.map(({ line, product }) => (
          <motion.li
            key={product.id}
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex gap-5 py-6"
          >
            <Link
              href={`/product/${product.slug}`}
              className="relative aspect-[4/5] w-24 shrink-0 overflow-hidden rounded-xl border border-line bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas sm:w-28"
            >
              <Image
                src={product.images[0]}
                alt={`${product.brand} ${product.name}`}
                fill
                sizes="112px"
                className="object-cover"
              />
            </Link>

            <div className="flex min-w-0 flex-1 flex-col justify-between gap-4">
              <div className="flex items-start justify-between gap-4">
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
                  <p className="mt-1 text-[0.8125rem] text-muted">
                    Size {product.size} · {product.condition}
                  </p>
                </div>
                <span className="shrink-0 text-[0.9375rem] tabular-nums text-ink">
                  {formatPrice(product.price * line.quantity)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center rounded-pill border border-line">
                  <button
                    type="button"
                    onClick={() => setQuantity(product.id, line.quantity - 1)}
                    disabled={line.quantity <= 1}
                    aria-label={`Decrease quantity of ${product.name}`}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-ink/[0.05] disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                  <span className="w-6 text-center text-sm tabular-nums text-ink" aria-live="polite">
                    {line.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(product.id, line.quantity + 1)}
                    disabled={line.quantity >= MAX_QUANTITY_PER_ITEM}
                    aria-label={`Increase quantity of ${product.name}`}
                    title="Each piece is one of a kind"
                    className="flex h-9 w-9 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-ink/[0.05] disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    removeFromCart(product.id);
                    toast("Removed from cart", `${product.brand} ${product.name}`);
                  }}
                  className="inline-flex items-center gap-1.5 text-[0.8125rem] text-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  Remove
                </button>
              </div>
            </div>
          </motion.li>
        ))}
      </ul>

      <aside className="rounded-card border border-line bg-surface p-6 lg:sticky lg:top-28">
        <h2 className="text-eyebrow uppercase text-muted">Order summary</h2>
        <dl className="mt-5 space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <dt className="text-muted">Subtotal</dt>
            <dd className="tabular-nums text-ink">{formatPrice(subtotal)}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-muted">Estimated shipping</dt>
            <dd className="tabular-nums text-ink">{formatPrice(SHIPPING_FLAT)}</dd>
          </div>
          <div className="flex items-center justify-between border-t border-line pt-4 text-[0.9375rem]">
            <dt className="text-ink">Total</dt>
            <dd className="tabular-nums text-ink">{formatPrice(total)}</dd>
          </div>
        </dl>

        <Button asChild size="lg" className="mt-6 w-full">
          <Link href="/checkout">Proceed to checkout</Link>
        </Button>
        <Button asChild variant="link" size="sm" className="mt-4 w-full">
          <Link href="/shop">Continue shopping</Link>
        </Button>
        <p className="mt-5 text-[0.75rem] leading-relaxed text-muted">
          Each piece is one of a kind, so quantities are capped at one. Shipping is a flat placeholder
          rate in this demo.
        </p>
      </aside>
    </div>
  );
}
