import Link from "next/link";
import type { ReactNode } from "react";
import { PHONE, PHONE_HREF } from "@/lib/oferta";
import { SITE_URL } from "@/lib/seo";
import { Footer } from "./Footer";
import { Logo } from "./Header";

// Poradniki (podstrony pod frazy z wyszukiwarki): prosta, czytelna kolumna tekstu w stylu strony głównej,
// na końcu wezwanie do konfiguratora i formularza. Treść musi się zgadzać z ofertą i regulaminem programu —
// ceny i opisy marek biorą się z danych konfiguratora (src/lib/konfigurator).
export const PORADNIKI = [
  { href: "/dotacja-do-magazynu-energii", tytul: "Dotacja do magazynu energii w 2026 roku (PME2)" },
  { href: "/magazyn-energii-deye-czy-foxess", tytul: "Magazyn energii Deye czy FoxESS?" },
  { href: "/magazyn-energii-do-istniejacej-fotowoltaiki", tytul: "Magazyn energii do fotowoltaiki, którą już masz" },
] as const;

type Props = { slug: (typeof PORADNIKI)[number]["href"]; tytul: string; lead: string; children: ReactNode };

export function Poradnik({ slug, tytul, lead, children }: Props) {
  const okruszki = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "E3000", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: tytul, item: `${SITE_URL}${slug}` },
    ],
  };

  return (
    <>
      <main className="flex-1 bg-cream px-5 pb-24 pt-6 text-ink sm:px-8">
        <div className="mx-auto max-w-3xl">
          <nav className="flex items-center justify-between gap-4 text-sm">
            <Logo />
            <div className="flex items-center gap-5">
              <a href={PHONE_HREF} className="hidden tabular-nums text-ink/70 hover:text-ink sm:block">
                {PHONE}
              </a>
              <Link href="/#cena" className="rounded-full bg-ink px-4 py-2 font-medium text-cream transition-transform duration-500 hover:scale-105">
                Sprawdź cenę
              </Link>
            </div>
          </nav>

          <h1 className="mt-20 text-[clamp(2.4rem,5.5vw,4.4rem)] font-medium leading-[0.98] tracking-[-0.05em]">{tytul}</h1>
          <p className="mt-6 text-xl leading-relaxed text-ink/80">{lead}</p>

          <div className="mt-12 text-lg leading-relaxed text-ink/85 [&_a]:underline [&_a]:underline-offset-4 [&_h2]:mt-16 [&_h2]:text-[clamp(1.6rem,3vw,2.2rem)] [&_h2]:font-medium [&_h2]:leading-tight [&_h2]:tracking-[-0.03em] [&_h2]:text-ink [&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-medium [&_h3]:text-ink [&_li]:mt-2 [&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mt-4 [&_strong]:font-medium [&_strong]:text-ink [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6">
            {children}
          </div>

          <section className="mt-20 rounded-3xl bg-ink p-7 text-cream sm:p-10">
            <h2 className="text-[clamp(1.6rem,3vw,2.2rem)] font-medium leading-tight tracking-[-0.03em]">
              Policz swój magazyn w minutę
            </h2>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-cream/75">
              W konfiguratorze wybierasz markę, wielkość i dodatki, a cena i szacunkowa dotacja liczą się od razu. Wolisz
              rozmowę? Zostaw numer, oddzwonimy.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/#cena" className="rounded-full bg-sun px-6 py-3 text-base font-medium text-ink transition-transform duration-500 hover:scale-[1.03]">
                Otwórz konfigurator
              </Link>
              <Link href="/#wycena" className="rounded-full bg-cream px-6 py-3 text-base font-medium text-ink transition-transform duration-500 hover:scale-[1.03]">
                Zostaw numer
              </Link>
            </div>
          </section>

          <section className="mt-16">
            <h2 className="text-xl font-medium tracking-[-0.02em]">Inne poradniki</h2>
            <ul className="mt-4 space-y-2 text-lg">
              {PORADNIKI.filter((p) => p.href !== slug).map((p) => (
                <li key={p.href}>
                  <Link href={p.href} className="underline underline-offset-4 hover:text-sun">
                    {p.tytul}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(okruszki) }} />
    </>
  );
}

/** Tabela w poradniku: tło w innym odcieniu zamiast linii, przewijana w poziomie na telefonie. */
export function Tabela({ naglowki, wiersze }: { naglowki: string[]; wiersze: ReactNode[][] }) {
  return (
    <div className="mt-6 overflow-x-auto rounded-2xl bg-[#ebdfcd]">
      <table className="w-full min-w-[32rem] text-left text-base">
        <thead>
          <tr>
            {naglowki.map((n) => (
              <th key={n} className="px-4 py-3 font-medium text-ink/70">
                {n}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {wiersze.map((w, i) => (
            <tr key={i} className="odd:bg-[#e6d8c3]">
              {w.map((k, j) => (
                <td key={j} className="px-4 py-3 align-top">
                  {k}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
