import { ProductCard } from "@/components/product/product-card";
import type { Product } from "@/types";

export function SimilarItems({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <section aria-labelledby="similar-heading" className="border-t border-line pt-14">
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="text-eyebrow uppercase text-accent">Also in the edit</p>
          <h2
            id="similar-heading"
            className="mt-3 font-display text-[1.75rem] tracking-[-0.02em] text-ink sm:text-[2rem]"
          >
            Similar pieces
          </h2>
        </div>
      </div>
      <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-6 lg:grid-cols-4">
        {products.map((product) => (
          <li key={product.id}>
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </section>
  );
}
