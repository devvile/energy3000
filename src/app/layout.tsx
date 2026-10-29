import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { SITE_URL } from "@/lib/seo";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "latin-ext"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin", "latin-ext"],
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Magazyn energii do fotowoltaiki z montażem — E3000 Kielce",
  description:
    "Magazyny energii Deye i FoxESS do Twojej fotowoltaiki: dobór, montaż w jeden dzień i pomoc przy dotacji Mój Prąd. Kielce i okolice do 100 km. Cena od razu w konfiguratorze.",
  openGraph: {
    title: "E3000 — Słońce za dnia. Prąd na noc.",
    description: "Magazyn energii do Twojej fotowoltaiki z montażem i pomocą przy dotacji. Kielce + 100 km.",
    locale: "pl_PL",
    type: "website",
    siteName: "E3000",
    url: "/",
  },
};

export const viewport: Viewport = {
  themeColor: "#050605",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pl"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <noscript>
          <style>{`.intro{display:none}.reveal>span{transform:none!important;opacity:1!important}.fade{opacity:1!important;transform:none!important}[data-reveal],[data-reveal] img,[data-reveal] .w>span{opacity:1!important;transform:none!important;clip-path:none!important}`}</style>
        </noscript>
      </body>
    </html>
  );
}
