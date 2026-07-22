import type { Metadata } from "next";
import { FavoritesView } from "@/components/product/favorites-view";

export const metadata: Metadata = {
  title: "Favorites",
  description: "Pieces you have saved from the ThriftLenz edit.",
};

export default function FavoritesPage() {
  return (
    <div className="container py-12 sm:py-16">
      <header className="max-w-2xl">
        <p className="text-eyebrow uppercase text-accent">Saved</p>
        <h1 className="mt-3 font-display text-[2.25rem] leading-[1.05] tracking-[-0.03em] text-ink sm:text-5xl">
          Favorites
        </h1>
        <p className="mt-4 text-[0.9375rem] leading-relaxed text-muted">
          Saved pieces stay in this browser. Nothing is reserved, so move quickly on anything you
          want.
        </p>
      </header>
      <div className="mt-12">
        <FavoritesView />
      </div>
    </div>
  );
}
