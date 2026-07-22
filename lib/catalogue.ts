import { products } from "@/data/live-products";
import type { Filters, Product, SortOption } from "@/types";

export const SIZE_ORDER = ["S", "M", "L", "XL"];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}

export function getFeaturedProducts(limit = 12): Product[] {
  const featured = products.filter((product) => product.featured);
  const rest = products.filter((product) => !product.featured);
  return [...featured, ...rest].slice(0, limit);
}

export function getBrands(): string[] {
  return Array.from(new Set(products.map((product) => product.brand))).sort((a, b) =>
    a.localeCompare(b),
  );
}

export function getSizes(): string[] {
  return Array.from(new Set(products.map((product) => product.size))).sort((a, b) => {
    const indexA = SIZE_ORDER.indexOf(a);
    const indexB = SIZE_ORDER.indexOf(b);
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    return a.localeCompare(b);
  });
}

export function getPriceCeiling(): number {
  return Math.max(...products.map((product) => product.price));
}

export function getPriceFloor(): number {
  return Math.min(...products.map((product) => product.price));
}

function matchesQuery(product: Product, query: string): boolean {
  if (!query.trim()) return true;
  const haystack = [product.brand, product.name, product.description, product.category]
    .join(" ")
    .toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => haystack.includes(term));
}

export function applyFilters(source: Product[], filters: Filters): Product[] {
  return source.filter(
    (product) =>
      matchesQuery(product, filters.query) &&
      (filters.brands.length === 0 || filters.brands.includes(product.brand)) &&
      (filters.sizes.length === 0 || filters.sizes.includes(product.size)) &&
      product.price <= filters.maxPrice,
  );
}

export function sortProducts(source: Product[], sort: SortOption): Product[] {
  const list = [...source];
  switch (sort) {
    case "price-asc":
      return list.sort((a, b) => a.price - b.price);
    case "price-desc":
      return list.sort((a, b) => b.price - a.price);
    case "newest":
      return list.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    default:
      return list.sort((a, b) => {
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }
}

/** Similar pieces are ranked by shared brand, category, then size. */
export function getSimilarProducts(product: Product, limit = 4): Product[] {
  return products
    .filter((candidate) => candidate.id !== product.id)
    .map((candidate) => {
      let score = 0;
      if (candidate.brand === product.brand) score += 3;
      if (candidate.category === product.category) score += 2;
      if (candidate.size === product.size) score += 1;
      if (Math.abs(candidate.price - product.price) < 25) score += 1;
      return { candidate, score };
    })
    .sort((a, b) => b.score - a.score || a.candidate.price - b.candidate.price)
    .slice(0, limit)
    .map((entry) => entry.candidate);
}
