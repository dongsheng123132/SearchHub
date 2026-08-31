// 真实UI截图管线 — 用本机 Chrome --load-extension 加载 v1.3.3 扩展，抓核心界面
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME = 'C:\\Users\\ZhuanZ\\AppData\\Local\\puppeteer-browsers\\chrome-win64\\chrome.exe';
const ROOT = path.resolve(__dirname, '..'); // SearchHub/ 扩展根目录
const OUT = __dirname;
const PROFILE = path.join(OUT, 'chrome-profile');

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

(async () => {
  fs.rmSync(PROFILE, { recursive: true, force: true });
  fs.mkdirSync(path.join(OUT, 'raw'), { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: [
      `--disable-extensions-except=${ROOT}`,
      `--load-extension=${ROOT}`,
      '--window-size=1440,900',
      '--lang=zh-CN',
      '--no-first-run', '--no-default-browser-check', '--disable-sync',
      '--disable-features=ChromeWhatsNewUI',
    ],
  });

  // 拿到扩展的 chrome-extension:// ID
  const extId = await new Promise((resolve) => {
    const t = setTimeout(() => resolve(null), 15000);
    chromeTarget(browser, (id) => { clearTimeout(t); resolve(id); });
  });
  async function chromeTarget(browser, cb) {
    for (let i = 0; i < 100; i++) {
      const pages = await browser.pages();
      for (const p of pages) if (p.url().startsWith('chrome-extension://')) return cb(p.url().split('/')[2]);
      const targets = browser.targets();
      for (const t of targets) {
        if (t.type() === 'service_worker' || t.url().startsWith('chrome-extension://')) {
          const m = t.url().match(/^chrome-extension:\/\/([^/]+)/);
          if (m) return cb(m[1]);
        }
        }
      await sleep(200);
    }
    cb(null);
  }
  if (!extId) { console.error('FATAL: extension id not found'); await browser.close(); process.exit(1); }
  console.log('EXT_ID:', extId);

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 2 });

  // ===== 截图1：主界面（多引擎选择 + 快捷组合），中文，浅色 =====
  await page.goto(`chrome-extension://${extId}/index.html`, { waitUntil: 'networkidle0' });
  await page.evaluate(() => localStorage.setItem('language', 'zh-CN'));
  await page.reload({ waitUntil: 'networkidle0' });
  await sleep(1200);
  // 输入示例查询让界面有内容感
  await page.type('#searchInput', 'AI 搜索引擎 2026');
  await sleep(300);
  await page.screenshot({ path: path.join(OUT, 'raw', 'shot1-main.png') });
  console.log('shot1 done');

  // ===== 截图2：popup 弹窗（轻量搜索） =====
  const popup = await browser.newPage();
  await popup.setViewport({ width: 400, height: 620, deviceScaleFactor: 2 });
  await popup.goto(`chrome-extension://${extId}/popup.html`, { waitUntil: 'networkidle0' });
  await sleep(1000);
  await popup.type('#searchInput', 'AI 搜索引擎 2026');
  await sleep(300);
  await popup.screenshot({ path: path.join(OUT, 'raw', 'shot2-popup.png') });
  console.log('shot2 done');

  // ===== 截图3：设置页（展示自定义/个性化） =====
  const settings = await browser.newPage();
  await settings.setViewport({ width: 1280, height: 800, deviceScaleFactor: 2 });
  await settings.goto(`chrome-extension://${extId}/settings.html`, { waitUntil: 'networkidle0' });
  await sleep(1200);
  await settings.screenshot({ path: path.join(OUT, 'raw', 'shot3-settings.png') });
  console.log('shot3 done');

  // ===== 截图4：侧边栏（垂直标签管理，预置演示数据） =====
  const sidebar = await browser.newPage();
  await sidebar.setViewport({ width: 380, height: 800, deviceScaleFactor: 2 });
  await sidebar.goto(`chrome-extension://${extId}/sidebar.html`, { waitUntil: 'networkidle0' });
  await sleep(800);
  // 注入演示标签组数据，让侧边栏不空
  await sidebar.evaluate(() => {
    const demoGroups = [
      { name: 'AI 搜索引擎 2026', color: 'blue', tabs: [
        { title: 'Perplexity - AI 搜索', url: 'https://perplexity.ai' },
        { title: '秘塔 AI 搜索', url: 'https://metaso.cn' },
        { title: 'Genspark', url: 'https://genspark.ai' },
        { title: 'Felo AI', url: 'https://felo.ai' } ] },
      { name: 'AI Chat', color: 'purple', tabs: [
        { title: '豆包', url: 'https://doubao.com' },
        { title: 'DeepSeek', url: 'https://chat.deepseek.com' },
        { title: 'Kimi', url: 'https://kimi.moonshot.cn' } ] },
      { name: '传统搜索', color: 'green', tabs: [
        { title: '百度一下', url: 'https://baidu.com' },
        { title: 'Google', url: 'https://google.com' } ] },
    ];
    window.__demoGroups = demoGroups;
    // 若侧边栏支持 storage 注入则写入，否则靠真实UI结构渲染 demo HTML
    try { chrome.storage.local.set({ __demoGroups }); } catch (e) {}
  });
  await sleep(500);
  await sidebar.screenshot({ path: path.join(OUT, 'raw', 'shot4-sidebar.png') });
  console.log('shot4 done');

  await browser.close();
  console.log('ALL_DONE');
})().catch(e => { console.error('FATAL', e); process.exit(1); });
