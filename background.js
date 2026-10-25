// Background service worker for 1SO SearchHub

const TAB_COLORS = ['blue', 'red', 'yellow', 'green', 'pink', 'purple', 'cyan', 'orange'];
let colorIndex = 0;
let tabGroups = new Map(); // Track tab groups by search query

// 能力探测：国产 Chromium 外壳（360 / QQ 等）内核可能很新，但**不实现**官方专有 API。
// 缺失时不能靠运气——缺 tabGroups 会让分组抛错、把后面的「聚焦标签 + 开侧栏」一起带走；
// 缺 sidePanel 时降级成独立侧栏窗口，否则用户看到的就是「点了没反应」。
const CAPS = {
  tabGroups: typeof chrome.tabGroups !== 'undefined' && typeof chrome.tabs?.group === 'function',
  sidePanel: typeof chrome.sidePanel !== 'undefined' && typeof chrome.sidePanel.open === 'function',
  systemDisplay: typeof chrome.system !== 'undefined' &&
    typeof chrome.system.display !== 'undefined' &&
    typeof chrome.system.display.getInfo === 'function',
};

// Initialize on install
chrome.runtime.onInstalled.addListener(async () => {
  console.log('1SO SearchHub installed');

  // Set up side panel behavior
  try {
    await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: false });
    console.log('Side panel behavior configured');
  } catch (error) {
    console.error('Failed to configure side panel:', error);
  }

  setupContextMenus();
  cleanupOldGroups();
});

// Extension icon click handler - open main page
chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({ url: 'index.html' });
});

// Message handler
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'search') {
    handleSearch(message);
    return true;
  } else if (message.action === 'followUp') {
    // 中继追问到所有 AI 页面标签（content.js 在另一端接收）
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach(tab => {
        if (tab.id !== sender.tab?.id) {
          chrome.tabs.sendMessage(tab.id, { action: 'followUp', question: message.question }).catch(() => {});
        }
      });
    });
    return true;
  } else if (message.action === 'getSettings') {
    chrome.storage.sync.get(['settings'], (result) => {
      sendResponse({ settings: result.settings });
    });
    return true;
  }
});

// Handle search action
async function handleSearch(message) {
  const { query, urls, settings } = message;

  try {
    // Save last query
    await chrome.storage.local.set({ lastQuery: query });

    if (settings.openMode === 'window') {
      // Open in multiple windows
      await openInWindows(urls, query, settings);
    } else {
      // Open in tabs (default)
      await openInTabs(urls, query, settings);
    }
  } catch (error) {
    console.error('Search failed:', error);
  }
}

// Open search results in tabs
// 注意：这里刻意拆成四段独立 try —— 分组能力缺失只是「少一个增强」，
// 不能连带把聚焦首标签、打开结果面板一起弄没（v1.3.5 修复）。
async function openInTabs(urls, query, settings) {
  let windowId = null;
  try {
    const [currentTab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    windowId = currentTab ? currentTab.windowId : null;
  } catch (error) {
    console.error('Failed to resolve current window:', error);
  }

  // 1) 建标签（逐个兜底，一个失败不拖累其余）
  const createdTabs = [];
  for (const item of urls) {
    try {
      const tab = await chrome.tabs.create({ url: item.url, active: false });
      createdTabs.push(tab);
    } catch (error) {
      console.error('Failed to create tab:', item.url, error);
    }
  }

  // 2) 分组（不支持时静默跳过）
  if (settings.groupTabs && createdTabs.length > 0) {
    if (CAPS.tabGroups) {
      try {
        const tabIds = createdTabs.map(tab => tab.id);
        const groupId = await chrome.tabs.group({ tabIds });

        await chrome.tabGroups.update(groupId, {
          title: query.length > 20 ? query.substring(0, 20) + '...' : query,
          color: TAB_COLORS[colorIndex % TAB_COLORS.length],
          collapsed: settings.collapsedGroups
        });

        colorIndex++;
        tabGroups.set(groupId, { query, tabIds, timestamp: Date.now() });
      } catch (error) {
        console.error('Tab grouping failed (skipped):', error);
      }
    } else {
      // 内核没有标签分组：只留在内存里，不影响用户拿到结果
      tabGroups.set('nogroup-' + Date.now(), {
        query,
        tabIds: createdTabs.map(tab => tab.id),
        timestamp: Date.now()
      });
    }
  }

  // 3) 聚焦首个结果
  if (createdTabs.length > 0) {
    try {
      await chrome.tabs.update(createdTabs[0].id, { active: true });
    } catch (error) {
      console.error('Failed to focus first tab:', error);
    }
  }

  // 4) 打开结果面板：原生侧边栏 → 降级独立窗口
  if (windowId) {
    setTimeout(async () => {
      if (CAPS.sidePanel) {
        try {
          await chrome.sidePanel.open({ windowId });
          console.log('Sidebar opened successfully for window:', windowId);
          return;
        } catch (error) {
          console.error('Failed to open sidebar:', error);
          try {
            await chrome.sidePanel.setOptions({ path: 'sidebar.html', enabled: true });
            await chrome.sidePanel.open({ windowId });
            console.log('Sidebar opened with alternative method');
            return;
          } catch (err) {
            console.error('Alternative method also failed:', err);
          }
        }
        // 关键：API 存在却打不开，几乎都是「用户手势已过期」（index.html 那边的直接调用
        // 才是主路径）。此时**不能**降级开窗口 —— 会和已打开的原生侧栏双开。
        console.warn('sidePanel exists but open failed (likely gesture expired); skip fallback');
        return;
      }
      // 只有内核根本不实现 sidePanel（360 / QQ 等）才降级到独立小窗
      try {
        await chrome.windows.create({
          url: `sidebar.html?win=${windowId}`,
          type: 'popup',
          width: 380,
          height: 860
        });
        console.log('Fallback sidebar window opened (no sidePanel API)');
      } catch (err) {
        console.error('Fallback sidebar window failed:', err);
      }
    }, 100);
  }
}

// Open search results in windows
async function openInWindows(urls, query, settings) {
  try {
    // 没有屏幕信息（部分内核不实现 system.display）→ 退化成普通窗口，别直接 return
    if (!CAPS.systemDisplay) {
      for (const item of urls) {
        await chrome.windows.create({ url: item.url, type: 'normal' });
      }
      return;
    }

    // Get display info
    const displays = await chrome.system.display.getInfo();
    if (displays.length === 0) {
      console.error('No display found');
      for (const item of urls) {
        await chrome.windows.create({ url: item.url, type: 'normal' });
      }
      return;
    }

    const display = displays[0];
    const workArea = display.workArea;
    const windowWidth = Math.floor(workArea.width / urls.length);
    const windowHeight = workArea.height;

    // Create windows side by side
    for (let i = 0; i < urls.length; i++) {
      const left = workArea.left + (i * windowWidth);
      const top = workArea.top;

      await chrome.windows.create({
        url: urls[i].url,
        left,
        top,
        width: windowWidth,
        height: windowHeight,
        type: 'normal',
        focused: i === 0
      });
    }
  } catch (error) {
    console.error('Failed to open windows:', error);
  }
}

// Note: setupContextMenus and cleanupOldGroups are called in the main onInstalled listener above

function setupContextMenus() {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: 'searchHub-search',
      title: 'Search with 1SO SearchHub',
      contexts: ['selection']
    });

    chrome.contextMenus.create({
      id: 'searchHub-separator',
      type: 'separator',
      contexts: ['selection']
    });

    chrome.contextMenus.create({
      id: 'searchHub-settings',
      title: '1SO SearchHub Settings',
      contexts: ['action']
    });
  });
}

// Context menu click handler
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'searchHub-search') {
    handleContextMenuSearch(info.selectionText, tab);
  } else if (info.menuItemId === 'searchHub-settings') {
    chrome.tabs.create({ url: 'settings.html' });
  }
});

async function handleContextMenuSearch(text, tab) {
  try {
    // Get selected engines
    const result = await chrome.storage.local.get(['selectedEngines']);
    const selectedEngines = result.selectedEngines || [];

    if (selectedEngines.length === 0) {
      // Show notification if no engines selected
      await showNotification('Please select search engines first', 'Open 1SO SearchHub to select engines');
      return;
    }

    // Get settings
    const settingsResult = await chrome.storage.sync.get(['settings']);
    const settings = settingsResult.settings || {};

    // Build URLs
    const urls = [];
    for (const engineId of selectedEngines) {
      const engine = await findEngineById(engineId);
      if (engine) {
        urls.push({
          url: engine.url.replace('%s', encodeURIComponent(text)),
          name: engine.name
        });
      }
    }

    // Perform search
    await handleSearch({
      query: text,
      urls,
      settings
    });
  } catch (error) {
    console.error('Context menu search failed:', error);
  }
}

// Find engine by ID (including custom engines)
async function findEngineById(engineId) {
  // First check default engines
  const defaultEngine = findDefaultEngineById(engineId);
  if (defaultEngine) {
    return defaultEngine;
  }
  
  // Then check custom engines
  try {
    const result = await chrome.storage.sync.get(['settings']);
    const customEngines = result.settings?.customEngines || [];
    const customEngine = customEngines.find(e => e.id === engineId);
    if (customEngine) {
      return {
        url: customEngine.url,
        name: customEngine.name
      };
    }
  } catch (error) {
    console.error('Failed to load custom engines:', error);
  }
  
  return null;
}

// Find engine by ID from default engines only
function findDefaultEngineById(engineId) {
  // 与 scripts/config.js 保持同步（v1.3.0）
  const engineMap = {
    // AI Search
    'perplexity': { url: 'https://www.perplexity.ai/search?q=%s', name: 'Perplexity' },
    'metaso': { url: 'https://metaso.cn/?q=%s', name: '秘塔 Metaso' },
    'genspark': { url: 'https://www.genspark.ai/search?q=%s', name: 'Genspark' },
    'felo': { url: 'https://felo.ai/search?q=%s', name: 'Felo' },
    'you': { url: 'https://you.com/search?q=%s', name: 'You.com' },
    'exa': { url: 'https://exa.ai/search?q=%s', name: 'Exa' },
    'monica': { url: 'https://s.monica.im/search?q=%s', name: 'Monica' },

    // AI Chat
    'doubao': { url: 'https://www.doubao.com/chat/?q=%s', name: '豆包 Doubao' },
    'deepseek': { url: 'https://chat.deepseek.com/?q=%s', name: 'DeepSeek' },
    'kimi': { url: 'https://www.kimi.com/?q=%s', name: 'Kimi' },
    'hunyuan': { url: 'https://yuanbao.tencent.com/?q=%s', name: '腾讯元宝' },
    'wenxin': { url: 'https://wenxin.baidu.com/?q=%s', name: '文心一言' },
    'tongyi': { url: 'https://www.qianwen.com/?q=%s', name: '通义千问' },
    'zhipu': { url: 'https://chatglm.cn/?q=%s', name: '智谱清言' },
    'minimax': { url: 'https://hailuoai.com/?q=%s', name: '海螺 MiniMax' },
    'mimo': { url: 'https://aistudio.xiaomimimo.com/?q=%s', name: '小米 MiMo' },
    'xinghuo': { url: 'https://xinghuo.xfyun.cn/desk?q=%s', name: '讯飞星火' },
    'tiangong': { url: 'https://www.tiangong.cn/?q=%s', name: '昆仑天工' },
    'yuewen': { url: 'https://chat.stepfun.com/?q=%s', name: '阶跃跃问' },
    'chatgpt': { url: 'https://chatgpt.com/?q=%s', name: 'ChatGPT' },
    'claude': { url: 'https://claude.ai/new?q=%s', name: 'Claude' },
    'gemini': { url: 'https://gemini.google.com/app?q=%s', name: 'Gemini' },
    'grok': { url: 'https://grok.com/?q=%s', name: 'Grok' },

    // Traditional
    'baidu': { url: 'https://www.baidu.com/s?wd=%s', name: '百度' },
    'google': { url: 'https://www.google.com/search?q=%s', name: 'Google' },
    'bing': { url: 'https://www.bing.com/search?q=%s', name: 'Bing' },
    'sogou': { url: 'https://www.sogou.com/web?query=%s', name: '搜狗' },
    'duckduckgo': { url: 'https://duckduckgo.com/?q=%s', name: 'DuckDuckGo' },

    // Social
    'xiaohongshu': { url: 'https://www.xiaohongshu.com/search_result?keyword=%s', name: '小红书' },
    'douyin': { url: 'https://www.douyin.com/search/%s', name: '抖音' },
    'weibo': { url: 'https://s.weibo.com/weibo?q=%s', name: '微博' },
    'zhihu': { url: 'https://www.zhihu.com/search?q=%s', name: '知乎' },
    'twitter': { url: 'https://twitter.com/search?q=%s', name: 'Twitter/X' },
    'reddit': { url: 'https://www.reddit.com/search/?q=%s', name: 'Reddit' },
    'facebook': { url: 'https://www.facebook.com/search/top/?q=%s', name: 'Facebook' },

    // Video
    'bilibili': { url: 'https://search.bilibili.com/all?keyword=%s', name: '哔哩哔哩' },
    'xigua': { url: 'https://www.ixigua.com/search/%s', name: '西瓜视频' },
    'youtube': { url: 'https://www.youtube.com/results?search_query=%s', name: 'YouTube' },

    // Knowledge
    'baike': { url: 'https://baike.baidu.com/search?word=%s', name: '百度百科' },
    'zhihu_k': { url: 'https://www.zhihu.com/search?q=%s', name: '知乎' },
    'wikipedia': { url: 'https://zh.wikipedia.org/wiki/Special:Search?search=%s', name: '维基百科' },

    // Maps
    'amap': { url: 'https://www.amap.com/search?query=%s', name: '高德地图' },
    'baidumap': { url: 'https://map.baidu.com/search?wd=%s', name: '百度地图' },
    'qqmap': { url: 'https://map.qq.com/?what=%s', name: '腾讯地图' },

    // Developer
    'github': { url: 'https://github.com/search?q=%s', name: 'GitHub' },
    'stackoverflow': { url: 'https://stackoverflow.com/search?q=%s', name: 'Stack Overflow' },

    // Shopping
    'taobao': { url: 'https://s.taobao.com/search?q=%s', name: '淘宝' },
    'jd': { url: 'https://search.jd.com/Search?keyword=%s', name: '京东' },
    'pinduoduo': { url: 'https://mobile.yangkeduo.com/search_result.html?search_key=%s', name: '拼多多' },
    'amazon': { url: 'https://www.amazon.com/s?k=%s', name: 'Amazon' }
  };

  return engineMap[engineId];
}

// Keyboard shortcut handler
chrome.commands.onCommand.addListener((command) => {
  if (command === 'search_selected') {
    // Get selected text from active tab
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (tabs[0]) {
        try {
          const results = await chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: () => window.getSelection().toString()
          });

          if (results && results[0] && results[0].result) {
            const text = results[0].result.trim();
            if (text) {
              await handleContextMenuSearch(text, tabs[0]);
            }
          }
        } catch (error) {
          console.error('Failed to get selection:', error);
        }
      }
    });
  }
});

// Show notification
async function showNotification(title, message) {
  try {
    await chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon128.png',
      title,
      message
    });
  } catch (error) {
    console.error('Failed to show notification:', error);
  }
}

// Clean up old tab groups (older than 24 hours)
async function cleanupOldGroups() {
  const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);

  for (const [groupId, info] of tabGroups.entries()) {
    if (info.timestamp < oneDayAgo) {
      tabGroups.delete(groupId);
    }
  }

  // Schedule next cleanup
  setTimeout(cleanupOldGroups, 60 * 60 * 1000); // Every hour
}

// Handle tab group removal
// 顶层监听必须加守卫：不支持 tabGroups 的内核会让这里抛错，
// 而 MV3 service worker 顶层一抛错，后面 tabs.onRemoved 就再也注册不上了。
if (CAPS.tabGroups) {
  chrome.tabGroups.onRemoved.addListener((groupId) => {
    tabGroups.delete(groupId);
  });
}

// Handle tab removal from groups
chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  // Clean up tab groups that have no tabs left
  for (const [groupId, info] of tabGroups.entries()) {
    const index = info.tabIds.indexOf(tabId);
    if (index > -1) {
      info.tabIds.splice(index, 1);
      if (info.tabIds.length === 0) {
        tabGroups.delete(groupId);
      }
    }
  }
});

console.log('1SO SearchHub background service worker loaded');
