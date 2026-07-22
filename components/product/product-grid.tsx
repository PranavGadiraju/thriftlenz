"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ProductCard } from "@/components/product/product-card";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

type ProductGridProps = {
  products: Product[];
  className?: string;
  /** Cards below this index skip the entrance animation on re-render. */
  priorityCount?: number;
};

export function ProductGrid({ products, className, priorityCount = 4 }: ProductGridProps) {
  const reduceMotion = useReducedMotion();

  return (
    <ul
      className={cn(
        "grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-6 lg:grid-cols-3 xl:grid-cols-4",
        className,
      )}
    >
      {products.map((product, index) => (
        <motion.li
          key={product.id}
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.45,
            ease: [0.22, 1, 0.36, 1],
            delay: reduceMotion ? 0 : Math.min(index, 7) * 0.045,
          }}
        >
          <ProductCard product={product} priority={index < priorityCount} />
        </motion.li>
      ))}
    </ul>
  );
}
