# Warstwy dla sceny garażu (zbliżenie): różnica wariant − baza → RGBA. Wynik: public/img/garaz/*.webp + manifest.json
import json, sys
from PIL import Image, ImageChops, ImageFilter
OUT = sys.argv[1]
W = 1920
base_full = Image.open("garaz-b.png").convert("RGB")
H = round(base_full.height * W / base_full.width)
base = base_full.resize((W, H), Image.LANCZOS)
base.save(f"{OUT}/garaz.webp", "WEBP", quality=88, method=6)
NAZWY = {"g-deye1": "gdeye1.png", "g-deye2": "gdeye2.png", "g-deye3": "gdeye3.png", "g-fox1": "gfox1.png", "g-fox2": "gfox2.png", "g-fox3": "gfox3.png", "g-falownik": "gfalownik.png"}
# obszar wspólny: lewa-środkowa część tylnej ściany + podłoga pod nią (w px podglądu 1200x679)
REG = (90, 90, 900, 560)
P = 1200; s = W / P
manifest = {"szerokosc": W, "wysokosc": H, "warstwy": {}}
for name, f in NAZWY.items():
    var = Image.open(f).convert("RGB").resize((W, H), Image.LANCZOS)
    diff = ImageChops.difference(var, base).convert("L")
    m = diff.filter(ImageFilter.GaussianBlur(1.2)).point(lambda v: 255 if v > 22 else 0)
    region = Image.new("L", (W, H), 0); region.paste(255, tuple(int(c*s) for c in REG)); m = ImageChops.multiply(m, region)
    m = m.filter(ImageFilter.MinFilter(7)).filter(ImageFilter.MaxFilter(21)).filter(ImageFilter.GaussianBlur(4))
    bbox = m.point(lambda v: 255 if v > 8 else 0).getbbox()
    if not bbox: print("BRAK", name); continue
    layer = var.convert("RGBA"); layer.putalpha(m); layer = layer.crop(bbox)
    layer.save(f"{OUT}/{name}.webp", "WEBP", quality=90, method=6)
    manifest["warstwy"][name] = {"x": round(bbox[0]/W*100, 3), "y": round(bbox[1]/H*100, 3), "w": round((bbox[2]-bbox[0])/W*100, 3), "h": round((bbox[3]-bbox[1])/H*100, 3)}
    print(name, bbox)
json.dump(manifest, open(f"{OUT}/manifest.json", "w", encoding="utf-8"), ensure_ascii=False, indent=2)
tiles = [Image.open(f"{OUT}/{n}.webp").convert("RGBA") for n in NAZWY if n in manifest["warstwy"]]
h = 320; tiles = [t.resize((max(1, round(t.width*h/t.height)), h)) for t in tiles]
sheet = Image.new("RGBA", (sum(t.width for t in tiles)+10*len(tiles), h), (90,90,90,255)); x = 0
for t in tiles: sheet.alpha_composite(t, (x, 0)); x += t.width+10
sheet.convert("RGB").save("garaz-warstwy-podglad.jpg", quality=85)
comp = base.convert("RGBA"); mm = manifest["warstwy"]["g-deye2"]; l = Image.open(f"{OUT}/g-deye2.webp").convert("RGBA")
comp.alpha_composite(l, (round(mm["x"]/100*W), round(mm["y"]/100*H))); comp.convert("RGB").resize((1200, round(1200*H/W))).save("garaz-kompozyt-podglad.jpg", quality=85)
print("ok")
