# 侧边栏调试指南

## 🔍 立即调试步骤

### 第一步：查看调试日志

1. **打开扩展管理页面**
   ```
   地址栏输入：chrome://extensions/
   ```

2. **找到 SearchHub 扩展**

3. **点击 "Service Worker" 链接**
   - 会打开一个开发者工具窗口
   - 这是查看后台日志的地方

4. **执行搜索测试**
   - Alt+S 打开 SearchHub
   - 选择 2-3 个搜索引擎
   - 输入 "测试"
   - 点击 Search 按钮

5. **查看控制台输出**

   **应该看到以下日志：**
   ```
   🔍 Starting search with settings: {theme: 'auto', openMode: 'tab', ...}
   📍 Current tab: {id: 123, windowId: 1, ...}
   🪟 Target window ID: 1
   🚀 Attempting to open sidebar...
   ✓ SidePanel options set
   ✅ ✅ ✅ Sidebar opened successfully! Window: 1
   ```

   **如果看到错误：**
   ```
   ❌ Failed to open sidebar: Error: ...
   ```

### 第二步：根据日志判断问题

#### 情况A：看到 "✅ ✅ ✅ Sidebar opened successfully"

**说明：** 代码执行成功了，但侧边栏可能被隐藏

**解决方法：**
1. 点击浏览器**地址栏右侧**的侧边栏图标（看起来像一个带竖线的矩形）
2. 或者右键点击 SearchHub 图标 → "Open side panel"
3. 侧边栏可能已经打开但被收起了

#### 情况B：看到 "❌ Failed to open sidebar"

**说明：** API 调用失败

**可能的错误信息和解决方法：**

1. **"Cannot read properties of undefined"**
   - 权限问题
   - 检查 manifest.json 中是否有 "sidePanel" 权限

2. **"Extension does not have a side panel"**
   - 侧边栏未注册
   - 检查 manifest.json 中是否有 side_panel 配置

3. **"Invalid windowId"**
   - 窗口ID获取失败
   - 需要从不同位置获取窗口ID

#### 情况C：看不到任何日志

**说明：** 代码根本没有执行

**检查：**
1. 扩展是否正确加载？
2. 是否点击了 Search 按钮？
3. 是否选择了搜索引擎？

### 第三步：手动测试 Side Panel API

在 Service Worker 控制台中，直接运行以下代码：

```javascript
// 测试1: 查看当前标签
chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
  console.log('当前标签:', tabs[0]);
  console.log('窗口ID:', tabs[0].windowId);
});

// 测试2: 尝试打开侧边栏
chrome.tabs.query({active: true, currentWindow: true}, async (tabs) => {
  const windowId = tabs[0].windowId;
  console.log('尝试打开窗口', windowId, '的侧边栏');

  try {
    await chrome.sidePanel.setOptions({enabled: true});
    await chrome.sidePanel.open({windowId: windowId});
    console.log('✅ 成功！');
  } catch (error) {
    console.error('❌ 失败:', error);
  }
});
```

### 第四步：检查浏览器版本

Side Panel API 需要：
- Chrome 114+ 或 Edge 114+

**检查版本：**
```
地址栏输入：chrome://version/
```

如果版本低于 114，请升级浏览器。

### 第五步：检查扩展权限

打开 `manifest.json`，确保包含：

```json
{
  "permissions": [
    "sidePanel",
    "tabs",
    "windows"
  ],
  "side_panel": {
    "default_path": "sidebar.html"
  }
}
```

## 🔧 常见问题和解决方案

### Q1: 日志显示成功，但侧边栏没打开

**解决：**
1. 查看浏览器窗口**右侧边缘**，侧边栏可能已经打开但很窄
2. 点击地址栏右侧的侧边栏图标
3. 拖动侧边栏边缘调整宽度

### Q2: 错误 "Extension does not have a side panel"

**解决：**
1. 重新加载扩展（chrome://extensions/ → 刷新）
2. 检查 sidebar.html 文件是否存在
3. 检查 manifest.json 中的 side_panel 配置

### Q3: 错误 "Cannot access chrome.sidePanel"

**解决：**
1. 检查 manifest.json 是否包含 "sidePanel" 权限
2. 确保是 Manifest V3
3. 重新加载扩展

### Q4: 有时候能打开，有时候不能

**解决：**
1. 可能是窗口焦点问题
2. 在搜索前确保 SearchHub 所在窗口是激活的
3. 不要在创建标签的过程中切换窗口

### Q5: 侧边栏是空白的

**解决：**
1. 打开 sidebar.html 的开发者工具
   - 右键点击侧边栏 → 检查
2. 查看控制台是否有 JavaScript 错误
3. 检查 sidebar.js 是否正确加载

## 📊 完整测试流程

1. ✅ 重新加载扩展
2. ✅ 打开 Service Worker 控制台
3. ✅ 执行搜索
4. ✅ 查看日志
5. ✅ 检查侧边栏是否打开
6. ✅ 如果有错误，按照上述方法解决

## 🎯 期望的正常流程

```
用户点击 Search
↓
🔍 Starting search with settings...
↓
📍 Current tab: {...}
↓
🪟 Target window ID: 1
↓
🚀 Attempting to open sidebar...
↓
✓ SidePanel options set
↓
✅ ✅ ✅ Sidebar opened successfully!
↓
侧边栏在右侧打开，显示垂直标签页
```

## 💡 快速修复建议

如果所有方法都不行，尝试：

1. **完全卸载并重新安装**
   ```
   chrome://extensions/ → 移除 → 重新加载
   ```

2. **清除浏览器缓存**
   ```
   Ctrl+Shift+Delete → 清除缓存
   ```

3. **重启浏览器**
   ```
   完全关闭 Chrome 后重新打开
   ```

4. **使用新的浏览器配置文件测试**
   ```
   Chrome 设置 → 用户 → 添加新用户
   ```

---

**请按照上述步骤操作，并告诉我您看到了什么日志输出，我会帮您解决！** 🔧
