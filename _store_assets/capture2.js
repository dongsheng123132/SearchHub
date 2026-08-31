// 补拍：侧边栏（灌演示数据走真实渲染）+ 深色主界面
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

  // ===== 侧边栏：mock tabGroups/tabs 后调用真实 renderTabs =====
  const sidebar = await browser.newPage();
  await sidebar.setViewport({ width: 420, height: 800, deviceScaleFactor: 2 });
  await sidebar.goto(`chrome-extension://${extId}/sidebar.html`, { waitUntil: 'networkidle0' });
  await sidebar.evaluate(() => localStorage.setItem('language', 'zh-CN'));
  await sidebar.reload({ waitUntil: 'networkidle0' });
  await sleep(800);
  await sidebar.evaluate(() => {
    const NOW = Date.now();
    const groups = [
      { id: 1, title: 'AI 搜索引擎 2026', color: 'blue',   windowId: 1 },
      { id: 2, title: 'AI Chat',         color: 'purple', windowId: 1 },
      { id: 3, title: '传统搜索',         color: 'green',  windowId: 1 },
    ];
    const mk = (gid, arr) => arr.map(([t, u], i) => ({
      id: gid * 100 + i, title: t, url: u, groupId: gid, windowId: 1,
      favIconUrl: '', active: i === 0, pinned: false, audible: false,
      discarded: false, autoDiscardable: true, highlighted: false, incognito: false, index: i,
    }));
    const tabs = [
      ...mk(1, [['Perplexity - AI 搜索引擎 2026', 'https://perplexity.ai/search?q=ai'],
                ['秘塔 AI 搜索', 'https://metaso.cn/?q=ai'],
                ['Genspark — AI Agent 搜索', 'https://genspark.ai'],
                ['Felo AI 搜索', 'https://felo.ai/search']]),
      ...mk(2, [['豆包 - AI 智能助手', 'https://doubao.com/chat'],
                ['DeepSeek 对话', 'https://chat.deepseek.com'],
                ['Kimi - 长文本 AI', 'https://kimi.moonshot.cn']]),
      ...mk(3, [['百度一下,你就知道', 'https://baidu.com/s?wd=ai'],
                ['Google 搜索', 'https://google.com/search?q=ai']]),
    ];
    chrome.tabGroups.query = async () => groups;
    chrome.tabs.query = async () => tabs;
    chrome.tabGroups.TAB_GROUP_ID_NONE = -1;
    if (typeof renderTabs === 'function') renderTabs();
    else if (window.renderTabs) window.renderTabs();
  });
  await sleep(800);
  await sidebar.screenshot({ path: path.join(OUT, 'raw', 'shot5-sidebar-demo.png') });
  console.log('sidebar-demo done');

  // ===== 深色主界面 =====
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 2 });
  await page.goto(`chrome-extension://${extId}/index.html`, { waitUntil: 'networkidle0' });
  await page.evaluate(() => { localStorage.setItem('language', 'zh-CN'); localStorage.setItem('theme', 'dark'); });
  await page.reload({ waitUntil: 'networkidle0' });
  await sleep(1200);
  // 强制 dark class（若主题由 class 驱动）
  await page.evaluate(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.body.classList.add('dark-theme', 'dark');
  });
  await page.type('#searchInput', 'AI 搜索引擎 2026');
  await sleep(400);
  await page.screenshot({ path: path.join(OUT, 'raw', 'shot6-dark.png') });
  console.log('dark done');

  await browser.close();
  console.log('ALL_DONE');
})().catch(e => { console.error('FATAL', e); process.exit(1); });
