// Dane konfiguratora — JEDYNE miejsce z cenami zestawów i opcji.
// Źródło: vault „10 Strategia/Oferta — konfigurator zestawów Deye i FoxESS” (ceny zamrożone przez wspólników 2026-10-26).
// Ceny brutto dla klienta (VAT 8% — montaż w domu mieszkalnym). Kosztów ani marż tu NIE MA — plik trafia do przeglądarki.

export type LiniaId = "deye" | "fox";
export type RozmiarId = "s" | "m" | "l";
export type Rozliczenie = "net-billing" | "net-metering";

export type Linia = {
  id: LiniaId;
  nazwa: string;
  haslo: string;
  dlaKogo: string;
  plusy: string[];
  ograniczenia: string[];
  wsparcie: string;
  /** Zdjęcie magazynu tej marki (public/img), wycięte z tła (WebP z przezroczystością). */
  obraz: { src: string; alt: string; podpis: string; zrodlo: string };
};

export const LINIE: Record<LiniaId, Linia> = {
  deye: {
    id: "deye",
    nazwa: "Deye",
    haslo: "Elastyczny",
    dlaKogo: "Dla tych, którzy patrzą na cenę i chcą dodatków: grzałka, agregat, magazyn do starej fotowoltaiki.",
    plusy: [
      "Taniej",
      "Wyjście GEN: grzałka, agregat i stara fotowoltaika bez dodatkowego osprzętu",
      "EMS Copilot z cenami energii z giełdy",
      "Wsparcie Procarte na miejscu w Kielcach",
      "Baterie 5 / 12 / 16 kWh można dowolnie łączyć",
    ],
    ograniczenia: [
      "Montaż tylko w ogrzewanym pomieszczeniu (bateria bez grzania)",
      "Bateria blisko falownika",
      "Wyższy pobór własny falownika",
    ],
    wsparcie: "Procarte (pierwsza linia), gwarancja Deye",
    obraz: {
      src: "/img/magazyn-deye-se-f16.webp",
      alt: "Magazyn energii Deye SE-F16, biała obudowa z okrągłym wyświetlaczem",
      podpis: "Deye SE-F16-C · 16 kWh",
      zrodlo: "deye.com (zdjęcie producenta)",
    },
  },
  fox: {
    id: "fox",
    nazwa: "FoxESS",
    haslo: "Bezobsługowy",
    dlaKogo:
      "Dla tych, którzy chcą znanej marki i spokoju: czysty montaż, prosta aplikacja, cały dom na zasilaniu awaryjnym w cenie.",
    plusy: [
      "Znana marka, lepsza aplikacja (FoxCloud), infolinia także dla klienta",
      "Niski pobór własny (ok. 40 W)",
      "Kable w komplecie, ładny montaż",
      "Baterie z grzaniem: montaż w garażu albo na zewnątrz",
      "Cały dom na zasilaniu awaryjnym w cenie",
    ],
    ograniczenia: ["Drożej", "Agregat tylko przez zewnętrzny przełącznik ATS", "Grzałka wymaga dodatkowego sterownika"],
    wsparcie: "Infolinia FoxESS (serwis w Gliwicach)",
    obraz: {
      src: "/img/magazyn-foxess-ep12.webp",
      alt: "Magazyn energii FoxESS EP12 Plus, biała obudowa z logo FoxESS, ujęcie z boku",
      podpis: "FoxESS EP12 Plus · 11,5 kWh",
      zrodlo: "itstechnologies.uk (dystrybutor, zdjęcie producenta)",
    },
  },
};

export type Zestaw = {
  linia: LiniaId;
  rozmiar: RozmiarId;
  nazwa: string; // np. „Deye M”
  kwh: number;
  falownikKw: number;
  backupNaFazeKw: number;
  pvMaxKwp: number; // reguła PME2: kWh ≥ 2 × kWp
  dom: string; // typowy dom
  sklad: string;
  cena: number; // brutto, z montażem
  /** Szacunkowa dotacja PME2 dla samego zestawu (30% pozycji „magazyn z montażem” na fakturze; podział faktury do ustalenia z Biurexem). */
  dotacjaSzacunek: number;
  polecany?: boolean;
};

const DOMY: Record<RozmiarId, string> = {
  s: "2–3 osoby, zużycie do ok. 4 MWh rocznie",
  m: "3–5 osób, pompa ciepła lub klimatyzacja",
  l: "duży dom, pompa ciepła i samochód elektryczny",
};

export const ZESTAWY: Zestaw[] = [
  { linia: "deye", rozmiar: "s", nazwa: "Deye S", kwh: 12, falownikKw: 8, backupNaFazeKw: 2.7, pvMaxKwp: 6, dom: DOMY.s, sklad: "SUN-8K-SG05LP3 + SE-F12-C", cena: 23_900, dotacjaSzacunek: 3_600 },
  { linia: "deye", rozmiar: "m", nazwa: "Deye M", kwh: 16, falownikKw: 10, backupNaFazeKw: 3.3, pvMaxKwp: 8, dom: DOMY.m, sklad: "SUN-10K-SG05LP3 + SE-F16-C", cena: 27_900, dotacjaSzacunek: 4_500, polecany: true },
  { linia: "deye", rozmiar: "l", nazwa: "Deye L", kwh: 24, falownikKw: 12, backupNaFazeKw: 4, pvMaxKwp: 12, dom: DOMY.l, sklad: "SUN-12K-SG05LP3 + 2 × SE-F12-C", cena: 35_900, dotacjaSzacunek: 7_000 },
  { linia: "fox", rozmiar: "s", nazwa: "Fox S", kwh: 11.5, falownikKw: 8, backupNaFazeKw: 2.7, pvMaxKwp: 5.7, dom: DOMY.s, sklad: "P3-8.0-SH + EP12 Plus", cena: 24_900, dotacjaSzacunek: 4_400 },
  { linia: "fox", rozmiar: "m", nazwa: "Fox M", kwh: 17.3, falownikKw: 10, backupNaFazeKw: 3.3, pvMaxKwp: 8.6, dom: DOMY.m, sklad: "P3-10.0-SH + 3 × EP6", cena: 30_900, dotacjaSzacunek: 6_400, polecany: true },
  { linia: "fox", rozmiar: "l", nazwa: "Fox L", kwh: 23, falownikKw: 12, backupNaFazeKw: 4, pvMaxKwp: 11.5, dom: DOMY.l, sklad: "P3-12.0-SH + 2 × EP12 Plus", cena: 36_900, dotacjaSzacunek: 8_000 },
];

export const W_KAZDYM_ZESTAWIE = [
  "Falownik hybrydowy trójfazowy",
  "Magazyn LFP z gwarancją 10 lat",
  "Licznik z przekładnikami",
  "EMS wbudowany w falownik (Deye Copilot / Fox EMS)",
  "Montaż, uruchomienie i konfiguracja aplikacji",
  "Protokół z pomiarami",
  "Zasilanie awaryjne dla wydzielonych obwodów (lodówka, piec CO, router, oświetlenie)",
  "Pomoc we wniosku PME2",
];

export type OpcjaId =
  | "bat5"
  | "bat58"
  | "bat12"
  | "bat16"
  | "calyDom"
  | "agregat"
  | "grzalka"
  | "ladowarka11"
  | "ladowarka22"
  | "staraPv"
  | "garaz"
  | "licznikLora"
  | "solcare";

export type Kategoria = "pojemnosc" | "backup" | "zastosowania";

/**
 * Dostępność opcji w danej linii:
 * - `cena` — płatna; `maks` ogranicza liczbę sztuk (liczba = dla każdego rozmiaru; mapa = tylko wymienione rozmiary, reszta niedostępna)
 * - `wCenie` — zawarta w zestawie, nie dolicza się i nie da się jej odznaczyć
 * - `brak` — niedostępna, z powodem do pokazania klientowi
 */
export type Dostepnosc =
  | { rodzaj: "cena"; cena: number; maks?: number | Partial<Record<RozmiarId, number>> }
  | { rodzaj: "wCenie" }
  | { rodzaj: "brak"; powod: string };

export type Opcja = {
  id: OpcjaId;
  kategoria: Kategoria;
  nazwa: string;
  opis: string;
  /** Opcje z tą samą grupą wykluczają się (np. jedna ładowarka). */
  grupa?: string;
  /** Dodatkowa pojemność magazynu za sztukę — liczy się do reguły 2× i do dotacji. */
  kwh?: number;
  /** Można wybrać więcej niż 1 sztukę. */
  wieleSztuk?: boolean;
  dostepnosc: Record<LiniaId, Dostepnosc>;
  /** Uczciwe zastrzeżenie, pokazywane przy opcji. */
  uwaga?: string;
};

// ZAŁOŻENIE (do potwierdzenia z Procarte): przy Deye dopuszczamy maks. 2 dodatkowe moduły jednego typu —
// przy większej rozbudowie trzeba sprawdzić, czy falownik wystarczy (uwaga z konfiguratora w vaulcie).
const MAKS_DEYE = 2;

export const OPCJE: Opcja[] = [
  {
    id: "bat5",
    kategoria: "pojemnosc",
    nazwa: "+5 kWh pojemności",
    opis: "Dodatkowy moduł baterii. Zacznij od mniejszego magazynu — rozbudujesz go w każdej chwili.",
    kwh: 5,
    wieleSztuk: true,
    dostepnosc: {
      deye: { rodzaj: "cena", cena: 4_290, maks: MAKS_DEYE },
      fox: { rodzaj: "brak", powod: "FoxESS nie ma modułu 5 kWh — wybierz +5,8 kWh (Fox M) albo +12 kWh (Fox S i L)." },
    },
  },
  {
    id: "bat58",
    kategoria: "pojemnosc",
    nazwa: "+5,8 kWh pojemności",
    opis: "Dodatkowy moduł EP6 do zestawu Fox M (maks. 4 moduły, czyli do 23 kWh).",
    kwh: 5.8,
    wieleSztuk: true,
    dostepnosc: {
      deye: { rodzaj: "brak", powod: "Moduł FoxESS — w Deye wybierz +5 kWh." },
      fox: { rodzaj: "cena", cena: 5_190, maks: { m: 1 } },
    },
  },
  {
    id: "bat12",
    kategoria: "pojemnosc",
    nazwa: "+12 kWh pojemności",
    opis: "Dodatkowy moduł baterii 12 kWh.",
    kwh: 12,
    wieleSztuk: true,
    dostepnosc: {
      deye: { rodzaj: "cena", cena: 7_590, maks: MAKS_DEYE },
      fox: { rodzaj: "cena", cena: 9_090, maks: { s: 3, l: 2 } },
    },
    uwaga: "W FoxESS modułów 6 i 12 kWh nie wolno mieszać.",
  },
  {
    id: "bat16",
    kategoria: "pojemnosc",
    nazwa: "+16 kWh pojemności",
    opis: "Dodatkowy moduł baterii 16 kWh.",
    kwh: 16,
    wieleSztuk: true,
    dostepnosc: {
      deye: { rodzaj: "cena", cena: 9_090, maks: MAKS_DEYE },
      fox: { rodzaj: "brak", powod: "FoxESS nie ma modułu 16 kWh." },
    },
  },
  {
    id: "calyDom",
    kategoria: "backup",
    nazwa: "Cały dom na zasilaniu awaryjnym",
    opis: "Przy braku prądu działa cały dom, z automatycznym przełączaniem. W cenie zestawu są tylko wydzielone obwody.",
    dostepnosc: {
      deye: { rodzaj: "cena", cena: 2_090 },
      fox: { rodzaj: "wCenie" },
    },
    uwaga:
      "Cały dom ma prąd, ale nie wszystko naraz: na jedną fazę falownik daje ok. 1/3 swojej mocy. Piekarnik z czajnikiem na jednej fazie wyłączą zasilanie awaryjne.",
  },
  {
    id: "agregat",
    kategoria: "backup",
    nazwa: "Podłączenie agregatu",
    opis: "Gdy prąd nie wraca wiele godzin, a magazyn się kończy, agregat startuje sam i doładowuje magazyn.",
    dostepnosc: {
      deye: { rodzaj: "cena", cena: 1_490 },
      fox: { rodzaj: "cena", cena: 2_490 },
    },
    uwaga: "Cena za podłączenie. Sam agregat (trójfazowy, ze stabilizacją napięcia i zdalnym startem) wyceniamy osobno.",
  },
  {
    id: "grzalka",
    kategoria: "zastosowania",
    nazwa: "Ciepła woda z nadwyżki",
    opis: "Gdy magazyn jest pełny, nadwyżka ze słońca grzeje wodę w Twoim bojlerze zamiast iść do sieci za grosze.",
    dostepnosc: {
      deye: { rodzaj: "cena", cena: 1_290 },
      fox: { rodzaj: "cena", cena: 2_390 },
    },
    uwaga: "Bojler musi mieć grzałkę elektryczną. Nowy bojler to osobna wycena (z dotacją do 1 000 zł na nowy elektryczny z UE).",
  },
  {
    id: "ladowarka11",
    kategoria: "zastosowania",
    nazwa: "Ładowarka do samochodu 11 kW",
    opis: "Ładowanie auta prądem ze słońca. Falownik pilnuje, żeby nie przeciążyć domu.",
    grupa: "ladowarka",
    dostepnosc: {
      deye: { rodzaj: "brak", powod: "W Deye oferujemy ładowarkę 22 kW." },
      fox: { rodzaj: "cena", cena: 3_690 },
    },
  },
  {
    id: "ladowarka22",
    kategoria: "zastosowania",
    nazwa: "Ładowarka do samochodu 22 kW",
    opis: "Ładowanie auta prądem ze słońca. Falownik pilnuje, żeby nie przeciążyć domu.",
    grupa: "ladowarka",
    dostepnosc: {
      deye: { rodzaj: "cena", cena: 2_890 },
      fox: { rodzaj: "cena", cena: 3_890 },
    },
  },
  {
    id: "staraPv",
    kategoria: "zastosowania",
    nazwa: "Magazyn do starej fotowoltaiki",
    opis: "Stary falownik zostaje i pracuje dalej, a magazyn z nowym falownikiem dokładamy obok. Panele na dachu nietknięte.",
    dostepnosc: {
      deye: { rodzaj: "cena", cena: 590 },
      fox: { rodzaj: "brak", powod: "W FoxESS wycena po rozmowie z Procarte — zapytaj w formularzu." },
    },
    uwaga: "Moc starej instalacji nie może być większa niż moc nowego falownika.",
  },
  {
    id: "garaz",
    kategoria: "zastosowania",
    nazwa: "Montaż w nieogrzewanym garażu lub na zewnątrz",
    opis: "Bateria z grzaniem pracuje także zimą.",
    dostepnosc: {
      deye: { rodzaj: "brak", powod: "Baterie Deye nie mają grzania — montaż tylko w ogrzewanym pomieszczeniu." },
      fox: { rodzaj: "wCenie" },
    },
  },
  {
    id: "licznikLora",
    kategoria: "zastosowania",
    nazwa: "Licznik bezprzewodowy",
    opis: "Gdy rozdzielnica jest daleko od falownika (do ok. 100 m) — zamiast długiego kabla.",
    dostepnosc: {
      deye: { rodzaj: "cena", cena: 1_290 },
      fox: { rodzaj: "brak", powod: "Dostępne tylko w Deye." },
    },
  },
  {
    id: "solcare",
    kategoria: "zastosowania",
    nazwa: "Solcare EMS (12 miesięcy)",
    opis: "Dodatkowy system zarządzania energią w chmurze, zgodny z PME2 — na wszelki wypadek, obok EMS wbudowanego w falownik.",
    dostepnosc: {
      deye: { rodzaj: "cena", cena: 1_590 },
      fox: { rodzaj: "cena", cena: 1_590 },
    },
  },
];

// Program PME2 (Przydomowe Magazyny Energii, część 2 — następca Mój Prąd): 30% kosztu magazynu z montażem,
// nie więcej niż 800 zł/kWh i 16 000 zł (net-billing) albo 8 000 zł (net-metering).
// ⚠️ Falownik i EMS NIE są kosztem kwalifikowanym (FAQ PME2, pyt. 9, 10, 24).
export const DOTACJA = {
  udzial: 0.3,
  naKwh: 800,
  limit: { "net-billing": 16_000, "net-metering": 8_000 } satisfies Record<Rozliczenie, number>,
  /** Reguła doboru: pojemność magazynu w kWh ≥ 2 × moc instalacji PV w kWp. */
  mnoznikPv: 2,
};

// Raty: bez akceptacji banku nie podajemy wysokości raty ani „0%” (umowa z Santanderem, ustawa o kredycie konsumenckim).
export const RATY_KOMUNIKAT = "Możliwe raty — zapytaj przy wycenie.";

/** Gotowe przykłady („najczęściej wybierane”) — także jako wzorzec do testów wyliczeń. */
export type PakietPrzykladowy = { nazwa: string; linia: LiniaId; rozmiar: RozmiarId; opcje: OpcjaId[]; cena: number };
export const PAKIETY_PRZYKLADOWE: PakietPrzykladowy[] = [
  { nazwa: "Deye M „Ciepła woda”", linia: "deye", rozmiar: "m", opcje: ["grzalka"], cena: 29_190 },
  { nazwa: "Deye M „Bez przerw”", linia: "deye", rozmiar: "m", opcje: ["calyDom", "agregat"], cena: 31_480 },
  { nazwa: "Deye L „Elektryk”", linia: "deye", rozmiar: "l", opcje: ["ladowarka22"], cena: 38_790 },
  { nazwa: "Fox M „Spokojna głowa”", linia: "fox", rozmiar: "m", opcje: ["agregat"], cena: 33_390 },
  { nazwa: "Fox L „Garaż + auto”", linia: "fox", rozmiar: "l", opcje: ["garaz", "ladowarka11"], cena: 40_590 },
  { nazwa: "Deye „Stara PV”", linia: "deye", rozmiar: "m", opcje: ["staraPv"], cena: 28_490 },
];
