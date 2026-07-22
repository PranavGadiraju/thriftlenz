import { products } from "@/data/products";
import { colorDistance, describeColor } from "@/lib/color";
import type { Product } from "@/types";

/** What a photo tells us, whether from on-device colour sampling or from the vision model. */
export type PhotoAttributes = {
  colors: string[];
  category: string | null;
  brand: string | null;
  keywords: string[];
};

export type PhotoMatch = {
  product: Product;
  score: number;
  reasons: string[];
};

export const CATEGORIES = [
  "Jackets",
  "Sweatshirts",
  "T-shirts",
  "Shirts",
  "Pants",
  "Denim",
  "Knitwear",
];

const WEIGHTS = { color: 0.5, category: 0.28, keyword: 0.14, brand: 0.08 };

function colorScore(product: Product, colors: string[]): { score: number; distance: number } {
  if (colors.length === 0) return { score: 0.5, distance: Number.POSITIVE_INFINITY };
  const distance = Math.min(...colors.map((color) => colorDistance(color, product.colorHex)));
  // 0 delta is a perfect match; anything past 70 carries no signal.
  return { score: Math.max(0, 1 - distance / 70), distance };
}

function keywordScore(product: Product, keywords: string[]): { score: number; hits: string[] } {
  if (keywords.length === 0) return { score: 0, hits: [] };
  const haystack = `${product.brand} ${product.name} ${product.category} ${product.description}`
    .toLowerCase();
  const hits = keywords
    .map((keyword) => keyword.trim().toLowerCase())
    .filter((keyword) => keyword.length > 2 && haystack.includes(keyword));
  return { score: Math.min(1, hits.length / 3), hits: Array.from(new Set(hits)) };
}

export function matchProducts(attributes: PhotoAttributes, limit = 8): PhotoMatch[] {
  const matches = products.map((product) => {
    const color = colorScore(product, attributes.colors);
    const keyword = keywordScore(product, attributes.keywords);

    const categoryMatch =
      attributes.category !== null &&
      product.category.toLowerCase() === attributes.category.toLowerCase();
    const brandMatch =
      attributes.brand !== null &&
      product.brand.toLowerCase().includes(attributes.brand.toLowerCase());

    const score =
      WEIGHTS.color * color.score +
      WEIGHTS.category * (attributes.category === null ? 0.5 : categoryMatch ? 1 : 0) +
      WEIGHTS.keyword * keyword.score +
      WEIGHTS.brand * (brandMatch ? 1 : 0);

    const reasons: string[] = [];
    if (color.distance < 18) reasons.push(`Close ${describeColor(product.colorHex)} match`);
    else if (color.distance < 34) reasons.push(`Similar ${describeColor(product.colorHex)} tone`);
    if (categoryMatch) reasons.push(`Same category: ${product.category.toLowerCase()}`);
    if (brandMatch) reasons.push(`Brand match: ${product.brand}`);
    if (keyword.hits.length > 0) reasons.push(`Matches ${keyword.hits.slice(0, 2).join(", ")}`);
    if (reasons.length === 0) reasons.push("Loose match on colour and cut");

    return { product, score, reasons };
  });

  return matches
    .sort((a, b) => b.score - a.score || a.product.price - b.product.price)
    .slice(0, limit);
}

/** Normalises whatever the vision model returned into attributes we can score with. */
export function mergeAttributes(
  sampled: string[],
  vision: Partial<PhotoAttributes> | null,
  chosenCategory: string | null,
): PhotoAttributes {
  const visionColors = (vision?.colors ?? []).filter((color) => /^#[0-9a-f]{6}$/i.test(color));
  return {
    colors: [...visionColors, ...sampled].slice(0, 4),
    category: vision?.category ?? chosenCategory,
    brand: vision?.brand ?? null,
    keywords: vision?.keywords ?? [],
  };
}
