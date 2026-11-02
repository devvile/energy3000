"""Warstwy pionowej sceny domu (wersja na telefon) z wariantów Higgsfielda.

Użycie: python warstwy-pion.py <folder źródeł pion> <public/img/pion> <wersja>

Źródła (narzedzia/zrodla-scen/pion): baza.png (dom bez sprzętu, 1520x2688), noc.png i warianty:
panele, falownik, deye1..3, fox1..3, auto, agregat — każdy to edycja bazy w gpt_image_2_5.
Generator przy każdej edycji lekko przesuwa i przerysowuje cały obraz, więc:
1) wariant wyrównujemy do bazy (korelacja fazowa, przesunięcie o całe piksele),
2) w obszarze, w którym miał się pojawić sprzęt (ROI), liczymy maskę różnicy, czyścimy ją z cienkich
   krawędzi (otwarcie), zamykamy dziury i rozmywamy brzegi,
3) zapisujemy łatkę RGBA przyciętą do maski + manifest.json z położeniem w % sceny.
Magazyny i stary falownik: łatka to całe wnętrze bramy garażu (prostokąt), żeby sprzęt nie miał szwów na ścianie.
"""

import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

SRC, OUT, WER = Path(sys.argv[1]), Path(sys.argv[2]), sys.argv[3]
OUT.mkdir(parents=True, exist_ok=True)

baza = Image.open(SRC / "baza.png").convert("RGB")
W, H = baza.size
B = np.asarray(baza).astype(np.int32)

# Wnętrze bramy garażu (piksele bazy) — łatka magazynów i falownika.
BRAMA = (1030, 1345, 1410, 1652)
# Obszary szukania zmian: x0, y0, x1, y1
ROI = {
    "panele": (0, 600, 1500, 1300),  # dach domu i dach garażu
    "auto": (980, 1380, 1520, 1800),
    "agregat": (640, 1480, 1060, 1830),  # w ogródku przy podjeździe
}
MAGAZYNY = ["falownik", "deye1", "deye2", "deye3", "fox1", "fox2", "fox3"]


def przesuniecie(a: np.ndarray, b: np.ndarray) -> tuple[int, int]:
    """Przesunięcie (dy, dx), o które trzeba przesunąć b, żeby pasował do a (korelacja fazowa na szarości)."""
    ga = a.mean(2)
    gb = b.mean(2)
    fa = np.fft.fft2(ga - ga.mean())
    fb = np.fft.fft2(gb - gb.mean())
    r = fa * np.conj(fb)
    r /= np.abs(r) + 1e-9
    c = np.fft.ifft2(r).real
    dy, dx = np.unravel_index(np.argmax(c), c.shape)
    if dy > c.shape[0] // 2:
        dy -= c.shape[0]
    if dx > c.shape[1] // 2:
        dx -= c.shape[1]
    return int(dy), int(dx)


def wyrownaj(img: Image.Image) -> Image.Image:
    a = np.asarray(img).astype(np.int32)
    dy, dx = przesuniecie(B, a)
    if dy or dx:
        print(f"  przesunięcie dy={dy} dx={dx}")
        a = np.roll(a, (dy, dx), axis=(0, 1))
    return Image.fromarray(a.astype(np.uint8))


def maska_zmian(v: np.ndarray, roi) -> Image.Image:
    x0, y0, x1, y1 = roi
    d = np.abs(v - B).sum(2)
    m = np.zeros((H, W), np.uint8)
    m[y0:y1, x0:x1] = (d[y0:y1, x0:x1] > 90) * 255
    im = Image.fromarray(m)
    im = im.filter(ImageFilter.MinFilter(7)).filter(ImageFilter.MaxFilter(7))  # bez cienkich krawędzi
    im = im.filter(ImageFilter.MaxFilter(31)).filter(ImageFilter.MinFilter(21))  # zamknięcie dziur + zapas
    return im.filter(ImageFilter.GaussianBlur(8))


def maska_dachu(v: np.ndarray, roi) -> Image.Image:
    """Panele: ciemne na ciemnej dachówce dają słabą różnicę punktową — liczymy rozmytą różnicę (tekstura dachówki
    znika pod panelami), a potem domykamy maskę. Drobne śmieci we wnętrzu nie szkodzą (wariant jest tam prawie taki sam)."""
    x0, y0, x1, y1 = roi
    d = np.abs(v - B).sum(2).astype(np.float32)
    m = np.zeros((H, W), np.float32)
    m[y0:y1, x0:x1] = d[y0:y1, x0:x1]
    im = Image.fromarray(np.clip(m, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(10))
    im = im.point(lambda p: 255 if p > 30 else 0).filter(ImageFilter.MinFilter(9)).filter(ImageFilter.MaxFilter(25))
    return im.filter(ImageFilter.GaussianBlur(6))


def maska_bramy() -> Image.Image:
    x0, y0, x1, y1 = BRAMA
    m = np.zeros((H, W), np.uint8)
    m[y0 + 4 : y1 - 4, x0 + 4 : x1 - 4] = 255
    return Image.fromarray(m).filter(ImageFilter.GaussianBlur(3))


manifest = {"szerokosc": W, "wysokosc": H, "wersja": int(WER), "warstwy": {}}
for nazwa in ["panele", *MAGAZYNY, "auto", "agregat"]:
    print(nazwa)
    v_img = wyrownaj(Image.open(SRC / f"{nazwa}.png").convert("RGB"))
    v = np.asarray(v_img).astype(np.int32)
    if nazwa in MAGAZYNY:
        alfa = maska_bramy()
    elif nazwa == "panele":
        alfa = maska_dachu(v, ROI[nazwa])
    else:
        alfa = maska_zmian(v, ROI[nazwa])
    bbox = alfa.point(lambda p: 255 if p > 8 else 0).getbbox()
    if not bbox:
        print("  brak zmian!")
        continue
    rgba = v_img.copy()
    rgba.putalpha(alfa)
    rgba.crop(bbox).save(OUT / f"{nazwa}.v{WER}.webp", quality=88, method=6)
    x0, y0, x1, y1 = bbox
    manifest["warstwy"][nazwa] = {
        "x": round(x0 / W * 100, 3),
        "y": round(y0 / H * 100, 3),
        "w": round((x1 - x0) / W * 100, 3),
        "h": round((y1 - y0) / H * 100, 3),
    }

baza.save(OUT / f"dom.v{WER}.webp", quality=86, method=6)
wyrownaj(Image.open(SRC / "noc.png").convert("RGB")).save(OUT / f"noc.v{WER}.webp", quality=86, method=6)
(OUT / "manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
print("ok")
