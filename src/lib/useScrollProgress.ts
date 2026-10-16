"use client";

import { type RefObject, useEffect } from "react";

// Postęp przewijania przez element (0 = góra elementu przy górze ekranu, 1 = dół elementu przy dole ekranu).
// Wywołuje onProgress w rAF, bez re-renderów Reacta.
export function useScrollProgress(ref: RefObject<HTMLElement | null>, onProgress: (p: number) => void) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = total > 0 ? -rect.top / total : rect.top < 0 ? 1 : 0;
      onProgress(Math.min(Math.max(p, 0), 1));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [ref, onProgress]);
}

export const clamp01 = (n: number) => Math.min(Math.max(n, 0), 1);
// Mapuje p z przedziału [a, b] na [0, 1]
export const range = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
