export type Rgb = { r: number; g: number; b: number };
export type Lab = { l: number; a: number; b: number };

export function hexToRgb(hex: string): Rgb {
  const clean = hex.replace("#", "");
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  };
}

export function rgbToHex({ r, g, b }: Rgb): string {
  const part = (value: number) => Math.round(value).toString(16).padStart(2, "0");
  return `#${part(r)}${part(g)}${part(b)}`;
}

/** sRGB to CIE L*a*b*, so colour distance tracks what the eye actually notices. */
export function rgbToLab({ r, g, b }: Rgb): Lab {
  const toLinear = (channel: number) => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  };

  const lr = toLinear(r);
  const lg = toLinear(g);
  const lb = toLinear(b);

  const x = (lr * 0.4124 + lg * 0.3576 + lb * 0.1805) / 0.95047;
  const y = lr * 0.2126 + lg * 0.7152 + lb * 0.0722;
  const z = (lr * 0.0193 + lg * 0.1192 + lb * 0.9505) / 1.08883;

  const f = (value: number) => (value > 0.008856 ? Math.cbrt(value) : 7.787 * value + 16 / 116);

  const fx = f(x);
  const fy = f(y);
  const fz = f(z);

  return { l: 116 * fy - 16, a: 500 * (fx - fy), b: 200 * (fy - fz) };
}

/** CIE76 delta E. Roughly: under 10 reads as the same colour, over 50 as unrelated. */
export function colorDistance(a: string, b: string): number {
  const labA = rgbToLab(hexToRgb(a));
  const labB = rgbToLab(hexToRgb(b));
  return Math.sqrt((labA.l - labB.l) ** 2 + (labA.a - labB.a) ** 2 + (labA.b - labB.b) ** 2);
}

export function isValidHex(value: string): boolean {
  return /^#[0-9a-f]{6}$/i.test(value);
}

const NAMED_TONES: Array<{ name: string; hex: string }> = [
  { name: "black", hex: "#1f1f1f" },
  { name: "charcoal", hex: "#4a4a4c" },
  { name: "grey", hex: "#9a9a95" },
  { name: "cream", hex: "#dcd4c0" },
  { name: "white", hex: "#f2f0ea" },
  { name: "brown", hex: "#8b6a46" },
  { name: "tan", hex: "#a98c5f" },
  { name: "rust", hex: "#9e5b3c" },
  { name: "red", hex: "#a4463f" },
  { name: "maroon", hex: "#7c4a48" },
  { name: "olive", hex: "#6e7355" },
  { name: "green", hex: "#5f6b4f" },
  { name: "sage", hex: "#7e8a6b" },
  { name: "light blue", hex: "#b4c6d8" },
  { name: "blue", hex: "#4a6280" },
  { name: "navy", hex: "#3d4c66" },
];

/** Turns a sampled colour into a word, so the interface can say what it saw. */
export function describeColor(hex: string): string {
  let best = NAMED_TONES[0];
  let bestDistance = Number.POSITIVE_INFINITY;
  NAMED_TONES.forEach((tone) => {
    const distance = colorDistance(hex, tone.hex);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = tone;
    }
  });
  return best.name;
}
