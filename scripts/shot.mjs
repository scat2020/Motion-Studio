import puppeteer from 'puppeteer-core';

// 用法：node scripts/shot.mjs "#card-rive .stage" out.png [waitMs]
const CHROME = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TARGET = process.env.TARGET || 'file:///D:/AI%20Project/Video/motion-studio/dist/index.html';
const sel = process.argv[2] || 'body';
const out = process.argv[3] || 'shot.png';
const waitMs = Number(process.argv[4] || 6000);

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-first-run', '--allow-file-access-from-files'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 2 });
page.on('pageerror', (e) => console.log('[pageerror]', e.message));
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') console.log(`[${m.type()}]`, m.text().slice(0, 160)); });
await page.goto(TARGET, { waitUntil: 'load', timeout: 30000 });
await new Promise((r) => setTimeout(r, waitMs));
const el = await page.$(sel);
if (sel === 'viewport') {
  await page.screenshot({ path: out });
} else if (el) {
  await el.screenshot({ path: out });
} else {
  console.log('selector not found:', sel);
}
console.log('saved', out);
await browser.close();
