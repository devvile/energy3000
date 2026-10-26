// Zbliżenie na krok „Linia”: node linia.mjs <url> <prefix>
import { chromium } from "playwright";
const [url, prefix = "linia"] = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(url, { waitUntil: "networkidle" });
await page.waitForFunction(() => document.documentElement.hasAttribute("data-ready"), null, { timeout: 15000 }).catch(() => {});
await page.evaluate(async () => { const s = document.querySelector("#cena"); const top = s.offsetTop, h = s.offsetHeight; for (let y = top; y < top + h; y += 400) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 100)); } });
const deye = page.locator('#cena button:has-text("Elastyczny")');
const fox = page.locator('#cena button:has-text("Bezobsługowy")');
await deye.scrollIntoViewIfNeeded(); await page.evaluate(() => window.scrollBy(0, -200)); await page.waitForTimeout(1200);
await deye.click(); await page.waitForTimeout(1200);
await page.screenshot({ path: `${prefix}-deye.png` });
await fox.click(); await page.waitForTimeout(400);
await page.screenshot({ path: `${prefix}-fox-w-trakcie.png` });
await page.waitForTimeout(1000);
await page.screenshot({ path: `${prefix}-fox.png` });
console.log("ok");
await browser.close();
