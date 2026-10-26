# 🔍 1SO SearchHub（一搜 AI 搜索）

> **第一 AI 搜索，一搜打开多个 AI + 搜索引擎 | Search once, get results from all engines at once**

[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/lojjckopababijcnckabcilfkbgajnbo?label=Chrome%20Web%20Store)](https://chromewebstore.google.com/detail/ai-search-hub/lojjckopababijcnckabcilfkbgajnbo)
[![官网](https://img.shields.io/badge/%E5%AE%98%E7%BD%91-1so.u--claw.org.cn-0f766e)](https://1so.u-claw.org.cn)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[中文](#中文) | [English](#english)

---

<a id="中文"></a>

## 中文

### 这是什么

1SO SearchHub（一搜 AI 搜索）是一个浏览器扩展，让你**一次输入，同时在多个 AI 与搜索引擎打开结果**：结果自动归进一个彩色标签组，右侧侧栏按垂直列表管着。50 个预设引擎，分 9 类。

![主界面：一个搜索框 + 50 个引擎，勾谁就问谁](docs/screenshots/01-main.png)

![侧边栏：本次结果按垂直列表排好，带分组和颜色](docs/screenshots/03-sidebar.png)

当前版本 **v1.3.6**：引擎表改为**可远程更新**——AI 站点换域名很频繁（半年一次），扩展启动时会从官网拉取最新引擎表，改一条 URL 不需要等商店审核。v1.3.5 修掉了「在 360 / QQ 等国产浏览器上点了没反应」——这些浏览器内核不实现标签分组/侧边栏接口，现在缺接口时自动降级（侧栏改成独立小窗），不再整条链断掉。

### 安装

**方式一：官网（国内可直接访问）**

👉 https://1so.u-claw.org.cn —— 会按你的浏览器给对应的安装入口，也提供免安装的网页版。

**方式二：Chrome 应用商店**

[👉 点击安装 1SO SearchHub](https://chromewebstore.google.com/detail/ai-search-hub/lojjckopababijcnckabcilfkbgajnbo)

**方式三：本地开发安装**

```bash
git clone https://github.com/dongsheng123132/SearchHub.git
```

1. 打开 `chrome://extensions/`
2. 开启右上角「开发者模式」
3. 点击「加载已解压的扩展程序」
4. 选择克隆下来的 `SearchHub` 文件夹

### 主要功能

- **50+ 预设引擎** — AI 搜索、AI 聊天、百度/Google/Bing、社交媒体、B站、地图、购物等
- **智能标签分组** — 搜索结果自动归组，颜色标识，一目了然
- **快捷组合** — 预设「All AI」「国产 AI」「传统搜索」「查查我自己」组合，一键多搜
- **侧边栏管理** — 搜索后自动打开侧边栏，垂直标签页管理
- **右键搜索** — 选中文字 → 右键「Search with 1SO SearchHub」
- **快捷键** — `Alt+S` 打开 · `Alt+Q` 搜索选中文字
- **自定义引擎** — 添加任意网站到搜索列表
- **中英文界面** — 支持语言切换
- **深色/浅色模式** — 跟随系统自动切换

### 支持的引擎分类

| 分类 | 引擎示例 |
|------|---------|
| 🤖 AI Search | Perplexity · 秘塔 · Genspark · Felo · You.com · Exa |
| 💬 AI Chat | 豆包 · DeepSeek · Kimi · 腾讯元宝 · 文心 · 通义 · 海螺 · 星火 |
| 🔍 传统搜索 | 百度 · Google · Bing · 搜狗 · DuckDuckGo |
| 📱 社交媒体 | 小红书 · 抖音 · 微博 · Twitter/X · Reddit |
| 🎥 视频 | YouTube · B站 · 西瓜视频 |
| 🗺️ 地图 | 高德地图 · 百度地图 · 腾讯地图 |
| 👨‍💻 开发者 | GitHub · Stack Overflow |
| 🛒 购物 | Amazon · 淘宝 · 京东 · 拼多多 |
| 📚 知识库 | 维基百科 · 知乎 · 百度百科 |

### 联系 & 合作

- 微信: hecare888
- Telegram: [@dsds8848](https://t.me/dsds8848)
- Twitter/X: [@Bitplus888](https://x.com/Bitplus888)
- Email: [hefangsheng@gmail.com](mailto:hefangsheng@gmail.com)
- GitHub: [@dongsheng123132](https://github.com/dongsheng123132)

---

<a id="english"></a>

## English

### What is this

1SO SearchHub is a browser extension that lets you **search once and open results across multiple AI and search engines simultaneously**: results land in one colored tab group, and the side panel lists them vertically. 50 preset engines in 9 categories.

![Main panel: one search box, 50 engines, tick the ones you want](docs/screenshots/01-main.png)

![Side panel: this search's results listed vertically, grouped and colored](docs/screenshots/03-sidebar.png)

Current version **v1.3.6** makes the engine table **remotely updatable** — AI sites move domains about twice a year, so the extension pulls the latest table at startup; fixing a URL no longer needs a store review. v1.3.5 fixed "click search, nothing happens" on Chinese Chromium-shell browsers (360, QQ) that don't implement the tab-groups / side-panel APIs — missing APIs now degrade gracefully instead of breaking the whole chain.

### Install

**Option 1: Official site (reachable from mainland China)**

👉 https://1so.u-claw.org.cn — it detects your browser and offers the matching install path, plus a no-install web version.

**Option 2: Chrome Web Store**

[👉 Install 1SO SearchHub](https://chromewebstore.google.com/detail/ai-search-hub/lojjckopababijcnckabcilfkbgajnbo)

**Option 3: Local development**

```bash
git clone https://github.com/dongsheng123132/SearchHub.git
```

1. Open `chrome://extensions/`
2. Enable **Developer mode** (top right)
3. Click **Load unpacked**
4. Select the cloned `SearchHub` folder

### Features

- **50+ preset engines** — AI search, AI chat, Baidu/Google/Bing, social media, maps, shopping, and more
- **Smart tab grouping** — Results auto-grouped with color labels
- **Quick combos** — Preset "All AI", "CN AI", "Traditional", and "Check Myself" combos for one-click multi-search
- **Sidebar manager** — Auto-opens after search for vertical tab management
- **Right-click search** — Select text → right-click → "Search with 1SO SearchHub"
- **Keyboard shortcuts** — `Alt+S` to open · `Alt+Q` to search selected text
- **Custom engines** — Add any website to your search list
- **Dark / Light mode** — Auto-follows system theme
- **i18n** — English & Chinese interface

### Engine Categories

| Category | Examples |
|----------|---------|
| 🤖 AI Search | Perplexity · Metaso · Genspark · Felo · You.com · Exa |
| 💬 AI Chat | Doubao · DeepSeek · Kimi · Yuanbao · Wenxin · Tongyi · ChatGPT · Claude |
| 🔍 Traditional | Baidu · Google · Bing · Sogou · DuckDuckGo |
| 📱 Social | Xiaohongshu · Douyin · Weibo · Twitter/X · Reddit |
| 🎥 Video | YouTube · Bilibili · Xigua |
| 🗺️ Maps | Amap · Baidu Maps · Tencent Maps |
| 👨‍💻 Developer | GitHub · Stack Overflow |
| 🛒 Shopping | Amazon · Taobao · JD · Pinduoduo |
| 📚 Knowledge | Wikipedia · Zhihu · Baidu Baike |

### Contact & Collaboration

- WeChat: hecare888
- Telegram: [@dsds8848](https://t.me/dsds8848)
- Twitter/X: [@Bitplus888](https://x.com/Bitplus888)
- Email: [hefangsheng@gmail.com](mailto:hefangsheng@gmail.com)
- GitHub: [@dongsheng123132](https://github.com/dongsheng123132)

---

## License

MIT © [dongsheng123132](https://github.com/dongsheng123132)
