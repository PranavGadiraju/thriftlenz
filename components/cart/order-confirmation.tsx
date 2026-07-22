"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate, formatPrice } from "@/lib/format";
import { readLastOrder } from "@/lib/order";
import type { Order } from "@/types";

export function OrderConfirmation() {
  const [order, setOrder] = useState<Order | null>(null);
  const [ready, setReady] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    setOrder(readLastOrder());
    setReady(true);
  }, []);

  if (!ready) {
    return <Skeleton className="h-96 w-full rounded-card" />;
  }

  if (!order) {
    return (
      <EmptyState
        icon={<Check className="h-6 w-6" aria-hidden="true" />}
        title="No recent order to show"
        description="Order details are kept for this browser session only. Start a new order any time."
        actionLabel="Browse the collection"
        actionHref="/shop"
      />
    );
  }

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto max-w-2xl"
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white">
        <Check className="h-6 w-6" aria-hidden="true" />
      </span>
      <h1 className="mt-7 font-display text-4xl leading-[1.05] tracking-[-0.02em] text-ink sm:text-5xl">
        Your order is confirmed.
      </h1>
      <p className="mt-4 text-[0.9375rem] leading-relaxed text-muted">
        Thanks for giving a great piece another life. A receipt is on its way to {order.email}.
      </p>

      <dl className="mt-10 grid grid-cols-2 gap-6 rounded-card border border-line bg-surface p-6 sm:grid-cols-3">
        <div>
          <dt className="text-eyebrow uppercase text-muted">Order number</dt>
          <dd className="mt-1.5 text-sm tabular-nums text-ink">{order.number}</dd>
        </div>
        <div>
          <dt className="text-eyebrow uppercase text-muted">Placed</dt>
          <dd className="mt-1.5 text-sm text-ink">{formatDate(order.placedAt)}</dd>
        </div>
        <div>
          <dt className="text-eyebrow uppercase text-muted">Total</dt>
          <dd className="mt-1.5 text-sm tabular-nums text-ink">{formatPrice(order.total)}</dd>
        </div>
      </dl>

      <section aria-labelledby="summary-heading" className="mt-10">
        <h2 id="summary-heading" className="text-eyebrow uppercase text-muted">
          Order summary
        </h2>
        <ul className="mt-5 divide-y divide-line border-y border-line">
          {order.lines.map((line) => (
            <li key={line.productId} className="flex items-center gap-4 py-4">
              <div className="relative aspect-[4/5] w-16 shrink-0 overflow-hidden rounded-lg border border-line bg-surface">
                <Image src={line.image} alt="" fill sizes="64px" className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-eyebrow uppercase text-muted">{line.brand}</p>
                <p className="mt-1 truncate text-[0.9375rem] text-ink">{line.name}</p>
                <p className="mt-1 text-[0.8125rem] text-muted">
                  Size {line.size} · Qty {line.quantity}
                </p>
              </div>
              <span className="text-[0.9375rem] tabular-nums text-ink">
                {formatPrice(line.price * line.quantity)}
              </span>
            </li>
          ))}
        </ul>

        <dl className="mt-5 space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <dt className="text-muted">Subtotal</dt>
            <dd className="tabular-nums text-ink">{formatPrice(order.subtotal)}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-muted">Shipping</dt>
            <dd className="tabular-nums text-ink">{formatPrice(order.shipping)}</dd>
          </div>
          <div className="flex items-center justify-between border-t border-line pt-4 text-[0.9375rem]">
            <dt className="text-ink">Total</dt>
            <dd className="tabular-nums text-ink">{formatPrice(order.total)}</dd>
          </div>
        </dl>
      </section>

      <Button asChild size="lg" className="mt-10">
        <Link href="/shop">Continue shopping</Link>
      </Button>
    </motion.div>
  );
}
