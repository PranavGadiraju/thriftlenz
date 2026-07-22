import Link from "next/link";
import { LensMark } from "@/components/layout/wordmark";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <LensMark className="h-8 w-8 text-accent" />
      <p className="mt-8 text-eyebrow uppercase text-muted">404</p>
      <h1 className="mt-4 max-w-lg font-display text-4xl leading-[1.05] tracking-[-0.02em] text-ink sm:text-5xl">
        That piece is no longer here.
      </h1>
      <p className="mt-4 max-w-md text-[0.9375rem] leading-relaxed text-muted">
        The page you asked for does not exist, or the item behind it has already found a new home.
        The rest of the edit is still waiting.
      </p>
      <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
        <Button asChild size="lg">
          <Link href="/shop">Browse the collection</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </div>
  );
}
