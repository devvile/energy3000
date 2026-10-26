// Zrzuty kreatora: node kreator.mjs <url> <prefix> [szerokość]
import { chromium } from "playwright";
const [url, prefix = "kr", w = "1440"] = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: Number(w), height: 900 } });
await page.goto(url, { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
for (let i = 1; i <= 5; i++) {
  await page.screenshot({ path: `${prefix}-krok${i}.png`, fullPage: i === 5 });
  if (i === 2) { await page.locator('button:has-text("Bezobsługowy")').click(); await page.waitForTimeout(1200); await page.screenshot({ path: `${prefix}-krok2-fox.png` }); }
  if (i < 5) { await page.locator('button:has-text("Dalej"), button:has-text("Pokaż zestaw")').first().click(); await page.waitForTimeout(1400); }
}
console.log("ok");
await browser.close();
