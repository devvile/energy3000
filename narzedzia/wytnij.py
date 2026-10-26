# Zdejmuje białe tło renderów produktowych: flood-fill od krawędzi po pikselach bliskich bieli,
# z miękką krawędzią (alpha wg odległości od bieli). Argumenty: wejście wyjście [tolerancja]
import sys
from collections import deque
from PIL import Image, ImageFilter

src, dst = sys.argv[1], sys.argv[2]
tol = int(sys.argv[3]) if len(sys.argv) > 3 else 18
im = Image.open(src).convert("RGB")
w, h = im.size
px = im.load()
seen = bytearray(w * h)
q = deque()
REF = px[2, 2]
def near_white(p): return max(abs(p[i] - REF[i]) for i in range(3)) <= tol
for x in range(w):
    for y in (0, h - 1):
        if near_white(px[x, y]) and not seen[y * w + x]: seen[y * w + x] = 1; q.append((x, y))
for y in range(h):
    for x in (0, w - 1):
        if near_white(px[x, y]) and not seen[y * w + x]: seen[y * w + x] = 1; q.append((x, y))
while q:
    x, y = q.popleft()
    for nx, ny in ((x+1,y),(x-1,y),(x,y+1),(x,y-1)):
        if 0 <= nx < w and 0 <= ny < h and not seen[ny*w+nx] and near_white(px[nx, ny]):
            seen[ny*w+nx] = 1; q.append((nx, ny))
# maska: 0 = tło (odnalezione floodem), 255 = produkt
mask = Image.new("L", (w, h), 255)
mp = mask.load()
for y in range(h):
    for x in range(w):
        if seen[y*w+x]:
            mp[x, y] = 0
mask = mask.filter(ImageFilter.GaussianBlur(0.9))
out = im.convert("RGBA"); out.putalpha(mask)
bbox = mask.getbbox(); out = out.crop(bbox)
out.save(dst)
print(dst, out.size, "tło:", round(100*sum(seen)/(w*h)), "%")
