import type { CSSProperties } from "react";
import { SUBSIDY } from "@/lib/oferta";
import { Countdown } from "./Countdown";
import { Words } from "./Words";

const STATS = [
  { value: "16 000", unit: "zł", label: "tyle możesz dostać najwyżej, jeśli panele rozliczasz w net-billingu (zgłoszone od kwietnia 2022)" },
  { value: "30", unit: "%", label: "kosztu magazynu z montażem wraca na Twoje konto" },
  { value: SUBSIDY.payoutMonths, unit: "mies.", label: "tyle zwykle czeka się na przelew po złożeniu wniosku" },
];

// Dotacja „uczciwie”: najważniejsze liczby i zastrzeżenie, że najpierw płaci się całość
export function Dotacja() {
  return (
    <section id="dotacja" className="relative bg-cream px-5 py-24 text-ink sm:px-8 sm:py-36">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <div>
            <Words text={"O dotacji mówimy\nwszystko od razu."} accent="wszystko" className="text-[clamp(2.4rem,5vw,5rem)] font-medium leading-[0.95] tracking-[-0.05em]" />
            <p data-reveal className="mt-6 max-w-lg text-lg leading-relaxed text-ink/80 sm:text-xl">
              Program Mój Prąd zwraca część kosztu magazynu energii. Oto liczby, zanim o nie zapytasz.
            </p>
          </div>
          <div data-reveal className="rounded-3xl bg-ink p-7 text-cream sm:p-9">
            <p className="text-2xl font-medium sm:text-3xl">
              <Countdown />
            </p>
            <p className="mt-1 text-sm text-cream/60">Nabór wniosków Mój Prąd</p>
            <p className="mt-4 text-sm leading-relaxed text-cream/70">
              Wnioski można składać od 20 października 2026 do {SUBSIDY.end}, chyba że pieniądze skończą się wcześniej
              (pula to {SUBSIDY.pool}). Liczy się kolejność zgłoszeń.
            </p>
          </div>
        </div>

        <div className="mt-20 grid gap-10 md:grid-cols-3 md:gap-8">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              data-reveal
              style={{ "--d": `${i * 120}ms` } as CSSProperties}
            >
              <p className="text-[clamp(3.6rem,7vw,6.5rem)] font-medium leading-none tracking-[-0.06em]">
                {s.value}
                <span className="ml-2 font-serif text-[0.4em] italic tracking-normal text-sun">{s.unit}</span>
              </p>
              <p className="mt-4 max-w-xs text-base leading-relaxed text-ink/75">{s.label}</p>
            </div>
          ))}
        </div>

        <div data-reveal className="mt-16 grid gap-6 rounded-3xl bg-[#ebdfcd] p-7 sm:p-10 md:grid-cols-[auto_1fr] md:gap-12">
          <p className="text-xl font-medium tracking-[-0.02em] sm:text-2xl">
            Najpierw płacisz całość.
            <br />
            <span className="font-serif italic text-ink/70">Dotacja wraca po montażu.</span>
          </p>
          <p className="max-w-2xl text-base leading-relaxed text-ink/80">
            Wniosek można złożyć dopiero wtedy, gdy magazyn działa, jest zgłoszony do zakładu energetycznego, a faktura
            jest zapłacona. Mówimy o tym na samym początku, żeby nie było niespodzianek. O dotacji decyduje NFOŚiGW. My
            pilnujemy, żeby sprzęt spełniał wymagania programu, a dokumenty były kompletne. Jeśli bierzesz raty, część
            możesz potem spłacić z dotacji.
          </p>
        </div>
      </div>
    </section>
  );
}
