"use client";

// Konfigurator „jak kreator postaci”: scena domu na cały ekran, panel wyborów jak ekwipunek, HUD ze statystykami.
// Ta sama logika i dane co w pozostałych wersjach (useKonfigurator) — inna jest tylko warstwa wizualna.

import gsap from "gsap";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { PHONE, PHONE_HREF } from "@/lib/oferta";
import { useKonfigurator } from "../konfigurator/useKonfigurator";
import { Hud } from "./Hud";
import { PanelDodatki, PanelDom, PanelMarka, PanelPodsumowanie, PanelWielkosc } from "./PanelWyborow";
import { Scena, type Kamera } from "./Scena";

const KROKI = ["Twój dom", "Marka", "Wielkość", "Dodatki", "Twój zestaw"] as const;

export function Kreator3d() {
  const k = useKonfigurator();
  const { stan, wyliczenie } = k;
  const [krok, setKrok] = useState(0);
  const [najdalej, setNajdalej] = useState(0);
  const [start, setStart] = useState(false);
  const [awaria, setAwaria] = useState(false);
  const intro = useRef<HTMLDivElement>(null);
  const ostatni = krok === KROKI.length - 1;

  const kamera: Kamera = !start ? "calosc" : krok === 0 ? (stan.pvKwp != null ? "dach" : "calosc") : krok <= 2 ? "garaz" : krok === 3 ? "dodatki" : "noc";
  const noc = start && ostatni;
  // Kroki „Marka” i „Wielkość” dzieją się w osobnej scenie garażu; zoom na dom jest tylko przejściem.
  const plan = start && (krok === 1 || krok === 2) ? "garaz" : "dom";

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

  const zacznij = () => {
    gsap.to(intro.current, { opacity: 0, duration: 1, ease: "power2.inOut", onComplete: () => setStart(true) });
  };

  const idz = (n: number) => {
    const cel = Math.max(0, Math.min(KROKI.length - 1, n));
    setKrok(cel);
    setNajdalej((m) => Math.max(m, cel));
    if (window.innerWidth < 1024) window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="relative flex min-h-svh flex-col bg-[#140c07] text-foreground lg:h-svh lg:overflow-hidden">
      {/* Pasek górny */}
      <header className="relative z-20 flex items-center justify-between px-5 py-4 sm:px-6">
        <Link href="/" aria-label="E3000 — strona główna" className="flex items-baseline text-lg font-semibold tracking-tight">
          E<span className="font-serif text-[1.4em] font-normal italic leading-none">3000</span>
        </Link>
        <ol className="hidden items-center gap-2 md:flex">
          {KROKI.map((n, i) => {
            const aktywny = i === krok;
            const dostepny = start && i <= najdalej;
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
        <a href={PHONE_HREF} className="text-sm tabular-nums text-foreground/80 hover:text-foreground">
          {PHONE}
        </a>
      </header>

      {/* Scena + panel */}
      <div className="relative flex flex-1 flex-col lg:min-h-0 lg:flex-row">
        <div className="relative flex items-center justify-center px-2 lg:min-h-0 lg:flex-1 lg:px-6">
          {/* Szerokość sceny z wysokości ekranu (nagłówek + HUD ≈ 15rem), żeby cała mieściła się bez przewijania. */}
          <div className="w-full" style={{ maxWidth: "min(100%, calc((100svh - 15rem) * 1.768))" }}>
            <Scena stan={stan} wyliczenie={wyliczenie} kamera={kamera} plan={plan} noc={noc} pokazMagazyn={start && krok >= 1} awaria={awaria} className="w-full" />
          </div>

          {/* Intro: pełny ekran, scena prześwituje spod spodu */}
          {!start && (
            <div ref={intro} className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-[#140c07]/60 px-6 text-center backdrop-blur-[3px]">
              <p className="mb-5 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/60">
                <span className="h-px w-8 bg-foreground/40" /> Konfigurator <span className="h-px w-8 bg-foreground/40" />
              </p>
              <h1 className="text-[clamp(2.2rem,5.5vw,5rem)] font-medium leading-[0.98] tracking-[-0.05em]">
                Zbuduj dom,
                <br />
                który nie boi się <em className="font-serif font-normal italic">nocy</em>.
              </h1>
              <p className="mt-5 max-w-md text-base leading-relaxed text-foreground/75">
                Cztery wybory. Każdy pojawia się w Twoim domu. Na końcu wiesz, ile to kosztuje i ile wraca z dotacji.
              </p>
              <button
                type="button"
                onClick={zacznij}
                className="cta group mt-8 flex items-center gap-5 rounded-full bg-cream py-2 pl-7 pr-2 text-lg font-medium text-ink transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.03]"
              >
                Zacznij
                <span className="flex size-12 items-center justify-center rounded-full bg-ink text-cream transition-transform duration-500 group-hover:translate-x-0.5">
                  <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden>
                    <path d="M3 9h12M10 4l5 5-5 5" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </span>
              </button>
            </div>
          )}
        </div>

        <aside className="relative z-10 border-t border-white/10 bg-[#140c07]/80 px-5 py-6 backdrop-blur-xl sm:px-6 lg:w-[26rem] lg:overflow-y-auto lg:border-l lg:border-t-0">
          <div key={krok} className={`krok-in ${start ? "" : "pointer-events-none opacity-40"}`}>
            {krok === 0 && <PanelDom k={k} />}
            {krok === 1 && <PanelMarka k={k} />}
            {krok === 2 && <PanelWielkosc k={k} />}
            {krok === 3 && <PanelDodatki k={kDodatki} />}
            {krok === 4 && <PanelPodsumowanie k={k} />}
          </div>
        </aside>
      </div>

      {/* HUD + nawigacja */}
      <footer className="sticky bottom-0 z-20 border-t border-white/10 bg-[#140c07]/85 px-5 py-4 backdrop-blur-xl sm:px-6 lg:static">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
          <div className="min-w-0 flex-1">
            <Hud stan={stan} w={wyliczenie} />
          </div>
          <div className="flex items-center justify-between gap-4 lg:justify-end">
            <button
              type="button"
              onClick={() => idz(krok - 1)}
              disabled={!start || krok === 0}
              className="cta text-sm text-foreground/70 transition-colors hover:text-foreground disabled:invisible"
            >
              <span className="cta-line">← Wstecz</span>
            </button>
            {ostatni ? (
              <a
                href="#wycena"
                className="cta group flex items-center gap-4 rounded-full bg-sun py-1.5 pl-6 pr-1.5 text-base font-medium text-ink transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.02]"
              >
                Zamów wycenę
                <span className="flex size-10 items-center justify-center rounded-full bg-ink text-cream transition-transform duration-500 group-hover:rotate-45">
                  <svg width="14" height="14" viewBox="0 0 18 18" fill="none" aria-hidden>
                    <path d="M4 14 14 4M6 4h8v8" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </span>
              </a>
            ) : (
              <button
                type="button"
                disabled={!start}
                onClick={() => idz(krok + 1)}
                className="cta group flex items-center gap-4 rounded-full bg-cream py-1.5 pl-6 pr-1.5 text-base font-medium text-ink transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.02] disabled:opacity-40"
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
