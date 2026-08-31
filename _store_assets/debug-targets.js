const puppeteer = require('puppeteer-core');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: [
      `--disable-extensions-except=${ROOT}`,
      `--load-extension=${ROOT}`,
      '--window-size=1440,900', '--lang=zh-CN', '--no-first-run', '--disable-sync',
    ],
  });
  for (let i = 0; i < 15; i++) {
    await sleep(1000);
    const targets = browser.targets();
    console.log(`--- t+${i+1}s: ${targets.length} targets`);
    for (const t of targets) console.log(`  [${t.type()}] ${t.url()}`);
    if (targets.some(t => t.url().startsWith('chrome-extension://'))) break;
  }
  const pages = await browser.pages();
  console.log('pages:', pages.map(p => p.url()));
  await browser.close();
})().catch(e => { console.error('FATAL', e.message); process.exit(1); });
