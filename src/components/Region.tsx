"use client";

import Image from "next/image";
import { useCallback, useRef } from "react";
import { useScrollProgress } from "@/lib/useScrollProgress";
import { Words } from "./Words";

// Region i zespół: panorama Gór Świętokrzyskich z paralaksą, potem zdjęcie montażu
export function Region() {
  const pano = useRef<HTMLDivElement>(null);
  const layer = useRef<HTMLDivElement>(null);

  const onProgress = useCallback((p: number) => {
    if (layer.current) layer.current.style.transform = `translateY(${(p - 0.5) * -18}%) scale(1.25)`;
  }, []);
  useScrollProgress(pano, onProgress);

  return (
    <section id="o-nas" className="relative bg-[#140c07]">
      <div ref={pano} className="relative h-[120svh] overflow-hidden">
        <div ref={layer} className="absolute inset-0 will-change-transform" style={{ transform: "scale(1.25)" }}>
          <Image
            src="/img/aerial.webp"
            alt="Góry Świętokrzyskie o zachodzie słońca, domy z fotowoltaiką"
            fill
            sizes="100vw"
            className="object-cover object-[60%_center]"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#140c07] via-transparent to-[#140c07]" />
        <div className="absolute inset-x-5 bottom-[18%] sm:inset-x-8">
          <div className="mx-auto max-w-7xl">
            <p className="mb-6 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/70">
              <span className="h-px w-8 bg-foreground/60" /> Kielce + 100 km
            </p>
            <Words
              text={"Jesteśmy stąd.\nMontujemy u sąsiadów."}
              accent="stąd."
              className="text-[clamp(2.8rem,7vw,7.5rem)] font-medium leading-[0.92] tracking-[-0.05em] [text-shadow:0_2px_40px_rgba(20,12,7,0.5)]"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-12 px-5 pb-24 pt-8 sm:px-8 sm:pb-36 lg:grid-cols-2 lg:gap-24">
        <div data-reveal="img" className="relative aspect-[4/5] overflow-hidden rounded-3xl lg:order-2">
          <Image
            src="/img/hands.webp"
            alt="Elektryk podłącza falownik magazynu energii"
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col justify-center gap-8 lg:order-1">
          <p data-reveal className="text-[clamp(1.5rem,2.6vw,2.2rem)] font-medium leading-[1.2] tracking-[-0.03em]">
            E3000 to marka firmy produkcyjnej z&nbsp;Bilczy pod Kielcami. Magazyny montuje elektryk z&nbsp;uprawnieniami
            i&nbsp;ubezpieczeniem, też stąd.
          </p>
          <ul className="space-y-4 border-t border-white/10 pt-8 text-base text-foreground/75">
            {[
              "Od pierwszego telefonu do wypłaty dotacji rozmawiasz z jedną osobą",
              "Przed montażem elektryk przyjeżdża obejrzeć instalację",
              "Gdy coś się dzieje, dzwonisz do nas, a nie na infolinię na drugim końcu Polski",
            ].map((t) => (
              <li key={t} data-reveal className="flex gap-4">
                <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-led" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
