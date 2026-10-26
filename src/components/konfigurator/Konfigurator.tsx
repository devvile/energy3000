"use client";

// Sekcja „Cena” = konfigurator zestawu. Ten sam język wizualny co reszta strony:
// ciemne tło, nagłówek Words, etykiety mono, karty z zaokrągleniem 3xl, wybrana karta w kremie, akcenty „sun”.
// Cała logika w `useKonfigurator` — komponent tylko rysuje.

import Image from "next/image";
import { type CSSProperties, useState } from "react";
import {
  LINIE,
  LINIE_IDS,
  type LiniaId,
  OPCJE,
  W_KAZDYM_ZESTAWIE,
  ZASTRZEZENIA,
  formatKwh,
  formatZl,
  zestawyLinii,
  type Kategoria,
  type Rozliczenie,
  type Sytuacja,
} from "@/lib/konfigurator";
import { Words } from "../Words";
import { useKonfigurator, type Konfigurator as Stan } from "./useKonfigurator";

const SYTUACJE: { id: Sytuacja; nazwa: string }[] = [
  { id: "zwykly", nazwa: "Zwykły falownik" },
  { id: "hybryda-deye-fox", nazwa: "Hybrydowy Deye lub Fox" },
  { id: "hybryda-inna", nazwa: "Hybrydowy innej marki" },
  { id: "mikro-optymalizatory", nazwa: "Mikroinwertery / optymalizatory" },
  { id: "nie-wiem", nazwa: "Nie wiem" },
  { id: "brak-pv", nazwa: "Nie mam paneli" },
];

const ROZLICZENIA: { id: Rozliczenie; nazwa: string; opis: string }[] = [
  { id: "net-billing", nazwa: "Od kwietnia 2022", opis: "net-billing, dotacja do 16 000 zł" },
  { id: "net-metering", nazwa: "Wcześniej", opis: "opusty, dotacja do 8 000 zł" },
];

const KATEGORIE: { id: Kategoria; nazwa: string }[] = [
  { id: "backup", nazwa: "Zasilanie awaryjne" },
  { id: "zastosowania", nazwa: "Dodatkowe zastosowania" },
  { id: "pojemnosc", nazwa: "Więcej pojemności" },
];

/** Zostawia tylko cyfry i jeden separator dziesiętny (maks. 3 cyfry przed, 1 po). */
export function tylkoLiczba(t: string): string {
  const m = t.replace(/[^\d.,]/g, "").match(/^(\d{0,3})([.,](\d?))?/);
  if (!m) return "";
  const [, calk, separator, dzies] = m;
  if (!separator || calk === "") return calk;
  return `${calk},${dzies ?? ""}`;
}

const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

function Krok({ nr, tytul, opis, children }: { nr: string; tytul: string; opis?: string; children: React.ReactNode }) {
  return (
    <div data-reveal className="grid gap-6 border-t border-white/10 py-10 sm:grid-cols-[4.5rem_1fr] sm:py-12">
      <span className="font-mono text-sm text-foreground/40">{nr}</span>
      <div>
        <h3 className="text-2xl font-medium tracking-[-0.03em] sm:text-3xl">{tytul}</h3>
        {opis && <p className="mt-2 max-w-lg text-base leading-relaxed text-foreground/60">{opis}</p>}
        <div className="mt-7">{children}</div>
      </div>
    </div>
  );
}

function Chip({ on, onClick, children, title }: { on: boolean; onClick: () => void; children: React.ReactNode; title?: string }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      aria-pressed={on}
      className={`rounded-full border px-5 py-2.5 text-sm transition-colors duration-300 sm:text-base ${
        on ? "border-cream bg-cream text-ink" : "border-white/20 text-foreground/80 hover:border-white/60"
      }`}
    >
      {children}
    </button>
  );
}

function Przelacznik({ on, disabled, onClick, label }: { on: boolean; disabled?: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] disabled:cursor-not-allowed ${
        on ? "bg-sun" : "bg-white/15"
      }`}
    >
      <span
        className={`absolute top-1 left-1 size-5 rounded-full bg-cream transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          on ? "translate-x-5 bg-ink" : ""
        }`}
      />
    </button>
  );
}

export function Konfigurator() {
  const k = useKonfigurator();
  const { stan } = k;
  return (
    <section id="cena" className="relative overflow-hidden bg-[#140c07] px-5 py-24 sm:px-8 sm:py-36">
      <div className="pointer-events-none absolute -top-40 left-1/2 size-[60rem] -translate-x-1/2 rounded-full bg-sun/10 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <p className="mb-6 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/50">
              <span className="h-px w-8 bg-foreground/40" /> Cena
            </p>
            <Words
              text={"Złóż swój zestaw.\nCenę widzisz od razu."}
              accent="razu."
              className="text-[clamp(2.4rem,5.2vw,5.2rem)] font-medium leading-[0.98] tracking-[-0.05em]"
            />
          </div>
          <p data-reveal className="max-w-sm text-base leading-relaxed text-foreground/70">
            Ceny brutto z montażem, falownikiem i pomocą przy wniosku. Cztery wybory i wiesz, ile kosztuje magazyn do
            Twoich paneli i ile z tego wraca z dotacji.
          </p>
        </div>

        {/* Desktop: kroki w lewej kolumnie, wiersz po wierszu. W prawej kolumnie na wysokości kroku „Marka” unosi się
            wizualizacja wybranego magazynu, a od kroku „Wielkość” w dół przyklejone podsumowanie. */}
        <div className="mt-16 grid lg:grid-cols-[1.15fr_0.85fr] lg:gap-x-16">
          <div className="lg:col-start-1">
            <KrokDom k={k} />
          </div>
          <div className="lg:col-start-1">
            <KrokLinia k={k} />
          </div>
          <div className="hidden lg:col-start-2 lg:row-start-2 lg:flex lg:items-center lg:justify-center">
            <ObrazLinii wybrana={stan.linia} />
          </div>
          <div className="lg:col-start-1">
            <KrokWielkosc k={k} />
          </div>
          <div className="lg:col-start-1">
            <KrokDodatki k={k} />
          </div>
          <div className="mt-12 lg:col-start-2 lg:row-start-3 lg:row-span-2 lg:mt-0 lg:self-start lg:sticky lg:top-24">
            <Podsumowanie k={k} />
          </div>
        </div>

        <ul data-reveal className="mt-10 max-w-3xl space-y-1 text-xs leading-relaxed text-foreground/50">
          {ZASTRZEZENIA.map((z) => (
            <li key={z}>{z}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function KrokDom({ k }: { k: Stan }) {
  const { stan, akcje } = k;
  const [pvWpisane, setPv] = useState("");
  const pvTekst = pvWpisane === "" && stan.pvKwp != null ? String(stan.pvKwp).replace(".", ",") : pvWpisane;
  const polecany = k.polecanyRozmiar;

  return (
    <Krok nr="01" tytul="Co masz dziś na dachu" opis="Jeśli nie wiesz, zostaw puste — dopytamy przez telefon.">
      <div className="grid gap-8 sm:grid-cols-[minmax(0,14rem)_1fr]">
        <label className="block">
          <span className="text-sm text-foreground/60">Moc paneli</span>
          <span className="flex items-baseline gap-2 border-b border-white/25 transition-colors focus-within:border-cream">
            <input
              inputMode="decimal"
              placeholder="np. 8"
              maxLength={5}
              value={pvTekst}
              onChange={(e) => {
                const t = tylkoLiczba(e.target.value);
                setPv(t);
                akcje.ustawPv(t);
              }}
              className="w-full bg-transparent py-3 text-3xl font-medium tracking-[-0.03em] text-foreground outline-none placeholder:text-foreground/25"
            />
            <span className="font-serif text-xl italic text-foreground/60">kWp</span>
          </span>
          {stan.pvKwp != null && (
            <span className="mt-3 block text-sm text-foreground/60">
              {polecany ? (
                <>
                  Polecamy rozmiar <strong className="text-foreground">{polecany.toUpperCase()}</strong>
                  {polecany !== stan.rozmiar && (
                    <>
                      {" "}
                      ·{" "}
                      <button type="button" onClick={akcje.dopasujDoPv} className="cta text-sun">
                        <span className="cta-line">dopasuj</span>
                      </button>
                    </>
                  )}
                </>
              ) : (
                <>Duża instalacja: zestaw L z dodatkową baterią, resztę policzymy indywidualnie.</>
              )}
            </span>
          )}
        </label>

        <div className="space-y-6">
          <div>
            <p className="text-sm text-foreground/60">Falownik, który masz</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {SYTUACJE.map((s) => (
                <Chip key={s.id} on={stan.sytuacja === s.id} onClick={() => akcje.ustawSytuacje(s.id)}>
                  {s.nazwa}
                </Chip>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm text-foreground/60">Panele zgłoszone do sieci</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {ROZLICZENIA.map((r) => (
                <Chip key={r.id} on={stan.rozliczenie === r.id} onClick={() => akcje.ustawRozliczenie(r.id)} title={r.opis}>
                  {r.nazwa}
                </Chip>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Krok>
  );
}

export function KrokLinia({ k }: { k: Stan }) {
  const { stan, akcje } = k;
  return (
    <Krok nr="02" tytul="Marka" opis="Montujemy obie. Różnią się ceną, dodatkami i tym, gdzie może stać bateria.">
      <div className="grid gap-4 sm:grid-cols-2">
        {LINIE_IDS.map((id, i) => {
          const l = LINIE[id];
          const on = stan.linia === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => akcje.ustawLinie(id)}
              aria-pressed={on}
              style={d(i * 100)}
              className={`group flex flex-col rounded-3xl border p-6 text-left transition-[transform,background-color,border-color] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 sm:p-7 ${
                on ? "border-sun/60 bg-cream text-ink" : "border-white/15 bg-white/[0.04] backdrop-blur-sm"
              }`}
            >
              <p className={`font-mono text-[11px] uppercase tracking-[0.2em] ${on ? "text-ink/50" : "text-foreground/50"}`}>{l.haslo}</p>
              <p className="mt-4 text-4xl font-medium tracking-[-0.04em] sm:text-5xl">{l.nazwa}</p>
              <p className={`mt-4 text-sm leading-relaxed ${on ? "text-ink/70" : "text-foreground/65"}`}>{l.dlaKogo}</p>
              <ul className={`mt-5 space-y-1.5 border-t pt-4 text-sm ${on ? "border-ink/10 text-ink/75" : "border-white/10 text-foreground/70"}`}>
                {l.plusy.slice(0, 3).map((p) => (
                  <li key={p} className="flex gap-2">
                    <span className={on ? "text-[#1f9d63]" : "text-led"}>✓</span>
                    {p}
                  </li>
                ))}
              </ul>
              <p className={`mt-4 text-xs ${on ? "text-ink/55" : "text-foreground/45"}`}>{l.ograniczenia[0]}</p>
            </button>
          );
        })}
      </div>
    </Krok>
  );
}

// Wizualizacja wybranego magazynu: sam wycięty produkt, bez tła i bez kafelka, obok kafelków marek (tylko desktop).
// Obie grafiki są w DOM cały czas — zmienia się przezroczystość i lekki zoom, więc przełączanie Deye ↔ FoxESS
// jest płynne i nie czeka na doczytanie obrazka.
export function ObrazLinii({ wybrana }: { wybrana: LiniaId }) {
  return (
    <div className="relative h-[26rem] w-full max-w-md" aria-live="polite">
      {LINIE_IDS.map((id) => {
        const l = LINIE[id];
        const on = id === wybrana;
        return (
          <div
            key={id}
            aria-hidden={!on}
            className={`absolute inset-0 transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
              on ? "translate-y-0 scale-100 opacity-100" : "translate-y-3 scale-[1.04] opacity-0"
            }`}
          >
            <Image
              src={l.obraz.src}
              alt={l.obraz.alt}
              fill
              sizes="24rem"
              className="object-contain object-bottom drop-shadow-[0_30px_50px_rgba(0,0,0,0.6)]"
            />
          </div>
        );
      })}
    </div>
  );
}

export function KrokWielkosc({ k }: { k: Stan }) {
  const { stan, akcje } = k;
  return (
    <Krok nr="03" tytul="Wielkość" opis="Program wymaga 2 kWh magazynu na każdy kilowat paneli. Większy magazyn rozbudujesz później.">
      <div className="grid gap-4 sm:grid-cols-3">
        {zestawyLinii(stan.linia).map((z, i) => {
          const on = stan.rozmiar === z.rozmiar;
          const polecany = k.polecanyRozmiar === z.rozmiar;
          return (
            <button
              key={z.rozmiar}
              type="button"
              onClick={() => akcje.ustawRozmiar(z.rozmiar)}
              aria-pressed={on}
              style={d(i * 100)}
              className={`group relative flex flex-col rounded-3xl border p-6 text-left transition-[transform,background-color,border-color] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 ${
                on ? "border-sun/60 bg-cream text-ink" : "border-white/15 bg-white/[0.04] backdrop-blur-sm"
              }`}
            >
              {polecany && (
                <span className="absolute -top-3 left-6 rounded-full bg-sun px-3 py-1 text-xs font-medium text-ink">
                  {stan.pvKwp != null ? "Do Twoich paneli" : "Najczęściej wybierany"}
                </span>
              )}
              <p className={`font-mono text-[11px] uppercase tracking-[0.2em] ${on ? "text-ink/50" : "text-foreground/50"}`}>
                {z.nazwa} · PV do {formatKwh(z.pvMaxKwp)} kWp
              </p>
              <p className="mt-6 text-6xl font-medium tracking-[-0.06em]">
                {formatKwh(z.kwh)}
                <span className="ml-1 font-serif text-2xl italic tracking-normal">kWh</span>
              </p>
              <p className={`mt-3 text-sm leading-relaxed ${on ? "text-ink/65" : "text-foreground/60"}`}>{z.dom}</p>
              <p className={`mt-5 border-t pt-4 text-lg font-medium ${on ? "border-ink/10" : "border-white/10"}`}>{formatZl(z.cena)}</p>
            </button>
          );
        })}
      </div>
      <details className="group mt-6 text-sm text-foreground/60">
        <summary className="cursor-pointer list-none">
          <span className="cta">
            <span className="cta-line">Co jest w każdym zestawie</span>
          </span>{" "}
          <span className="inline-block transition-transform duration-500 group-open:rotate-45">+</span>
        </summary>
        <ul className="mt-4 grid gap-x-8 gap-y-1.5 sm:grid-cols-2">
          {W_KAZDYM_ZESTAWIE.map((x) => (
            <li key={x} className="flex gap-2">
              <span className="text-led">✓</span>
              {x}
            </li>
          ))}
        </ul>
      </details>
    </Krok>
  );
}

export function KrokDodatki({ k }: { k: Stan }) {
  const { opcje, akcje } = k;
  return (
    <Krok nr="04" tytul="Dodatki" opis="Każdy z ceną od razu. To, co u danej marki jest w cenie, już zaznaczyliśmy.">
      <div className="space-y-10">
        {KATEGORIE.map((kat) => (
          <div key={kat.id}>
            <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/50">{kat.nazwa}</p>
            <ul className="divide-y divide-white/10 border-y border-white/10">
              {opcje
                .filter((o) => o.opcja.kategoria === kat.id)
                .map((o) => {
                  const id = o.opcja.id;
                  const brak = o.status === "brak";
                  const wCenie = o.status === "wCenie";
                  const on = o.ilosc > 0;
                  const konkurent = o.wykluczonaPrzez ? OPCJE.find((x) => x.id === o.wykluczonaPrzez)?.nazwa : undefined;
                  return (
                    <li key={id} className={`flex items-start gap-4 py-5 transition-opacity duration-500 ${brak ? "opacity-40" : ""}`}>
                      <Przelacznik on={on} disabled={brak || wCenie} onClick={() => akcje.przelaczOpcje(id)} label={o.opcja.nazwa} />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                          <p className="text-lg font-medium tracking-[-0.02em]">{o.opcja.nazwa}</p>
                          <p className={`shrink-0 text-base ${wCenie ? "text-led" : on ? "text-foreground" : "text-foreground/60"}`}>
                            {wCenie ? "w cenie" : brak ? "niedostępne" : `${o.ilosc > 1 ? `${o.ilosc} × ` : ""}${formatZl(o.cena)}`}
                          </p>
                        </div>
                        <p className="mt-1 max-w-xl text-sm leading-relaxed text-foreground/60">{brak ? o.powod : o.opcja.opis}</p>
                        {konkurent && !brak && !on && <p className="mt-1 text-xs text-foreground/45">Zamiast: {konkurent}</p>}
                        {on && o.opcja.uwaga && <p className="mt-2 max-w-xl text-xs leading-relaxed text-sun/90">{o.opcja.uwaga}</p>}
                        {o.opcja.wieleSztuk && !brak && on && (
                          <div className="mt-3 inline-flex items-center gap-1 rounded-full border border-white/20">
                            <button type="button" aria-label="Mniej" onClick={() => akcje.ustawOpcje(id, o.ilosc - 1)} className="size-9 rounded-full text-lg hover:bg-white/10">
                              −
                            </button>
                            <span className="min-w-[4.5rem] text-center text-sm tabular-nums">
                              {o.ilosc} / {o.maks}
                            </span>
                            <button
                              type="button"
                              aria-label="Więcej"
                              disabled={o.ilosc >= o.maks}
                              onClick={() => akcje.ustawOpcje(id, o.ilosc + 1)}
                              className="size-9 rounded-full text-lg hover:bg-white/10 disabled:opacity-30"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </li>
                  );
                })}
            </ul>
          </div>
        ))}
      </div>
    </Krok>
  );
}

export function Podsumowanie({ k }: { k: Stan }) {
  const { wyliczenie: w, stan } = k;
  const [skopiowano, setSkopiowano] = useState(false);

  const kopiuj = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setSkopiowano(true);
      setTimeout(() => setSkopiowano(false), 2000);
    } catch {
      /* brak schowka — nic nie robimy */
    }
  };

  return (
    <aside data-reveal>
      <div className="rounded-3xl border border-sun/60 bg-cream p-7 text-ink shadow-[0_40px_120px_-40px_rgba(255,159,69,0.35)] sm:p-9">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink/50">Twój zestaw</p>
        <p className="mt-5 text-5xl font-medium tracking-[-0.05em] sm:text-6xl">{formatZl(w.cena)}</p>
        <p className="mt-2 text-sm text-ink/60">
          {w.zestaw.nazwa} · {formatKwh(w.kwh)} kWh · panele do {formatKwh(w.pvMaxKwp)} kWp · z montażem
        </p>
        <p className="mt-1 text-xs text-ink/45">{w.linia.obraz.podpis}</p>

        <dl className="mt-7 space-y-2.5 border-t border-ink/10 pt-5 text-sm">
          {w.pozycje.map((p) => (
            <div key={p.id} className="flex justify-between gap-4">
              <dt className="text-ink/65">
                {p.id === "zestaw" ? `Zestaw ${w.zestaw.nazwa}` : p.nazwa}
                {p.ilosc > 1 ? ` × ${p.ilosc}` : ""}
              </dt>
              <dd className="shrink-0 font-medium">{formatZl(p.kwota)}</dd>
            </div>
          ))}
          {w.wCenie.map((o) => (
            <div key={o.id} className="flex justify-between gap-4 text-ink/50">
              <dt>{o.nazwa}</dt>
              <dd className="shrink-0">w cenie</dd>
            </div>
          ))}
        </dl>

        <dl className="mt-5 space-y-2.5 border-t border-ink/10 pt-5 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-ink/65">Zwrot z dotacji (ok.)</dt>
            <dd className="shrink-0 font-medium text-[#1f9d63]">− {formatZl(w.dotacja)}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-4 pt-1">
            <dt className="text-ink/65">Realnie płacisz</dt>
            <dd className="shrink-0 text-3xl font-medium tracking-[-0.04em]">{formatZl(w.poDotacji)}</dd>
          </div>
        </dl>
        <p className="mt-3 text-xs text-ink/55">Dotacja wraca na konto po montażu. {w.ratyKomunikat}</p>

        {w.uwagi.length > 0 && (
          <ul className="mt-5 space-y-2 rounded-2xl bg-sun/20 p-4 text-sm leading-relaxed text-ink/85">
            {w.uwagi.map((u) => (
              <li key={u}>{u}</li>
            ))}
          </ul>
        )}

        <a
          href="#wycena"
          className="cta group mt-7 flex w-full items-center justify-between rounded-full bg-ink py-2 pl-7 pr-2 text-lg font-medium text-cream transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.02]"
        >
          {stan.sytuacja === "brak-pv" ? "Zostaw numer" : "Zamów wycenę tego zestawu"}
          <span className="flex size-12 items-center justify-center rounded-full bg-sun text-ink transition-transform duration-500 group-hover:rotate-45">
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden>
              <path d="M4 14 14 4M6 4h8v8" stroke="currentColor" strokeWidth="2" />
            </svg>
          </span>
        </a>
        <button type="button" onClick={kopiuj} className="cta mt-4 block w-fit text-sm text-ink/60">
          <span className="cta-line">{skopiowano ? "Skopiowano link do tej konfiguracji" : "Skopiuj link do tej konfiguracji"}</span>
        </button>
      </div>
    </aside>
  );
}
