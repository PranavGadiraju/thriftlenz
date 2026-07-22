import { NextResponse } from "next/server";
import { CATEGORIES, type PhotoAttributes } from "@/lib/visual-search";

export const runtime = "nodejs";

const MODEL = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-5";
const ALLOWED_MEDIA = ["image/jpeg", "image/png", "image/webp"];
const MAX_BASE64_LENGTH = 7_000_000; // ~5MB of image data

const PROMPT = `You are looking at a photo of a single item of clothing.

Reply with ONLY a JSON object, no prose and no markdown fences, in this exact shape:
{
  "category": one of ${JSON.stringify(CATEGORIES)} or null,
  "brand": a visible brand name as a string, or null if no logo or label is legible,
  "colors": up to three lowercase hex colours of the garment itself, ignoring background,
  "keywords": up to six short lowercase descriptors such as "corduroy collar", "quarter zip", "faded", "boxy"
}

Judge only what is visible. Use null rather than guessing a brand.`;

type VisionResponse = {
  configured: boolean;
  attributes: Partial<PhotoAttributes> | null;
  error?: string;
};

function parseAttributes(text: string): Partial<PhotoAttributes> | null {
  const cleaned = text.replace(/```json/gi, "").replace(/```/g, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) return null;

  try {
    const parsed: unknown = JSON.parse(cleaned.slice(start, end + 1));
    if (typeof parsed !== "object" || parsed === null) return null;
    const record = parsed as Record<string, unknown>;

    const category =
      typeof record.category === "string" && CATEGORIES.includes(record.category)
        ? record.category
        : null;
    const brand = typeof record.brand === "string" && record.brand.trim() ? record.brand : null;
    const colors = Array.isArray(record.colors)
      ? record.colors.filter((value): value is string => typeof value === "string").slice(0, 3)
      : [];
    const keywords = Array.isArray(record.keywords)
      ? record.keywords.filter((value): value is string => typeof value === "string").slice(0, 6)
      : [];

    return { category, brand, colors, keywords };
  } catch {
    return null;
  }
}

export async function POST(request: Request): Promise<NextResponse<VisionResponse>> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  // Without a key the client falls back to on-device colour matching.
  if (!apiKey) {
    return NextResponse.json({ configured: false, attributes: null });
  }

  let body: { image?: unknown; mediaType?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { configured: true, attributes: null, error: "That request could not be read." },
      { status: 400 },
    );
  }

  const image = typeof body.image === "string" ? body.image : "";
  const mediaType = typeof body.mediaType === "string" ? body.mediaType : "image/jpeg";

  if (!image) {
    return NextResponse.json(
      { configured: true, attributes: null, error: "No photo was included." },
      { status: 400 },
    );
  }
  if (image.length > MAX_BASE64_LENGTH) {
    return NextResponse.json(
      { configured: true, attributes: null, error: "That photo is too large. Try one under 5MB." },
      { status: 413 },
    );
  }
  if (!ALLOWED_MEDIA.includes(mediaType)) {
    return NextResponse.json(
      { configured: true, attributes: null, error: "Use a JPEG, PNG, or WebP photo." },
      { status: 415 },
    );
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 400,
        messages: [
          {
            role: "user",
            content: [
              { type: "image", source: { type: "base64", media_type: mediaType, data: image } },
              { type: "text", text: PROMPT },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          configured: true,
          attributes: null,
          error: "The recognition service did not respond. Colour matching is still available.",
        },
        { status: 502 },
      );
    }

    const data: unknown = await response.json();
    const content =
      typeof data === "object" && data !== null && Array.isArray((data as { content?: unknown }).content)
        ? ((data as { content: Array<{ type?: string; text?: string }> }).content ?? [])
        : [];

    const text = content
      .filter((block) => block.type === "text" && typeof block.text === "string")
      .map((block) => block.text)
      .join("\n");

    return NextResponse.json({ configured: true, attributes: parseAttributes(text) });
  } catch {
    return NextResponse.json(
      {
        configured: true,
        attributes: null,
        error: "The recognition service could not be reached. Colour matching is still available.",
      },
      { status: 502 },
    );
  }
}
