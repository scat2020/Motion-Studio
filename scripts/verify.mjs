import puppeteer from 'puppeteer-core';

const CHROME = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TARGET = process.argv[2] || 'file:///D:/AI%20Project/Video/motion-studio/dist/index.html';

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-first-run', '--disable-extensions', '--allow-file-access-from-files'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 });

const logs = [];
page.on('console', (m) => logs.push(`[${m.type()}] ${m.text()}`));
page.on('pageerror', (e) => logs.push(`[pageerror] ${e.message}`));
page.on('requestfailed', (r) => logs.push(`[reqfail] ${r.url().slice(0, 90)} :: ${r.failure()?.errorText}`));

await page.goto(TARGET, { waitUntil: 'load', timeout: 30000 });
await new Promise((r) => setTimeout(r, 5000));

const probe = await page.evaluate(() => {
  const out = { cards: [], canvases: [] };
  document.querySelectorAll('.card').forEach((c) => {
    const name = c.querySelector('h4')?.textContent;
    const err = c.querySelector('.rive-fallback')?.textContent?.trim();
    const canvas = c.querySelector('canvas');
    out.cards.push({
      name,
      height: Math.round(c.getBoundingClientRect().height),
      fallback: err || null,
      canvas: canvas ? `${canvas.width}x${canvas.height} css=${canvas.style.width || ''}` : null,
    });
  });
  document.querySelectorAll('canvas').forEach((c, i) => out.canvases.push({ i, w: c.width, h: c.height }));
  return out;
});

console.log('=== CARDS ===');
probe.cards.forEach((c) => console.log(JSON.stringify(c)));
console.log('=== CANVAS ===');
probe.canvases.forEach((c) => console.log(JSON.stringify(c)));
console.log('=== LOGS ===');
logs.forEach((l) => console.log(l));
console.log('=== PATH ===');
console.log('total height', await page.evaluate(() => document.body.scrollHeight));

await page.screenshot({ path: 'verify-puppeteer.png', fullPage: true });
await browser.close();
