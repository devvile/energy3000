import { Cennik } from "@/components/Cennik";
import { Countdown } from "@/components/Countdown";
import { Dotacja } from "@/components/Dotacja";
import { Faq } from "@/components/Faq";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HeroSequence } from "@/components/HeroSequence";
import { Intro } from "@/components/Intro";
import { Kroki } from "@/components/Kroki";
import { Manifest } from "@/components/Manifest";
import { Marquee } from "@/components/Marquee";
import { Pakiet } from "@/components/Pakiet";
import { Region } from "@/components/Region";
import { RevealObserver } from "@/components/RevealObserver";
import { Wycena } from "@/components/Wycena";
import { PAKIETY, REGION, subsidyFor, zl } from "@/lib/oferta";

const standard = PAKIETY.find((p) => p.featured) ?? PAKIETY[0];

const facts = [
  { label: "Nabór dotacji startuje za", value: <Countdown /> },
  { label: `Magazyn ${standard.kwh} kWh z montażem`, value: zl(standard.price) },
  { label: "Po zwrocie dotacji", value: zl(standard.price - subsidyFor(standard.price, standard.kwh)) },
  { label: "Region", value: REGION },
];

export default function Home() {
  return (
    <>
      <Intro />
      <Header />
      <RevealObserver />

      <main className="flex flex-1 flex-col">
        <HeroSequence facts={facts} />
        <Marquee />
        <Manifest />
        <Pakiet />
        <Cennik />
        <Dotacja />
        <Kroki />
        <Region />
        <Faq />
        <Wycena />
      </main>

      <Footer />
    </>
  );
}
