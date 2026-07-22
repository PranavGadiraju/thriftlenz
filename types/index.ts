export type Condition = "Excellent" | "Very Good" | "Good";

export type Product = {
  id: string;
  slug: string;
  brand: string;
  name: string;
  category: string;
  price: number;
  size: string;
  condition: Condition;
  color: string;
  /** Approximate garment colour, used by photo search. */
  colorHex: string;
  description: string;
  images: string[];
  featured: boolean;
  createdAt: string;
};

/** Thrift pieces are one-of-one, so stock is fixed at a single unit. */
export type CartLine = {
  productId: string;
  quantity: number;
};

export type SortOption = "featured" | "price-asc" | "price-desc" | "newest";

export type Filters = {
  query: string;
  brands: string[];
  sizes: string[];
  maxPrice: number;
};

export type Order = {
  number: string;
  placedAt: string;
  email: string;
  lines: Array<{
    productId: string;
    quantity: number;
    brand: string;
    name: string;
    size: string;
    price: number;
    image: string;
  }>;
  subtotal: number;
  shipping: number;
  total: number;
};
