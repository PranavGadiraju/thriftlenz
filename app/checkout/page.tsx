import type { Metadata } from "next";
import { CheckoutForm } from "@/components/cart/checkout-form";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Demo checkout for the ThriftLenz prototype.",
};

export default function CheckoutPage() {
  return (
    <div className="container py-12 sm:py-16">
      <header className="max-w-2xl">
        <p className="text-eyebrow uppercase text-accent">Almost yours</p>
        <h1 className="mt-3 font-display text-[2.25rem] leading-[1.05] tracking-[-0.03em] text-ink sm:text-5xl">
          Checkout
        </h1>
      </header>
      <div className="mt-12">
        <CheckoutForm />
      </div>
    </div>
  );
}
