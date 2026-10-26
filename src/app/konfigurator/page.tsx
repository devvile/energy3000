import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { KonfiguratorKroki } from "@/components/konfigurator/KonfiguratorKroki";
import { RevealObserver } from "@/components/RevealObserver";
import { Wycena } from "@/components/Wycena";

// Alternatywny landing: konfigurator krok po kroku (kreator) zamiast przewijanej sekcji ze strony głównej.
// Do porównania ze stroną główną (np. w reklamach). Na razie bez indeksowania — zdejmij `robots`, gdy ma być publiczny.
export const metadata: Metadata = {
  title: "Złóż swój magazyn energii — E3000",
  description: "Cztery pytania i wiesz, ile kosztuje magazyn energii do Twoich paneli i ile wraca z dotacji. Kielce + 100 km.",
  robots: { index: false, follow: false },
};

export default function KonfiguratorPage() {
  return (
    <>
      <Header />
      <RevealObserver />
      <main className="flex flex-1 flex-col">
        <KonfiguratorKroki />
        <Wycena />
      </main>
      <Footer />
    </>
  );
}
