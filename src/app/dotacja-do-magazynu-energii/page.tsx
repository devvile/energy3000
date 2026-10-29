import type { Metadata } from "next";
import Link from "next/link";
import { Poradnik, Tabela } from "@/components/Poradnik";
import { ZESTAWY } from "@/lib/konfigurator/dane";
import { formatKwh, formatZl } from "@/lib/konfigurator";
import { SUBSIDY } from "@/lib/oferta";

// Źródła: regulamin, program i FAQ PME2 (przydomowemagazyny.gov.pl), analiza w vaulcie
// „40 Rezercz/PME2 — analiza regulaminu i programu”. Falownik i EMS nie są kosztem kwalifikowanym (FAQ, pyt. 9, 10, 24).
const TYTUL = "Dotacja do magazynu energii w 2026 roku";

export const metadata: Metadata = {
  title: "Dotacja do magazynu energii 2026 (PME2, dawniej Mój Prąd) — E3000",
  description:
    "Ile wynosi dotacja do domowego magazynu energii z programu Przydomowe Magazyny Energii (PME2), kto może ją dostać, jakie są wymagania i kiedy przychodzą pieniądze. Przykłady dla zestawów Deye i FoxESS.",
  alternates: { canonical: "/dotacja-do-magazynu-energii" },
  openGraph: {
    title: "Dotacja do magazynu energii 2026 (PME2) — E3000",
    description: "Ile wynosi dotacja do magazynu energii, kto może ją dostać i kiedy przychodzą pieniądze.",
    url: "/dotacja-do-magazynu-energii",
  },
};

export default function DotacjaPoradnik() {
  return (
    <Poradnik
      slug="/dotacja-do-magazynu-energii"
      tytul={TYTUL}
      lead="Od 20 października 2026 r. dotacje do domowych magazynów energii daje program Przydomowe Magazyny Energii, część 2 (PME2) — następca programu Mój Prąd. Wyjaśniamy, ile można dostać, kto może złożyć wniosek i kiedy przychodzą pieniądze."
    >
      <h2>Ile wynosi dotacja do magazynu energii</h2>
      <p>
        Program zwraca <strong>30% kosztu magazynu energii z montażem</strong> (liczonego brutto, z VAT), ale nie więcej
        niż <strong>800 zł za każdą kWh</strong> pojemności i nie więcej niż:
      </p>
      <ul>
        <li>
          <strong>16 000 zł</strong>, jeśli rozliczasz fotowoltaikę w net-billingu (instalacje zgłoszone od kwietnia 2022)
          albo przejdziesz z net-meteringu na net-billing,
        </li>
        <li>
          <strong>8 000 zł</strong>, jeśli zostajesz przy starych zasadach (net-metering, czyli opusty).
        </li>
      </ul>
      <p>
        Ważne: <strong>falownik i system zarządzania energią (EMS) nie są kosztem kwalifikowanym</strong>. Dotacja liczy się
        tylko od samego magazynu z montażem, więc w praktyce wynosi kilkanaście–dwadzieścia kilka procent ceny całego
        zestawu. Program przewiduje też dodatkowe do 2 000 zł za urządzenia wyprodukowane w UE — zestawy, które
        montujemy, mają sprzęt spoza UE, więc tej premii nie doliczamy.
      </p>

      <h3>Przykłady dla naszych zestawów</h3>
      <Tabela
        naglowki={["Zestaw", "Pojemność", "Cena z montażem", "Dotacja (szacunek)", "Po dotacji"]}
        wiersze={ZESTAWY.map((z) => [
          z.nazwa,
          `${formatKwh(z.kwh)} kWh`,
          formatZl(z.cena),
          `ok. ${formatZl(z.dotacjaSzacunek)}`,
          `ok. ${formatZl(z.cena - z.dotacjaSzacunek)}`,
        ])}
      />
      <p className="text-base text-ink/70">
        Szacunek przy net-billingu. Dokładna kwota zależy od tego, jaka część faktury przypada na magazyn z montażem —
        policzymy ją przy wycenie.
      </p>

      <h2>Kto może dostać dotację</h2>
      <ul>
        <li>osoba prywatna, która ma fotowoltaikę przyłączoną do sieci i jest prosumentem,</li>
        <li>
          wniosek składa <strong>strona umowy na prąd</strong> — nie może tego zrobić za nią np. współmałżonek, a umowa
          nie może być na firmę,
        </li>
        <li>jeden magazyn na jedną mikroinstalację,</li>
        <li>
          dotacji nie łączy się z innymi publicznymi pieniędzmi na to samo urządzenie (np. programy gminne, Mój Prąd,
          Czyste Powietrze).
        </li>
      </ul>

      <h2>Wymagania dla magazynu</h2>
      <ul>
        <li>
          pojemność <strong>co najmniej 10 kWh</strong> i <strong>co najmniej 2 kWh na każdy 1 kWp</strong> paneli
          (instalacja 8 kWp potrzebuje magazynu min. 16 kWh),
        </li>
        <li>magazyn zamontowany na stałe pod adresem instalacji,</li>
        <li>praca wyspowa, czyli zasilanie awaryjne przy braku prądu w sieci,</li>
        <li>
          system zarządzania energią (EMS), który sam decyduje o ładowaniu i rozładowaniu na podstawie prognozy pogody
          albo cen energii — w naszych zestawach jest wbudowany w falownik,
        </li>
        <li>urządzenia fabrycznie nowe, z oznaczeniem CE.</li>
      </ul>

      <h2>Jak to wygląda krok po kroku</h2>
      <p>
        Dotacja to <strong>zwrot pieniędzy po montażu</strong>, a nie zniżka przy zakupie. Najpierw płacisz całość —
        gotówką albo{" "}
        <Link href="/#cena">na raty</Link>, a po wypłacie dotacji możesz spłacić nią część kredytu.
      </p>
      <ol>
        <li>Montaż magazynu i protokół odbioru z numerami seryjnymi urządzeń.</li>
        <li>Zgłoszenie magazynu do zakładu energetycznego — jego potwierdzenie zamyka inwestycję.</li>
        <li>
          Wniosek w internetowym generatorze NFOŚiGW, podpisany profilem zaufanym, z fakturą, dowodem zapłaty
          (przelew), protokołem i zaświadczeniami od operatora sieci.
        </li>
        <li>Ocena wniosku (do 120 dni, termin może się wydłużyć), uchwała, umowa i wypłata.</li>
      </ol>
      <p>
        Realnie na przelew czeka się <strong>{SUBSIDY.payoutMonths} miesięcy</strong> od złożenia wniosku. Wniosek można
        poprawiać najwyżej dwa razy, za każdym razem w 10 dni roboczych, a wezwania przychodzą e-mailem — warto sprawdzać
        folder spam.
      </p>

      <h2>Nabór i pula pieniędzy</h2>
      <p>
        Wnioski można składać od 20 października 2026 r. do {SUBSIDY.end} albo do wyczerpania puli {SUBSIDY.pool}. Liczy
        się kolejność zgłoszeń, więc kompletny wniosek złożony wcześnie ma przewagę.
      </p>

      <h2>Obowiązki po otrzymaniu dotacji</h2>
      <ul>
        <li>przez 5 lat magazyn zostaje pod tym samym adresem (bez sprzedaży i demontażu),</li>
        <li>w widocznym miejscu wisi tablica informacyjna o dofinansowaniu,</li>
        <li>NFOŚiGW może przyjechać na kontrolę.</li>
      </ul>

      <h2>Co robimy za Ciebie</h2>
      <p>
        Dobieramy magazyn tak, żeby spełniał wymagania programu, montujemy go w jeden dzień, zgłaszamy do zakładu
        energetycznego, przygotowujemy fakturę z osobnymi pozycjami i protokół na urzędowym wzorze oraz pomagamy złożyć
        wniosek. Działamy w Kielcach i okolicach do 100 km.
      </p>
      <p className="text-base text-ink/70">
        Źródło: program, regulamin naboru i FAQ na{" "}
        <a href="https://przydomowemagazyny.gov.pl/" rel="noopener">
          przydomowemagazyny.gov.pl
        </a>{" "}
        (stan na październik 2026). O przyznaniu dotacji decyduje NFOŚiGW.
      </p>
    </Poradnik>
  );
}
