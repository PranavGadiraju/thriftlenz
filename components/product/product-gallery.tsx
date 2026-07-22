"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

type ProductGalleryProps = {
  images: string[];
  alt: string;
};

export function ProductGallery({ images, alt }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();
  const total = images.length;

  const step = (direction: 1 | -1) => {
    setActive((current) => (current + direction + total) % total);
  };

  return (
    <div className="space-y-4">
      <div className="relative aspect-[4/5] overflow-hidden rounded-card border border-line bg-surface">
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            key={active}
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 1.015 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={images[active]}
              alt={`${alt} — view ${active + 1} of ${total}`}
              fill
              priority={active === 0}
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {total > 1 ? (
          <div className="pointer-events-none absolute inset-x-3 top-1/2 flex -translate-y-1/2 items-center justify-between lg:hidden">
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous image"
              className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-line bg-canvas/90 text-ink backdrop-blur-sm transition-colors hover:bg-canvas focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next image"
              className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-line bg-canvas/90 text-ink backdrop-blur-sm transition-colors hover:bg-canvas focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        ) : null}
      </div>

      {total > 1 ? (
        <div className="flex gap-3" role="group" aria-label="Product images">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Show image ${index + 1}`}
              aria-current={index === active}
              className={cn(
                "relative h-20 w-16 overflow-hidden rounded-xl border bg-surface transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas sm:h-24 sm:w-20",
                index === active
                  ? "border-ink"
                  : "border-line opacity-70 hover:opacity-100",
              )}
            >
              <Image
                src={image}
                alt=""
                fill
                sizes="80px"
                className="object-cover"
                aria-hidden="true"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
