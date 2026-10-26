// Default search engines configuration
// v1.3.0：精简冷门引擎（phind/pi/devv/consensus/semantic/thinkany/mdn/npm 等），
//         新增国产 AI（海螺 MiniMax / 小米 MiMo / 讯飞星火 / 昆仑天工 / 阶跃跃问）。
// 注意：改动必须同步到 background.js 的 findDefaultEngineById（右键/快捷键搜索用）。
const DEFAULT_ENGINES = {
  aiSearch: {
    name: 'AI Search',
    icon: '🤖',
    engines: [
      { id: 'perplexity', name: 'Perplexity', description: 'AI-powered answer engine', url: 'https://www.perplexity.ai/search?q=%s', favicon: 'https://perplexity.ai/favicon.ico' },
      { id: 'metaso', name: '秘塔 Metaso', description: '无广告 AI 搜索', url: 'https://metaso.cn/?q=%s', favicon: 'https://metaso.cn/favicon.ico' },
      { id: 'genspark', name: 'Genspark', description: 'AI search engine', url: 'https://www.genspark.ai/search?q=%s', favicon: 'https://genspark.ai/favicon.ico' },
      { id: 'felo', name: 'Felo', description: 'Cross-lingual AI search', url: 'https://felo.ai/search?q=%s', favicon: 'https://felo.ai/favicon.ico' },
      { id: 'you', name: 'You.com 🔒', description: 'AI search engine (requires login)', url: 'https://you.com/search?q=%s', favicon: 'https://you.com/favicon.ico' },
      { id: 'exa', name: 'Exa 🔒', description: 'AI-powered search (requires login)', url: 'https://exa.ai/search?q=%s', favicon: 'https://exa.ai/favicon.ico' },
      { id: 'monica', name: 'Monica', description: 'AI assistant search', url: 'https://s.monica.im/search?q=%s', favicon: 'https://monica.so/favicon.ico' }
    ]
  },

  aiChat: {
    name: 'AI Chat',
    icon: '💬',
    engines: [
      { id: 'doubao', name: '豆包 Doubao', description: 'ByteDance AI', url: 'https://www.doubao.com/chat/?q=%s', favicon: 'https://doubao.com/favicon.ico' },
      { id: 'deepseek', name: 'DeepSeek', description: 'DeepSeek AI chat', url: 'https://chat.deepseek.com/?q=%s', favicon: 'https://deepseek.com/favicon.ico' },
      { id: 'kimi', name: 'Kimi', description: 'Moonshot AI', url: 'https://www.kimi.com/?q=%s', favicon: 'https://kimi.com/favicon.ico' },
      { id: 'hunyuan', name: '腾讯元宝', description: 'Tencent AI assistant', url: 'https://yuanbao.tencent.com/?q=%s', favicon: 'https://yuanbao.tencent.com/favicon.ico' },
      { id: 'wenxin', name: '文心一言', description: 'Baidu AI chat', url: 'https://wenxin.baidu.com/?q=%s', favicon: 'https://wenxin.baidu.com/favicon.ico' },
      { id: 'tongyi', name: '通义千问', description: 'Alibaba Cloud AI', url: 'https://www.qianwen.com/?q=%s', favicon: 'https://qianwen.com/favicon.ico' },
      { id: 'zhipu', name: '智谱清言', description: 'Zhipu AI chat', url: 'https://chatglm.cn/?q=%s', favicon: 'https://chatglm.cn/favicon.ico' },
      { id: 'minimax', name: '海螺 MiniMax', description: 'MiniMax AI 对话', url: 'https://hailuoai.com/?q=%s', favicon: 'https://hailuoai.com/favicon.ico' },
      { id: 'mimo', name: '小米 MiMo', description: 'Xiaomi MiMo Studio', url: 'https://aistudio.xiaomimimo.com/?q=%s', favicon: 'https://xiaomimimo.com/favicon.ico' },
      { id: 'xinghuo', name: '讯飞星火', description: 'iFlytek Spark', url: 'https://xinghuo.xfyun.cn/desk?q=%s', favicon: 'https://xfyun.cn/favicon.ico' },
      { id: 'tiangong', name: '昆仑天工', description: 'Tiangong AI', url: 'https://www.tiangong.cn/?q=%s', favicon: 'https://tiangong.cn/favicon.ico' },
      { id: 'yuewen', name: '阶跃跃问', description: 'StepFun Yuewen', url: 'https://chat.stepfun.com/?q=%s', favicon: 'https://stepfun.com/favicon.ico' },
      { id: 'chatgpt', name: 'ChatGPT', description: 'OpenAI conversational AI', url: 'https://chatgpt.com/?q=%s', favicon: 'https://chatgpt.com/favicon.ico' },
      { id: 'claude', name: 'Claude', description: 'Anthropic AI assistant', url: 'https://claude.ai/new?q=%s', favicon: 'https://claude.ai/favicon.ico' },
      { id: 'gemini', name: 'Gemini', description: 'Google AI', url: 'https://gemini.google.com/app?q=%s', favicon: 'https://gemini.google.com/favicon.ico' },
      { id: 'grok', name: 'Grok', description: 'X (Twitter) AI', url: 'https://grok.com/?q=%s', favicon: 'https://x.com/favicon.ico' }
    ]
  },

  traditional: {
    name: 'Search Engines',
    icon: '🔍',
    engines: [
      { id: 'baidu', name: '百度', description: 'Chinese search engine', url: 'https://www.baidu.com/s?wd=%s', favicon: 'https://baidu.com/favicon.ico' },
      { id: 'google', name: 'Google', description: 'Most popular search', url: 'https://www.google.com/search?q=%s', favicon: 'https://google.com/favicon.ico' },
      { id: 'bing', name: 'Bing', description: 'Microsoft search', url: 'https://www.bing.com/search?q=%s', favicon: 'https://bing.com/favicon.ico' },
      { id: 'sogou', name: '搜狗', description: 'Chinese search engine', url: 'https://www.sogou.com/web?query=%s', favicon: 'https://sogou.com/favicon.ico' },
      { id: 'duckduckgo', name: 'DuckDuckGo', description: 'Privacy-focused search', url: 'https://duckduckgo.com/?q=%s', favicon: 'https://duckduckgo.com/favicon.ico' }
    ]
  },

  social: {
    name: 'Social Media',
    icon: '📱',
    engines: [
      { id: 'xiaohongshu', name: '小红书', description: 'Lifestyle sharing', url: 'https://www.xiaohongshu.com/search_result?keyword=%s', favicon: 'https://xiaohongshu.com/favicon.ico' },
      { id: 'douyin', name: '抖音', description: 'Short video platform', url: 'https://www.douyin.com/search/%s', favicon: 'https://douyin.com/favicon.ico' },
      { id: 'weibo', name: '微博 🔒', description: 'Social media (visitor gateway)', url: 'https://s.weibo.com/weibo?q=%s', favicon: 'https://weibo.com/favicon.ico' },
      { id: 'zhihu', name: '知乎', description: 'Chinese Q&A community', url: 'https://www.zhihu.com/search?q=%s', favicon: 'https://zhihu.com/favicon.ico' },
      { id: 'twitter', name: 'Twitter/X', description: 'Social network', url: 'https://twitter.com/search?q=%s', favicon: 'https://twitter.com/favicon.ico' },
      { id: 'reddit', name: 'Reddit', description: 'Community discussions', url: 'https://www.reddit.com/search/?q=%s', favicon: 'https://reddit.com/favicon.ico' },
      { id: 'facebook', name: 'Facebook', description: 'Social network', url: 'https://www.facebook.com/search/top/?q=%s', favicon: 'https://facebook.com/favicon.ico' }
    ]
  },

  video: {
    name: 'Video',
    icon: '🎥',
    engines: [
      { id: 'bilibili', name: '哔哩哔哩', description: 'Video sharing', url: 'https://search.bilibili.com/all?keyword=%s', favicon: 'https://bilibili.com/favicon.ico' },
      { id: 'xigua', name: '西瓜视频', description: 'Short video platform', url: 'https://www.ixigua.com/search/%s', favicon: 'https://ixigua.com/favicon.ico' },
      { id: 'youtube', name: 'YouTube', description: 'Video sharing', url: 'https://www.youtube.com/results?search_query=%s', favicon: 'https://youtube.com/favicon.ico' }
    ]
  },

  knowledge: {
    name: 'Knowledge',
    icon: '📚',
    engines: [
      { id: 'baike', name: '百度百科', description: 'Chinese encyclopedia', url: 'https://baike.baidu.com/search?word=%s', favicon: 'https://baike.baidu.com/favicon.ico' },
      { id: 'zhihu_k', name: '知乎', description: 'Chinese Q&A community', url: 'https://www.zhihu.com/search?q=%s', favicon: 'https://zhihu.com/favicon.ico' },
      { id: 'wikipedia', name: '维基百科', description: 'Free encyclopedia', url: 'https://zh.wikipedia.org/wiki/Special:Search?search=%s', favicon: 'https://wikipedia.org/favicon.ico' }
    ]
  },

  maps: {
    name: 'Maps',
    icon: '🗺️',
    engines: [
      { id: 'amap', name: '高德地图', description: 'Amap search', url: 'https://www.amap.com/search?query=%s', favicon: 'https://amap.com/favicon.ico' },
      { id: 'baidumap', name: '百度地图', description: 'Baidu map search', url: 'https://map.baidu.com/search?wd=%s', favicon: 'https://map.baidu.com/favicon.ico' },
      { id: 'qqmap', name: '腾讯地图', description: 'Tencent map search', url: 'https://map.qq.com/?what=%s', favicon: 'https://map.qq.com/favicon.ico' }
    ]
  },

  developer: {
    name: 'Developer',
    icon: '👨‍💻',
    engines: [
      { id: 'github', name: 'GitHub', description: 'Code hosting', url: 'https://github.com/search?q=%s', favicon: 'https://github.com/favicon.ico' },
      { id: 'stackoverflow', name: 'Stack Overflow', description: 'Q&A for developers', url: 'https://stackoverflow.com/search?q=%s', favicon: 'https://stackoverflow.com/favicon.ico' }
    ]
  },

  shopping: {
    name: 'Shopping',
    icon: '🛒',
    engines: [
      { id: 'taobao', name: '淘宝', description: 'Shopping platform', url: 'https://s.taobao.com/search?q=%s', favicon: 'https://taobao.com/favicon.ico' },
      { id: 'jd', name: '京东', description: 'E-commerce platform', url: 'https://search.jd.com/Search?keyword=%s', favicon: 'https://jd.com/favicon.ico' },
      { id: 'pinduoduo', name: '拼多多', description: 'Social commerce', url: 'https://mobile.yangkeduo.com/search_result.html?search_key=%s', favicon: 'https://pinduoduo.com/favicon.ico' },
      { id: 'amazon', name: 'Amazon', description: 'Online shopping', url: 'https://www.amazon.com/s?k=%s', favicon: 'https://amazon.com/favicon.ico' }
    ]
  }
};

// Default combos（默认组合，方便一键选一批）
const DEFAULT_COMBOS = [
  { id: 'all-ai', name: '🤖 All AI', engines: ['perplexity', 'metaso', 'you', 'chatgpt', 'claude', 'gemini', 'doubao', 'deepseek', 'minimax'] },
  { id: 'cn-ai', name: '🇨🇳 国产 AI', engines: ['doubao', 'deepseek', 'kimi', 'hunyuan', 'wenxin', 'tongyi', 'minimax', 'mimo'] },
  { id: 'traditional', name: '🔍 Traditional', engines: ['baidu', 'google', 'bing', 'duckduckgo'] },
  { id: 'me-check', name: '🔎 查查我自己', engines: ['baidu', 'bing', 'xiaohongshu', 'douyin', 'bilibili', 'zhihu', 'doubao', 'deepseek'] }
];

// Default settings
const DEFAULT_SETTINGS = {
  theme: 'auto',
  openMode: 'tab',
  groupTabs: true,
  collapsedGroups: false,
  showSidebar: true,
  rememberInput: true,
  language: 'zh',
  defaultEngines: ['baidu', 'bing', 'perplexity'],
  customEngines: [],
  combos: DEFAULT_COMBOS,
  customCombos: [],
  compactMode: false,
  collapsedCategories: []
};

// ── 远程引擎表（v1.3.6）────────────────────────────────────
// 引擎站点的 URL 会漂移（半年一次），靠「改代码 → 发版 → 商店审核」追太慢，
// 用户在此期间看到的是「点了没反应」。改为从官网拉取引擎表：
// 改服务器上一个 engines.json 就生效，不用发版。
// 站点对该文件带 Access-Control-Allow-Origin: *，因此**不需要额外主机权限**。
const ENGINE_REMOTE_URL = 'https://1so.u-claw.org.cn/engines.json';
const ENGINE_CACHE_KEY = 'engineTableRemote';
const ENGINE_REFRESH_MS = 6 * 60 * 60 * 1000;   // 6 小时内不重复拉

/**
 * 用远程表「就地」覆盖内置表。
 * 这样所有同步读 DEFAULT_ENGINES 的旧代码零改动，不用逐个改成异步。
 */
function applyEngineTable(table) {
  if (!table || typeof table.categories !== 'object' || table.categories === null) return false;
  const keys = Object.keys(table.categories);
  if (!keys.length) return false;
  for (const k of Object.keys(DEFAULT_ENGINES)) delete DEFAULT_ENGINES[k];
  for (const k of keys) DEFAULT_ENGINES[k] = table.categories[k];
  return true;
}

/**
 * 页面初始化早期 await 一次：有缓存立刻用（毫秒级），没有就用内置表。
 * 返回 true 表示用的是远程表。
 */
async function initEngineTable() {
  try {
    if (typeof chrome === 'undefined' || !chrome.storage) return false;
    const r = await chrome.storage.local.get([ENGINE_CACHE_KEY]);
    const cached = r && r[ENGINE_CACHE_KEY];
    if (cached && cached.categories) return applyEngineTable(cached);
  } catch (e) {
    console.warn('engine table: cache read failed', e);
  }
  return false;
}

/**
 * 后台刷新（不阻塞渲染，本次打开不重渲染，下次生效）。
 * 失败静默——引擎表拉不到不该影响搜索。
 */
async function refreshEngineTable(opts) {
  const force = !!(opts && opts.force);
  try {
    if (typeof chrome === 'undefined' || !chrome.storage) return { ok: false, reason: 'no-storage' };
    const r = await chrome.storage.local.get([ENGINE_CACHE_KEY]);
    const cached = r && r[ENGINE_CACHE_KEY];

    if (!force && cached && cached.fetchedAt && (Date.now() - cached.fetchedAt) < ENGINE_REFRESH_MS) {
      return { ok: true, skipped: 'fresh' };
    }

    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), 6000);
    let res;
    try {
      res = await fetch(ENGINE_REMOTE_URL, { signal: ctl.signal, cache: 'no-store' });
    } finally {
      clearTimeout(timer);
    }
    if (!res || !res.ok) return { ok: false, reason: 'http-' + (res ? res.status : 'n/a') };

    const data = await res.json();
    if (!data || !data.categories) return { ok: false, reason: 'bad-payload' };

    // 版本没变：只更新「最后检查时间」，避免每次都重新下载
    if (cached && Number(cached.version) >= Number(data.version)) {
      await chrome.storage.local.set({
        [ENGINE_CACHE_KEY]: Object.assign({}, cached, { fetchedAt: Date.now() })
      });
      return { ok: true, skipped: 'same-version' };
    }

    data.fetchedAt = Date.now();
    await chrome.storage.local.set({ [ENGINE_CACHE_KEY]: data });
    console.log('engine table: updated to version', data.version);
    return { ok: true, updated: true, version: data.version };
  } catch (e) {
    return { ok: false, reason: (e && e.name === 'AbortError') ? 'timeout' : String(e).slice(0, 80) };
  }
}
