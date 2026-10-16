import type { CSSProperties } from "react";
import { SUBSIDY } from "@/lib/oferta";
import { Countdown } from "./Countdown";
import { Words } from "./Words";

const STATS = [
  { value: "16 000", unit: "zł", label: "maks. dotacji przy rozliczeniu net-billing (PV zgłoszona od IV 2022)" },
  { value: "30", unit: "%", label: "kosztu magazynu z montażem wraca do Ciebie" },
  { value: SUBSIDY.payoutMonths, unit: "mies.", label: "tyle zwykle trwa wypłata po złożeniu wniosku" },
];

// Dotacja „uczciwie”: najważniejsze liczby i zastrzeżenie, że najpierw płaci się całość
export function Dotacja() {
  return (
    <section id="dotacja" className="relative bg-cream px-5 py-24 text-ink sm:px-8 sm:py-36">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <div>
            <p className="mb-6 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-ink/50">
              <span className="h-px w-8 bg-ink/40" /> Dotacja Mój Prąd · magazyny energii
            </p>
            <Words
              text={"Dotacja, uczciwie.\nOd pierwszej rozmowy."}
              accent="uczciwie."
              className="text-[clamp(2.6rem,5.6vw,5.6rem)] font-medium leading-[0.95] tracking-[-0.05em]"
            />
          </div>
          <div data-reveal className="rounded-3xl bg-ink p-7 text-cream sm:p-9">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-cream/50">Nabór wniosków startuje za</p>
            <p className="mt-3 text-2xl font-medium sm:text-3xl">
              <Countdown />
            </p>
            <p className="mt-4 text-sm leading-relaxed text-cream/70">
              Wnioski od 20 października 2026 do {SUBSIDY.end} albo do wyczerpania puli {SUBSIDY.pool}. Rozpatrywane
              w kolejności zgłoszeń.
            </p>
          </div>
        </div>

        <div className="mt-20 grid border-t border-ink/15 md:grid-cols-3">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              data-reveal
              style={{ "--d": `${i * 120}ms` } as CSSProperties}
              className="border-b border-ink/15 py-10 md:border-b-0 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0"
            >
              <p className="text-[clamp(3.6rem,7vw,6.5rem)] font-medium leading-none tracking-[-0.06em]">
                {s.value}
                <span className="ml-2 font-serif text-[0.4em] italic tracking-normal text-sun">{s.unit}</span>
              </p>
              <p className="mt-4 max-w-xs text-base leading-relaxed text-ink/65">{s.label}</p>
            </div>
          ))}
        </div>

        <div data-reveal className="mt-16 grid gap-6 rounded-3xl border border-ink/15 p-7 sm:p-10 md:grid-cols-[auto_1fr] md:gap-12">
          <p className="text-xl font-medium tracking-[-0.02em] sm:text-2xl">
            Najpierw płacisz całość.
            <br />
            <span className="font-serif italic text-ink/70">Dotacja wraca po montażu.</span>
          </p>
          <p className="text-base leading-relaxed text-ink/70">
            Wniosek składa się dopiero, gdy magazyn działa, jest zgłoszony do zakładu energetycznego, a faktura jest
            zapłacona. Mówimy o tym od pierwszej rozmowy, nie po podpisaniu umowy. Decyzję podejmuje NFOŚiGW, a my dbamy,
            żeby sprzęt spełniał wymagania programu i żeby dokumenty były kompletne. Raty możesz częściowo spłacić z
            dotacji.
          </p>
        </div>
      </div>
    </section>
  );
}
