# 隐私政策设置指南

## 📋 关于 homepage_url 和 privacy_policy

### homepage_url
- **是否必须**：不是必须的，但**强烈建议**提供
- **用途**：指向扩展的官方网站或 GitHub 仓库
- **您的设置**：`https://www.hequbing.com` ✅

### privacy_policy
- **是否必须**：如果扩展需要某些权限（如 tabs、storage 等），**必须提供**
- **用途**：指向隐私政策页面
- **您的设置**：`https://www.hequbing.com/privacy-policy` ✅

## 🌐 部署隐私政策

### 方案一：部署到您的网站（推荐）⭐

1. **上传文件到网站**：
   - 将 `PRIVACY_POLICY.md` 转换为 HTML 或直接作为页面
   - 将 `PRIVACY_POLICY_ZH.md` 转换为 HTML 或直接作为页面
   - 上传到 `https://www.hequbing.com/privacy-policy`（英文版）
   - 上传到 `https://www.hequbing.com/privacy-policy-zh`（中文版，可选）

2. **或者创建统一页面**：
   - 创建一个页面，根据用户语言自动切换中英文
   - URL: `https://www.hequbing.com/privacy-policy`

### 方案二：GitHub Gist（备选）

如果暂时无法部署到网站，可以使用 GitHub Gist：

1. **创建 Gist**：
   - 访问 https://gist.github.com/
   - 创建新的 Gist
   - 粘贴 `PRIVACY_POLICY.md` 的内容
   - 设置为公开
   - 复制 URL

2. **更新 manifest.json**：
   ```json
   "privacy_policy": "https://gist.github.com/yourusername/your-gist-id"
   ```

## 📝 文件说明

### 已创建的文件

1. **PRIVACY_POLICY.md** - 英文版隐私政策（简洁版）
2. **PRIVACY_POLICY_ZH.md** - 中文版隐私政策（简洁版）

### 内容特点

- ✅ 简洁明了
- ✅ 符合 Chrome Web Store 要求
- ✅ 中英文版本统一
- ✅ 包含所有必要信息

## ✅ 当前配置

```json
{
  "homepage_url": "https://www.hequbing.com",
  "privacy_policy": "https://www.hequbing.com/privacy-policy"
}
```

## 🚀 下一步操作

1. **部署隐私政策到网站**：
   - 将隐私政策页面部署到 `https://www.hequbing.com/privacy-policy`
   - 确保页面可以正常访问

2. **测试链接**：
   - 在浏览器中打开 `https://www.hequbing.com/privacy-policy`
   - 确认页面正常显示

3. **提交到 Chrome Web Store**：
   - 在商店提交时，确保隐私政策链接可访问
   - Chrome 会验证链接的有效性

## 📌 注意事项

- ✅ `homepage_url` 可以使用您的网站（`www.hequbing.com`）
- ✅ `privacy_policy` 必须指向可公开访问的页面
- ✅ 隐私政策页面必须包含所有必要信息
- ✅ 建议提供中英文版本（可选，但推荐）

## 🔗 相关链接

- Chrome Web Store 隐私政策要求：https://developer.chrome.com/docs/webstore/user-data/
- 隐私政策最佳实践：https://developer.chrome.com/docs/webstore/user-data/#privacy

