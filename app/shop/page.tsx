import { Camera } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { ShopBrowser } from "@/components/shop/shop-browser";
import { getBrands, getPriceCeiling, getPriceFloor, getSizes } from "@/lib/catalogue";
import { getDummyProducts } from "@/lib/dummy-products";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse the current ThriftLenz demo collection.",
};

export const revalidate = 3600;

export default async function ShopPage() {
  const products = await getDummyProducts();

  return (
    <div className="container py-12 sm:py-16">
      <header className="max-w-2xl">
        <p className="text-eyebrow uppercase text-accent">The collection</p>
        <h1 className="mt-3 font-display text-[2.25rem] leading-[1.05] tracking-[-0.03em] text-ink sm:text-5xl">Everything in the edit</h1>
        <p className="mt-4 text-[0.9375rem] leading-relaxed text-muted">{products.length} demo pieces loaded automatically from a free product API, with images, prices, categories, and descriptions.</p>
        <Link href="/visual-search" className="mt-6 inline-flex items-center gap-2 rounded-pill border border-line-strong px-5 py-2.5 text-sm text-ink transition-colors hover:border-ink hover:bg-ink/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas">
          <Camera className="h-4 w-4 text-accent" aria-hidden="true" />Have a photo? Search with it
        </Link>
      </header>
      <div className="mt-12">
        <ShopBrowser products={products} brands={getBrands(products)} sizes={getSizes(products)} priceFloor={getPriceFloor(products)} priceCeiling={getPriceCeiling(products)} />
      </div>
    </div>
  );
}
