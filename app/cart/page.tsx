import type { Metadata } from "next";
import { CartView } from "@/components/cart/cart-view";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review the pieces in your ThriftLenz cart.",
};

export default function CartPage() {
  return (
    <div className="container py-12 sm:py-16">
      <header className="max-w-2xl">
        <p className="text-eyebrow uppercase text-accent">Your bag</p>
        <h1 className="mt-3 font-display text-[2.25rem] leading-[1.05] tracking-[-0.03em] text-ink sm:text-5xl">
          Cart
        </h1>
      </header>
      <div className="mt-12">
        <CartView />
      </div>
    </div>
  );
}
