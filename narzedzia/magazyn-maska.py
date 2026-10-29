# Ciasna maska warstw magazynu w widoku domu (deye1..3, fox1..3): sam sprzęt bez kawałków ściany.
# Warstwy v4 (maska różnicowa) zabierały prostokąty ściany w innym odcieniu niż baza — po przesunięciu sprzętu
# pod tylną ścianę (KOREKTA_DOM w Scena.tsx) było je widać. Sprzęt jest biały/szary, ściana beżowa:
# maska = mało nasycone i jasne piksele (+ wypełnione dziury, np. granatowe logo), przemnożona przez starą alfę.
# Użycie: python magazyn-maska.py <public/img/scena> <wersja wejściowa> <wersja wyjściowa>
import sys
from PIL import Image, ImageChops, ImageDraw, ImageFilter
D, VIN, VOUT = sys.argv[1], sys.argv[2], sys.argv[3]


def wypelnij_dziury(b):
    tlo = Image.new("L", (b.width + 2, b.height + 2), 255); tlo.paste(ImageChops.invert(b), (1, 1))
    ImageDraw.floodfill(tlo, (0, 0), 128)
    return ImageChops.lighter(b, tlo.crop((1, 1, b.width + 1, b.height + 1)).point(lambda v: 255 if v == 255 else 0))


for n in ["deye1", "deye2", "deye3", "fox1", "fox2", "fox3"]:
    l = Image.open(f"{D}/{n}.v{VIN}.webp").convert("RGBA")
    h, s, v = l.convert("RGB").convert("HSV").split()
    sprzet = ImageChops.multiply(s.point(lambda x: 255 if x < 122 else 0), v.point(lambda x: 255 if x > 110 else 0))
    sprzet = sprzet.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.MaxFilter(7)).filter(ImageFilter.MinFilter(3))
    sprzet = wypelnij_dziury(sprzet).filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.GaussianBlur(1))
    l.putalpha(ImageChops.multiply(l.getchannel("A"), sprzet))
    l.save(f"{D}/{n}.v{VOUT}.webp", "WEBP", quality=90, method=6)
    print(n, l.size)
