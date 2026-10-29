# Warstwy dla sceny garażu (zbliżenie): różnica wariant − baza → RGBA. Wynik: public/img/garaz/*.vN.webp + manifest.json
# Użycie: python warstwy-garaz.py <public/img/garaz> <folder źródeł> <wersja>
# Źródła (Higgsfield, gpt_image_2_5): garaz.png (pusta ściana) i warianty g*.png — każdy wariant to edycja tej samej bazy.
# v2 (2026-10-29): bliższe ujęcie tylnej ściany (folder zrodla-scen/garaz-zblizenie), sprzęt zajmuje ok. 2/3 wysokości kadru.
import json, os, sys
from PIL import Image, ImageChops, ImageDraw, ImageFilter
OUT, SRC, V = sys.argv[1], sys.argv[2], sys.argv[3]
W = 1920
base_full = Image.open(os.path.join(SRC, "garaz.png")).convert("RGB")
H = round(base_full.height * W / base_full.width)
base = base_full.resize((W, H), Image.LANCZOS)
base.save(f"{OUT}/garaz.v{V}.webp", "WEBP", quality=88, method=6)
NAZWY = {"g-deye1": "gdeye1.png", "g-deye2": "gdeye2.png", "g-deye3": "gdeye3.png", "g-fox1": "gfox1.png", "g-fox2": "gfox2.png", "g-fox3": "gfox3.png", "g-falownik": "gfalownik.png"}
# gdzie szukamy sprzętu: środkowo-lewa część tylnej ściany nad listwą przypodłogową (w px podglądu 1200x679)
REG_SCIANA = (110, 20, 840, 490)
ZAPAS, MIEKKO = 40, 36  # margines łatki wokół sprzętu i szerokość miękkiej krawędzi (px przy 1920)
P = 1200; s = W / P


def bez_drobnych(m, min_udzial=0.002):
    """Usuwa drobne plamki (szum w odblaskach podłogi): zostają tylko spójne obszary większe niż min_udzial kadru."""
    k = 4; mal = m.resize((m.width // k, m.height // k), Image.NEAREST).point(lambda v: 255 if v > 127 else 0)
    zostaw = Image.new("L", mal.size, 0); prog = min_udzial * mal.width * mal.height
    while True:
        bb = mal.point(lambda v: 255 if v == 255 else 0).getbbox()
        if not bb: break
        y = bb[1]; x = next(x for x in range(bb[0], bb[2]) if mal.getpixel((x, y)) == 255)
        ImageDraw.floodfill(mal, (x, y), 100)
        if mal.histogram()[100] >= prog: zostaw.paste(255, mask=mal.point(lambda v: 255 if v == 100 else 0))
        mal = mal.point(lambda v: 0 if v == 100 else v)
    return ImageChops.multiply(m, zostaw.resize(m.size, Image.NEAREST).filter(ImageFilter.MaxFilter(9)))


manifest = {"wersja": int(V), "szerokosc": W, "wysokosc": H, "warstwy": {}}
for name, f in NAZWY.items():
    var = Image.open(os.path.join(SRC, f)).convert("RGB").resize((W, H), Image.LANCZOS)
    # Biały sprzęt na beżowej ścianie daje dziurawą maskę różnicową, więc maska służy tylko do znalezienia sprzętu.
    # Warstwa to „łatka”: cały prostokąt wariantu wokół sprzętu z miękką krawędzią — ściana w wariancie i bazie jest ta sama.
    diff = ImageChops.difference(var, base).convert("L")
    m = diff.filter(ImageFilter.GaussianBlur(1.2)).point(lambda v: 255 if v > 22 else 0)
    region = Image.new("L", (W, H), 0); region.paste(255, tuple(int(c*s) for c in REG_SCIANA)); m = ImageChops.multiply(m, region)
    m = bez_drobnych(m.filter(ImageFilter.MaxFilter(15)).filter(ImageFilter.MinFilter(15)))
    bb = m.getbbox()
    if not bb: print("BRAK", name); continue
    na_podlodze = bb[3] >= int(REG_SCIANA[3] * s) - 20  # stoi na podłodze → łatka do dołu kadru (odbicie w posadzce)
    bbox = (max(0, bb[0] - ZAPAS), max(0, bb[1] - ZAPAS), min(W, bb[2] + ZAPAS), H if na_podlodze else min(H, bb[3] + ZAPAS))
    pw, ph = bbox[2] - bbox[0], bbox[3] - bbox[1]
    alfa = Image.new("L", (pw, ph), 0)
    alfa.paste(255, (MIEKKO, MIEKKO, pw - MIEKKO, ph if na_podlodze else ph - MIEKKO))
    alfa = alfa.filter(ImageFilter.GaussianBlur(MIEKKO / 2))
    layer = var.crop(bbox).convert("RGBA"); layer.putalpha(alfa)
    layer.save(f"{OUT}/{name}.v{V}.webp", "WEBP", quality=90, method=6)
    manifest["warstwy"][name] = {"x": round(bbox[0]/W*100, 3), "y": round(bbox[1]/H*100, 3), "w": round((bbox[2]-bbox[0])/W*100, 3), "h": round((bbox[3]-bbox[1])/H*100, 3)}
    print(name, bbox)
json.dump(manifest, open(f"{OUT}/manifest.json", "w", encoding="utf-8"), ensure_ascii=False, indent=2)
tiles = [Image.open(f"{OUT}/{n}.v{V}.webp").convert("RGBA") for n in NAZWY if n in manifest["warstwy"]]
h = 320; tiles = [t.resize((max(1, round(t.width*h/t.height)), h)) for t in tiles]
sheet = Image.new("RGBA", (sum(t.width for t in tiles)+10*len(tiles), h), (90,90,90,255)); x = 0
for t in tiles: sheet.alpha_composite(t, (x, 0)); x += t.width+10
sheet.convert("RGB").save("garaz-warstwy-podglad.jpg", quality=85)
comp = base.convert("RGBA"); mm = manifest["warstwy"]["g-deye2"]; l = Image.open(f"{OUT}/g-deye2.v{V}.webp").convert("RGBA")
comp.alpha_composite(l, (round(mm["x"]/100*W), round(mm["y"]/100*H))); comp.convert("RGB").resize((1200, round(1200*H/W))).save("garaz-kompozyt-podglad.jpg", quality=85)
print("ok")
