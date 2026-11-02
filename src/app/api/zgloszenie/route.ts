// Zgłoszenie z formularza „Oddzwonimy w pół godziny” → skrypt Google Apps Script → arkusz na koncie biuro@ + mail.
// Adres wdrożenia skryptu (długi, losowy) jest tylko po stronie serwera — zmienna ZGLOSZENIA_URL na Vercelu —
// więc z przeglądarki nie da się pisać do arkusza z pominięciem tej trasy. Kopia skryptu: narzedzia/zgloszenia-apps-script.gs.

const tekst = (v: unknown, max = 120) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(request: Request) {
  const url = process.env.ZGLOSZENIA_URL;
  if (!url) return Response.json({ ok: false, blad: "brak konfiguracji" }, { status: 503 });

  let d: Record<string, unknown>;
  try {
    d = await request.json();
  } catch {
    return Response.json({ ok: false, blad: "zly format" }, { status: 400 });
  }

  // Pułapka na boty: pole ukryte przed ludźmi. Wypełnione → udajemy sukces i nic nie zapisujemy.
  if (tekst(d.firma)) return Response.json({ ok: true });

  const imie = tekst(d.imie, 60);
  const telefon = tekst(d.telefon, 30);
  const kod = tekst(d.kod, 10);
  if (!imie || telefon.replace(/\D/g, "").length < 9 || !/^\d{2}-?\d{3}$/.test(kod)) {
    return Response.json({ ok: false, blad: "niepoprawne dane" }, { status: 400 });
  }
  const konfiguracja = tekst(d.konfiguracja, 400);
  const pola = {
    imie,
    telefon,
    kod,
    moc: tekst(d.moc, 20),
    fotowoltaika: tekst(d.fotowoltaika, 5),
    zestaw: tekst(d.zestaw, 200),
    cena: Number(d.cena) || "",
    poDotacji: Number(d.poDotacji) || "",
    uwagi: tekst(d.uwagi, 300),
    link: konfiguracja ? `https://e3000.pl/?${konfiguracja}#cena` : "",
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pola),
      redirect: "follow",
    });
    const wynik = (await res.json().catch(() => null)) as { ok?: boolean } | null;
    if (!wynik?.ok) return Response.json({ ok: false, blad: "zapis nieudany" }, { status: 502 });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false, blad: "brak polaczenia" }, { status: 502 });
  }
}
