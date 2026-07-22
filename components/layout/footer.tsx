import Link from "next/link";
import { LensMark } from "@/components/layout/wordmark";

const columns = [
  {
    heading: "Shop",
    links: [
      { label: "All pieces", href: "/shop" },
      { label: "Search by photo", href: "/visual-search" },
      { label: "Favorites", href: "/favorites" },
      { label: "Cart", href: "/cart" },
    ],
  },
  {
    heading: "ThriftLenz",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "mailto:hello@thriftlenz.example" },
      { label: "Instagram", href: "https://instagram.com" },
      { label: "Privacy policy", href: "/about#privacy" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-surface/60">
      <div className="container py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <span className="flex items-center gap-2 font-display text-xl tracking-[-0.03em] text-ink">
              <LensMark className="h-5 w-5 text-accent" />
              Thrift<span className="italic">Lenz</span>
            </span>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              A small edit of secondhand clothing, chosen one piece at a time and photographed as
              it arrives.
            </p>
          </div>

          {columns.map((column) => (
            <div key={column.heading}>
              <h2 className="text-eyebrow uppercase text-muted">{column.heading}</h2>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => {
                  const external = link.href.startsWith("http") || link.href.startsWith("mailto");
                  return (
                    <li key={link.label}>
                      {external ? (
                        <a
                          href={link.href}
                          className="text-sm text-ink-soft transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-canvas"
                          {...(link.href.startsWith("http")
                            ? { target: "_blank", rel: "noreferrer" }
                            : {})}
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="text-sm text-ink-soft transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-canvas"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-14 border-t border-line pt-6 text-[0.8125rem] text-muted">
          © {new Date().getFullYear()} ThriftLenz. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
