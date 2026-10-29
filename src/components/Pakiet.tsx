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

// Co jest w pakiecie: zdjęcie magazynu w garażu + lista (bez numerów i linii — oddziela je odstęp)
export function Pakiet() {
  return (
    <section id="pakiet" className="relative bg-cream px-5 py-24 text-ink sm:px-8 sm:py-36">
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-24">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <Words text={"Załatwiamy\nwszystko."} accent="wszystko" className="text-[clamp(2.4rem,5vw,5rem)] font-medium leading-[0.95] tracking-[-0.05em]" />
          <p data-reveal className="mt-6 max-w-md text-lg leading-relaxed text-ink/80 sm:text-xl">
            Ty otwierasz drzwi. Sprzęt, montaż, zgłoszenie do zakładu energetycznego i papiery do dotacji są po naszej
            stronie.
          </p>
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

        <ol className="space-y-10 sm:space-y-12 lg:mt-40">
          {ITEMS.map(([title, body], i) => (
            <li
              key={title}
              data-reveal
              style={{ "--d": `${(i % 2) * 80}ms` } as CSSProperties}
            >
              <h3 className="text-2xl font-medium tracking-[-0.03em]">{title}</h3>
              <p className="mt-2 max-w-md text-base leading-relaxed text-ink/75">{body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
