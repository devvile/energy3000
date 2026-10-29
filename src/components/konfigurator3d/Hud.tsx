"use client";

// HUD jak w grze: statystyki zestawu z paskami i licznikami, które „dobijają” do wartości.

import gsap from "gsap";
import { useEffect, useRef } from "react";
import type { Stan, Wyliczenie } from "@/lib/konfigurator";
import { formatKwh } from "@/lib/konfigurator";

/** ZAŁOŻENIE do potwierdzenia z Rafałem: typowe zużycie domu w nocy ok. 0,5 kW przez ok. 10 h = 5 kWh na noc. */
export const KWH_NA_NOC = 5;

export function nocePradu(kwh: number) {
  return Math.round((kwh / KWH_NA_NOC) * 10) / 10;
}

export function poziomBackupu(stan: Stan, w: Wyliczenie): { poziom: 1 | 2 | 3; nazwa: string } {
  const calyDom = !!stan.opcje.calyDom || w.wCenie.some((o) => o.id === "calyDom");
  const agregat = !!stan.opcje.agregat;
  if (calyDom && agregat) return { poziom: 3, nazwa: "Dom + agregat" };
  if (calyDom) return { poziom: 2, nazwa: "Cały dom" };
  return { poziom: 1, nazwa: agregat ? "Obwody + agregat" : "Kluczowe obwody" };
}

/** Liczba animowana do nowej wartości. */
export function Licznik({ wartosc, format, className = "" }: { wartosc: number; format: (n: number) => string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const stan = useRef({ v: wartosc });
  const fmt = useRef(format);
  useEffect(() => {
    fmt.current = format;
  });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    gsap.to(stan.current, {
      v: wartosc,
      duration: 0.9,
      ease: "expo.out",
      onUpdate: () => {
        el.textContent = fmt.current(stan.current.v);
      },
    });
  }, [wartosc]);
  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {format(wartosc)}
    </span>
  );
}

function Pasek({ udzial, className = "" }: { udzial: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    gsap.to(ref.current, { width: `${Math.max(2, Math.min(100, udzial * 100))}%`, duration: 1, ease: "expo.out" });
  }, [udzial]);
  return (
    <div className={`h-1.5 w-full overflow-hidden rounded-full bg-white/10 ${className}`}>
      <div ref={ref} className="h-full w-0 rounded-full bg-gradient-to-r from-sun/70 to-sun shadow-[0_0_12px_rgba(255,159,69,0.6)]" />
    </div>
  );
}

export function Hud({ stan, w }: { stan: Stan; w: Wyliczenie }) {
  const noce = nocePradu(w.kwh);
  const backup = poziomBackupu(stan, w);
  return (
    <dl className="grid grid-cols-2 gap-x-3 gap-y-4 sm:grid-cols-4 sm:gap-x-6 lg:gap-x-8">
      <div>
        <dt className="text-xs text-foreground/60">Pojemność</dt>
        <dd className="mt-0.5 text-lg font-medium tracking-[-0.03em] sm:mt-1 sm:text-2xl">
          <Licznik wartosc={w.kwh} format={(n) => formatKwh(Math.round(n * 10) / 10)} />
          <span className="ml-1 font-serif text-base italic text-foreground/60">kWh</span>
        </dd>
        <Pasek udzial={w.kwh / 40} className="mt-2 hidden sm:block" />
      </div>
      <div className="hidden sm:block">
        <dt className="text-xs text-foreground/60">Prąd na noc</dt>
        <dd className="mt-1 text-2xl font-medium tracking-[-0.03em]">
          <Licznik wartosc={noce} format={(n) => (Math.round(n * 10) / 10).toLocaleString("pl-PL")} />
          <span className="ml-1 font-serif text-base italic text-foreground/60">{noce === 1 ? "noc" : noce < 5 ? "noce" : "nocy"}</span>
        </dd>
        <Pasek udzial={noce / 8} className="mt-2" />
      </div>
      <div className="hidden sm:block">
        <dt className="text-xs text-foreground/60">Zasilanie awaryjne</dt>
        <dd className="mt-1 text-sm font-medium">{backup.nazwa}</dd>
        <div className="mt-2 flex gap-1.5">
          {[1, 2, 3].map((p) => (
            <span
              key={p}
              className={`h-1.5 flex-1 rounded-full transition-colors duration-700 ${p <= backup.poziom ? "bg-sun shadow-[0_0_10px_rgba(255,159,69,0.6)]" : "bg-white/10"}`}
            />
          ))}
        </div>
      </div>
      <div>
        <dt className="text-xs text-foreground/60"><span className="sm:hidden">Płacisz</span><span className="hidden sm:inline">Realnie płacisz</span></dt>
        <dd className="mt-0.5 text-lg font-medium tracking-[-0.03em] sm:mt-1 sm:text-2xl">
          <Licznik wartosc={w.poDotacji} format={(n) => `${Math.round(n / 10) * 10}`.replace(/\B(?=(\d{3})+(?!\d))/g, " ")} />
          <span className="ml-1 font-serif text-base italic text-foreground/60">zł</span>
        </dd>
        <p className="mt-1 hidden text-[11px] text-foreground/50 sm:mt-1.5 sm:block">
          cena <Licznik wartosc={w.cena} format={(n) => `${Math.round(n / 10) * 10}`.replace(/\B(?=(\d{3})+(?!\d))/g, " ")} /> zł, dotacja −{" "}
          <Licznik wartosc={w.dotacja} format={(n) => `${Math.round(n / 100) * 100}`.replace(/\B(?=(\d{3})+(?!\d))/g, " ")} /> zł
        </p>
      </div>
    </dl>
  );
}
