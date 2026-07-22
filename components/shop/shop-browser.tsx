"use client";

import { SlidersHorizontal, SearchX } from "lucide-react";
import { useMemo, useState } from "react";
import { ProductGrid } from "@/components/product/product-grid";
import { FilterPanel } from "@/components/shop/filter-panel";
import { SearchBar } from "@/components/shop/search-bar";
import { SortControl } from "@/components/shop/sort-control";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { applyFilters, sortProducts } from "@/lib/catalogue";
import type { Filters, Product, SortOption } from "@/types";

const PAGE_SIZE = 12;

type ShopBrowserProps = {
  products: Product[];
  brands: string[];
  sizes: string[];
  priceFloor: number;
  priceCeiling: number;
};

export function ShopBrowser({
  products,
  brands,
  sizes,
  priceFloor,
  priceCeiling,
}: ShopBrowserProps) {
  const emptyFilters = useMemo<Filters>(
    () => ({ query: "", brands: [], sizes: [], maxPrice: priceCeiling }),
    [priceCeiling],
  );

  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [sort, setSort] = useState<SortOption>("featured");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const results = useMemo(
    () => sortProducts(applyFilters(products, filters), sort),
    [products, filters, sort],
  );

  const activeCount =
    filters.brands.length + filters.sizes.length + (filters.maxPrice < priceCeiling ? 1 : 0);

  const update = (next: Partial<Filters>) => {
    setFilters((current) => ({ ...current, ...next }));
    setVisible(PAGE_SIZE);
  };

  const clearAll = () => {
    setFilters(emptyFilters);
    setVisible(PAGE_SIZE);
  };

  const shown = results.slice(0, visible);

  const panel = (
    <FilterPanel
      filters={filters}
      brands={brands}
      sizes={sizes}
      priceFloor={priceFloor}
      priceCeiling={priceCeiling}
      activeCount={activeCount}
      onChange={update}
      onClear={clearAll}
    />
  );

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchBar
          value={filters.query}
          onChange={(query) => update({ query })}
          className="flex-1"
        />
        <div className="flex items-center gap-3">
          <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="h-12 flex-1 sm:flex-none lg:hidden">
                <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
                Filters
                {activeCount > 0 ? (
                  <span className="ml-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-[0.6875rem] text-white">
                    {activeCount}
                  </span>
                ) : null}
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="px-6 pb-8 pt-6">
              <SheetTitle className="font-display text-2xl tracking-[-0.02em] text-ink">
                Filters
              </SheetTitle>
              <SheetDescription className="mt-1 text-sm text-muted">
                Narrow the edit by brand, size, and price.
              </SheetDescription>
              <div className="mt-8 flex-1 overflow-y-auto pb-4">{panel}</div>
              <Button className="mt-2 w-full" onClick={() => setFiltersOpen(false)}>
                {`Show ${results.length} ${results.length === 1 ? "piece" : "pieces"}`}
              </Button>
            </SheetContent>
          </Sheet>
          <div className="flex-1 sm:flex-none">
            <SortControl value={sort} onChange={setSort} />
          </div>
        </div>
      </div>

      <div className="mt-10 gap-12 lg:grid lg:grid-cols-[210px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-28">{panel}</div>
        </aside>

        <div>
          <p className="mb-6 text-[0.8125rem] text-muted" role="status" aria-live="polite">
            {`Showing ${shown.length} of ${results.length} ${results.length === 1 ? "piece" : "pieces"}`}
          </p>

          {results.length === 0 ? (
            <EmptyState
              icon={<SearchX className="h-6 w-6" aria-hidden="true" />}
              title="Nothing matches yet"
              description="No pieces fit this combination of search and filters. Clear them to see the full edit."
              actionLabel="Clear all filters"
              onAction={clearAll}
            />
          ) : (
            <>
              <ProductGrid products={shown} className="xl:grid-cols-3 2xl:grid-cols-4" />
              {visible < results.length ? (
                <div className="mt-14 flex justify-center">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setVisible((current) => current + PAGE_SIZE)}
                  >
                    {`Load ${Math.min(PAGE_SIZE, results.length - visible)} more`}
                  </Button>
                </div>
              ) : (
                <p className="mt-14 text-center text-[0.8125rem] text-muted">
                  That is the whole edit for now. New pieces are added each week.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
