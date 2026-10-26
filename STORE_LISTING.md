# 1SO SearchHub — Chrome Web Store 上架文案（v1.3.3）

## v1.3.6 更新日志（What's new，商店后台粘贴）

**中文**
> 引擎表改为可远程更新：以后某个 AI 站点换域名或改搜索路径，不用等扩展发版就能修好。同时把内置的第二份引擎映射合并为单一数据源，消除「右键搜索/快捷键搜索」与主界面不同步的问题。

**English**
> The engine table can now be updated remotely: when an AI site changes its domain or URL pattern, it can be fixed without shipping a new extension version. Also merged the duplicated engine map into a single source of truth, so right-click / shortcut searches can no longer drift from the main panel.

**一句话版**：引擎表能远程更新了，某个 AI 换域名不用等发版。

---

## v1.3.5 更新日志（What's new，商店后台粘贴）

**中文**
> 修复在 360、QQ 等国产浏览器上的兼容问题：这些浏览器内核虽新但不实现标签分组/侧边栏接口，此前会导致「点了搜索没反应」。现在缺接口时自动降级——侧边栏改为独立小窗显示，分组能力缺失不影响正常打开结果。同时修复降级模式下侧边栏可能重复打开的问题。官网地址更新为 1so.u-claw.org.cn。

**English**
> Fixed compatibility with Chinese Chromium-shell browsers (360, QQ) that ship a recent engine but don't implement the tab-groups / side-panel APIs — previously a search could silently do nothing. Missing APIs now degrade gracefully: the side panel opens as a standalone window, and missing grouping no longer blocks results from opening. Also fixed a case where the fallback panel could open twice. Homepage updated to 1so.u-claw.org.cn.

**一句话版**：国产浏览器（360/QQ）不再「点了没反应」——缺侧边栏接口时自动降级成独立小窗。

---

> 引擎数以 `_store_assets/count-engines.js` 实测为准：**50 个**（9 分类，无重复，全部含有效搜索 URL）。
> 字数校验：标题 28/45 ✓ · 简短描述 63/132 ✓（英 42/45、124/132 ✓）
> 文案来源：pi 初稿 → 主会话按代码事实校验修正（5 组合、50 引擎均已核实）。

## 中文

### 标题（≤45字符）

1SO SearchHub 一搜：一次输入同时搜多个引擎

### 简短描述（≤132字符）

一次输入，同时在多个 AI 与搜索引擎打开结果。标签自动分组并带颜色标识，侧边栏垂直管理，50 个预设引擎，纯本地不收集数据。

### 详细描述

1SO SearchHub（一搜 AI 搜索）是一个「多引擎同时搜索」的 Chrome 扩展。在同一个输入框里敲一次关键词，选好要问的几个引擎，扩展会一次性把它们的结果页全部打开，并自动归进一个带颜色的标签组，右侧边栏同步显示这批标签——不用来回切标签、也不用把同一个问题复制粘贴好几遍。

适合需要横向对比答案的场景：同一个问题分别看看 AI 搜索、AI 对话、传统搜索、社交平台各怎么说。

【功能一览】

· 一次输入，多引擎出结果
  50 个预设引擎，分 9 类，勾选几个就同时打开几个：
  – AI 搜索：Perplexity、秘塔 Metaso、Genspark、Felo
  – AI 聊天：豆包、DeepSeek、Kimi、腾讯元宝、文心一言、通义千问、ChatGPT、Claude
  – 传统搜索：百度、Google、Bing
  – 社交媒体：小红书、抖音、微博、X、Reddit
  – 视频：YouTube、B站
  – 地图：高德地图、百度地图、腾讯地图
  – 开发者：GitHub、Stack Overflow
  – 购物：淘宝、京东、Amazon
  – 知识库：知乎、维基百科、百度百科

· 搜索结果自动分组
  每次搜索产生的标签会归入同一个标签组，并带颜色标识，标签栏不会一片空白分不清哪个是哪个。

· 侧边栏垂直标签管理
  搜索后自动打开浏览器侧边栏，以垂直列表展示本次结果，逐个查看、随时切换。

· 快捷组合，一键多搜
  内置 All AI / 国产 AI / 传统搜索 / 查查我自己 四组预设，点一下就按固定的一批引擎同时搜。也可以自己保存组合（最多 5 个）。

· 右键搜索选中文字
  在任何网页选中一段词，右键菜单直接搜，不用回到搜索框重新输入。

· 快捷键
  Alt+S 打开搜索面板；Alt+Q 直接搜索当前选中的文字。

· 自定义引擎
  把任意网站按自己的 URL 规则加进搜索列表。

· 界面
  中文 / English 双语界面；深色、浅色主题跟随系统自动切换。

【怎么用】

1. 安装后点击工具栏图标，或按 Alt+S 打开搜索面板。
2. 输入关键词，勾选想问的引擎（或直接点一个快捷组合），回车。
3. 结果标签自动成组，侧边栏同步列出，逐个对比即可。
4. 网页里读到不懂的词：选中 → 右键 → Search with 1SO SearchHub，或按 Alt+Q。
5. 设置页可添加自定义引擎、保存自己的组合、切换语言与主题。

【隐私】

纯本地运行：不收集、不存储、不上传任何个人数据，没有账号体系，无需注册登录。

【反馈与支持】

问题反馈与源码：https://github.com/dongsheng123132/SearchHub

### 截图文案（已叠入成品图）

| 截图 | 叠字 |
|---|---|
| 1 主界面 | 一次输入，多引擎出结果 |
| 2 侧边栏 | 侧边栏垂直管理结果标签 |
| 3 深色 | 深色模式 · 快捷键直达 |

## English

### Title (≤45 characters)

1SO SearchHub: Search Many Engines at Once

### Short description (≤132 characters)

Type one query and open results in several AI and search engines at the same time. Tabs group by color, side panel included.

### Full description

1SO SearchHub is a Chrome extension for searching several engines at once. Type a query once, tick the engines you want to ask, and it opens all of their result pages in a single action — grouped into one colored tab group and listed in the side panel, so you can compare answers instead of copy-pasting the same question into five different sites.

Useful whenever one source is not enough: check what an AI search engine, an AI chat assistant, a classic search engine, and a social platform each say about the same topic.

【 Features 】

· One query, many result pages
  50 preset engines in 9 categories — tick as many as you want:
  – AI Search: Perplexity, Metaso, Genspark, Felo
  – AI Chat: Doubao, DeepSeek, Kimi, Tencent Yuanbao, ERNIE Bot, Qwen, ChatGPT, Claude
  – Search Engines: Baidu, Google, Bing
  – Social Media: Xiaohongshu, Douyin, Weibo, X, Reddit
  – Video: YouTube, Bilibili
  – Maps: Amap, Baidu Maps, Tencent Maps
  – Developers: GitHub, Stack Overflow
  – Shopping: Taobao, JD.com, Amazon
  – Knowledge: Zhihu, Wikipedia, Baidu Baike

· Results grouped automatically
  Every tab from a search lands in one tab group with a color label, so a batch of results never dissolves into an anonymous row of favicons.

· Vertical tabs in the side panel
  The side panel opens automatically after a search and lists the new tabs vertically, ready to click through one by one.

· Quick combos
  Four built-in sets — All AI, Chinese AI, Traditional Search, Look Me Up — each fires a fixed batch of engines in one click. Save up to 5 of your own.

· Right-click a selection
  Select any text on any page and search it from the context menu, without going back to the search box.

· Keyboard shortcuts
  Alt+S opens the search panel; Alt+Q searches the current selection.

· Custom engines
  Add any website to the list with your own URL pattern.

· Interface
  Chinese / English UI. Dark and light theme follow your system setting.

【 How to use 】

1. After installing, click the toolbar icon or press Alt+S to open the panel.
2. Type a query, tick the engines (or pick a quick combo), press Enter.
3. Results arrive as one tab group and appear in the side panel — compare them there.
4. Hit an unfamiliar term while reading: select it, right-click, "Search with 1SO SearchHub", or press Alt+Q.
5. In Settings you can add custom engines, save your own combos, and switch language and theme.

【 Privacy 】

Runs entirely on your machine: no personal data is collected, stored, or uploaded, and there is no account or sign-in.

【 Support 】

Issues and source code: https://github.com/dongsheng123132/SearchHub

---

## 商店后台其他字段（提交时用）

- 类别：Productivity（工具）
- 语言：中文（简体）、English
- 官网：https://github.com/dongsheng123132/SearchHub
- 隐私政策 URL：仓库内 PRIVACY_POLICY.md（若后台要求独立 URL，用 GitHub 页面直链）
- 单一用途说明（Single purpose）：一次输入同时在多个搜索引擎打开结果，并对结果标签进行分组与侧边栏管理。

## 资产清单（_store_assets/final/）

| 文件 | 尺寸 | 用途 |
|---|---|---|
| screenshot-1-main-1280x800.png | 1280x800 | 截图1 主界面 |
| screenshot-2-sidebar-1280x800.png | 1280x800 | 截图2 侧边栏 |
| screenshot-3-dark-1280x800.png | 1280x800 | 截图3 深色+快捷键 |
| promo-small-440x280.png | 440x280 | Promo 小图 |
| marquee-1400x560.png | 1400x560 | Marquee 大图 |
