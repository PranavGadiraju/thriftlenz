"""Generates consistent flat-vector garment images for the ThriftLenz catalogue.

Output: public/images/<slug>-1.svg, -2.svg, -3.svg
Every product image is generated locally, so nothing can 404.
"""
import os
import json

W, H = 800, 1000
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "images")
os.makedirs(OUT, exist_ok=True)

BACKDROPS = ["#EFEDE7", "#E8E6DE", "#F2F0EA", "#E6E4DC"]


def shade(hex_color: str, factor: float) -> str:
    hex_color = hex_color.lstrip("#")
    r, g, b = (int(hex_color[i:i + 2], 16) for i in (0, 2, 4))
    r = max(0, min(255, int(r * factor)))
    g = max(0, min(255, int(g * factor)))
    b = max(0, min(255, int(b * factor)))
    return f"#{r:02x}{g:02x}{b:02x}"


def tee(c, dark):
    return f"""
  <path d="M300 272 L362 240 Q400 276 438 240 L500 272 L582 332 L540 414 L497 384 L497 762 Q400 782 303 762 L303 384 L260 414 L218 332 Z" fill="{c}"/>
  <path d="M362 240 Q400 292 438 240 Q400 262 362 240 Z" fill="{dark}" opacity=".55"/>
  <path d="M303 384 L303 762" stroke="{dark}" stroke-width="2" opacity=".25"/>
  <path d="M497 384 L497 762" stroke="{dark}" stroke-width="2" opacity=".25"/>
  <path d="M340 470 Q360 560 344 700" stroke="{dark}" stroke-width="3" fill="none" opacity=".18"/>
  <path d="M462 500 Q444 590 458 690" stroke="{dark}" stroke-width="3" fill="none" opacity=".14"/>
"""


def sweatshirt(c, dark):
    return f"""
  <path d="M296 268 L360 236 Q400 274 440 236 L504 268 L604 344 L566 604 L498 588 L498 742 Q400 764 302 742 L302 588 L234 604 L196 344 Z" fill="{c}"/>
  <path d="M360 236 Q400 292 440 236 Q400 258 360 236 Z" fill="{dark}" opacity=".5"/>
  <path d="M302 716 L498 716 L498 742 Q400 764 302 742 Z" fill="{dark}" opacity=".28"/>
  <path d="M234 604 L302 588 L302 620 L246 636 Z" fill="{dark}" opacity=".28"/>
  <path d="M566 604 L498 588 L498 620 L554 636 Z" fill="{dark}" opacity=".28"/>
  <path d="M352 440 Q368 560 350 690" stroke="{dark}" stroke-width="3" fill="none" opacity=".16"/>
  <path d="M452 470 Q436 570 450 668" stroke="{dark}" stroke-width="3" fill="none" opacity=".12"/>
"""


def shirt(c, dark):
    return f"""
  <path d="M298 266 L358 238 L400 300 L442 238 L502 266 L596 342 L560 596 L500 580 L500 748 Q400 768 300 748 L300 580 L240 596 L204 342 Z" fill="{c}"/>
  <path d="M358 238 L400 300 L344 286 Z" fill="{dark}" opacity=".45"/>
  <path d="M442 238 L400 300 L456 286 Z" fill="{dark}" opacity=".45"/>
  <path d="M386 300 L414 300 L410 752 L390 752 Z" fill="{dark}" opacity=".22"/>
  <g fill="{dark}" opacity=".55">
    <circle cx="400" cy="372" r="6"/><circle cx="400" cy="472" r="6"/>
    <circle cx="400" cy="572" r="6"/><circle cx="400" cy="672" r="6"/>
  </g>
  <path d="M240 596 L300 580 L300 616 L250 632 Z" fill="{dark}" opacity=".3"/>
  <path d="M560 596 L500 580 L500 616 L550 632 Z" fill="{dark}" opacity=".3"/>
  <rect x="316" y="396" width="60" height="72" rx="6" fill="{dark}" opacity=".16"/>
"""


def jacket(c, dark):
    return f"""
  <path d="M292 262 L360 232 L400 296 L440 232 L508 262 L612 344 L574 606 L502 588 L502 754 Q400 776 298 754 L298 588 L226 606 L188 344 Z" fill="{c}"/>
  <path d="M360 232 L400 296 L336 300 L318 258 Z" fill="{dark}" opacity=".42"/>
  <path d="M440 232 L400 296 L464 300 L482 258 Z" fill="{dark}" opacity=".42"/>
  <path d="M392 296 L408 296 L408 760 L392 760 Z" fill="{dark}" opacity=".35"/>
  <rect x="306" y="520" width="86" height="96" rx="8" fill="{dark}" opacity=".2"/>
  <rect x="408" y="520" width="86" height="96" rx="8" fill="{dark}" opacity=".2"/>
  <path d="M298 726 L502 726 L502 754 Q400 776 298 754 Z" fill="{dark}" opacity=".3"/>
  <path d="M226 606 L298 588 L298 624 L238 642 Z" fill="{dark}" opacity=".3"/>
  <path d="M574 606 L502 588 L502 624 L562 642 Z" fill="{dark}" opacity=".3"/>
"""


def knitwear(c, dark):
    rows = "".join(
        f'<path d="M300 {y} Q350 {y - 12} 400 {y} Q450 {y + 12} 500 {y}" stroke="{dark}" '
        f'stroke-width="3" fill="none" opacity=".22"/>'
        for y in range(360, 730, 34)
    )
    return f"""
  <path d="M296 270 L360 238 Q400 276 440 238 L504 270 L600 346 L562 600 L498 584 L498 744 Q400 766 302 744 L302 584 L238 600 L200 346 Z" fill="{c}"/>
  <path d="M360 238 Q400 294 440 238 Q400 260 360 238 Z" fill="{dark}" opacity=".5"/>
  <path d="M338 250 Q400 320 462 250 L462 276 Q400 344 338 276 Z" fill="{dark}" opacity=".3"/>
  {rows}
  <path d="M302 714 L498 714 L498 744 Q400 766 302 744 Z" fill="{dark}" opacity=".3"/>
"""


def pants(c, dark):
    return f"""
  <path d="M296 258 L504 258 L512 400 L470 800 L404 800 L400 520 L396 800 L330 800 L288 400 Z" fill="{c}"/>
  <rect x="292" y="258" width="216" height="44" rx="4" fill="{dark}" opacity=".3"/>
  <path d="M400 302 L400 520" stroke="{dark}" stroke-width="3" opacity=".28"/>
  <path d="M336 352 L336 780" stroke="{dark}" stroke-width="3" opacity=".14"/>
  <path d="M464 352 L464 780" stroke="{dark}" stroke-width="3" opacity=".14"/>
  <path d="M300 316 L346 316 L340 372 L302 356 Z" fill="{dark}" opacity=".2"/>
  <path d="M500 316 L454 316 L460 372 L498 356 Z" fill="{dark}" opacity=".2"/>
  <circle cx="400" cy="282" r="7" fill="{dark}" opacity=".5"/>
"""


def denim(c, dark):
    return pants(c, dark) + f"""
  <path d="M306 330 Q400 358 494 330" stroke="{shade(c, 1.5)}" stroke-width="3" fill="none" opacity=".5"/>
  <path d="M312 344 Q400 372 488 344" stroke="{shade(c, 1.5)}" stroke-width="3" fill="none" opacity=".35"/>
  <path d="M348 640 Q360 700 352 762" stroke="{shade(c, 1.5)}" stroke-width="6" fill="none" opacity=".25"/>
  <path d="M452 600 Q444 660 452 730" stroke="{shade(c, 1.5)}" stroke-width="6" fill="none" opacity=".2"/>
"""


BUILDERS = {
    "Jackets": jacket,
    "Sweatshirts": sweatshirt,
    "T-shirts": tee,
    "Shirts": shirt,
    "Pants": pants,
    "Denim": denim,
    "Knitwear": knitwear,
}

CROPS = {
    "Jackets": "236 236 372 465",
    "Sweatshirts": "236 236 372 465",
    "T-shirts": "244 232 372 465",
    "Shirts": "268 250 340 425",
    "Knitwear": "252 240 356 445",
    "Pants": "268 250 340 425",
    "Denim": "268 250 340 425",
}


def svg(body: str, bg: str, view: str = f"0 0 {W} {H}") -> str:
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{view}" width="{W}" height="{H}" '
        f'preserveAspectRatio="xMidYMid slice" role="img">'
        f'<rect x="-200" y="-200" width="1400" height="1600" fill="{bg}"/>'
        f'{body}</svg>'
    )


def build(slug: str, category: str, color_hex: str, index: int) -> None:
    draw = BUILDERS[category]
    dark = shade(color_hex, 0.62)
    bg = BACKDROPS[index % len(BACKDROPS)]
    alt_bg = BACKDROPS[(index + 2) % len(BACKDROPS)]
    shadow = (
        f'<ellipse cx="400" cy="812" rx="188" ry="26" fill="#1C1B18" opacity=".07"/>'
    )
    garment = draw(color_hex, dark)

    # 1. Full front view
    with open(os.path.join(OUT, f"{slug}-1.svg"), "w") as f:
        f.write(svg(shadow + garment, bg))

    # 2. Detail crop (same artwork, tighter viewBox)
    with open(os.path.join(OUT, f"{slug}-2.svg"), "w") as f:
        f.write(svg(garment, alt_bg, CROPS[category]))

    # 3. Flat lay, softly rotated
    with open(os.path.join(OUT, f"{slug}-3.svg"), "w") as f:
        f.write(
            svg(
                f'<g transform="rotate(-7 400 500) scale(0.92) translate(34 44)">'
                f'{shadow}{garment}</g>',
                shade(alt_bg, 0.98),
            )
        )


if __name__ == "__main__":
    with open(os.path.join(os.path.dirname(__file__), "catalogue.json")) as f:
        catalogue = json.load(f)
    for i, p in enumerate(catalogue):
        build(p["slug"], p["category"], p["hex"], i)
    print(f"generated {len(catalogue) * 3} images")
