import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
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
  metadataBase: new URL("https://e3000.pl"),
  title: "E3000 — magazyn energii do Twojej fotowoltaiki | Kielce i okolice",
  description:
    "Dobieramy magazyn energii do Twojej fotowoltaiki, montujemy go w jeden dzień i pomagamy załatwić dotację z programu Mój Prąd. Cenę znasz od razu, oddzwaniamy w 30 minut.",
  openGraph: {
    title: "E3000 — Słońce za dnia. Prąd na noc.",
    description: "Magazyn energii do Twojej fotowoltaiki z montażem i pomocą przy dotacji. Kielce + 100 km.",
    locale: "pl_PL",
    type: "website",
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
