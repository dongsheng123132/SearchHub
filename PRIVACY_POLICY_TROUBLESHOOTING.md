# 隐私政策链接问题排查

## 🔍 您当前的配置

```json
{
  "privacy_policy": "https://gist.github.com/dongsheng123132/75582dd825c12bba46d9c77aab4a7a6a"
}
```

## ⚠️ 可能的问题

### 1. Gist 未设置为公开

**检查方法：**
1. 访问：https://gist.github.com/dongsheng123132/75582dd825c12bba46d9c77aab4a7a6a
2. 查看右上角是否显示 **"Public"** 标签
3. 如果显示 "Secret"，需要改为公开

**解决方法：**
1. 登录 GitHub
2. 打开您的 Gist
3. 点击右上角的 "Edit" 或设置
4. 确保选择 "Create public gist" 或 "Make public"

### 2. 链接格式问题

**正确的格式：**
```json
// ✅ 正确 - 不带 .js
"privacy_policy": "https://gist.github.com/dongsheng123132/75582dd825c12bba46d9c77aab4a7a6a"
```

**错误的格式：**
```json
// ❌ 错误 - 不要使用 .js 链接
"privacy_policy": "https://gist.github.com/dongsheng123132/75582dd825c12bba46d9c77aab4a7a6a.js"

// ❌ 错误 - 不要使用 raw 链接
"privacy_policy": "https://gist.githubusercontent.com/..."
```

### 3. Chrome Web Store 验证问题

Chrome Web Store 在验证时会：
1. 检查链接是否可以访问
2. 检查内容是否包含隐私政策相关信息
3. 检查链接是否返回 200 状态码

## ✅ 解决步骤

### 步骤 1：验证 Gist 可访问性

1. **在浏览器中打开**（使用隐私窗口）：
   ```
   https://gist.github.com/dongsheng123132/75582dd825c12bba46d9c77aab4a7a6a
   ```

2. **检查要点：**
   - ✅ 页面可以正常打开
   - ✅ 不需要登录就能查看
   - ✅ 显示 "Public" 标签
   - ✅ 内容正确显示

### 步骤 2：确保 Gist 内容正确

Gist 中应该包含完整的隐私政策内容，建议使用 `PRIVACY_POLICY.md` 的内容。

### 步骤 3：检查 manifest.json 格式

确保 JSON 格式正确：
```json
{
  "manifest_version": 3,
  "name": "__MSG_extName__",
  "version": "1.1.0",
  "privacy_policy": "https://gist.github.com/dongsheng123132/75582dd825c12bba46d9c77aab4a7a6a"
}
```

### 步骤 4：测试链接

使用以下方法测试：

1. **浏览器测试**：
   - 打开隐私窗口（Ctrl+Shift+N）
   - 访问 Gist 链接
   - 确认可以正常查看

2. **Chrome 扩展测试**：
   - 加载扩展
   - 检查是否报错

## 🔧 如果仍然报错

### 备选方案 1：使用 Raw 链接（不推荐，但可以工作）

如果 Gist 查看页面有问题，可以尝试 raw 链接：

```json
"privacy_policy": "https://gist.githubusercontent.com/dongsheng123132/75582dd825c12bba46d9c77aab4a7a6a/raw/privacy-policy.md"
```

**注意：** 需要知道确切的文件名。

### 备选方案 2：部署到您的网站（推荐）

如果 Gist 一直有问题，建议部署到您的网站：

1. 将 `PRIVACY_POLICY.md` 转换为 HTML
2. 上传到 `https://www.hequbing.com/privacy-policy`
3. 更新 manifest.json：
   ```json
   "privacy_policy": "https://www.hequbing.com/privacy-policy"
   ```

### 备选方案 3：创建新的 Gist

如果当前 Gist 有问题，可以创建新的：

1. 访问 https://gist.github.com/
2. 创建新的 Gist
3. **确保选择 "Create public gist"**
4. 文件名：`privacy-policy.md`
5. 内容：粘贴 `PRIVACY_POLICY.md` 的内容
6. 保存后复制新的链接

## 📋 检查清单

在提交到 Chrome Web Store 之前，确保：

- [ ] Gist 是公开的（Public）
- [ ] 链接格式正确（不带 .js）
- [ ] 链接可以在浏览器中正常访问（不需要登录）
- [ ] 内容完整且格式正确
- [ ] manifest.json JSON 格式正确
- [ ] 没有语法错误

## 🎯 快速测试

运行以下测试：

1. **测试链接可访问性**：
   - 在浏览器中打开：https://gist.github.com/dongsheng123132/75582dd825c12bba46d9c77aab4a7a6a
   - 确认可以正常查看

2. **测试 manifest.json**：
   - 使用 JSON 验证器检查格式
   - 确认没有语法错误

3. **测试扩展加载**：
   - 在 Chrome 中加载扩展
   - 检查控制台是否有错误

## 💡 常见错误信息

### 错误 1：无法访问隐私政策
**原因：** Gist 不是公开的或链接错误
**解决：** 确保 Gist 是 Public，链接格式正确

### 错误 2：JSON 格式错误
**原因：** manifest.json 格式不正确
**解决：** 检查 JSON 语法，确保所有引号、逗号正确

### 错误 3：隐私政策内容不完整
**原因：** Gist 内容不符合要求
**解决：** 确保包含完整的隐私政策内容

## 📞 如果问题仍然存在

如果所有检查都通过但仍然报错，可能是：
1. Chrome Web Store 的临时问题（稍后重试）
2. Gist 访问限制（尝试部署到网站）
3. 需要等待 Gist 完全公开（可能需要几分钟）

建议：如果 Gist 一直有问题，最好部署到您的网站 `www.hequbing.com`。

