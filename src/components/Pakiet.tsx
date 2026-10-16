import Image from "next/image";
import type { CSSProperties } from "react";
import { Words } from "./Words";

const ITEMS = [
  ["Magazyn energii LFP", "Najbezpieczniejsza technologia baterii do domu. Moduły dobieramy do mocy Twoich paneli."],
  ["Falownik hybrydowy", "Steruje panelami i baterią naraz. Zastępuje stary falownik, który nie obsługuje magazynu."],
  ["Montaż w jeden dzień", "Elektryk z uprawnieniami, bez wchodzenia na dach. Uruchomienie i konfiguracja w cenie."],
  ["Zgłoszenie do operatora", "Zgłaszamy magazyn do zakładu energetycznego. To warunek dotacji."],
  ["Wniosek o dotację", "Kompletujemy dokumenty i pomagamy złożyć wniosek w programie Mój Prąd."],
  ["Zasilanie awaryjne", "Wybrane obwody działają przy awarii sieci. Zakres ustala elektryk."],
];

// Co jest w pakiecie: zdjęcie magazynu w garażu + lista z numerami
export function Pakiet() {
  return (
    <section id="pakiet" className="relative bg-cream px-5 py-24 text-ink sm:px-8 sm:py-36">
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-24">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="mb-6 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-ink/50">
            <span className="h-px w-8 bg-ink/40" /> W pakiecie
          </p>
          <Words
            text={"Jeden pakiet.\nZero bieganiny."}
            accent="bieganiny."
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
