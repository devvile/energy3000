# Wycina warstwy sprzętu: różnica wariant − baza w zadanym obszarze → RGBA z pikselami wariantu.
# Wynik: public/img/scena/*.webp + manifest.json z położeniem warstw w % sceny.
import json, sys
from PIL import Image, ImageChops, ImageFilter
OUT = sys.argv[1]
W = 1920  # szerokość docelowa sceny
base_full = Image.open("scena-a.png").convert("RGB")
fx = W / base_full.width
H = round(base_full.height * fx)
base = base_full.resize((W, H), Image.LANCZOS)
base.save(f"{OUT}/scena-dzien.webp", "WEBP", quality=88, method=6)
Image.open("noc.png").convert("RGB").resize((W, H), Image.LANCZOS).save(f"{OUT}/scena-noc.webp", "WEBP", quality=88, method=6)
# obszary w pikselach podglądu 1200x679 (x0,y0,x1,y1) — przeliczane na W
P = 1200
REG = {
  "panele":   (225, 35, 940, 305),
  "falownik": (722, 316, 882, 388),
  "agregat":  (1000, 330, 1105, 420),
  "deye1": (690, 270, 905, 430), "deye2": (690, 270, 905, 430), "deye3": (690, 270, 905, 430),
  "fox1":  (690, 270, 905, 430), "fox2":  (690, 270, 905, 430), "fox3":  (690, 270, 905, 430),
  "auto":  (680, 290, 905, 480),
}
PROG = {"panele": 34, "auto": 30, "falownik": 30}
manifest = {"szerokosc": W, "wysokosc": H, "warstwy": {}}
for name, (x0, y0, x1, y1) in REG.items():
    var = Image.open(f"{name}.png").convert("RGB").resize((W, H), Image.LANCZOS)
    s = W / P
    box = (int(x0*s), int(y0*s), int(x1*s), int(y1*s))
    diff = ImageChops.difference(var, base).convert("L")
    thr = PROG.get(name, 26)
    if name in ("agregat", "falownik"):
        # Łatka: cały obszar z wariantu z miękką krawędzią — otoczenie jest identyczne jak w bazie, więc szew jest niewidoczny,
        # a ciemny sprzęt na ciemnym tle nie dostaje dziur jak przy masce różnicowej.
        m = Image.new("L", (W, H), 0); m.paste(255, (box[0]+14, box[1]+14, box[2]-14, box[3]-14)); m = m.filter(ImageFilter.GaussianBlur(9))
        bbox = m.point(lambda v: 255 if v > 4 else 0).getbbox()
        layer = var.convert("RGBA"); layer.putalpha(m); layer = layer.crop(bbox)
        layer.save(f"{OUT}/{name}.v4.webp", "WEBP", quality=90, method=6)
        manifest["warstwy"][name] = {"x": round(bbox[0]/W*100, 3), "y": round(bbox[1]/H*100, 3), "w": round((bbox[2]-bbox[0])/W*100, 3), "h": round((bbox[3]-bbox[1])/H*100, 3)}
        print(name, bbox, "łatka"); continue
    if name == "panele":
        from PIL import ImageDraw
        m = Image.new("L", (W, H), 0)
        ImageDraw.Draw(m).polygon([(int(px*s), int(py*s)) for px, py in [(232, 28), (972, 160), (935, 312), (138, 205)]], fill=255)
        m = m.filter(ImageFilter.GaussianBlur(4))
        bbox = m.getbbox()
        layer = var.convert("RGBA"); layer.putalpha(m); layer = layer.crop(bbox)
        layer.save(f"{OUT}/{name}.v4.webp", "WEBP", quality=90, method=6)
        manifest["warstwy"][name] = {"x": round(bbox[0]/W*100, 3), "y": round(bbox[1]/H*100, 3), "w": round((bbox[2]-bbox[0])/W*100, 3), "h": round((bbox[3]-bbox[1])/H*100, 3)}
        print(name, bbox, "wielokąt"); continue
    m = diff.filter(ImageFilter.GaussianBlur(1.2)).point(lambda v: 255 if v > thr else 0)
    # tylko obszar
    region = Image.new("L", (W, H), 0); region.paste(255, box); m = ImageChops.multiply(m, region)
    # odszumienie: usuń drobne plamki, potem rozszerz i zmiękcz krawędź
    m = m.filter(ImageFilter.MinFilter(7)).filter(ImageFilter.MaxFilter(15)).filter(ImageFilter.GaussianBlur(3))
    bbox = m.point(lambda v: 255 if v > 8 else 0).getbbox()
    if not bbox: print("BRAK", name); continue
    layer = var.convert("RGBA"); layer.putalpha(m); layer = layer.crop(bbox)
    layer.save(f"{OUT}/{name}.v4.webp", "WEBP", quality=90, method=6)
    manifest["warstwy"][name] = {"x": round(bbox[0]/W*100, 3), "y": round(bbox[1]/H*100, 3), "w": round((bbox[2]-bbox[0])/W*100, 3), "h": round((bbox[3]-bbox[1])/H*100, 3)}
    print(name, bbox, "pokrycie %", round(100*sum(m.getdata())/255/((box[2]-box[0])*(box[3]-box[1]))))
json.dump(manifest, open(f"{OUT}/manifest.json", "w", encoding="utf-8"), ensure_ascii=False, indent=2)
# podgląd: baza + wszystkie warstwy (deye3 + panele + agregat + auto + falownik)
comp = base.convert("RGBA")
for n in ["panele", "deye2", "agregat", "auto"]:
    l = Image.open(f"{OUT}/{n}.v4.webp").convert("RGBA"); mm = manifest["warstwy"][n]
    comp.alpha_composite(l, (round(mm["x"]/100*W), round(mm["y"]/100*H)))
comp.convert("RGB").resize((1200, round(1200*H/W))).save("kompozyt-podglad.jpg", quality=85)
# podgląd samych warstw na szarym
tiles = [Image.open(f"{OUT}/{n}.v4.webp").convert("RGBA") for n in ["auto","deye2","agregat","falownik"]]
h = 300; tiles = [t.resize((max(1, round(t.width*h/t.height)), h)) for t in tiles]
sheet = Image.new("RGBA", (sum(t.width for t in tiles)+10*len(tiles), h), (90,90,90,255)); x = 0
for t in tiles: sheet.alpha_composite(t, (x, 0)); x += t.width+10
sheet.convert("RGB").save("warstwy-podglad.jpg", quality=85); print("ok")
