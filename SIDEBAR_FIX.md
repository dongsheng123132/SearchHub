# 侧边栏自动打开功能修复说明

## 问题描述

之前侧边栏虽然配置了自动打开，但在实际使用中没有自动打开。

## 问题原因

1. **Service Worker 中获取窗口ID错误**
   - 在 Service Worker（background.js）中，`chrome.windows.getCurrent()` 无法获取当前窗口
   - Service Worker 是在后台运行的，没有"当前窗口"的概念

2. **缺少初始化配置**
   - 没有在扩展安装时配置 Side Panel 的行为
   - 缺少备用的打开方式

## 修复内容

### 1. 正确获取窗口ID

**修复前：**
```javascript
const currentWindow = await chrome.windows.getCurrent();
await chrome.sidePanel.open({ windowId: currentWindow.id });
```

**修复后：**
```javascript
// 从活动标签页获取窗口ID
const [currentTab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
const windowId = currentTab ? currentTab.windowId : null;

if (windowId) {
  await chrome.sidePanel.open({ windowId: windowId });
}
```

### 2. 添加初始化配置

```javascript
chrome.runtime.onInstalled.addListener(async () => {
  // 配置侧边栏行为：点击扩展图标不自动打开侧边栏
  await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: false });
});
```

### 3. 添加延迟和备用方案

```javascript
// 延迟100ms确保标签页创建完成
setTimeout(async () => {
  try {
    await chrome.sidePanel.open({ windowId: windowId });
  } catch (error) {
    // 如果失败，尝试备用方法
    await chrome.sidePanel.setOptions({
      path: 'sidebar.html',
      enabled: true
    });
    await chrome.sidePanel.open({ windowId: windowId });
  }
}, 100);
```

### 4. 移除重复的事件监听器

之前有两个 `chrome.runtime.onInstalled.addListener`，已合并为一个。

## 测试步骤

### 1. 重新加载扩展

1. 打开 `chrome://extensions/`
2. 找到 SearchHub
3. 点击刷新按钮 ↻
4. 确保扩展已启用

### 2. 测试自动打开侧边栏

1. **打开 SearchHub 主页**
   - 点击扩展图标或按 Alt+S

2. **执行搜索**
   - 选择 2-3 个搜索引擎（如 Google、Bing、Perplexity）
   - 输入搜索关键词（如"AI发展"）
   - 点击"Search"按钮

3. **验证结果**
   - ✅ 应该看到多个新标签页被创建
   - ✅ 标签页自动分组（带颜色和标题）
   - ✅ **侧边栏自动打开**（最重要！）
   - ✅ 侧边栏显示所有标签的垂直列表

### 3. 检查侧边栏内容

侧边栏应该显示：

```
┌─────────────────────────┐
│ Vertical Tabs  [↕] [↻] │
├─────────────────────────┤
│ 🔍 Latest: "AI发展"     │
├─────────────────────────┤
│ ▼ 🔵 AI发展              │
│   ├ 📄 Google            │
│   ├ 📄 Bing              │
│   └ 📄 Perplexity        │
└─────────────────────────┘
```

### 4. 测试其他搜索方式

**右键搜索：**
1. 在任意网页选中文字
2. 右键 → "Search with SearchHub"
3. 侧边栏应自动打开

**快捷键搜索：**
1. 选中文字
2. 按 Alt+Q
3. 侧边栏应自动打开

## 调试方法

如果侧边栏仍然没有自动打开，请检查：

### 1. 查看控制台日志

1. 打开 `chrome://extensions/`
2. 找到 SearchHub
3. 点击"Service Worker"查看后台日志
4. 应该看到：
   ```
   SearchHub installed
   Side panel behavior configured
   Sidebar opened successfully for window: [窗口ID]
   ```

### 2. 检查权限

确保 manifest.json 中有：
```json
"permissions": [
  "sidePanel",
  "tabs",
  "windows"
]
```

### 3. 手动打开侧边栏

如果自动打开失败，可以手动打开：
- 点击浏览器地址栏右侧的侧边栏图标
- 或右键点击扩展图标 → "Open side panel"

### 4. 检查浏览器版本

Side Panel API 需要 Chrome 114+ 或 Edge 114+
- 打开 `chrome://version/` 检查版本
- 如果版本太低，请升级浏览器

## 常见问题

### Q: 侧边栏还是没有自动打开？

**A:** 按以下步骤排查：

1. **重新加载扩展**
   ```
   chrome://extensions/ → 找到 SearchHub → 点击刷新 ↻
   ```

2. **检查控制台错误**
   ```
   chrome://extensions/ → SearchHub → Service Worker → 查看错误
   ```

3. **尝试手动打开一次**
   ```
   点击浏览器侧边栏图标 → 之后应该能自动打开
   ```

4. **重启浏览器**
   ```
   完全关闭并重新打开 Chrome
   ```

### Q: 显示 "Failed to open sidebar" 错误？

**A:** 可能是权限问题：

1. 卸载扩展
2. 重新加载扩展
3. 确保授予了所有权限

### Q: 其他标签页能看到，但搜索的标签页看不到？

**A:** 刷新侧边栏：
- 点击侧边栏右上角的刷新按钮 ↻

### Q: 能手动打开，但不能自动打开？

**A:** 检查设置：
1. 打开设置页面
2. 确保 "Show Sidebar" 选项已开启
3. 保存设置后重试

## 技术说明

### Side Panel API 工作原理

1. **注册侧边栏**
   ```json
   "side_panel": {
     "default_path": "sidebar.html"
   }
   ```

2. **配置行为**
   ```javascript
   chrome.sidePanel.setPanelBehavior({
     openPanelOnActionClick: false
   });
   ```

3. **打开侧边栏**
   ```javascript
   chrome.sidePanel.open({ windowId: windowId });
   ```

### 获取窗口ID的正确方法

在 Service Worker 中：
```javascript
// ❌ 错误 - Service Worker 没有当前窗口
const window = await chrome.windows.getCurrent();

// ✅ 正确 - 从活动标签页获取
const [tab] = await chrome.tabs.query({
  active: true,
  lastFocusedWindow: true
});
const windowId = tab.windowId;
```

## 成功标志

修复成功后，您应该体验到：

✅ 搜索后侧边栏**立即自动打开**
✅ 看到垂直标签页列表
✅ 看到搜索关键词显示在顶部
✅ 可以点击标签切换页面
✅ 可以展开/折叠分组
✅ 可以关闭标签
✅ 实时更新标签状态

## 对比 SeekAll

现在 SearchHub 的侧边栏功能应该和 SeekAll 一样好用：

| 功能 | SeekAll | SearchHub |
|------|---------|-----------|
| 自动打开 | ✅ | ✅ 已修复 |
| 垂直标签页 | ✅ | ✅ |
| 分组显示 | ✅ | ✅ |
| 实时更新 | ✅ | ✅ |
| 暗黑模式 | ❌ | ✅ 更好 |
| 显示未分组标签 | ❌ | ✅ 更好 |
| 显示域名 | ❌ | ✅ 更好 |

---

**如果仍有问题，请提供控制台的错误日志以便进一步诊断。** 🔧
