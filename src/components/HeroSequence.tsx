"use client";

import Image from "next/image";
import { type CSSProperties, type ReactNode, useCallback, useRef } from "react";
import { PAKIETY, PHONE, PHONE_HREF, zl } from "@/lib/oferta";
import { range, useScrollProgress } from "@/lib/useScrollProgress";

const PHASES = [
  {
    from: 0.16,
    to: 0.4,
    title: "Panele dają więcej prądu, niż zużywa dom.",
    body: "Zamiast oddawać nadwyżkę do sieci za grosze, ładujesz nią magazyn.",
    flow: "Panele → magazyn",
  },
  {
    from: 0.4,
    to: 0.64,
    title: "Słońce zachodzi, a magazyn jest pełny.",
    body: "Wracasz do domu, gotujesz, pierzesz, zapalasz światło. Prąd z południa już na Ciebie czeka.",
    flow: "Magazyn pełny",
  },
  {
    from: 0.64,
    to: 0.84,
    title: "Dom działa na prądzie z dnia.",
    body: "A gdy w okolicy wyłączą prąd, lodówka, piec i internet działają dalej.",
    flow: "Magazyn → dom",
  },
];

const standard = PAKIETY.find((p) => p.featured) ?? PAKIETY[0];
const afterSubsidy = standard.price - standard.subsidy;

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

// Hero przypięty do ekranu: przewijanie odtwarza dzień → zachód → noc, magazyn ładuje się i oddaje prąd.
// Kolejne sekcje pojawiają się dopiero po obejrzeniu całej sekwencji (od 29.10 krótszej: 380svh zamiast 520svh).
export function HeroSequence({ facts }: { facts: { label: string; value: ReactNode }[] }) {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const sunset = useRef<HTMLDivElement>(null);
  const night = useRef<HTMLDivElement>(null);
  const shade = useRef<HTMLDivElement>(null);
  const intro = useRef<HTMLDivElement>(null);
  const hint = useRef<HTMLDivElement>(null);
  const hud = useRef<HTMLDivElement>(null);
  const clock = useRef<HTMLSpanElement>(null);
  const pct = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const flow = useRef<HTMLSpanElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  const outro = useRef<HTMLDivElement>(null);
  const captions = useRef<(HTMLDivElement | null)[]>([]);

  const onProgress = useCallback((p: number) => {
    // Kadry
    if (sunset.current) sunset.current.style.opacity = String(range(p, 0.34, 0.46));
    if (night.current) night.current.style.opacity = String(range(p, 0.58, 0.7));
    if (stage.current) stage.current.style.transform = `scale(${1.1 - p * 0.1})`;
    if (shade.current) shade.current.style.opacity = String(1 - range(p, 0.08, 0.2) * 0.5);

    // Tekst hero znika na początku przewijania
    const out = range(p, 0.04, 0.15);
    if (intro.current) {
      intro.current.style.opacity = String(1 - out);
      intro.current.style.transform = `translateY(${out * -60}px)`;
      intro.current.style.pointerEvents = out > 0.5 ? "none" : "";
    }
    if (hint.current) hint.current.style.opacity = String(1 - range(p, 0, 0.05));

    // Zegar i wskaźnik magazynu
    const hudIn = range(p, 0.12, 0.2) * (1 - range(p, 0.86, 0.92));
    if (hud.current) hud.current.style.opacity = String(hudIn);
    const minutes =
      p < 0.4
        ? 570 + range(p, 0.16, 0.4) * 270
        : p < 0.64
          ? 1110 + range(p, 0.4, 0.64) * 90
          : 1260 + range(p, 0.64, 0.86) * 150;
    if (clock.current) {
      const h = Math.floor(minutes / 60);
      const m = Math.floor((minutes % 60) / 5) * 5;
      clock.current.textContent = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    }
    const charge = p < 0.6 ? 18 + range(p, 0.16, 0.55) * 82 : 100 - range(p, 0.64, 0.86) * 58;
    if (pct.current) pct.current.textContent = String(Math.round(charge));
    if (bar.current) bar.current.style.transform = `scaleY(${charge / 100})`;
    if (progress.current) progress.current.style.transform = `scaleX(${range(p, 0.12, 0.92)})`;

    let active = 0;
    PHASES.forEach((ph, i) => {
      const on = p >= ph.from && p < ph.to;
      if (on) active = i;
      const el = captions.current[i];
      if (el) {
        el.style.opacity = on ? "1" : "0";
        el.style.transform = on ? "none" : p < ph.from ? "translateY(32px)" : "translateY(-32px)";
      }
    });
    if (flow.current) flow.current.textContent = PHASES[active].flow;

    // Finał w nocy: wezwanie do wyceny
    const fin = range(p, 0.86, 0.94);
    if (outro.current) {
      outro.current.style.opacity = String(fin);
      outro.current.style.transform = `translateY(${(1 - fin) * 40}px)`;
      outro.current.style.pointerEvents = fin > 0.5 ? "" : "none";
    }
  }, []);

  useScrollProgress(section, onProgress);

  const img = "object-cover object-[72%_center] md:object-center";

  return (
    <section ref={section} className="relative h-[380svh] bg-[#140c07] text-foreground">
      <div className="sticky top-0 h-svh overflow-hidden">
        {/* Kadry: dzień, zachód, noc — ten sam dom */}
        <div ref={stage} className="absolute inset-0 will-change-transform" style={{ transform: "scale(1.1)" }}>
          <Image src="/img/day.webp" alt="Magazyn energii na ścianie domu w słoneczny dzień" fill priority sizes="100vw" className={img} />
          <div ref={sunset} className="absolute inset-0" style={{ opacity: 0 }}>
            <Image src="/img/sunset.webp" alt="" fill sizes="100vw" className={img} />
          </div>
          <div ref={night} className="absolute inset-0" style={{ opacity: 0 }}>
            <Image src="/img/night.webp" alt="Ten sam dom w nocy, magazyn świeci na zielono" fill sizes="100vw" className={img} />
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-[#140c07]/90 via-[#140c07]/10 to-[#140c07]/30 md:bg-gradient-to-r md:from-[#140c07]/75 md:via-[#140c07]/15 md:to-transparent" />
        <div ref={shade} className="absolute inset-0 bg-gradient-to-t from-[#140c07]/70 via-transparent to-transparent" />
        <div className="grain pointer-events-none absolute -inset-[50%] opacity-[0.05] mix-blend-overlay" />

        {/* 1. Hero */}
        <div ref={intro} className="absolute inset-0 flex flex-col will-change-transform">
          <div className="flex flex-1 flex-col justify-end px-5 pb-8 pt-28 sm:px-8 md:justify-center md:pb-28 [text-shadow:0_1px_24px_rgba(20,12,7,0.35)]">
            {/* Fraza „magazyn energii” jest częścią H1 (SEO), wizualnie jako mała linia nad hasłem. */}
            <h1 className="text-[clamp(3.4rem,7.4vw,8.5rem)] font-medium leading-[0.9] tracking-[-0.05em]">
              <span className="fade mb-5 block text-base font-medium leading-normal tracking-normal text-foreground/90 sm:mb-8" style={delay(100)}>
                Magazyn energii do paneli, które już masz
              </span>
              <span className="reveal block">
                <span style={delay(0)}>Słońce za dnia.</span>
              </span>
              <span className="reveal block">
                <span style={delay(110)}>
                  Prąd <em className="pr-[0.08em] font-serif font-normal italic tracking-[-0.01em]">na noc.</em>
                </span>
              </span>
            </h1>
            {/* Bez animacji wejścia: ten akapit to największy element pierwszego ekranu na telefonie (LCP). */}
            <p className="mt-6 max-w-[36rem] text-[15px] leading-relaxed text-foreground/90 sm:mt-10 sm:text-lg">
              Dobieramy magazyn do Twojej fotowoltaiki, montujemy go w&nbsp;jeden dzień i&nbsp;pomagamy załatwić
              dotację do magazynu (program Przydomowe Magazyny Energii). Cenę znasz od razu, bez wizyty handlowca.
            </p>
            <div className="fade mt-8 flex flex-wrap items-center gap-4 sm:mt-12 sm:gap-6" style={delay(550)}>
              <a
                href="#cena"
                className="cta group inline-flex items-center gap-3 rounded-full bg-cream py-2 pl-2 pr-6 text-base font-medium tracking-tight text-ink shadow-[0_10px_40px_-10px_rgba(40,18,6,0.5)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] [text-shadow:none] hover:scale-[1.03] sm:text-lg"
              >
                <span className="flex size-10 items-center justify-center rounded-full bg-sun text-ink transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-45 sm:size-11">
                  <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden>
                    <path d="M4 14 14 4M6 4h8v8" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </span>
                <span className="cta-line pb-0.5">Sprawdź, ile dostaniesz dotacji</span>
              </a>
              <a href={PHONE_HREF} className="cta text-base font-medium text-foreground/90 sm:text-lg">
                lub zadzwoń: <span className="cta-line tabular-nums">{PHONE}</span>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-5 gap-y-5 border-t border-white/15 bg-black/15 px-5 py-5 backdrop-blur-md sm:px-8 md:grid-cols-4 md:py-6">
            {facts.map((fact, i) => (
              // Na telefonie tylko cena i cena po dotacji (środkowe pozycje), żeby hero mieściło się na ekranie
              <div key={fact.label} className={`fade ${i === 0 || i === 3 ? "hidden md:block" : ""}`} style={delay(650 + i * 90)}>
                <p className="mb-1.5 text-xs text-foreground/60">{fact.label}</p>
                <p className="text-sm font-medium text-foreground sm:text-base">{fact.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Podpowiedź: przewiń */}
        <div ref={hint} aria-hidden className="fade absolute right-5 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-3 sm:right-8 md:flex" style={delay(900)}>
          <span className="relative h-16 w-px overflow-hidden bg-white/20">
            <span className="scroll-cue absolute inset-x-0 top-0 h-6 bg-foreground" />
          </span>
        </div>

        {/* 2. Zegar, wskaźnik magazynu, pasek postępu */}
        <div ref={hud} className="pointer-events-none absolute inset-0" style={{ opacity: 0 }}>
          <div className="absolute left-5 top-24 sm:left-8 sm:top-28">
            <span ref={clock} className="text-[clamp(2.4rem,6vw,5rem)] font-light tabular-nums tracking-[-0.03em] text-foreground/95">
              09:30
            </span>
          </div>
          <div className="absolute right-5 top-24 flex items-end gap-4 sm:right-8 sm:top-28">
            <div className="text-right">
              <p className="text-sm text-foreground/70">Magazyn</p>
              <p className="mt-1 text-4xl font-medium tabular-nums tracking-tight sm:text-5xl">
                <span ref={pct}>18</span>
                <span className="font-serif text-2xl italic text-led sm:text-3xl">%</span>
              </p>
              <span ref={flow} className="mt-1 block text-xs text-foreground/70">
                Panele → magazyn
              </span>
            </div>
            <div className="relative h-28 w-5 overflow-hidden rounded-full border border-white/30 bg-white/10 backdrop-blur-md sm:h-36">
              <div
                ref={bar}
                className="absolute inset-x-0 bottom-0 h-full origin-bottom rounded-full bg-led shadow-[0_0_18px_var(--led)]"
                style={{ transform: "scaleY(0.18)" }}
              />
            </div>
          </div>
          <div className="absolute inset-x-5 bottom-8 h-px bg-white/15 sm:inset-x-8">
            <div ref={progress} className="h-px origin-left bg-sun" style={{ transform: "scaleX(0)" }} />
          </div>
        </div>

        {/* 3. Podpisy faz */}
        <div className="pointer-events-none absolute inset-x-5 bottom-24 sm:inset-x-8 md:bottom-auto md:top-1/2 md:max-w-2xl md:-translate-y-1/2">
          <div className="relative min-h-[15rem]">
            {PHASES.map((ph, i) => (
              <div
                key={ph.title}
                ref={(el) => {
                  captions.current[i] = el;
                }}
                className="absolute inset-x-0 bottom-0 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none md:bottom-auto md:top-0"
                style={{ opacity: 0, transform: "translateY(32px)" }}
              >
                <h2 className="text-[clamp(2rem,4.4vw,3.8rem)] font-medium leading-[1] tracking-[-0.04em]">{ph.title}</h2>
                <p className="mt-5 max-w-md text-base leading-relaxed text-foreground/85 sm:text-lg">{ph.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Finał w nocy */}
        <div
          ref={outro}
          className="absolute inset-x-5 bottom-24 sm:inset-x-8 md:bottom-auto md:top-1/2 md:max-w-2xl md:-translate-y-1/2"
          style={{ opacity: 0, pointerEvents: "none" }}
        >
          <p className="text-[clamp(2.8rem,6.4vw,6.4rem)] font-medium leading-[0.92] tracking-[-0.05em]">
            Prąd <em className="font-serif font-normal italic">na noc</em>
            <br />
            od {zl(afterSubsidy)}.
          </p>
          <p className="mt-5 max-w-md text-base leading-relaxed text-foreground/80 sm:text-lg">
            Tyle zostaje po zwrocie dotacji za magazyn {standard.kwh} kWh z montażem. Cena przed dotacją:{" "}
            {zl(standard.price)}.
          </p>
          <a
            href="#cena"
            className="mt-8 inline-flex items-center gap-3 rounded-full bg-sun px-7 py-4 text-base font-medium text-ink transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.03]"
          >
            Zamów bezpłatną wycenę <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
