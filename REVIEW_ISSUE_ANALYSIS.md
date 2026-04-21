# 🔍 Chrome Web Store 审核问题分析

## ⚠️ 审核反馈

**问题：** "所有网站的权限" - 需要深入审核

**原因：** Chrome 认为 `content_scripts` 的 `<all_urls>` 属于"所有网站的权限"

## 🔍 对比分析

### SeekAll 的配置

```json
{
  "host_permissions": ["https://www.google.com/*"],  // 1 个域名
  "content_scripts": [{
    "matches": ["<all_urls>"]  // 也在所有网站注入
  }]
}
```

### SearchHub 的配置（当前）

```json
{
  "host_permissions": [],  // 0 个域名
  "content_scripts": [{
    "matches": ["<all_urls>"]  // 在所有网站注入
  }]
}
```

## 💡 问题分析

### 为什么 SeekAll 没有这个问题？

1. **已上架并通过审核**：获得信任标记
2. **有 1 个 host_permission**：看起来更"合理"
3. **审核策略变化**：新提交的扩展审核更严格

### 为什么我们的扩展需要深入审核？

1. **content_scripts 使用 `<all_urls>`**：Chrome 认为这是"所有网站的权限"
2. **host_permissions 为空**：可能让审核员觉得奇怪
3. **新提交**：审核更严格

## 🎯 解决方案

### 方案一：限制 content_scripts 的 matches（推荐）⭐

**如果跟进输入栏只在 AI 网站显示，可以限制 matches：**

```json
{
  "content_scripts": [{
    "matches": [
      "https://chat.openai.com/*",
      "https://claude.ai/*",
      "https://gemini.google.com/*",
      "https://chatglm.cn/*",
      "https://www.doubao.com/*",
      "https://yiyan.baidu.com/*",
      "https://tongyi.aliyun.com/*",
      "https://kimi.moonshot.cn/*",
      "https://www.perplexity.ai/*",
      "https://www.phind.com/*",
      "https://you.com/*",
      "https://thinkany.ai/*",
      "https://metaso.cn/*",
      "https://chat.deepseek.com/*"
    ],
    "js": ["content.js"],
    "css": ["content.css"]
  }]
}
```

**优点：**
- ✅ 权限更精确
- ✅ 审核更容易通过
- ✅ 符合 Chrome 的建议

**缺点：**
- ⚠️ 如果将来需要在其他网站显示跟进栏，需要更新

### 方案二：添加 1 个 host_permission（模仿 SeekAll）

```json
{
  "host_permissions": ["https://www.google.com/*"],
  "content_scripts": [{
    "matches": ["<all_urls>"]
  }]
}
```

**优点：**
- ✅ 配置看起来更"合理"
- ✅ 模仿 SeekAll 的策略

**缺点：**
- ⚠️ 实际上不需要 Google 的 host_permission
- ⚠️ 可能仍然需要深入审核

### 方案三：说明 content_scripts 的用途（在商店描述中）

在商店描述中明确说明：
- content_scripts 只在 AI 网站注入"跟进输入栏"
- 不收集任何数据
- 不监控浏览活动

**优点：**
- ✅ 不需要修改代码
- ✅ 向用户说明用途

**缺点：**
- ⚠️ 可能仍然需要深入审核
- ⚠️ 审核时间可能更长

## 🎯 推荐方案

### 方案一：限制 content_scripts matches（最推荐）⭐

**原因：**
1. 我们的 content.js 确实只在 AI 网站使用（跟进输入栏）
2. 限制 matches 更符合 Chrome 的建议
3. 审核更容易通过

**实施：**
- 将 `content_scripts.matches` 从 `<all_urls>` 改为具体的 AI 网站列表
- 功能不受影响（因为我们确实只在 AI 网站使用）

## 📋 检查 content.js 的使用

让我检查一下 content.js 是否真的需要在所有网站运行...

