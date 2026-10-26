"use client";

// Alternatywna wersja konfiguratora: krok po kroku (kreator) zamiast jednej przewijanej sekcji.
// Te same kroki i ta sama logika co w sekcji „Cena” na stronie głównej — inna jest tylko nawigacja.

import { useEffect, useState } from "react";
import { formatZl } from "@/lib/konfigurator";
import { Words } from "../Words";
import { KrokDodatki, KrokDom, KrokLinia, KrokWielkosc, ObrazLinii, Podsumowanie } from "./Konfigurator";
import { useKonfigurator, type Konfigurator } from "./useKonfigurator";

const KROKI: { id: string; nazwa: string }[] = [
  { id: "dom", nazwa: "Twój dom" },
  { id: "marka", nazwa: "Marka" },
  { id: "wielkosc", nazwa: "Wielkość" },
  { id: "dodatki", nazwa: "Dodatki" },
  { id: "podsumowanie", nazwa: "Twój zestaw" },
];

function Panel({ krok, k }: { krok: number; k: Konfigurator }) {
  switch (krok) {
    case 0:
      return <KrokDom k={k} />;
    case 1:
      return (
        <div className="grid lg:grid-cols-[1.15fr_0.85fr] lg:gap-x-16">
          <KrokLinia k={k} />
          <div className="hidden lg:flex lg:items-center lg:justify-center">
            <ObrazLinii wybrana={k.stan.linia} />
          </div>
        </div>
      );
    case 2:
      return <KrokWielkosc k={k} />;
    case 3:
      return <KrokDodatki k={k} />;
    default:
      return (
        <div className="grid gap-10 pt-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <p className="mb-6 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/50">
              <span className="h-px w-8 bg-foreground/40" /> Krok 5 z 5
            </p>
            <Words
              text={"Twój zestaw\njest gotowy."}
              accent="gotowy."
              className="text-[clamp(2.4rem,5vw,4.6rem)] font-medium leading-[0.98] tracking-[-0.05em]"
            />
            <p data-reveal className="mt-6 max-w-md text-base leading-relaxed text-foreground/70">
              Zostaw numer poniżej, a oddzwonimy w pół godziny z dokładną wyceną dla Twojego domu. Konfiguracja dopina się
              do zgłoszenia sama.
            </p>
            <div className="mt-8 hidden lg:block">
              <ObrazLinii wybrana={k.stan.linia} />
            </div>
          </div>
          <Podsumowanie k={k} />
        </div>
      );
  }
}

export function KonfiguratorKroki() {
  const k = useKonfigurator();
  const [krok, setKrok] = useState(0);
  const [najdalej, setNajdalej] = useState(0);
  const ostatni = krok === KROKI.length - 1;

  // Strona bez intro: odblokuj animacje wejścia nagłówka (html[data-ready]) od razu.
  useEffect(() => {
    document.documentElement.dataset.ready = "";
  }, []);

  const idz = (n: number) => {
    const cel = Math.max(0, Math.min(KROKI.length - 1, n));
    setKrok(cel);
    setNajdalej((m) => Math.max(m, cel));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section id="cena" className="relative overflow-hidden bg-[#140c07] px-5 pb-24 pt-28 sm:px-8 sm:pb-32 sm:pt-36">
      <div className="pointer-events-none absolute -top-40 left-1/2 size-[60rem] -translate-x-1/2 rounded-full bg-sun/10 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl">
        {/* Pasek postępu */}
        <ol className="flex flex-wrap items-center gap-x-6 gap-y-3 font-mono text-[11px] uppercase tracking-[0.2em]">
          {KROKI.map((s, i) => {
            const aktywny = i === krok;
            const dostepny = i <= najdalej;
            return (
              <li key={s.id} className="flex items-center gap-3">
                <button
                  type="button"
                  disabled={!dostepny}
                  onClick={() => idz(i)}
                  aria-current={aktywny ? "step" : undefined}
                  className={`flex items-center gap-3 transition-colors duration-500 ${
                    aktywny ? "text-sun" : dostepny ? "text-foreground/80 hover:text-foreground" : "text-foreground/30"
                  }`}
                >
                  <span
                    className={`flex size-7 items-center justify-center rounded-full border text-[11px] transition-colors duration-500 ${
                      aktywny ? "border-sun bg-sun text-ink" : dostepny ? "border-foreground/40" : "border-foreground/15"
                    }`}
                  >
                    {i < krok ? "✓" : i + 1}
                  </span>
                  <span className="hidden sm:inline">{s.nazwa}</span>
                </button>
                {i < KROKI.length - 1 && <span className="hidden h-px w-6 bg-foreground/15 sm:block" />}
              </li>
            );
          })}
        </ol>

        {/* Panel kroku — klucz wymusza nowe wejście przy zmianie kroku */}
        <div key={krok} className="krok-in mt-10 min-h-[32rem]">
          <Panel krok={krok} k={k} />
        </div>

        {/* Nawigacja + bieżąca cena */}
        <div className="mt-12 flex flex-col-reverse items-stretch gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => idz(krok - 1)}
            disabled={krok === 0}
            className="cta text-base text-foreground/70 transition-colors hover:text-foreground disabled:invisible"
          >
            <span className="cta-line">← Wstecz</span>
          </button>

          <div className="flex items-center justify-between gap-6 sm:justify-end">
            {!ostatni && (
              <p className="text-sm text-foreground/60">
                Na razie:{" "}
                <strong className="font-medium text-foreground">{formatZl(k.wyliczenie.cena)}</strong>
                <span className="hidden sm:inline"> · po dotacji ok. {formatZl(k.wyliczenie.poDotacji)}</span>
              </p>
            )}
            {ostatni ? (
              <a
                href="#wycena"
                className="cta group flex items-center justify-between gap-6 rounded-full bg-sun py-2 pl-7 pr-2 text-lg font-medium text-ink transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.02]"
              >
                Zamów wycenę
                <span className="flex size-12 items-center justify-center rounded-full bg-ink text-cream transition-transform duration-500 group-hover:rotate-45">
                  <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden>
                    <path d="M4 14 14 4M6 4h8v8" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </span>
              </a>
            ) : (
              <button
                type="button"
                onClick={() => idz(krok + 1)}
                className="cta group flex items-center justify-between gap-6 rounded-full bg-cream py-2 pl-7 pr-2 text-lg font-medium text-ink transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.02]"
              >
                {krok === KROKI.length - 2 ? "Pokaż zestaw" : "Dalej"}
                <span className="flex size-12 items-center justify-center rounded-full bg-ink text-cream transition-transform duration-500 group-hover:translate-x-0.5">
                  <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden>
                    <path d="M3 9h12M10 4l5 5-5 5" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
