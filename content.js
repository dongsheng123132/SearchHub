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
    setTimeout(() => {
      tryFillQuestion(decodeURIComponent(query));
    }, 1500);
    
    // Retry a few times in case of slow loading
    setTimeout(() => {
      tryFillQuestion(decodeURIComponent(query));
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
  // Check if the tab was created by SearchHub
  // You can use sessionStorage or URL parameters to identify
  const urlParams = new URLSearchParams(window.location.search);
  isSearchHubTab = urlParams.has('searchhub') || sessionStorage.getItem('searchhub');
}

// Check if we should show the follow-up bar
function shouldShowFollowUpBar() {
  // Only show on AI chat sites
  const aiDomains = [
    'chat.openai.com',
    'chatgpt.com',
    'claude.ai',
    'gemini.google.com',
    'chatglm.cn',
    'doubao.com',
    'yiyan.baidu.com',
    'tongyi.aliyun.com',
    'kimi.moonshot.cn',
    'perplexity.ai',
    'phind.com',
    'you.com',
    'thinkany.ai',
    'metaso.cn',
    'chat.deepseek.com',
    'pi.ai',
    'manus.im',
    'felo.ai'
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

  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendFollowUp();
    }
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
    if (element) {
      if (element.tagName === 'DIV') {
        element.textContent = question;
      } else {
        element.value = question;
      }

      // Trigger input event
      element.dispatchEvent(new Event('input', { bubbles: true }));
      element.focus();
      return true;
    }
  }

  return false;
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
