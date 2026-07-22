import type { Metadata } from "next";
import { VisualSearch } from "@/components/shop/visual-search";

export const metadata: Metadata = {
  title: "Search by photo",
  description:
    "Photograph a piece of clothing and find the closest matches in the ThriftLenz edit.",
};

export default function VisualSearchPage() {
  return (
    <div className="container py-12 sm:py-16">
      <header className="max-w-2xl">
        <p className="text-eyebrow uppercase text-accent">Search by photo</p>
        <h1 className="mt-3 font-display text-[2.25rem] leading-[1.05] tracking-[-0.03em] text-ink sm:text-5xl">
          Find it with a photo
        </h1>
        <p className="mt-4 text-[0.9375rem] leading-relaxed text-muted">
          Point your camera at something you already like — a jacket in a shop window, a piece in
          your own wardrobe — and we will rank the closest matches in the edit.
        </p>
      </header>

      <div className="mt-12">
        <VisualSearch />
      </div>
    </div>
  );
}
