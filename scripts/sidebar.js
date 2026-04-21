// Sidebar script for vertical tab management

let currentWindowId = null;
let activeTabId = null;
let allTabs = [];
let allGroups = [];

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  await initialize();
  attachEventListeners();
  startListening();
  if (typeof initLanguage === 'function') await initLanguage();
  if (typeof updateUILanguage === 'function') updateUILanguage();
});

async function initialize() {
  // Get current window
  const window = await chrome.windows.getCurrent();
  currentWindowId = window.id;

  // Get active tab
  const tabs = await chrome.tabs.query({ active: true, windowId: currentWindowId });
  if (tabs[0]) {
    activeTabId = tabs[0].id;
  }

  // Load all tabs
  await loadAllTabs();

  // Load last search query if available
  await loadLastSearchQuery();
}

// Load last search query
async function loadLastSearchQuery() {
  try {
    const result = await chrome.storage.local.get(['lastQuery']);
    if (result.lastQuery) {
      const searchInfo = document.getElementById('searchInfo');
      const searchQuery = document.getElementById('searchQuery');
      const prefix = typeof t === 'function' ? t('latestPrefix') : 'Latest:';
      searchQuery.textContent = `${prefix} "${result.lastQuery}"`;
      searchInfo.style.display = 'block';
    }
  } catch (error) {
    console.error('Failed to load last query:', error);
  }
}

// Load and display all tabs
async function loadAllTabs() {
  try {
    // Get all tabs in current window
    allTabs = await chrome.tabs.query({ windowId: currentWindowId });

    // Get all groups in current window
    allGroups = await chrome.tabGroups.query({ windowId: currentWindowId });

    // Render tabs
    renderTabs();
  } catch (error) {
    console.error('Failed to load tabs:', error);
  }
}

// Render all tabs (grouped and ungrouped)
function renderTabs() {
  const tabsList = document.getElementById('tabsList');

  if (allTabs.length === 0) {
    // Show empty state
    tabsList.innerHTML = `
      <div class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="9" y1="9" x2="15" y2="9"></line>
          <line x1="9" y1="15" x2="15" y2="15"></line>
        </svg>
        <p>${typeof t === 'function' ? t('noTabs') : 'No tabs yet'}</p>
        <small>${typeof t === 'function' ? t('openSomeTabs') : 'Open some tabs to see them here'}</small>
      </div>
    `;
    return;
  }

  // Clear list
  tabsList.innerHTML = '';

  // Group tabs by their groupId
  const groupedTabs = new Map();
  const ungroupedTabs = [];

  allTabs.forEach(tab => {
    if (tab.groupId !== chrome.tabGroups.TAB_GROUP_ID_NONE) {
      if (!groupedTabs.has(tab.groupId)) {
        groupedTabs.set(tab.groupId, []);
      }
      groupedTabs.get(tab.groupId).push(tab);
    } else {
      ungroupedTabs.push(tab);
    }
  });

  // Render grouped tabs first
  allGroups.forEach(group => {
    const tabs = groupedTabs.get(group.id) || [];
    if (tabs.length > 0) {
      const groupEl = createGroupElement(group, tabs);
      tabsList.appendChild(groupEl);
    }
  });

  // Render ungrouped tabs (only if there are ungrouped tabs AND groups exist)
  if (ungroupedTabs.length > 0) {
    const ungroupedSection = document.createElement('div');
    ungroupedSection.className = 'ungrouped-section';

    // Only show divider if there are groups (to separate grouped from ungrouped)
    if (allGroups.length > 0 && groupedTabs.size > 0) {
      const divider = document.createElement('div');
      divider.className = 'section-divider';
      divider.innerHTML = `<span>${typeof t === 'function' ? t('otherTabs') : 'Other Tabs'}</span>`;
      ungroupedSection.appendChild(divider);
    }

    ungroupedTabs.forEach(tab => {
      const tabEl = createTabElement(tab, false);
      ungroupedSection.appendChild(tabEl);
    });

    tabsList.appendChild(ungroupedSection);
  }
}

// Create group element
function createGroupElement(group, tabs) {
  const groupEl = document.createElement('div');
  groupEl.className = 'group-item expanded'; // 默认展开
  groupEl.dataset.groupId = group.id;

  const groupHeader = document.createElement('div');
  groupHeader.className = 'group-header';
  groupHeader.innerHTML = `
    <svg class="group-expand" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
    <div class="group-color color-${group.color}"></div>
    <div class="group-info">
      <div class="group-title">${group.title || (typeof t === 'function' ? t('untitledGroup') : 'Untitled Group')}</div>
      <div class="group-count">${tabs.length} ${typeof t === 'function' ? t('tabsWord') : (tabs.length !== 1 ? 'tabs' : 'tab')}</div>
    </div>
    <button class="group-ungroup" data-group-id="${group.id}" title="${typeof t === 'function' ? t('ungroup') : 'Ungroup'}">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
  `;

  const groupTabs = document.createElement('div');
  groupTabs.className = 'group-tabs';

  tabs.forEach(tab => {
    const tabEl = createTabElement(tab, true);
    groupTabs.appendChild(tabEl);
  });

  groupEl.appendChild(groupHeader);
  groupEl.appendChild(groupTabs);

  return groupEl;
}

// Create tab element
function createTabElement(tab, inGroup) {
  const tabEl = document.createElement('div');
  tabEl.className = `tab-item ${tab.id === activeTabId ? 'active' : ''}`;
  tabEl.dataset.tabId = tab.id;

  // Get favicon
  const faviconUrl = tab.favIconUrl || 'icons/icon16.png';

  // Truncate title if too long
  const title = tab.title || 'Loading...';
  const displayTitle = title.length > 50 ? title.substring(0, 50) + '...' : title;

  tabEl.innerHTML = `
    <img class="tab-favicon" src="${faviconUrl}" alt="" onerror="this.src='icons/icon16.png'">
    <div class="tab-info">
      <div class="tab-title" title="${title}">${displayTitle}</div>
      ${tab.url ? `<div class="tab-url">${getDomain(tab.url)}</div>` : ''}
    </div>
    <button class="tab-close" data-tab-id="${tab.id}" title="${typeof t === 'function' ? t('closeTab') : 'Close tab'}">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
  `;

  return tabEl;
}

// Get domain from URL
function getDomain(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return '';
  }
}

// Event listeners
function attachEventListeners() {
  // Refresh button
  document.getElementById('refreshBtn').addEventListener('click', loadAllTabs);

  // Collapse all button
  document.getElementById('collapseAllBtn').addEventListener('click', toggleAllGroups);

  // Open SearchHub button
  document.getElementById('openSearchHub').addEventListener('click', () => {
    chrome.tabs.create({ url: 'index.html' });
  });

  // Event delegation for tab list
  document.getElementById('tabsList').addEventListener('click', async (e) => {
    // Group header clicks (expand/collapse)
    const groupHeader = e.target.closest('.group-header');
    if (groupHeader && !e.target.closest('.group-ungroup')) {
      const groupItem = groupHeader.closest('.group-item');
      groupItem.classList.toggle('expanded');

      // Update Chrome tab group collapsed state
      const groupId = parseInt(groupItem.dataset.groupId);
      const isExpanded = groupItem.classList.contains('expanded');
      try {
        await chrome.tabGroups.update(groupId, { collapsed: !isExpanded });
      } catch (error) {
        console.error('Failed to toggle group:', error);
      }
      return;
    }

    // Ungroup button
    const ungroupBtn = e.target.closest('.group-ungroup');
    if (ungroupBtn) {
      e.stopPropagation();
      const groupId = parseInt(ungroupBtn.dataset.groupId);
      try {
        await chrome.tabs.ungroup(
          allTabs.filter(t => t.groupId === groupId).map(t => t.id)
        );
        await loadAllTabs();
      } catch (error) {
        console.error('Failed to ungroup:', error);
      }
      return;
    }

    // Tab clicks (activate tab)
    const tabItem = e.target.closest('.tab-item');
    if (tabItem && !e.target.closest('.tab-close')) {
      const tabId = parseInt(tabItem.dataset.tabId);
      try {
        await chrome.tabs.update(tabId, { active: true });
        activeTabId = tabId;
        updateActiveTab();
      } catch (error) {
        console.error('Failed to activate tab:', error);
      }
      return;
    }

    // Tab close clicks
    const closeBtn = e.target.closest('.tab-close');
    if (closeBtn) {
      e.stopPropagation();
      const tabId = parseInt(closeBtn.dataset.tabId);
      try {
        await chrome.tabs.remove(tabId);
        // Reload will happen via listener
      } catch (error) {
        console.error('Failed to close tab:', error);
      }
    }
  });
}

// Toggle all groups
async function toggleAllGroups() {
  const allExpanded = document.querySelectorAll('.group-item.expanded').length === allGroups.length;

  document.querySelectorAll('.group-item').forEach(item => {
    if (allExpanded) {
      item.classList.remove('expanded');
    } else {
      item.classList.add('expanded');
    }
  });

  // Update Chrome tab groups
  for (const group of allGroups) {
    try {
      await chrome.tabGroups.update(group.id, { collapsed: allExpanded });
    } catch (error) {
      console.error('Failed to toggle group:', error);
    }
  }
}

// Update active tab indicator
function updateActiveTab() {
  const tabItems = document.querySelectorAll('.tab-item');
  tabItems.forEach(item => {
    const tabId = parseInt(item.dataset.tabId);
    if (tabId === activeTabId) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

// Listen for tab/group changes
function startListening() {
  // Tab activated
  chrome.tabs.onActivated.addListener((activeInfo) => {
    if (activeInfo.windowId === currentWindowId) {
      activeTabId = activeInfo.tabId;
      updateActiveTab();
    }
  });

  // Tab updated (title, favicon, etc.)
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tab.windowId === currentWindowId) {
      // Only reload if significant change
      if (changeInfo.title || changeInfo.favIconUrl || changeInfo.status === 'complete') {
        loadAllTabs();
      }
    }
  });

  // Tab created
  chrome.tabs.onCreated.addListener((tab) => {
    if (tab.windowId === currentWindowId) {
      loadAllTabs();
    }
  });

  // Tab removed
  chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
    if (removeInfo.windowId === currentWindowId) {
      loadAllTabs();
    }
  });

  // Tab moved
  chrome.tabs.onMoved.addListener((tabId, moveInfo) => {
    if (moveInfo.windowId === currentWindowId) {
      loadAllTabs();
    }
  });

  // Tab attached (moved to this window)
  chrome.tabs.onAttached.addListener((tabId, attachInfo) => {
    if (attachInfo.newWindowId === currentWindowId) {
      loadAllTabs();
    }
  });

  // Tab detached (moved from this window)
  chrome.tabs.onDetached.addListener((tabId, detachInfo) => {
    if (detachInfo.oldWindowId === currentWindowId) {
      loadAllTabs();
    }
  });

  // Group created
  chrome.tabGroups.onCreated.addListener((group) => {
    if (group.windowId === currentWindowId) {
      loadAllTabs();
    }
  });

  // Group updated
  chrome.tabGroups.onUpdated.addListener((group) => {
    if (group.windowId === currentWindowId) {
      loadAllTabs();
    }
  });

  // Group removed
  chrome.tabGroups.onRemoved.addListener((group) => {
    if (group.windowId === currentWindowId) {
      loadAllTabs();
    }
  });
}

console.log('SearchHub sidebar loaded');
