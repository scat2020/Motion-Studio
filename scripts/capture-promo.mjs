import puppeteer from 'puppeteer-core';
import fs from 'node:fs';

const CHROME = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SRC = 'file:///D:/AI%20Project/Video/motion-studio/dist/index.html';
const OUT = 'remotion-starter/public/promo';

fs.mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-first-run', '--allow-file-access-from-files', '--force-device-scale-factor=2'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 });
page.on('pageerror', (e) => console.log('[pageerror]', e.message));

await page.goto(SRC, { waitUntil: 'load', timeout: 30000 });
await new Promise((r) => setTimeout(r, 8000));

const shot = async (name) => {
  await page.screenshot({ path: `${OUT}/${name}.jpg`, type: 'jpeg', quality: 92 });
  console.log('saved', name);
};

const center = async (id) => {
  await page.evaluate((cardId) => {
    const el = document.getElementById('card-' + cardId);
    if (el) el.scrollIntoView({ block: 'center', behavior: 'instant' });
  }, id);
  await new Promise((r) => setTimeout(r, 1500));
};

// 1) 首屏：侧栏 + 01 Remotion + 02 Anime
await page.evaluate(() => window.scrollTo(0, 0));
await new Promise((r) => setTimeout(r, 800));
await shot('promo-01-hero');

// 2) LIVE 区：02 Anime / 03 Motion
await center('animejs');
await shot('promo-02-live');

// 3) 展开代码面板：02 Anime 的源码
await page.evaluate(() => {
  const card = document.getElementById('card-animejs');
  const btns = [...card.querySelectorAll('button')];
  const b = btns.find((x) => x.textContent.includes('看代码'));
  if (b) b.click();
});
await new Promise((r) => setTimeout(r, 1200));
await center('animejs');
await shot('promo-03-code');

// 4) 管线卡片：06 Manim
await center('manim');
await shot('promo-04-pipeline');

// 5) 形变与模拟：17 Three.js / 19 Matter
await center('three');
await shot('promo-05-3d');

await browser.close();
