// 合成 v2（按 opus 终审 8 项清单修正）
// P0 promo重排 / P1 marquee选中数+放大 / P1底部残片 / P2底部裁切+空白 / P3品牌统一
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const CHROME = 'C:\\Users\\ZhuanZ\\AppData\\Local\\puppeteer-browsers\\chrome-win64\\chrome.exe';
const OUT = path.join(__dirname, 'final');
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const b64 = (f) => 'data:image/png;base64,' + fs.readFileSync(path.join(__dirname, 'raw', f)).toString('base64');

const css = `
* { margin:0; padding:0; box-sizing:border-box; }
body { font-family:'Segoe UI','Microsoft YaHei',system-ui,sans-serif; background:#fff; overflow:hidden; }
.badge { display:inline-flex; align-items:center; gap:8px; background:#eef2ff; color:#4f46e5; font-size:21px; font-weight:600; padding:9px 20px; border-radius:999px; white-space:nowrap; }
.corners { position:absolute; border-radius:50%; filter:blur(70px); opacity:.5; }
.fade-b { -webkit-mask-image:linear-gradient(to bottom, black 80%, transparent 100%); mask-image:linear-gradient(to bottom, black 80%, transparent 100%); }
`;

function layoutMain(dark = false) {
  const bg = dark ? '#111114' : '#ffffff', fg = dark ? '#f9fafb' : '#111827',
    badgeBg = dark ? '#26264d' : '#eef2ff', badgeFg = dark ? '#a5b4fc' : '#4f46e5',
    em = dark ? '#818cf8' : '#4f46e5', raw = dark ? 's5-main-dark.png' : 's1-main-light.png';
  // 布局预算: pad40 + logo44 + mt16 + h1(48) + mt14 + badges34 + mt26 + shot(526=fixed) = 748 ≤800 ✓
  return `<!doctype html><html><head><meta charset="utf-8"><style>${css}
  body{width:1280px;height:800px}
  .wrap{position:relative;width:1280px;height:800px;padding:40px 90px 0;display:flex;flex-direction:column;align-items:center;background:${bg}}
  .c1{width:220px;height:220px;background:#818cf8;top:-60px;left:-60px}.c2{width:220px;height:220px;background:#c7d2fe;bottom:20px;right:-70px}
  .head{display:flex;align-items:center;gap:14px}
  .logo{width:44px;height:44px;border-radius:12px;background:linear-gradient(135deg,#4f46e5,#6366f1);display:flex;align-items:center;justify-content:center}
  .brand{font-size:28px;font-weight:800;color:${fg};letter-spacing:.5px}
  h1{margin-top:16px;font-size:48px;font-weight:800;color:${fg};text-align:center;letter-spacing:1px}
  h1 em{font-style:normal;color:${em}}
  .badges{margin-top:14px;display:flex;gap:14px}
  .badges .badge{background:${badgeBg};color:${badgeFg}}
  .shot{margin-top:26px;width:1000px;height:500px;border:1px solid ${dark?'#374151':'#e5e7eb'};border-radius:14px;overflow:hidden;background:${dark?'#1a1a1a':'#fff'};box-shadow:0 18px 44px rgba(31,41,55,.16)}
  .shot img{display:block;width:100%}
  .fade-wrap{-webkit-mask-image:linear-gradient(to bottom, black 78%, transparent 98%);mask-image:linear-gradient(to bottom, black 78%, transparent 98%)}
  </style></head><body><div class="wrap">
    <div class="corners c1"></div><div class="corners c2"></div>
    <div class="head"><div class="logo"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg></div><div class="brand">1SO SearchHub</div></div>
    <h1>一次输入，<em>多引擎</em>出结果</h1>
    <div class="badges"><span class="badge">50 个预设引擎</span><span class="badge">结果自动分组</span><span class="badge">纯本地 · 不收集数据</span></div>
    <div class="shot fade-wrap"><img src="${b64(raw)}"></div>
  </div></body></html>`;
}

function layoutSidebar() {
  return `<!doctype html><html><head><meta charset="utf-8"><style>${css}
  body{width:1280px;height:800px}
  .wrap{position:relative;width:1280px;height:800px;display:flex;align-items:center;padding:0 70px;gap:44px;background:linear-gradient(135deg,#eef2ff 0%,#ffffff 55%)}
  .c1{width:260px;height:260px;background:#a5b4fc;top:-80px;right:120px}
  .left{flex:1;display:flex;flex-direction:column;align-items:flex-start;gap:26px}
  .logo-row{display:flex;align-items:center;gap:12px}
  .logo{width:42px;height:42px;border-radius:11px;background:linear-gradient(135deg,#4f46e5,#6366f1);display:flex;align-items:center;justify-content:center}
  .brand{font-size:25px;font-weight:800;color:#111827}
  h1{font-size:56px;font-weight:800;color:#111827;line-height:1.22}
  h1 em{font-style:normal;color:#4f46e5}
  p{font-size:23px;color:#4b5563;line-height:1.65}
  .stats{display:flex;gap:12px}
  .stats .badge{font-size:18px;padding:8px 18px}
  .shot{width:440px;flex-shrink:0;border:1px solid #e5e7eb;border-radius:14px;overflow:hidden;box-shadow:0 24px 60px rgba(31,41,55,.22);background:#fff;padding:6px}
  .shot img{display:block;width:100%;border-radius:9px}
  </style></head><body><div class="wrap">
    <div class="corners c1"></div>
    <div class="left">
      <div class="logo-row"><div class="logo"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg></div><div class="brand">1SO SearchHub</div></div>
      <h1>侧边栏<br><em>垂直管理</em>结果标签</h1>
      <p>搜索后自动打开侧边栏，<br>结果按标签组排列，逐个对比不迷路。</p>
      <div class="stats"><span class="badge">50 引擎 · 9 分类</span><span class="badge">搜索完成 → 自动归组</span></div>
    </div>
    <div class="shot"><img class="fade-b" src="${b64('s4-sidebar-mock.png')}"></div>
  </div></body></html>`;
}

function layoutPromo() {
  // P0 重排：文案两行内、字号收敛、卡片完整入画、文字与卡片间距 ≥20px
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{width:440px;height:280px;overflow:hidden;font-family:'Segoe UI','Microsoft YaHei',system-ui,sans-serif;background:linear-gradient(135deg,#4f46e5 0%,#6366f1 60%,#818cf8 100%);position:relative}
  .left{position:absolute;left:30px;top:50%;transform:translateY(-50%);width:212px}
  .brand{display:flex;align-items:center;gap:7px;margin-bottom:12px}
  .logo{width:26px;height:26px;border-radius:7px;background:#fff;display:flex;align-items:center;justify-content:center;flex-shrink:0}
  .name{font-size:15px;font-weight:800;color:#fff;white-space:nowrap}
  h1{font-size:33px;font-weight:800;color:#fff;line-height:1.28;letter-spacing:.5px;white-space:nowrap}
  .sub{margin-top:9px;font-size:14px;color:#e0e7ff;white-space:nowrap}
  .panel{position:absolute;right:24px;top:50%;transform:translateY(-50%);width:158px;background:#fff;border-radius:12px;box-shadow:0 12px 34px rgba(0,0,0,.35);overflow:hidden}
  .bar{height:26px;display:flex;align-items:center;padding:0 10px;gap:5px;border-bottom:1px solid #eef2ff}
  .dot{width:7px;height:7px;border-radius:50%}
  .query{margin:8px 10px 0;background:#f3f4f6;border-radius:6px;font-size:9px;color:#6b7280;padding:5px 8px;white-space:nowrap;overflow:hidden}
  .caps{display:flex;flex-wrap:wrap;gap:4px;padding:8px 10px}
  .cap{font-size:8.5px;color:#4f46e5;background:#eef2ff;border-radius:999px;padding:2px 7px;font-weight:600;white-space:nowrap}
  .btn{margin:0 10px 10px;background:#4f46e5;color:#fff;font-size:10.5px;font-weight:700;border-radius:7px;padding:7px 0;text-align:center}
  </style></head><body>
  <div class="left">
    <div class="brand"><div class="logo"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" stroke-width="2.6" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg></div><span class="name">1SO SearchHub</span></div>
    <h1>一次输入<br>多搜 50 引擎</h1>
    <div class="sub">AI · 搜索 · 社交</div>
  </div>
  <div class="panel">
    <div class="bar"><span class="dot" style="background:#f87171"></span><span class="dot" style="background:#fbbf24"></span><span class="dot" style="background:#34d399"></span></div>
    <div class="query">AI 搜索引擎 2026</div>
    <div class="caps"><span class="cap">Perplexity</span><span class="cap">豆包</span><span class="cap">DeepSeek</span><span class="cap">Kimi</span><span class="cap">秘塔</span><span class="cap">Bing</span></div>
    <div class="btn">一键搜索</div>
  </div>
  </body></html>`;
}

function layoutMarquee() {
  // P1: 选中数已随新截图自洽(3选3亮)；P3: 品牌去后缀；P3: 截图放大(720宽, 裁底部)
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{width:1400px;height:560px;overflow:hidden;font-family:'Segoe UI','Microsoft YaHei',system-ui,sans-serif;background:linear-gradient(120deg,#312e81 0%,#4f46e5 55%,#6366f1 100%);position:relative}
  .glow{position:absolute;width:420px;height:420px;border-radius:50%;filter:blur(110px);opacity:.35}
  .g1{background:#818cf8;top:-120px;left:380px}.g2{background:#c7d2fe;bottom:-140px;right:60px}
  .left{position:absolute;left:84px;top:50%;transform:translateY(-50%);width:480px}
  .brand{display:flex;align-items:center;gap:12px;margin-bottom:20px}
  .logo{width:44px;height:44px;border-radius:12px;background:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 24px rgba(0,0,0,.25)}
  .name{font-size:25px;font-weight:800;color:#fff}
  h1{font-size:66px;font-weight:800;color:#fff;line-height:1.16;letter-spacing:2px}
  .sub{margin-top:16px;font-size:24px;color:#e0e7ff;letter-spacing:.5px}
  .chips{margin-top:22px;display:flex;gap:9px;flex-wrap:wrap;max-width:470px}
  .chip{font-size:14px;color:#fff;background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.25);border-radius:999px;padding:5px 14px}
  .shot{position:absolute;right:40px;top:50%;transform:translateY(-50%);width:720px;height:470px;border-radius:16px;overflow:hidden;box-shadow:0 30px 80px rgba(0,0,0,.45);border:1px solid rgba(255,255,255,.2)}
  .shot img{display:block;width:100%}
  </style></head><body>
  <div class="glow g1"></div><div class="glow g2"></div>
  <div class="left">
    <div class="brand"><div class="logo"><svg width="27" height="27" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" stroke-width="2.4" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg></div><span class="name">1SO SearchHub</span></div>
    <h1>一次输入<br>同时多搜</h1>
    <div class="sub">50 个引擎，结果自动分组管理</div>
    <div class="chips"><span class="chip">AI 搜索</span><span class="chip">AI 聊天</span><span class="chip">传统搜索</span><span class="chip">社交</span><span class="chip">视频</span><span class="chip">地图</span><span class="chip">购物</span><span class="chip">开发者</span><span class="chip">知识库</span></div>
  </div>
  <div class="shot"><img src="${b64('s1-main-light.png')}"></div>
  </body></html>`;
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new' });
  const page = await browser.newPage();
  const jobs = [
    { name: 'screenshot-1-main-1280x800.png', w: 1280, h: 800, html: layoutMain(false) },
    { name: 'screenshot-2-sidebar-1280x800.png', w: 1280, h: 800, html: layoutSidebar() },
    { name: 'screenshot-3-dark-1280x800.png', w: 1280, h: 800, html: layoutMain(true) },
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
  const { PNG } = require('pngjs');
  for (const j of jobs) {
    const p = PNG.sync.read(fs.readFileSync(path.join(OUT, j.name)));
    const ok = p.width === j.w && p.height === j.h;
    console.log(ok ? 'OK ' : 'BAD', j.name, `${p.width}x${p.height}`);
    if (!ok) process.exit(1);
  }
  console.log('ALL_EXPORTED');
})().catch(e => { console.error('FATAL', e); process.exit(1); });
