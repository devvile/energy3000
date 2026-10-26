// Wygenerowane z public/img/scena/manifest.json (skrypty warstwy.py, warstwy-noc.py) — położenie warstw w % sceny; kolejność = kolejność rysowania. Nie edytuj ręcznie.
export const SCENA = { szerokosc: 1920, wysokosc: 1086 } as const;

export type WarstwaId = "panele" | "falownik" | "agregat" | "deye1" | "deye2" | "deye3" | "fox1" | "fox2" | "fox3" | "auto" | "agregat-noc" | "auto-noc";

export const WARSTWY: Record<WarstwaId, { x: number; y: number; w: number; h: number }> = {
  "panele": {
    "x": 10.99,
    "y": 3.223,
    "w": 70.521,
    "h": 43.646
  },
  "falownik": {
    "x": 59.948,
    "y": 46.133,
    "w": 13.75,
    "h": 11.326
  },
  "agregat": {
    "x": 83.125,
    "y": 48.25,
    "w": 9.167,
    "h": 13.996
  },
  "deye1": {
    "x": 65.885,
    "y": 45.58,
    "w": 8.125,
    "h": 11.878
  },
  "deye2": {
    "x": 68.438,
    "y": 46.501,
    "w": 5.469,
    "h": 13.72
  },
  "deye3": {
    "x": 67.031,
    "y": 45.856,
    "w": 6.875,
    "h": 13.168
  },
  "fox1": {
    "x": 67.917,
    "y": 46.777,
    "w": 5.99,
    "h": 10.497
  },
  "fox2": {
    "x": 67.188,
    "y": 46.041,
    "w": 6.771,
    "h": 10.589
  },
  "fox3": {
    "x": 68.646,
    "y": 46.593,
    "w": 5.26,
    "h": 11.602
  },
  "auto": {
    "x": 59.74,
    "y": 45.672,
    "w": 14.167,
    "h": 22.007
  },
  "agregat-noc": {
    "x": 83.125,
    "y": 48.25,
    "w": 9.167,
    "h": 13.996
  },
  "auto-noc": {
    "x": 59.531,
    "y": 43.462,
    "w": 14.531,
    "h": 24.77
  }
};
