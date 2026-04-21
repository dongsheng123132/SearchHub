// Default search engines configuration
const DEFAULT_ENGINES = {
  aiSearch: {
    name: 'AI Search',
    icon: '🤖',
    engines: [
      {
        id: 'perplexity',
        name: 'Perplexity',
        description: 'AI-powered answer engine',
        url: 'https://www.perplexity.ai/search?q=%s',
        favicon: 'https://www.google.com/s2/favicons?domain=perplexity.ai&sz=32'
      },
      {
        id: 'phind',
        name: 'Phind',
        description: 'AI search for developers',
        url: 'https://www.phind.com/search?q=%s',
        favicon: 'https://www.google.com/s2/favicons?domain=phind.com&sz=32'
      },
      {
        id: 'you',
        name: 'You.com',
        description: 'AI search engine',
        url: 'https://you.com/search?q=%s',
        favicon: 'https://www.google.com/s2/favicons?domain=you.com&sz=32'
      },
      {
        id: 'thinkanai',
        name: 'ThinkAny',
        description: 'AI search with sources',
        url: 'https://thinkany.ai/search?q=%s',
        favicon: 'https://www.google.com/s2/favicons?domain=thinkany.ai&sz=32'
      },
      {
        id: 'metaso',
        name: 'Metaso',
        description: 'Ad-free AI search',
        url: 'https://metaso.cn/?q=%s',
        favicon: 'https://www.google.com/s2/favicons?domain=metaso.cn&sz=32'
      },
      {
        id: 'pi',
        name: 'Pi',
        description: 'Inflection AI',
        url: 'https://pi.ai/talk?q=%s',
        favicon: 'https://www.google.com/s2/favicons?domain=pi.ai&sz=32'
      },
      {
        id: 'devv',
        name: 'Devv',
        description: 'AI search for developers',
        url: 'https://devv.ai/search?q=%s',
        favicon: 'https://www.google.com/s2/favicons?domain=devv.ai&sz=32'
      },
      {
        id: 'consensus',
        name: 'Consensus',
        description: 'AI-powered research search',
        url: 'https://consensus.app/search?q=%s',
        favicon: 'https://www.google.com/s2/favicons?domain=consensus.app&sz=32'
      },
      {
        id: 'semantic',
        name: 'Semantic Scholar',
        description: 'AI research papers',
        url: 'https://www.semanticscholar.org/search?q=%s',
        favicon: 'https://www.google.com/s2/favicons?domain=semanticscholar.org&sz=32'
      },
      {
        id: 'genspark',
        name: 'Genspark',
        description: 'AI search engine',
        url: 'https://www.genspark.ai/search?q=%s',
        favicon: 'https://www.google.com/s2/favicons?domain=genspark.ai&sz=32'
      },
      {
        id: 'monica',
        name: 'Monica',
        description: 'AI assistant search',
        url: 'https://monica.im/search?q=%s',
        favicon: 'https://www.google.com/s2/favicons?domain=monica.im&sz=32'
      },
      {
        id: 'exa',
        name: 'Exa',
        description: 'AI-powered search',
        url: 'https://exa.ai/search?q=%s',
        favicon: 'https://www.google.com/s2/favicons?domain=exa.ai&sz=32'
      },
      {
        id: 'felo',
        name: 'Felo',
        description: 'Cross-lingual AI search',
        url: 'https://felo.ai/search?q=%s',
        favicon: 'https://www.google.com/s2/favicons?domain=felo.ai&sz=32'
      }
    ]
  },

  aiChat: {
    name: 'AI Chat',
    icon: '💬',
    engines: [
      {
        id: 'chatgpt',
        name: 'ChatGPT',
        description: 'OpenAI conversational AI',
        url: 'https://chatgpt.com/?q=%s',
        favicon: 'https://www.google.com/s2/favicons?domain=chatgpt.com&sz=32'
      },
      {
        id: 'claude',
        name: 'Claude',
        description: 'Anthropic AI assistant',
        url: 'https://claude.ai/new?q=%s',
        favicon: 'https://www.google.com/s2/favicons?domain=claude.ai&sz=32'
      },
      {
        id: 'gemini',
        name: 'Gemini',
        description: 'Google AI',
        url: 'https://gemini.google.com/app?q=%s',
        favicon: 'https://www.google.com/s2/favicons?domain=gemini.google.com&sz=32'
      },
      {
        id: 'zhipu',
        name: 'ChatGLM',
        description: 'Zhipu AI chat',
        url: 'https://chatglm.cn/?q=%s',
        favicon: 'https://www.google.com/s2/favicons?domain=chatglm.cn&sz=32'
      },
      {
        id: 'doubao',
        name: 'Doubao',
        description: 'ByteDance AI',
        url: 'https://www.doubao.com/chat/?q=%s',
        favicon: 'https://www.google.com/s2/favicons?domain=doubao.com&sz=32'
      },
      {
        id: 'wenxin',
        name: 'Wenxin',
        description: 'Baidu AI chat',
        url: 'https://yiyan.baidu.com/?q=%s',
        favicon: 'https://www.google.com/s2/favicons?domain=baidu.com&sz=32'
      },
      {
        id: 'tongyi',
        name: 'Tongyi',
        description: 'Alibaba Cloud AI',
        url: 'https://tongyi.aliyun.com/qianwen/?q=%s',
        favicon: 'https://www.google.com/s2/favicons?domain=aliyun.com&sz=32'
      },
      {
        id: 'kimi',
        name: 'Kimi',
        description: 'Moonshot AI',
        url: 'https://kimi.moonshot.cn/?q=%s',
        favicon: 'https://www.google.com/s2/favicons?domain=moonshot.cn&sz=32'
      },
      {
        id: 'grok',
        name: 'Grok',
        description: 'X (Twitter) AI',
        url: 'https://grok.com/?q=%s',
        favicon: 'https://www.google.com/s2/favicons?domain=x.com&sz=32'
      },
      {
        id: 'hunyuan',
        name: 'Yuanbao',
        description: 'Tencent AI assistant',
        url: 'https://yuanbao.tencent.com/chat?q=%s',
        favicon: 'https://www.google.com/s2/favicons?domain=yuanbao.tencent.com&sz=32'
      },
      {
        id: 'deepseek',
        name: 'DeepSeek',
        description: 'DeepSeek AI chat',
        url: 'https://chat.deepseek.com/?q=%s',
        favicon: 'https://www.google.com/s2/favicons?domain=deepseek.com&sz=32'
      },
      {
        id: 'manus',
        name: 'Manus',
        description: 'General AI Agent',
        url: 'https://manus.im/app?q=%s',
        favicon: 'https://www.google.com/s2/favicons?domain=manus.im&sz=32'
      }
    ]
  },

  traditional: {
    name: 'Search Engines',
    icon: '🔍',
    engines: [
      {
        id: 'google',
        name: 'Google',
        description: 'Most popular search',
        url: 'https://www.google.com/search?q=%s',
        favicon: 'https://www.google.com/s2/favicons?domain=google.com&sz=32'
      },
      {
        id: 'bing',
        name: 'Bing',
        description: 'Microsoft search',
        url: 'https://www.bing.com/search?q=%s',
        favicon: 'https://www.google.com/s2/favicons?domain=bing.com&sz=32'
      },
      {
        id: 'baidu',
        name: 'Baidu',
        description: 'Chinese search engine',
        url: 'https://www.baidu.com/s?wd=%s',
        favicon: 'https://www.google.com/s2/favicons?domain=baidu.com&sz=32'
      },
      {
        id: 'sogou',
        name: 'Sogou',
        description: 'Chinese search engine',
        url: 'https://www.sogou.com/web?query=%s',
        favicon: 'https://www.google.com/s2/favicons?domain=sogou.com&sz=32'
      },
      {
        id: 'duckduckgo',
        name: 'DuckDuckGo',
        description: 'Privacy-focused search',
        url: 'https://duckduckgo.com/?q=%s',
        favicon: 'https://www.google.com/s2/favicons?domain=duckduckgo.com&sz=32'
      },
      {
        id: 'yandex',
        name: 'Yandex',
        description: 'Russian search engine',
        url: 'https://yandex.com/search/?text=%s',
        favicon: 'https://www.google.com/s2/favicons?domain=yandex.com&sz=32'
      },
      {
        id: 'yahoo',
        name: 'Yahoo',
        description: 'Yahoo search',
        url: 'https://search.yahoo.com/search?p=%s',
        favicon: 'https://www.google.com/s2/favicons?domain=yahoo.com&sz=32'
      }
    ]
  },

  social: {
    name: 'Social Media',
    icon: '📱',
    engines: [
      {
        id: 'xiaohongshu',
        name: 'Xiaohongshu',
        description: 'Lifestyle sharing',
        url: 'https://www.xiaohongshu.com/search_result?keyword=%s',
        favicon: 'https://www.google.com/s2/favicons?domain=xiaohongshu.com&sz=32'
      },
      {
        id: 'douyin',
        name: 'Douyin',
        description: 'Short video platform',
        url: 'https://www.douyin.com/search/%s',
        favicon: 'https://www.google.com/s2/favicons?domain=douyin.com&sz=32'
      },
      {
        id: 'weibo',
        name: 'Weibo',
        description: 'Social media',
        url: 'https://s.weibo.com/weibo?q=%s',
        favicon: 'https://www.google.com/s2/favicons?domain=weibo.com&sz=32'
      },
      {
        id: 'twitter',
        name: 'Twitter/X',
        description: 'Social network',
        url: 'https://twitter.com/search?q=%s',
        favicon: 'https://www.google.com/s2/favicons?domain=twitter.com&sz=32'
      },
      {
        id: 'reddit',
        name: 'Reddit',
        description: 'Community discussions',
        url: 'https://www.reddit.com/search/?q=%s',
        favicon: 'https://www.google.com/s2/favicons?domain=reddit.com&sz=32'
      },
      {
        id: 'facebook',
        name: 'Facebook',
        description: 'Social network',
        url: 'https://www.facebook.com/search/top/?q=%s',
        favicon: 'https://www.google.com/s2/favicons?domain=facebook.com&sz=32'
      },
      {
        id: 'medium',
        name: 'Medium',
        description: 'Articles & stories',
        url: 'https://medium.com/search?q=%s',
        favicon: 'https://www.google.com/s2/favicons?domain=medium.com&sz=32'
      },
      {
        id: 'substack',
        name: 'Substack',
        description: 'Newsletter platform',
        url: 'https://substack.com/search?q=%s',
        favicon: 'https://www.google.com/s2/favicons?domain=substack.com&sz=32'
      },
      {
        id: 'pinterest',
        name: 'Pinterest',
        description: 'Visual discovery',
        url: 'https://www.pinterest.com/search/pins/?q=%s',
        favicon: 'https://www.google.com/s2/favicons?domain=pinterest.com&sz=32'
      },
      {
        id: 'quora',
        name: 'Quora',
        description: 'Q&A platform',
        url: 'https://www.quora.com/search?q=%s',
        favicon: 'https://www.google.com/s2/favicons?domain=quora.com&sz=32'
      },
      {
        id: 'threads',
        name: 'Threads',
        description: 'Meta social network',
        url: 'https://www.threads.net/search?q=%s',
        favicon: 'https://www.google.com/s2/favicons?domain=threads.net&sz=32'
      },
      {
        id: 'producthunt',
        name: 'Product Hunt',
        description: 'Product discovery',
        url: 'https://www.producthunt.com/search?q=%s',
        favicon: 'https://www.google.com/s2/favicons?domain=producthunt.com&sz=32'
      }
    ]
  },

  video: {
    name: 'Video',
    icon: '🎥',
    engines: [
      {
        id: 'youtube',
        name: 'YouTube',
        description: 'Video sharing',
        url: 'https://www.youtube.com/results?search_query=%s',
        favicon: 'https://www.google.com/s2/favicons?domain=youtube.com&sz=32'
      },
      {
        id: 'bilibili',
        name: 'Bilibili',
        description: 'Video sharing',
        url: 'https://search.bilibili.com/all?keyword=%s',
        favicon: 'https://www.google.com/s2/favicons?domain=bilibili.com&sz=32'
      },
      {
        id: 'xigua',
        name: 'Xigua',
        description: 'Short video platform',
        url: 'https://www.ixigua.com/search/%s',
        favicon: 'https://www.google.com/s2/favicons?domain=ixigua.com&sz=32'
      }
    ]
  },

  developer: {
    name: 'Developer',
    icon: '👨‍💻',
    engines: [
      {
        id: 'github',
        name: 'GitHub',
        description: 'Code hosting',
        url: 'https://github.com/search?q=%s',
        favicon: 'https://www.google.com/s2/favicons?domain=github.com&sz=32'
      },
      {
        id: 'stackoverflow',
        name: 'Stack Overflow',
        description: 'Q&A for developers',
        url: 'https://stackoverflow.com/search?q=%s',
        favicon: 'https://www.google.com/s2/favicons?domain=stackoverflow.com&sz=32'
      },
      {
        id: 'mdn',
        name: 'MDN',
        description: 'Web docs',
        url: 'https://developer.mozilla.org/en-US/search?q=%s',
        favicon: 'https://www.google.com/s2/favicons?domain=mozilla.org&sz=32'
      },
      {
        id: 'npm',
        name: 'NPM',
        description: 'Package registry',
        url: 'https://www.npmjs.com/search?q=%s',
        favicon: 'https://www.google.com/s2/favicons?domain=npmjs.com&sz=32'
      }
    ]
  },

  shopping: {
    name: 'Shopping',
    icon: '🛒',
    engines: [
      {
        id: 'amazon',
        name: 'Amazon',
        description: 'Online shopping',
        url: 'https://www.amazon.com/s?k=%s',
        favicon: 'https://www.google.com/s2/favicons?domain=amazon.com&sz=32'
      },
      {
        id: 'taobao',
        name: 'Taobao',
        description: 'Shopping platform',
        url: 'https://s.taobao.com/search?q=%s',
        favicon: 'https://www.google.com/s2/favicons?domain=taobao.com&sz=32'
      },
      {
        id: 'jd',
        name: 'JD',
        description: 'E-commerce platform',
        url: 'https://search.jd.com/Search?keyword=%s',
        favicon: 'https://www.google.com/s2/favicons?domain=jd.com&sz=32'
      },
      {
        id: 'pinduoduo',
        name: 'Pinduoduo',
        description: 'Social commerce',
        url: 'https://mobile.yangkeduo.com/search_result.html?search_key=%s',
        favicon: 'https://www.google.com/s2/favicons?domain=pinduoduo.com&sz=32'
      }
    ]
  },

  knowledge: {
    name: 'Knowledge',
    icon: '📚',
    engines: [
      {
        id: 'wikipedia',
        name: 'Wikipedia',
        description: 'Free encyclopedia',
        url: 'https://en.wikipedia.org/wiki/Special:Search?search=%s',
        favicon: 'https://www.google.com/s2/favicons?domain=wikipedia.org&sz=32'
      },
      {
        id: 'zhihu',
        name: 'Zhihu',
        description: 'Chinese Q&A community',
        url: 'https://www.zhihu.com/search?q=%s',
        favicon: 'https://www.google.com/s2/favicons?domain=zhihu.com&sz=32'
      },
      {
        id: 'baike',
        name: 'Baidu Baike',
        description: 'Chinese encyclopedia',
        url: 'https://baike.baidu.com/search?word=%s',
        favicon: 'https://www.google.com/s2/favicons?domain=baike.baidu.com&sz=32'
      }
    ]
  }
};

// Default combos (reduced to 3 most commonly used, leaving more space for user custom combos)
const DEFAULT_COMBOS = [
  {
    id: 'all-ai',
    name: '🤖 All AI',
    engines: ['perplexity', 'phind', 'you', 'metaso', 'chatgpt', 'claude', 'gemini', 'grok']
  },
  {
    id: 'traditional',
    name: '🔍 Traditional',
    engines: ['google', 'bing', 'baidu', 'duckduckgo']
  },
  {
    id: 'ai-chat-only',
    name: '💬 AI Chat',
    engines: ['chatgpt', 'claude', 'gemini', 'grok', 'deepseek', 'kimi', 'hunyuan']
  }
];

// Default settings
const DEFAULT_SETTINGS = {
  theme: 'auto', // 'light', 'dark', 'auto'
  openMode: 'tab', // 'tab', 'window'
  groupTabs: true,
  collapsedGroups: false, // Changed to false, expand groups by default
  showSidebar: true, // Changed to true, show sidebar by default
  rememberInput: true,
  language: 'en', // 'en', 'zh', 'auto' - English by default
  defaultEngines: ['google', 'bing', 'perplexity'],
  customEngines: [],
  combos: DEFAULT_COMBOS,
  customCombos: [], // User custom combos (max 5)
  compactMode: false, // Compact mode: only show logo and name, no description
  collapsedCategories: [] // List of collapsed category IDs
};
