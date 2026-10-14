export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-4 text-center">
      <p className="text-sm font-medium uppercase tracking-widest text-emerald-600">
        Strona w budowie
      </p>
      <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">
        ENERGY3000
      </h1>
      <p className="max-w-md text-lg text-foreground/70">
        Magazyny energii do istniejącej fotowoltaiki — z montażem i pomocą przy
        dotacji Mój Prąd. Już wkrótce.
      </p>
      <a
        href="mailto:kontakt@energy3000.pl"
        className="rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-80"
      >
        kontakt@energy3000.pl
      </a>
    </main>
  );
}
