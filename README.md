# ThriftLenz

A curated secondhand clothing storefront — a complete, polished front-end built with Next.js App Router, React, TypeScript, Tailwind, Radix/shadcn primitives, and Framer Motion.

## Quick start

```bash
npm install
npm run dev
```

Then open **http://localhost:3000**

Other commands:

```bash
npm run build      # production build
npm start          # serve the production build
npm run typecheck  # strict TypeScript, no emit
```

## Pages

| Route | What it does |
| --- | --- |
| `/` | Editorial hero, 12 featured pieces, brand section |
| `/shop` | Full catalogue with search, filters, sorting, Load More |
| `/visual-search` | Photograph a garment and find the closest pieces |
| `/product/[slug]` | Gallery, specs, add to cart, favorite, similar items |
| `/favorites` | Saved pieces, removable, addable to cart |
| `/cart` | Quantities, removal, subtotal, shipping, total |
| `/checkout` | Validated fake checkout — nothing is sent anywhere |
| `/confirmation` | Mock order number and summary; clears the cart |
| `/about` | Mission, selection criteria, secondhand value, privacy |

Unknown product slugs and unknown routes both render the custom 404 with a real 404 status.

## Search by photo

Open `/visual-search`, or tap the camera icon in the header. Take a photo, choose a file, or drag one in.

It runs in two modes:

**On-device (default, no setup).** The photo is downscaled in the browser and its dominant garment colours are sampled with a centre-weighted quantiser, then converted to CIE L\*a\*b\* so colour distance matches what the eye notices. Pieces are ranked against the catalogue's colour values. You can tap a category chip to narrow it further. The photo never leaves your machine in this mode.

**With recognition (optional).** Copy `.env.example` to `.env.local` and add:

```
ANTHROPIC_API_KEY=sk-ant-...
```

The photo is then also read by Claude through `/api/visual-search`, which returns garment category, any legible brand, colours, and detail keywords as JSON. Those attributes are merged with the on-device colours for a much sharper ranking. If the key is absent or the call fails, the interface says so and falls back to colour matching — it never breaks.

Ranking weights live in `lib/visual-search.ts` (colour 50%, category 28%, keywords 14%, brand 8%) and are easy to tune. Set `ANTHROPIC_MODEL` in `.env.local` to change the model.

## Structure

```
app/            routes, layout, global styles, api/visual-search
components/     cart/ layout/ product/ shop/ ui/
context/        store-context (cart + favorites), toast-context
data/           products.ts — the 20-piece catalogue
lib/            catalogue queries, colour maths, photo matching, formatting
scripts/        catalogue.json + the image generator
public/images/  62 generated garment images
types/          shared types
```

## Product images

Rather than depend on remote photo URLs that can rot, all catalogue imagery is generated locally as flat vector SVG — a front view, a detail crop, and a flat lay for each of the 20 pieces, plus hero and about compositions, in one consistent muted palette. Nothing can 404.

To swap in real photography, replace the `images` arrays in `data/products.ts` with your own paths. To regenerate the vector set after editing `scripts/catalogue.json`:

```bash
python3 scripts/gen_images.py
python3 scripts/add_color_hex.py   # rebuilds data/products.ts
```

## State

Cart and favorites live in React context and persist to `localStorage`, hydrated in an effect so server and client markup always agree. Because thrift pieces are one of a kind, quantities are capped at one per line. The mock order is held in `sessionStorage` for the confirmation page only.

## Notes

- Strict TypeScript, no `any`.
- Motion is limited to card stagger, hover lift, gallery crossfade, drawers, and toasts; all of it respects `prefers-reduced-motion`.
- Accessibility: semantic landmarks, skip link, keyboard-reachable controls, visible focus rings, labelled icon buttons, `aria-live` result counts, descriptive alt text.
- No backend, no database, no auth, no real payments.
