import Link from "next/link";
import { BRAND, COMPANY, EMAIL, HOURS, PHONE, PHONE_HREF, REGION } from "@/lib/oferta";
import { PORADNIKI } from "./Poradnik";

// Stopka z wielkim znakiem marki i danymi spółki (wymagane na stronie spółki, art. 206 KSH)
export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#0e0905] px-5 pb-28 pt-20 text-foreground sm:px-8 md:pb-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 pb-14 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <p className="max-w-sm text-2xl font-medium leading-snug tracking-[-0.03em]">
              Magazyny energii do paneli, które już masz. Dobór, montaż i pomoc przy dotacji.
            </p>
            <p className="mt-4 text-sm text-foreground/50">{REGION}</p>
          </div>
          <div className="space-y-2 text-sm">
            <p className="text-sm text-foreground/50">Kontakt</p>
            <a href={PHONE_HREF} className="block text-lg hover:text-sun">
              {PHONE}
            </a>
            <a href={`mailto:${EMAIL}`} className="block hover:text-sun">
              {EMAIL}
            </a>
            <p className="text-foreground/50">{HOURS}</p>
          </div>
          <div className="space-y-2 text-sm">
            <p className="text-sm text-foreground/50">Na skróty</p>
            {[
              ["/#jak-dziala", "Jak to działa"],
              ["/#cena", "Cena"],
              ["/#dotacja", "Dotacja"],
              ["/#pytania", "Pytania"],
            ].map(([href, label]) => (
              <Link key={href} href={href} className="block hover:text-sun">
                {label}
              </Link>
            ))}
            <Link href="/polityka-prywatnosci" className="block hover:text-sun">
              Polityka prywatności
            </Link>
          </div>
          <div className="space-y-2 text-sm">
            <p className="text-sm text-foreground/50">Poradniki</p>
            {PORADNIKI.map((p) => (
              <Link key={p.href} href={p.href} className="block hover:text-sun">
                {p.tytul}
              </Link>
            ))}
          </div>
        </div>

        <p
          aria-hidden
          className="select-none py-6 text-center text-[clamp(7rem,30vw,28rem)] font-medium leading-[0.8] tracking-[-0.07em] text-foreground/[0.07]"
        >
          E<span className="font-serif font-normal italic">3000</span>
        </p>

        <div className="flex flex-col gap-3 pt-6 text-xs leading-relaxed text-foreground/40 md:flex-row md:justify-between">
          <p>
            {BRAND} to marka {COMPANY.name}, {COMPANY.address}. {COMPANY.plant}. KRS {COMPANY.krs}, {COMPANY.court}. NIP{" "}
            {COMPANY.nip}, REGON {COMPANY.regon}, kapitał zakładowy {COMPANY.capital}.
          </p>
          <p className="shrink-0">© 2026 {BRAND}</p>
        </div>
      </div>
    </footer>
  );
}
