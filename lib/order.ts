import type { Order } from "@/types";

export const ORDER_STORAGE_KEY = "thriftlenz.lastOrder.v1";

export function readLastOrder(): Order | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(ORDER_STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "number" in parsed &&
      "lines" in parsed &&
      Array.isArray((parsed as Order).lines)
    ) {
      return parsed as Order;
    }
    return null;
  } catch {
    return null;
  }
}
