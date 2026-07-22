"use client";

import { Check } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Filters } from "@/types";

type FilterPanelProps = {
  filters: Filters;
  brands: string[];
  sizes: string[];
  priceFloor: number;
  priceCeiling: number;
  activeCount: number;
  onChange: (next: Partial<Filters>) => void;
  onClear: () => void;
};

function toggle(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

export function FilterPanel({
  filters,
  brands,
  sizes,
  priceFloor,
  priceCeiling,
  activeCount,
  onChange,
  onClear,
}: FilterPanelProps) {
  return (
    <div className="space-y-9">
      <div className="flex items-center justify-between">
        <h2 className="text-eyebrow uppercase text-muted">Filters</h2>
        {activeCount > 0 ? (
          <button
            type="button"
            onClick={onClear}
            className="text-[0.8125rem] text-accent underline decoration-accent/30 underline-offset-4 transition-colors hover:decoration-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
          >
            Clear all
          </button>
        ) : null}
      </div>

      <fieldset>
        <legend className="text-sm text-ink">Brand</legend>
        <ul className="mt-4 space-y-2.5">
          {brands.map((brand) => {
            const checked = filters.brands.includes(brand);
            return (
              <li key={brand}>
                <label className="group flex cursor-pointer items-center gap-3 text-sm text-ink-soft">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onChange({ brands: toggle(filters.brands, brand) })}
                    className="peer sr-only"
                  />
                  <span
                    aria-hidden="true"
                    className={cn(
                      "flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[6px] border transition-colors duration-150",
                      "peer-focus-visible:ring-2 peer-focus-visible:ring-accent peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-canvas",
                      checked
                        ? "border-accent bg-accent text-white"
                        : "border-line-strong bg-surface group-hover:border-ink",
                    )}
                  >
                    {checked ? <Check className="h-3 w-3" /> : null}
                  </span>
                  <span className={cn("transition-colors", checked && "text-ink")}>{brand}</span>
                </label>
              </li>
            );
          })}
        </ul>
      </fieldset>

      <fieldset>
        <legend className="text-sm text-ink">Size</legend>
        <div className="mt-4 flex flex-wrap gap-2">
          {sizes.map((size) => {
            const checked = filters.sizes.includes(size);
            return (
              <label key={size} className="cursor-pointer">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onChange({ sizes: toggle(filters.sizes, size) })}
                  className="peer sr-only"
                />
                <span
                  className={cn(
                    "inline-flex h-9 items-center rounded-pill border px-3.5 text-[0.8125rem] transition-colors duration-150",
                    "peer-focus-visible:ring-2 peer-focus-visible:ring-accent peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-canvas",
                    checked
                      ? "border-ink bg-ink text-canvas"
                      : "border-line bg-surface text-ink-soft hover:border-ink",
                  )}
                >
                  {size}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div>
        <div className="flex items-baseline justify-between">
          <label htmlFor="price-range" className="text-sm text-ink">
            Price range
          </label>
          <span className="text-[0.8125rem] tabular-nums text-muted">
            {formatPrice(priceFloor)} – {formatPrice(filters.maxPrice)}
          </span>
        </div>
        <input
          id="price-range"
          type="range"
          min={priceFloor}
          max={priceCeiling}
          step={2}
          value={filters.maxPrice}
          onChange={(event) => onChange({ maxPrice: Number(event.target.value) })}
          className="range-input mt-4 w-full"
        />
      </div>
    </div>
  );
}
