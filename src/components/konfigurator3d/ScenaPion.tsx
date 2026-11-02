"use client";

// Scena na telefon: pionowy kadr domu (osobne grafiki z Higgsfielda, public/img/pion) na ~60% ekranu, od krawędzi
// do krawędzi. Ta sama logika co w Scena.tsx (które warstwy widać, kamera na krok, noc, przepływ prądu), ale:
// - dom jest pionowy, więc wypełnia ekran telefonu zamiast być poziomą miniaturą,
// - kroki „Marka” i „Wielkość” pokazują to samo zbliżenie ściany garażu co desktop, wykadrowane pionowo na sprzęt,
// - bez podpisów przy sprzęcie (na wąskim ekranie zasłaniały scenę) i bez paralaksy.

import gsap from "gsap";
import Image from "next/image";
import { useEffect, useMemo, useRef } from "react";
import type { Stan, Wyliczenie } from "@/lib/konfigurator";
import { srodekSprzetu, widoczne, widoczneGaraz, type Kamera, type Plan } from "./Scena";
import { GARAZ, WARSTWY_GARAZ, type WarstwaGarazId } from "./warstwyGaraz";
import { PION, WARSTWY_PION, type WarstwaPionId } from "./warstwyPion";

/** Kamera w pionowym kadrze: skala i punkt sceny (w % obrazu domu), który trafia na środek ekranu. */
const KAMERY: Record<Kamera, { s: number; fx: number; fy: number }> = {
  calosc: { s: 1, fx: 51, fy: 55 },
  dach: { s: 1.3, fx: 44, fy: 42 },
  garaz: { s: 2.4, fx: 80, fy: 56 },
  dodatki: { s: 1.45, fx: 66, fy: 58 },
  noc: { s: 1.12, fx: 52, fy: 52 },
};

const MAGAZYNY = new Set<WarstwaPionId>(["deye1", "deye2", "deye3", "fox1", "fox2", "fox3", "falownik"]);

/** Widoczne warstwy pionowej sceny: te same decyzje co w widoku domu na desktopie, bez osobnych łatek nocnych. */
function widocznePion(stan: Stan, w: Wyliczenie, pokazMagazyn: boolean): Set<WarstwaPionId> {
  const v = widoczne(stan, w, pokazMagazyn, false);
  return new Set((Object.keys(v) as string[]).filter((id): id is WarstwaPionId => id in WARSTWY_PION));
}

type Props = {
  stan: Stan;
  wyliczenie: Wyliczenie;
  kamera: Kamera;
  plan: Plan;
  noc: boolean;
  pokazMagazyn: boolean;
  pokazMagazynDom: boolean;
  awaria?: boolean;
  className?: string;
};

export function ScenaPion({ stan, wyliczenie, kamera, plan, noc, pokazMagazyn, pokazMagazynDom, awaria, className = "" }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const kam = useRef<HTMLDivElement>(null);
  const nocRef = useRef<HTMLDivElement>(null);
  const warstwyRef = useRef<HTMLDivElement>(null);
  const els = useRef<Partial<Record<WarstwaPionId, HTMLDivElement>>>({});
  const poprzednie = useRef<Set<WarstwaPionId>>(new Set());
  const planRef = useRef<HTMLDivElement>(null);
  const kadrG = useRef<HTMLDivElement>(null);
  const elsG = useRef<Partial<Record<WarstwaGarazId, HTMLDivElement>>>({});
  const poprzednieG = useRef<Set<WarstwaGarazId>>(new Set());

  const vis = useMemo(() => widocznePion(stan, wyliczenie, pokazMagazynDom), [stan, wyliczenie, pokazMagazynDom]);
  const visG = useMemo(() => widoczneGaraz(stan, wyliczenie, pokazMagazyn), [stan, wyliczenie, pokazMagazyn]);

  // Kamera domu
  useEffect(() => {
    const k = KAMERY[kamera];
    gsap.to(kam.current, { scale: k.s, xPercent: (50 - k.fx) * k.s, yPercent: (50 - k.fy) * k.s, duration: 1.8, ease: "expo.inOut" });
  }, [kamera]);

  // Noc: przenikanie do nocnej wersji domu; warstwy dzienne przygaszone, żeby nie świeciły w nocnym kadrze.
  useEffect(() => {
    gsap.to(nocRef.current, { opacity: noc ? 1 : 0, duration: 2.4, ease: "power2.inOut" });
    gsap.to(warstwyRef.current, { filter: noc ? "brightness(0.62) saturate(0.75) hue-rotate(-8deg)" : "brightness(1) saturate(1) hue-rotate(0deg)", duration: 2.4 });
  }, [noc]);

  // Wejścia / zejścia warstw domu
  useEffect(() => {
    for (const id of Object.keys(WARSTWY_PION) as WarstwaPionId[]) {
      const el = els.current[id];
      if (!el) continue;
      const bylo = poprzednie.current.has(id);
      const jest = vis.has(id);
      if (jest && !bylo) {
        gsap.killTweensOf(el);
        // Wnętrze bramy podmieniamy przenikaniem (prostokąt), resztę wsuwamy jak na desktopie.
        if (MAGAZYNY.has(id)) gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.9, delay: 0.3, ease: "power2.out", overwrite: true });
        else gsap.fromTo(el, { opacity: 0, scale: 0.9, y: 12 }, { opacity: 1, scale: 1, y: 0, duration: 1.1, delay: 0.35, ease: "expo.out", overwrite: true });
      } else if (!jest && bylo) {
        gsap.to(el, { opacity: 0, duration: 0.3, ease: "power2.in", overwrite: true });
      }
    }
    poprzednie.current = new Set(vis);
  }, [vis]);

  // Zbliżenie garażu: pojawia się pod koniec zoomu kamery na bramę.
  useEffect(() => {
    const el = planRef.current;
    if (!el) return;
    gsap.killTweensOf(el);
    if (plan === "garaz") gsap.fromTo(el, { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, duration: 1.2, delay: 0.9, ease: "power2.out" });
    else gsap.to(el, { opacity: 0, scale: 1.04, duration: 0.8, ease: "power2.in" });
  }, [plan]);

  // Kadr zbliżenia: obraz garażu na pełną wysokość sceny, w poziomie środek sprzętu na środku ekranu.
  const sprzetG = (Object.keys(visG) as WarstwaGarazId[]).find((id) => id !== "g-falownik") ?? (visG["g-falownik"] ? "g-falownik" : undefined);
  const pierwszyKadr = useRef(true);
  useEffect(() => {
    const el = kadrG.current;
    const r = root.current;
    if (!el || !r) return;
    const ustaw = (animuj: boolean) => {
      const { width: sw, height: sh } = r.getBoundingClientRect();
      const skala = 1.12;
      const h = sh * skala;
      const w = (h * GARAZ.szerokosc) / GARAZ.wysokosc;
      const s = sprzetG ? srodekSprzetu(sprzetG) : { x: 40, y: 45 };
      const x = Math.min(0, Math.max(sw - w, sw / 2 - (s.x / 100) * w));
      const y = Math.min(0, Math.max(sh - h, sh * 0.52 - (s.y / 100) * h));
      const v = { x, y, width: w, height: h };
      if (animuj) gsap.to(el, { ...v, duration: 1.1, ease: "expo.inOut" });
      else gsap.set(el, v);
    };
    ustaw(!pierwszyKadr.current);
    pierwszyKadr.current = false;
    const onResize = () => ustaw(false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [sprzetG]);

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

  const magazyn = [...vis].some((id) => id !== "falownik" && MAGAZYNY.has(id));
  const pokazPrzeplywNoc = (noc || !!awaria) && magazyn;
  const pokazPrzeplywDzien = !noc && magazyn && vis.has("panele");

  return (
    <div ref={root} className={`relative overflow-hidden bg-[#140c07] ${className}`}>
      {/* Dom: obraz o stałych proporcjach, wyśrodkowany w pionie; kamera przesuwa i przybliża go wewnątrz sceny. */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2" style={{ aspectRatio: `${PION.szerokosc} / ${PION.wysokosc}` }}>
        <div ref={kam} className="absolute inset-0 will-change-transform">
          <Image src={`/img/pion/dom.v${PION.wersja}.webp`} alt="Dom w przekroju z garażem, w świetle zachodzącego słońca" fill priority sizes="150vw" className="object-cover" />
          <div ref={nocRef} className="absolute inset-0 opacity-0">
            <Image src={`/img/pion/noc.v${PION.wersja}.webp`} alt="" fill sizes="150vw" className="object-cover" />
          </div>
          <div ref={warstwyRef} className="absolute inset-0">
            {(Object.keys(WARSTWY_PION) as WarstwaPionId[]).map((id) => {
              const p = WARSTWY_PION[id];
              return (
                <div
                  key={id}
                  ref={(el) => {
                    if (el) els.current[id] = el;
                  }}
                  className="absolute opacity-0"
                  style={{ left: `${p.x}%`, top: `${p.y}%`, width: `${p.w}%`, height: `${p.h}%` }}
                >
                  <Image src={`/img/pion/${id}.v${PION.wersja}.webp`} alt="" fill sizes="150vw" className="object-fill" />
                </div>
              );
            })}
          </div>
          {/* Przepływ prądu (współrzędne w pikselach obrazu domu) */}
          <svg viewBox={`0 0 ${PION.szerokosc} ${PION.wysokosc}`} className="pointer-events-none absolute inset-0 size-full" aria-hidden>
            <defs>
              <filter id="glowPion">
                <feGaussianBlur stdDeviation="6" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <g className={`przeplyw transition-opacity duration-1000 ${pokazPrzeplywDzien ? "opacity-100" : "opacity-0"}`} filter="url(#glowPion)">
              <path d="M 420 980 C 700 1040, 1000 1200, 1200 1420" />
              <path d="M 1230 1180 C 1230 1260, 1225 1330, 1215 1420" />
            </g>
            <g className={`przeplyw transition-opacity duration-1000 ${pokazPrzeplywNoc ? "opacity-100" : "opacity-0"}`} filter="url(#glowPion)">
              <path d="M 1150 1480 C 1000 1500, 820 1500, 640 1470" />
              <path d="M 1150 1460 C 1000 1300, 860 1220, 760 1150" />
              {vis.has("agregat") && <path d="M 880 1640 C 980 1620, 1060 1560, 1120 1520" />}
            </g>
          </svg>
        </div>
      </div>

      {/* Zbliżenie ściany garażu (kroki „Marka” i „Wielkość”) — te same grafiki co na desktopie, kadr pionowy. */}
      <div ref={planRef} className="pointer-events-none absolute inset-0 overflow-hidden opacity-0 will-change-transform">
        <div ref={kadrG} className="absolute left-0 top-0 will-change-transform">
          <Image src={`/img/garaz/garaz.v${GARAZ.wersja}.webp`} alt="Tylna ściana garażu, na której staje magazyn energii" fill sizes="300vw" className="object-cover" />
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
                <Image src={`/img/garaz/${id}.v${GARAZ.wersja}.webp`} alt="" fill sizes="100vw" className="object-fill" />
                <div
                  data-glow
                  className="pointer-events-none absolute left-1/2 top-1/2 size-[130%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0"
                  style={{ background: "radial-gradient(circle, rgba(255,159,69,0.7) 0%, rgba(255,159,69,0) 65%)" }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
