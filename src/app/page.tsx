import type { CSSProperties } from "react";
import Link from "next/link";
import { Countdown } from "@/components/Countdown";
import { HeroVideo } from "@/components/HeroVideo";
import { Intro } from "@/components/Intro";

const EMAIL = "biuro@energy3000.pl";

const facts = [
  { label: "Nabór PME2 startuje za", value: <Countdown /> },
  { label: "Zakres", value: "Magazyny 10–20 kWh" },
  { label: "Usługa", value: "Dobór · montaż · wniosek o dotację" },
  { label: "Region", value: "Kielce + 100 km" },
];

// Opóźnienie animacji wejścia (zmienna --d w globals.css)
const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export default function Home() {
  return (
    <>
      <Intro />

      <main className="relative isolate flex flex-1 flex-col overflow-hidden bg-[#140c07] text-foreground md:min-h-svh md:bg-transparent">
        {/* Tło: wideo + ciepłe warstwy pod czytelność tekstu.
            Na telefonie tylko na pierwszy ekran — fakty są niżej, na ciemnym tle. */}
        <div className="absolute inset-x-0 top-0 -z-10 h-svh overflow-hidden md:inset-0 md:h-auto">
          <HeroVideo />
          <div className="absolute inset-0 hidden bg-gradient-to-r from-[#2a160a]/55 via-[#2a160a]/20 to-transparent md:block" />
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#1d2436]/35 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-[#140c07] via-[#140c07]/70 to-transparent md:h-2/5 md:from-[#140c07]/80 md:via-[#140c07]/30" />
          <div className="grain pointer-events-none absolute -inset-[50%] opacity-[0.05] mix-blend-overlay" />
        </div>

        <div className="flex min-h-svh flex-col md:min-h-0 md:flex-1">
          {/* Górny pasek */}
          <header className="fade flex items-center justify-between px-5 pt-5 sm:px-8 sm:pt-7" style={delay(150)}>
            <Link href="/" className="flex items-baseline gap-0.5 text-[15px] font-semibold tracking-tight">
              ENERGY<span className="font-serif text-xl font-normal italic">3000</span>
            </Link>
            <span className="flex items-center gap-2.5 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-xs font-medium text-foreground/90 backdrop-blur-md">
              <span className="relative flex size-1.5">
                <span className="ping-soft absolute inset-0 rounded-full bg-led" />
                <span className="relative size-1.5 rounded-full bg-led" />
              </span>
              Strona w budowie
            </span>
          </header>

          {/* Hero — na telefonie przy dolnej krawędzi, na desktopie na środku */}
          <section className="flex flex-1 flex-col justify-end px-5 pb-10 pt-14 sm:px-8 md:justify-center md:py-14 [text-shadow:0_1px_24px_rgba(40,18,6,0.25)]">
            <p className="fade mb-5 flex items-center gap-3 text-sm font-medium text-foreground/85 sm:mb-8" style={delay(100)}>
              <span className="h-px w-8 bg-foreground/60" />
              Magazyn energii do Twojej fotowoltaiki
            </p>

            <h1 className="text-[clamp(3.4rem,7.4vw,8.5rem)] font-medium leading-[0.9] tracking-[-0.05em]">
              <span className="reveal block">
                <span style={delay(0)}>Słońce za dnia.</span>
              </span>
              <span className="reveal block">
                <span style={delay(110)}>
                  Prąd{" "}
                  <em className="pr-[0.08em] font-serif font-normal italic tracking-[-0.01em]">
                    na noc.
                  </em>
                </span>
              </span>
            </h1>

            <p className="fade mt-6 max-w-[34rem] text-[15px] leading-relaxed text-foreground/90 sm:mt-10 sm:text-lg" style={delay(400)}>
              Dokładamy magazyn do instalacji, którą już masz. Dobieramy sprzęt,
              montujemy i&nbsp;składamy za Ciebie wniosek o&nbsp;dotację z&nbsp;programu
              Przydomowe Magazyny Energii. Pełna strona startuje wkrótce.
            </p>

            <div className="fade mt-8 sm:mt-12" style={delay(550)}>
              <a
                href={`mailto:${EMAIL}`}
                className="cta group inline-flex items-center gap-3 rounded-full bg-cream py-2 pl-2 pr-6 text-base font-medium tracking-tight text-ink shadow-[0_10px_40px_-10px_rgba(40,18,6,0.5)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] [text-shadow:none] hover:scale-[1.03] sm:text-lg"
              >
                <span className="flex size-10 items-center justify-center rounded-full bg-sun text-ink transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-45 sm:size-11">
                  <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden>
                    <path d="M4 14 14 4M6 4h8v8" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </span>
                <span className="cta-line pb-0.5">{EMAIL}</span>
              </a>
            </div>
          </section>
        </div>

        {/* Dolny pasek z faktami */}
        <footer className="grid grid-cols-2 gap-x-5 gap-y-6 border-t border-white/15 bg-black/10 px-5 py-6 backdrop-blur-md sm:px-8 md:grid-cols-4">
          {facts.map((fact, i) => (
            <div key={fact.label} className="fade" style={delay(650 + i * 90)}>
              <p className="mb-1.5 text-xs text-foreground/60">{fact.label}</p>
              <p className="text-sm font-medium text-foreground sm:text-base">{fact.value}</p>
            </div>
          ))}
        </footer>
      </main>
    </>
  );
}
