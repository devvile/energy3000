// Adres główny strony (decyzja 29.10: e3000.pl; energy3000.pl przekierowuje na niego w ustawieniach domen Vercela).
import type { Metadata } from "next";

export const SITE_URL = "https://e3000.pl";

// Wspólne ustawienia udostępniania (Open Graph). Next nie łączy openGraph z layoutu i podstrony — podstrona,
// która ustawia własne openGraph, zastępuje całość. Dlatego każda strona rozwija OG_BAZA i dopisuje swoje pola.
export const OG_BAZA = {
  siteName: "E3000",
  locale: "pl_PL",
  type: "website",
  images: [{ url: "/opengraph-image.jpg", width: 1200, height: 630, alt: "Magazyn energii na ścianie domu o zachodzie słońca — E3000" }],
} satisfies NonNullable<Metadata["openGraph"]>;
