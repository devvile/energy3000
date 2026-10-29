"use client";

import Link from "next/link";
import { type FormEvent, useEffect, useState } from "react";
import { BEZ_PV, formatZl } from "@/lib/konfigurator";
import { EMAIL, HOURS, PHONE, PHONE_HREF } from "@/lib/oferta";
import { ZDARZENIE_KONFIGURACJI, type ZdarzenieKonfiguracji } from "./konfigurator/useKonfigurator";
import { Words } from "./Words";

// Formularz zgłoszenia. TODO: wysyłka do arkusza Google (na razie tylko frontend — pokazuje potwierdzenie).
// Zestaw z konfiguratora (sekcja „Cena”) dopina się do zgłoszenia sam: nasłuchujemy zdarzenia z useKonfigurator.
export function Wycena() {
  const [sent, setSent] = useState(false);
  const [pv, setPv] = useState<"tak" | "nie" | "">("");
  const [zestaw, setZestaw] = useState<ZdarzenieKonfiguracji | null>(null);

  // Konfigurator wysyła zdarzenie także przy pierwszym renderze (z konfiguracją z adresu strony), więc tu tylko słuchamy.
  useEffect(() => {
    const onZmiana = (e: Event) => {
      const z = (e as CustomEvent<ZdarzenieKonfiguracji>).detail;
      setZestaw(z);
      // „Nie mam paneli” w konfiguratorze → od razu zaznaczamy to w pytaniu o fotowoltaikę.
      if (z.dane.sytuacja === "brak-pv") setPv("nie");
    };
    window.addEventListener(ZDARZENIE_KONFIGURACJI, onZmiana);
    return () => window.removeEventListener(ZDARZENIE_KONFIGURACJI, onZmiana);
  }, []);

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
              text={"Oddzwonimy\nw pół godziny."}
              accent="godziny."
              className="text-[clamp(2.6rem,5.6vw,5.6rem)] font-medium leading-[0.95] tracking-[-0.05em]"
            />
            <p data-reveal className="mt-8 max-w-md text-lg leading-relaxed text-ink/75">
              Zostaw numer. W jednej rozmowie dowiesz się, ile kosztuje magazyn do Twoich paneli, ile dostaniesz dotacji
              i kiedy możemy przyjechać. Bez zobowiązań.
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
                Zadzwonimy w ciągu 30 minut ({HOURS}). Jeśli piszesz wieczorem, oddzwonimy rano.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-7">
              {zestaw && zestaw.dane.sytuacja !== "brak-pv" && (
                <div className="flex items-start justify-between gap-4 rounded-2xl bg-ink p-4 text-cream sm:p-5">
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-cream/50">Twój zestaw z konfiguratora</p>
                    <p className="mt-1.5 text-lg font-medium tracking-[-0.02em]">
                      {zestaw.dane.zestaw} · {zestaw.dane.kwh} kWh
                    </p>
                    {zestaw.dane.opcje && <p className="mt-0.5 text-sm text-cream/70">{zestaw.dane.opcje}</p>}
                    <p className="mt-1 text-sm text-cream/70">
                      {formatZl(zestaw.dane.cena)} · po dotacji ok. {formatZl(zestaw.dane.poDotacji)}
                    </p>
                  </div>
                  <a href="#cena" className="shrink-0 text-sm text-cream/60 underline underline-offset-4 hover:text-cream">
                    zmień
                  </a>
                  <input type="hidden" name="konfiguracja" value={zestaw.kod} />
                  <input type="hidden" name="zestaw" value={`${zestaw.dane.zestaw} ${zestaw.dane.opcje ? `+ ${zestaw.dane.opcje}` : ""}`.trim()} />
                  <input type="hidden" name="cena" value={zestaw.dane.cena} />
                </div>
              )}
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
                      <input type="radio" name="fotowoltaika" value={v} required checked={pv === v} className="sr-only" onChange={() => setPv(v)} />
                      {v}
                    </label>
                  ))}
                </div>
                {pv === "nie" && (
                  <p className="mt-3 text-sm text-ink/60">{BEZ_PV.zacheta}</p>
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
