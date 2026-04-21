# 🔒 权限说明 - 为什么 SearchHub 需要这些权限？

## 为什么会出现安全警告？

Chrome 显示安全警告是因为扩展声明了多个权限。这是**正常现象**，所有需要这些权限的扩展都会显示。

**SeekAll AI 没有警告的原因：**
1. 可能已经上架并通过审核，Chrome 对已审核扩展的警告较少
2. 可能使用了不同的权限策略（如 optional_permissions）
3. 可能权限列表更少

## SearchHub 的权限用途

### ✅ 必需的权限（无法移除）

| 权限 | 用途 | 为什么需要 |
|------|------|-----------|
| `activeTab` | 响应用户点击操作 | 当用户点击扩展图标或使用快捷键时，需要访问当前标签页 |
| `tabs` | 创建和管理标签页 | 打开多个搜索引擎标签页 |
| `tabGroups` | 分组标签页 | 将搜索结果标签页自动分组 |
| `sidePanel` | 显示侧边栏 | 显示垂直标签列表 |
| `windows` | 管理窗口 | 支持"在新窗口打开"功能 |
| `storage` | 保存用户设置 | 保存用户选择的引擎、组合等偏好设置 |
| `contextMenus` | 右键菜单 | 提供"搜索选中文本"功能 |
| `scripting` | 注入脚本 | 在AI聊天页面注入"继续对话"功能栏 |
| `notifications` | 显示通知 | 搜索完成时显示通知（可选功能） |
| `system.display` | 获取显示器信息 | 在新窗口打开时，选择合适的显示器位置 |

### 🌐 Host Permissions（域名权限）

**重要发现：** 打开标签页**不需要** `host_permissions`！

`host_permissions` 只在以下情况需要：
1. ✅ **Content Scripts** - 在特定网站注入脚本（我们已经有了）
2. ❌ **打开标签页** - 不需要权限（我们只是打开URL）

**当前配置：**
- Content Scripts 只在 AI 聊天网站注入（15个域名）
- 其他域名权限可以**移除**，因为只是打开标签页

## 优化建议

### 方案一：最小权限（推荐）

移除不必要的 `host_permissions`，只保留 content_scripts 需要的域名：

```json
"host_permissions": [
  // 只保留 content_scripts 需要的域名
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
]
```

**优点：**
- ✅ 权限最小化
- ✅ 审核更容易通过
- ✅ 用户更信任
- ✅ 功能完全正常（打开标签页不需要权限）

**缺点：**
- 无（功能不受影响）

### 方案二：保持当前配置

如果担心未来需要更多权限，可以保持当前配置，但需要：
1. ✅ 添加隐私政策链接到 manifest.json
2. ✅ 在商店描述中详细说明权限用途
3. ✅ 确保隐私政策已发布

## 如何减少警告？

即使优化了权限，Chrome 仍可能显示警告。这是**正常现象**，因为：
- Chrome 会警告所有需要 `tabs` 权限的扩展
- Chrome 会警告所有需要 `storage` 权限的扩展
- 这是 Chrome 的安全机制，不是错误

**减少警告的方法：**
1. ✅ 优化权限列表（移除不必要的）
2. ✅ 添加隐私政策链接
3. ✅ 在商店描述中说明权限用途
4. ✅ 通过 Chrome 审核后，警告会减少

## 下一步操作

1. **优化 manifest.json** - 移除不必要的 host_permissions
2. **添加隐私政策链接** - 在 manifest.json 中添加 `privacy_policy` 字段
3. **更新商店描述** - 说明权限用途

