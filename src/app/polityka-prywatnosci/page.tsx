import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "@/components/Header";
import { BRAND, COMPANY, EMAIL, PHONE } from "@/lib/oferta";

export const metadata: Metadata = {
  title: `Polityka prywatności — ${BRAND}`,
  description: `Jak ${BRAND} (${COMPANY.name}) przetwarza dane osobowe z formularza kontaktowego.`,
};

// ⚠️ Wersja robocza — do przejrzenia przez prawnika przed startem kampanii.
const SECTIONS: [string, ReactNode][] = [
  [
    "Administrator danych",
    <>
      Administratorem Twoich danych osobowych jest {COMPANY.name} z siedzibą przy {COMPANY.address}, KRS {COMPANY.krs},
      NIP {COMPANY.nip}, właściciel marki {BRAND}. W sprawach danych osobowych napisz na {EMAIL} albo zadzwoń: {PHONE}.
    </>,
  ],
  [
    "Jakie dane zbieramy",
    "Dane, które podajesz w formularzu: imię, numer telefonu, kod pocztowy, informację, czy masz fotowoltaikę, i jej moc (jeśli ją podasz). Podczas rozmowy możemy zanotować informacje o Twojej instalacji potrzebne do przygotowania oferty oraz zdjęcia, które nam prześlesz.",
  ],
  [
    "Po co i na jakiej podstawie",
    <ul key="cele" className="list-disc space-y-2 pl-5">
      <li>kontakt w odpowiedzi na zgłoszenie i przygotowanie oferty — podjęcie działań na Twoje żądanie przed zawarciem umowy (art. 6 ust. 1 lit. b RODO) oraz Twoja zgoda na kontakt telefoniczny i mailowy (art. 6 ust. 1 lit. a RODO);</li>
      <li>zawarcie i wykonanie umowy, w tym montaż i pomoc przy wniosku o dotację (art. 6 ust. 1 lit. b RODO);</li>
      <li>obowiązki księgowe i podatkowe, jeśli zawrzemy umowę (art. 6 ust. 1 lit. c RODO);</li>
      <li>ustalenie, dochodzenie lub obrona roszczeń (art. 6 ust. 1 lit. f RODO).</li>
    </ul>,
  ],
  [
    "Komu przekazujemy dane",
    "Dane mogą trafić do firm, które pomagają nam działać: dostawcy hostingu strony (Vercel), poczty i arkuszy (Google), a także do elektryka wykonującego montaż — tylko w zakresie potrzebnym do przygotowania oferty i montażu. Przy wniosku o dotację dane przekazujesz Ty lub my w Twoim imieniu do NFOŚiGW i operatora sieci. Nie sprzedajemy danych.",
  ],
  [
    "Przekazywanie poza EOG",
    "Część dostawców usług (np. Google, Vercel) może przetwarzać dane poza Europejskim Obszarem Gospodarczym. Odbywa się to na podstawie decyzji Komisji Europejskiej stwierdzającej odpowiedni poziom ochrony lub standardowych klauzul umownych.",
  ],
  [
    "Jak długo przechowujemy dane",
    "Dane ze zgłoszenia, po którym nie zawarliśmy umowy, przechowujemy do 12 miesięcy od ostatniego kontaktu albo do wycofania zgody. Dane klientów — przez czas trwania umowy i okres wymagany przepisami (m.in. podatkowymi) oraz do przedawnienia roszczeń.",
  ],
  [
    "Twoje prawa",
    "Masz prawo dostępu do danych, ich sprostowania, usunięcia, ograniczenia przetwarzania, przeniesienia oraz sprzeciwu. Zgodę możesz wycofać w każdej chwili, bez wpływu na zgodność z prawem wcześniejszego przetwarzania. Możesz też złożyć skargę do Prezesa Urzędu Ochrony Danych Osobowych (ul. Stawki 2, 00-193 Warszawa).",
  ],
  [
    "Czy musisz podać dane",
    "Podanie danych jest dobrowolne, ale bez numeru telefonu nie oddzwonimy i nie przygotujemy oferty. Nie podejmujemy decyzji w sposób zautomatyzowany ani nie profilujemy.",
  ],
  [
    "Pliki cookies",
    "Strona nie używa plików cookies reklamowych ani analitycznych. Jeśli to się zmieni (np. przy kampanii reklamowej), poprosimy o zgodę i zaktualizujemy tę politykę.",
  ],
];

export default function Polityka() {
  return (
    <main className="flex-1 bg-cream px-5 pb-24 pt-8 text-ink sm:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between">
          <Logo />
          <Link href="/" className="text-sm underline underline-offset-4">
            ← Wróć na stronę
          </Link>
        </div>
        <h1 className="mt-20 text-[clamp(2.6rem,6vw,4.6rem)] font-medium leading-[0.95] tracking-[-0.05em]">
          Polityka <span className="font-serif font-normal italic">prywatności</span>
        </h1>
        <p className="mt-6 text-sm text-ink/50">Obowiązuje od 16 października 2026 r.</p>
        <div className="mt-14 divide-y divide-ink/10 border-y border-ink/10">
          {SECTIONS.map(([title, body], i) => (
            <section key={title} className="grid gap-3 py-8 sm:grid-cols-[3rem_1fr]">
              <span className="font-mono text-sm text-ink/40">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h2 className="text-xl font-medium tracking-[-0.02em]">{title}</h2>
                <div className="mt-3 text-base leading-relaxed text-ink/70">{body}</div>
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
