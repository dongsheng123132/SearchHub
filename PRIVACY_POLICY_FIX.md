# 隐私政策链接修复指南

## 🔍 问题分析

您使用的链接：
```
https://gist.github.com/dongsheng123132/75582dd825c12bba46d9c77aab4a7a6a
```

这个链接格式是**正确的**，但可能遇到以下问题：

### 可能的问题

1. **Gist 未设置为公开**
   - Gist 必须是公开的（Public），不是私有的（Secret）
   - 检查方法：在 Gist 页面右上角，确保显示 "Public"

2. **链接格式问题**
   - Chrome Web Store 需要的是**查看页面**，不是 raw 链接
   - 正确格式：`https://gist.github.com/username/gist-id`
   - 您的格式：✅ 正确

3. **内容格式问题**
   - Gist 中的内容应该是 Markdown 或纯文本
   - Chrome 会自动渲染 Markdown

## ✅ 正确的设置步骤

### 步骤 1：创建/更新 Gist

1. 访问 https://gist.github.com/
2. 登录您的 GitHub 账号
3. 创建新的 Gist 或编辑现有的 Gist
4. **确保设置为 Public**（不是 Secret）
5. 文件名：`privacy-policy.md` 或 `PRIVACY_POLICY.md`
6. 内容：粘贴 `PRIVACY_POLICY.md` 的内容
7. 点击 "Create public gist" 或 "Update public gist"

### 步骤 2：获取正确的链接

**查看页面链接**（用于 manifest.json）：
```
https://gist.github.com/dongsheng123132/75582dd825c12bba46d9c77aab4a7a6a
```

**Raw 链接**（用于测试，不是用于 manifest.json）：
```
https://gist.githubusercontent.com/dongsheng123132/75582dd825c12bba46d9c77aab4a7a6a/raw/privacy-policy.md
```

### 步骤 3：验证链接

1. **在浏览器中打开**：
   ```
   https://gist.github.com/dongsheng123132/75582dd825c12bba46d9c77aab4a7a6a
   ```

2. **检查要点**：
   - ✅ 页面可以正常打开
   - ✅ 不需要登录就能查看
   - ✅ 显示 "Public" 标签
   - ✅ 内容正确显示

### 步骤 4：更新 manifest.json

```json
{
  "privacy_policy": "https://gist.github.com/dongsheng123132/75582dd825c12bba46d9c77aab4a7a6a"
}
```

## ⚠️ 常见错误

### 错误 1：使用 .js 链接
```json
// ❌ 错误
"privacy_policy": "https://gist.github.com/.../gist-id.js"

// ✅ 正确
"privacy_policy": "https://gist.github.com/.../gist-id"
```

### 错误 2：使用 raw 链接
```json
// ❌ 错误（虽然可以工作，但不是最佳实践）
"privacy_policy": "https://gist.githubusercontent.com/.../raw/..."

// ✅ 正确
"privacy_policy": "https://gist.github.com/.../gist-id"
```

### 错误 3：Gist 是私有的
- 如果 Gist 是 Secret，Chrome Web Store 无法访问
- 必须设置为 Public

## 🔧 如果仍然报错

### 检查清单

1. ✅ Gist 是公开的（Public）
2. ✅ 链接格式正确（不带 .js）
3. ✅ 链接可以在浏览器中正常打开
4. ✅ 内容格式正确（Markdown 或纯文本）
5. ✅ manifest.json 格式正确（JSON 语法）

### 测试方法

1. **在浏览器中测试**：
   - 打开隐私窗口（Ctrl+Shift+N）
   - 访问 Gist 链接
   - 确认可以正常查看

2. **检查 Gist 设置**：
   - 登录 GitHub
   - 打开 Gist
   - 确认右上角显示 "Public"

3. **验证 manifest.json**：
   ```json
   {
     "privacy_policy": "https://gist.github.com/dongsheng123132/75582dd825c12bba46d9c77aab4a7a6a"
   }
   ```

## 📝 推荐的隐私政策内容

确保 Gist 中包含以下内容：

```markdown
# Privacy Policy for SearchHub

**Last updated: November 27, 2025**

## Overview

SearchHub is a single-purpose multi-engine search tool. It does not collect, store, sell, or transmit personal data.

## Data Processing

- No account registration required
- No tracking
- No analytics

Settings are stored locally or via chrome.storage.sync (theme, selected engines, combos, last query).

Selected text is only used to perform user-initiated searches and is not persisted or sent to any server.

## Permissions

| Permission | Purpose |
|-----------|---------|
| tabs, tabGroups | Open and organize result tabs |
| sidePanel | Display vertical tab overview |
| contextMenus, activeTab, scripting | Run searches based on user gestures |
| notifications | Display local guidance information |
| system.display | Optional window layout |
| host_permissions (<all_urls>) | Open result pages across engines/domains |

## Security

- No remote code: All scripts are packaged in the extension bundle
- No external data transmission

## Contact

- Support Email: hefangsheng@gmail.com
- Website: https://www.hequbing.com

**Effective Date:** November 27, 2025
**Version:** 1.1.0
```

## 🎯 最终检查

在提交到 Chrome Web Store 之前，确保：

1. ✅ manifest.json 中的链接格式正确
2. ✅ Gist 是公开的
3. ✅ 链接可以在浏览器中正常访问
4. ✅ 内容完整且格式正确

如果所有检查都通过，但仍然报错，可能是 Chrome Web Store 的临时问题，可以稍后重试。

