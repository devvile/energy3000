import Image from "next/image";
import type { CSSProperties } from "react";
import { Words } from "./Words";

const ITEMS = [
  ["Magazyn energii", "Bateria LFP, najbezpieczniejszy rodzaj baterii do domu. Pojemność dobieramy do Twoich paneli."],
  ["Nowy falownik", "Hybrydowy, czyli steruje jednocześnie panelami i magazynem. Stary zwykle nie współpracuje z baterią."],
  ["Montaż w jeden dzień", "Robi go elektryk z uprawnieniami. Nikt nie wchodzi na dach, a uruchomienie jest w cenie."],
  ["Zgłoszenie do zakładu energetycznego", "Bez tego nie ma dotacji, więc załatwiamy to za Ciebie."],
  ["Pomoc przy dotacji", "Zbieramy dokumenty i pomagamy wysłać wniosek do programu Mój Prąd."],
  ["Prąd przy awarii", "Najważniejsze obwody działają, nawet gdy w okolicy wyłączą prąd. Które, ustala elektryk."],
];

// Co jest w pakiecie: zdjęcie magazynu w garażu + lista z numerami
export function Pakiet() {
  return (
    <section id="pakiet" className="relative bg-cream px-5 py-24 text-ink sm:px-8 sm:py-36">
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-24">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="mb-6 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-ink/50">
            <span className="h-px w-8 bg-ink/40" /> Co dostajesz
          </p>
          <Words
            text={"Załatwiamy wszystko.\nTy otwierasz drzwi."}
            accent="drzwi."
            className="text-[clamp(2.6rem,5.6vw,5.6rem)] font-medium leading-[0.95] tracking-[-0.05em]"
          />
          <div data-reveal="img" className="relative mt-10 aspect-[4/5] overflow-hidden rounded-3xl">
            <Image
              src="/img/room.webp"
              alt="Magazyn energii i falownik hybrydowy zamontowane w garażu"
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>

        <ol className="divide-y divide-ink/10 border-y border-ink/10 lg:mt-40">
          {ITEMS.map(([title, body], i) => (
            <li
              key={title}
              data-reveal
              style={{ "--d": `${(i % 2) * 80}ms` } as CSSProperties}
              className="group grid grid-cols-[3rem_1fr] gap-4 py-8 sm:grid-cols-[4.5rem_1fr] sm:py-10"
            >
              <span className="font-mono text-sm text-ink/40 transition-colors duration-500 group-hover:text-sun">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-2xl font-medium tracking-[-0.03em] sm:text-3xl">{title}</h3>
                <p className="mt-3 max-w-md text-base leading-relaxed text-ink/65">{body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
