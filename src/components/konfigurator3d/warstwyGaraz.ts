// Wygenerowane z public/img/garaz/manifest.json (skrypt warstwy-garaz.py) — scena garażu (zbliżenie). Nie edytuj ręcznie.
// Pliki: /img/garaz/garaz.v2.webp i /img/garaz/<id>.v2.webp (numer wersji w nazwie omija cache obrazków Next).
export const GARAZ = { szerokosc: 1920, wysokosc: 1086, wersja: 2 } as const;

export type WarstwaGarazId = "g-deye1" | "g-deye2" | "g-deye3" | "g-fox1" | "g-fox2" | "g-fox3" | "g-falownik";

export const WARSTWY_GARAZ: Record<WarstwaGarazId, { x: number; y: number; w: number; h: number }> = {
  "g-deye1": {
    "x": 29.115,
    "y": 16.206,
    "w": 14.635,
    "h": 83.794
  },
  "g-deye2": {
    "x": 32.344,
    "y": 13.26,
    "w": 24.948,
    "h": 86.74
  },
  "g-deye3": {
    "x": 24.271,
    "y": 15.654,
    "w": 31.719,
    "h": 84.346
  },
  "g-fox1": {
    "x": 30.365,
    "y": 10.129,
    "w": 16.823,
    "h": 56.262
  },
  "g-fox2": {
    "x": 34.427,
    "y": 12.707,
    "w": 15.99,
    "h": 58.471
  },
  "g-fox3": {
    "x": 28.958,
    "y": 1.934,
    "w": 27.76,
    "h": 59.945
  },
  "g-falownik": {
    "x": 31.25,
    "y": 1.75,
    "w": 10.833,
    "h": 44.291
  }
};
