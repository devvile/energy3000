"use client";

import { useCallback, useRef } from "react";
import { range, useScrollProgress } from "@/lib/useScrollProgress";

const TEXT =
  "Najwięcej prądu panele dają w południe, a wtedy w domu zwykle nikogo nie ma. Nadwyżka idzie do sieci za grosze, a wieczorem kupujesz prąd z powrotem, dużo drożej.";

// Manifest: krótki nagłówek z puentą, pod nim wyjaśnienie, którego słowa rozjaśniają się w rytm przewijania.
// (Do 29.10 całe 33 słowa były ustawione jak nagłówek — 6 wierszy na komputerze, 9 na telefonie.)
export function Manifest() {
  const section = useRef<HTMLElement>(null);
  const words = TEXT.split(" ");

  const onProgress = useCallback((p: number) => {
    const spans = section.current?.querySelectorAll<HTMLSpanElement>("[data-word]");
    if (!spans) return;
    const n = spans.length;
    spans.forEach((s, i) => {
      const t = range(p, (i / n) * 0.7, (i / n) * 0.7 + 0.12);
      s.style.opacity = String(0.2 + t * 0.8);
    });
  }, []);

  useScrollProgress(section, onProgress);

  return (
    <section ref={section} className="relative h-[180svh] bg-[#140c07]">
      <div className="sticky top-0 flex h-svh items-center px-5 sm:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <h2 className="max-w-4xl text-[clamp(2.4rem,5.6vw,5.6rem)] font-medium leading-[0.98] tracking-[-0.05em]">
            Magazyn zatrzymuje słońce na <em className="font-serif font-normal italic text-sun">wieczór.</em>
          </h2>
          <p className="mt-8 max-w-3xl text-[clamp(1.25rem,2.2vw,2rem)] leading-[1.3] tracking-[-0.02em] sm:mt-10">
            {words.map((w, i) => (
              <span key={i}>
                <span data-word style={{ opacity: 0.2 }} className="transition-opacity duration-200">
                  {w}
                </span>{" "}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
