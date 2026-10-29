import type { Metadata } from "next";
import Link from "next/link";
import { Poradnik, Tabela } from "@/components/Poradnik";
import { formatKwh, zestawyLinii } from "@/lib/konfigurator";

// Warianty montażu wg vaulta „10 Strategia/Oferta — konfigurator zestawów Deye i FoxESS”, pkt 6.4 i 6.4a.
const TYTUL = "Magazyn energii do fotowoltaiki, którą już masz";

export const metadata: Metadata = {
  title: "Magazyn energii do istniejącej fotowoltaiki — E3000 Kielce",
  description:
    "Jak dołożyć magazyn energii do działającej fotowoltaiki: co zależy od falownika (zwykły, hybrydowy, mikroinwertery, SolarEdge), jak dobrać pojemność, gdzie stoi magazyn i jak wygląda montaż.",
  alternates: { canonical: "/magazyn-energii-do-istniejacej-fotowoltaiki" },
  openGraph: {
    title: "Magazyn energii do istniejącej fotowoltaiki — E3000",
    description: "Co zależy od falownika, jak dobrać pojemność i jak wygląda montaż.",
    url: "/magazyn-energii-do-istniejacej-fotowoltaiki",
  },
};

export default function DoIstniejacejPv() {
  return (
    <Poradnik
      slug="/magazyn-energii-do-istniejacej-fotowoltaiki"
      tytul={TYTUL}
      lead="Do większości działających instalacji fotowoltaicznych da się dołożyć magazyn energii — bez wchodzenia na dach i bez wymiany paneli. To, jak dokładnie, zależy od falownika, który masz."
    >
      <h2>Co zależy od Twojego falownika</h2>
      <p>
        Bateria pracuje tylko z <strong>falownikiem hybrydowym</strong>, który steruje jednocześnie panelami i
        magazynem. Większość instalacji z lat 2019–2023 ma zwykły falownik, więc najczęściej montujemy nowy, hybrydowy.
      </p>
      <h3>Zwykły falownik (dowolnej marki)</h3>
      <p>
        Najczęściej wymieniamy go na hybrydowy Deye albo FoxESS i podłączamy do niego panele — w cenie zestawu, bez
        dopłat. Stary falownik oddajemy Tobie. Jeśli jest nowy, na gwarancji albo paneli jest więcej, niż przyjmie nowy
        falownik, może zostać i pracować dalej obok zestawu Deye (dopłata 590 zł za połączenie).
      </p>
      <h3>Hybrydowy falownik Deye albo FoxESS bez baterii</h3>
      <p>
        Dokładamy samą baterię zgodną z Twoim falownikiem. To najtańsza droga, a dotacja jest prawie taka sama, bo dotowany
        jest magazyn, nie falownik. Wycena indywidualna — wystarczy zdjęcie tabliczki falownika.
      </p>
      <h3>Hybrydowy falownik innej marki (Huawei, GoodWe, Sofar, Growatt…)</h3>
      <p>
        Baterie Deye i FoxESS współpracują tylko z falownikami ze swojej listy zgodności. Montujemy wtedy zestaw Deye, a
        Twój falownik zostaje i dalej pracuje z panelami (dopłata 590 zł). Jeśli stary falownik jest wysłużony,
        proponujemy wymianę.
      </p>
      <h3>Mikroinwertery albo optymalizatory (Enphase, Hoymiles, SolarEdge)</h3>
      <p>
        Tu sprzęt pod panelami zostaje na dachu — zdejmowanie go byłoby drogie i niepotrzebne. Montujemy zestaw Deye, a
        prąd z Twojej instalacji podłączamy do jego dodatkowego wejścia (dopłata 590 zł). Dzięki temu panele ładują
        magazyn i działają także przy braku prądu w sieci.
      </p>

      <h2>Jak dobrać pojemność magazynu</h2>
      <p>
        Program dotacji wymaga <strong>co najmniej 2 kWh pojemności na każdy 1 kWp paneli</strong> i co najmniej 10 kWh.
        Dlatego wielkość zestawu dobieramy do mocy Twojej instalacji:
      </p>
      <Tabela
        naglowki={["Wielkość", "Deye", "FoxESS", "Typowy dom"]}
        wiersze={(["s", "m", "l"] as const).map((r) => {
          const d = zestawyLinii("deye").find((z) => z.rozmiar === r)!;
          const f = zestawyLinii("fox").find((z) => z.rozmiar === r)!;
          return [
            r.toUpperCase(),
            `${formatKwh(d.kwh)} kWh, panele do ${formatKwh(d.pvMaxKwp)} kWp`,
            `${formatKwh(f.kwh)} kWh, panele do ${formatKwh(f.pvMaxKwp)} kWp`,
            d.dom,
          ];
        })}
      />
      <p>Większy magazyn można też rozbudować później, dokładając kolejne moduły.</p>

      <h2>Gdzie stoi magazyn</h2>
      <p>
        W garażu, kotłowni albo innym pomieszczeniu gospodarczym — ma wielkość wąskiej szafki. Baterie Deye montujemy w
        ogrzewanym pomieszczeniu, a FoxESS, dzięki wbudowanemu grzaniu, także w nieogrzewanym garażu.
      </p>

      <h2>Jak wygląda montaż</h2>
      <ol>
        <li>
          Przed wyceną prosimy o trzy zdjęcia: falownika (z tabliczką), skrzynki z bezpiecznikami i miejsca na magazyn.
        </li>
        <li>Elektryk przyjeżdża obejrzeć instalację i potwierdza, który wariant pasuje.</li>
        <li>Montaż trwa zwykle jeden dzień i nikt nie wchodzi na dach.</li>
        <li>Zgłaszamy magazyn do zakładu energetycznego i pomagamy złożyć wniosek o dotację.</li>
      </ol>
      <p>
        Szczegóły dotacji: <Link href="/dotacja-do-magazynu-energii">dotacja do magazynu energii w 2026 roku</Link>.
        Porównanie marek: <Link href="/magazyn-energii-deye-czy-foxess">Deye czy FoxESS</Link>.
      </p>
    </Poradnik>
  );
}
