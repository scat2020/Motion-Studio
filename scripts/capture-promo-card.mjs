import puppeteer from 'puppeteer-core';
import fs from 'node:fs';

const CHROME = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SRC = 'file:///D:/AI%20Project/Video/motion-studio/dist/index.html';
const OUT = 'remotion-starter/public/promo';

fs.mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-first-run', '--allow-file-access-from-files'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 });
page.on('pageerror', (e) => console.log('[pageerror]', e.message));

await page.goto(SRC, { waitUntil: 'load', timeout: 30000 });
await new Promise((r) => setTimeout(r, 8000));

// 把某张卡片滚到视口中央
const center = async (id) => {
  await page.evaluate((cardId) => {
    const el = document.getElementById('card-' + cardId);
    if (el) el.scrollIntoView({ block: 'center', behavior: 'instant' });
  }, id);
  await new Promise((r) => setTimeout(r, 1400));
};

// 围绕卡片中心裁一块 820 x 627 的区域（16:9 附近的竖构图，供 1020x780 窗口 cover）
const cropAround = async (id, name, targetW = 820) => {
  await center(id);
  const box = await page.evaluate((cardId) => {
    const el = document.getElementById('card-' + cardId);
    const r = el.getBoundingClientRect();
    return {
      cx: r.left + r.width / 2 + window.scrollX,
      cy: r.top + r.height / 2 + window.scrollY,
      w: r.width,
      h: r.height,
    };
  }, id);
  const targetH = Math.round(targetW * (780 / 1020));
  const docH = await page.evaluate(() => document.documentElement.scrollHeight);
  const clip = {
    x: Math.max(0, Math.round(box.cx - targetW / 2)),
    y: Math.min(Math.max(0, Math.round(box.cy - targetH / 2)), Math.max(0, docH - targetH)),
    width: targetW,
    height: targetH,
  };
  fs.writeFileSync(
    `${OUT}/${name}.meta.json`,
    JSON.stringify({ card: box, clip }, null, 2),
  );
  await page.screenshot({ path: `${OUT}/${name}.jpg`, type: 'jpeg', quality: 92, clip });
  console.log('saved', name, clip);
};

// 02 Anime.js：收起状态整卡
const shootCard = async (id, name) => {
  await center(id);
  const box = await page.evaluate((cardId) => {
    const el = document.getElementById('card-' + cardId);
    const r = el.getBoundingClientRect();
    return { x: r.left + window.scrollX, y: r.top + window.scrollY, width: r.width, height: r.height };
  }, id);
  await page.screenshot({
    path: `${OUT}/${name}.jpg`,
    type: 'jpeg',
    quality: 92,
    clip: {
      x: Math.round(box.x),
      y: Math.round(box.y),
      width: Math.round(box.width),
      height: Math.round(box.height),
    },
  });
  console.log('saved', name, box);
};

await shootCard('animejs', 'promo-07-anime-card');

// 02 Anime.js：点开「看代码」后的整卡（含源码面板）
await page.evaluate(() => {
  const card = document.getElementById('card-animejs');
  const btns = [...card.querySelectorAll('button')];
  const b = btns.find((x) => x.textContent.includes('看代码'));
  if (b) b.click();
});
await new Promise((r) => setTimeout(r, 1200));
await shootCard('animejs', 'promo-08-anime-code');

// 06 Manim：桌面管线卡（整卡裁切，供 Remotion 里 contain 展示）
await center('manim');
const cardBox = await page.evaluate(() => {
  const el = document.getElementById('card-manim');
  const r = el.getBoundingClientRect();
  return { x: r.left + window.scrollX, y: r.top + window.scrollY, width: r.width, height: r.height };
});
await page.screenshot({
  path: `${OUT}/promo-04-pipeline.jpg`,
  type: 'jpeg',
  quality: 92,
  clip: {
    x: Math.round(cardBox.x),
    y: Math.round(cardBox.y),
    width: Math.round(cardBox.width),
    height: Math.round(cardBox.height),
  },
});
console.log('saved promo-04-pipeline (card only)', cardBox);

// 05 Motion Canvas 也补一张，备用替换
await cropAround('motioncanvas', 'promo-06-canvas', 820);

await browser.close();
