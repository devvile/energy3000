"use client";

// Panel wyborów jak ekwipunek w grze: zwarte kontrolki na szklanej karcie obok sceny. Logika w useKonfigurator.

import { useState } from "react";
import {
  BEZ_PV,
  LINIE,
  LINIE_IDS,
  OPCJE,
  ZASTRZEZENIA,
  formatKwh,
  formatZl,
  zestawyLinii,
  type Kategoria,
  type LiniaId,
  type Rozliczenie,
  type RozmiarId,
  type Sytuacja,
} from "@/lib/konfigurator";
import { tylkoLiczba } from "../konfigurator/Konfigurator";
import type { Konfigurator } from "../konfigurator/useKonfigurator";

const SYTUACJE: { id: Sytuacja; nazwa: string }[] = [
  { id: "zwykly", nazwa: "Zwykły falownik" },
  { id: "hybryda-deye-fox", nazwa: "Hybrydowy Deye / Fox" },
  { id: "hybryda-inna", nazwa: "Hybrydowy innej marki" },
  { id: "mikro-optymalizatory", nazwa: "Mikroinwertery" },
  { id: "nie-wiem", nazwa: "Nie wiem" },
  { id: "brak-pv", nazwa: "Nie mam paneli" },
];

const ROZLICZENIA: { id: Rozliczenie; nazwa: string }[] = [
  { id: "net-billing", nazwa: "Od kwietnia 2022" },
  { id: "net-metering", nazwa: "Wcześniej" },
];

const KATEGORIE: { id: Kategoria; nazwa: string }[] = [
  { id: "backup", nazwa: "Zasilanie awaryjne" },
  { id: "zastosowania", nazwa: "Zastosowania" },
  { id: "pojemnosc", nazwa: "Więcej pojemności" },
];

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={`rounded-full border px-3 py-1 text-[13px] transition-colors duration-300 lg:px-3.5 lg:py-1.5 lg:text-sm ${
        on ? "border-cream bg-cream text-ink" : "border-white/20 text-foreground/80 hover:border-white/60"
      }`}
    >
      {children}
    </button>
  );
}

function Naglowek({ nr, tytul, opis }: { nr: number; tytul: string; opis?: string }) {
  return (
    <div className="mb-3 lg:mb-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/50">Krok {nr} z 5</p>
      <h2 className="mt-1 text-xl font-medium tracking-[-0.03em] lg:mt-1.5 lg:text-2xl">{tytul}</h2>
      {/* Opis tylko na desktopie — na telefonie zabierał miejsce potrzebne na wybory bez przewijania. */}
      {opis && <p className="mt-1.5 hidden text-sm leading-relaxed text-foreground/60 lg:block">{opis}</p>}
    </div>
  );
}

export function PanelDom({ k }: { k: Konfigurator }) {
  const { stan, akcje } = k;
  const [pvWpisane, setPv] = useState("");
  const pvTekst = pvWpisane === "" && stan.pvKwp != null ? String(stan.pvKwp).replace(".", ",") : pvWpisane;
  return (
    <div>
      <Naglowek nr={1} tytul="Twój dom dzisiaj" opis="Powiedz, co masz na dachu. Jeśli nie wiesz, zostaw puste." />
      <label className="block">
        <span className="text-xs text-foreground/60">Moc paneli</span>
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
            className="w-full bg-transparent py-1 text-2xl font-medium tracking-[-0.03em] text-foreground outline-none placeholder:text-foreground/25 lg:py-2 lg:text-3xl"
          />
          <span className="font-serif text-lg italic text-foreground/60">kWp</span>
        </span>
      </label>
      {stan.pvKwp != null && k.polecanyRozmiar && k.polecanyRozmiar !== stan.rozmiar && (
        <p className="mt-2 text-xs text-foreground/60">
          Do tych paneli polecamy rozmiar <strong className="text-foreground">{k.polecanyRozmiar.toUpperCase()}</strong> — dobierzemy go w kroku 3.
        </p>
      )}
      <p className="mt-3 text-xs text-foreground/60 lg:mt-6">Falownik, który masz</p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {SYTUACJE.map((s) => (
          <Chip key={s.id} on={stan.sytuacja === s.id} onClick={() => akcje.ustawSytuacje(s.id)}>
            {s.nazwa}
          </Chip>
        ))}
      </div>
      {stan.sytuacja === "brak-pv" ? (
        <div className="krok-in mt-4 rounded-2xl border border-sun/40 bg-sun/10 p-4 lg:mt-6 lg:p-5">
          <p className="text-base font-medium tracking-[-0.02em] lg:text-lg">{BEZ_PV.tytul}</p>
          <p className="mt-1.5 text-xs leading-relaxed text-foreground/75 lg:text-sm">{BEZ_PV.tekst}</p>
          <p className="mt-2 text-xs leading-relaxed text-foreground/75 lg:text-sm">{BEZ_PV.zacheta}</p>
        </div>
      ) : (
        <>
          <p className="mt-3 text-xs text-foreground/60 lg:mt-5">Panele zgłoszone do sieci</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {ROZLICZENIA.map((r) => (
              <Chip key={r.id} on={stan.rozliczenie === r.id} onClick={() => akcje.ustawRozliczenie(r.id)}>
                {r.nazwa}
              </Chip>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function PanelMarka({ k }: { k: Konfigurator }) {
  const { stan, akcje } = k;
  return (
    <div>
      <Naglowek nr={2} tytul="Marka magazynu" opis="Montujemy obie. Patrz, jak magazyn wjeżdża do garażu." />
      <div className="space-y-3">
        {LINIE_IDS.map((id) => {
          const l = LINIE[id];
          const on = stan.linia === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => akcje.ustawLinie(id)}
              aria-pressed={on}
              className={`w-full rounded-2xl border p-4 text-left transition-all duration-500 ${
                on ? "border-sun/60 bg-cream text-ink" : "border-white/15 bg-white/[0.04] hover:border-white/40"
              }`}
            >
              <p className={`font-mono text-[10px] uppercase tracking-[0.2em] ${on ? "text-ink/50" : "text-foreground/50"}`}>{l.haslo}</p>
              <p className="mt-1 text-2xl font-medium tracking-[-0.03em]">{l.nazwa}</p>
              <p className={`mt-1.5 text-xs leading-relaxed ${on ? "text-ink/70" : "text-foreground/60"}`}>{l.dlaKogo}</p>
              <ul className={`mt-2 space-y-0.5 text-xs ${on ? "text-ink/75" : "text-foreground/65"}`}>
                {l.plusy.slice(0, 2).map((p) => (
                  <li key={p}>✓ {p}</li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>
    </div>
  );
}

const MODULY: Record<RozmiarId, number> = { s: 1, m: 2, l: 3 };
const ROZMIAR_OPIS: Record<RozmiarId, string> = { s: "Kompakt", m: "Standard", l: "Max" };

/** Piktogram magazynu: tyle modułów, ile jednostek w zestawie (jak w scenie garażu). */
function Moduly({ n, on, linia }: { n: number; on: boolean; linia: LiniaId }) {
  const pion = linia === "fox"; // Fox: moduły w wieży, Deye: szafy obok siebie
  return (
    <span className={`flex items-end gap-1 ${pion ? "flex-col-reverse items-center" : ""}`} aria-hidden>
      {[0, 1, 2].map((i) => {
        const jest = i < n;
        return (
          <span
            key={i}
            className={`block rounded-[3px] border transition-all duration-500 ${pion ? "h-3 w-7" : "h-9 w-4"} ${
              jest ? (on ? "border-ink bg-ink" : "border-cream/90 bg-cream/90") : on ? "border-ink/20" : "border-white/15"
            }`}
          />
        );
      })}
    </span>
  );
}

export function PanelWielkosc({ k }: { k: Konfigurator }) {
  const { stan, akcje } = k;
  return (
    <div>
      <Naglowek nr={3} tytul="Wielkość" opis="Program wymaga 2 kWh na każdy kilowat paneli. Większy magazyn rozbudujesz później." />
      <div className="space-y-3">
        {zestawyLinii(stan.linia).map((z) => {
          const on = stan.rozmiar === z.rozmiar;
          const polecany = k.polecanyRozmiar === z.rozmiar;
          return (
            <button
              key={z.rozmiar}
              type="button"
              onClick={() => akcje.ustawRozmiar(z.rozmiar)}
              aria-pressed={on}
              className={`group relative flex w-full items-stretch gap-4 overflow-hidden rounded-3xl border p-5 text-left transition-all duration-500 ${
                on ? "border-sun/60 bg-cream text-ink shadow-[0_30px_80px_-40px_rgba(255,159,69,0.5)]" : "border-white/15 bg-white/[0.04] hover:border-white/40 hover:bg-white/[0.07]"
              }`}
            >
              {/* Litera rozmiaru */}
              <span
                className={`flex size-14 shrink-0 items-center justify-center rounded-2xl font-serif text-4xl italic leading-none transition-colors duration-500 ${
                  on ? "bg-ink text-cream" : "bg-white/10 text-foreground"
                }`}
              >
                {z.rozmiar.toUpperCase()}
              </span>

              <span className="min-w-0 flex-1">
                <span className="flex items-baseline justify-between gap-3">
                  <span className="text-3xl font-medium tracking-[-0.05em]">
                    {formatKwh(z.kwh)}
                    <span className="ml-1 font-serif text-base italic tracking-normal">kWh</span>
                  </span>
                  <span className="shrink-0 text-base font-medium">{formatZl(z.cena)}</span>
                </span>
                <span className={`mt-0.5 block font-mono text-[10px] uppercase tracking-[0.2em] ${on ? "text-ink/55" : "text-foreground/50"}`}>
                  {ROZMIAR_OPIS[z.rozmiar]} · {MODULY[z.rozmiar]} {MODULY[z.rozmiar] === 1 ? "moduł" : "moduły"} · PV do {formatKwh(z.pvMaxKwp)} kWp
                </span>
                <span className={`mt-2 block text-xs leading-relaxed ${on ? "text-ink/65" : "text-foreground/60"}`}>{z.dom}</span>
              </span>

              <span className="flex shrink-0 flex-col items-end justify-between">
                <Moduly n={MODULY[z.rozmiar]} on={on} linia={stan.linia} />
                {polecany && <span className="mt-2 rounded-full bg-sun px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.15em] text-ink">polecany</span>}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function PanelDodatki({ k }: { k: Konfigurator }) {
  const { opcje, akcje } = k;
  return (
    <div>
      <Naglowek nr={4} tytul="Dodatki" opis="Każdy pojawia się w scenie. To, co w tej marce jest w cenie, już masz." />
      <div className="space-y-5">
        {KATEGORIE.map((kat) => (
          <div key={kat.id}>
            <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/50">{kat.nazwa}</p>
            <ul className="divide-y divide-white/10">
              {opcje
                .filter((o) => o.opcja.kategoria === kat.id)
                .map((o) => {
                  const id = o.opcja.id;
                  const brak = o.status === "brak";
                  const wCenie = o.status === "wCenie";
                  const on = o.ilosc > 0;
                  const konkurent = o.wykluczonaPrzez ? OPCJE.find((x) => x.id === o.wykluczonaPrzez)?.nazwa : undefined;
                  return (
                    <li key={id} className={`flex items-start gap-3 py-2.5 ${brak ? "opacity-40" : ""}`}>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={on}
                        aria-label={o.opcja.nazwa}
                        disabled={brak || wCenie}
                        onClick={() => akcje.przelaczOpcje(id)}
                        className={`relative mt-0.5 h-6 w-10 shrink-0 rounded-full transition-colors duration-500 disabled:cursor-not-allowed ${on ? "bg-sun" : "bg-white/15"}`}
                      >
                        <span className={`absolute left-1 top-1 size-4 rounded-full transition-transform duration-500 ${on ? "translate-x-4 bg-ink" : "bg-cream"}`} />
                      </button>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-3">
                          <p className="text-sm font-medium">{o.opcja.nazwa}</p>
                          <p className={`shrink-0 text-xs ${wCenie ? "text-led" : "text-foreground/60"}`}>
                            {wCenie ? "w cenie" : brak ? "niedostępne" : `${o.ilosc > 1 ? `${o.ilosc} × ` : ""}${formatZl(o.cena)}`}
                          </p>
                        </div>
                        <p className="mt-0.5 text-xs leading-relaxed text-foreground/55">{brak ? o.powod : o.opcja.opis}</p>
                        {konkurent && !brak && !on && <p className="mt-0.5 text-[11px] text-foreground/40">Zamiast: {konkurent}</p>}
                        {o.opcja.wieleSztuk && !brak && on && (
                          <div className="mt-1.5 inline-flex items-center gap-1 rounded-full border border-white/20 text-xs">
                            <button type="button" aria-label="Mniej" onClick={() => akcje.ustawOpcje(id, o.ilosc - 1)} className="size-7 rounded-full hover:bg-white/10">
                              −
                            </button>
                            <span className="min-w-[3.5rem] text-center tabular-nums">
                              {o.ilosc} / {o.maks}
                            </span>
                            <button
                              type="button"
                              aria-label="Więcej"
                              disabled={o.ilosc >= o.maks}
                              onClick={() => akcje.ustawOpcje(id, o.ilosc + 1)}
                              className="size-7 rounded-full hover:bg-white/10 disabled:opacity-30"
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
    </div>
  );
}

export function PanelPodsumowanie({ k }: { k: Konfigurator }) {
  const { wyliczenie: w, stan } = k;
  const [skopiowano, setSkopiowano] = useState(false);
  const kopiuj = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setSkopiowano(true);
      setTimeout(() => setSkopiowano(false), 2000);
    } catch {
      /* brak schowka */
    }
  };
  return (
    <div>
      <Naglowek nr={5} tytul="Twój zestaw jest gotowy" opis="Zapada noc. Dom świeci z magazynu, sieć odpoczywa." />
      <dl className="space-y-2 text-sm">
        {w.pozycje.map((p) => (
          <div key={p.id} className="flex justify-between gap-4">
            <dt className="text-foreground/65">
              {p.id === "zestaw" ? `Zestaw ${w.zestaw.nazwa}` : p.nazwa}
              {p.ilosc > 1 ? ` × ${p.ilosc}` : ""}
            </dt>
            <dd className="shrink-0 font-medium">{formatZl(p.kwota)}</dd>
          </div>
        ))}
        {w.wCenie.map((o) => (
          <div key={o.id} className="flex justify-between gap-4 text-foreground/45">
            <dt>{o.nazwa}</dt>
            <dd className="shrink-0">w cenie</dd>
          </div>
        ))}
      </dl>
      <dl className="mt-4 space-y-2 border-t border-white/10 pt-4 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-foreground/65">Razem brutto</dt>
          <dd className="font-medium">{formatZl(w.cena)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-foreground/65">Zwrot z dotacji (ok.)</dt>
          <dd className="font-medium text-led">− {formatZl(w.dotacja)}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-4 pt-1">
          <dt className="text-foreground/65">Realnie płacisz</dt>
          <dd className="text-3xl font-medium tracking-[-0.04em]">{formatZl(w.poDotacji)}</dd>
        </div>
      </dl>
      <p className="mt-2 text-[11px] text-foreground/50">Dotacja wraca na konto po montażu. {w.ratyKomunikat}</p>
      {w.uwagi.length > 0 && (
        <ul className="mt-4 space-y-1.5 rounded-xl bg-sun/15 p-3 text-xs leading-relaxed text-sun">
          {w.uwagi.map((u) => (
            <li key={u}>{u}</li>
          ))}
        </ul>
      )}
      <a
        href="#wycena"
        className="cta group mt-5 flex w-full items-center justify-between rounded-full bg-sun py-2 pl-6 pr-2 text-base font-medium text-ink transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.02]"
      >
        {stan.sytuacja === "brak-pv" ? "Zostaw numer" : "Zamów wycenę tego zestawu"}
        <span className="flex size-10 items-center justify-center rounded-full bg-ink text-cream transition-transform duration-500 group-hover:rotate-45">
          <svg width="14" height="14" viewBox="0 0 18 18" fill="none" aria-hidden>
            <path d="M4 14 14 4M6 4h8v8" stroke="currentColor" strokeWidth="2" />
          </svg>
        </span>
      </a>
      <button type="button" onClick={kopiuj} className="cta mt-3 block w-fit text-xs text-foreground/60">
        <span className="cta-line">{skopiowano ? "Skopiowano link do zestawu" : "Skopiuj link do tego zestawu"}</span>
      </button>
      <details className="mt-4 text-[11px] text-foreground/45">
        <summary className="cursor-pointer">Drobny druk</summary>
        <ul className="mt-2 list-disc space-y-1 pl-4">
          {ZASTRZEZENIA.map((z) => (
            <li key={z}>{z}</li>
          ))}
        </ul>
      </details>
    </div>
  );
}
