// State management
let state = {
  settings: DEFAULT_SETTINGS,
  selectedEngines: new Set(),
  searchQuery: '',
  currentCombo: null,
  editMode: false // 编辑模式
};

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  await loadSettings();
  initializeTheme();
  updateUILanguage(); // 更新UI语言
  renderCategories();
  renderQuickCombos();
  attachEventListeners();
  restoreSelectedEngines();
  updateSelectedCount();
});

// Load settings from storage
async function loadSettings() {
  try {
    const result = await chrome.storage.sync.get(['settings']);
    if (result.settings) {
      state.settings = { 
        ...DEFAULT_SETTINGS, 
        ...result.settings,
        // 确保 customCombos 存在
        customCombos: result.settings.customCombos || [],
        // 确保 compactMode 存在
        compactMode: result.settings.compactMode !== undefined ? result.settings.compactMode : false,
        // 确保 collapsedCategories 存在
        collapsedCategories: result.settings.collapsedCategories || []
      };
    }
  } catch (error) {
    console.error('Failed to load settings:', error);
  }
}

// Save settings to storage
async function saveSettings() {
  try {
    await chrome.storage.sync.set({ settings: state.settings });
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
}

// Theme management
function initializeTheme() {
  const theme = state.settings.theme;
  if (theme === 'auto') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
  } else {
    document.documentElement.setAttribute('data-theme', theme);
  }
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  state.settings.theme = newTheme;
  saveSettings();
}

// Render categories and engines
function renderCategories() {
  const container = document.getElementById('categoriesContainer');
  container.innerHTML = '';

  Object.entries(DEFAULT_ENGINES).forEach(([categoryId, category]) => {
    const categoryEl = createCategoryElement(categoryId, category);
    container.appendChild(categoryEl);
  });
}

function createCategoryElement(categoryId, category) {
  const categoryEl = document.createElement('div');
  categoryEl.className = 'category';
  categoryEl.dataset.categoryId = categoryId;
  
  // 检查是否折叠
  const isCollapsed = state.settings.collapsedCategories?.includes(categoryId);
  const collapsedClass = isCollapsed ? 'collapsed' : '';
  
  // 计算引擎总数（包括自定义引擎）
  let engineCount = category.engines.length;
  if (state.settings.customEngines) {
    engineCount += state.settings.customEngines.filter(e => e.category === categoryId).length;
  }

  // 获取该类目下的所有引擎ID
  const categoryEngineIds = [];
  category.engines.forEach(engine => {
    categoryEngineIds.push(engine.id);
  });
  if (state.settings.customEngines) {
    state.settings.customEngines.forEach(engine => {
      if (engine.category === categoryId) {
        categoryEngineIds.push(engine.id);
      }
    });
  }
  
  // 检查是否全部选中
  const allSelected = categoryEngineIds.length > 0 && categoryEngineIds.every(id => state.selectedEngines.has(id));
  const someSelected = categoryEngineIds.some(id => state.selectedEngines.has(id));
  
  categoryEl.innerHTML = `
    <div class="category-header">
      <input type="checkbox" class="category-select-all" ${allSelected ? 'checked' : ''} 
             ${someSelected && !allSelected ? 'indeterminate' : ''}
             title="${t('selectAll') || 'Select all engines in this category'}">
      <button class="category-toggle" title="${isCollapsed ? 'Expand' : 'Collapse'}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
      <span class="category-icon">${category.icon}</span>
      <h2 class="category-title">${getCategoryTitle(categoryId, category)}</h2>
      <span class="category-count">${engineCount} ${t('engines')}</span>
    </div>
    <div class="engines-grid ${collapsedClass}" id="category-${categoryId}">
    </div>
  `;
  
  // 添加折叠/展开功能
  const header = categoryEl.querySelector('.category-header');
  const toggleBtn = categoryEl.querySelector('.category-toggle');
  const selectAllCheckbox = categoryEl.querySelector('.category-select-all');
  const grid = categoryEl.querySelector(`#category-${categoryId}`);
  
  // 全选/取消全选功能
  selectAllCheckbox.addEventListener('click', (e) => {
    e.stopPropagation(); // 阻止触发折叠/展开
    
    const isChecked = selectAllCheckbox.checked;
    
    if (isChecked) {
      // 全选该类目下的所有引擎
      categoryEngineIds.forEach(engineId => {
        if (!state.selectedEngines.has(engineId)) {
          state.selectedEngines.add(engineId);
        }
      });
    } else {
      // 取消全选
      categoryEngineIds.forEach(engineId => {
        state.selectedEngines.delete(engineId);
      });
    }
    
    // 更新UI
    categoryEngineIds.forEach(engineId => {
      updateEngineUI(engineId);
    });
    updateSelectedCount();
    saveSelectedEngines();
    state.currentCombo = null;
    updateCombosUI();
    
    // 更新全选框状态
    updateCategorySelectAll(categoryId, categoryEngineIds);
  });
  
  const toggleCategory = (e) => {
    // 如果点击的是全选框或折叠按钮，不触发折叠
    if (e.target === selectAllCheckbox || e.target.closest('.category-toggle') || e.target.closest('.category-select-all')) {
      return;
    }
    
    const isCollapsed = grid.classList.contains('collapsed');
    if (isCollapsed) {
      grid.classList.remove('collapsed');
      toggleBtn.style.transform = 'rotate(0deg)';
      // 从折叠列表中移除
      if (state.settings.collapsedCategories) {
        const index = state.settings.collapsedCategories.indexOf(categoryId);
        if (index > -1) {
          state.settings.collapsedCategories.splice(index, 1);
        }
      }
    } else {
      grid.classList.add('collapsed');
      toggleBtn.style.transform = 'rotate(-90deg)';
      // 添加到折叠列表
      if (!state.settings.collapsedCategories) {
        state.settings.collapsedCategories = [];
      }
      if (!state.settings.collapsedCategories.includes(categoryId)) {
        state.settings.collapsedCategories.push(categoryId);
      }
    }
    saveSettings();
  };
  
  header.addEventListener('click', toggleCategory);
  
  // 初始化折叠状态
  if (isCollapsed) {
    toggleBtn.style.transform = 'rotate(-90deg)';
  }
  
  // 渲染默认引擎
  category.engines.forEach(engine => {
    const engineCard = createEngineCard(engine, categoryId);
    grid.appendChild(engineCard);
  });
  
  // 渲染自定义引擎（如果属于这个分类）
  if (state.settings.customEngines) {
    state.settings.customEngines.forEach(engine => {
      if (engine.category === categoryId) {
        const engineCard = createEngineCard(engine, categoryId);
        grid.appendChild(engineCard);
      }
    });
  }
  
  // 初始化全选框状态（在渲染完所有引擎后）
  updateCategorySelectAll(categoryId, categoryEngineIds);
  
  // 编辑模式下，添加"添加引擎"按钮
  if (state.editMode) {
    const addBtn = document.createElement('button');
    addBtn.className = 'engine-card engine-card-add';
    addBtn.innerHTML = `
      <div class="engine-header">
        <span style="font-size: 20px;">+</span>
        <span class="engine-name">${t('addEngine')}</span>
      </div>
    `;
    addBtn.addEventListener('click', () => addEngine(categoryId));
    grid.appendChild(addBtn);
  }

  return categoryEl;
}

function getCategoryTitle(categoryId, category) {
  const map = {
    aiSearch: 'categoryAISearch',
    aiChat: 'categoryAIChat',
    traditional: 'categoryTraditional',
    social: 'categorySocial',
    video: 'categoryVideo',
    developer: 'categoryDeveloper',
    shopping: 'categoryShopping',
    knowledge: 'categoryKnowledge'
  };
  const key = map[categoryId];
  return key ? t(key) : category.name;
}

function createEngineCard(engine, categoryId) {
  const card = document.createElement('div');
  card.className = 'engine-card';
  card.dataset.engineId = engine.id;
  card.dataset.categoryId = categoryId;

  // 获取域名用于备用 favicon
  let fallbackFavicon = '';
  try {
    const urlObj = new URL(engine.url.replace('%s', ''));
    fallbackFavicon = `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=32`;
  } catch (e) {
    fallbackFavicon = 'icons/icon16.png';
  }

  const isCustom = engine.id.startsWith('custom-');
  const compactMode = (state.settings && state.settings.compactMode) || false;
  const editControls = state.editMode ? `
    <div class="engine-actions">
      <button class="engine-edit-btn" title="${t('editEngine')}" data-action="edit">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
        </svg>
      </button>
      ${isCustom ? `
      <button class="engine-delete-btn" title="${t('deleteEngine')}" data-action="delete">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
      </button>
      ` : ''}
    </div>
  ` : '';

  // 紧凑模式：只显示logo和名字
  if (compactMode) {
    card.innerHTML = `
      <div class="engine-header engine-header-compact">
        <img class="engine-favicon" src="${engine.favicon}" alt="${engine.name}" onerror="this.src='${fallbackFavicon}'">
        <span class="engine-name">${engine.name}</span>
      </div>
      ${editControls}
    `;
    card.classList.add('engine-card-compact');
  } else {
    card.innerHTML = `
      <div class="engine-header">
        <img class="engine-favicon" src="${engine.favicon}" alt="${engine.name}" onerror="this.src='${fallbackFavicon}'">
        <span class="engine-name">${engine.name}</span>
      </div>
      <div class="engine-desc">${engine.description}</div>
      ${editControls}
    `;
  }

  if (state.editMode) {
    // 编辑模式下，点击编辑/删除按钮
    const editBtn = card.querySelector('.engine-edit-btn');
    const deleteBtn = card.querySelector('.engine-delete-btn');
    
    if (editBtn) {
      editBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        editEngine(engine, categoryId);
      });
    }
    
    if (deleteBtn) {
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteEngine(engine.id, categoryId);
      });
    }
  } else {
    // 正常模式下，点击卡片选择引擎
    card.addEventListener('click', () => toggleEngine(engine.id));
  }

  return card;
}

// Engine selection
function toggleEngine(engineId) {
  if (state.selectedEngines.has(engineId)) {
    state.selectedEngines.delete(engineId);
  } else {
    state.selectedEngines.add(engineId);
  }

  updateEngineUI(engineId);
  updateSelectedCount();
  saveSelectedEngines();
  state.currentCombo = null; // Clear active combo
  updateCombosUI();
  
  // 更新相关分类的全选框状态
  updateCategorySelectAllForEngine(engineId);
}

function updateEngineUI(engineId) {
  const card = document.querySelector(`[data-engine-id="${engineId}"]`);
  if (card) {
    if (state.selectedEngines.has(engineId)) {
      card.classList.add('selected');
    } else {
      card.classList.remove('selected');
    }
  }
}

// Update category select-all checkbox state
function updateCategorySelectAll(categoryId, categoryEngineIds) {
  const categoryEl = document.querySelector(`[data-category-id="${categoryId}"]`);
  if (!categoryEl) return;
  
  const selectAllCheckbox = categoryEl.querySelector('.category-select-all');
  if (!selectAllCheckbox) return;
  
  const allSelected = categoryEngineIds.length > 0 && categoryEngineIds.every(id => state.selectedEngines.has(id));
  const someSelected = categoryEngineIds.some(id => state.selectedEngines.has(id));
  
  selectAllCheckbox.checked = allSelected;
  selectAllCheckbox.indeterminate = someSelected && !allSelected;
}

// Update category select-all checkbox for a specific engine
function updateCategorySelectAllForEngine(engineId) {
  // Find which category this engine belongs to
  let categoryId = null;
  
  // Check default engines
  Object.entries(DEFAULT_ENGINES).forEach(([catId, category]) => {
    if (category.engines.some(e => e.id === engineId)) {
      categoryId = catId;
    }
  });
  
  // Check custom engines
  if (!categoryId && state.settings.customEngines) {
    const customEngine = state.settings.customEngines.find(e => e.id === engineId);
    if (customEngine) {
      categoryId = customEngine.category;
    }
  }
  
  if (categoryId) {
    // Get all engine IDs in this category
    const categoryEngineIds = [];
    const category = DEFAULT_ENGINES[categoryId];
    if (category) {
      category.engines.forEach(engine => {
        categoryEngineIds.push(engine.id);
      });
    }
    if (state.settings.customEngines) {
      state.settings.customEngines.forEach(engine => {
        if (engine.category === categoryId) {
          categoryEngineIds.push(engine.id);
        }
      });
    }
    
    updateCategorySelectAll(categoryId, categoryEngineIds);
  }
}

function updateSelectedCount() {
  const count = state.selectedEngines.size;
  const countEl = document.getElementById('selectedCount');
  countEl.textContent = `${count} ${t('enginesSelected')}`;

  // Enable/disable search button
  const searchBtn = document.getElementById('searchBtn');
  searchBtn.disabled = count === 0;
}

// Save and restore selected engines
async function saveSelectedEngines() {
  try {
    await chrome.storage.local.set({
      selectedEngines: Array.from(state.selectedEngines)
    });
  } catch (error) {
    console.error('Failed to save selected engines:', error);
  }
}

async function restoreSelectedEngines() {
  try {
    // First try to restore from default settings
    if (state.settings.defaultEngines && state.settings.defaultEngines.length > 0) {
      state.selectedEngines = new Set(state.settings.defaultEngines);
    }

    // Then try to restore from last session
    const result = await chrome.storage.local.get(['selectedEngines']);
    if (result.selectedEngines && result.selectedEngines.length > 0) {
      state.selectedEngines = new Set(result.selectedEngines);
    }

    // Update UI
    state.selectedEngines.forEach(engineId => updateEngineUI(engineId));
    updateSelectedCount();
  } catch (error) {
    console.error('Failed to restore selected engines:', error);
  }
}

// Quick combos
function renderQuickCombos() {
  const container = document.getElementById('quickCombos');
  container.innerHTML = '';

  // 先渲染默认组合
  state.settings.combos.forEach((combo, index) => {
    const comboBtn = document.createElement('button');
    comboBtn.className = 'combo-btn';
    comboBtn.dataset.comboId = combo.id;
    comboBtn.textContent = combo.name;

    // 添加编辑按钮（在编辑模式下显示）
    if (state.editMode) {
      const editBtn = document.createElement('span');
      editBtn.className = 'combo-edit';
      editBtn.innerHTML = '✎';
      editBtn.title = t('editCombo');
      editBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        editCombo(index, combo);
      });
      comboBtn.appendChild(editBtn);
    } else {
      comboBtn.addEventListener('click', () => activateCombo(combo));
    }
    
    container.appendChild(comboBtn);
  });

  // 然后渲染用户自定义组合（最多2个）
  const customCombos = state.settings.customCombos || [];
  customCombos.forEach((combo, index) => {
    const comboBtn = document.createElement('button');
    comboBtn.className = 'combo-btn combo-btn-custom';
    comboBtn.dataset.comboId = combo.id;
    comboBtn.textContent = combo.name;
    comboBtn.title = combo.name;

    comboBtn.addEventListener('click', () => activateCombo(combo));
    
    // 添加删除按钮
    const deleteBtn = document.createElement('span');
    deleteBtn.className = 'combo-delete';
    deleteBtn.innerHTML = '×';
    deleteBtn.title = t('deleteCombo');
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteCustomCombo(index);
    });
    
    comboBtn.appendChild(deleteBtn);
    container.appendChild(comboBtn);
  });

  // Add "Save as Combo" button (if there's space and engines selected)
  if (customCombos.length < 5 && state.selectedEngines.size > 0) {
    const saveBtn = document.createElement('button');
    saveBtn.className = 'combo-btn combo-btn-save';
    saveBtn.innerHTML = `<span>💾</span> ${t('saveAsCombo')}`;
    saveBtn.title = t('saveAsCombo');
    saveBtn.addEventListener('click', saveAsCustomCombo);
    container.appendChild(saveBtn);
  }
}

function activateCombo(combo) {
  if (state.currentCombo === combo.id) {
    // Deactivate if clicking same combo
    state.currentCombo = null;
    state.selectedEngines.clear();
  } else {
    // Activate new combo
    state.currentCombo = combo.id;
    state.selectedEngines = new Set(combo.engines);
  }

  // Update all UIs
  updateAllEnginesUI();
  updateCombosUI();
  updateSelectedCount();
  saveSelectedEngines();
}

function updateCombosUI() {
  const comboBtns = document.querySelectorAll('.combo-btn');
  comboBtns.forEach(btn => {
    if (btn.dataset.comboId === state.currentCombo) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  
  // 重新渲染以更新"保存为组合"按钮状态
  renderQuickCombos();
}

// 保存为自定义组合
async function saveAsCustomCombo() {
  if (state.selectedEngines.size === 0) {
    alert(t('noEnginesSelected'));
    return;
  }

  const customCombos = state.settings.customCombos || [];
  if (customCombos.length >= 5) {
    alert(t('maxCustomCombos') || 'Maximum 5 custom combos allowed');
    return;
  }

  const defaultName = `Custom Combo ${customCombos.length + 1}`;
  const comboName = prompt(t('enterComboName'), defaultName);
  if (!comboName || !comboName.trim()) {
    return;
  }

  const newCombo = {
    id: `custom-${Date.now()}`,
    name: comboName.trim(),
    engines: Array.from(state.selectedEngines)
  };

  customCombos.push(newCombo);
  state.settings.customCombos = customCombos;
  
  await saveSettings();
  renderQuickCombos();
  updateCombosUI();
  
  // 激活新保存的组合
  activateCombo(newCombo);
}

// 删除自定义组合
async function deleteCustomCombo(index) {
  if (!confirm(t('confirmDeleteCombo'))) {
    return;
  }

  const customCombos = state.settings.customCombos || [];
  customCombos.splice(index, 1);
  state.settings.customCombos = customCombos;
  
  await saveSettings();
  renderQuickCombos();
  updateCombosUI();
  
  // 如果删除的是当前激活的组合，清除选择
  if (state.currentCombo && state.currentCombo.startsWith('custom-')) {
    state.currentCombo = null;
    state.selectedEngines.clear();
    updateAllEnginesUI();
    updateSelectedCount();
  }
}

function updateAllEnginesUI() {
  const allCards = document.querySelectorAll('.engine-card');
  allCards.forEach(card => {
    const engineId = card.dataset.engineId;
    if (state.selectedEngines.has(engineId)) {
      card.classList.add('selected');
    } else {
      card.classList.remove('selected');
    }
  });
}

// Search functionality
async function performSearch() {
  console.log('🔍 performSearch called');
  const query = document.getElementById('searchInput').value.trim();
  console.log('Query:', query);
  console.log('Selected engines:', state.selectedEngines.size);
  
  if (!query || state.selectedEngines.size === 0) {
    console.log('❌ Search blocked: no query or no engines selected');
    if (!query) {
      alert(t('pleaseEnterQuery') || t('noEnginesSelected') || 'Please enter a search query');
    } else if (state.selectedEngines.size === 0) {
      alert(t('noEnginesSelected') || 'Please select at least one search engine');
    }
    return;
  }

  state.searchQuery = query;

  // Get all selected engine URLs
  const urls = [];
  const allEngines = getAllEngines();

  state.selectedEngines.forEach(engineId => {
    const engine = allEngines[engineId];
    if (engine) {
      const url = engine.url.replace('%s', encodeURIComponent(query));
      urls.push({ url, name: engine.name });
    }
  });

  // 在用户手势上下文中打开侧边栏（关键！）
  // 因为这是在用户点击按钮的事件处理函数中，所以有用户手势上下文
  if (state.settings.showSidebar !== false) {
    try {
      // 获取当前窗口ID
      const currentWindow = await chrome.windows.getCurrent();
      if (currentWindow && currentWindow.id) {
        // 在用户手势上下文中直接打开侧边栏
        await chrome.sidePanel.open({ windowId: currentWindow.id });
        console.log('✅ Sidebar opened successfully from index.html');
      }
    } catch (error) {
      console.error('Failed to open sidebar from index.html:', error);
      // 如果失败，尝试备用方法
      try {
        const [currentTab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (currentTab && currentTab.windowId) {
          await chrome.sidePanel.open({ windowId: currentTab.windowId });
          console.log('✅ Sidebar opened with fallback method');
        }
      } catch (err) {
        console.error('Fallback method also failed:', err);
      }
    }
  }

  // Send to background script to create tabs
  chrome.runtime.sendMessage({
    action: 'search',
    query: query,
    urls: urls,
    settings: state.settings
  });
}

function getAllEngines() {
  const engines = {};
  // 添加默认引擎
  Object.values(DEFAULT_ENGINES).forEach(category => {
    category.engines.forEach(engine => {
      engines[engine.id] = engine;
    });
  });
  // 添加自定义引擎
  if (state.settings.customEngines) {
    state.settings.customEngines.forEach(engine => {
      engines[engine.id] = engine;
    });
  }
  return engines;
}

// 切换编辑模式
function toggleEditMode() {
  state.editMode = !state.editMode;
  renderCategories();
  renderQuickCombos();
  
  // 更新编辑模式按钮
  const editBtn = document.getElementById('editModeBtn');
  if (editBtn) {
    editBtn.classList.toggle('active', state.editMode);
  }
}

// 切换紧凑模式
async function toggleCompactMode() {
  // 确保 compactMode 存在
  if (state.settings.compactMode === undefined) {
    state.settings.compactMode = false;
  }
  
  state.settings.compactMode = !state.settings.compactMode;
  await saveSettings();
  
  // 重新渲染所有分类
  renderCategories();
  
  // 更新紧凑模式按钮
  const compactBtn = document.getElementById('compactModeBtn');
  if (compactBtn) {
    compactBtn.classList.toggle('active', state.settings.compactMode);
  }
}

// 编辑组合
async function editCombo(index, combo) {
  // 创建编辑表单
  const form = document.createElement('div');
  form.style.cssText = `
    padding: 1.5rem;
    background: var(--bg-primary);
    border-radius: 8px;
    min-width: 500px;
    max-width: 600px;
    max-height: 80vh;
    overflow-y: auto;
  `;

  // 获取所有引擎
  const allEngines = [];
  Object.entries(DEFAULT_ENGINES).forEach(([categoryId, category]) => {
    category.engines.forEach(engine => {
      allEngines.push({
        ...engine,
        categoryName: category.name,
        categoryIcon: category.icon
      });
    });
  });

  // 生成引擎复选框列表
  const engineCheckboxes = allEngines.map(engine => {
    const isChecked = combo.engines.includes(engine.id);
    return `
      <div class="combo-engine-item" data-engine-id="${engine.id}" style="display: flex; align-items: center; padding: 0.5rem; border-radius: 4px; transition: background 0.2s; position: relative; group;">
        <label style="display: flex; align-items: center; flex: 1; cursor: pointer;">
          <input type="checkbox" value="${engine.id}" ${isChecked ? 'checked' : ''}
                 class="combo-engine-checkbox"
                 style="margin-right: 0.75rem; cursor: pointer; width: 16px; height: 16px;">
          <img src="${engine.favicon}" style="width: 20px; height: 20px; margin-right: 0.5rem;" onerror="this.style.display='none'">
          <span style="color: var(--text-primary); flex: 1;">${engine.name}</span>
          <span style="color: var(--text-secondary); font-size: 0.875rem; margin-right: 0.5rem;">${engine.categoryIcon} ${engine.categoryName}</span>
        </label>
        ${isChecked ? `
        <button class="remove-engine-btn" data-engine-id="${engine.id}"
                title="Remove from combo"
                style="width: 24px; height: 24px; border: none; background: transparent; color: var(--text-secondary);
                       cursor: pointer; border-radius: 4px; display: flex; align-items: center; justify-content: center;
                       transition: all 0.2s; opacity: 0.6;"
                onmouseover="this.style.background='#ff4444'; this.style.color='white'; this.style.opacity='1';"
                onmouseout="this.style.background='transparent'; this.style.color='var(--text-secondary)'; this.style.opacity='0.6';">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        ` : ''}
      </div>
    `;
  }).join('');

  form.innerHTML = `
    <h3 style="margin: 0 0 1rem 0; color: var(--text-primary);">Edit Combo</h3>

    <div style="margin-bottom: 1rem;">
      <label style="display: block; margin-bottom: 0.5rem; color: var(--text-primary); font-weight: 500;">
        Combo Name
      </label>
      <input type="text" id="editComboName" value="${combo.name}"
             style="width: 100%; padding: 0.5rem; border: 1px solid var(--border-color); border-radius: 4px;
                    background: var(--bg-secondary); color: var(--text-primary);">
    </div>

    <div style="margin-bottom: 1rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
        <label style="color: var(--text-primary); font-weight: 500;">
          Select Search Engines
        </label>
        <span id="selectedEngineCount" style="color: var(--text-secondary); font-size: 0.875rem;">
          ${combo.engines.length} engines selected
        </span>
      </div>
      <div id="engineList" style="max-height: 300px; overflow-y: auto; border: 1px solid var(--border-color);
                  border-radius: 4px; padding: 0.5rem; background: var(--bg-secondary);">
        ${engineCheckboxes}
      </div>
      <p style="margin: 0.5rem 0 0 0; font-size: 0.875rem; color: var(--text-secondary);">
        💡 Tip: Click × to quickly remove an engine
      </p>
    </div>

    <div style="display: flex; gap: 0.5rem; justify-content: flex-end; margin-top: 1.5rem;">
      <button id="cancelEditCombo"
              style="padding: 0.5rem 1rem; border: 1px solid var(--border-color); border-radius: 4px;
                     background: var(--bg-secondary); color: var(--text-primary); cursor: pointer;">
        ${t('cancel')}
      </button>
      <button id="saveEditCombo"
              style="padding: 0.5rem 1rem; border: none; border-radius: 4px;
                     background: var(--accent-color); color: white; cursor: pointer; font-weight: 500;">
        ${t('save')}
      </button>
    </div>
  `;

  // 创建模态框
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center;
    z-index: 10000;
  `;
  modal.appendChild(form);
  document.body.appendChild(modal);

  // 更新选中数量
  const updateCount = () => {
    const checkedCount = form.querySelectorAll('.combo-engine-checkbox:checked').length;
    const countEl = form.querySelector('#selectedEngineCount');
    if (countEl) {
      countEl.textContent = `${checkedCount} ${t('enginesSelected')}`;
    }
  };

  // 监听复选框变化
  form.querySelectorAll('.combo-engine-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      updateCount();
      // 当取消勾选时，移除删除按钮；勾选时添加删除按钮
      const engineItem = e.target.closest('.combo-engine-item');
      const engineId = e.target.value;
      const removeBtn = engineItem.querySelector('.remove-engine-btn');

      if (e.target.checked) {
        // 勾选时添加删除按钮
        if (!removeBtn) {
          const btn = document.createElement('button');
          btn.className = 'remove-engine-btn';
          btn.dataset.engineId = engineId;
          btn.title = 'Remove from combo';
          btn.style.cssText = `width: 24px; height: 24px; border: none; background: transparent;
                               color: var(--text-secondary); cursor: pointer; border-radius: 4px;
                               display: flex; align-items: center; justify-content: center;
                               transition: all 0.2s; opacity: 0.6;`;
          btn.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          `;
          btn.addEventListener('mouseover', function() {
            this.style.background = '#ff4444';
            this.style.color = 'white';
            this.style.opacity = '1';
          });
          btn.addEventListener('mouseout', function() {
            this.style.background = 'transparent';
            this.style.color = 'var(--text-secondary)';
            this.style.opacity = '0.6';
          });
          btn.addEventListener('click', (e) => handleRemoveEngine(e, engineId));
          engineItem.appendChild(btn);
        }
      } else {
        // 取消勾选时移除删除按钮
        if (removeBtn) {
          removeBtn.remove();
        }
      }
    });
  });

  // 删除按钮点击处理（带确认）
  const handleRemoveEngine = (e, engineId) => {
    e.preventDefault();
    e.stopPropagation();

    const engineName = allEngines.find(eng => eng.id === engineId)?.name || engineId;
    const confirmMsg = `Remove "${engineName}" from this combo?`;

    if (confirm(confirmMsg)) {
      const checkbox = form.querySelector(`.combo-engine-checkbox[value="${engineId}"]`);
      if (checkbox) {
        checkbox.checked = false;
        checkbox.dispatchEvent(new Event('change'));
      }
    }
  };

  // 为已存在的删除按钮添加事件监听
  form.querySelectorAll('.remove-engine-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      handleRemoveEngine(e, btn.dataset.engineId);
    });
  });

  // 添加引擎项的hover效果
  form.querySelectorAll('.combo-engine-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
      this.style.background = 'var(--bg-tertiary)';
    });
    item.addEventListener('mouseleave', function() {
      this.style.background = 'transparent';
    });
  });

  // 聚焦到名称输入框
  const nameInput = form.querySelector('#editComboName');
  nameInput.focus();
  nameInput.select();

  // 关闭模态框
  const closeModal = () => {
    document.body.removeChild(modal);
  };

  // 取消按钮
  form.querySelector('#cancelEditCombo').addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // 保存按钮
  form.querySelector('#saveEditCombo').addEventListener('click', async () => {
    const newName = nameInput.value.trim();
    if (!newName) {
      alert(t('pleaseEnterComboName'));
      return;
    }

    const selectedEngineIds = Array.from(form.querySelectorAll('.combo-engine-checkbox:checked'))
      .map(cb => cb.value);

    if (selectedEngineIds.length === 0) {
      alert(t('noEnginesSelected'));
      return;
    }

    // 更新组合
    state.settings.customCombos[index] = {
      ...combo,
      name: newName,
      engines: selectedEngineIds
    };

    await saveSettings();
    renderQuickCombos();
    closeModal();
  });

  // ESC键关闭
  const escHandler = (e) => {
    if (e.key === 'Escape') {
      closeModal();
      document.removeEventListener('keydown', escHandler);
    }
  };
  document.addEventListener('keydown', escHandler);
}

// 编辑引擎
async function editEngine(engine, categoryId) {
  // 创建编辑表单
  const form = document.createElement('div');
  form.style.cssText = `
    padding: 1.5rem;
    background: var(--bg-primary);
    border-radius: 8px;
    min-width: 400px;
    max-width: 500px;
  `;

  form.innerHTML = `
    <h3 style="margin: 0 0 1rem 0; color: var(--text-primary);">${t('editEngineTitle')}</h3>
    <div style="margin-bottom: 1rem;">
      <label style="display: block; margin-bottom: 0.5rem; color: var(--text-primary); font-weight: 500;">${t('engineName')}</label>
      <input type="text" id="editEngineName" value="${engine.name}" style="width: 100%; padding: 0.5rem; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary);">
    </div>
    <div style="margin-bottom: 1rem;">
      <label style="display: block; margin-bottom: 0.5rem; color: var(--text-primary); font-weight: 500;">${t('searchUrl')} <span style="color: var(--text-secondary); font-size: 0.875rem;">${t('urlPlaceholder')}</span></label>
      <input type="text" id="editEngineUrl" value="${engine.url}" style="width: 100%; padding: 0.5rem; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary);">
      <p style="margin: 0.25rem 0 0 0; font-size: 0.75rem; color: var(--text-secondary);">${t('logoAutoUpdate')}</p>
    </div>
    <div style="display: flex; gap: 0.5rem; justify-content: flex-end; margin-top: 1.5rem;">
      <button id="cancelEditEngine" style="padding: 0.5rem 1rem; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary); cursor: pointer;">${t('cancel')}</button>
      <button id="saveEditEngine" style="padding: 0.5rem 1rem; border: none; border-radius: 4px; background: var(--accent-color); color: white; cursor: pointer; font-weight: 500;">${t('save')}</button>
    </div>
  `;
  
  // 创建模态框
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
  `;
  modal.appendChild(form);
  document.body.appendChild(modal);
  
  // 聚焦到名称输入框
  const nameInput = form.querySelector('#editEngineName');
  const urlInput = form.querySelector('#editEngineUrl');
  nameInput.focus();
  nameInput.select();
  
  // 关闭模态框
  const closeModal = () => {
    document.body.removeChild(modal);
  };
  
  // 取消按钮
  form.querySelector('#cancelEditEngine').addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  
  // 保存按钮
  form.querySelector('#saveEditEngine').addEventListener('click', async () => {
    const newName = nameInput.value.trim();
    const newUrl = urlInput.value.trim();

    if (!newName) {
      alert(t('enterEngineName'));
      return;
    }

    if (!newUrl || !newUrl.includes('%s')) {
      alert(t('urlMustContainPlaceholder'));
      return;
    }
    
    try {
      // 从URL提取域名用于自动生成favicon
      const urlObj = new URL(newUrl.replace('%s', ''));
      const domain = urlObj.hostname;
      const autoFavicon = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
      
      if (engine.id.startsWith('custom-')) {
        // 更新自定义引擎
        const index = state.settings.customEngines.findIndex(e => e.id === engine.id);
        if (index >= 0) {
          state.settings.customEngines[index] = {
            ...state.settings.customEngines[index],
            name: newName,
            url: newUrl,
            favicon: autoFavicon // 自动根据URL更新favicon
          };
          await saveSettings();
          renderCategories();
          closeModal();
        }
      } else {
        // 默认引擎：创建自定义副本
        if (confirm(t('defaultEngineCannotEdit'))) {
          const newEngine = {
            id: `custom-${Date.now()}`,
            name: newName,
            description: engine.description || 'Custom search engine',
            url: newUrl,
            category: categoryId,
            favicon: autoFavicon // 自动根据URL更新favicon
          };
          
          if (!state.settings.customEngines) {
            state.settings.customEngines = [];
          }
          state.settings.customEngines.push(newEngine);
          await saveSettings();
          renderCategories();
          closeModal();
        }
      }
    } catch (e) {
      alert(t('urlFormatError'));
    }
  });
  
  // ESC键关闭
  const escHandler = (e) => {
    if (e.key === 'Escape') {
      closeModal();
      document.removeEventListener('keydown', escHandler);
    }
  };
  document.addEventListener('keydown', escHandler);
  
  // Enter键保存
  urlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      form.querySelector('#saveEditEngine').click();
    }
  });
}

// 删除引擎
async function deleteEngine(engineId, categoryId) {
  if (!confirm(t('confirmDelete'))) {
    return;
  }
  
  const index = state.settings.customEngines.findIndex(e => e.id === engineId);
  if (index >= 0) {
    state.settings.customEngines.splice(index, 1);
    await saveSettings();
    renderCategories();
  }
}

// Add custom engine
async function addEngine(categoryId) {
  // Create form
  const form = document.createElement('div');
  form.style.cssText = `
    padding: 1.5rem;
    background: var(--bg-primary);
    border-radius: 8px;
    min-width: 450px;
    max-width: 550px;
  `;

  form.innerHTML = `
    <h3 style="margin: 0 0 1rem 0; color: var(--text-primary);">${t('addCustomEngine')}</h3>

    <div style="margin-bottom: 1rem;">
      <label style="display: block; margin-bottom: 0.5rem; color: var(--text-primary); font-weight: 500;">
        ${t('engineName')} *
      </label>
      <input type="text" id="addEngineName" placeholder="${t('exampleGoogle')}"
             style="width: 100%; padding: 0.5rem; border: 1px solid var(--border-color); border-radius: 4px;
                    background: var(--bg-secondary); color: var(--text-primary);">
    </div>

    <div style="margin-bottom: 1rem;">
      <label style="display: block; margin-bottom: 0.5rem; color: var(--text-primary); font-weight: 500;">
        ${t('searchUrl')} * <span style="color: var(--text-secondary); font-size: 0.875rem;">${t('urlPlaceholder')}</span>
      </label>
      <input type="text" id="addEngineUrl" placeholder="${t('exampleUrl')}"
             style="width: 100%; padding: 0.5rem; border: 1px solid var(--border-color); border-radius: 4px;
                    background: var(--bg-secondary); color: var(--text-primary);">
      <p style="margin: 0.25rem 0 0 0; font-size: 0.75rem; color: var(--text-secondary);">
        ${t('logoAutoGenerated')}
      </p>
    </div>

    <div style="margin-bottom: 1rem;">
      <label style="display: block; margin-bottom: 0.5rem; color: var(--text-primary); font-weight: 500;">
        ${t('enterDescription')} <span style="color: var(--text-secondary); font-size: 0.875rem;">(${getCurrentLanguage() === 'zh' ? '可选' : 'optional'})</span>
      </label>
      <input type="text" id="addEngineDesc" placeholder="${t('examplePopularSearch')}"
             style="width: 100%; padding: 0.5rem; border: 1px solid var(--border-color); border-radius: 4px;
                    background: var(--bg-secondary); color: var(--text-primary);">
    </div>

    <div style="display: flex; gap: 0.5rem; justify-content: flex-end; margin-top: 1.5rem;">
      <button id="cancelAddEngine"
              style="padding: 0.5rem 1rem; border: 1px solid var(--border-color); border-radius: 4px;
                     background: var(--bg-secondary); color: var(--text-primary); cursor: pointer;">
        ${t('cancel')}
      </button>
      <button id="saveAddEngine"
              style="padding: 0.5rem 1rem; border: none; border-radius: 4px;
                     background: var(--accent-color); color: white; cursor: pointer; font-weight: 500;">
        ${t('addEngineTitle')}
      </button>
    </div>
  `;

  // Create modal
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center;
    z-index: 10000;
  `;
  modal.appendChild(form);
  document.body.appendChild(modal);

  const nameInput = form.querySelector('#addEngineName');
  const urlInput = form.querySelector('#addEngineUrl');
  const descInput = form.querySelector('#addEngineDesc');

  nameInput.focus();

  const closeModal = () => {
    document.body.removeChild(modal);
  };

  // Cancel button
  form.querySelector('#cancelAddEngine').addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Save button
  form.querySelector('#saveAddEngine').addEventListener('click', async () => {
    const name = nameInput.value.trim();
    const url = urlInput.value.trim();
    const desc = descInput.value.trim();

    if (!name) {
      alert(t('pleaseEnterEngineName'));
      nameInput.focus();
      return;
    }

    if (!url || !url.includes('%s')) {
      alert(t('urlMustContainPlaceholder'));
      urlInput.focus();
      return;
    }

    try {
      const urlObj = new URL(url.replace('%s', 'test'));
      const newEngine = {
        id: `custom-${Date.now()}`,
        name: name,
        description: desc || 'Custom search engine',
        url: url,
        category: categoryId,
        favicon: `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=32`
      };

      if (!state.settings.customEngines) {
        state.settings.customEngines = [];
      }

      state.settings.customEngines.push(newEngine);
      await saveSettings();
      renderCategories();
      closeModal();
    } catch (e) {
      alert(t('invalidUrlFormat'));
      urlInput.focus();
    }
  });

  // ESC key to close
  const escHandler = (e) => {
    if (e.key === 'Escape') {
      closeModal();
      document.removeEventListener('keydown', escHandler);
    }
  };
  document.addEventListener('keydown', escHandler);
}

// Event listeners
function attachEventListeners() {
  // Language toggle
  const langToggle = document.getElementById('langToggle');
  if (langToggle) {
    langToggle.addEventListener('click', () => {
      toggleLanguage();
      updateLanguageButton();
    });
    // Initialize language button
    updateLanguageButton();
  }

  // Theme toggle
  document.getElementById('themeToggle').addEventListener('click', toggleTheme);

  // Settings button
  document.getElementById('settingsBtn').addEventListener('click', () => {
    chrome.tabs.create({ url: 'settings.html' });
  });

  // Edit mode button (如果存在)
  const editBtn = document.getElementById('editModeBtn');
  if (editBtn) {
    editBtn.addEventListener('click', toggleEditMode);
  }

  // Compact mode button (如果存在)
  const compactBtn = document.getElementById('compactModeBtn');
  if (compactBtn) {
    compactBtn.addEventListener('click', () => {
      toggleCompactMode();
    });
    // 初始化按钮状态
    if (state.settings.compactMode) {
      compactBtn.classList.add('active');
    }
  }

  // Search input
  const searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('input', (e) => {
    const clearBtn = document.getElementById('clearBtn');
    clearBtn.style.display = e.target.value ? 'block' : 'none';
  });

  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      performSearch();
    }
  });

  // Clear button
  document.getElementById('clearBtn').addEventListener('click', () => {
    searchInput.value = '';
    searchInput.focus();
    document.getElementById('clearBtn').style.display = 'none';
  });

  // Search button
  const searchBtn = document.getElementById('searchBtn');
  if (searchBtn) {
    searchBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('🔘 Search button clicked');
      performSearch();
    });
    console.log('✅ Search button event listener attached');
  } else {
    console.error('❌ Search button not found!');
  }

  // Restore last search query if enabled
  if (state.settings.rememberInput) {
    restoreSearchQuery();
  }
}

async function restoreSearchQuery() {
  try {
    const result = await chrome.storage.local.get(['lastQuery']);
    if (result.lastQuery) {
      const searchInput = document.getElementById('searchInput');
      searchInput.value = result.lastQuery;
      document.getElementById('clearBtn').style.display = 'block';
    }
  } catch (error) {
    console.error('Failed to restore search query:', error);
  }
}

// Listen for messages from background
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'searchSelected') {
    const searchInput = document.getElementById('searchInput');
    searchInput.value = message.text;
    document.getElementById('clearBtn').style.display = 'block';
    performSearch();
  }
});

// Auto-detect system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (state.settings.theme === 'auto') {
    document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
  }
});

// Update language button display
function updateLanguageButton() {
  const langText = document.getElementById('langText');
  if (langText) {
    const currentLang = getCurrentLanguage();
    langText.textContent = currentLang === 'zh' ? '中' : 'EN';
  }
}
