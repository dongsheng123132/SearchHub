# ✅ 权限问题修复

## 🔍 问题分析

**Chrome 审核反馈：**
> "所有网站的权限" - 需要深入审核

**原因：**
- `content_scripts` 使用 `<all_urls>` 被 Chrome 视为"所有网站的权限"
- 即使 `host_permissions` 为空，`content_scripts` 的 `<all_urls>` 也会触发深入审核

## ✅ 解决方案

### 限制 content_scripts 的 matches

**修改前：**
```json
{
  "content_scripts": [{
    "matches": ["<all_urls>"]
  }]
}
```

**修改后：**
```json
{
  "content_scripts": [{
    "matches": [
      "https://chat.openai.com/*",
      "https://claude.ai/*",
      "https://gemini.google.com/*",
      // ... 其他 AI 网站
    ]
  }]
}
```

## 📋 包含的 AI 网站

- ChatGPT: `https://chat.openai.com/*`
- Claude: `https://claude.ai/*`
- Gemini: `https://gemini.google.com/*`
- ChatGLM: `https://chatglm.cn/*`, `https://z.ai/*`
- 豆包: `https://www.doubao.com/*`
- 文心一言: `https://yiyan.baidu.com/*`
- 通义千问: `https://tongyi.aliyun.com/*`
- Kimi: `https://kimi.moonshot.cn/*`
- Perplexity: `https://www.perplexity.ai/*`
- Phind: `https://www.phind.com/*`
- You.com: `https://you.com/*`
- ThinkAny: `https://thinkany.ai/*`
- Metaso: `https://metaso.cn/*`
- DeepSeek: `https://chat.deepseek.com/*`
- 元宝: `https://yuanbao.tencent.com/*`

## ✅ 优点

1. **权限更精确**：只请求需要的网站权限
2. **符合 Chrome 建议**：使用具体域名而非 `<all_urls>`
3. **审核更容易通过**：减少深入审核的可能性
4. **功能不受影响**：因为我们确实只在 AI 网站使用 content script

## 📝 注意事项

- 如果将来需要在其他网站显示跟进栏，需要更新 `matches` 列表
- 新版本已重新打包：`SearchHub-v1.1.0.zip`

## 🚀 下一步

1. ✅ 已修改 `manifest.json`
2. ✅ 已重新打包 ZIP 文件
3. ⏭️ 上传新版本到 Chrome Web Store
4. ⏭️ 提交审核

