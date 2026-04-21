// Settings page script

let settings = DEFAULT_SETTINGS;

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  await loadSettings();
  initializeTheme();
  populateSettings();
  attachEventListeners();
});

// Load settings from storage
async function loadSettings() {
  try {
    const result = await chrome.storage.sync.get(['settings']);
    if (result.settings) {
      settings = { ...DEFAULT_SETTINGS, ...result.settings };
    }
  } catch (error) {
    console.error('Failed to load settings:', error);
  }
}

// Save settings to storage
async function saveSettings() {
  try {
    await chrome.storage.sync.set({ settings });
    showToast('Settings saved successfully');
  } catch (error) {
    console.error('Failed to save settings:', error);
    showToast('Failed to save settings', 'error');
  }
}

// Theme management
function initializeTheme() {
  const theme = settings.theme;
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
  settings.theme = newTheme;
  document.getElementById('themeSelect').value = newTheme;
  saveSettings();
}

// Populate settings UI
function populateSettings() {
  // Theme
  document.getElementById('themeSelect').value = settings.theme;

  // Language
  const langEl = document.getElementById('languageSelect');
  if (langEl) langEl.value = settings.language || 'en';

  // Open mode
  document.getElementById('openModeSelect').value = settings.openMode;

  // Toggles
  document.getElementById('groupTabsToggle').checked = settings.groupTabs;
  document.getElementById('collapsedGroupsToggle').checked = settings.collapsedGroups;
  document.getElementById('showSidebarToggle').checked = settings.showSidebar;
  document.getElementById('rememberInputToggle').checked = settings.rememberInput;

  // Combos
  renderCombos();

  // Custom engines
  renderCustomEngines();
}

// Render combos list
function renderCombos() {
  const container = document.getElementById('combosList');
  container.innerHTML = '';

  if (settings.combos.length === 0) {
    container.innerHTML = '<p style="color: var(--text-secondary); padding: 1rem;">No combos yet. Create one to get started!</p>';
    return;
  }

  settings.combos.forEach((combo, index) => {
    const comboEl = document.createElement('div');
    comboEl.className = 'combo-item';
    comboEl.innerHTML = `
      <div class="combo-info">
        <div class="combo-name">${combo.name}</div>
        <div class="combo-engines">${combo.engines.length} engines</div>
      </div>
      <div class="combo-actions">
        <button class="btn-icon delete" onclick="deleteCombo(${index})">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>
    `;
    container.appendChild(comboEl);
  });
}

// Render custom engines
function renderCustomEngines() {
  const container = document.getElementById('customEnginesList');
  container.innerHTML = '';

  if (!settings.customEngines || settings.customEngines.length === 0) {
    container.innerHTML = '<p style="color: var(--text-secondary); padding: 1rem;">No custom engines yet. Add one to get started!</p>';
    return;
  }

  settings.customEngines.forEach((engine, index) => {
    const engineEl = document.createElement('div');
    engineEl.className = 'engine-item';
    engineEl.innerHTML = `
      <div class="engine-info">
        <div class="engine-name">${engine.name}</div>
        <div class="engine-url">${engine.url}</div>
      </div>
      <div class="engine-actions">
        <button class="btn-icon delete" onclick="deleteEngine(${index})">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>
    `;
    container.appendChild(engineEl);
  });
}

// Delete combo
function deleteCombo(index) {
  if (confirm('Are you sure you want to delete this combo?')) {
    settings.combos.splice(index, 1);
    saveSettings();
    renderCombos();
  }
}

// Delete engine
function deleteEngine(index) {
  if (confirm('Are you sure you want to delete this custom engine?')) {
    settings.customEngines.splice(index, 1);
    saveSettings();
    renderCustomEngines();
  }
}

// Event listeners
function attachEventListeners() {
  // Back button
  document.getElementById('backBtn').addEventListener('click', () => {
    chrome.tabs.create({ url: 'index.html' });
  });

  // Theme toggle
  document.getElementById('themeToggle').addEventListener('click', toggleTheme);

  // Language select
  const langEl = document.getElementById('languageSelect');
  if (langEl) {
    langEl.addEventListener('change', (e) => {
      settings.language = e.target.value;
      saveSettings();
      try { chrome.runtime.sendMessage({ action: 'languageChanged', lang: e.target.value }); } catch (_) {}
    });
  }

  // Theme select
  document.getElementById('themeSelect').addEventListener('change', (e) => {
    settings.theme = e.target.value;
    initializeTheme();
    saveSettings();
  });

  // Open mode
  document.getElementById('openModeSelect').addEventListener('change', (e) => {
    settings.openMode = e.target.value;
    saveSettings();
  });

  // Toggles
  document.getElementById('groupTabsToggle').addEventListener('change', (e) => {
    settings.groupTabs = e.target.checked;
    saveSettings();
  });

  document.getElementById('collapsedGroupsToggle').addEventListener('change', (e) => {
    settings.collapsedGroups = e.target.checked;
    saveSettings();
  });

  document.getElementById('showSidebarToggle').addEventListener('change', (e) => {
    settings.showSidebar = e.target.checked;
    saveSettings();
  });

  document.getElementById('rememberInputToggle').addEventListener('change', (e) => {
    settings.rememberInput = e.target.checked;
    saveSettings();
  });

  // Add combo button
  document.getElementById('addComboBtn').addEventListener('click', openComboModal);

  // Add engine button
  document.getElementById('addEngineBtn').addEventListener('click', openEngineModal);

  // Export button
  document.getElementById('exportBtn').addEventListener('click', exportSettings);

  // Import button
  document.getElementById('importBtn').addEventListener('click', () => {
    document.getElementById('importFile').click();
  });

  document.getElementById('importFile').addEventListener('change', importSettings);

  // Reset button
  document.getElementById('resetBtn').addEventListener('click', resetSettings);

  // Combo modal
  document.getElementById('closeComboModal').addEventListener('click', closeComboModal);
  document.getElementById('cancelComboBtn').addEventListener('click', closeComboModal);
  document.getElementById('saveComboBtn').addEventListener('click', saveCombo);

  // Engine modal
  document.getElementById('closeEngineModal').addEventListener('click', closeEngineModal);
  document.getElementById('cancelEngineBtn').addEventListener('click', closeEngineModal);
  document.getElementById('saveEngineBtn').addEventListener('click', saveEngine);
}

// Combo modal
function openComboModal() {
  const modal = document.getElementById('comboModal');
  const enginesList = document.getElementById('comboEnginesList');

  // Clear previous selections
  document.getElementById('comboName').value = '';
  enginesList.innerHTML = '';

  // Populate engines list
  const allEngines = [];
  Object.entries(DEFAULT_ENGINES).forEach(([categoryId, category]) => {
    category.engines.forEach(engine => {
      allEngines.push(engine);
    });
  });

  allEngines.forEach(engine => {
    const checkbox = document.createElement('div');
    checkbox.className = 'checkbox-item';
    checkbox.innerHTML = `
      <input type="checkbox" id="engine-${engine.id}" value="${engine.id}">
      <label for="engine-${engine.id}" class="checkbox-label">${engine.name}</label>
    `;
    enginesList.appendChild(checkbox);
  });

  modal.style.display = 'flex';
}

function closeComboModal() {
  document.getElementById('comboModal').style.display = 'none';
}

function saveCombo() {
  const name = document.getElementById('comboName').value.trim();
  const enginesList = document.getElementById('comboEnginesList');
  const checkboxes = enginesList.querySelectorAll('input[type="checkbox"]:checked');
  const engines = Array.from(checkboxes).map(cb => cb.value);

  if (!name) {
    alert('Please enter a combo name');
    return;
  }

  if (engines.length === 0) {
    alert('Please select at least one engine');
    return;
  }

  const combo = {
    id: `custom-${Date.now()}`,
    name,
    engines
  };

  settings.combos.push(combo);
  saveSettings();
  renderCombos();
  closeComboModal();
}

// Engine modal
function openEngineModal() {
  document.getElementById('engineName').value = '';
  document.getElementById('engineUrl').value = '';
  document.getElementById('engineDesc').value = '';
  document.getElementById('engineCategory').value = 'custom';
  document.getElementById('engineModal').style.display = 'flex';
}

function closeEngineModal() {
  document.getElementById('engineModal').style.display = 'none';
}

function saveEngine() {
  const name = document.getElementById('engineName').value.trim();
  const url = document.getElementById('engineUrl').value.trim();
  const description = document.getElementById('engineDesc').value.trim();
  const category = document.getElementById('engineCategory').value;

  if (!name || !url) {
    alert('Please enter engine name and URL');
    return;
  }

  if (!url.includes('%s')) {
    alert('URL must contain %s placeholder for the search query');
    return;
  }

  const engine = {
    id: `custom-${Date.now()}`,
    name,
    description: description || 'Custom search engine',
    url,
    category,
    favicon: `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}`
  };

  if (!settings.customEngines) {
    settings.customEngines = [];
  }

  settings.customEngines.push(engine);
  saveSettings();
  renderCustomEngines();
  closeEngineModal();
}

// Export settings
function exportSettings() {
  const dataStr = JSON.stringify(settings, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `searchhub-settings-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  URL.revokeObjectURL(url);
  showToast('Settings exported successfully');
}

// Import settings
async function importSettings(event) {
  const file = event.target.files[0];
  if (!file) return;

  try {
    const text = await file.text();
    const imported = JSON.parse(text);

    // Validate imported data
    if (typeof imported !== 'object') {
      throw new Error('Invalid settings file');
    }

    if (confirm('This will replace your current settings. Continue?')) {
      settings = { ...DEFAULT_SETTINGS, ...imported };
      await saveSettings();
      populateSettings();
      showToast('Settings imported successfully');
    }
  } catch (error) {
    console.error('Import failed:', error);
    showToast('Failed to import settings', 'error');
  }

  // Clear file input
  event.target.value = '';
}

// Reset settings
async function resetSettings() {
  if (confirm('This will reset all settings to defaults. Continue?')) {
    settings = { ...DEFAULT_SETTINGS };
    await saveSettings();
    populateSettings();
    showToast('Settings reset to defaults');
  }
}

// Toast notification
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: ${type === 'error' ? '#ef4444' : '#10b981'};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 10000;
    animation: slideIn 0.3s ease;
  `;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Make functions global for onclick handlers
window.deleteCombo = deleteCombo;
window.deleteEngine = deleteEngine;
