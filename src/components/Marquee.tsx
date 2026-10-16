const ITEMS = [
  "Cena od razu",
  "Oddzwaniamy w 30 minut",
  "Pomoc przy dotacji",
  "Montaż w jeden dzień",
  "Elektryk z uprawnieniami",
  "Bezpieczne baterie LFP",
  "Raty 0%",
];

// Nieskończony pasek z obietnicami (treść zdublowana, animacja przesuwa o połowę)
export function Marquee() {
  const row = (hidden?: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden}>
      {ITEMS.map((item) => (
        <span key={item} className="flex items-center whitespace-nowrap px-6 text-[clamp(1.4rem,3vw,2.6rem)] font-medium tracking-[-0.03em] sm:px-10">
          {item}
          <span className="ml-12 inline-block size-2.5 rounded-full bg-sun sm:ml-20" />
        </span>
      ))}
    </div>
  );

  return (
    <div className="relative overflow-hidden border-y border-ink/10 bg-cream py-6 text-ink sm:py-8">
      <div className="marquee flex w-max">
        {row()}
        {row(true)}
      </div>
    </div>
  );
}
