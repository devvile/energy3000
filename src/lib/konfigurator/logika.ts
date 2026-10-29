// Logika konfiguratora — czyste funkcje, bez Reacta i bez DOM. Każda przyjmuje stan i zwraca wynik.
// UI (animacje, grafiki) dojdzie osobno; tu jest wszystko, co musi być poprawne niezależnie od wyglądu.

import {
  DOTACJA,
  LINIE,
  OPCJE,
  RATY_KOMUNIKAT,
  ZESTAWY,
  type Linia,
  type LiniaId,
  type Opcja,
  type OpcjaId,
  type Rozliczenie,
  type RozmiarId,
  type Zestaw,
} from "./dane.ts";

/** Co klient ma dziś w domu — wpływa na podpowiedzi, nie blokuje wyboru. */
export type Sytuacja =
  | "nie-wiem"
  | "brak-pv"
  | "zwykly" // zwykły falownik (nie hybrydowy), dowolna marka
  | "hybryda-deye-fox" // hybrydowy Deye albo FoxESS bez baterii
  | "hybryda-inna" // hybrydowy innej marki (Huawei, GoodWe, SolarEdge, Sofar, Growatt…)
  | "mikro-optymalizatory"; // mikroinwertery albo SolarEdge / Huawei z optymalizatorami

export const SYTUACJE: Sytuacja[] = ["nie-wiem", "brak-pv", "zwykly", "hybryda-deye-fox", "hybryda-inna", "mikro-optymalizatory"];
export const ROZLICZENIA: Rozliczenie[] = ["net-billing", "net-metering"];
export const ROZMIARY: RozmiarId[] = ["s", "m", "l"];
export const LINIE_IDS: LiniaId[] = ["deye", "fox"];

export type Stan = {
  linia: LiniaId;
  rozmiar: RozmiarId;
  /** Wybrane opcje → liczba sztuk (1 dla opcji bez ilości). Opcji „w cenie” nie zapisujemy — wynikają z zestawu. */
  opcje: Partial<Record<OpcjaId, number>>;
  rozliczenie: Rozliczenie;
  /** Moc instalacji PV klienta w kWp; null = nie wie. */
  pvKwp: number | null;
  sytuacja: Sytuacja;
};

export const STAN_POCZATKOWY: Stan = {
  linia: "deye",
  rozmiar: "m",
  opcje: {},
  rozliczenie: "net-billing",
  pvKwp: null,
  sytuacja: "nie-wiem",
};

// ——— Słowniki ———

export function zestaw(linia: LiniaId, rozmiar: RozmiarId): Zestaw {
  const z = ZESTAWY.find((x) => x.linia === linia && x.rozmiar === rozmiar);
  if (!z) throw new Error(`Brak zestawu ${linia}/${rozmiar}`);
  return z;
}

export function zestawyLinii(linia: LiniaId): Zestaw[] {
  return ZESTAWY.filter((z) => z.linia === linia);
}

export function opcja(id: OpcjaId): Opcja {
  const o = OPCJE.find((x) => x.id === id);
  if (!o) throw new Error(`Brak opcji ${id}`);
  return o;
}

// ——— Dostępność opcji ———

export type Status = "dostepna" | "wCenie" | "brak";

export type Dostepna = {
  status: Status;
  cena: number; // za sztukę; 0 dla wCenie i brak
  maks: number; // maks. sztuk; 0 dla brak, 1 dla wCenie
  powod?: string; // tylko dla brak
};

/** Czy i za ile opcja jest dostępna w danym zestawie. */
export function dostepnosc(op: Opcja, z: Zestaw): Dostepna {
  const d = op.dostepnosc[z.linia];
  if (d.rodzaj === "brak") return { status: "brak", cena: 0, maks: 0, powod: d.powod };
  if (d.rodzaj === "wCenie") return { status: "wCenie", cena: 0, maks: 1 };
  let maks = 1;
  if (typeof d.maks === "number") maks = d.maks;
  else if (d.maks) {
    const m = d.maks[z.rozmiar];
    if (!m) return { status: "brak", cena: 0, maks: 0, powod: `Niedostępne w zestawie ${z.nazwa}.` };
    maks = m;
  }
  return { status: "dostepna", cena: d.cena, maks };
}

export type StanOpcji = Dostepna & {
  opcja: Opcja;
  ilosc: number; // wybrana liczba sztuk (wCenie → 1)
  /** Inna opcja z tej samej grupy jest już wybrana — tę można wybrać tylko zamiast tamtej. */
  wykluczonaPrzez?: OpcjaId;
};

/** Lista wszystkich opcji z ich stanem dla bieżącego wyboru — do wyrenderowania. */
export function opcjeDlaStanu(stan: Stan): StanOpcji[] {
  const z = zestaw(stan.linia, stan.rozmiar);
  return OPCJE.map((op) => {
    const d = dostepnosc(op, z);
    const ilosc = d.status === "wCenie" ? 1 : Math.min(stan.opcje[op.id] ?? 0, d.maks);
    const wykluczonaPrzez = op.grupa
      ? OPCJE.find((inna) => inna.id !== op.id && inna.grupa === op.grupa && (stan.opcje[inna.id] ?? 0) > 0)?.id
      : undefined;
    return { ...d, opcja: op, ilosc, wykluczonaPrzez };
  });
}

export function opcjeKategorii(stan: Stan, kategoria: Opcja["kategoria"]): StanOpcji[] {
  return opcjeDlaStanu(stan).filter((o) => o.opcja.kategoria === kategoria);
}

// ——— Normalizacja stanu ———

const zaokraglPv = (v: unknown): number | null => {
  const n = typeof v === "string" ? Number(v.replace(",", ".")) : Number(v);
  if (!Number.isFinite(n) || n <= 0) return null;
  return Math.min(Math.round(n * 10) / 10, 100);
};

/**
 * Doprowadza dowolny (także niepełny lub nieaktualny) stan do poprawnego:
 * usuwa opcje niedostępne w wybranym zestawie, przycina liczbę sztuk, pilnuje grup wykluczających się.
 * Wołać po KAŻDEJ zmianie linii lub rozmiaru.
 */
export function normalizuj(wejscie: Partial<Stan>): Stan {
  const linia: LiniaId = LINIE_IDS.includes(wejscie.linia as LiniaId) ? (wejscie.linia as LiniaId) : STAN_POCZATKOWY.linia;
  const rozmiar: RozmiarId = ROZMIARY.includes(wejscie.rozmiar as RozmiarId) ? (wejscie.rozmiar as RozmiarId) : STAN_POCZATKOWY.rozmiar;
  const z = zestaw(linia, rozmiar);
  const opcje: Stan["opcje"] = {};
  const zajeteGrupy = new Set<string>();
  for (const op of OPCJE) {
    const surowa = Number(wejscie.opcje?.[op.id] ?? 0);
    if (!Number.isFinite(surowa) || surowa <= 0) continue;
    const d = dostepnosc(op, z);
    if (d.status !== "dostepna") continue;
    if (op.grupa) {
      if (zajeteGrupy.has(op.grupa)) continue;
      zajeteGrupy.add(op.grupa);
    }
    opcje[op.id] = Math.max(1, Math.min(Math.floor(surowa), op.wieleSztuk ? d.maks : 1));
  }
  return {
    linia,
    rozmiar,
    opcje,
    rozliczenie: ROZLICZENIA.includes(wejscie.rozliczenie as Rozliczenie) ? (wejscie.rozliczenie as Rozliczenie) : STAN_POCZATKOWY.rozliczenie,
    pvKwp: zaokraglPv(wejscie.pvKwp),
    sytuacja: SYTUACJE.includes(wejscie.sytuacja as Sytuacja) ? (wejscie.sytuacja as Sytuacja) : STAN_POCZATKOWY.sytuacja,
  };
}

// ——— Przejścia stanu (każde zwraca nowy, znormalizowany stan) ———

export function ustawLinie(stan: Stan, linia: LiniaId): Stan {
  return normalizuj({ ...stan, linia });
}

export function ustawRozmiar(stan: Stan, rozmiar: RozmiarId): Stan {
  return normalizuj({ ...stan, rozmiar });
}

/** Ustawia liczbę sztuk opcji (0 = usuń). Dla opcji z grupą zdejmuje konkurencyjną. */
export function ustawOpcje(stan: Stan, id: OpcjaId, ilosc: number): Stan {
  const op = opcja(id);
  const opcje = { ...stan.opcje };
  if (ilosc <= 0) delete opcje[id];
  else {
    if (op.grupa) for (const inna of OPCJE) if (inna.grupa === op.grupa && inna.id !== id) delete opcje[inna.id];
    opcje[id] = ilosc;
  }
  return normalizuj({ ...stan, opcje });
}

export function przelaczOpcje(stan: Stan, id: OpcjaId): Stan {
  return ustawOpcje(stan, id, (stan.opcje[id] ?? 0) > 0 ? 0 : 1);
}

export function ustawRozliczenie(stan: Stan, rozliczenie: Rozliczenie): Stan {
  return normalizuj({ ...stan, rozliczenie });
}

export function ustawPv(stan: Stan, pvKwp: number | string | null): Stan {
  return normalizuj({ ...stan, pvKwp: zaokraglPv(pvKwp) });
}

/**
 * Ustawia sytuację klienta i dopasowuje wybór: przy falowniku innej marki albo mikroinwerterach
 * stary falownik zostaje, więc przechodzimy na Deye z opcją „Magazyn do starej fotowoltaiki”.
 */
export function ustawSytuacje(stan: Stan, sytuacja: Sytuacja): Stan {
  const nast = normalizuj({ ...stan, sytuacja });
  if (sytuacja === "hybryda-inna" || sytuacja === "mikro-optymalizatory") {
    return ustawOpcje(ustawLinie(nast, "deye"), "staraPv", 1);
  }
  return nast;
}

// ——— Dobór wielkości ———

/** Najmniejszy zestaw linii, który spełnia regułę PME2 (kWh ≥ 2 × kWp). null = za duża instalacja na zestaw bez rozbudowy. */
export function polecanyRozmiar(linia: LiniaId, pvKwp: number | null): RozmiarId | null {
  if (pvKwp == null) return zestawyLinii(linia).find((z) => z.polecany)?.rozmiar ?? "m";
  const z = zestawyLinii(linia).find((x) => x.kwh >= pvKwp * DOTACJA.mnoznikPv);
  return z?.rozmiar ?? null;
}

export function dopasujRozmiarDoPv(stan: Stan): Stan {
  const r = polecanyRozmiar(stan.linia, stan.pvKwp);
  return r ? ustawRozmiar(stan, r) : ustawRozmiar(stan, "l");
}

// ——— Wyliczenie ———

export type Pozycja = {
  id: OpcjaId | "zestaw";
  nazwa: string;
  ilosc: number;
  cenaJedn: number;
  kwota: number;
};

export type Wyliczenie = {
  zestaw: Zestaw;
  linia: Linia;
  pozycje: Pozycja[]; // zestaw + płatne opcje, w kolejności z OPCJE
  wCenie: Opcja[]; // opcje zawarte w zestawie (Fox: cały dom, garaż)
  cena: number; // razem brutto
  kwh: number; // pojemność razem z rozbudową
  pvMaxKwp: number; // ile PV obsłuży ta pojemność wg reguły 2×
  dotacja: number; // szacunek PME2, zaokrąglony do 100 zł
  dotacjaOgraniczonaLimitem: boolean;
  poDotacji: number;
  pme2: { wymaganeKwh: number | null; spelnia: boolean | null };
  uwagi: string[];
  ratyKomunikat: string;
};

const zaokr100 = (n: number) => Math.round(n / 100) * 100;

/** Szacunek dotacji PME2: 30% ceny magazynu z montażem, nie więcej niż 800 zł/kWh i limit zależny od rozliczenia. */
export function dotacjaPme2(magazynBrutto: number, kwh: number, rozliczenie: Rozliczenie): { kwota: number; ograniczonaLimitem: boolean } {
  const limit = DOTACJA.limit[rozliczenie];
  const bezLimitu = Math.min(magazynBrutto * DOTACJA.udzial, kwh * DOTACJA.naKwh);
  const kwota = zaokr100(Math.min(bezLimitu, limit));
  return { kwota, ograniczonaLimitem: bezLimitu > limit };
}

export function wylicz(wejscie: Stan): Wyliczenie {
  const stan = normalizuj(wejscie);
  const z = zestaw(stan.linia, stan.rozmiar);
  const linia = LINIE[stan.linia];

  const pozycje: Pozycja[] = [{ id: "zestaw", nazwa: `${z.nazwa} · ${formatKwh(z.kwh)} kWh`, ilosc: 1, cenaJedn: z.cena, kwota: z.cena }];
  const wCenie: Opcja[] = [];
  let kwh = z.kwh;
  // Pozycja „magazyn z montażem” na fakturze: szacunek dla zestawu + dołożone baterie w całości.
  let magazynBrutto = z.dotacjaSzacunek / DOTACJA.udzial;

  for (const o of opcjeDlaStanu(stan)) {
    if (o.status === "wCenie") wCenie.push(o.opcja);
    if (o.status !== "dostepna" || o.ilosc <= 0) continue;
    const kwota = o.cena * o.ilosc;
    pozycje.push({ id: o.opcja.id, nazwa: o.opcja.nazwa, ilosc: o.ilosc, cenaJedn: o.cena, kwota });
    if (o.opcja.kwh) {
      kwh += o.opcja.kwh * o.ilosc;
      magazynBrutto += kwota;
    }
  }

  kwh = Math.round(kwh * 10) / 10;
  const cena = pozycje.reduce((s, p) => s + p.kwota, 0);
  const d = dotacjaPme2(magazynBrutto, kwh, stan.rozliczenie);
  const wymaganeKwh = stan.pvKwp == null ? null : Math.round(stan.pvKwp * DOTACJA.mnoznikPv * 10) / 10;
  const spelnia = wymaganeKwh == null ? null : kwh >= wymaganeKwh;

  const w: Wyliczenie = {
    zestaw: z,
    linia,
    pozycje,
    wCenie,
    cena,
    kwh,
    pvMaxKwp: Math.floor((kwh / DOTACJA.mnoznikPv) * 10) / 10,
    dotacja: d.kwota,
    dotacjaOgraniczonaLimitem: d.ograniczonaLimitem,
    poDotacji: cena - d.kwota,
    pme2: { wymaganeKwh, spelnia },
    uwagi: [],
    ratyKomunikat: RATY_KOMUNIKAT,
  };
  w.uwagi = uwagi(stan, w);
  return w;
}

/** Komunikat dla osób bez paneli (konfigurator, formularz). Jedno miejsce — zmień tu, jeśli w ofercie pojawi się fotowoltaika. */
export const BEZ_PV = {
  tytul: "Magazyn potrzebuje paneli",
  tekst:
    "Magazyn ładuje się prądem z Twojej fotowoltaiki — bez niej nie ma z czego go napełnić, a dotacja Mój Prąd też wymaga paneli. Na razie dokładamy magazyny do instalacji, które już działają.",
  zacheta: "Planujesz panele? Zostaw numer — doradzimy, jak zaplanować fotowoltaikę od razu z magazynem, i odezwiemy się, gdy poszerzymy ofertę.",
  uwaga: "Na razie dokładamy magazyny do paneli, które już działają. Zostaw numer — odezwiemy się, gdy poszerzymy ofertę o fotowoltaikę.",
};

/** Uczciwe podpowiedzi do pokazania pod wyliczeniem. Kolejność = ważność. */
export function uwagi(stan: Stan, w: Wyliczenie): string[] {
  const u: string[] = [];
  const z = w.zestaw;

  switch (stan.sytuacja) {
    case "brak-pv":
      u.push(BEZ_PV.uwaga);
      break;
    case "hybryda-deye-fox":
      u.push("Masz hybrydowy falownik Deye albo FoxESS? Wtedy dokładamy samą baterię — taniej niż cały zestaw, a dotacja prawie taka sama. Wycenimy to indywidualnie.");
      break;
    case "hybryda-inna":
    case "mikro-optymalizatory":
      if (stan.linia === "deye" && !stan.opcje.staraPv)
        u.push("W tej sytuacji stary falownik zostaje i pracuje dalej — dodaj opcję „Magazyn do starej fotowoltaiki”.");
      if (stan.linia === "fox")
        u.push("Przy falowniku innej marki albo mikroinwerterach gotową opcję ma Deye. W FoxESS taki montaż wyceniamy po rozmowie z Procarte.");
      break;
  }

  if (stan.pvKwp != null && w.pme2.wymaganeKwh != null && w.pme2.spelnia === false) {
    u.push(
      `Do ${formatKwh(stan.pvKwp)} kWp paneli program wymaga co najmniej ${formatKwh(w.pme2.wymaganeKwh)} kWh magazynu (masz ${formatKwh(w.kwh)} kWh). Wybierz większy zestaw albo dołóż baterię.`,
    );
  }

  if (stan.opcje.staraPv && stan.pvKwp != null && stan.pvKwp > z.falownikKw) {
    u.push(`Stara instalacja (${formatKwh(stan.pvKwp)} kWp) jest mocniejsza niż nowy falownik (${z.falownikKw} kW) — wybierz większy zestaw albo poprosimy o wycenę.`);
  }

  if (w.dotacjaOgraniczonaLimitem) {
    u.push(`Dotacja jest ograniczona limitem ${formatZl(DOTACJA.limit[stan.rozliczenie])}${stan.rozliczenie === "net-metering" ? " (net-metering)" : ""}.`);
  } else if (stan.rozliczenie === "net-metering") {
    u.push("Przy net-meteringu (panele zgłoszone przed kwietniem 2022) dotacja wynosi najwyżej 8 000 zł.");
  }

  return u;
}

/** Stałe zastrzeżenia pod każdą ceną (drobny druk). */
export const ZASTRZEZENIA = [
  "Ceny brutto z montażem przy standardowej instalacji; mogą wzrosnąć po oględzinach (np. przebudowa rozdzielnicy, długie trasy kablowe).",
  "Dotacja to szacunek: 30% ceny magazynu z montażem, nie więcej niż 800 zł za kWh i 16 000 zł. Falownik nie jest kosztem kwalifikowanym. O dotacji decyduje NFOŚiGW, wypłaca ją po montażu.",
  "Agregat i nowy bojler wyceniamy osobno.",
];

// ——— Formatowanie ———

// Separator tysięcy zawsze jako twarda spacja (U+00A0), żeby kwota nie łamała się w połowie.
// `useGrouping: "always"`, bo polski format domyślnie nie grupuje liczb czterocyfrowych (5190 zamiast 5 190).
export const formatZl = (n: number) =>
  `${Math.round(n).toLocaleString("pl-PL", { useGrouping: "always" }).replace(/[   ]/g, " ")} zł`;
export const formatKwh = (n: number) => n.toLocaleString("pl-PL", { maximumFractionDigits: 1 });

// ——— Podsumowanie do formularza / maila / arkusza ———

export function podsumowanie(stan: Stan): string[] {
  const w = wylicz(stan);
  const linie = w.pozycje.map((p) => `${p.nazwa}${p.ilosc > 1 ? ` × ${p.ilosc}` : ""} — ${formatZl(p.kwota)}`);
  for (const o of w.wCenie) linie.push(`${o.nazwa} — w cenie`);
  linie.push(`Razem: ${formatZl(w.cena)} · pojemność ${formatKwh(w.kwh)} kWh`);
  linie.push(`Szacowana dotacja PME2: ${formatZl(w.dotacja)} → po dotacji ok. ${formatZl(w.poDotacji)}`);
  return linie;
}

export type DaneDoFormularza = {
  konfiguracja: string; // kod do odtworzenia (zakoduj)
  linia: string;
  zestaw: string;
  kwh: number;
  opcje: string; // „Ciepła woda z nadwyżki; Podłączenie agregatu” — czytelne dla Rafała w arkuszu
  cena: number;
  dotacja: number;
  poDotacji: number;
  rozliczenie: Rozliczenie;
  pvKwp: number | null;
  sytuacja: Sytuacja;
  uwagi: string;
};

/** Płaskie pola do dopisania do zgłoszenia (arkusz Google / mail). */
export function doFormularza(stan: Stan): DaneDoFormularza {
  const s = normalizuj(stan);
  const w = wylicz(s);
  return {
    konfiguracja: zakoduj(s),
    linia: w.linia.nazwa,
    zestaw: w.zestaw.nazwa,
    kwh: w.kwh,
    opcje: w.pozycje
      .filter((p) => p.id !== "zestaw")
      .map((p) => (p.ilosc > 1 ? `${p.nazwa} × ${p.ilosc}` : p.nazwa))
      .join("; "),
    cena: w.cena,
    dotacja: w.dotacja,
    poDotacji: w.poDotacji,
    rozliczenie: s.rozliczenie,
    pvKwp: s.pvKwp,
    sytuacja: s.sytuacja,
    uwagi: w.uwagi.join(" | "),
  };
}

// ——— Kodowanie do URL (żeby dało się wysłać link do konfiguracji) ———

const ROZL_KOD: Record<Rozliczenie, string> = { "net-billing": "nb", "net-metering": "nm" };
const KOD_ROZL: Record<string, Rozliczenie> = { nb: "net-billing", nm: "net-metering" };

/** `l=deye&z=m&o=grzalka,bat5x2&r=nb&pv=8&s=zwykly` — tylko pola różne od domyślnych. */
export function zakoduj(stan: Stan): string {
  const s = normalizuj(stan);
  const p = new URLSearchParams();
  p.set("l", s.linia);
  p.set("z", s.rozmiar);
  const o = Object.entries(s.opcje)
    .filter(([, n]) => (n ?? 0) > 0)
    .map(([id, n]) => (n && n > 1 ? `${id}x${n}` : id));
  if (o.length) p.set("o", o.join(","));
  if (s.rozliczenie !== STAN_POCZATKOWY.rozliczenie) p.set("r", ROZL_KOD[s.rozliczenie]);
  if (s.pvKwp != null) p.set("pv", String(s.pvKwp));
  if (s.sytuacja !== STAN_POCZATKOWY.sytuacja) p.set("s", s.sytuacja);
  return p.toString();
}

export function odkoduj(zapytanie: string | URLSearchParams | null | undefined): Stan {
  if (!zapytanie) return STAN_POCZATKOWY;
  const p = typeof zapytanie === "string" ? new URLSearchParams(zapytanie.replace(/^\?/, "")) : zapytanie;
  const opcje: Partial<Record<string, number>> = {};
  for (const czesc of (p.get("o") ?? "").split(",")) {
    if (!czesc) continue;
    const [id, n] = czesc.split("x");
    opcje[id] = n ? Number(n) : 1;
  }
  return normalizuj({
    linia: p.get("l") as LiniaId,
    rozmiar: p.get("z") as RozmiarId,
    opcje: opcje as Stan["opcje"],
    rozliczenie: KOD_ROZL[p.get("r") ?? ""],
    pvKwp: p.get("pv") == null ? null : Number(p.get("pv")),
    sytuacja: p.get("s") as Sytuacja,
  });
}
