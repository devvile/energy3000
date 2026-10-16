// Wszystkie dane, które będziemy podmieniać (cena, telefon, raty, firma), są w tym jednym pliku.
// ⚠️ Wartości oznaczone PROPOZYCJA to założenia robocze — do podmiany po ofercie z hurtowni i umowie z bankiem.

export const BRAND = "E3000";

export const PHONE = "513 301 081"; // PROPOZYCJA — tymczasowo numer Patryka
export const PHONE_HREF = "tel:+48513301081";
export const EMAIL = "biuro@energy3000.pl"; // po aliasie w Google Workspace → biuro@e3000.pl
export const HOURS = "pn–pt 8:00–20:00, sob 9:00–14:00"; // PROPOZYCJA
export const REGION = "Kielce + 100 km";

// Program „Mój Prąd — magazyny energii” (PME2): 30% kosztów, max 800 zł/kWh,
// max 16 000 zł (net-billing) albo 8 000 zł (net-metering).
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

export const subsidyFor = (price: number, kwh: number, cap = SUBSIDY.capNetBilling) =>
  Math.round(Math.min(price * SUBSIDY.share, kwh * SUBSIDY.perKwh, cap));

// Raty — PROPOZYCJA: 0% na 60 miesięcy (Santander deklaruje 0% na 2–60 mies.; koszt po naszej stronie nieznany)
export const INSTALLMENTS = {
  months: 60,
  rate: "0%",
  note: "Przykład orientacyjny: raty 0% na 60 miesięcy, finansowanie we współpracy z bankiem. Ostateczne warunki, RRSO i przykład reprezentatywny przedstawimy w ofercie.",
};

export const monthlyFor = (price: number) => Math.ceil(price / INSTALLMENTS.months);

export type Pakiet = {
  id: string;
  name: string;
  pv: string;
  kwh: number;
  price: number; // brutto, z montażem — PROPOZYCJA
  featured?: boolean;
};

export const PAKIETY: Pakiet[] = [
  { id: "s", name: "Kompakt", pv: "do 5 kWp", kwh: 12, price: 23_900 },
  { id: "m", name: "Standard", pv: "6–8 kWp", kwh: 16, price: 27_900, featured: true },
  { id: "l", name: "Max", pv: "9–12 kWp", kwh: 24, price: 35_900 },
];

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

export const zl = (n: number) => `${n.toLocaleString("pl-PL").replace(/ /g, " ")} zł`;
