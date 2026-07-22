import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductActions } from "@/components/product/product-actions";
import { ProductGallery } from "@/components/product/product-gallery";
import { SimilarItems } from "@/components/product/similar-items";
import { PriceDisplay } from "@/components/ui/price-display";
import { Tag } from "@/components/ui/tag";
import { products } from "@/data/products";
import { getProductBySlug, getSimilarProducts } from "@/lib/catalogue";

type ProductPageProps = { params: { slug: string } };

/** Only the slugs in the catalogue exist; anything else falls through to the 404 page. */
export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export function generateMetadata({ params }: ProductPageProps): Metadata {
  const product = getProductBySlug(params.slug);
  if (!product) return { title: "Piece not found" };

  return {
    title: `${product.brand} ${product.name}`,
    description: product.description,
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();

  const similar = getSimilarProducts(product, 4);

  const specs = [
    { label: "Brand", value: product.brand },
    { label: "Size", value: product.size },
    { label: "Condition", value: product.condition },
    { label: "Category", value: product.category },
    { label: "Color", value: product.color },
  ];

  return (
    <div className="container py-8 sm:py-12">
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2 text-[0.8125rem] text-muted">
          <li>
            <Link
              href="/"
              className="transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
            >
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link
              href="/shop"
              className="transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
            >
              Shop
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-ink" aria-current="page">
            {product.name}
          </li>
        </ol>
      </nav>

      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
        <ProductGallery images={product.images} alt={`${product.brand} ${product.name}`} />

        <div className="lg:pt-4">
          <p className="text-eyebrow uppercase text-accent">{product.brand}</p>
          <h1 className="mt-3 font-display text-[2rem] leading-[1.08] tracking-[-0.02em] text-ink sm:text-[2.75rem]">
            {product.name}
          </h1>
          <div className="mt-4 flex items-center gap-4">
            <PriceDisplay value={product.price} size="lg" />
            <Tag tone="accent">{product.condition}</Tag>
          </div>

          <p className="mt-7 text-[0.9375rem] leading-relaxed text-muted">{product.description}</p>

          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-y border-line py-7 sm:grid-cols-3">
            {specs.map((spec) => (
              <div key={spec.label}>
                <dt className="text-eyebrow uppercase text-muted">{spec.label}</dt>
                <dd className="mt-1.5 text-sm text-ink">{spec.value}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-6 text-[0.8125rem] leading-relaxed text-muted">
            Each piece is individually selected and available in limited quantity — this one is a
            single unit, so once it sells the listing closes for good.
          </p>

          <div className="mt-8">
            <ProductActions product={product} />
          </div>
        </div>
      </div>

      <div className="mt-24">
        <SimilarItems products={similar} />
      </div>
    </div>
  );
}
