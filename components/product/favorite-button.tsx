"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Heart } from "lucide-react";
import { useStore } from "@/context/store-context";
import { useToast } from "@/context/toast-context";
import { cn } from "@/lib/utils";

type FavoriteButtonProps = {
  productId: string;
  productName: string;
  className?: string;
  variant?: "overlay" | "inline";
};

export function FavoriteButton({
  productId,
  productName,
  className,
  variant = "overlay",
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite, hydrated } = useStore();
  const { toast } = useToast();
  const reduceMotion = useReducedMotion();
  const active = hydrated && isFavorite(productId);

  return (
    <motion.button
      type="button"
      whileTap={reduceMotion ? undefined : { scale: 0.88 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      aria-pressed={active}
      aria-label={active ? `Remove ${productName} from favorites` : `Save ${productName} to favorites`}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleFavorite(productId);
        toast(active ? "Removed from favorites" : "Saved to favorites", productName);
      }}
      className={cn(
        "flex items-center justify-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas",
        variant === "overlay" &&
          "h-9 w-9 border border-line bg-surface/90 backdrop-blur-sm hover:border-line-strong",
        variant === "inline" && "h-12 w-12 border border-line-strong bg-surface hover:border-ink",
        className,
      )}
    >
      <Heart
        className={cn(
          "h-[18px] w-[18px] transition-colors duration-200",
          active ? "fill-accent text-accent" : "text-ink-soft",
        )}
        aria-hidden="true"
      />
    </motion.button>
  );
}
