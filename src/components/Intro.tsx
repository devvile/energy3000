"use client";

import { useEffect, useState } from "react";

const DURATION = 2200;

// Ekran „ładowania magazynu” 0 → 100%, potem kurtyna odjeżdża w górę
export function Intro() {
  const [pct, setPct] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const root = document.documentElement;

    let frame = 0;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.dataset.ready = "";
      frame = requestAnimationFrame(() => setGone(true));
      return () => cancelAnimationFrame(frame);
    }

    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / DURATION, 1);
      setPct(Math.round((1 - Math.pow(1 - t, 3)) * 100));
      if (t < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        setLeaving(true);
        setTimeout(() => (root.dataset.ready = ""), 350);
        setTimeout(() => setGone(true), 1300);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  if (gone) return null;

  return (
    <div
      aria-hidden
      className="intro fixed inset-0 z-50 flex flex-col justify-between bg-cream p-5 text-ink sm:p-8"
      style={{
        transform: leaving ? "translateY(-100%)" : "none",
        transition: "transform 1.1s var(--ease-in-out-quart)",
      }}
    >
      <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-ink/50">
        <span>ENERGY3000</span>
        <span>Ładowanie magazynu</span>
      </div>

      <div>
        <div className="flex items-end justify-between">
          <span className="font-sans text-[28vw] font-medium leading-[0.8] tracking-[-0.06em] tabular-nums sm:text-[18vw]">
            {String(pct).padStart(3, "0")}
          </span>
          <span className="mb-[2vw] font-serif text-[8vw] italic text-sun sm:text-[5vw]">
            %
          </span>
        </div>
        <div className="mt-6 h-px w-full bg-ink/10">
          <div
            className="h-px bg-sun shadow-[0_0_12px_var(--sun)]"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
