"use client";

import Image from "next/image";
import { useCallback, useRef } from "react";
import { range, useScrollProgress } from "@/lib/useScrollProgress";

const PHASES = [
  {
    from: 0,
    to: 0.3,
    kicker: "Przed południem",
    title: "Panele produkują więcej, niż dom zużywa.",
    body: "Zamiast oddawać nadwyżkę do sieci za grosze, ładujesz nią własny magazyn.",
    flow: "Panele → magazyn",
  },
  {
    from: 0.3,
    to: 0.62,
    kicker: "Zachód słońca",
    title: "Magazyn jest pełny.",
    body: "Wieczorny szczyt zużycia: gotowanie, pranie, światło. Prąd czeka na ścianie.",
    flow: "Magazyn pełny",
  },
  {
    from: 0.62,
    to: 1.01,
    kicker: "Noc",
    title: "Dom zasilany słońcem z dnia.",
    body: "Przy awarii sieci lodówka, piec, światło i internet działają dalej.",
    flow: "Magazyn → dom",
  },
];

// Sekwencja przewijana: ten sam kadr w południe, o zachodzie i w nocy, a magazyn ładuje się i oddaje prąd
export function DayNight() {
  const section = useRef<HTMLElement>(null);
  const sunset = useRef<HTMLDivElement>(null);
  const night = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const clock = useRef<HTMLSpanElement>(null);
  const pct = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const flow = useRef<HTMLSpanElement>(null);
  const captions = useRef<(HTMLDivElement | null)[]>([]);

  const onProgress = useCallback((p: number) => {
    if (sunset.current) sunset.current.style.opacity = String(range(p, 0.24, 0.38));
    if (night.current) night.current.style.opacity = String(range(p, 0.56, 0.7));
    if (stage.current) stage.current.style.transform = `scale(${1.12 - p * 0.12})`;

    // Zegar dopasowany do kadrów: przedpołudnie 9:30–14:00, zachód 18:30–20:00, noc 21:00–23:30
    const minutes =
      p < 0.3
        ? 570 + range(p, 0, 0.3) * 270
        : p < 0.62
          ? 1110 + range(p, 0.3, 0.62) * 90
          : 1260 + range(p, 0.62, 1) * 150;
    if (clock.current) {
      const h = Math.floor(minutes / 60);
      const m = Math.floor((minutes % 60) / 5) * 5;
      clock.current.textContent = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    }

    // Poziom naładowania: 18% → 100% do zachodu, potem rozładowanie do 42%
    const charge = p < 0.55 ? 18 + range(p, 0, 0.5) * 82 : 100 - range(p, 0.62, 1) * 58;
    if (pct.current) pct.current.textContent = String(Math.round(charge));
    if (bar.current) bar.current.style.transform = `scaleY(${charge / 100})`;

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
  }, []);

  useScrollProgress(section, onProgress);

  const img = "object-cover object-[72%_center] md:object-center";

  return (
    <section ref={section} id="jak-dziala" className="relative h-[460svh] bg-[#140c07]">
      <div className="sticky top-0 h-svh overflow-hidden">
        <div ref={stage} className="absolute inset-0 will-change-transform" style={{ transform: "scale(1.12)" }}>
          <Image src="/img/day.webp" alt="Magazyn energii na ścianie domu w słoneczny dzień" fill sizes="100vw" className={img} />
          <div ref={sunset} className="absolute inset-0" style={{ opacity: 0 }}>
            <Image src="/img/sunset.webp" alt="" fill sizes="100vw" className={img} />
          </div>
          <div ref={night} className="absolute inset-0" style={{ opacity: 0 }}>
            <Image src="/img/night.webp" alt="Ten sam dom w nocy, magazyn świeci na zielono" fill sizes="100vw" className={img} />
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-[#140c07]/90 via-[#140c07]/10 to-[#140c07]/30 md:bg-gradient-to-r md:from-[#140c07]/80 md:via-[#140c07]/20 md:to-transparent" />

        {/* Zegar */}
        <div className="absolute left-5 top-24 sm:left-8 sm:top-28">
          <span ref={clock} className="font-mono text-[clamp(2.4rem,6vw,5rem)] font-light tabular-nums tracking-tight text-foreground/95">
            09:30
          </span>
        </div>

        {/* Wskaźnik magazynu */}
        <div className="absolute right-5 top-24 flex items-end gap-4 sm:right-8 sm:top-28">
          <div className="text-right">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/60">Magazyn</p>
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

        {/* Podpisy faz */}
        <div className="absolute inset-x-5 bottom-24 sm:inset-x-8 md:bottom-auto md:top-1/2 md:max-w-xl md:-translate-y-1/2">
          <div className="relative min-h-[15rem]">
            {PHASES.map((ph, i) => (
              <div
                key={ph.kicker}
                ref={(el) => {
                  captions.current[i] = el;
                }}
                className="absolute inset-x-0 bottom-0 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] md:bottom-auto md:top-0"
                style={{ opacity: i === 0 ? 1 : 0 }}
              >
                <p className="mb-4 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-sun">
                  <span className="h-px w-8 bg-sun" />
                  {ph.kicker}
                </p>
                <h3 className="text-[clamp(2rem,4.4vw,3.8rem)] font-medium leading-[1] tracking-[-0.04em]">{ph.title}</h3>
                <p className="mt-5 max-w-md text-base leading-relaxed text-foreground/85 sm:text-lg">{ph.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
