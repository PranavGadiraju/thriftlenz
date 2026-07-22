"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartLine } from "@/types";

/** Every piece is one-of-one, so a line can never exceed a single unit. */
export const MAX_QUANTITY_PER_ITEM = 1;

const CART_KEY = "thriftlenz.cart.v1";
const FAVORITES_KEY = "thriftlenz.favorites.v1";

type StoreValue = {
  /** False during the first client render so server and client markup match. */
  hydrated: boolean;
  cart: CartLine[];
  favorites: string[];
  cartCount: number;
  favoritesCount: number;
  isInCart: (productId: string) => boolean;
  isFavorite: (productId: string) => boolean;
  addToCart: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  toggleFavorite: (productId: string) => void;
  removeFavorite: (productId: string) => void;
};

const StoreContext = createContext<StoreValue | null>(null);

function readStored<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStored(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* Storage can be unavailable in private modes; the session still works. */
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    setCart(readStored<CartLine[]>(CART_KEY, []));
    setFavorites(readStored<string[]>(FAVORITES_KEY, []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeStored(CART_KEY, cart);
  }, [cart, hydrated]);

  useEffect(() => {
    if (hydrated) writeStored(FAVORITES_KEY, favorites);
  }, [favorites, hydrated]);

  const addToCart = useCallback((productId: string) => {
    setCart((current) =>
      current.some((line) => line.productId === productId)
        ? current
        : [...current, { productId, quantity: 1 }],
    );
  }, []);

  const setQuantity = useCallback((productId: string, quantity: number) => {
    const next = Math.min(Math.max(quantity, 1), MAX_QUANTITY_PER_ITEM);
    setCart((current) =>
      current.map((line) => (line.productId === productId ? { ...line, quantity: next } : line)),
    );
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((current) => current.filter((line) => line.productId !== productId));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleFavorite = useCallback((productId: string) => {
    setFavorites((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId],
    );
  }, []);

  const removeFavorite = useCallback((productId: string) => {
    setFavorites((current) => current.filter((id) => id !== productId));
  }, []);

  const value = useMemo<StoreValue>(
    () => ({
      hydrated,
      cart,
      favorites,
      cartCount: cart.reduce((total, line) => total + line.quantity, 0),
      favoritesCount: favorites.length,
      isInCart: (productId) => cart.some((line) => line.productId === productId),
      isFavorite: (productId) => favorites.includes(productId),
      addToCart,
      setQuantity,
      removeFromCart,
      clearCart,
      toggleFavorite,
      removeFavorite,
    }),
    [
      hydrated,
      cart,
      favorites,
      addToCart,
      setQuantity,
      removeFromCart,
      clearCart,
      toggleFavorite,
      removeFavorite,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used inside StoreProvider");
  return context;
}
