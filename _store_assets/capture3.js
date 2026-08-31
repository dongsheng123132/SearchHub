// 最终拍版：浅色主题 + 侧边栏用 evaluateOnNewDocument 全 mock（真实 initialize/loadAllTabs 流程）
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const CHROME = 'C:\\Users\\ZhuanZ\\AppData\\Local\\puppeteer-browsers\\chrome-win64\\chrome.exe';
const ROOT = path.resolve(__dirname, '..');
const OUT = __dirname;
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const SIDEBAR_MOCK = () => {
  const groups = [
    { id: 101, title: 'AI 搜索引擎 2026', color: 'blue', windowId: 42 },
    { id: 102, title: 'AI Chat', color: 'purple', windowId: 42 },
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
  chrome.tabs.query = async (q) => {
    if (q && q.active) return [tabs[0]];
    return tabs;
  };
  chrome.tabGroups.query = async () => groups;
  chrome.tabs.onRemoved.addListener = () => {};
  chrome.tabs.onUpdated.addListener = () => {};
  chrome.tabs.onMoved.addListener = () => {};
  chrome.tabs.onAttached.addListener = () => {};
  chrome.tabs.onDetached.addListener = () => {};
  chrome.tabGroups.onUpdated.addListener = () => {};
  chrome.tabGroups.onRemoved.addListener = () => {};
  chrome.windows.onFocusChanged.addListener = () => {};
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

  // ===== shot1: 浅色主界面 =====
  const p1 = await browser.newPage();
  await p1.setViewport({ width: 1280, height: 800, deviceScaleFactor: 2 });
  await p1.emulateMediaFeatures(LIGHT);
  await p1.goto(`chrome-extension://${extId}/index.html`, { waitUntil: 'networkidle0' });
  await p1.evaluate(() => { localStorage.setItem('language', 'zh-CN'); });
  await p1.reload({ waitUntil: 'networkidle0' });
  await sleep(1200);
  await p1.type('#searchInput', 'AI 搜索引擎 2026');
  await sleep(400);
  await p1.screenshot({ path: path.join(OUT, 'raw', 's1-main-light.png') });
  console.log('s1 done');

  // ===== shot2: popup 浅色 =====
  const p2 = await browser.newPage();
  await p2.setViewport({ width: 400, height: 620, deviceScaleFactor: 2 });
  await p2.emulateMediaFeatures(LIGHT);
  await p2.goto(`chrome-extension://${extId}/popup.html`, { waitUntil: 'networkidle0' });
  await sleep(1000);
  await p2.type('#searchInput', 'AI 搜索引擎 2026');
  await sleep(300);
  await p2.screenshot({ path: path.join(OUT, 'raw', 's2-popup-light.png') });
  console.log('s2 done');

  // ===== shot3: 设置页浅色 =====
  const p3 = await browser.newPage();
  await p3.setViewport({ width: 1280, height: 800, deviceScaleFactor: 2 });
  await p3.emulateMediaFeatures(LIGHT);
  await p3.goto(`chrome-extension://${extId}/settings.html`, { waitUntil: 'networkidle0' });
  await sleep(1200);
  await p3.screenshot({ path: path.join(OUT, 'raw', 's3-settings-light.png') });
  console.log('s3 done');

  // ===== shot4: 侧边栏（全 mock，走真实 initialize 流程）=====
  const p4 = await browser.newPage();
  await p4.setViewport({ width: 420, height: 800, deviceScaleFactor: 2 });
  await p4.emulateMediaFeatures(LIGHT);
  await p4.evaluateOnNewDocument(SIDEBAR_MOCK);
  await p4.goto(`chrome-extension://${extId}/sidebar.html`, { waitUntil: 'networkidle0' });
  await sleep(1500);
  await p4.screenshot({ path: path.join(OUT, 'raw', 's4-sidebar-mock.png') });
  console.log('s4 done');

  // ===== shot5: 深色主界面（营销用对比图）=====
  const p5 = await browser.newPage();
  await p5.setViewport({ width: 1280, height: 800, deviceScaleFactor: 2 });
  await p5.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'dark' }]);
  await p5.goto(`chrome-extension://${extId}/index.html`, { waitUntil: 'networkidle0' });
  await p5.evaluate(() => { localStorage.setItem('language', 'zh-CN'); });
  await p5.reload({ waitUntil: 'networkidle0' });
  await sleep(1200);
  await p5.type('#searchInput', 'AI 搜索引擎 2026');
  await sleep(400);
  await p5.screenshot({ path: path.join(OUT, 'raw', 's5-main-dark.png') });
  console.log('s5 done');

  await browser.close();

  // 像素自检：浅色应白底、深色应 #1a1a1a、侧边栏应非空
  const { PNG } = require('pngjs');
  const chk = (f, x, y) => {
    const png = PNG.sync.read(fs.readFileSync(path.join(OUT, 'raw', f)));
    const i = (png.width * y + x) << 2;
    return `${f} ${png.width}x${png.height} rgb(${png.data[i]},${png.data[i+1]},${png.data[i+2]})`;
  };
  console.log(chk('s1-main-light.png', 5, 5));
  console.log(chk('s3-settings-light.png', 5, 5));
  console.log(chk('s4-sidebar-mock.png', 5, 5), chk('s4-sidebar-mock.png', 210, 400));
  console.log(chk('s5-main-dark.png', 5, 5));
  console.log('ALL_DONE');
})().catch(e => { console.error('FATAL', e); process.exit(1); });
