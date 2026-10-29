# Narzędzia do konfiguratora 3D

Skrypty, które zrobiły warstwy sceny domu i garażu (`public/img/scena`, `public/img/garaz`) oraz zrzuty ekranu do sprawdzania wyglądu.
Potrzebny Python 3 z Pillow (`pip install pillow`) i Node z Playwrightem (`npm i playwright && npx playwright install chromium`, poza repo).

## Warstwy sceny (Higgsfield → WebP z przezroczystością)
- `zrodla-scen/` — oryginały z Higgsfield (gpt_image_2_5, 2688×1520): `scena-a.png` (baza dnia), `noc.png`, warianty sprzętu (`deye1..3`, `fox1..3`, `panele`, `falownik`, `agregat`, `auto`, `*-noc`), scena garażu `garaz-b.png` i jej warianty `g*.png`. **Folder jest w .gitignore** (ok. 120 MB) — trzymaj kopię poza repo.
- `warstwy.py <public/img/scena>` — z każdego wariantu wycina różnicę względem bazy (maska różnicowa) albo cały wycinek z miękką krawędzią (łatka: `agregat`, `falownik`) i zapisuje `nazwa.vN.webp` + `manifest.json` (położenie w % sceny; kolejność = kolejność rysowania).
- `wnetrze-garazu.py <public/img/scena> <folder źródeł> <wersja>` — magazyn w widoku domu (od v6): całe wnętrze bramy garażu z wariantu (sprzęt przy ścianie + ściany i podłoga), bo generator przy każdej edycji przerysowuje wnętrze garażu i osobnych warstw nie da się wyciąć. Rama bramy zgadza się z bazą (sprawdzone korelacją krawędzi), drobne przesunięcia wariantów medium w `WYROWNANIE`, zestawy składane z dwóch źródeł w `ZLOZENIA`. Źródła w `zrodla-scen/dom-przy-scianie/`. Po wycięciu wygeneruj `warstwy.ts` z `manifest.json` i ustaw `WERSJA_MAGAZYNU` oraz `PODPIS_MAGAZYNU` w `Scena.tsx`.
- `warstwy-noc.py` — nocne łatki agregatu i auta (ze `noc.png`), dopisuje do manifestu.
- `warstwy-garaz.py <public/img/garaz> <folder źródeł> <wersja>` — scena garażu (zbliżenie na tylną ścianę). Od v2 źródła są w `zrodla-scen/garaz-zblizenie/` (`garaz.png` + `gdeye1..3`, `gfox1..3`, `gfalownik` — każdy wariant to edycja tej samej bazy w gpt_image_2_5, druga referencja = stary wariant ze sprzętem). Warstwy to „łatki” z miękką krawędzią (biały sprzęt na beżowej ścianie daje dziurawą maskę różnicową), sprzęt stojący na podłodze ma łatkę do dołu kadru razem z odbiciem. Uruchamiaj z folderu tymczasowego (zapisuje podglądy do bieżącego katalogu). Potem wygeneruj `warstwyGaraz.ts` z `manifest.json` — wersja idzie do nazw plików.
- Po wycięciu: wygeneruj `src/components/konfigurator3d/warstwy.ts` (skrypt node w historii commitów / sesji) i **podbij `WERSJA_WARSTW` w `Scena.tsx` oraz numer w nazwach plików** — Next trzyma zoptymalizowane obrazki w cache pod adresem pliku.
- Uruchamiaj ze ścieżką windowsową (`F:/...`), nie `/f/...`.

## Zdjęcia produktów
- `wytnij.py wejście wyjście [tolerancja]` — zdejmuje jednolite tło (kolor z narożnika) ze zdjęcia produktu na białym tle, maska binarna z miękką krawędzią.

## Zrzuty (Playwright)
- `zrzuty/k3d.mjs <url> <prefix> [szerokość]` — przechodzi konfigurator 3D (`/konfigurator-3d` albo `/#cena` na stronie głównej) krok po kroku i zapisuje zrzut każdego kroku (desktop 1440 albo np. 390).
- `zrzuty/kreator.mjs` — `/konfigurator`, `zrzuty/shot.mjs` i `linia.mjs` — sekcja „Cena” na stronie głównej.
