import { products as seededProducts } from "@/data/products";
import type { Product } from "@/types";

/**
 * Keeps the curated catalogue metadata while loading real clothing photography
 * from a live image feed. The lock values keep each product visually stable
 * across refreshes while the images are still served remotely rather than from
 * the generated SVG assets in the repository.
 */
function liveImageUrl(product: Product, view: number): string {
  const query = [
    product.brand,
    product.category,
    product.name,
    "vintage clothing fashion",
  ]
    .join(",")
    .replace(/[^a-zA-Z0-9, -]/g, "")
    .replace(/\s+/g, "-");

  const numericId = Number(product.id.replace(/\D/g, "")) || 1;
  const lock = numericId * 10 + view;
  return `https://loremflickr.com/900/1100/${encodeURIComponent(query)}?lock=${lock}`;
}

export const products: Product[] = seededProducts.map((product) => ({
  ...product,
  images: [1, 2, 3].map((view) => liveImageUrl(product, view)),
}));
