import type { CSSProperties } from "react";
import { INSTALLMENTS, monthlyFor, PAKIETY, SUBSIDY, subsidyFor, zl } from "@/lib/oferta";
import { Words } from "./Words";

// Cennik: trzy pakiety z ceną przed dotacją, szacowaną dotacją i ratą
export function Cennik() {
  return (
    <section id="cena" className="relative overflow-hidden bg-[#140c07] px-5 py-24 sm:px-8 sm:py-36">
      <div className="pointer-events-none absolute -top-40 left-1/2 size-[60rem] -translate-x-1/2 rounded-full bg-sun/10 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <p className="mb-6 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/50">
              <span className="h-px w-8 bg-foreground/40" /> Cena
            </p>
            <Words
              text={"Cenę znasz od razu.\nNie po wizycie handlowca."}
              accent="razu."
              className="text-[clamp(2.4rem,5.2vw,5.2rem)] font-medium leading-[0.98] tracking-[-0.05em]"
            />
          </div>
          <p data-reveal className="max-w-sm text-base leading-relaxed text-foreground/70">
            Ceny brutto, a w nich montaż, falownik i pomoc przy wniosku. Wielkość magazynu zależy od mocy paneli:
            program wymaga co najmniej 10&nbsp;kWh i&nbsp;2&nbsp;kWh na każdy kilowat paneli.
          </p>
        </div>

        <div className="mt-16 grid gap-5 lg:grid-cols-3">
          {PAKIETY.map((p, i) => {
            const subsidy = subsidyFor(p.price, p.kwh);
            return (
              <article
                key={p.id}
                data-reveal
                style={{ "--d": `${i * 120}ms` } as CSSProperties}
                className={`group relative flex flex-col rounded-3xl border p-7 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-2 sm:p-9 ${
                  p.featured ? "border-sun/60 bg-cream text-ink" : "border-white/15 bg-white/[0.04] backdrop-blur-sm"
                }`}
              >
                {p.featured && (
                  <span className="absolute -top-3.5 left-7 rounded-full bg-sun px-3 py-1 text-xs font-medium text-ink sm:left-9">
                    Najczęściej wybierany
                  </span>
                )}
                <p className={`font-mono text-[11px] uppercase tracking-[0.2em] ${p.featured ? "text-ink/50" : "text-foreground/50"}`}>
                  {p.name} · do paneli {p.pv}
                </p>
                <p className="mt-8 text-7xl font-medium tracking-[-0.06em] sm:text-8xl">
                  {p.kwh}
                  <span className="ml-1 font-serif text-3xl italic tracking-normal">kWh</span>
                </p>

                <dl className={`mt-10 space-y-3 border-t pt-6 text-sm ${p.featured ? "border-ink/10" : "border-white/10"}`}>
                  <div className="flex justify-between">
                    <dt className="opacity-60">Cena z montażem</dt>
                    <dd className="font-medium">{zl(p.price)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="opacity-60">Zwrot z dotacji (ok.)</dt>
                    <dd className="font-medium text-[#1f9d63]">− {zl(subsidy)}</dd>
                  </div>
                  <div className="flex items-baseline justify-between pt-2">
                    <dt className="opacity-60">Realnie płacisz</dt>
                    <dd className="text-3xl font-medium tracking-[-0.04em]">{zl(p.price - subsidy)}</dd>
                  </div>
                </dl>

                <p className={`mt-6 rounded-2xl px-4 py-3 text-sm ${p.featured ? "bg-ink/5" : "bg-white/5"}`}>
                  albo <strong className="font-medium">{zl(monthlyFor(p.price))} miesięcznie</strong>, raty {INSTALLMENTS.rate}*
                </p>

                <a
                  href="#wycena"
                  className={`mt-8 inline-flex items-center justify-between rounded-full px-6 py-4 text-base font-medium transition-colors duration-500 ${
                    p.featured ? "bg-ink text-cream hover:bg-[#2a1d14]" : "bg-white/10 hover:bg-white/20"
                  }`}
                >
                  Zamów wycenę
                  <span aria-hidden>→</span>
                </a>
              </article>
            );
          })}
        </div>

        <p data-reveal className="mt-8 max-w-3xl text-xs leading-relaxed text-foreground/50">
          Dotacja to {Math.round(SUBSIDY.share * 100)}% kosztu, ale nie więcej niż {SUBSIDY.perKwh} zł za każdą kWh
          i&nbsp;nie więcej niż {zl(SUBSIDY.capNetBilling)} (net-billing) albo {zl(SUBSIDY.capNetMetering)} (net-metering).
          Wypłaca ją NFOŚiGW po montażu. Ceny są orientacyjne, dokładną kwotę podamy w ofercie. *{" "}
          {INSTALLMENTS.note}
        </p>
      </div>
    </section>
  );
}
