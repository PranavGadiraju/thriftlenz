"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Camera, ImageIcon, RotateCcw, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/tag";
import { describeColor } from "@/lib/color";
import { cn } from "@/lib/utils";
import {
  CATEGORIES,
  matchProducts,
  mergeAttributes,
  type PhotoAttributes,
  type PhotoMatch,
} from "@/lib/visual-search";

type Status = "idle" | "reading" | "searching" | "done" | "error";

const MAX_UPLOAD_EDGE = 1024;
const SAMPLE_EDGE = 72;

/** Center-weighted quantisation: the garment is usually in the middle of the frame. */
function sampleColors(data: Uint8ClampedArray, width: number, height: number): string[] {
  const buckets = new Map<string, { r: number; g: number; b: number; weight: number }>();

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = (y * width + x) * 4;
      const r = data[index];
      const g = data[index + 1];
      const b = data[index + 2];
      const alpha = data[index + 3];
      if (alpha < 200) continue;

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const lightness = (max + min) / 2 / 255;
      // Drop blown-out highlights and deep shadow, which are usually backdrop or fold.
      if (lightness > 0.95 || lightness < 0.06) continue;

      const dx = (x - width / 2) / (width / 2);
      const dy = (y - height / 2) / (height / 2);
      const weight = Math.max(0.15, 1 - Math.sqrt(dx * dx + dy * dy));

      const key = `${r >> 4}-${g >> 4}-${b >> 4}`;
      const bucket = buckets.get(key) ?? { r: 0, g: 0, b: 0, weight: 0 };
      bucket.r += r * weight;
      bucket.g += g * weight;
      bucket.b += b * weight;
      bucket.weight += weight;
      buckets.set(key, bucket);
    }
  }

  return Array.from(buckets.values())
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 3)
    .map((bucket) => {
      const part = (value: number) =>
        Math.round(value / bucket.weight)
          .toString(16)
          .padStart(2, "0");
      return `#${part(bucket.r)}${part(bucket.g)}${part(bucket.b)}`;
    });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("unreadable"));
    image.src = src;
  });
}

export function VisualSearch() {
  const [status, setStatus] = useState<Status>("idle");
  const [preview, setPreview] = useState<string | null>(null);
  const [attributes, setAttributes] = useState<PhotoAttributes | null>(null);
  const [sampled, setSampled] = useState<string[]>([]);
  const [matches, setMatches] = useState<PhotoMatch[]>([]);
  const [category, setCategory] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const cameraInput = useRef<HTMLInputElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const reduceMotion = useReducedMotion();

  const rerank = (colors: string[], vision: Partial<PhotoAttributes> | null, chosen: string | null) => {
    const merged = mergeAttributes(colors, vision, chosen);
    setAttributes(merged);
    setMatches(matchProducts(merged, 8));
  };

  const handleFile = async (file: File) => {
    setError(null);
    setNotice(null);

    if (!file.type.startsWith("image/")) {
      setError("That file is not an image. Use a JPEG, PNG, or WebP photo.");
      setStatus("error");
      return;
    }

    setStatus("reading");

    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error("unreadable"));
        reader.readAsDataURL(file);
      });

      const image = await loadImage(dataUrl);

      // Downscale once for upload, again for colour sampling.
      const scale = Math.min(1, MAX_UPLOAD_EDGE / Math.max(image.width, image.height));
      const uploadCanvas = document.createElement("canvas");
      uploadCanvas.width = Math.round(image.width * scale);
      uploadCanvas.height = Math.round(image.height * scale);
      const uploadContext = uploadCanvas.getContext("2d");
      if (!uploadContext) throw new Error("canvas");
      uploadContext.drawImage(image, 0, 0, uploadCanvas.width, uploadCanvas.height);
      const compressed = uploadCanvas.toDataURL("image/jpeg", 0.82);
      setPreview(compressed);

      const sampleCanvas = document.createElement("canvas");
      sampleCanvas.width = SAMPLE_EDGE;
      sampleCanvas.height = SAMPLE_EDGE;
      const sampleContext = sampleCanvas.getContext("2d", { willReadFrequently: true });
      if (!sampleContext) throw new Error("canvas");
      sampleContext.drawImage(image, 0, 0, SAMPLE_EDGE, SAMPLE_EDGE);
      const { data } = sampleContext.getImageData(0, 0, SAMPLE_EDGE, SAMPLE_EDGE);
      const colors = sampleColors(data, SAMPLE_EDGE, SAMPLE_EDGE);
      setSampled(colors);

      // Show colour-only results immediately, then refine if recognition is available.
      rerank(colors, null, category);
      setStatus("searching");

      const response = await fetch("/api/visual-search", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ image: compressed.split(",")[1], mediaType: "image/jpeg" }),
      });
      const result: {
        configured: boolean;
        attributes: Partial<PhotoAttributes> | null;
        error?: string;
      } = await response.json();

      if (!result.configured) {
        setNotice(
          "Matching on colour and shape from your device. Add an ANTHROPIC_API_KEY to .env.local for full garment recognition.",
        );
        rerank(colors, null, category);
      } else if (result.attributes) {
        if (result.attributes.category) setCategory(result.attributes.category);
        rerank(colors, result.attributes, result.attributes.category ?? category);
      } else {
        setNotice(result.error ?? "Recognition was unavailable, so these are colour matches.");
        rerank(colors, null, category);
      }

      setStatus("done");
    } catch {
      setError("That photo could not be read. Try another one.");
      setStatus("error");
    }
  };

  const reset = () => {
    setStatus("idle");
    setPreview(null);
    setAttributes(null);
    setSampled([]);
    setMatches([]);
    setCategory(null);
    setNotice(null);
    setError(null);
  };

  const busy = status === "reading" || status === "searching";

  return (
    <div>
      <input
        ref={cameraInput}
        type="file"
        accept="image/*"
        capture="environment"
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void handleFile(file);
          event.target.value = "";
        }}
      />
      <input
        ref={fileInput}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void handleFile(file);
          event.target.value = "";
        }}
      />

      {preview === null ? (
        <div
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            const file = event.dataTransfer.files?.[0];
            if (file) void handleFile(file);
          }}
          className={cn(
            "flex flex-col items-center rounded-card border border-dashed px-6 py-16 text-center transition-colors duration-200",
            dragging ? "border-accent bg-accent-soft/50" : "border-line-strong bg-surface/60",
          )}
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft text-accent">
            <Camera className="h-6 w-6" aria-hidden="true" />
          </span>
          <h2 className="mt-6 font-display text-2xl tracking-[-0.02em] text-ink">
            Show us the piece
          </h2>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
            Take a photo of a garment, or drop one in. We read its colour and cut, then rank the
            closest pieces in the edit.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" onClick={() => cameraInput.current?.click()}>
              <Camera className="h-4 w-4" aria-hidden="true" />
              Take a photo
            </Button>
            <Button variant="outline" size="lg" onClick={() => fileInput.current?.click()}>
              <ImageIcon className="h-4 w-4" aria-hidden="true" />
              Choose a photo
            </Button>
          </div>
          <p className="mt-6 text-[0.75rem] text-muted">
            Photos are analysed for this search only and are never stored.
          </p>
          {error ? (
            <p role="alert" className="mt-4 text-[0.8125rem] text-[#A5503F]">
              {error}
            </p>
          ) : null}
        </div>
      ) : (
        <div className="grid gap-10 lg:grid-cols-[280px_1fr] lg:gap-14">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            {/* The upload is a user-supplied photo of unknown dimensions, so a plain img is right here. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="The photo you uploaded"
              className="aspect-[4/5] w-full rounded-card border border-line object-cover"
            />

            <div className="mt-5 space-y-5">
              <div>
                <h2 className="text-eyebrow uppercase text-muted">Colours read</h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {(attributes?.colors ?? sampled).slice(0, 4).map((color) => (
                    <li
                      key={color}
                      className="flex items-center gap-2 rounded-pill border border-line bg-surface py-1 pl-1 pr-3"
                    >
                      <span
                        className="h-5 w-5 rounded-full border border-line"
                        style={{ backgroundColor: color }}
                        aria-hidden="true"
                      />
                      <span className="text-[0.75rem] text-ink-soft">{describeColor(color)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {attributes?.brand || (attributes?.keywords.length ?? 0) > 0 ? (
                <div>
                  <h2 className="text-eyebrow uppercase text-muted">Details seen</h2>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {attributes?.brand ? (
                      <li>
                        <Tag tone="accent">{attributes.brand}</Tag>
                      </li>
                    ) : null}
                    {(attributes?.keywords ?? []).slice(0, 4).map((keyword) => (
                      <li key={keyword}>
                        <Tag>{keyword}</Tag>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <fieldset>
                <legend className="text-eyebrow uppercase text-muted">Type of piece</legend>
                <div className="mt-3 flex flex-wrap gap-2">
                  {CATEGORIES.map((option) => {
                    const active = category === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        aria-pressed={active}
                        onClick={() => {
                          const next = active ? null : option;
                          setCategory(next);
                          rerank(sampled, attributes, next);
                        }}
                        className={cn(
                          "inline-flex h-8 items-center rounded-pill border px-3 text-[0.75rem] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas",
                          active
                            ? "border-ink bg-ink text-canvas"
                            : "border-line bg-surface text-ink-soft hover:border-ink",
                        )}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <Button variant="outline" className="w-full" onClick={reset}>
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                Search another photo
              </Button>
            </div>
          </aside>

          <div>
            <div className="flex items-center gap-2" role="status" aria-live="polite">
              <Sparkles className="h-4 w-4 text-accent" aria-hidden="true" />
              <p className="text-sm text-ink">
                {busy ? "Reading the photo…" : `${matches.length} closest pieces in the edit`}
              </p>
            </div>

            {notice ? (
              <p className="mt-4 rounded-2xl border border-line bg-surface px-4 py-3 text-[0.8125rem] leading-relaxed text-muted">
                {notice}
              </p>
            ) : null}

            <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-6 lg:grid-cols-3">
              {matches.map((match, index) => (
                <motion.li
                  key={match.product.id}
                  layout
                  initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    ease: [0.22, 1, 0.36, 1],
                    delay: reduceMotion ? 0 : Math.min(index, 6) * 0.04,
                  }}
                >
                  <ProductCard product={match.product} priority={index < 3} />
                  <p className="mt-2 flex items-center gap-2 text-[0.75rem] text-muted">
                    <span className="tabular-nums text-accent">
                      {Math.round(match.score * 100)}% match
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="truncate">{match.reasons[0]}</span>
                  </p>
                </motion.li>
              ))}
            </ul>

            <p className="mt-12 text-[0.8125rem] text-muted">
              Nothing quite right?{" "}
              <Link
                href="/shop"
                className="text-ink underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
              >
                Browse the full edit
              </Link>
              .
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
