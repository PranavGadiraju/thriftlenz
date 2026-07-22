import json

t = open("types/index.ts").read()
if "colorHex" not in t:
    t = t.replace(
        "  color: string;\n",
        "  color: string;\n  /** Approximate garment colour, used by photo search. */\n  colorHex: string;\n",
    )
    open("types/index.ts", "w").write(t)

rows = json.load(open("scripts/catalogue.json"))
out = [
    'import type { Product } from "@/types";',
    "",
    "/** Mock catalogue. Images are local vector assets, so nothing can 404. */",
    "export const products: Product[] = [",
]
for p in rows:
    imgs = ", ".join(f'"/images/{p["slug"]}-{i}.svg"' for i in (1, 2, 3))
    out += [
        "  {",
        f'    id: "{p["id"]}",',
        f'    slug: "{p["slug"]}",',
        f'    brand: "{p["brand"]}",',
        f'    name: "{p["name"]}",',
        f'    category: "{p["category"]}",',
        f'    price: {p["price"]},',
        f'    size: "{p["size"]}",',
        f'    condition: "{p["condition"]}",',
        f'    color: "{p["color"]}",',
        f'    colorHex: "{p["hex"]}",',
        f'    description:\n      "{p["description"]}",',
        f"    images: [{imgs}],",
        f'    featured: {"true" if p["featured"] else "false"},',
        f'    createdAt: "{p["createdAt"]}",',
        "  },",
    ]
out += ["];", ""]
open("data/products.ts", "w").write("\n".join(out))
print("regenerated", len(rows), "products with colorHex")
