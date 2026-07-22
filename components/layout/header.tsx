"use client";

import { Camera, Heart, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { Wordmark } from "@/components/layout/wordmark";
import { Button } from "@/components/ui/button";
import { useStore } from "@/context/store-context";
import { cn } from "@/lib/utils";

export const primaryLinks = [
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
];

function CountBadge({ value }: { value: number }) {
  if (value <= 0) return null;
  return (
    <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-accent px-1 text-[0.625rem] font-medium leading-none text-white">
      {value}
    </span>
  );
}

export function Header() {
  const pathname = usePathname();
  const { cartCount, favoritesCount, hydrated } = useStore();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/85 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between gap-4 sm:h-20">
        <div className="flex items-center gap-8">
          <MobileNavigation />
          <Link
            href="/"
            className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-canvas"
            aria-label="ThriftLenz — home"
          >
            <Wordmark />
          </Link>
          <nav aria-label="Primary" className="hidden items-center gap-7 md:flex">
            {primaryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={cn(
                  "relative py-1 text-sm transition-colors duration-200 after:absolute after:-bottom-0.5 after:left-0 after:h-px after:bg-ink after:transition-all after:duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-canvas",
                  isActive(link.href)
                    ? "text-ink after:w-full"
                    : "text-muted after:w-0 hover:text-ink hover:after:w-full",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/visual-search"
            aria-label="Search by photo"
            aria-current={isActive("/visual-search") ? "page" : undefined}
            className={cn(
              "relative flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-200 hover:bg-ink/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
              isActive("/visual-search") ? "text-ink" : "text-ink-soft",
            )}
          >
            <Camera className="h-[18px] w-[18px]" aria-hidden="true" />
          </Link>

          <Link
            href="/favorites"
            aria-label={`Favorites${hydrated && favoritesCount > 0 ? `, ${favoritesCount} saved` : ""}`}
            aria-current={isActive("/favorites") ? "page" : undefined}
            className={cn(
              "relative flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-200 hover:bg-ink/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
              isActive("/favorites") ? "text-ink" : "text-ink-soft",
            )}
          >
            <Heart className="h-[18px] w-[18px]" aria-hidden="true" />
            {hydrated ? <CountBadge value={favoritesCount} /> : null}
          </Link>

          <Link
            href="/cart"
            aria-label={`Cart${hydrated && cartCount > 0 ? `, ${cartCount} item${cartCount === 1 ? "" : "s"}` : ""}`}
            aria-current={isActive("/cart") ? "page" : undefined}
            className={cn(
              "relative flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-200 hover:bg-ink/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
              isActive("/cart") ? "text-ink" : "text-ink-soft",
            )}
          >
            <ShoppingBag className="h-[18px] w-[18px]" aria-hidden="true" />
            {hydrated ? <CountBadge value={cartCount} /> : null}
          </Link>

          <Button variant="outline" size="sm" className="ml-1 hidden sm:inline-flex">
            Sign in
          </Button>
        </div>
      </div>
    </header>
  );
}
