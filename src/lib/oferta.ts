// Dane firmy, kontakt i parametry dotacji używane w wielu miejscach strony.
// Ceny zestawów i opcji są w JEDNYM miejscu: `@/lib/konfigurator/dane.ts` (ceny zamrożone 2026-10-26) — tu tylko je czytamy.
// ⚠️ Wartości oznaczone PROPOZYCJA to założenia robocze — do podmiany.

import { zestawyLinii, type RozmiarId } from "@/lib/konfigurator";

export const BRAND = "E3000";

export const PHONE = "513 301 081"; // PROPOZYCJA — tymczasowo numer Patryka
export const PHONE_HREF = "tel:+48513301081";
export const EMAIL = "biuro@energy3000.pl"; // po aliasie w Google Workspace → biuro@e3000.pl
export const HOURS = "pn–pt 8:00–20:00, sob 9:00–14:00"; // PROPOZYCJA
export const REGION = "Kielce + 100 km";

// Program „Przydomowe Magazyny Energii, część 2” (PME2, następca Mój Prąd): 30% kosztu magazynu z montażem (falownik i EMS nie są kosztem
// kwalifikowanym), max 800 zł/kWh, max 16 000 zł (net-billing) albo 8 000 zł (net-metering).
export const SUBSIDY = {
  share: 0.3,
  perKwh: 800,
  capNetBilling: 16_000,
  capNetMetering: 8_000,
  start: "2026-10-20T09:00:00+02:00",
  end: "1 października 2027",
  pool: "1 mld zł",
  payoutMonths: "4–7",
};

export type Pakiet = {
  id: RozmiarId;
  name: string;
  pv: string;
  kwh: number;
  price: number; // brutto, z montażem
  subsidy: number; // szacunkowa dotacja PME2 (z konfiguratora)
  featured?: boolean;
};

const NAZWY: Record<RozmiarId, string> = { s: "Kompakt", m: "Standard", l: "Max" };

// Trzy pakiety pokazywane w hero: linia Deye (ceny jak w konfiguratorze).
export const PAKIETY: Pakiet[] = zestawyLinii("deye").map((z) => ({
  id: z.rozmiar,
  name: NAZWY[z.rozmiar],
  pv: `do ${z.pvMaxKwp} kWp`,
  kwh: z.kwh,
  price: z.cena,
  subsidy: z.dotacjaSzacunek,
  featured: z.polecany,
}));

export const COMPANY = {
  name: "MOJO Sp. z o.o.",
  address: "ul. Puławska 77/U5, 02-595 Warszawa",
  plant: "Zakład: ul. Kielecka 35A, 26-026 Bilcza",
  krs: "0001055929",
  court: "Sąd Rejonowy dla m.st. Warszawy w Warszawie, XIII Wydział Gospodarczy KRS",
  nip: "5214034507",
  regon: "526281173",
  capital: "5 000 zł",
};

export const zl = (n: number) => `${n.toLocaleString("pl-PL", { useGrouping: "always" }).replace(/[  ]/g, " ")} zł`;
