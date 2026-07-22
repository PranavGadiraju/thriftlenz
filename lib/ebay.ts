import "server-only";

import { products as fallbackProducts } from "@/data/products";
import type { Condition, Product } from "@/types";

type EbayAspect = {
  localizedName?: string;
  localizedValues?: string[];
};

type EbayItemSummary = {
  itemId?: string;
  title?: string;
  itemWebUrl?: string;
  image?: { imageUrl?: string };
  additionalImages?: Array<{ imageUrl?: string }>;
  price?: { value?: string; currency?: string };
  condition?: string;
  itemCreationDate?: string;
  categories?: Array<{ categoryName?: string }>;
  localizedAspects?: EbayAspect[];
};

type EbaySearchResponse = {
  itemSummaries?: EbayItemSummary[];
};

type EbayTokenResponse = {
  access_token?: string;
  expires_in?: number;
};

const EBAY_SCOPE = "https://api.ebay.com/oauth/api_scope";
const DEFAULT_QUERY = "vintage clothing";

function ebayBaseUrl(): string {
  return process.env.EBAY_ENV === "sandbox"
    ? "https://api.sandbox.ebay.com"
    : "https://api.ebay.com";
}

function marketplaceId(): string {
  return process.env.EBAY_MARKETPLACE_ID ?? "EBAY_US";
}

function deliveryCountry(): string {
  return process.env.EBAY_DELIVERY_COUNTRY ?? "US";
}

async function getApplicationToken(): Promise<string> {
  const clientId = process.env.EBAY_CLIENT_ID;
  const clientSecret = process.env.EBAY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Missing EBAY_CLIENT_ID or EBAY_CLIENT_SECRET");
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const response = await fetch(`${ebayBaseUrl()}/identity/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      scope: EBAY_SCOPE,
    }),
    next: { revalidate: 6_600 },
  });

  if (!response.ok) {
    throw new Error(`eBay OAuth failed with status ${response.status}`);
  }

  const payload = (await response.json()) as EbayTokenResponse;
  if (!payload.access_token) throw new Error("eBay OAuth returned no access token");
  return payload.access_token;
}

function aspectValue(item: EbayItemSummary, names: string[]): string | undefined {
  const normalizedNames = names.map((name) => name.toLowerCase());
  return item.localizedAspects
    ?.find((aspect) => normalizedNames.includes(aspect.localizedName?.toLowerCase() ?? ""))
    ?.localizedValues?.[0];
}

function normalizeCondition(value?: string): Condition {
  const condition = value?.toLowerCase() ?? "";
  if (condition.includes("new") || condition.includes("excellent")) return "Excellent";
  if (condition.includes("very good") || condition.includes("pre-owned")) return "Very Good";
  return "Good";
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);
}

function inferBrand(item: EbayItemSummary): string {
  const explicit = aspectValue(item, ["Brand"]);
  if (explicit) return explicit;
  const title = item.title?.trim() ?? "Marketplace find";
  return title.split(/\s+/).slice(0, 2).join(" ");
}

function mapItem(item: EbayItemSummary, index: number): Product | null {
  const itemId = item.itemId;
  const title = item.title;
  const itemUrl = item.itemWebUrl;
  const primaryImage = item.image?.imageUrl;
  const price = Number(item.price?.value);

  if (!itemId || !title || !itemUrl || !primaryImage || !Number.isFinite(price)) return null;

  const brand = inferBrand(item);
  const size = aspectValue(item, ["Size", "US Size", "Waist Size"]) ?? "See listing";
  const color = aspectValue(item, ["Color", "Colour"]) ?? "See photos";
  const category = item.categories?.[0]?.categoryName ?? "Clothing";
  const images = [primaryImage, ...(item.additionalImages ?? []).map((image) => image.imageUrl)]
    .filter((image): image is string => Boolean(image))
    .slice(0, 3);

  return {
    id: `ebay-${itemId}`,
    slug: `${slugify(title)}-${index}`,
    brand,
    name: title,
    category,
    price,
    size,
    condition: normalizeCondition(item.condition),
    color,
    colorHex: "#8A847A",
    description: `${item.condition ?? "Pre-owned"} clothing listing discovered through eBay. Open the original listing for the seller description, measurements, shipping, and availability.`,
    images,
    featured: index < 12,
    createdAt: item.itemCreationDate ?? new Date().toISOString(),
    externalUrl: itemUrl,
    source: "eBay",
  };
}

export function ebayIsConfigured(): boolean {
  return Boolean(process.env.EBAY_CLIENT_ID && process.env.EBAY_CLIENT_SECRET);
}

export async function getMarketplaceProducts(limit = 40): Promise<Product[]> {
  if (!ebayIsConfigured()) return fallbackProducts;

  try {
    const token = await getApplicationToken();
    const params = new URLSearchParams({
      q: process.env.EBAY_SEARCH_QUERY ?? DEFAULT_QUERY,
      limit: String(Math.min(Math.max(limit, 1), 100)),
      filter: `conditions:{USED},buyingOptions:{FIXED_PRICE},deliveryCountry:${deliveryCountry()}`,
    });

    const response = await fetch(
      `${ebayBaseUrl()}/buy/browse/v1/item_summary/search?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-EBAY-C-MARKETPLACE-ID": marketplaceId(),
        },
        next: { revalidate: 900 },
      },
    );

    if (!response.ok) {
      throw new Error(`eBay Browse search failed with status ${response.status}`);
    }

    const payload = (await response.json()) as EbaySearchResponse;
    const mapped = (payload.itemSummaries ?? [])
      .map(mapItem)
      .filter((product): product is Product => product !== null);

    return mapped.length > 0 ? mapped : fallbackProducts;
  } catch (error) {
    console.error("Unable to load eBay inventory; using demo catalogue.", error);
    return fallbackProducts;
  }
}
