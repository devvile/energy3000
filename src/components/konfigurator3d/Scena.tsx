"use client";

// Scena domu w przekroju: tło (dzień / noc) + warstwy sprzętu wycięte z wariantów tej samej sceny (public/img/scena).
// Każda warstwa siedzi w dokładnie tym miejscu, w którym wyrenderował ją model, więc wjeżdża „w scenę”, a nie na nią.
// Kamera (zoom + przesunięcie) i wejścia warstw animuje GSAP; przepływ prądu to animowane ścieżki SVG.

import gsap from "gsap";
import Image from "next/image";
import { type PointerEvent, useEffect, useMemo, useRef } from "react";
import type { Stan, Wyliczenie } from "@/lib/konfigurator";
import { formatKwh } from "@/lib/konfigurator";
import { SCENA, WARSTWY, type WarstwaId } from "./warstwy";
import { WARSTWY_GARAZ, type WarstwaGarazId } from "./warstwyGaraz";

export type Kamera = "calosc" | "dach" | "garaz" | "dodatki" | "noc";
/** Plan: widok całego domu albo osobna scena garażu (zbliżenie), do której przechodzimy po zoomie. */
export type Plan = "dom" | "garaz";

const KAMERY: Record<Kamera, { s: number; fx: number; fy: number }> = {
  calosc: { s: 1, fx: 50, fy: 50 },
  dach: { s: 1.22, fx: 46, fy: 36 },
  garaz: { s: 1.9, fx: 68, fy: 53 },
  dodatki: { s: 1.18, fx: 66, fy: 58 },
  noc: { s: 1.04, fx: 50, fy: 49 },
};

const ROZMIAR_N = { s: 1, m: 2, l: 3 } as const;
// Wersja w nazwie pliku (np. panele.v2.webp): po ponownym wycięciu warstw podbij numer i zmień nazwy plików,
// bo Next trzyma zoptymalizowane obrazki w cache pod adresem pliku.
const WERSJA_WARSTW = 4;

/** Które warstwy są widoczne i jak podpisane — czysta funkcja stanu. */
export function widoczne(stan: Stan, w: Wyliczenie, pokazMagazyn: boolean, noc = false): Partial<Record<WarstwaId, string>> {
  const v: Partial<Record<WarstwaId, string>> = {};
  const maPv = stan.sytuacja !== "brak-pv";
  if (maPv) v.panele = stan.pvKwp != null ? `Panele ${formatKwh(stan.pvKwp)} kWp` : "Twoje panele";
  const magazyn = pokazMagazyn && maPv;
  // Stary falownik wisi w tym samym miejscu, w którym staje magazyn — pokazujemy go tylko, dopóki magazynu nie ma.
  if (maPv && !magazyn) v.falownik = "Twój falownik";
  if (magazyn) v[`${stan.linia}${ROZMIAR_N[stan.rozmiar]}` as WarstwaId] = `Magazyn ${w.zestaw.nazwa} · ${formatKwh(w.kwh)} kWh`;
  // Agregat i auto to łatki z otoczeniem, więc w nocy przełączamy je na wersje wycięte ze sceny nocnej.
  if (magazyn && stan.opcje.agregat) v[noc ? "agregat-noc" : "agregat"] = "Agregat";
  if (magazyn && (stan.opcje.ladowarka11 || stan.opcje.ladowarka22)) v[noc ? "auto-noc" : "auto"] = stan.opcje.ladowarka11 ? "Ładowarka 11 kW" : "Ładowarka 22 kW";
  return v;
}

/** Warstwy sceny garażu (zbliżenie): magazyn wybranej marki i wielkości oraz stary falownik. */
export function widoczneGaraz(stan: Stan, w: Wyliczenie, pokazMagazyn: boolean): Partial<Record<WarstwaGarazId, string>> {
  const v: Partial<Record<WarstwaGarazId, string>> = {};
  const maPv = stan.sytuacja !== "brak-pv";
  const magazyn = pokazMagazyn && maPv;
  if (maPv && !magazyn) v["g-falownik"] = "Twój falownik";
  if (magazyn) v[`g-${stan.linia}${ROZMIAR_N[stan.rozmiar]}` as WarstwaGarazId] = `${w.zestaw.nazwa} · ${formatKwh(w.kwh)} kWh`;
  return v;
}

type Props = {
  stan: Stan;
  wyliczenie: Wyliczenie;
  kamera: Kamera;
  plan: Plan;
  noc: boolean;
  /** Od kroku „Marka” magazyn jest w scenie. */
  pokazMagazyn: boolean;
  /** Krótka animacja „awarii”: dom na zasilaniu z magazynu (przy opcji „cały dom”). */
  awaria?: boolean;
  className?: string;
};

export function Scena({ stan, wyliczenie, kamera, plan, noc, pokazMagazyn, awaria, className = "" }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const planRef = useRef<HTMLDivElement>(null);
  const elsG = useRef<Partial<Record<WarstwaGarazId, HTMLDivElement>>>({});
  const poprzednieG = useRef<Set<WarstwaGarazId>>(new Set());
  const visG = useMemo(() => widoczneGaraz(stan, wyliczenie, pokazMagazyn), [stan, wyliczenie, pokazMagazyn]);

  // Plan garażu: pojawia się pod koniec zoomu kamery (przenikanie + lekkie dojście skali), znika razem z odjazdem.
  useEffect(() => {
    const el = planRef.current;
    if (!el) return;
    gsap.killTweensOf(el);
    if (plan === "garaz") gsap.fromTo(el, { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, duration: 1.2, delay: 0.9, ease: "power2.out" });
    else gsap.to(el, { opacity: 0, scale: 1.04, duration: 0.8, ease: "power2.in" });
  }, [plan]);

  useEffect(() => {
    const teraz = new Set(Object.keys(visG) as WarstwaGarazId[]);
    for (const id of Object.keys(WARSTWY_GARAZ) as WarstwaGarazId[]) {
      const el = elsG.current[id];
      if (!el) continue;
      const bylo = poprzednieG.current.has(id);
      const jest = teraz.has(id);
      if (jest && !bylo) {
        gsap.killTweensOf(el);
        gsap.fromTo(el, { opacity: 0, scale: 0.9, y: 18 }, { opacity: 1, scale: 1, y: 0, duration: 1.1, delay: 0.35, ease: "expo.out", overwrite: true });
        const glow = el.querySelector<HTMLElement>("[data-glow]");
        if (glow) gsap.fromTo(glow, { opacity: 0.9, scale: 0.3 }, { opacity: 0, scale: 2.2, duration: 1.4, delay: 0.35, ease: "power2.out" });
      } else if (!jest && bylo) {
        gsap.to(el, { opacity: 0, scale: 0.96, duration: 0.3, ease: "power2.in", overwrite: true });
      }
    }
    poprzednieG.current = teraz;
  }, [visG]);
  const tilt = useRef<HTMLDivElement>(null);
  const kam = useRef<HTMLDivElement>(null);
  const nocRef = useRef<HTMLDivElement>(null);
  const warstwyRef = useRef<HTMLDivElement>(null);
  const etykiety = useRef<HTMLDivElement>(null);
  const els = useRef<Partial<Record<WarstwaId, HTMLDivElement>>>({});
  const poprzednie = useRef<Set<WarstwaId>>(new Set());

  const vis = useMemo(() => widoczne(stan, wyliczenie, pokazMagazyn, noc), [stan, wyliczenie, pokazMagazyn, noc]);
  const magazynId = Object.keys(vis).find((k) => /^(deye|fox)\d$/.test(k)) as WarstwaId | undefined;

  // Kamera: zoom na punkt sceny (origin w środku, przesunięcie w procentach). Podpisy skalują się odwrotnie,
  // żeby przy zbliżeniu nie rosły razem ze sceną.
  useEffect(() => {
    const k = KAMERY[kamera];
    // Na telefonie scena jest wąska, więc dom byłby mały — kamera stoi bliżej (tło sceny i tak jest jednolite).
    const blizej = window.matchMedia("(max-width: 639px)").matches ? 1.3 : 1;
    const s = k.s * blizej;
    gsap.to(kam.current, { scale: s, xPercent: (50 - k.fx) * s, yPercent: (50 - k.fy) * s, duration: 1.8, ease: "expo.inOut" });
    gsap.to(etykiety.current?.children ?? [], { scale: 1 / s, duration: 1.8, ease: "expo.inOut" });
  }, [kamera]);

  // Noc: przenikanie tła, lekkie przyciemnienie warstw dziennych
  useEffect(() => {
    gsap.to(nocRef.current, { opacity: noc ? 1 : 0, duration: 2.4, ease: "power2.inOut" });
    gsap.to(warstwyRef.current, { filter: noc ? "brightness(0.82) saturate(0.9)" : "brightness(1) saturate(1)", duration: 2.4 });
  }, [noc]);

  // Wejścia / zejścia warstw + poświata przy pojawieniu
  useEffect(() => {
    const teraz = new Set(Object.keys(vis) as WarstwaId[]);
    for (const id of Object.keys(WARSTWY) as WarstwaId[]) {
      const el = els.current[id];
      if (!el) continue;
      const bylo = poprzednie.current.has(id);
      const jest = teraz.has(id);
      // Najpierw znika to, co ma zniknąć (szybko), dopiero potem wjeżdża nowe — żeby stary falownik i magazyn
      // nie nakładały się na siebie w trakcie przejścia.
      if (jest && !bylo) {
        gsap.killTweensOf(el);
        gsap.fromTo(el, { opacity: 0, scale: 0.86, y: 14 }, { opacity: 1, scale: 1, y: 0, duration: 1.1, delay: 0.35, ease: "expo.out", overwrite: true });
        const glow = el.querySelector<HTMLElement>("[data-glow]");
        if (glow) gsap.fromTo(glow, { opacity: 0.9, scale: 0.3 }, { opacity: 0, scale: 2.4, duration: 1.4, delay: 0.35, ease: "power2.out" });
      } else if (!jest && bylo) {
        gsap.to(el, { opacity: 0, scale: 0.96, duration: 0.3, ease: "power2.in", overwrite: true });
      }
    }
    poprzednie.current = teraz;
  }, [vis]);

  // Parallaks za kursorem (tylko wskaźnik precyzyjny)
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !root.current) return;
    const r = root.current.getBoundingClientRect();
    const dx = (e.clientX - r.left) / r.width - 0.5;
    const dy = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(tilt.current, { rotateY: dx * 6, rotateX: -dy * 5, x: dx * 14, y: dy * 10, duration: 1.2, ease: "power2.out" });
  };
  const onLeave = () => gsap.to(tilt.current, { rotateY: 0, rotateX: 0, x: 0, y: 0, duration: 1.4, ease: "power2.out" });

  const pokazPrzeplywNoc = noc || !!awaria;
  const pokazPrzeplywDzien = !noc && !!magazynId && !!vis.panele;

  return (
    <div
      ref={root}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`relative overflow-hidden ${className}`}
      style={{ aspectRatio: `${SCENA.szerokosc} / ${SCENA.wysokosc}`, perspective: "1400px" }}
    >
      <div ref={tilt} className="absolute inset-0 will-change-transform" style={{ transformStyle: "preserve-3d" }}>
        <div ref={kam} className="absolute inset-0 will-change-transform">
          <Image src="/img/scena/scena-dzien.webp" alt="Dom w przekroju z garażem, w świetle zachodzącego słońca" fill priority sizes="100vw" className="object-cover" />
          <div ref={nocRef} className="absolute inset-0 opacity-0">
            <Image src="/img/scena/scena-noc.webp" alt="" fill sizes="100vw" className="object-cover" />
          </div>

          {/* Warstwy sprzętu */}
          <div ref={warstwyRef} className="absolute inset-0">
            {(Object.keys(WARSTWY) as WarstwaId[]).map((id) => {
              const p = WARSTWY[id];
              return (
                <div
                  key={id}
                  ref={(el) => {
                    if (el) els.current[id] = el;
                  }}
                  className="absolute opacity-0"
                  style={{ left: `${p.x}%`, top: `${p.y}%`, width: `${p.w}%`, height: `${p.h}%` }}
                >
                  <div className="relative size-full">
                    <Image src={`/img/scena/${id}.v${WERSJA_WARSTW}.webp`} alt="" fill sizes="60vw" className="object-fill" />
                  </div>
                  <div
                    data-glow
                    className="pointer-events-none absolute left-1/2 top-1/2 size-[140%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0"
                    style={{ background: "radial-gradient(circle, rgba(255,159,69,0.75) 0%, rgba(255,159,69,0) 65%)" }}
                  />
                </div>
              );
            })}
          </div>

          {/* Przepływ prądu */}
          <svg viewBox={`0 0 ${SCENA.szerokosc} ${SCENA.wysokosc}`} className="pointer-events-none absolute inset-0 size-full" aria-hidden>
            <defs>
              <filter id="glow3d">
                <feGaussianBlur stdDeviation="6" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <g className={`przeplyw transition-opacity duration-1000 ${pokazPrzeplywDzien ? "opacity-100" : "opacity-0"}`} filter="url(#glow3d)">
              <path d="M 900 250 C 1120 300, 1260 420, 1345 540" />
            </g>
            <g className={`przeplyw transition-opacity duration-1000 ${pokazPrzeplywNoc ? "opacity-100" : "opacity-0"}`} filter="url(#glow3d)">
              <path d="M 1345 560 C 1180 660, 900 610, 560 530" />
              <path d="M 1345 560 C 1180 560, 980 500, 830 440" />
              {(vis.agregat || vis["agregat-noc"]) && <path d="M 1660 600 C 1560 590, 1460 575, 1385 565" />}
            </g>
          </svg>

          {/* Podpisy przy sprzęcie (origin na dole, w punkcie kotwicy) */}
          <div ref={etykiety} className="absolute inset-0">
            {(Object.keys(WARSTWY) as WarstwaId[]).map((id) => {
              const p = WARSTWY[id];
              const txt = vis[id];
              const gora = id === "panele" || id === "falownik";
              // Auto stoi w garażu pod magazynem — jego podpis wisi pod autem, żeby nie nachodził na podpis magazynu.
              const dol = id === "auto" || id === "auto-noc";
              return (
                <div
                  key={`l-${id}`}
                  className={`pointer-events-none absolute hidden -translate-x-1/2 items-center transition-[opacity,translate] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] sm:flex ${
                    dol ? "origin-top flex-col-reverse" : "-translate-y-full origin-bottom flex-col"
                  } ${txt ? "opacity-100" : "opacity-0"}`}
                  style={{
                    left: `${p.x + p.w / 2}%`,
                    top: `${dol ? p.y + p.h - 3 : gora ? p.y + p.h * 0.12 : p.y - 0.5}%`,
                  }}
                >
                  <span className="whitespace-nowrap rounded-full border border-white/15 bg-[#140c07]/80 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/90 backdrop-blur-md">
                    {txt}
                  </span>
                  <span className={`size-1.5 rounded-full bg-sun shadow-[0_0_12px_2px_rgba(255,159,69,0.9)] ${dol ? "mb-1" : "mt-1"}`} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Plan garażu: osobna scena ze zbliżeniem, własne warstwy magazynów */}
        <div ref={planRef} className="pointer-events-none absolute inset-0 opacity-0 will-change-transform">
          <Image src="/img/garaz/garaz.webp" alt="Wnętrze garażu z tylną ścianą na magazyn energii" fill sizes="100vw" className="object-cover" />
          {(Object.keys(WARSTWY_GARAZ) as WarstwaGarazId[]).map((id) => {
            const p = WARSTWY_GARAZ[id];
            return (
              <div
                key={id}
                ref={(el) => {
                  if (el) elsG.current[id] = el;
                }}
                className="absolute opacity-0"
                style={{ left: `${p.x}%`, top: `${p.y}%`, width: `${p.w}%`, height: `${p.h}%` }}
              >
                <Image src={`/img/garaz/${id}.webp`} alt="" fill sizes="60vw" className="object-fill" />
                <div
                  data-glow
                  className="pointer-events-none absolute left-1/2 top-1/2 size-[130%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0"
                  style={{ background: "radial-gradient(circle, rgba(255,159,69,0.7) 0%, rgba(255,159,69,0) 65%)" }}
                />
              </div>
            );
          })}
          {(Object.keys(WARSTWY_GARAZ) as WarstwaGarazId[]).map((id) => {
            const p = WARSTWY_GARAZ[id];
            const txt = visG[id];
            return (
              <div
                key={`gl-${id}`}
                className={`pointer-events-none absolute hidden -translate-x-1/2 -translate-y-full flex-col items-center transition-[opacity,translate] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] sm:flex ${
                  txt ? "opacity-100" : "opacity-0"
                }`}
                style={{ left: `${p.x + p.w / 2}%`, top: `${p.y - 1}%` }}
              >
                <span className="whitespace-nowrap rounded-full border border-white/15 bg-[#140c07]/80 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/90 backdrop-blur-md">
                  {txt}
                </span>
                <span className="mt-1 size-1.5 rounded-full bg-sun shadow-[0_0_12px_2px_rgba(255,159,69,0.9)]" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Winieta: scena wtapia się w tło strony. Na telefonie wąska, bo stała szerokość zalewałaby cały obrazek. */}
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_28px_6px_#140c07] sm:shadow-[inset_0_0_90px_30px_#140c07] lg:shadow-[inset_0_0_160px_60px_#140c07]" />
    </div>
  );
}
