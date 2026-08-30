// Content script for SearchHub
// Handles in-page interactions and follow-up questions

let settings = {};
let isSearchHubTab = false;
let followUpBar = null;

// Initialize
(async function init() {
  await loadSettings();
  checkIfSearchHubTab();

  if (isSearchHubTab && shouldShowFollowUpBar()) {
    createFollowUpBar();
  }

  // Auto-fill initial search query if present
  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get('q') || urlParams.get('query') || urlParams.get('prompt');
  
  if (query && shouldShowFollowUpBar()) {
    // Wait a bit for the page to load fully
    // 注意：URLSearchParams.get() 已解码一次，这里不能再 decodeURIComponent
    setTimeout(() => {
      tryFillQuestion(query);
    }, 1500);
    
    // Retry a few times in case of slow loading
    setTimeout(() => {
      tryFillQuestion(query);
    }, 3000);
  }
})();

// Load settings
async function loadSettings() {
  try {
    const result = await chrome.storage.sync.get(['settings']);
    if (result.settings) {
      settings = result.settings;
    }
  } catch (error) {
    console.error('Failed to load settings:', error);
  }
}

// Check if this tab was opened by SearchHub
function checkIfSearchHubTab() {
  // SearchHub 打开的标签 URL 会带 q/query/prompt 参数（见 index.js 构建 URL 逻辑）
  const urlParams = new URLSearchParams(window.location.search);
  isSearchHubTab = urlParams.has('q') || urlParams.has('query') || urlParams.has('prompt')
    || urlParams.has('searchhub') || sessionStorage.getItem('searchhub');
  if (isSearchHubTab) {
    try { sessionStorage.setItem('searchhub', '1'); } catch (_) {}
  }
}

// Check if we should show the follow-up bar
function shouldShowFollowUpBar() {
  // Only show on AI chat sites
  const aiDomains = [
    'chatgpt.com',
    'claude.ai',
    'gemini.google.com',
    'chatglm.cn',
    'www.doubao.com',
    'wenxin.baidu.com',
    'www.qianwen.com',
    'www.kimi.com',
    'www.perplexity.ai',
    'you.com',
    'exa.ai',
    'metaso.cn',
    'chat.deepseek.com',
    'yuanbao.tencent.com',
    'grok.com',
    'hailuoai.com',
    'aistudio.xiaomimimo.com',
    'xinghuo.xfyun.cn',
    'www.tiangong.cn',
    'chat.stepfun.com',
    'www.genspark.ai',
    'felo.ai',
    's.monica.im'
  ];

  return aiDomains.some(domain => window.location.hostname.includes(domain));
}

// Create follow-up question bar
function createFollowUpBar() {
  if (followUpBar) return;

  followUpBar = document.createElement('div');
  followUpBar.id = 'searchhub-followup-bar';
  followUpBar.innerHTML = `
    <div class="searchhub-followup-content">
      <svg class="searchhub-followup-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
      <input
        type="text"
        class="searchhub-followup-input"
        placeholder="Ask follow-up question across all engines..."
        id="searchhub-followup-input"
      >
      <button class="searchhub-followup-btn" id="searchhub-followup-send">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
      </button>
      <button class="searchhub-followup-close" id="searchhub-followup-close">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  `;

  document.body.appendChild(followUpBar);

  // Attach event listeners
  const input = document.getElementById('searchhub-followup-input');
  const sendBtn = document.getElementById('searchhub-followup-send');
  const closeBtn = document.getElementById('searchhub-followup-close');

  input.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' || e.isComposing || e.keyCode === 229) return;
    e.preventDefault();
    sendFollowUp();
  });

  sendBtn.addEventListener('click', sendFollowUp);
  closeBtn.addEventListener('click', () => {
    followUpBar.remove();
    followUpBar = null;
  });
}

// Send follow-up question
async function sendFollowUp() {
  const input = document.getElementById('searchhub-followup-input');
  const question = input.value.trim();

  if (!question) return;

  try {
    // Broadcast to all SearchHub tabs
    chrome.runtime.sendMessage({
      action: 'followUp',
      question: question
    });

    // Try to fill in the question on this page
    tryFillQuestion(question);

    // Clear input
    input.value = '';
  } catch (error) {
    console.error('Failed to send follow-up:', error);
  }
}

// Try to fill the question in common AI chat interfaces
function tryFillQuestion(question) {
  // 站点专属选择器优先（更准，避免填错框），通用列表兜底
  const siteSelectors = {
    'yuanbao.tencent.com': [
      '[contenteditable="true"][role="textbox"]',
      'div[contenteditable="true"]'
    ],
    'wenxin.baidu.com': [
      '[contenteditable="true"][role="textbox"]',
      'div[contenteditable="true"]'
    ],
    'www.kimi.com': [
      'textarea[placeholder]',
      'div[contenteditable="true"]'
    ],
    'chat.deepseek.com': [
      'textarea',
      'div[contenteditable="true"]'
    ]
  };
  const siteHits = siteSelectors[window.location.hostname] || [];
  for (const selector of siteHits) {
    const element = document.querySelector(selector);
    if (element && fillElement(element, question)) return true;
  }

  // Common selectors for AI chat input boxes
  const selectors = [
    '#prompt-textarea', // ChatGPT
    'div[role="textbox"]', // Gemini and others
    'textarea[placeholder*="message"]',
    'textarea[placeholder*="Message"]',
    'textarea[placeholder*="question"]',
    'textarea[placeholder*="Ask"]',
    'textarea[placeholder*="输入"]',
    'textarea[placeholder*="问题"]',
    'input[type="text"][placeholder*="message"]',
    'div[contenteditable="true"]',
    'textarea' // Fallback
  ];

  for (const selector of selectors) {
    const element = document.querySelector(selector);
    if (element && fillElement(element, question)) return true;
  }

  return false;
}

// 填充单个元素并派发输入事件；返回是否成功
function fillElement(element, question) {
  if (element.tagName === 'DIV' || element.isContentEditable) {
    element.textContent = question;
    // React/框架监听的原生 InputEvent（含 data），兼容性比 Event 好
    element.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: question }));
  } else {
    element.value = question;
    element.dispatchEvent(new Event('input', { bubbles: true }));
  }
  element.focus();
  return true;
}

// Listen for messages from background
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'followUp') {
    tryFillQuestion(message.question);
  }
});

// Double-click to search (optional feature)
document.addEventListener('dblclick', async () => {
  const selection = window.getSelection().toString().trim();
  if (selection && settings.doubleClickSearch) {
    chrome.runtime.sendMessage({
      action: 'quickSearch',
      text: selection
    });
  }
});
