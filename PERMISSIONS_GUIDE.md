# SearchHub 权限优化指南

## 问题说明

您的SearchHub扩展由于使用了`"<all_urls>"`权限被Chrome商店标记为需要深入审核。这是因为该权限过于宽泛，可能带来安全风险。

## 解决方案

### 方案一：推荐 - 使用activeTab + 具体域名权限

这是Chrome官方推荐的方案，既保证功能完整又符合安全要求：

**优点：**
- ✅ 快速通过审核
- ✅ 用户隐私更好
- ✅ 权限明确透明
- ✅ 功能完全正常

**配置文件：** `manifest.json`（已更新）

### 方案二：最小权限方案

只保留核心搜索功能，移除不必要的权限：

**优点：**
- ✅ 审核速度最快
- ✅ 权限最小化
- ⚠️ 部分功能可能受限

**配置文件：** `manifest_minimal.json`

## 权限优化详情

### 1. 移除`<all_urls>`权限
```json
// 旧版本（问题）
"host_permissions": ["<all_urls>"]

// 新版本（推荐）
"host_permissions": [
  "https://*.google.com/*",
  "https://*.bing.com/*",
  "https://*.baidu.com/*",
  // ... 只包含实际使用的域名
]
```

### 2. 保留activeTab权限
```json
"permissions": [
  "activeTab",  // ✅ 重要：响应用户操作
  // ... 其他必要权限
]
```

### 3. 精确匹配content_scripts
```json
"content_scripts": [{
  "matches": [
    "https://*.google.com/*",
    "https://*.bing.com/*",
    // ... 只在需要的域名注入
  ],
  "js": ["content.js"],
  "css": ["content.css"]
}]
```

## 功能权限对应表

| 功能 | 需要的权限 | 是否包含 |
|------|------------|----------|
| 传统搜索 | `google.com`, `bing.com`, `baidu.com` 等 | ✅ |
| AI搜索 | `perplexity.ai`, `phind.com`, `you.com` 等 | ✅ |
| AI对话 | `chat.openai.com`, `claude.ai`, `gemini.google.com` 等 | ✅ |
| 社交媒体 | `x.com`, `reddit.com`, `youtube.com` 等 | ✅ |
| 开发者 | `github.com`, `stackoverflow.com`, `mdn` 等 | ✅ |
| 购物 | `amazon.com`, `taobao.com`, `jd.com` 等 | ✅ |
| 知识 | `wikipedia.org`, `zhihu.com`, `baike.baidu.com` 等 | ✅ |

## 审核建议

### 1. 使用更新后的manifest.json
```bash
# 备份原文件
cp manifest.json manifest_original.json

# 使用优化版本
cp manifest_optimized.json manifest.json
```

### 2. 重新提交审核
- 在Chrome开发者控制台更新扩展
- 重新提交审核
- 在审核说明中说明权限优化

### 3. 添加权限说明
在扩展描述中明确说明：
- "此扩展仅在您明确选择搜索引擎时访问相应网站"
- "使用activeTab权限确保用户控制"
- "不会收集用户个人信息"

## 测试验证

安装优化版本后验证：
1. ✅ 所有搜索引擎正常打开
2. ✅ 右键菜单搜索正常
3. ✅ 快捷键搜索正常
4. ✅ 标签页分组正常
5. ✅ 侧边栏功能正常

## 常见问题

**Q: 为什么需要这么多域名权限？**
A: 支持多引擎搜索需要访问各个搜索引擎网站，但都是明确指定的具体域名。

**Q: 能否进一步减少权限？**
A: 可以只保留最常用的搜索引擎，但会限制部分功能。

**Q: activeTab权限的作用？**
A: 允许扩展在用户主动操作时访问当前页面，是Chrome推荐的安全做法。

**Q: 审核时间会缩短多少？**
A: 通常从2-3周缩短到3-7天，具体取决于审核队列。

## 下一步

1. 使用优化后的manifest.json重新提交
2. 在商店描述中添加权限说明
3. 准备功能测试视频
4. 耐心等待审核结果

这样优化后，您的扩展应该能够快速通过审核，同时保持所有核心功能正常工作。