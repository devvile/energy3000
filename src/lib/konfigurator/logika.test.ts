// Testy logiki konfiguratora: `npm test` (Node 22 uruchamia TypeScript bez kompilacji).
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { DOTACJA, OPCJE, PAKIETY_PRZYKLADOWE, ZESTAWY } from "./dane.ts";
import {
  STAN_POCZATKOWY,
  doFormularza,
  dopasujRozmiarDoPv,
  dotacjaPme2,
  normalizuj,
  odkoduj,
  opcjeDlaStanu,
  podsumowanie,
  polecanyRozmiar,
  przelaczOpcje,
  ustawLinie,
  ustawOpcje,
  ustawPv,
  ustawRozliczenie,
  ustawRozmiar,
  ustawSytuacje,
  wylicz,
  zakoduj,
  type Stan,
} from "./logika.ts";

const stan = (czesc: Partial<Stan>): Stan => normalizuj({ ...STAN_POCZATKOWY, ...czesc });
// Kwoty mają twarde spacje — do porównań zamieniamy je na zwykłe.
const txt = (s: string) => s.replace(/ /g, " ");

describe("dane", () => {
  it("ceny zestawów zgodne z decyzją wspólników z 2026-10-26", () => {
    const ceny = Object.fromEntries(ZESTAWY.map((z) => [z.nazwa, z.cena]));
    assert.deepEqual(ceny, {
      "Deye S": 23_900,
      "Deye M": 27_900,
      "Deye L": 35_900,
      "Fox S": 24_900,
      "Fox M": 30_900,
      "Fox L": 36_900,
    });
  });

  it("szacunek dotacji zestawu nie przekracza limitów programu", () => {
    for (const z of ZESTAWY) {
      assert.ok(z.dotacjaSzacunek <= z.kwh * DOTACJA.naKwh, z.nazwa);
      assert.ok(z.dotacjaSzacunek <= DOTACJA.limit["net-billing"], z.nazwa);
      assert.ok(z.dotacjaSzacunek < z.cena * DOTACJA.udzial, `${z.nazwa}: dotacja musi być niższa niż 30% całego zestawu (falownik nie jest kwalifikowany)`);
    }
  });

  it("każda opcja ma unikalne id", () => {
    const ids = OPCJE.map((o) => o.id);
    assert.equal(new Set(ids).size, ids.length);
  });
});

describe("pakiety przykładowe z vaulta", () => {
  for (const p of PAKIETY_PRZYKLADOWE) {
    it(`${p.nazwa} = ${p.cena} zł`, () => {
      let s = stan({ linia: p.linia, rozmiar: p.rozmiar });
      for (const id of p.opcje) s = ustawOpcje(s, id, 1);
      assert.equal(wylicz(s).cena, p.cena);
    });
  }
});

describe("wylicz", () => {
  it("zestaw bez opcji: cena, kWh, dotacja z szacunku, po dotacji", () => {
    const w = wylicz(stan({ linia: "deye", rozmiar: "m" }));
    assert.equal(w.cena, 27_900);
    assert.equal(w.kwh, 16);
    assert.equal(w.dotacja, 4_500);
    assert.equal(w.poDotacji, 23_400);
    assert.equal(w.pvMaxKwp, 8);
    assert.equal(w.pozycje.length, 1);
    assert.deepEqual(w.wCenie, []);
  });

  it("Fox: cały dom i garaż są w cenie, nie doliczają się", () => {
    const w = wylicz(stan({ linia: "fox", rozmiar: "m", opcje: { calyDom: 1, garaz: 1 } }));
    assert.equal(w.cena, 30_900);
    assert.deepEqual(
      w.wCenie.map((o) => o.id),
      ["calyDom", "garaz"],
    );
  });

  it("dołożona bateria zwiększa kWh i dotację (30% ceny modułu)", () => {
    const bez = wylicz(stan({ linia: "deye", rozmiar: "m" }));
    const z = wylicz(stan({ linia: "deye", rozmiar: "m", opcje: { bat5: 2 } }));
    assert.equal(z.cena, 27_900 + 2 * 4_290);
    assert.equal(z.kwh, 26);
    assert.equal(z.pvMaxKwp, 13);
    assert.equal(z.dotacja, bez.dotacja + Math.round((2 * 4_290 * 0.3) / 100) * 100);
  });

  it("limit 16 000 zł przy dużej rozbudowie, 8 000 zł w net-meteringu", () => {
    const duzy = stan({ linia: "deye", rozmiar: "l", opcje: { bat5: 2, bat12: 2, bat16: 2 } }); // 90 kWh, magazyn ~65 tys. → 30% > limit
    const w = wylicz(duzy);
    assert.equal(w.dotacja, 16_000);
    assert.equal(w.dotacjaOgraniczonaLimitem, true);
    const nm = wylicz(ustawRozliczenie(duzy, "net-metering"));
    assert.equal(nm.dotacja, 8_000);
    assert.equal(wylicz(ustawRozliczenie(stan({ linia: "deye", rozmiar: "s" }), "net-metering")).dotacja, 3_600);
  });

  it("dotacjaPme2 pilnuje 800 zł/kWh", () => {
    assert.equal(dotacjaPme2(100_000, 10, "net-billing").kwota, 8_000);
    assert.equal(dotacjaPme2(10_000, 100, "net-billing").kwota, 3_000);
  });

  it("reguła 2×: ostrzega, gdy magazyn za mały do PV", () => {
    const w = wylicz(stan({ linia: "deye", rozmiar: "s", pvKwp: 8 }));
    assert.equal(w.pme2.wymaganeKwh, 16);
    assert.equal(w.pme2.spelnia, false);
    assert.ok(w.uwagi.some((u) => u.includes("co najmniej 16 kWh")));
    assert.equal(wylicz(stan({ linia: "deye", rozmiar: "m", pvKwp: 8 })).pme2.spelnia, true);
    assert.equal(wylicz(stan({ linia: "deye", rozmiar: "m" })).pme2.spelnia, null);
  });

  it("stara PV mocniejsza niż falownik → uwaga", () => {
    const w = wylicz(stan({ linia: "deye", rozmiar: "s", opcje: { staraPv: 1 }, pvKwp: 9 }));
    assert.ok(w.uwagi.some((u) => u.includes("mocniejsza niż nowy falownik")));
  });
});

describe("dostępność i normalizacja", () => {
  it("zmiana linii zdejmuje opcje niedostępne w nowej linii", () => {
    const deye = stan({ linia: "deye", rozmiar: "m", opcje: { bat5: 1, licznikLora: 1, staraPv: 1, grzalka: 1 } });
    const fox = ustawLinie(deye, "fox");
    assert.deepEqual(fox.opcje, { grzalka: 1 });
    assert.equal(wylicz(fox).cena, 30_900 + 2_390);
  });

  it("opcje „w cenie” nie są zapisywane w stanie, ale są widoczne jako wCenie", () => {
    const s = stan({ linia: "fox", rozmiar: "l", opcje: { calyDom: 1 } });
    assert.deepEqual(s.opcje, {});
    const o = opcjeDlaStanu(s).find((x) => x.opcja.id === "calyDom");
    assert.equal(o?.status, "wCenie");
    assert.equal(o?.ilosc, 1);
    assert.equal(o?.cena, 0);
  });

  it("moduł 5,8 kWh tylko do Fox M, maks. 1 sztuka", () => {
    assert.deepEqual(stan({ linia: "fox", rozmiar: "m", opcje: { bat58: 3 } }).opcje, { bat58: 1 });
    assert.deepEqual(stan({ linia: "fox", rozmiar: "s", opcje: { bat58: 1 } }).opcje, {});
    const o = opcjeDlaStanu(stan({ linia: "fox", rozmiar: "s" })).find((x) => x.opcja.id === "bat58");
    assert.equal(o?.status, "brak");
    assert.match(o?.powod ?? "", /Fox S/);
  });

  it("moduł 12 kWh w Fox: S maks. 3, L maks. 2, M niedostępny", () => {
    assert.equal(stan({ linia: "fox", rozmiar: "s", opcje: { bat12: 9 } }).opcje.bat12, 3);
    assert.equal(stan({ linia: "fox", rozmiar: "l", opcje: { bat12: 9 } }).opcje.bat12, 2);
    assert.equal(stan({ linia: "fox", rozmiar: "m", opcje: { bat12: 1 } }).opcje.bat12, undefined);
  });

  it("zmiana rozmiaru przycina liczbę sztuk do nowego limitu", () => {
    const s = stan({ linia: "fox", rozmiar: "s", opcje: { bat12: 3 } });
    assert.equal(ustawRozmiar(s, "l").opcje.bat12, 2);
  });

  it("ładowarki wykluczają się: wybór 22 kW zdejmuje 11 kW", () => {
    let s = stan({ linia: "fox", rozmiar: "m" });
    s = ustawOpcje(s, "ladowarka11", 1);
    const o = opcjeDlaStanu(s).find((x) => x.opcja.id === "ladowarka22");
    assert.equal(o?.wykluczonaPrzez, "ladowarka11");
    s = ustawOpcje(s, "ladowarka22", 1);
    assert.deepEqual(s.opcje, { ladowarka22: 1 });
    assert.deepEqual(normalizuj({ ...s, opcje: { ladowarka11: 1, ladowarka22: 1 } }).opcje, { ladowarka11: 1 });
  });

  it("opcja bez ilości nie przyjmuje więcej niż 1", () => {
    assert.equal(stan({ linia: "deye", rozmiar: "m", opcje: { grzalka: 5 } }).opcje.grzalka, 1);
  });

  it("przelaczOpcje włącza i wyłącza", () => {
    const s = przelaczOpcje(stan({}), "agregat");
    assert.equal(s.opcje.agregat, 1);
    assert.equal(przelaczOpcje(s, "agregat").opcje.agregat, undefined);
  });

  it("śmieciowe wejście sprowadza się do stanu początkowego", () => {
    const s = normalizuj({ linia: "huawei" as never, rozmiar: "xl" as never, pvKwp: -3, sytuacja: "?" as never, rozliczenie: "x" as never });
    assert.deepEqual(s, STAN_POCZATKOWY);
  });

  it("pvKwp zaokrągla do 0,1 i przyjmuje przecinek", () => {
    assert.equal(ustawPv(stan({}), "7,25").pvKwp, 7.3);
    assert.equal(ustawPv(stan({}), "").pvKwp, null);
    assert.equal(ustawPv(stan({}), 0).pvKwp, null);
  });
});

describe("dobór wielkości", () => {
  it("polecanyRozmiar wg reguły 2×", () => {
    assert.equal(polecanyRozmiar("deye", 5), "s");
    assert.equal(polecanyRozmiar("deye", 6), "s");
    assert.equal(polecanyRozmiar("deye", 6.5), "m");
    assert.equal(polecanyRozmiar("deye", 10), "l");
    assert.equal(polecanyRozmiar("deye", 13), null);
    assert.equal(polecanyRozmiar("fox", 5.7), "s");
    assert.equal(polecanyRozmiar("fox", 5.8), "m");
    assert.equal(polecanyRozmiar("fox", null), "m");
  });

  it("dopasujRozmiarDoPv ustawia rozmiar, przy za dużej PV daje L", () => {
    assert.equal(dopasujRozmiarDoPv(stan({ linia: "fox", pvKwp: 4 })).rozmiar, "s");
    assert.equal(dopasujRozmiarDoPv(stan({ linia: "fox", pvKwp: 20 })).rozmiar, "l");
  });
});

describe("sytuacja klienta", () => {
  it("falownik innej marki → Deye + magazyn do starej PV", () => {
    const s = ustawSytuacje(stan({ linia: "fox", rozmiar: "l", opcje: { ladowarka11: 1 } }), "hybryda-inna");
    assert.equal(s.linia, "deye");
    assert.equal(s.rozmiar, "l");
    assert.equal(s.opcje.staraPv, 1);
    assert.equal(s.opcje.ladowarka11, undefined); // 11 kW nie ma w Deye
  });

  it("hybryda Deye/Fox → uwaga o samej baterii, brak PV → uwaga o ofercie", () => {
    assert.ok(wylicz(ustawSytuacje(stan({}), "hybryda-deye-fox")).uwagi[0].includes("samą baterię"));
    assert.ok(wylicz(ustawSytuacje(stan({}), "brak-pv")).uwagi[0].includes("paneli, które już działają"));
  });

  it("Fox przy mikroinwerterach dostaje uwagę, bo opcja jest tylko w Deye", () => {
    const s = ustawLinie(ustawSytuacje(stan({}), "mikro-optymalizatory"), "fox");
    assert.ok(wylicz(s).uwagi.some((u) => u.includes("gotową opcję ma Deye")));
  });
});

describe("kodowanie i formularz", () => {
  it("zakoduj ↔ odkoduj zachowuje stan", () => {
    const s = stan({ linia: "fox", rozmiar: "s", opcje: { bat12: 2, agregat: 1 }, rozliczenie: "net-metering", pvKwp: 5.5, sytuacja: "zwykly" });
    const kod = zakoduj(s);
    assert.equal(kod, "l=fox&z=s&o=bat12x2%2Cagregat&r=nm&pv=5.5&s=zwykly");
    assert.deepEqual(odkoduj(kod), s);
    assert.deepEqual(odkoduj(`?${kod}`), s);
    assert.deepEqual(odkoduj(new URLSearchParams(kod)), s);
  });

  it("odkoduj jest odporne na śmieci w URL", () => {
    assert.deepEqual(odkoduj("l=fox&z=m&o=bat5,garaz,zzz,bat58x9&pv=abc"), stan({ linia: "fox", rozmiar: "m", opcje: { bat58: 1 } }));
    assert.deepEqual(odkoduj(""), STAN_POCZATKOWY);
    assert.deepEqual(odkoduj(null), STAN_POCZATKOWY);
  });

  it("doFormularza daje płaskie, czytelne pola", () => {
    const f = doFormularza(stan({ linia: "deye", rozmiar: "m", opcje: { calyDom: 1, agregat: 1 }, pvKwp: 7 }));
    assert.equal(f.zestaw, "Deye M");
    assert.equal(f.linia, "Deye");
    assert.equal(f.opcje, "Cały dom na zasilaniu awaryjnym; Podłączenie agregatu");
    assert.equal(f.cena, 31_480);
    assert.equal(f.dotacja, 4_500);
    assert.equal(f.poDotacji, 26_980);
    assert.equal(f.pvKwp, 7);
    assert.equal(f.konfiguracja, "l=deye&z=m&o=calyDom%2Cagregat&pv=7");
  });

  it("podsumowanie wymienia pozycje, opcje w cenie i sumę", () => {
    const linie = podsumowanie(stan({ linia: "fox", rozmiar: "m", opcje: { bat58: 1 } })).map(txt);
    assert.ok(linie[0].startsWith("Fox M · 17,3 kWh — 30 900 zł"));
    assert.ok(linie.some((l) => l.startsWith("+5,8 kWh pojemności — 5 190 zł")));
    assert.ok(linie.some((l) => l === "Cały dom na zasilaniu awaryjnym — w cenie"));
    assert.ok(linie.some((l) => l.startsWith("Razem: 36 090 zł · pojemność 23,1 kWh")));
  });
});
