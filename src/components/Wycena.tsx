"use client";

import Link from "next/link";
import { type FormEvent, useState } from "react";
import { EMAIL, HOURS, PHONE, PHONE_HREF } from "@/lib/oferta";
import { Words } from "./Words";

// Formularz zgłoszenia. TODO: wysyłka do arkusza Google (na razie tylko frontend — pokazuje potwierdzenie).
export function Wycena() {
  const [sent, setSent] = useState(false);
  const [pv, setPv] = useState<"tak" | "nie" | "">("");

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section id="wycena" className="relative overflow-hidden bg-sun px-5 py-24 text-ink sm:px-8 sm:py-36">
      <div className="pointer-events-none absolute -right-40 -top-40 size-[40rem] rounded-full bg-[#ffc27a] blur-[120px]" />
      <div className="relative mx-auto grid max-w-7xl gap-14 lg:grid-cols-2 lg:gap-24">
        <div className="flex flex-col justify-between gap-10">
          <div>
            <p className="mb-6 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-ink/60">
              <span className="h-px w-8 bg-ink/50" /> Bezpłatna wycena
            </p>
            <Words
              text={"Jedna rozmowa.\nCena, dotacja, termin."}
              accent="rozmowa."
              className="text-[clamp(2.6rem,5.6vw,5.6rem)] font-medium leading-[0.95] tracking-[-0.05em]"
            />
            <p data-reveal className="mt-8 max-w-md text-lg leading-relaxed text-ink/75">
              Zostaw numer, oddzwonimy w ciągu 30 minut. Bez zobowiązań i bez wizyty handlowca w domu.
            </p>
          </div>

          <div data-reveal className="space-y-2">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink/60">Wolisz zadzwonić?</p>
            <a href={PHONE_HREF} className="cta block w-fit text-[clamp(2rem,4vw,3.4rem)] font-medium tracking-[-0.04em]">
              <span className="cta-line">{PHONE}</span>
            </a>
            <p className="text-sm text-ink/60">{HOURS}</p>
            <a href={`mailto:${EMAIL}`} className="block w-fit text-base underline decoration-ink/30 underline-offset-4">
              {EMAIL}
            </a>
          </div>
        </div>

        <div data-reveal className="rounded-[2rem] bg-cream p-7 shadow-[0_40px_120px_-40px_rgba(40,18,6,0.45)] sm:p-10">
          {sent ? (
            <div className="flex min-h-[28rem] flex-col justify-center">
              <span className="flex size-14 items-center justify-center rounded-full bg-led text-2xl text-ink">✓</span>
              <h3 className="mt-8 text-4xl font-medium tracking-[-0.04em]">Dziękujemy!</h3>
              <p className="mt-4 max-w-sm text-lg leading-relaxed text-ink/70">
                Oddzwonimy w ciągu 30 minut ({HOURS}). Zgłoszenia z wieczora: następnego dnia rano.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-7">
              <div className="grid gap-7 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm text-ink/60">Imię</span>
                  <input name="imie" required autoComplete="given-name" className="field" placeholder="Jan" />
                </label>
                <label className="block">
                  <span className="text-sm text-ink/60">Telefon</span>
                  <input
                    name="telefon"
                    type="tel"
                    required
                    autoComplete="tel"
                    inputMode="tel"
                    pattern="[0-9 +\-]{9,}"
                    className="field"
                    placeholder="500 600 700"
                  />
                </label>
                <label className="block">
                  <span className="text-sm text-ink/60">Kod pocztowy</span>
                  <input
                    name="kod"
                    required
                    autoComplete="postal-code"
                    inputMode="numeric"
                    pattern="[0-9]{2}-?[0-9]{3}"
                    className="field"
                    placeholder="25-001"
                  />
                </label>
                <label className="block">
                  <span className="text-sm text-ink/60">Moc paneli (jeśli wiesz)</span>
                  <input name="moc" inputMode="decimal" className="field" placeholder="np. 8 kWp" />
                </label>
              </div>

              <fieldset>
                <legend className="text-sm text-ink/60">Masz już fotowoltaikę?</legend>
                <div className="mt-3 flex gap-3">
                  {(["tak", "nie"] as const).map((v) => (
                    <label
                      key={v}
                      className={`cursor-pointer rounded-full border px-6 py-2.5 text-base capitalize transition-colors duration-300 ${
                        pv === v ? "border-ink bg-ink text-cream" : "border-ink/20 hover:border-ink/50"
                      }`}
                    >
                      <input type="radio" name="fotowoltaika" value={v} required className="sr-only" onChange={() => setPv(v)} />
                      {v}
                    </label>
                  ))}
                </div>
                {pv === "nie" && (
                  <p className="mt-3 text-sm text-ink/60">
                    Na razie montujemy magazyny do istniejącej fotowoltaiki. Zostaw numer, odezwiemy się, gdy poszerzymy
                    ofertę.
                  </p>
                )}
              </fieldset>

              <label className="flex gap-3 text-xs leading-relaxed text-ink/60">
                <input type="checkbox" required className="mt-0.5 size-4 shrink-0 accent-[#1b140f]" />
                <span>
                  Zgadzam się na kontakt telefoniczny i mailowy w sprawie oferty magazynu energii. Administratorem danych
                  jest MOJO Sp. z o.o. Szczegóły w{" "}
                  <Link href="/polityka-prywatnosci" className="underline underline-offset-2">
                    polityce prywatności
                  </Link>
                  .
                </span>
              </label>

              <button
                type="submit"
                className="cta group flex w-full items-center justify-between rounded-full bg-ink py-2 pl-7 pr-2 text-lg font-medium text-cream transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.02]"
              >
                Oddzwońcie do mnie
                <span className="flex size-12 items-center justify-center rounded-full bg-sun text-ink transition-transform duration-500 group-hover:rotate-45">
                  <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden>
                    <path d="M4 14 14 4M6 4h8v8" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </span>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
