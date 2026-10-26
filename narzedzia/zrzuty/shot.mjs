// Zrzuty sekcji konfiguratora: node shot.mjs <url> <prefix> [szerokość]
import { chromium } from "playwright";
const [url, prefix = "shot", w = "1440"] = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: Number(w), height: 900 }, deviceScaleFactor: 1 });
await page.goto(url, { waitUntil: "networkidle" });
await page.waitForFunction(() => document.documentElement.hasAttribute("data-ready"), null, { timeout: 15000 }).catch(() => {});
await page.evaluate(() => document.querySelector("#cena")?.scrollIntoView({ behavior: "instant" }));
await page.waitForTimeout(1800);
// wejście elementów data-reveal zależy od przewijania — przewiń przez całą sekcję, żeby wszystko się pokazało
await page.evaluate(async () => { const s = document.querySelector("#cena"); const top = s.offsetTop, h = s.offsetHeight; for (let y = top; y < top + h; y += 400) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); } window.scrollTo(0, top); });
await page.waitForTimeout(1500);
const sekcja = page.locator("#cena");
await sekcja.screenshot({ path: `${prefix}-sekcja.png` });
// krok Linia: zrzut widoku po przewinięciu do kafelków
const linia = page.locator("#cena button[aria-pressed]").first();
await linia.scrollIntoViewIfNeeded(); await page.evaluate(() => window.scrollBy(0, -140)); await page.waitForTimeout(900);
await page.screenshot({ path: `${prefix}-linia-deye.png` });
await page.locator("#cena button[aria-pressed]").nth(1).click(); await page.waitForTimeout(1200);
await page.screenshot({ path: `${prefix}-linia-fox.png` });
console.log("ok");
await browser.close();
