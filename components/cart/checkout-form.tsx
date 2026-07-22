"use client";

import { Lock, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useStore } from "@/context/store-context";
import { getProductById } from "@/lib/catalogue";
import { SHIPPING_FLAT, formatPrice } from "@/lib/format";
import { ORDER_STORAGE_KEY } from "@/lib/order";
import { cn } from "@/lib/utils";
import type { Order } from "@/types";

type FieldName =
  | "email"
  | "phone"
  | "firstName"
  | "lastName"
  | "address"
  | "city"
  | "state"
  | "zip"
  | "cardName"
  | "cardNumber"
  | "expiry"
  | "cvc";

type FormState = Record<FieldName, string>;

const initialForm: FormState = {
  email: "",
  phone: "",
  firstName: "",
  lastName: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  cardName: "",
  cardNumber: "",
  expiry: "",
  cvc: "",
};

const DELIVERY_OPTIONS = [
  { id: "standard", label: "Standard", detail: "4–6 business days", price: SHIPPING_FLAT },
  { id: "express", label: "Express", detail: "2 business days", price: 18 },
] as const;

type DeliveryId = (typeof DELIVERY_OPTIONS)[number]["id"];

function validate(form: FormState): Partial<Record<FieldName, string>> {
  const errors: Partial<Record<FieldName, string>> = {};
  const required: Array<[FieldName, string]> = [
    ["email", "Enter an email address"],
    ["firstName", "Enter a first name"],
    ["lastName", "Enter a last name"],
    ["address", "Enter a street address"],
    ["city", "Enter a city"],
    ["state", "Enter a state"],
    ["zip", "Enter a ZIP code"],
    ["cardName", "Enter the name on the card"],
    ["cardNumber", "Enter a card number"],
    ["expiry", "Enter an expiry date"],
    ["cvc", "Enter a security code"],
  ];

  required.forEach(([field, message]) => {
    if (!form[field].trim()) errors[field] = message;
  });

  if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errors.email = "Use a valid email address, like name@example.com";
  if (form.zip.trim() && !/^\d{5}$/.test(form.zip.trim()))
    errors.zip = "ZIP codes are five digits";
  if (form.cardNumber.trim() && form.cardNumber.replace(/\D/g, "").length !== 16)
    errors.cardNumber = "Card numbers are 16 digits";
  if (form.expiry.trim() && !/^(0[1-9]|1[0-2])\s?\/\s?\d{2}$/.test(form.expiry.trim()))
    errors.expiry = "Use MM/YY";
  if (form.cvc.trim() && !/^\d{3,4}$/.test(form.cvc.trim()))
    errors.cvc = "Security codes are 3 or 4 digits";

  return errors;
}

export function CheckoutForm() {
  const router = useRouter();
  const { cart, hydrated, clearCart } = useStore();
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [delivery, setDelivery] = useState<DeliveryId>("standard");
  const [submitting, setSubmitting] = useState(false);

  const lines = useMemo(
    () =>
      cart
        .map((line) => ({ line, product: getProductById(line.productId) }))
        .filter(
          (entry): entry is { line: (typeof cart)[number]; product: NonNullable<typeof entry.product> } =>
            Boolean(entry.product),
        ),
    [cart],
  );

  const shipping = DELIVERY_OPTIONS.find((option) => option.id === delivery)?.price ?? SHIPPING_FLAT;
  const subtotal = lines.reduce((total, { line, product }) => total + product.price * line.quantity, 0);
  const total = subtotal + shipping;

  const set = (field: FieldName, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  // Nothing here reaches the network: the order is assembled and stored in the browser.
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found = validate(form);
    setErrors(found);

    const firstError = Object.keys(found)[0];
    if (firstError) {
      document.getElementById(firstError)?.focus();
      return;
    }

    setSubmitting(true);
    const order: Order = {
      number: `TL-${Date.now().toString().slice(-6)}`,
      placedAt: new Date().toISOString(),
      email: form.email.trim(),
      lines: lines.map(({ line, product }) => ({
        productId: product.id,
        quantity: line.quantity,
        brand: product.brand,
        name: product.name,
        size: product.size,
        price: product.price,
        image: product.images[0],
      })),
      subtotal,
      shipping,
      total,
    };

    try {
      window.sessionStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(order));
    } catch {
      /* Confirmation falls back to a generic message if storage is unavailable. */
    }

    clearCart();
    router.push("/confirmation");
  };

  if (!hydrated) {
    return (
      <div className="grid gap-12 lg:grid-cols-[1fr_360px]">
        <Skeleton className="h-[540px] w-full rounded-card" />
        <Skeleton className="h-72 w-full rounded-card" />
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <EmptyState
        icon={<ShoppingBag className="h-6 w-6" aria-hidden="true" />}
        title="There is nothing to check out"
        description="Add a piece to your cart and the checkout will open up."
        actionLabel="Browse the collection"
        actionHref="/shop"
      />
    );
  }

  const field = (
    name: FieldName,
    label: string,
    props: Partial<React.InputHTMLAttributes<HTMLInputElement>> = {},
    className?: string,
  ) => (
    <div className={className}>
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        value={form[name]}
        onChange={(event) => set(name, event.target.value)}
        aria-invalid={Boolean(errors[name])}
        aria-describedby={errors[name] ? `${name}-error` : undefined}
        className="mt-1.5"
        {...props}
      />
      {errors[name] ? (
        <p id={`${name}-error`} className="mt-1.5 text-[0.75rem] text-[#A5503F]">
          {errors[name]}
        </p>
      ) : null}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-12 lg:grid-cols-[1fr_360px] lg:items-start">
      <div className="space-y-12">
        <section aria-labelledby="contact-heading">
          <h2 id="contact-heading" className="font-display text-2xl tracking-[-0.02em] text-ink">
            Contact
          </h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            {field("email", "Email", { type: "email", autoComplete: "email", placeholder: "name@example.com" })}
            {field("phone", "Phone (optional)", { type: "tel", autoComplete: "tel", placeholder: "(555) 019-2847" })}
          </div>
        </section>

        <section aria-labelledby="shipping-heading">
          <h2 id="shipping-heading" className="font-display text-2xl tracking-[-0.02em] text-ink">
            Shipping address
          </h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            {field("firstName", "First name", { autoComplete: "given-name" })}
            {field("lastName", "Last name", { autoComplete: "family-name" })}
            {field("address", "Street address", { autoComplete: "street-address" }, "sm:col-span-2")}
            {field("city", "City", { autoComplete: "address-level2" })}
            <div className="grid grid-cols-2 gap-5">
              {field("state", "State", { autoComplete: "address-level1", maxLength: 2, placeholder: "VA" })}
              {field("zip", "ZIP code", { autoComplete: "postal-code", inputMode: "numeric", maxLength: 5 })}
            </div>
          </div>
        </section>

        <section aria-labelledby="delivery-heading">
          <h2 id="delivery-heading" className="font-display text-2xl tracking-[-0.02em] text-ink">
            Delivery method
          </h2>
          <fieldset className="mt-5 space-y-3">
            <legend className="sr-only">Choose a delivery method</legend>
            {DELIVERY_OPTIONS.map((option) => (
              <label
                key={option.id}
                className={cn(
                  "flex cursor-pointer items-center justify-between gap-4 rounded-2xl border px-5 py-4 transition-colors duration-200",
                  delivery === option.id
                    ? "border-ink bg-surface"
                    : "border-line bg-surface/60 hover:border-line-strong",
                )}
              >
                <span className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="delivery"
                    value={option.id}
                    checked={delivery === option.id}
                    onChange={() => setDelivery(option.id)}
                    className="peer sr-only"
                  />
                  <span
                    aria-hidden="true"
                    className={cn(
                      "flex h-[18px] w-[18px] items-center justify-center rounded-full border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-accent peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-canvas",
                      delivery === option.id ? "border-accent" : "border-line-strong",
                    )}
                  >
                    {delivery === option.id ? (
                      <span className="h-2.5 w-2.5 rounded-full bg-accent" />
                    ) : null}
                  </span>
                  <span>
                    <span className="block text-sm text-ink">{option.label}</span>
                    <span className="block text-[0.8125rem] text-muted">{option.detail}</span>
                  </span>
                </span>
                <span className="text-sm tabular-nums text-ink">{formatPrice(option.price)}</span>
              </label>
            ))}
          </fieldset>
        </section>

        <section aria-labelledby="payment-heading">
          <h2 id="payment-heading" className="font-display text-2xl tracking-[-0.02em] text-ink">
            Payment
          </h2>
          <p className="mt-2 flex items-center gap-2 text-[0.8125rem] text-muted">
            <Lock className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
            Demo checkout. Use the sample card 4242 4242 4242 4242 — nothing is sent anywhere.
          </p>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            {field("cardName", "Name on card", { autoComplete: "off" }, "sm:col-span-2")}
            {field(
              "cardNumber",
              "Card number",
              { inputMode: "numeric", autoComplete: "off", placeholder: "4242 4242 4242 4242", maxLength: 19 },
              "sm:col-span-2",
            )}
            {field("expiry", "Expiry", { placeholder: "12/29", autoComplete: "off", maxLength: 5 })}
            {field("cvc", "Security code", { placeholder: "123", inputMode: "numeric", autoComplete: "off", maxLength: 4 })}
          </div>
        </section>
      </div>

      <aside className="rounded-card border border-line bg-surface p-6 lg:sticky lg:top-28">
        <h2 className="text-eyebrow uppercase text-muted">Your order</h2>
        <ul className="mt-5 space-y-4">
          {lines.map(({ line, product }) => (
            <li key={product.id} className="flex items-center gap-4">
              <div className="relative aspect-[4/5] w-14 shrink-0 overflow-hidden rounded-lg border border-line bg-canvas">
                <Image src={product.images[0]} alt="" fill sizes="56px" className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[0.8125rem] text-ink">{product.name}</p>
                <p className="text-[0.75rem] text-muted">
                  {product.brand} · Size {product.size} · Qty {line.quantity}
                </p>
              </div>
              <span className="text-[0.8125rem] tabular-nums text-ink">
                {formatPrice(product.price * line.quantity)}
              </span>
            </li>
          ))}
        </ul>

        <dl className="mt-6 space-y-3 border-t border-line pt-5 text-sm">
          <div className="flex items-center justify-between">
            <dt className="text-muted">Subtotal</dt>
            <dd className="tabular-nums text-ink">{formatPrice(subtotal)}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-muted">Shipping</dt>
            <dd className="tabular-nums text-ink">{formatPrice(shipping)}</dd>
          </div>
          <div className="flex items-center justify-between border-t border-line pt-4 text-[0.9375rem]">
            <dt className="text-ink">Total</dt>
            <dd className="tabular-nums text-ink">{formatPrice(total)}</dd>
          </div>
        </dl>

        <Button type="submit" size="lg" className="mt-6 w-full" disabled={submitting}>
          {submitting ? "Placing order…" : `Place order · ${formatPrice(total)}`}
        </Button>
        <Button asChild variant="link" size="sm" className="mt-4 w-full">
          <Link href="/cart">Back to cart</Link>
        </Button>
      </aside>
    </form>
  );
}
