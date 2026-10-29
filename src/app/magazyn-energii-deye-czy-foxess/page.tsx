import type { Metadata } from "next";
import Link from "next/link";
import { Poradnik, Tabela } from "@/components/Poradnik";
import { LINIE, LINIE_IDS, W_KAZDYM_ZESTAWIE, formatKwh, formatZl, zestawyLinii } from "@/lib/konfigurator";

// Opisy marek, ceny i skład zestawów — z danych konfiguratora (ceny zamrożone 26.10).
const TYTUL = "Magazyn energii Deye czy FoxESS?";

export const metadata: Metadata = {
  title: "Magazyn energii Deye czy FoxESS? Porównanie i ceny — E3000",
  description:
    "Porównanie magazynów energii Deye i FoxESS: dla kogo która marka, plusy i ograniczenia, ceny zestawów 12–24 kWh z falownikiem i montażem. Kielce i okolice.",
  alternates: { canonical: "/magazyn-energii-deye-czy-foxess" },
  openGraph: {
    title: "Magazyn energii Deye czy FoxESS? — E3000",
    description: "Dla kogo która marka, plusy i ograniczenia, ceny zestawów z montażem.",
    url: "/magazyn-energii-deye-czy-foxess",
  },
};

export default function DeyeCzyFox() {
  return (
    <Poradnik
      slug="/magazyn-energii-deye-czy-foxess"
      tytul={TYTUL}
      lead="Montujemy magazyny obu marek i obie dobrze współpracują z fotowoltaiką. Różnią się ceną, dodatkami i tym, gdzie może stać bateria. Poniżej uczciwe porównanie z cenami całych zestawów."
    >
      {LINIE_IDS.map((id) => {
        const l = LINIE[id];
        return (
          <section key={id}>
            <h2>
              {l.nazwa}: {l.haslo.toLowerCase()}
            </h2>
            <p>{l.dlaKogo}</p>
            <h3>Zalety</h3>
            <ul>
              {l.plusy.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
            <h3>Ograniczenia</h3>
            <ul>
              {l.ograniczenia.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </ul>
            <p className="text-base text-ink/70">Wsparcie techniczne: {l.wsparcie}.</p>
          </section>
        );
      })}

      <h2>Ceny zestawów z montażem</h2>
      <p>
        Ceny brutto całych zestawów: falownik hybrydowy, magazyn i montaż. Wielkość dobieramy do mocy paneli — program
        dotacji wymaga co najmniej 2 kWh magazynu na każdy 1 kWp fotowoltaiki.
      </p>
      <Tabela
        naglowki={["Zestaw", "Pojemność", "Do paneli", "Skład", "Cena"]}
        wiersze={LINIE_IDS.flatMap((id) =>
          zestawyLinii(id).map((z) => [z.nazwa, `${formatKwh(z.kwh)} kWh`, `${formatKwh(z.pvMaxKwp)} kWp`, z.sklad, formatZl(z.cena)]),
        )}
      />

      <h2>Co jest w każdym zestawie</h2>
      <ul>
        {W_KAZDYM_ZESTAWIE.map((x) => (
          <li key={x}>{x}</li>
        ))}
      </ul>

      <h2>Którą markę wybrać</h2>
      <p>
        <strong>Deye</strong>, jeśli liczy się cena i chcesz dodatków: grzania wody nadwyżką prądu, agregatu
        uruchamianego automatycznie albo dołożenia magazynu do starej fotowoltaiki bez wymiany falownika. Bateria musi
        stać w ogrzewanym pomieszczeniu.
      </p>
      <p>
        <strong>FoxESS</strong>, jeśli wolisz znaną markę, prostą aplikację i mniej spraw na głowie — także gdy magazyn ma
        stać w garażu, bo baterie mają grzanie. Zasilanie awaryjne całego domu jest w cenie.
      </p>
      <p>
        Nie musisz decydować sam: w <Link href="/#cena">konfiguratorze</Link> przełączasz marki i od razu widzisz cenę,
        dotację i to, gdzie stanie magazyn. Przy rozmowie dopytamy o Twój falownik i miejsce na baterię.
      </p>
      <p>
        Więcej o dotacji: <Link href="/dotacja-do-magazynu-energii">dotacja do magazynu energii w 2026 roku</Link>.
      </p>
    </Poradnik>
  );
}
