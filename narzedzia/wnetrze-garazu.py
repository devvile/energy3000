# Widok domu: magazyn jako całe wnętrze bramy garażu z wariantu (ściany + podłoga + sprzęt), nie osobna warstwa.
# Generator przy każdej edycji przerysowuje wnętrze garażu (przesuwa tylną ścianę), więc sprzętu nie da się wyciąć
# różnicowo — za to rama bramy zgadza się z bazą co do piksela (sprawdzone korelacją krawędzi), więc podmieniamy
# wszystko, co widać przez otwór bramy. Otwór = OTWOR_BRAMY w Scena.tsx (% sceny), krawędź lekko zmiękczona.
# Użycie: python wnetrze-garazu.py <public/img/scena> <folder źródeł> <wersja>
# Źródła (2026-10-29, gpt_image_2_5, folder zrodla-scen/dom-przy-scianie): dom-deye3.png, dom-fox3.png (high)
# i dom-deye1.png, dom-fox1.png (medium, edycje tamtych); deye2 i fox2 składane (ZLOZENIA). dom-deye2/fox2.png to nieudane edycje.
import json, os, sys
from PIL import Image, ImageDraw, ImageFilter
OUT, SRC, V = sys.argv[1], sys.argv[2], sys.argv[3]
W, H = 1920, 1086
OTWOR = [(59.3, 43.9), (74.4, 48.9), (74.4, 62.0), (59.3, 62.0)]
maska = Image.new("L", (W, H), 0)
ImageDraw.Draw(maska).polygon([(x / 100 * W, y / 100 * H) for x, y in OTWOR], fill=255)
maska = maska.filter(ImageFilter.GaussianBlur(1.5))
bbox = maska.getbbox()
# Wyrównanie wariantów medium do bazy (skala, dx, dy w px źródła 2688×1520) — z korelacji krawędzi ramy bramy.
WYROWNANIE = {"deye1": (1.0, 0, -2), "fox1": (1.0, 0, -2)}
# Zestawy złożone z dwóch źródeł (edycja medium nie usunęła sprzętu): (baza, źródło łatki, prostokąt łatki w % sceny).
# Ściana i podłoga w obu źródłach leżą w tym samym miejscu (edycje tej samej bazy), więc łatka zasłania zbędny moduł.
ZLOZENIA = {
    "deye2": ("dom-deye3.png", "dom-fox3.png", (70.3, 49.5, 73.4, 58.5)),
    "fox2": ("dom-fox3.png", "dom-fox1.png", (67.4, 52.7, 70.6, 56.6)),
}


def wczytaj(nazwa_pliku, n):
    var = Image.open(os.path.join(SRC, nazwa_pliku)).convert("RGBA")
    sk, dx, dy = WYROWNANIE.get(nazwa_pliku.removeprefix("dom-").removesuffix(".png"), (1.0, 0, 0))
    if (sk, dx, dy) != (1.0, 0, 0):
        w0, h0 = var.size
        var = var.resize((round(w0 * sk), round(h0 * sk)), Image.LANCZOS).crop((dx, dy, dx + w0, dy + h0))
    return var.resize((W, H), Image.LANCZOS)


man = json.load(open(f"{OUT}/manifest.json", encoding="utf-8"))
for n in ["deye1", "deye2", "deye3", "fox1", "fox2", "fox3"]:
    if n in ZLOZENIA:
        baza, zrodlo, (x0, y0, x1, y1) = ZLOZENIA[n]
        var = wczytaj(baza, n); latka = wczytaj(zrodlo, n)
        m = Image.new("L", (W, H), 0); ImageDraw.Draw(m).rectangle((x0 / 100 * W, y0 / 100 * H, x1 / 100 * W, y1 / 100 * H), fill=255)
        var.paste(latka, (0, 0), m.filter(ImageFilter.GaussianBlur(3)))
    else:
        if not os.path.exists(os.path.join(SRC, f"dom-{n}.png")): print("BRAK", n); continue
        var = wczytaj(f"dom-{n}.png", n)
    var.putalpha(maska)
    var.crop(bbox).save(f"{OUT}/{n}.v{V}.webp", "WEBP", quality=90, method=6)
    man["warstwy"][n] = {"x": round(bbox[0] / W * 100, 3), "y": round(bbox[1] / H * 100, 3), "w": round((bbox[2] - bbox[0]) / W * 100, 3), "h": round((bbox[3] - bbox[1]) / H * 100, 3)}
    print(n, bbox)
json.dump(man, open(f"{OUT}/manifest.json", "w", encoding="utf-8"), ensure_ascii=False, indent=2)
