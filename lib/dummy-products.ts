import "server-only";

import { products as fallbackProducts } from "@/data/live-products";
import type { Condition, Product } from "@/types";

type DummyProduct = {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  brand?: string;
  thumbnail: string;
  images?: string[];
};

type DummyResponse = { products?: DummyProduct[] };

const CATEGORIES = [
  "mens-shirts",
  "mens-shoes",
  "womens-dresses",
  "womens-shoes",
  "womens-bags",
  "tops",
];

const SIZES = ["S", "M", "L", "XL"];
const CONDITIONS: Condition[] = ["Excellent", "Very Good", "Good"];

function slugify(value: string): string {
  return value.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function categoryLabel(value: string): string {
  return value.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

function mapProduct(item: DummyProduct, index: number): Product {
  const images = [item.thumbnail, ...(item.images ?? [])].filter(Boolean);
  return {
    id: `dummy-${item.id}`,
    slug: `${slugify(item.title)}-${item.id}`,
    brand: item.brand ?? "Independent",
    name: item.title,
    category: categoryLabel(item.category),
    price: Math.round(item.price),
    size: SIZES[index % SIZES.length],
    condition: CONDITIONS[index % CONDITIONS.length],
    color: "See photos",
    colorHex: "#8A847A",
    description: item.description,
    images: Array.from(new Set(images)).slice(0, 4),
    featured: index < 12,
    createdAt: new Date(Date.now() - index * 86_400_000).toISOString(),
    source: "DummyJSON",
  };
}

export async function getDummyProducts(): Promise<Product[]> {
  try {
    const responses = await Promise.all(
      CATEGORIES.map((category) =>
        fetch(`https://dummyjson.com/products/category/${category}?limit=30`, {
          next: { revalidate: 3600 },
        }),
      ),
    );

    if (responses.some((response) => !response.ok)) throw new Error("DummyJSON request failed");

    const payloads = (await Promise.all(responses.map((response) => response.json()))) as DummyResponse[];
    const products = payloads.flatMap((payload) => payload.products ?? []).map(mapProduct);
    return products.length ? products : fallbackProducts;
  } catch (error) {
    console.error("Unable to load DummyJSON catalogue; using local fallback.", error);
    return fallbackProducts;
  }
}
