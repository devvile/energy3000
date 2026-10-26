# Narzędzia do konfiguratora 3D

Skrypty, które zrobiły warstwy sceny domu i garażu (`public/img/scena`, `public/img/garaz`) oraz zrzuty ekranu do sprawdzania wyglądu.
Potrzebny Python 3 z Pillow (`pip install pillow`) i Node z Playwrightem (`npm i playwright && npx playwright install chromium`, poza repo).

## Warstwy sceny (Higgsfield → WebP z przezroczystością)
- `zrodla-scen/` — oryginały z Higgsfield (gpt_image_2_5, 2688×1520): `scena-a.png` (baza dnia), `noc.png`, warianty sprzętu (`deye1..3`, `fox1..3`, `panele`, `falownik`, `agregat`, `auto`, `*-noc`), scena garażu `garaz-b.png` i jej warianty `g*.png`. **Folder jest w .gitignore** (ok. 120 MB) — trzymaj kopię poza repo.
- `warstwy.py <public/img/scena>` — z każdego wariantu wycina różnicę względem bazy (maska różnicowa) albo cały wycinek z miękką krawędzią (łatka: `agregat`, `falownik`) i zapisuje `nazwa.vN.webp` + `manifest.json` (położenie w % sceny; kolejność = kolejność rysowania).
- `warstwy-noc.py` — nocne łatki agregatu i auta (ze `noc.png`), dopisuje do manifestu.
- `warstwy-garaz.py <public/img/garaz>` — to samo dla sceny garażu.
- Po wycięciu: wygeneruj `src/components/konfigurator3d/warstwy.ts` (skrypt node w historii commitów / sesji) i **podbij `WERSJA_WARSTW` w `Scena.tsx` oraz numer w nazwach plików** — Next trzyma zoptymalizowane obrazki w cache pod adresem pliku.
- Uruchamiaj ze ścieżką windowsową (`F:/...`), nie `/f/...`.

## Zdjęcia produktów
- `wytnij.py wejście wyjście [tolerancja]` — zdejmuje jednolite tło (kolor z narożnika) ze zdjęcia produktu na białym tle, maska binarna z miękką krawędzią.

## Zrzuty (Playwright)
- `zrzuty/k3d.mjs <url> <prefix> [szerokość]` — przechodzi `/konfigurator-3d` krok po kroku i zapisuje zrzut każdego kroku (desktop 1440 albo np. 390).
- `zrzuty/kreator.mjs` — `/konfigurator`, `zrzuty/shot.mjs` i `linia.mjs` — sekcja „Cena” na stronie głównej.
