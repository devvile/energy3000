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
      <div ref={pano} className="relative h-[100svh] overflow-hidden">
        <div ref={layer} className="absolute inset-0 will-change-transform" style={{ transform: "scale(1.25)" }}>
          <Image
            src="/img/aerial.webp"
            alt="Góry Świętokrzyskie o zachodzie słońca, domy z fotowoltaiką"
            fill
            sizes="100vw"
            className="object-cover object-[60%_center]"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#140c07]/60 via-transparent to-[#140c07]" />
        <div className="absolute inset-x-5 bottom-[18%] sm:inset-x-8">
          <div className="mx-auto max-w-7xl">
            <Words text="Jesteśmy stąd." accent="stąd" className="text-[clamp(3rem,8vw,8rem)] font-medium leading-[0.92] tracking-[-0.05em]" />
            <p data-reveal className="mt-5 max-w-xl text-lg leading-relaxed text-foreground/90 sm:text-xl">
              Montujemy u sąsiadów: Kielce i okolice do 100 km.
            </p>
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
          <p data-reveal className="text-[clamp(1.3rem,1.9vw,1.6rem)] font-medium leading-[1.3] tracking-[-0.03em]">
            E3000 to marka firmy produkcyjnej z&nbsp;Bilczy pod Kielcami. Magazyny montuje elektryk z&nbsp;uprawnieniami
            i&nbsp;ubezpieczeniem, też stąd.
          </p>
          <ul className="space-y-4 text-base text-foreground/80">
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
