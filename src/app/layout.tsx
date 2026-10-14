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
  title: "ENERGY3000 — magazyny energii do fotowoltaiki",
  description:
    "Magazyny energii do istniejącej fotowoltaiki — dobór, montaż i wniosek o dotację z programu Przydomowe Magazyny Energii. Strona startuje wkrótce.",
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
          <style>{`.intro{display:none}.reveal>span{transform:none!important;opacity:1!important}.fade{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </body>
    </html>
  );
}
