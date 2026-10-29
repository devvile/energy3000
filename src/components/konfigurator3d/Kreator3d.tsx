"use client";

// Konfigurator „jak kreator postaci”: scena domu na cały ekran, panel wyborów jak ekwipunek, HUD ze statystykami.
// Ta sama logika i dane co w pozostałych wersjach (useKonfigurator) — inna jest tylko warstwa wizualna.
// `osadzony`: sekcja „Cena” na stronie głównej — bez własnego logo i telefonu (są w pływającym nagłówku strony),
// z odstępem na ten nagłówek. Bez osadzenia: osobna strona /konfigurator-3d.

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { PHONE, PHONE_HREF } from "@/lib/oferta";
import { useKonfigurator } from "../konfigurator/useKonfigurator";
import { Hud } from "./Hud";
import { PanelDodatki, PanelDom, PanelMarka, PanelPodsumowanie, PanelWielkosc } from "./PanelWyborow";
import { Scena, type Kamera } from "./Scena";

const KROKI = ["Twój dom", "Marka", "Wielkość", "Dodatki", "Twój zestaw"] as const;

export function Kreator3d({ osadzony = false }: { osadzony?: boolean }) {
  const k = useKonfigurator();
  const { stan, wyliczenie } = k;
  const [krok, setKrok] = useState(0);
  const [najdalej, setNajdalej] = useState(0);
  const [awaria, setAwaria] = useState(false);
  const sekcja = useRef<HTMLElement>(null);
  const ostatni = krok === KROKI.length - 1;
  // Bez paneli magazyn nie ma z czego się ładować — zamiast dalszych kroków karta z wyjaśnieniem i kontaktem (PanelDom).
  const bezPv = stan.sytuacja === "brak-pv";

  const kamera: Kamera = krok === 0 ? (stan.pvKwp != null ? "dach" : "calosc") : krok <= 2 ? "garaz" : krok === 3 ? "dodatki" : "noc";
  const noc = ostatni;
  // Kroki „Marka” i „Wielkość” dzieją się w osobnej scenie garażu; zoom na dom jest tylko przejściem.
  const plan = (krok === 1 || krok === 2) ? "garaz" : "dom";

  // Symulacja awarii: po włączeniu „całego domu” dom przez chwilę świeci z magazynu także za dnia.
  const awariaTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const blyskAwarii = () => {
    setAwaria(true);
    if (awariaTimer.current) clearTimeout(awariaTimer.current);
    awariaTimer.current = setTimeout(() => setAwaria(false), 3500);
  };
  useEffect(() => () => {
    if (awariaTimer.current) clearTimeout(awariaTimer.current);
  }, []);
  const kDodatki = {
    ...k,
    akcje: {
      ...k.akcje,
      przelaczOpcje: (id: Parameters<typeof k.akcje.przelaczOpcje>[0]) => {
        if (id === "calyDom" && !stan.opcje.calyDom) blyskAwarii();
        k.akcje.przelaczOpcje(id);
      },
    },
  };

  const idz = (n: number) => {
    const cel = Math.max(0, Math.min(KROKI.length - 1, n));
    setKrok(cel);
    setNajdalej((m) => Math.max(m, cel));
    // Telefon: panel jest pod sceną — po zmianie kroku wracamy na górę konfiguratora, żeby zobaczyć, co się zmieniło.
    if (window.innerWidth < 1024) sekcja.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={sekcja}
      id={osadzony ? "cena" : undefined}
      // Sekcja ma własny odstęp na pływający nagłówek, więc znosimy globalne scroll-padding-top (5rem) przy skoku do #cena.
      style={osadzony ? { scrollMarginTop: "-5rem" } : undefined}
      className="relative flex min-h-svh flex-col bg-[#140c07] text-foreground lg:h-svh lg:overflow-hidden"
    >
      {/* Pasek górny */}
      <header
        className={`relative z-20 flex items-center justify-between px-5 py-3 sm:px-6 lg:py-4 ${osadzony ? "pt-[4.75rem] sm:pt-[5.25rem] lg:pt-[5.25rem]" : ""}`}
      >
        {osadzony ? (
          <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/50">
            <span className="h-px w-8 bg-foreground/40" /> Cena
          </p>
        ) : (
          <Link href="/" aria-label="E3000 — strona główna" className="flex items-baseline text-lg font-semibold tracking-tight">
            E<span className="font-serif text-[1.4em] font-normal italic leading-none">3000</span>
          </Link>
        )}
        <ol className="hidden items-center gap-2 md:flex">
          {KROKI.map((n, i) => {
            const aktywny = i === krok;
            const dostepny = i <= najdalej && (!bezPv || i === 0);
            return (
              <li key={n} className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={!dostepny}
                  onClick={() => idz(i)}
                  aria-current={aktywny ? "step" : undefined}
                  className={`flex items-center gap-2 rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors duration-500 ${
                    aktywny ? "bg-sun text-ink" : dostepny ? "text-foreground/70 hover:text-foreground" : "text-foreground/30"
                  }`}
                >
                  <span>{i < krok ? "✓" : i + 1}</span>
                  <span>{n}</span>
                </button>
                {i < KROKI.length - 1 && <span className="h-px w-4 bg-foreground/15" />}
              </li>
            );
          })}
        </ol>
        {osadzony ? (
          <span className="hidden w-[4.5rem] md:block" aria-hidden />
        ) : (
          <a href={PHONE_HREF} className="text-sm tabular-nums text-foreground/80 hover:text-foreground">
            {PHONE}
          </a>
        )}
      </header>

      {/* Scena + panel */}
      <div className="relative flex flex-1 flex-col lg:min-h-0 lg:flex-row">
        <div className="relative flex items-center justify-center px-2 lg:min-h-0 lg:flex-1 lg:px-6">
          {/* Szerokość sceny z wysokości ekranu (klasa .scena-ramka w globals.css), żeby krok mieścił się bez przewijania. */}
          <div className={`scena-ramka w-full ${osadzony ? "osadzona" : ""}`}>
            <Scena stan={stan} wyliczenie={wyliczenie} kamera={kamera} plan={plan} noc={noc} pokazMagazyn={krok >= 1} pokazMagazynDom={krok >= 3} awaria={awaria} className="w-full" />
          </div>

        </div>

        <aside className="relative z-10 border-t border-white/10 bg-[#140c07]/80 px-5 py-4 backdrop-blur-xl sm:px-6 lg:w-[26rem] lg:py-6 lg:overflow-y-auto lg:border-l lg:border-t-0">
          <div key={krok} className="krok-in">
            {krok === 0 && <PanelDom k={k} />}
            {krok === 1 && <PanelMarka k={k} />}
            {krok === 2 && <PanelWielkosc k={k} />}
            {krok === 3 && <PanelDodatki k={kDodatki} />}
            {krok === 4 && <PanelPodsumowanie k={k} />}
          </div>
        </aside>
      </div>

      {/* HUD + nawigacja */}
      <footer className="sticky bottom-0 z-20 border-t border-white/10 bg-[#140c07]/85 px-5 py-3 backdrop-blur-xl sm:px-6 lg:static lg:py-4">
        {/* Na telefonie jeden wiersz: statystyki + strzałka wstecz + „Dalej”, żeby stopka nie zjadała ekranu. */}
        <div className="flex items-center justify-between gap-3 lg:gap-10">
          <div className="min-w-0 flex-1">
            {bezPv ? (
              <p className="text-xs leading-relaxed text-foreground/70 lg:text-sm">
                Bez paneli nie liczymy ceny magazynu. <span className="hidden sm:inline">Zostaw numer — doradzimy, od czego zacząć.</span>
              </p>
            ) : (
              <Hud stan={stan} w={wyliczenie} />
            )}
          </div>
          <div className="flex shrink-0 items-center gap-2 lg:gap-4">
            <button
              type="button"
              onClick={() => idz(krok - 1)}
              disabled={krok === 0}
              aria-label="Wstecz"
              className="cta text-sm text-foreground/70 transition-colors hover:text-foreground disabled:invisible"
            >
              <span className="hidden lg:inline"><span className="cta-line">← Wstecz</span></span>
              <span className="flex size-10 items-center justify-center rounded-full border border-white/20 lg:hidden" aria-hidden>
                <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
                  <path d="M15 9H3M8 4 3 9l5 5" stroke="currentColor" strokeWidth="2" />
                </svg>
              </span>
            </button>
            {ostatni || bezPv ? (
              <a
                href="#wycena"
                className="cta group flex items-center gap-3 rounded-full bg-sun py-1.5 pl-5 pr-1.5 text-sm font-medium text-ink lg:gap-4 lg:pl-6 lg:text-base transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.02]"
              >
                <span className="lg:hidden">{bezPv ? "Kontakt" : "Wycena"}</span>
                <span className="hidden lg:inline">{bezPv ? "Zostaw numer" : "Zamów wycenę"}</span>
                <span className="flex size-10 items-center justify-center rounded-full bg-ink text-cream transition-transform duration-500 group-hover:rotate-45">
                  <svg width="14" height="14" viewBox="0 0 18 18" fill="none" aria-hidden>
                    <path d="M4 14 14 4M6 4h8v8" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </span>
              </a>
            ) : (
              <button
                type="button"
                onClick={() => idz(krok + 1)}
                className="cta group flex items-center gap-3 rounded-full bg-cream py-1.5 pl-5 pr-1.5 text-sm font-medium text-ink lg:gap-4 lg:pl-6 lg:text-base transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.02] disabled:opacity-40"
              >
                {krok === KROKI.length - 2 ? "Pokaż zestaw" : "Dalej"}
                <span className="flex size-10 items-center justify-center rounded-full bg-ink text-cream transition-transform duration-500 group-hover:translate-x-0.5">
                  <svg width="14" height="14" viewBox="0 0 18 18" fill="none" aria-hidden>
                    <path d="M3 9h12M10 4l5 5-5 5" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </span>
              </button>
            )}
          </div>
        </div>
      </footer>
    </section>
  );
}
