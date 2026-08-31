// 合成商店资产：真实截图 + 轻装饰文案 → 精确尺寸 PNG 导出
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const CHROME = 'C:\\Users\\ZhuanZ\\AppData\\Local\\puppeteer-browsers\\chrome-win64\\chrome.exe';
const OUT = path.join(__dirname, 'final');
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const b64 = (f) => 'data:image/png;base64,' + fs.readFileSync(path.join(__dirname, 'raw', f)).toString('base64');

const css = `
* { margin:0; padding:0; box-sizing:border-box; }
body { width:1280px; height:800px; overflow:hidden; font-family:'Segoe UI','Microsoft YaHei',system-ui,sans-serif; background:#fff; }
.badge { display:inline-flex; align-items:center; gap:10px; background:#eef2ff; color:#4f46e5; font-size:22px; font-weight:600; padding:10px 22px; border-radius:999px; }
.shot { border:1px solid #e5e7eb; border-radius:14px; box-shadow:0 18px 44px rgba(31,41,55,.16); overflow:hidden; background:#fff; }
.shot img { display:block; width:100%; }
.corners { position:absolute; width:220px; height:220px; border-radius:50%; filter:blur(70px); opacity:.5; }
`;

// 布局1：主图 —— 文案区在上（品牌+大字+徽章行），大截图在下
function layoutMain({ dark = false } = {}) {
  const bg = dark ? '#111114' : '#ffffff', fg = dark ? '#f9fafb' : '#111827',
    sub = dark ? '#9ca3af' : '#4b5563', badgeBg = dark ? '#26264d' : '#eef2ff',
    badgeFg = dark ? '#a5b4fc' : '#4f46e5';
  return `<!doctype html><html><head><meta charset="utf-8"><style>${css}
  body{background:${bg}}
  .wrap{position:relative;width:1280px;height:800px;padding:52px 90px 0;display:flex;flex-direction:column;align-items:center}
  .c1{background:#818cf8;top:-60px;left:-60px}.c2{background:#c7d2fe;bottom:40px;right:-70px}
  .head{display:flex;align-items:center;gap:14px}
  .logo{width:44px;height:44px;border-radius:12px;background:linear-gradient(135deg,#4f46e5,#6366f1);display:flex;align-items:center;justify-content:center}
  .brand{font-size:30px;font-weight:800;color:${fg};letter-spacing:.5px}
  h1{margin-top:26px;font-size:56px;font-weight:800;color:${fg};text-align:center;letter-spacing:1px}
  h1 em{font-style:normal;color:#4f46e5}
  .badges{margin-top:22px;display:flex;gap:14px}
  .badges .badge{background:${badgeBg};color:${badgeFg}}
  .shot{margin-top:40px;width:1000px}
  </style></head><body><div class="wrap">
    <div class="corners c1"></div><div class="corners c2"></div>
    <div class="head"><div class="logo"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg></div><div class="brand">1SO SearchHub</div></div>
    <h1>一次输入，<em>多引擎</em>出结果</h1>
    <div class="badges"><span class="badge">50 个预设引擎</span><span class="badge">结果自动分组</span><span class="badge">纯本地 · 不收集数据</span></div>
    <div class="shot"><img src="${b64('s1-main-light.png')}"></div>
  </div></body></html>`;
}

// 布局2：侧边栏 —— 左文案右截图（竖长图）
function layoutSidebar() {
  return `<!doctype html><html><head><meta charset="utf-8"><style>${css}
  .wrap{position:relative;width:1280px;height:800px;display:flex;align-items:center;padding:0 70px;gap:40px;background:linear-gradient(135deg,#eef2ff 0%,#ffffff 55%)}
  .c1{background:#a5b4fc;top:-80px;right:120px}
  .left{flex:1;display:flex;flex-direction:column;align-items:flex-start;gap:24px}
  .logo-row{display:flex;align-items:center;gap:12px}
  .logo{width:40px;height:40px;border-radius:11px;background:linear-gradient(135deg,#4f46e5,#6366f1);display:flex;align-items:center;justify-content:center}
  .brand{font-size:24px;font-weight:800;color:#111827}
  h1{font-size:52px;font-weight:800;color:#111827;line-height:1.25}
  h1 em{font-style:normal;color:#4f46e5}
  p{font-size:24px;color:#4b5563;line-height:1.6}
  .shot{width:400px;flex-shrink:0;box-shadow:0 24px 60px rgba(31,41,55,.22)}
  </style></head><body><div class="wrap">
    <div class="corners c1"></div>
    <div class="left">
      <div class="logo-row"><div class="logo"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg></div><div class="brand">1SO SearchHub</div></div>
      <h1>侧边栏<br><em>垂直管理</em>结果标签</h1>
      <p>搜索后自动打开侧边栏，<br>结果按标签组排列，逐个对比不迷路。</p>
      <span class="badge">搜索完成 → 自动归组</span>
    </div>
    <div class="shot"><img src="${b64('s4-sidebar-mock.png')}"></div>
  </div></body></html>`;
}

// 布局3：深色场景 —— 展示深色模式与快捷
function layoutDark() {
  return `<!doctype html><html><head><meta charset="utf-8"><style>${css}
  body{background:#0d0d10}
  .wrap{position:relative;width:1280px;height:800px;padding:50px 90px 0;display:flex;flex-direction:column;align-items:center}
  .c1{background:#4f46e5;top:-60px;right:-60px}.c2{background:#312e81;bottom:0;left:-70px}
  .head{display:flex;align-items:center;gap:14px}
  .logo{width:44px;height:44px;border-radius:12px;background:linear-gradient(135deg,#4f46e5,#6366f1);display:flex;align-items:center;justify-content:center}
  .brand{font-size:30px;font-weight:800;color:#f9fafb}
  h1{margin-top:24px;font-size:54px;font-weight:800;color:#f9fafb;text-align:center}
  h1 em{font-style:normal;color:#818cf8}
  .badges{margin-top:20px;display:flex;gap:14px}
  .badges .badge{background:#26264d;color:#a5b4fc}
  .shot{margin-top:38px;width:1000px;box-shadow:0 24px 70px rgba(0,0,0,.6)}
  </style></head><body><div class="wrap">
    <div class="corners c1"></div><div class="corners c2"></div>
    <div class="head"><div class="logo"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg></div><div class="brand">1SO SearchHub</div></div>
    <h1>深色模式 · <em>快捷键</em>直达</h1>
    <div class="badges"><span class="badge">Alt+S 打开</span><span class="badge">Alt+Q 搜选中文字</span><span class="badge">主题跟随系统</span></div>
    <div class="shot"><img src="${b64('s5-main-dark.png')}"></div>
  </div></body></html>`;
}

// 布局4：Promo 小图 440x280 —— 左字右UI，无违规声明，品牌名完整
function layoutPromo() {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{width:440px;height:280px;overflow:hidden;font-family:'Segoe UI','Microsoft YaHei',system-ui,sans-serif;background:linear-gradient(135deg,#4f46e5 0%,#6366f1 60%,#818cf8 100%);position:relative}
  .left{position:absolute;left:34px;top:50%;transform:translateY(-50%);max-width:220px}
  .brand{display:flex;align-items:center;gap:8px;margin-bottom:14px}
  .logo{width:30px;height:30px;border-radius:8px;background:#ffffff;display:flex;align-items:center;justify-content:center}
  .name{font-size:17px;font-weight:800;color:#fff;white-space:nowrap}
  h1{font-size:40px;font-weight:800;color:#fff;line-height:1.2;letter-spacing:1px}
  .sub{margin-top:10px;font-size:16px;color:#e0e7ff}
  .panel{position:absolute;right:-30px;top:34px;width:230px;background:#fff;border-radius:14px;box-shadow:0 14px 40px rgba(0,0,0,.35);overflow:hidden}
  .bar{height:34px;display:flex;align-items:center;padding:0 12px;gap:6px;border-bottom:1px solid #eef2ff}
  .dot{width:8px;height:8px;border-radius:50%}
  .query{margin:10px 12px 0;background:#f3f4f6;border-radius:8px;font-size:11px;color:#6b7280;padding:7px 10px}
  .caps{display:flex;flex-wrap:wrap;gap:5px;padding:10px 12px}
  .cap{font-size:10px;color:#4f46e5;background:#eef2ff;border-radius:999px;padding:3px 8px;font-weight:600}
  .btn{margin:2px 12px 12px;background:#4f46e5;color:#fff;font-size:12px;font-weight:700;border-radius:8px;padding:8px 0;text-align:center}
  </style></head><body>
  <div class="left">
    <div class="brand"><div class="logo"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" stroke-width="2.6" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg></div><span class="name">1SO SearchHub</span></div>
    <h1>一次输入<br>多搜 50 引擎</h1>
    <div class="sub">AI · 搜索 · 社交 · 全覆盖</div>
  </div>
  <div class="panel">
    <div class="bar"><span class="dot" style="background:#f87171"></span><span class="dot" style="background:#fbbf24"></span><span class="dot" style="background:#34d399"></span></div>
    <div class="query">AI 搜索引擎 2026</div>
    <div class="caps"><span class="cap">Perplexity</span><span class="cap">豆包</span><span class="cap">DeepSeek</span><span class="cap">Kimi</span><span class="cap">秘塔</span><span class="cap">Bing</span></div>
    <div class="btn">一键搜索</div>
  </div>
  </body></html>`;
}

// 布局5：Marquee 1400x560 —— 复用旧版骨架思路：左字右真实UI
function layoutMarquee() {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{width:1400px;height:560px;overflow:hidden;font-family:'Segoe UI','Microsoft YaHei',system-ui,sans-serif;background:linear-gradient(120deg,#312e81 0%,#4f46e5 55%,#6366f1 100%);position:relative}
  .glow{position:absolute;width:420px;height:420px;border-radius:50%;filter:blur(110px);opacity:.35}
  .g1{background:#818cf8;top:-120px;left:420px}.g2{background:#c7d2fe;bottom:-140px;right:60px}
  .left{position:absolute;left:90px;top:50%;transform:translateY(-50%);max-width:560px}
  .brand{display:flex;align-items:center;gap:12px;margin-bottom:22px}
  .logo{width:46px;height:46px;border-radius:12px;background:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 24px rgba(0,0,0,.25)}
  .name{font-size:26px;font-weight:800;color:#fff}
  h1{font-size:72px;font-weight:800;color:#fff;line-height:1.15;letter-spacing:2px}
  .sub{margin-top:18px;font-size:26px;color:#e0e7ff;letter-spacing:1px}
  .chips{margin-top:26px;display:flex;gap:10px;flex-wrap:wrap;max-width:520px}
  .chip{font-size:15px;color:#fff;background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.25);border-radius:999px;padding:6px 16px}
  .shot{position:absolute;right:70px;top:50%;transform:translateY(-50%);width:620px;border-radius:16px;overflow:hidden;box-shadow:0 30px 80px rgba(0,0,0,.45);border:1px solid rgba(255,255,255,.2)}
  .shot img{display:block;width:100%}
  </style></head><body>
  <div class="glow g1"></div><div class="glow g2"></div>
  <div class="left">
    <div class="brand"><div class="logo"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" stroke-width="2.4" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg></div><span class="name">1SO SearchHub 一搜</span></div>
    <h1>一次输入<br>同时多搜</h1>
    <div class="sub">50 个引擎，结果自动分组、侧边栏集中管理</div>
    <div class="chips"><span class="chip">AI 搜索</span><span class="chip">AI 聊天</span><span class="chip">传统搜索</span><span class="chip">社交</span><span class="chip">视频</span><span class="chip">地图</span><span class="chip">购物</span><span class="chip">知识库</span></div>
  </div>
  <div class="shot"><img src="${b64('s1-main-light.png')}"></div>
  </body></html>`;
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new' });
  const page = await browser.newPage();

  const jobs = [
    { name: 'screenshot-1-main-1280x800.png', w: 1280, h: 800, html: layoutMain() },
    { name: 'screenshot-2-sidebar-1280x800.png', w: 1280, h: 800, html: layoutSidebar() },
    { name: 'screenshot-3-dark-1280x800.png', w: 1280, h: 800, html: layoutDark() },
    { name: 'promo-small-440x280.png', w: 440, h: 280, html: layoutPromo() },
    { name: 'marquee-1400x560.png', w: 1400, h: 560, html: layoutMarquee() },
  ];
  for (const j of jobs) {
    await page.setViewport({ width: j.w, height: j.h, deviceScaleFactor: 1 });
    await page.setContent(j.html, { waitUntil: 'load', timeout: 60000 });
    await sleep(500);
    await page.screenshot({ path: path.join(OUT, j.name), clip: { x: 0, y: 0, width: j.w, height: j.h } });
    console.log('EXPORT', j.name);
  }
  await browser.close();

  // 尺寸断言
  const { PNG } = require('pngjs');
  for (const j of jobs) {
    const p = PNG.sync.read(fs.readFileSync(path.join(OUT, j.name)));
    const ok = p.width === j.w && p.height === j.h;
    console.log(ok ? 'OK ' : 'BAD', j.name, `${p.width}x${p.height}`);
    if (!ok) process.exit(1);
  }
  console.log('ALL_EXPORTED');
})().catch(e => { console.error('FATAL', e); process.exit(1); });
