// 重拍 v2（按 opus 终审清单）：主图点选3引擎让选中数自洽；侧边栏组名统一中文、视口贴合内容
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const CHROME = 'C:\\Users\\ZhuanZ\\AppData\\Local\\puppeteer-browsers\\chrome-win64\\chrome.exe';
const ROOT = path.resolve(__dirname, '..');
const OUT = __dirname;
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const SIDEBAR_MOCK = () => {
  const groups = [
    { id: 101, title: 'AI 搜索', color: 'blue', windowId: 42 },
    { id: 102, title: 'AI 聊天', color: 'purple', windowId: 42 },
    { id: 103, title: '传统搜索', color: 'green', windowId: 42 },
  ];
  const mk = (gid, arr) => arr.map(([t, u], i) => ({
    id: gid * 10 + i, title: t, url: u, groupId: gid, windowId: 42,
    favIconUrl: '', active: i === 0, pinned: false, audible: false,
    discarded: false, autoDiscardable: true, highlighted: false,
    incognito: false, index: i, mutedInfo: { muted: false },
  }));
  const tabs = [
    ...mk(101, [['Perplexity - AI 搜索引擎 2026', 'https://perplexity.ai'],
                ['秘塔 AI 搜索', 'https://metaso.cn'],
                ['Genspark — AI Agent 搜索', 'https://genspark.ai'],
                ['Felo AI 搜索', 'https://felo.ai']]),
    ...mk(102, [['豆包 - AI 智能助手', 'https://doubao.com'],
                ['DeepSeek 对话', 'https://chat.deepseek.com'],
                ['Kimi - 长文本 AI 助手', 'https://kimi.moonshot.cn']]),
    ...mk(103, [['百度一下,你就知道', 'https://baidu.com'],
                ['Google 搜索', 'https://google.com']]),
  ];
  chrome.windows.getCurrent = async () => ({ id: 42 });
  chrome.tabs.query = async (q) => (q && q.active) ? [tabs[0]] : tabs;
  chrome.tabGroups.query = async () => groups;
  for (const ev of ['onRemoved', 'onUpdated', 'onMoved', 'onAttached', 'onDetached']) {
    if (chrome.tabs[ev]) chrome.tabs[ev].addListener = () => {};
  }
  for (const ev of ['onUpdated', 'onRemoved']) {
    if (chrome.tabGroups[ev]) chrome.tabGroups[ev].addListener = () => {};
  }
  if (chrome.windows.onFocusChanged) chrome.windows.onFocusChanged.addListener = () => {};
};

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
  const LIGHT = [{ name: 'prefers-color-scheme', value: 'light' }];

  const shootMain = async (theme) => {
    const p = await browser.newPage();
    await p.setViewport({ width: 1280, height: 800, deviceScaleFactor: 2 });
    await p.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: theme }]);
    await p.goto(`chrome-extension://${extId}/index.html`, { waitUntil: 'networkidle0' });
    await p.evaluate(() => { localStorage.setItem('language', 'zh-CN'); });
    await p.reload({ waitUntil: 'networkidle0' });
    await sleep(1200);
    // 点选 AI 搜索分类前 3 个引擎卡 → 让「3 个引擎已选择」与画面高亮一致
    await p.evaluate(() => {
      const cards = document.querySelectorAll('.engine-card:not(.engine-card-add)');
      for (let i = 0; i < 3 && i < cards.length; i++) cards[i].click();
    });
    await sleep(400);
    await p.type('#searchInput', 'AI 搜索引擎 2026');
    await sleep(400);
    const cnt = await p.evaluate(() => document.getElementById('selectedCount').textContent.trim());
    const name = theme === 'light' ? 's1-main-light.png' : 's5-main-dark.png';
    await p.screenshot({ path: path.join(OUT, 'raw', name) });
    console.log(name, 'selectedCount =', cnt);
    await p.close();
  };
  await shootMain('light');
  await shootMain('dark');

  // 侧边栏：组名统一中文，视口高度贴合内容（消半卡）
  const p4 = await browser.newPage();
  await p4.setViewport({ width: 380, height: 760, deviceScaleFactor: 2 });
  await p4.emulateMediaFeatures(LIGHT);
  await p4.evaluateOnNewDocument(SIDEBAR_MOCK);
  await p4.goto(`chrome-extension://${extId}/sidebar.html`, { waitUntil: 'networkidle0' });
  await p4.evaluate(() => {
    const s = document.createElement('style');
    s.textContent = 'body{padding:14px !important}';
    document.head.appendChild(s);
  });
  await sleep(1200);
  await p4.screenshot({ path: path.join(OUT, 'raw', 's4-sidebar-mock.png') });
  console.log('s4 done');
  await p4.close();

  await browser.close();
  console.log('ALL_DONE');
})().catch(e => { console.error('FATAL', e); process.exit(1); });
