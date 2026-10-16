"use client";

import Link from "next/link";
import { type CSSProperties, useEffect, useState } from "react";
import { PHONE, PHONE_HREF } from "@/lib/oferta";

const NAV = [
  ["#jak-dziala", "Jak to działa"],
  ["#cena", "Cena"],
  ["#dotacja", "Dotacja"],
  ["#pytania", "Pytania"],
];

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" aria-label="E3000 — strona główna" className={`flex items-baseline text-lg font-semibold tracking-tight ${className}`}>
      E<span className="font-serif text-[1.4em] font-normal italic leading-none">3000</span>
    </Link>
  );
}

// Pływający nagłówek: przezroczysty nad hero, po przewinięciu rozmyte tło. Na telefonie dolny pasek z akcjami.
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      setPastHero(window.scrollY > window.innerHeight * 0.8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className="fade fixed inset-x-0 top-0 z-40 px-3 pt-3 sm:px-5 sm:pt-4"
        style={{ "--d": "150ms" } as CSSProperties}
      >
        <div
          className={`mx-auto flex max-w-[90rem] items-center justify-between rounded-full px-4 py-2.5 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] sm:px-6 ${
            scrolled ? "border border-white/10 bg-[#140c07]/60 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.6)] backdrop-blur-xl" : "border border-transparent"
          }`}
        >
          <Logo />
          <nav className="hidden items-center gap-8 text-sm text-foreground/80 md:flex">
            {NAV.map(([href, label]) => (
              <a key={href} href={href} className="transition-colors hover:text-foreground">
                {label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2 sm:gap-4">
            <a href={PHONE_HREF} className="hidden text-sm tabular-nums text-foreground/85 hover:text-foreground lg:block">
              {PHONE}
            </a>
            <a
              href="#wycena"
              className="rounded-full bg-cream px-4 py-2 text-sm font-medium text-ink transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-105 sm:px-5"
            >
              Bezpłatna wycena
            </a>
          </div>
        </div>
      </header>

      {/* Telefon: stały pasek z akcjami po zjechaniu z hero */}
      <div
        className={`fixed inset-x-3 bottom-3 z-40 grid grid-cols-2 gap-2 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden ${
          pastHero ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-24 opacity-0"
        }`}
        style={{ marginBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <a href={PHONE_HREF} className="rounded-full border border-white/15 bg-[#140c07]/80 py-3.5 text-center text-sm font-medium backdrop-blur-xl">
          Zadzwoń
        </a>
        <a href="#wycena" className="rounded-full bg-sun py-3.5 text-center text-sm font-medium text-ink">
          Bezpłatna wycena
        </a>
      </div>
    </>
  );
}
