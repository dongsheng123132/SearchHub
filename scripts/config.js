// Default search engines configuration
// v1.3.0：精简冷门引擎（phind/pi/devv/consensus/semantic/thinkany/mdn/npm 等），
//         新增国产 AI（海螺 MiniMax / 小米 MiMo / 讯飞星火 / 昆仑天工 / 阶跃跃问）。
// 注意：改动必须同步到 background.js 的 findDefaultEngineById（右键/快捷键搜索用）。
const DEFAULT_ENGINES = {
  aiSearch: {
    name: 'AI Search',
    icon: '🤖',
    engines: [
      { id: 'perplexity', name: 'Perplexity', description: 'AI-powered answer engine', url: 'https://www.perplexity.ai/search?q=%s', favicon: 'https://www.google.com/s2/favicons?domain=perplexity.ai&sz=32' },
      { id: 'metaso', name: '秘塔 Metaso', description: '无广告 AI 搜索', url: 'https://metaso.cn/?q=%s', favicon: 'https://www.google.com/s2/favicons?domain=metaso.cn&sz=32' },
      { id: 'genspark', name: 'Genspark', description: 'AI search engine', url: 'https://www.genspark.ai/search?q=%s', favicon: 'https://www.google.com/s2/favicons?domain=genspark.ai&sz=32' },
      { id: 'felo', name: 'Felo', description: 'Cross-lingual AI search', url: 'https://felo.ai/search?q=%s', favicon: 'https://www.google.com/s2/favicons?domain=felo.ai&sz=32' },
      { id: 'you', name: 'You.com 🔒', description: 'AI search engine (requires login)', url: 'https://you.com/search?q=%s', favicon: 'https://www.google.com/s2/favicons?domain=you.com&sz=32' },
      { id: 'exa', name: 'Exa 🔒', description: 'AI-powered search (requires login)', url: 'https://exa.ai/search?q=%s', favicon: 'https://www.google.com/s2/favicons?domain=exa.ai&sz=32' },
      { id: 'monica', name: 'Monica', description: 'AI assistant search', url: 'https://s.monica.im/search?q=%s', favicon: 'https://www.google.com/s2/favicons?domain=monica.so&sz=32' }
    ]
  },

  aiChat: {
    name: 'AI Chat',
    icon: '💬',
    engines: [
      { id: 'doubao', name: '豆包 Doubao', description: 'ByteDance AI', url: 'https://www.doubao.com/chat/?q=%s', favicon: 'https://www.google.com/s2/favicons?domain=doubao.com&sz=32' },
      { id: 'deepseek', name: 'DeepSeek', description: 'DeepSeek AI chat', url: 'https://chat.deepseek.com/?q=%s', favicon: 'https://www.google.com/s2/favicons?domain=deepseek.com&sz=32' },
      { id: 'kimi', name: 'Kimi', description: 'Moonshot AI', url: 'https://www.kimi.com/?q=%s', favicon: 'https://www.google.com/s2/favicons?domain=kimi.com&sz=32' },
      { id: 'hunyuan', name: '腾讯元宝', description: 'Tencent AI assistant', url: 'https://yuanbao.tencent.com/?q=%s', favicon: 'https://www.google.com/s2/favicons?domain=yuanbao.tencent.com&sz=32' },
      { id: 'wenxin', name: '文心一言', description: 'Baidu AI chat', url: 'https://wenxin.baidu.com/?q=%s', favicon: 'https://www.google.com/s2/favicons?domain=wenxin.baidu.com&sz=32' },
      { id: 'tongyi', name: '通义千问', description: 'Alibaba Cloud AI', url: 'https://www.qianwen.com/?q=%s', favicon: 'https://www.google.com/s2/favicons?domain=qianwen.com&sz=32' },
      { id: 'zhipu', name: '智谱清言', description: 'Zhipu AI chat', url: 'https://chatglm.cn/?q=%s', favicon: 'https://www.google.com/s2/favicons?domain=chatglm.cn&sz=32' },
      { id: 'minimax', name: '海螺 MiniMax', description: 'MiniMax AI 对话', url: 'https://hailuoai.com/?q=%s', favicon: 'https://www.google.com/s2/favicons?domain=hailuoai.com&sz=32' },
      { id: 'mimo', name: '小米 MiMo', description: 'Xiaomi MiMo Studio', url: 'https://aistudio.xiaomimimo.com/?q=%s', favicon: 'https://www.google.com/s2/favicons?domain=xiaomimimo.com&sz=32' },
      { id: 'xinghuo', name: '讯飞星火', description: 'iFlytek Spark', url: 'https://xinghuo.xfyun.cn/desk?q=%s', favicon: 'https://www.google.com/s2/favicons?domain=xfyun.cn&sz=32' },
      { id: 'tiangong', name: '昆仑天工', description: 'Tiangong AI', url: 'https://www.tiangong.cn/?q=%s', favicon: 'https://www.google.com/s2/favicons?domain=tiangong.cn&sz=32' },
      { id: 'yuewen', name: '阶跃跃问', description: 'StepFun Yuewen', url: 'https://chat.stepfun.com/?q=%s', favicon: 'https://www.google.com/s2/favicons?domain=stepfun.com&sz=32' },
      { id: 'chatgpt', name: 'ChatGPT', description: 'OpenAI conversational AI', url: 'https://chatgpt.com/?q=%s', favicon: 'https://www.google.com/s2/favicons?domain=chatgpt.com&sz=32' },
      { id: 'claude', name: 'Claude', description: 'Anthropic AI assistant', url: 'https://claude.ai/new?q=%s', favicon: 'https://www.google.com/s2/favicons?domain=claude.ai&sz=32' },
      { id: 'gemini', name: 'Gemini', description: 'Google AI', url: 'https://gemini.google.com/app?q=%s', favicon: 'https://www.google.com/s2/favicons?domain=gemini.google.com&sz=32' },
      { id: 'grok', name: 'Grok', description: 'X (Twitter) AI', url: 'https://grok.com/?q=%s', favicon: 'https://www.google.com/s2/favicons?domain=x.com&sz=32' }
    ]
  },

  traditional: {
    name: 'Search Engines',
    icon: '🔍',
    engines: [
      { id: 'baidu', name: '百度', description: 'Chinese search engine', url: 'https://www.baidu.com/s?wd=%s', favicon: 'https://www.google.com/s2/favicons?domain=baidu.com&sz=32' },
      { id: 'google', name: 'Google', description: 'Most popular search', url: 'https://www.google.com/search?q=%s', favicon: 'https://www.google.com/s2/favicons?domain=google.com&sz=32' },
      { id: 'bing', name: 'Bing', description: 'Microsoft search', url: 'https://www.bing.com/search?q=%s', favicon: 'https://www.google.com/s2/favicons?domain=bing.com&sz=32' },
      { id: 'sogou', name: '搜狗', description: 'Chinese search engine', url: 'https://www.sogou.com/web?query=%s', favicon: 'https://www.google.com/s2/favicons?domain=sogou.com&sz=32' },
      { id: 'duckduckgo', name: 'DuckDuckGo', description: 'Privacy-focused search', url: 'https://duckduckgo.com/?q=%s', favicon: 'https://www.google.com/s2/favicons?domain=duckduckgo.com&sz=32' }
    ]
  },

  social: {
    name: 'Social Media',
    icon: '📱',
    engines: [
      { id: 'xiaohongshu', name: '小红书', description: 'Lifestyle sharing', url: 'https://www.xiaohongshu.com/search_result?keyword=%s', favicon: 'https://www.google.com/s2/favicons?domain=xiaohongshu.com&sz=32' },
      { id: 'douyin', name: '抖音', description: 'Short video platform', url: 'https://www.douyin.com/search/%s', favicon: 'https://www.google.com/s2/favicons?domain=douyin.com&sz=32' },
      { id: 'weibo', name: '微博 🔒', description: 'Social media (visitor gateway)', url: 'https://s.weibo.com/weibo?q=%s', favicon: 'https://www.google.com/s2/favicons?domain=weibo.com&sz=32' },
      { id: 'zhihu', name: '知乎', description: 'Chinese Q&A community', url: 'https://www.zhihu.com/search?q=%s', favicon: 'https://www.google.com/s2/favicons?domain=zhihu.com&sz=32' },
      { id: 'twitter', name: 'Twitter/X', description: 'Social network', url: 'https://twitter.com/search?q=%s', favicon: 'https://www.google.com/s2/favicons?domain=twitter.com&sz=32' },
      { id: 'reddit', name: 'Reddit', description: 'Community discussions', url: 'https://www.reddit.com/search/?q=%s', favicon: 'https://www.google.com/s2/favicons?domain=reddit.com&sz=32' },
      { id: 'facebook', name: 'Facebook', description: 'Social network', url: 'https://www.facebook.com/search/top/?q=%s', favicon: 'https://www.google.com/s2/favicons?domain=facebook.com&sz=32' }
    ]
  },

  video: {
    name: 'Video',
    icon: '🎥',
    engines: [
      { id: 'bilibili', name: '哔哩哔哩', description: 'Video sharing', url: 'https://search.bilibili.com/all?keyword=%s', favicon: 'https://www.google.com/s2/favicons?domain=bilibili.com&sz=32' },
      { id: 'xigua', name: '西瓜视频', description: 'Short video platform', url: 'https://www.ixigua.com/search/%s', favicon: 'https://www.google.com/s2/favicons?domain=ixigua.com&sz=32' },
      { id: 'youtube', name: 'YouTube', description: 'Video sharing', url: 'https://www.youtube.com/results?search_query=%s', favicon: 'https://www.google.com/s2/favicons?domain=youtube.com&sz=32' }
    ]
  },

  knowledge: {
    name: 'Knowledge',
    icon: '📚',
    engines: [
      { id: 'baike', name: '百度百科', description: 'Chinese encyclopedia', url: 'https://baike.baidu.com/search?word=%s', favicon: 'https://www.google.com/s2/favicons?domain=baike.baidu.com&sz=32' },
      { id: 'zhihu_k', name: '知乎', description: 'Chinese Q&A community', url: 'https://www.zhihu.com/search?q=%s', favicon: 'https://www.google.com/s2/favicons?domain=zhihu.com&sz=32' },
      { id: 'wikipedia', name: '维基百科', description: 'Free encyclopedia', url: 'https://zh.wikipedia.org/wiki/Special:Search?search=%s', favicon: 'https://www.google.com/s2/favicons?domain=wikipedia.org&sz=32' }
    ]
  },

  maps: {
    name: 'Maps',
    icon: '🗺️',
    engines: [
      { id: 'amap', name: '高德地图', description: 'Amap search', url: 'https://www.amap.com/search?query=%s', favicon: 'https://www.google.com/s2/favicons?domain=amap.com&sz=32' },
      { id: 'baidumap', name: '百度地图', description: 'Baidu map search', url: 'https://map.baidu.com/search?wd=%s', favicon: 'https://www.google.com/s2/favicons?domain=map.baidu.com&sz=32' },
      { id: 'qqmap', name: '腾讯地图', description: 'Tencent map search', url: 'https://map.qq.com/?what=%s', favicon: 'https://www.google.com/s2/favicons?domain=map.qq.com&sz=32' }
    ]
  },

  developer: {
    name: 'Developer',
    icon: '👨‍💻',
    engines: [
      { id: 'github', name: 'GitHub', description: 'Code hosting', url: 'https://github.com/search?q=%s', favicon: 'https://www.google.com/s2/favicons?domain=github.com&sz=32' },
      { id: 'stackoverflow', name: 'Stack Overflow', description: 'Q&A for developers', url: 'https://stackoverflow.com/search?q=%s', favicon: 'https://www.google.com/s2/favicons?domain=stackoverflow.com&sz=32' }
    ]
  },

  shopping: {
    name: 'Shopping',
    icon: '🛒',
    engines: [
      { id: 'taobao', name: '淘宝', description: 'Shopping platform', url: 'https://s.taobao.com/search?q=%s', favicon: 'https://www.google.com/s2/favicons?domain=taobao.com&sz=32' },
      { id: 'jd', name: '京东', description: 'E-commerce platform', url: 'https://search.jd.com/Search?keyword=%s', favicon: 'https://www.google.com/s2/favicons?domain=jd.com&sz=32' },
      { id: 'pinduoduo', name: '拼多多', description: 'Social commerce', url: 'https://mobile.yangkeduo.com/search_result.html?search_key=%s', favicon: 'https://www.google.com/s2/favicons?domain=pinduoduo.com&sz=32' },
      { id: 'amazon', name: 'Amazon', description: 'Online shopping', url: 'https://www.amazon.com/s?k=%s', favicon: 'https://www.google.com/s2/favicons?domain=amazon.com&sz=32' }
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
