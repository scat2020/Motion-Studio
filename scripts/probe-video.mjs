import puppeteer from 'puppeteer-core';

const CHROME = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const file = process.argv[2] || 'out/title.mp4';
const abs = 'file:///' + file.replace(/\\/g, '/').replace(/^\//, '');

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-first-run', '--allow-file-access-from-files'] });
const page = await browser.newPage();
await page.setContent('<html><body><video id="v" src="' + abs + '" preload="metadata"></video></body></html>');
const info = await page.evaluate(async () => {
  const v = document.getElementById('v');
  await new Promise((res, rej) => {
    v.onloadedmetadata = res;
    v.onerror = () => rej(new Error('video load error'));
    setTimeout(res, 5000);
  });
  return { duration: v.duration, w: v.videoWidth, h: v.videoHeight };
});
console.log(JSON.stringify(info));
await browser.close();
