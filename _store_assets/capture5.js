// 重拍 v3：清空预选 → 确定性点选 3 个引擎 → 断言计数=3 才落图
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const CHROME = 'C:\\Users\\ZhuanZ\\AppData\\Local\\puppeteer-browsers\\chrome-win64\\chrome.exe';
const ROOT = path.resolve(__dirname, '..');
const OUT = __dirname;
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME, headless: 'new',
    args: [`--disable-extensions-except=${ROOT}`, `--load-extension=${ROOT}`,
      '--window-size=1440,900', '--lang=zh-CN', '--no-first-run', '--disable-sync'],
  });
  let extId = null;
  for (let i = 0; i < 50 && !extId; i++) {
    for (const t of browser.targets()) {
      const m = t.url().match(/^chrome-extension:\/\/([^/]+)/);
      if (m) { extId = m[1]; break; }
    }
    if (!extId) await sleep(300);
  }
  console.log('EXT_ID:', extId);

  const shootMain = async (theme) => {
    const p = await browser.newPage();
    await p.setViewport({ width: 1280, height: 800, deviceScaleFactor: 2 });
    await p.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: theme }]);
    await p.goto(`chrome-extension://${extId}/index.html`, { waitUntil: 'networkidle0' });
    await p.evaluate(() => { localStorage.setItem('language', 'zh-CN'); });
    await p.reload({ waitUntil: 'networkidle0' });
    await sleep(1200);
    const res = await p.evaluate(() => {
      // 1) 清掉所有已选（含默认预选与 storage 恢复）
      const clear = () => {
        document.querySelectorAll('.engine-card.selected').forEach(c => c.click());
      };
      clear(); clear(); // 两轮防 toggle 时序
      // 2) 点选 AI 搜索组前 3 张卡
      const cards = document.querySelectorAll('.engine-card:not(.engine-card-add):not(.engine-card-compact)');
      let clicked = 0;
      for (const c of cards) {
        if (clicked >= 3) break;
        if (!c.classList.contains('selected')) { c.click(); clicked++; }
      }
      return clicked;
    });
    await sleep(500);
    const cnt = await p.evaluate(() => document.getElementById('selectedCount').textContent.trim());
    if (!cnt.startsWith('3')) { console.error(`FAIL ${theme}: count="${cnt}"`); await browser.close(); process.exit(2); }
    await p.type('#searchInput', 'AI 搜索引擎 2026');
    await sleep(400);
    const name = theme === 'light' ? 's1-main-light.png' : 's5-main-dark.png';
    await p.screenshot({ path: path.join(OUT, 'raw', name) });
    console.log(name, '| clicked', res, '| count =', cnt);
    await p.close();
  };
  await shootMain('light');
  await shootMain('dark');
  await browser.close();
  console.log('ALL_DONE');
})().catch(e => { console.error('FATAL', e); process.exit(1); });
