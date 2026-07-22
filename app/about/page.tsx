import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { LensMark } from "@/components/layout/wordmark";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About",
  description:
    "Curated secondhand fashion that is easy to discover and enjoyable to shop. How ThriftLenz selects pieces and why secondhand is worth it.",
};

const criteria = [
  {
    title: "Condition first",
    body: "Every piece is inspected on a table under daylight. Seams, zips, cuffs, and hems all have to pass before anything is listed, and any flaw that remains is written into the description.",
  },
  {
    title: "Style that holds",
    body: "We look for cuts and colours that will still make sense in five years — workwear, denim, knitwear, and outerwear that has already proven it lasts.",
  },
  {
    title: "Wearable as found",
    body: "Nothing needs a repair before you can wear it. Pieces are washed, pressed, and photographed exactly as they will arrive.",
  },
];

export default function AboutPage() {
  return (
    <div className="pb-8">
      <section className="border-b border-line">
        <div className="container grid items-center gap-12 py-14 lg:grid-cols-[1fr_0.8fr] lg:gap-20 lg:py-20">
          <div>
            <p className="text-eyebrow uppercase text-accent">About</p>
            <h1 className="mt-5 max-w-xl font-display text-[2.5rem] leading-[1.04] tracking-[-0.03em] text-ink sm:text-[3.5rem]">
              Curated secondhand fashion that is easy to discover and enjoyable to shop.
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-muted">
              ThriftLenz is a single, edited storefront rather than an open marketplace. One team
              sources, checks, and photographs everything you see.
            </p>
          </div>
          <div className="relative aspect-[3/2] overflow-hidden rounded-[1.75rem] border border-line bg-surface lg:aspect-[4/5]">
            <Image
              src="/images/about-studio.svg"
              alt="Two selected pieces laid out for photography: a sage cotton work shirt and a khaki canvas jacket"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section aria-labelledby="why-heading" className="container py-16 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <p className="text-eyebrow uppercase text-accent">Why we exist</p>
            <h2
              id="why-heading"
              className="mt-3 font-display text-[1.75rem] leading-[1.1] tracking-[-0.02em] text-ink sm:text-[2.25rem]"
            >
              Secondhand is full of good clothing and hard to shop.
            </h2>
          </div>
          <div className="space-y-5 text-[0.9375rem] leading-relaxed text-muted">
            <p>
              Most resale sites hand you thousands of listings and leave the sorting to you. Sizes are
              inconsistent, photos are unreliable, and the good pieces are buried under everything
              else.
            </p>
            <p>
              We took the opposite approach: a small number of listings, all held to the same
              standard, described in plain language. If a piece is not something we would wear
              ourselves, it does not go up.
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="selection-heading" className="border-y border-line bg-surface/60">
        <div className="container py-16 sm:py-20">
          <div className="max-w-2xl">
            <p className="text-eyebrow uppercase text-accent">Selection</p>
            <h2
              id="selection-heading"
              className="mt-3 font-display text-[1.75rem] leading-[1.1] tracking-[-0.02em] text-ink sm:text-[2.25rem]"
            >
              How pieces are chosen
            </h2>
          </div>
          <ul className="mt-12 grid gap-10 sm:grid-cols-3 sm:gap-8">
            {criteria.map((item) => (
              <li key={item.title}>
                <LensMark className="h-5 w-5 text-accent" />
                <h3 className="mt-5 text-base text-ink">{item.title}</h3>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="value-heading" className="container py-16 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <p className="text-eyebrow uppercase text-accent">Buying secondhand</p>
            <h2
              id="value-heading"
              className="mt-3 font-display text-[1.75rem] leading-[1.1] tracking-[-0.02em] text-ink sm:text-[2.25rem]"
            >
              A piece that already lasted a decade will probably last another.
            </h2>
          </div>
          <div className="space-y-5 text-[0.9375rem] leading-relaxed text-muted">
            <p>
              Older garments were often made with heavier fabrics and better construction than their
              current equivalents, and they arrive already broken in. Buying one keeps a good piece in
              use instead of in storage.
            </p>
            <p>
              It also costs less than buying new at the same quality, and because each item is a
              single unit, you end up with a wardrobe that does not look like everyone else&rsquo;s.
            </p>
            <Button asChild className="mt-2">
              <Link href="/shop">Browse the collection</Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="privacy" aria-labelledby="privacy-heading" className="container scroll-mt-28">
        <div className="rounded-card border border-line bg-surface p-8 sm:p-10">
          <h2
            id="privacy-heading"
            className="font-display text-[1.5rem] tracking-[-0.02em] text-ink"
          >
            Privacy
          </h2>
          <p className="mt-4 max-w-2xl text-[0.9375rem] leading-relaxed text-muted">
            This site is a front-end prototype. Your cart and favorites are stored in your own
            browser, no account is created, and nothing you type at checkout is sent anywhere or
            processed as a real payment.
          </p>
        </div>
      </section>
    </div>
  );
}
