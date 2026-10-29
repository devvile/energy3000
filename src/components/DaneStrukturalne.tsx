import { ZESTAWY } from "@/lib/konfigurator/dane";
import { BRAND, COMPANY, EMAIL, PHONE_HREF } from "@/lib/oferta";
import { SITE_URL } from "@/lib/seo";
import { QA } from "./Faq";

// Dane strukturalne (schema.org) dla Google: lokalna firma z obszarem działania i cennikiem zestawów oraz FAQ.
// Ceny i pytania biorą się z tych samych danych co strona — zmiana cennika zmienia też te dane.
// Telefon i godziny są w oferta.ts oznaczone jako PROPOZYCJA — po ustaleniu docelowych podmienić tam.
export function DaneStrukturalne() {
  const firma = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": `${SITE_URL}/#firma`,
    name: BRAND,
    description:
      "Magazyny energii do istniejącej fotowoltaiki: dobór, montaż w jeden dzień i pomoc przy dotacji z programu Przydomowe Magazyny Energii (PME2). Kielce i okolice do 100 km.",
    url: SITE_URL,
    telephone: PHONE_HREF.replace("tel:", ""),
    email: EMAIL,
    image: `${SITE_URL}/opengraph-image.jpg`,
    priceRange: "23 900 – 36 900 zł",
    address: {
      "@type": "PostalAddress",
      streetAddress: "ul. Kielecka 35A",
      postalCode: "26-026",
      addressLocality: "Bilcza",
      addressRegion: "świętokrzyskie",
      addressCountry: "PL",
    },
    areaServed: {
      "@type": "GeoCircle",
      geoMidpoint: { "@type": "GeoCoordinates", latitude: 50.8661, longitude: 20.6286 },
      geoRadius: 100000,
    },
    openingHoursSpecification: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "08:00", closes: "20:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "09:00", closes: "14:00" },
    ],
    parentOrganization: { "@type": "Organization", name: COMPANY.name, taxID: COMPANY.nip },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Magazyny energii z montażem",
      itemListElement: ZESTAWY.map((z) => ({
        "@type": "Offer",
        name: `Magazyn energii ${z.nazwa} ${String(z.kwh).replace(".", ",")} kWh z falownikiem i montażem`,
        price: z.cena,
        priceCurrency: "PLN",
        itemOffered: { "@type": "Product", name: `${z.nazwa} ${String(z.kwh).replace(".", ",")} kWh`, description: z.sklad },
      })),
    },
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: QA.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(firma) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
    </>
  );
}
