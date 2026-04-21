// Background service worker for SearchHub

const TAB_COLORS = ['blue', 'red', 'yellow', 'green', 'pink', 'purple', 'cyan', 'orange'];
let colorIndex = 0;
let tabGroups = new Map(); // Track tab groups by search query

// Initialize on install
chrome.runtime.onInstalled.addListener(async () => {
  console.log('SearchHub installed');

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
async function openInTabs(urls, query, settings) {
  try {
    // Get current window ID first
    const [currentTab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    const windowId = currentTab ? currentTab.windowId : null;

    // Create all tabs
    const createdTabs = [];
    for (const item of urls) {
      const tab = await chrome.tabs.create({ url: item.url, active: false });
      createdTabs.push(tab);
    }

    // Group tabs if enabled
    if (settings.groupTabs && createdTabs.length > 0) {
      const tabIds = createdTabs.map(tab => tab.id);
      const groupId = await chrome.tabs.group({ tabIds });

      // Update group properties
      await chrome.tabGroups.update(groupId, {
        title: query.length > 20 ? query.substring(0, 20) + '...' : query,
        color: TAB_COLORS[colorIndex % TAB_COLORS.length],
        collapsed: settings.collapsedGroups
      });

      colorIndex++;

      // Store group info
      tabGroups.set(groupId, {
        query,
        tabIds,
        timestamp: Date.now()
      });
    }

    // Focus first tab
    if (createdTabs.length > 0) {
      await chrome.tabs.update(createdTabs[0].id, { active: true });
    }

    // Always show sidebar after search (for vertical tabs management)
    // Delay slightly to ensure tabs are created
    if (windowId) {
      setTimeout(async () => {
        try {
          await chrome.sidePanel.open({ windowId: windowId });
          console.log('Sidebar opened successfully for window:', windowId);
        } catch (error) {
          console.error('Failed to open sidebar:', error);
          // Try alternative method
          try {
            await chrome.sidePanel.setOptions({
              path: 'sidebar.html',
              enabled: true
            });
            await chrome.sidePanel.open({ windowId: windowId });
            console.log('Sidebar opened with alternative method');
          } catch (err) {
            console.error('Alternative method also failed:', err);
          }
        }
      }, 100);
    }
  } catch (error) {
    console.error('Failed to open tabs:', error);
  }
}

// Open search results in windows
async function openInWindows(urls, query, settings) {
  try {
    // Get display info
    const displays = await chrome.system.display.getInfo();
    if (displays.length === 0) {
      console.error('No display found');
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
      title: 'Search with SearchHub',
      contexts: ['selection']
    });

    chrome.contextMenus.create({
      id: 'searchHub-separator',
      type: 'separator',
      contexts: ['selection']
    });

    chrome.contextMenus.create({
      id: 'searchHub-settings',
      title: 'SearchHub Settings',
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
      await showNotification('Please select search engines first', 'Open SearchHub to select engines');
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
  const engineMap = {
    // Traditional
    'google': { url: 'https://www.google.com/search?q=%s', name: 'Google' },
    'bing': { url: 'https://www.bing.com/search?q=%s', name: 'Bing' },
    'baidu': { url: 'https://www.baidu.com/s?wd=%s', name: 'Baidu' },
    'sogou': { url: 'https://www.sogou.com/web?query=%s', name: 'Sogou' },
    'duckduckgo': { url: 'https://duckduckgo.com/?q=%s', name: 'DuckDuckGo' },
    'yandex': { url: 'https://yandex.com/search/?text=%s', name: 'Yandex' },
    'yahoo': { url: 'https://search.yahoo.com/search?p=%s', name: 'Yahoo' },

    // AI Search
    'perplexity': { url: 'https://www.perplexity.ai/search?q=%s', name: 'Perplexity' },
    'phind': { url: 'https://www.phind.com/search?q=%s', name: 'Phind' },
    'you': { url: 'https://you.com/search?q=%s', name: 'You.com' },
    'thinkanai': { url: 'https://thinkany.ai/search?q=%s', name: 'ThinkAny' },
    'metaso': { url: 'https://metaso.cn/?q=%s', name: 'Metaso' },
    'pi': { url: 'https://pi.ai/talk?q=%s', name: 'Pi' },
    'devv': { url: 'https://devv.ai/search?q=%s', name: 'Devv' },
    'consensus': { url: 'https://consensus.app/search?q=%s', name: 'Consensus' },
    'semantic': { url: 'https://www.semanticscholar.org/search?q=%s', name: 'Semantic Scholar' },
    'genspark': { url: 'https://www.genspark.ai/search?q=%s', name: 'Genspark' },
    'monica': { url: 'https://monica.im/search?q=%s', name: 'Monica' },
    'exa': { url: 'https://exa.ai/search?q=%s', name: 'Exa' },

    // AI Chat
    'chatgpt': { url: 'https://chatgpt.com/?q=%s', name: 'ChatGPT' },
    'claude': { url: 'https://claude.ai/new?q=%s', name: 'Claude' },
    'gemini': { url: 'https://gemini.google.com/app?q=%s', name: 'Gemini' },
    'zhipu': { url: 'https://chatglm.cn/?q=%s', name: 'ChatGLM' },
    'doubao': { url: 'https://www.doubao.com/chat/?q=%s', name: 'Doubao' },
    'wenxin': { url: 'https://yiyan.baidu.com/?q=%s', name: 'Wenxin' },
    'tongyi': { url: 'https://tongyi.aliyun.com/qianwen/?q=%s', name: 'Tongyi' },
    'kimi': { url: 'https://kimi.moonshot.cn/?q=%s', name: 'Kimi' },
    'grok': { url: 'https://grok.com/?q=%s', name: 'Grok' },
    'felo': { url: 'https://felo.ai/search?q=%s', name: 'Felo' },
    'deepseek': { url: 'https://chat.deepseek.com/?q=%s', name: 'DeepSeek' },
    'hunyuan': { url: 'https://yuanbao.tencent.com/chat?q=%s', name: 'Yuanbao' },
    'manus': { url: 'https://manus.im/app?q=%s', name: 'Manus' },

    // Social
    'xiaohongshu': { url: 'https://www.xiaohongshu.com/search_result?keyword=%s', name: 'Xiaohongshu' },
    'douyin': { url: 'https://www.douyin.com/search/%s', name: 'Douyin' },
    'weibo': { url: 'https://s.weibo.com/weibo?q=%s', name: 'Weibo' },
    'twitter': { url: 'https://twitter.com/search?q=%s', name: 'Twitter/X' },
    'reddit': { url: 'https://www.reddit.com/search/?q=%s', name: 'Reddit' },
    'facebook': { url: 'https://www.facebook.com/search/top/?q=%s', name: 'Facebook' },
    'medium': { url: 'https://medium.com/search?q=%s', name: 'Medium' },
    'substack': { url: 'https://substack.com/search?q=%s', name: 'Substack' },
    'pinterest': { url: 'https://www.pinterest.com/search/pins/?q=%s', name: 'Pinterest' },
    'quora': { url: 'https://www.quora.com/search?q=%s', name: 'Quora' },
    'threads': { url: 'https://www.threads.net/search?q=%s', name: 'Threads' },
    'producthunt': { url: 'https://www.producthunt.com/search?q=%s', name: 'Product Hunt' },

    // Video
    'youtube': { url: 'https://www.youtube.com/results?search_query=%s', name: 'YouTube' },
    'bilibili': { url: 'https://search.bilibili.com/all?keyword=%s', name: 'Bilibili' },
    'xigua': { url: 'https://www.ixigua.com/search/%s', name: 'Xigua' },

    // Developer
    'github': { url: 'https://github.com/search?q=%s', name: 'GitHub' },
    'stackoverflow': { url: 'https://stackoverflow.com/search?q=%s', name: 'Stack Overflow' },
    'mdn': { url: 'https://developer.mozilla.org/en-US/search?q=%s', name: 'MDN' },
    'npm': { url: 'https://www.npmjs.com/search?q=%s', name: 'NPM' },

    // Shopping
    'amazon': { url: 'https://www.amazon.com/s?k=%s', name: 'Amazon' },
    'taobao': { url: 'https://s.taobao.com/search?q=%s', name: 'Taobao' },
    'jd': { url: 'https://search.jd.com/Search?keyword=%s', name: 'JD' },
    'pinduoduo': { url: 'https://mobile.yangkeduo.com/search_result.html?search_key=%s', name: 'Pinduoduo' },

    // Knowledge
    'wikipedia': { url: 'https://en.wikipedia.org/wiki/Special:Search?search=%s', name: 'Wikipedia' },
    'zhihu': { url: 'https://www.zhihu.com/search?q=%s', name: 'Zhihu' },
    'baike': { url: 'https://baike.baidu.com/search?word=%s', name: 'Baidu Baike' }
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
chrome.tabGroups.onRemoved.addListener((groupId) => {
  tabGroups.delete(groupId);
});

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

console.log('SearchHub background service worker loaded');
