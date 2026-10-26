import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Kreator3d } from "@/components/konfigurator3d/Kreator3d";
import { RevealObserver } from "@/components/RevealObserver";
import { Wycena } from "@/components/Wycena";

// Immersyjny konfigurator „kreator postaci”: scena domu w przekroju, w której pojawia się wybrany sprzęt.
// Wariant do porównania ze stroną główną i /konfigurator. Bez indeksowania — zdejmij `robots`, gdy ma być publiczny.
export const metadata: Metadata = {
  title: "Zbuduj dom, który nie boi się nocy — E3000",
  description: "Zobacz, jak magazyn energii pojawia się w Twoim domu. Cztery wybory, cena i dotacja od razu.",
  robots: { index: false, follow: false },
};

export default function Konfigurator3dPage() {
  return (
    <>
      <RevealObserver />
      <main className="flex flex-1 flex-col">
        <Kreator3d />
        <Wycena />
      </main>
      <Footer />
    </>
  );
}
