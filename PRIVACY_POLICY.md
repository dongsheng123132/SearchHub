# Privacy Policy · 1SO SearchHub / 隐私政策

**Last updated / 最后更新：2026-10-24**
**Version 1.2.0**

---

## English

### Summary

1SO SearchHub is a single-purpose browser extension that opens the result pages of several search and AI engines for one query. **It does not collect, store, sell, or transmit any personal data.** There is no account system, no analytics, no tracking, and no server of our own.

### What the extension does with data

| Data | Handling |
|---|---|
| Search query | Used only to build the URLs of the engines you selected. Sent directly from your browser to those engines — never to us. The last query may be stored locally as a convenience. |
| Settings (theme, language, selected engines, custom combos, custom engines) | Stored with `chrome.storage.sync` / `chrome.storage.local` under your own browser profile. Synced only through your own browser account, not through us. |
| Selected text | Read only when you trigger a search on a selection (right-click menu or keyboard shortcut). Used immediately to build the search URL and not persisted. |
| Page elements on AI sites | On the AI sites listed in the manifest, the content script locates the question input box so it can pre-fill your query and show a follow-up bar. This happens entirely inside your browser. Page content is not read beyond locating the input box, not recorded, and not transmitted. |

### What the extension never does

- No account, no sign-in, no registration.
- No analytics, telemetry, crash reporting, or advertising SDK.
- No remote code: every script is packaged inside the extension bundle.
- No network requests to any server owned by us. The only outbound activity is opening engine pages at your request.

### Permissions and why they are needed

| Permission | Why |
|---|---|
| `activeTab` | Temporarily access the current tab after a user gesture (icon click / context menu) to read the selected text. |
| `tabs` | Create the result tabs, and let the side panel list tab titles and URLs. |
| `tabGroups` | Group the tabs produced by one search into a single colored tab group. |
| `sidePanel` | Show the vertical tab overview next to the page after a search. |
| `contextMenus` | Add the "Search with 1SO SearchHub" entry for selected text. |
| `storage` | Save your settings (theme, language, engines, combos) locally or via your browser sync. |
| `scripting` | Read the current selection when you press the search-selection shortcut. |
| `notifications` | Show a local system notification when a search completes or fails. |
| `system.display` | In optional side-by-side window mode, lay result windows out across your screen. |

The extension declares **no host permissions**. Content scripts run on a fixed, visible list of AI chat sites (declared in `manifest.json`) solely for the pre-fill and follow-up features described above.

### Children

The extension is not directed at children and collects no data from anyone.

### Changes

If this policy changes, the "Last updated" date above changes and the new version ships with the next extension release.

### Contact

- Email: hefangsheng@gmail.com
- Website: https://www.hequbing.com
- Issues: https://github.com/dongsheng123132/SearchHub

---

## 中文

### 一句话

1SO SearchHub 是一个单一用途的浏览器扩展：输入一次关键词，同时打开多个搜索与 AI 引擎的结果页。**不收集、不存储、不贩卖、不传输任何个人数据。** 没有账号体系，没有统计埋点，没有自己的服务器。

### 数据怎么处理

| 数据 | 处理方式 |
|---|---|
| 搜索关键词 | 只用于拼接你勾选引擎的 URL。由你的浏览器直接发往那些引擎，不经过我们。上次搜索词可能作为便利功能存在本地。 |
| 设置（主题、语言、已选引擎、快捷组合、自定义引擎） | 存在 `chrome.storage.sync` / `chrome.storage.local`，归属你自己的浏览器配置；若要跨设备同步，走的是你本人浏览器账号，不经过我们。 |
| 选中的文字 | 只有你主动触发「选中即搜」（右键菜单或快捷键）时才读取，且当场用于拼接搜索 URL，不做持久化。 |
| AI 站点上的页面元素 | 在清单里声明的 AI 聊天站点上，内容脚本会定位提问输入框，用于预填问题并显示追问条。全过程只发生在你的浏览器内：除定位输入框外不读取页面内容，不记录，不外传。 |

### 从不做的事

- 无账号、无登录、无注册。
- 无统计、无遥测、无崩溃上报、无广告 SDK。
- 无远程代码：所有脚本都打在扩展包内。
- 不向任何自有服务器发起网络请求；唯一的对外行为是按你的要求打开引擎页面。

### 权限与用途

| 权限 | 为什么需要 |
|---|---|
| `activeTab` | 在你点击图标或右键菜单后临时访问当前标签，用于读取选中文字。 |
| `tabs` | 创建结果标签；让侧边栏能列出标签标题与网址。 |
| `tabGroups` | 把一次搜索产生的标签归入同一个彩色标签组。 |
| `sidePanel` | 搜索后在页面旁边显示垂直标签总览。 |
| `contextMenus` | 为选中文字提供「Search with 1SO SearchHub」右键入口。 |
| `storage` | 保存你的设置（主题、语言、引擎、组合）到本地或浏览器同步。 |
| `scripting` | 你按「选中即搜」快捷键时读取当前选区。 |
| `notifications` | 搜索完成或失败时弹一条本地系统通知。 |
| `system.display` | 可选的并排窗口模式下，把结果窗口铺满屏幕。 |

本扩展**不声明任何主机权限（host permissions）**。内容脚本仅运行在 `manifest.json` 中公开列出的固定 AI 聊天站点清单上，且只用于上述预填与追问功能。

### 未成年人

本扩展不面向未成年人，也不从任何人处收集数据。

### 变更

本政策如有变更，会更新上方「最后更新」日期，并随下一版扩展一同发布。

### 联系方式

- 邮箱：hefangsheng@gmail.com
- 网站：https://www.hequbing.com
- 问题反馈：https://github.com/dongsheng123132/SearchHub
