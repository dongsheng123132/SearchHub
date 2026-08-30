// Simplified popup version for 1SO SearchHub
// This version runs in the popup context, which preserves user gesture for sidePanel.open()

let selectedEngines = new Set();

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  // Initialize i18n if available
  if (typeof updateUILanguage === 'function') {
    updateUILanguage();
  }
  
  renderQuickCombos();
  await renderCustomCombos();
  renderCategories();
  attachEventListeners();
  await restoreSelectedEngines();
});

// 渲染用户自定义组合（与 index 页一致）
async function renderCustomCombos() {
  try {
    const result = await chrome.storage.sync.get(['settings']);
    const customCombos = result.settings?.customCombos || [];
    if (!customCombos.length) return;
    const container = document.getElementById('quickCombos');
    customCombos.forEach(combo => {
      const btn = document.createElement('button');
      btn.className = 'combo-button combo-button-custom';
      btn.textContent = combo.name;
      btn.title = combo.name;
      btn.onclick = () => {
        selectedEngines = new Set(combo.engines);
        updateAllUI();
        saveSelectedEngines();
      };
      container.appendChild(btn);
    });
  } catch (error) {
    console.error('Failed to render custom combos:', error);
  }
}

// Attach event listeners
function attachEventListeners() {
  document.getElementById('searchButton').addEventListener('click', handleSearch);
  document.getElementById('searchInput').addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' || e.isComposing || e.keyCode === 229) return;
    e.preventDefault();
    handleSearch();
  });

  document.getElementById('selectAll').addEventListener('click', selectAllEngines);
  document.getElementById('clearAll').addEventListener('click', clearAllEngines);

  document.getElementById('openFullPage').addEventListener('click', () => {
    chrome.tabs.create({ url: 'index.html' });
  });

  document.getElementById('openSettings').addEventListener('click', () => {
    chrome.tabs.create({ url: 'settings.html' });
  });
}

// Render quick combos
function renderQuickCombos() {
  const container = document.getElementById('quickCombos');
  container.innerHTML = '';

  DEFAULT_COMBOS.forEach(combo => {
    const btn = document.createElement('button');
    btn.className = 'combo-button';
    btn.textContent = combo.name; // emoji 已含在 name 里，无独立 icon 字段
    btn.onclick = () => {
      selectedEngines = new Set(combo.engines);
      updateAllUI();
      saveSelectedEngines();
    };
    container.appendChild(btn);
  });
}

// Render categories
function renderCategories() {
  const container = document.getElementById('engineCategories');
  container.innerHTML = '';

  Object.entries(DEFAULT_ENGINES).forEach(([categoryId, category]) => {
    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'category';
    categoryDiv.innerHTML = `
      <h3>${category.icon} ${category.name}</h3>
      <div class="engines-grid" id="cat-${categoryId}"></div>
    `;

    const grid = categoryDiv.querySelector('.engines-grid');
    category.engines.forEach(engine => {
      const card = document.createElement('div');
      card.className = 'engine-card';
      card.dataset.engineId = engine.id;
      card.innerHTML = `
        <div class="engine-header">
          <img class="engine-favicon" src="${engine.favicon}" onerror="this.style.display='none'">
          <span class="engine-name">${engine.name}</span>
        </div>
      `;
      card.onclick = () => toggleEngine(engine.id);
      grid.appendChild(card);
    });

    container.appendChild(categoryDiv);
  });

  updateAllUI();
}

// Toggle engine selection
function toggleEngine(engineId) {
  if (selectedEngines.has(engineId)) {
    selectedEngines.delete(engineId);
  } else {
    selectedEngines.add(engineId);
  }
  updateAllUI();
  saveSelectedEngines();
}

// Update UI
function updateAllUI() {
  // Update all engine cards
  document.querySelectorAll('.engine-card').forEach(card => {
    const engineId = card.dataset.engineId;
    if (selectedEngines.has(engineId)) {
      card.classList.add('selected');
    } else {
      card.classList.remove('selected');
    }
  });

  // Update search button
  document.getElementById('searchButton').disabled = selectedEngines.size === 0;
}

// Select/Clear all
function selectAllEngines() {
  selectedEngines.clear();
  Object.values(DEFAULT_ENGINES).forEach(category => {
    category.engines.forEach(engine => {
      selectedEngines.add(engine.id);
    });
  });
  updateAllUI();
  saveSelectedEngines();
}

function clearAllEngines() {
  selectedEngines.clear();
  updateAllUI();
  saveSelectedEngines();
}

// Save/Restore selected engines
async function saveSelectedEngines() {
  await chrome.storage.local.set({
    selectedEngines: Array.from(selectedEngines)
  });
}

async function restoreSelectedEngines() {
  const result = await chrome.storage.local.get(['selectedEngines']);
  if (result.selectedEngines) {
    selectedEngines = new Set(result.selectedEngines);
    updateAllUI();
  }
}

// Handle search - CRITICAL: This runs in popup context, preserving user gesture!
async function handleSearch() {
  const query = document.getElementById('searchInput').value.trim();

  // Get i18n function
  const getMessage = (key, fallback) => {
    if (typeof t === 'function') {
      return t(key) || fallback;
    }
    if (typeof chrome !== 'undefined' && chrome.i18n) {
      return chrome.i18n.getMessage(key) || fallback;
    }
    // Fallback based on language
    const lang = typeof getCurrentLanguage === 'function' ? getCurrentLanguage() : 'en';
    if (lang === 'zh') {
      const zhTranslations = {
        'noEnginesSelected': '请先选择至少一个搜索引擎',
        'pleaseEnterQuery': '请输入搜索关键词'
      };
      return zhTranslations[key] || fallback;
    }
    return fallback;
  };

  if (!query) {
    alert(getMessage('pleaseEnterQuery', 'Please enter a search query'));
    return;
  }

  if (selectedEngines.size === 0) {
    alert(getMessage('noEnginesSelected', 'Please select at least one search engine'));
    return;
  }

  console.log('🎯 Search initiated from popup (user gesture context preserved)');

  // Get settings
  const settingsResult = await chrome.storage.sync.get(['settings']);
  const settings = { ...DEFAULT_SETTINGS, ...(settingsResult.settings || {}) };

  // Build URLs（含自定义引擎）
  const urls = [];
  const customEngines = settings.customEngines || [];
  selectedEngines.forEach(engineId => {
    const engine = findEngineById(engineId, customEngines);
    if (engine) {
      urls.push({
        url: engine.url.replace('%s', encodeURIComponent(query)),
        name: engine.name
      });
    }
  });

  // Send message to background to create tabs
  chrome.runtime.sendMessage({
    action: 'search',
    query,
    urls,
    settings
  });

  // CRITICAL: Open sidebar HERE in popup context (user gesture preserved!)
  try {
    const [currentTab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (currentTab && currentTab.windowId) {
      console.log('🚀 Attempting to open sidebar from popup...');

      // Enable sidebar
      await chrome.sidePanel.setOptions({ enabled: true });

      // Open sidebar - THIS SHOULD WORK because we're in user gesture context!
      await chrome.sidePanel.open({ windowId: currentTab.windowId });

      console.log('✅ ✅ ✅ Sidebar opened successfully from popup!');
    }
  } catch (error) {
    console.error('❌ Failed to open sidebar from popup:', error);
  }

  // Close popup after search
  window.close();
}

// Find engine by ID（默认引擎 + 自定义引擎）
function findEngineById(engineId, customEngines) {
  for (const category of Object.values(DEFAULT_ENGINES)) {
    const engine = category.engines.find(e => e.id === engineId);
    if (engine) return engine;
  }
  if (Array.isArray(customEngines)) {
    const custom = customEngines.find(e => e.id === engineId);
    if (custom) return custom;
  }
  return null;
}
