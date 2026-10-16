import type { CSSProperties } from "react";
import { Words } from "./Words";

const STEPS = [
  ["Zostawiasz numer", "Imię, telefon i kod pocztowy. Zajmie Ci to minutę."],
  ["Oddzwaniamy w 30 minut", "Pytamy o instalację i prosimy o trzy zdjęcia: falownika, skrzynki z bezpiecznikami i miejsca na magazyn."],
  ["Dostajesz ofertę", "Konkretny sprzęt, cena przed dotacją i po niej, wysokość raty. Niczego jeszcze nie podpisujesz."],
  ["Montaż i dotacja", "Elektryk montuje magazyn w jeden dzień. Zgłaszamy go do zakładu energetycznego i pomagamy złożyć wniosek."],
];

// Jak to działa w 4 krokach
export function Kroki() {
  return (
    <section id="jak-dziala" className="relative bg-[#140c07] px-5 py-24 sm:px-8 sm:py-36">
      <div className="mx-auto max-w-7xl">
        <p className="mb-6 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/50">
          <span className="h-px w-8 bg-foreground/40" /> Jak to działa
        </p>
        <Words
          text={"Jak to wygląda\nod Twojej strony."}
          accent="Twojej"
          className="text-[clamp(2.4rem,5vw,5rem)] font-medium leading-[0.98] tracking-[-0.05em]"
        />

        <ol className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(([title, body], i) => (
            <li
              key={title}
              data-reveal
              style={{ "--d": `${i * 110}ms` } as CSSProperties}
              className="group relative flex min-h-[20rem] flex-col justify-between bg-[#140c07] p-7 transition-colors duration-700 hover:bg-[#1f140c] sm:p-9"
            >
              <span className="font-serif text-7xl italic text-sun/90 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1">
                {i + 1}
              </span>
              <div>
                <h3 className="text-2xl font-medium tracking-[-0.03em]">{title}</h3>
                <p className="mt-3 text-base leading-relaxed text-foreground/65">{body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
