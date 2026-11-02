// Zgłoszenia z formularza e3000.pl → arkusz Google + mail z powiadomieniem.
// Kopia samodzielnego skryptu Apps Script (projekt „E3000 — zgłoszenia”) na koncie biuro@energy3000.pl; zapisuje do arkusza „E3000 — zgłoszenia”.
// Wdrożenie: Wdróż → Nowe wdrożenie → Aplikacja internetowa; „Wykonaj jako: ja”, „Kto ma dostęp: każdy”.
// Zmiana kodu: Wdróż → Zarządzaj wdrożeniami → ołówek → Wersja: Nowa wersja (adres zostaje ten sam). Strefa projektu: Europe/Warsaw.
// Adres wdrożenia jest TYLKO w zmiennej środowiskowej Vercela ZGLOSZENIA_URL — strona wysyła zgłoszenie
// do /api/zgloszenie, a dopiero serwer przekazuje je tutaj. Skrypt jest samodzielny (script.google.com) i pisze
// do arkusza po jego ID.

const ARKUSZ_ID = "1Kz9frYVcauMj7r-xb9usQ5so099UOdVD47wf8nFwkxc"; // arkusz „E3000 — zgłoszenia” (biuro@)
const POWIADOM = "biuro@e3000.pl";
const KOLUMNY = ["Data", "Imię", "Telefon", "Kod pocztowy", "Moc paneli", "Fotowoltaika", "Zestaw", "Cena (zł)", "Po dotacji (zł)", "Link do konfiguracji", "Uwagi z konfiguratora", "Status", "Kto dzwoni", "Notatki"];

function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents);
    const cyfry = String(d.telefon || "").replace(/\D/g, "");
    if (!d.imie || cyfry.length < 9 || !/^\d{2}-?\d{3}$/.test(String(d.kod || ""))) return wynik({ ok: false, blad: "dane" });
    // Tekst do komórki: krótko i bez formuł (=, +, -, @ na początku zamienia się w zwykły tekst).
    const t = (v) => String(v == null ? "" : v).slice(0, 300).replace(/^[=+\-@]/, "'$&");
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const ark = SpreadsheetApp.openById(ARKUSZ_ID).getSheets()[0];
      if (ark.getLastRow() === 0) {
        ark.appendRow(KOLUMNY);
        ark.setFrozenRows(1);
        ark.getRange(1, 1, 1, KOLUMNY.length).setFontWeight("bold");
      }
      ark.appendRow([
        // Data jako tekst w czasie polskim: Date zapisywany przez appendRow przesuwał się o strefę projektu (USA).
        Utilities.formatDate(new Date(), "Europe/Warsaw", "yyyy-MM-dd HH:mm:ss"), t(d.imie), t(d.telefon), t(d.kod), t(d.moc), t(d.fotowoltaika), t(d.zestaw),
        d.cena ? Number(d.cena) : "", d.poDotacji ? Number(d.poDotacji) : "", t(d.link), t(d.uwagi), "nowe", "", "",
      ]);
    } finally {
      lock.releaseLock();
    }
    MailApp.sendEmail({
      to: POWIADOM,
      subject: "Nowe zgłoszenie z e3000.pl: " + t(d.imie) + ", " + t(d.telefon),
      body:
        "Oddzwoń w ciągu 30 minut.\n\n" +
        "Imię: " + t(d.imie) + "\nTelefon: " + t(d.telefon) + "\nKod pocztowy: " + t(d.kod) +
        "\nMoc paneli: " + (t(d.moc) || "—") + "\nFotowoltaika: " + t(d.fotowoltaika) +
        "\nZestaw: " + (t(d.zestaw) || "— (bez konfiguratora)") +
        (d.cena ? "\nCena: " + d.cena + " zł, po dotacji ok. " + d.poDotacji + " zł" : "") +
        (d.link ? "\nKonfiguracja: " + d.link : "") +
        "\n\nArkusz: " + SpreadsheetApp.openById(ARKUSZ_ID).getUrl(),
    });
    return wynik({ ok: true });
  } catch (err) {
    return wynik({ ok: false, blad: String(err) });
  }
}

function wynik(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

// Uruchom raz ręcznie w edytorze (▶ test), żeby nadać skryptowi uprawnienia do arkusza i poczty.
function test() {
  const e = { postData: { contents: JSON.stringify({ imie: "Test", telefon: "000 000 000", kod: "00-000", fotowoltaika: "tak", zestaw: "test — usuń ten wiersz" }) } };
  Logger.log(doPost(e).getContent());
}
