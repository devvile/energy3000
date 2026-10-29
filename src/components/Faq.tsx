import { Words } from "./Words";

export const QA: [string, string][] = [
  [
    "Kiedy dostanę dotację?",
    "Po montażu. Wniosek można złożyć dopiero wtedy, gdy magazyn działa, jest zgłoszony do zakładu energetycznego, a faktura jest zapłacona. Na przelew czeka się zwykle 4–7 miesięcy.",
  ],
  [
    "Czy muszę od razu zapłacić całość?",
    "Tak. Dotacja to zwrot części pieniędzy, a nie zniżka przy zakupie. Dlatego można u nas kupić na raty, a gdy dotacja przyjdzie, spłacić nią część kredytu.",
  ],
  [
    "Kto może dostać dotację?",
    "Osoba prywatna, która ma fotowoltaikę podłączoną do sieci i umowę na prąd na siebie. Umowa nie może być na firmę.",
  ],
  [
    "Mam stare zasady rozliczeń (opusty). Czy to się opłaca?",
    "Wtedy dotacja wynosi do 8 000 zł, a po przejściu na nowe zasady (net-billing) do 16 000 zł. Czy warto przechodzić, zależy od instalacji, więc policzymy to razem.",
  ],
  [
    "Po co nowy falownik, skoro mam już jeden?",
    "Starsze falowniki zwykle nie współpracują z baterią. Montujemy wtedy falownik hybrydowy, który steruje i panelami, i magazynem. Wystarczy nam zdjęcie tabliczki, żeby to sprawdzić.",
  ],
  [
    "Ile trwa montaż i gdzie stoi magazyn?",
    "Zwykle jeden dzień i nikt nie wchodzi na dach. Magazyn wisi albo stoi w garażu, kotłowni czy innym pomieszczeniu gospodarczym. Jest wielkości wąskiej szafki.",
  ],
  [
    "Czy magazyn jest bezpieczny?",
    "Montujemy baterie LFP, czyli najbezpieczniejszy rodzaj baterii stosowany w domach. Sprzęt jest nowy, z certyfikatami i znakiem CE.",
  ],
  [
    "Czy magazyn przechowa prąd z lata na zimę?",
    "Nie. Magazyn przesuwa prąd z dnia na wieczór i noc, najwyżej na następny dzień. Za to robi to codziennie, przez cały rok.",
  ],
];

// Najczęstsze pytania — akordeon na <details>, bez JS
export function Faq() {
  return (
    <section id="pytania" className="bg-cream px-5 py-24 text-ink sm:px-8 sm:py-36">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Words text={"Najczęstsze\npytania."} accent="pytania" className="text-[clamp(2.4rem,5vw,5rem)] font-medium leading-[0.95] tracking-[-0.05em]" />
        </div>
        <div className="space-y-3">
          {QA.map(([q, a]) => (
            <details key={q} data-reveal className="faq group rounded-2xl bg-[#ebdfcd] px-5 transition-colors duration-500 open:bg-[#e6d8c3] sm:px-7">
              <summary className="flex cursor-pointer items-center justify-between gap-6 py-5 text-lg font-medium tracking-[-0.02em] sm:py-6 sm:text-xl">
                {q}
                <span className="plus flex size-10 shrink-0 items-center justify-center rounded-full bg-ink/[0.07] text-2xl font-light transition-colors duration-500 group-hover:bg-ink group-hover:text-cream">
                  +
                </span>
              </summary>
              <div className="answer">
                <p className="overflow-hidden pr-14 text-base leading-relaxed text-ink/80 sm:text-lg">
                  <span className="block pb-6">{a}</span>
                </p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
