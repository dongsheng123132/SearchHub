# 🔍 代码审查 - 发现的问题

## ⚠️ 发现的问题

### 1. 自定义引擎在右键搜索/Alt+Q 中无法使用 ⚠️ 重要

**问题：**
- `background.js` 中的 `findEngineById` 函数只包含默认引擎
- 当用户选择自定义引擎时，右键搜索和 Alt+Q 会失败（返回 null）

**位置：**
- `background.js:237-313` - `findEngineById` 函数
- `background.js:214-223` - 使用 `findEngineById` 的地方

**影响：**
- 用户添加的自定义引擎无法通过右键菜单或 Alt+Q 使用
- 只有默认引擎可以正常工作

**修复建议：**
需要在 `findEngineById` 中检查自定义引擎，或创建一个新的函数来同时查找默认和自定义引擎。

### 2. i18n 使用 localStorage 而非 chrome.storage ⚠️ 中等

**问题：**
- `scripts/i18n.js` 使用 `localStorage` 存储语言偏好
- 其他设置使用 `chrome.storage.sync`
- 可能导致数据不一致

**位置：**
- `scripts/i18n.js:164` - `localStorage.getItem('searchhub_lang')`
- `scripts/i18n.js:275` - `localStorage.setItem('searchhub_lang', newLang)`

**影响：**
- 语言设置不会同步到其他设备
- 与其他设置存储方式不一致

**修复建议：**
改为使用 `chrome.storage.sync` 存储语言偏好，与其他设置保持一致。

### 3. 错误处理不完整 ⚠️ 轻微

**问题：**
- 一些异步操作缺少错误处理
- 某些边界情况可能未处理

**位置：**
- `background.js:329-339` - Alt+Q 快捷键处理
- `scripts/sidebar.js` - 某些操作可能失败

**影响：**
- 错误时可能没有用户友好的提示
- 调试困难

### 4. 自定义引擎编辑对话框未完全国际化 ⚠️ 轻微

**问题：**
- 添加/编辑引擎对话框中的部分文本仍为英文
- 表单标签、按钮等未使用 i18n

**位置：**
- `scripts/index.js:1058-1101` - 编辑引擎对话框
- `scripts/index.js:1163-1287` - 添加引擎对话框

**影响：**
- 中文用户看到部分英文文本
- 体验不一致

## ✅ 已修复的问题（根据测试结论）

- ✅ 右键搜索/Alt+Q 引擎映射不完整 - 已修复
- ✅ 侧边栏分组内容被裁切 - 已修复
- ✅ 侧边栏间距偏大 - 已优化
- ✅ 侧边栏未接入 i18n - 已修复
- ✅ 语言切换仅依赖浏览器语言 - 已修复

## 🔧 建议修复优先级

### 高优先级（建议立即修复）

1. **自定义引擎支持** - 影响功能完整性
2. **i18n 存储统一** - 影响数据一致性

### 中优先级（可选）

3. **错误处理完善** - 提升稳定性
4. **对话框国际化** - 提升用户体验

## 📝 修复代码示例

### 修复 1：自定义引擎支持

在 `background.js` 中添加自定义引擎查找：

```javascript
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

// Rename existing function
function findDefaultEngineById(engineId) {
  // ... existing code ...
}
```

### 修复 2：i18n 存储统一

在 `scripts/i18n.js` 中改为使用 chrome.storage：

```javascript
// Get current language
async function getCurrentLanguage() {
  try {
    const result = await chrome.storage.sync.get(['settings']);
    if (result.settings?.language) {
      return result.settings.language;
    }
  } catch (error) {
    console.error('Failed to load language:', error);
  }
  
  // Fallback to browser language
  const browserLang = navigator.language.toLowerCase();
  return browserLang.startsWith('zh') ? 'zh' : 'en';
}

// Toggle language
async function toggleLanguage() {
  const currentLang = getCurrentLanguage();
  const newLang = currentLang === 'en' ? 'zh' : 'en';
  
  // Save to chrome.storage
  try {
    const result = await chrome.storage.sync.get(['settings']);
    const settings = result.settings || {};
    settings.language = newLang;
    await chrome.storage.sync.set({ settings });
  } catch (error) {
    console.error('Failed to save language:', error);
  }
  
  // Update UI
  updateUILanguage();
}
```

## 🎯 总结

**当前状态：** 基本功能正常，但有几个可以改进的地方。

**建议：**
1. 立即修复自定义引擎支持（影响功能）
2. 统一存储方式（提升一致性）
3. 其他问题可以后续优化

