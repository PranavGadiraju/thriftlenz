import { ArrowRight, Camera } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { LensMark } from "@/components/layout/wordmark";
import { ProductGrid } from "@/components/product/product-grid";
import { Button } from "@/components/ui/button";
import { getFeaturedProducts } from "@/lib/catalogue";
import { getDummyProducts } from "@/lib/dummy-products";

export const revalidate = 3600;

export default async function HomePage() {
  const products = await getDummyProducts();
  const featured = getFeaturedProducts(12, products);

  return (
    <>
      <section className="border-b border-line">
        <div className="container grid items-center gap-12 py-14 lg:grid-cols-[1fr_0.85fr] lg:gap-20 lg:py-24">
          <div className="animate-fade-up">
            <p className="text-eyebrow uppercase text-accent">The current edit · {products.length} pieces</p>
            <h1 className="mt-6 font-display text-[2.75rem] font-normal leading-[1.02] tracking-[-0.03em] text-ink sm:text-6xl lg:text-[4.25rem]">
              Curated secondhand<br /><span className="italic">clothing.</span>
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-muted">Distinctive pieces, carefully selected so finding something worth wearing feels effortless.</p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Button asChild size="lg"><Link href="/shop">Browse collection <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link></Button>
              <Button asChild variant="outline" size="lg"><Link href="/visual-search"><Camera className="h-4 w-4" aria-hidden="true" />Search by photo</Link></Button>
            </div>
          </div>
          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] border border-line bg-surface sm:aspect-[5/4] lg:aspect-[4/5]">
              <Image src="/images/hero-edit.svg" alt="Three pieces from the current ThriftLenz edit" fill priority sizes="(max-width: 1024px) 100vw, 45vw" className="object-cover" />
            </div>
          </div>
        </div>
      </section>
      <section aria-labelledby="featured-heading" className="container py-16 sm:py-20">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div><p className="text-eyebrow uppercase text-accent">Featured</p><h2 id="featured-heading" className="mt-3 font-display text-[1.75rem] leading-[1.1] tracking-[-0.02em] text-ink sm:text-[2.5rem]">This week&rsquo;s selection</h2></div>
          <Link href="/shop" className="group inline-flex items-center gap-2 text-sm text-ink underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-ink">See everything <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" /></Link>
        </div>
        <ProductGrid products={featured} className="mt-10" />
      </section>
      <section aria-labelledby="editorial-heading" className="border-t border-line bg-surface/60"><div className="container py-20 text-center sm:py-24"><div className="mx-auto max-w-xl"><span className="rule-lens mx-auto max-w-xs"><LensMark className="h-5 w-5 text-accent" /></span><h2 id="editorial-heading" className="mt-8 font-display text-[2rem] leading-[1.1] tracking-[-0.02em] text-ink sm:text-[2.75rem]">Better pieces. Less searching.</h2><p className="mt-5 text-[0.9375rem] leading-relaxed text-muted">Every listing is selected for condition, style, and wearability, giving secondhand shopping a more intentional experience.</p><Button asChild variant="outline" size="lg" className="mt-9"><Link href="/about">How we select</Link></Button></div></div></section>
    </>
  );
}
