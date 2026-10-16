"use client";

import { useCallback, useRef } from "react";
import { range, useScrollProgress } from "@/lib/useScrollProgress";

const TEXT =
  "Najwięcej prądu panele dają w południe, a wtedy w domu zwykle nikogo nie ma. Nadwyżka idzie do sieci za grosze, a wieczorem kupujesz prąd z powrotem, dużo drożej. Magazyn zatrzymuje słońce na wieczór.";

// Manifest: słowa rozjaśniają się jedno po drugim w rytm przewijania
export function Manifest() {
  const section = useRef<HTMLElement>(null);
  const words = TEXT.split(" ");

  const onProgress = useCallback((p: number) => {
    const spans = section.current?.querySelectorAll<HTMLSpanElement>("[data-word]");
    if (!spans) return;
    const n = spans.length;
    spans.forEach((s, i) => {
      const t = range(p, (i / n) * 0.8, (i / n) * 0.8 + 0.12);
      s.style.opacity = String(0.14 + t * 0.86);
    });
  }, []);

  useScrollProgress(section, onProgress);

  return (
    <section ref={section} className="relative h-[220svh] bg-[#140c07]">
      <div className="sticky top-0 flex h-svh items-center px-5 sm:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <p className="mb-8 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/50">
            <span className="h-px w-8 bg-foreground/40" /> Po co magazyn
          </p>
          <p className="text-[clamp(1.9rem,4.6vw,4.6rem)] font-medium leading-[1.08] tracking-[-0.04em]">
            {words.map((w, i) => {
              const accent = /słońce|wieczór\.?/.test(w) && i > words.length - 5;
              return (
                <span key={i}>
                  <span
                    data-word
                    style={{ opacity: 0.14 }}
                    className={`transition-opacity duration-200 ${accent ? "font-serif font-normal italic text-sun" : ""}`}
                  >
                    {w}
                  </span>{" "}
                </span>
              );
            })}
          </p>
        </div>
      </div>
    </section>
  );
}
