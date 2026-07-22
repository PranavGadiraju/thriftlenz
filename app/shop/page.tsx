import { Camera } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { ShopBrowser } from "@/components/shop/shop-browser";
import { products } from "@/data/live-products";
import { getBrands, getPriceCeiling, getPriceFloor, getSizes } from "@/lib/catalogue";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse every piece in the current ThriftLenz edit. Filter by brand, size, and price.",
};

export default function ShopPage() {
  return (
    <div className="container py-12 sm:py-16">
      <header className="max-w-2xl">
        <p className="text-eyebrow uppercase text-accent">The collection</p>
        <h1 className="mt-3 font-display text-[2.25rem] leading-[1.05] tracking-[-0.03em] text-ink sm:text-5xl">
          Everything in the edit
        </h1>
        <p className="mt-4 text-[0.9375rem] leading-relaxed text-muted">
          {products.length} pieces, shown with live clothing photography and listed once. When something
          sells, it is gone.
        </p>
        <Link
          href="/visual-search"
          className="mt-6 inline-flex items-center gap-2 rounded-pill border border-line-strong px-5 py-2.5 text-sm text-ink transition-colors hover:border-ink hover:bg-ink/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
        >
          <Camera className="h-4 w-4 text-accent" aria-hidden="true" />
          Have a photo? Search with it
        </Link>
      </header>

      <div className="mt-12">
        <ShopBrowser
          products={products}
          brands={getBrands()}
          sizes={getSizes()}
          priceFloor={getPriceFloor()}
          priceCeiling={getPriceCeiling()}
        />
      </div>
    </div>
  );
}
