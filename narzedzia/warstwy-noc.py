# Nocne łatki agregatu i auta: wycinek ze sceny nocnej z tym samym obszarem co wersje dzienne.
import json, sys
from PIL import Image, ImageFilter
OUT = sys.argv[1]
W = 1920
noc_full = Image.open("noc.png").convert("RGB"); H = round(noc_full.height * W / noc_full.width)
P = 1200; s = W / P
REG = {"agregat-noc": ("agregat-noc.png", (1000, 330, 1105, 420))}
manifest = json.load(open(f"{OUT}/manifest.json", encoding="utf-8"))
for name, (f, (x0, y0, x1, y1)) in REG.items():
    var = Image.open(f).convert("RGB").resize((W, H), Image.LANCZOS)
    box = (int(x0*s), int(y0*s), int(x1*s), int(y1*s))
    m = Image.new("L", (W, H), 0); m.paste(255, (box[0]+14, box[1]+14, box[2]-14, box[3]-14)); m = m.filter(ImageFilter.GaussianBlur(9))
    bbox = m.point(lambda v: 255 if v > 4 else 0).getbbox()
    layer = var.convert("RGBA"); layer.putalpha(m); layer = layer.crop(bbox)
    layer.save(f"{OUT}/{name}.v4.webp", "WEBP", quality=90, method=6)
    manifest["warstwy"][name] = {"x": round(bbox[0]/W*100, 3), "y": round(bbox[1]/H*100, 3), "w": round((bbox[2]-bbox[0])/W*100, 3), "h": round((bbox[3]-bbox[1])/H*100, 3)}
    print(name, bbox)
from PIL import ImageChops
var = Image.open("auto-noc.png").convert("RGB").resize((W, H), Image.LANCZOS)
box = tuple(int(c*s) for c in (680, 290, 905, 480))
diff = ImageChops.difference(var, noc_full.resize((W, H), Image.LANCZOS)).convert("L")
m = diff.filter(ImageFilter.GaussianBlur(1.2)).point(lambda v: 255 if v > 26 else 0)
region = Image.new("L", (W, H), 0); region.paste(255, box); m = ImageChops.multiply(m, region)
m = m.filter(ImageFilter.MinFilter(7)).filter(ImageFilter.MaxFilter(15)).filter(ImageFilter.GaussianBlur(3))
bbox = m.point(lambda v: 255 if v > 8 else 0).getbbox()
layer = var.convert("RGBA"); layer.putalpha(m); layer = layer.crop(bbox); layer.save(f"{OUT}/auto-noc.v4.webp", "WEBP", quality=90, method=6)
manifest["warstwy"]["auto-noc"] = {"x": round(bbox[0]/W*100, 3), "y": round(bbox[1]/H*100, 3), "w": round((bbox[2]-bbox[0])/W*100, 3), "h": round((bbox[3]-bbox[1])/H*100, 3)}
print("auto-noc", bbox)
json.dump(manifest, open(f"{OUT}/manifest.json", "w", encoding="utf-8"), ensure_ascii=False, indent=2)
print("ok")
