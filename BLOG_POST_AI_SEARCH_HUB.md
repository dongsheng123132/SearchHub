---
title: 发布 AI Search Hub：打破信息孤岛，我的多引擎搜索实践
date: 2026-01-02 10:00:00
tags: [Chrome, 效率工具, AI, 产品发布, 开源]
categories: [作品]
---

在这个 AI 模型爆发的时代，我们获取信息的方式发生了根本性的变化。以前我们只搜 Google，现在我们会在 ChatGPT 问逻辑，在 Perplexity 找引用，在 Claude 读长文。

但问题随之而来：**我们的浏览器标签页越来越乱，由于平台之间的割裂，我们需要不断地复制粘贴问题，在不同的 Tab 之间来回切换。**

为了解决这个痛点，我开发了 **AI Search Hub**。

<!-- more -->

## 💡 为什么要造这个轮子？

作为一个重度依赖搜索引擎和 AI 工具的开发者，我发现我的工作流经常被打断：

1.  **信息碎片化**：Google 擅长找最新的事实，ChatGPT 擅长解释概念，Claude 擅长代码分析。我往往需要综合三者的结果。
2.  **重复劳动**：同一个 Prompt，我要手动打开三个网站，粘贴三次。
3.  **标签页地狱**：每次搜索打开一堆新标签，很快就找不到刚才的上下文了。

市面上虽然有一些聚合工具，但大多是收费的 SaaS 服务，或者需要输入 API Key。我想要一个**轻量级、无服务器、完全本地化**的 Chrome 扩展，它应该像浏览器的原生功能一样自然。

于是，**AI Search Hub** 诞生了。

## 🚀 核心功能：一次输入，全网触达

AI Search Hub 的设计哲学是 **"One Input, Everywhere"**。

### 1. 多引擎并行搜索
你只需要在一个输入框里输入问题，就可以同时唤起 Google、ChatGPT、Claude、Bing 等多个平台。
*   **对于开发者**：可以一键搜索 GitHub、Stack Overflow 和 Google。
*   **对于内容创作者**：可以同时看小红书、抖音和知乎的舆论风向。
*   **对于研究人员**：Perplexity + Google Scholar + DeepSeek，深度挖掘。

### 2. 自动标签组管理 (Tab Groups)
这是我最喜欢的功能。扩展会自动为你发起的每一次搜索创建一个 **Chrome 标签组**。
比如你搜 "React 19 新特性"，它会自动创建一个名为 "🔍 React 19 新特性" 的标签组，把所有相关的搜索结果都收纳其中。搜索结束，一键折叠或关闭，保持浏览器的清爽。

### 3. 侧边栏垂直标签 (Vertical Tabs)
利用 Chrome 的 Side Panel API，我在侧边栏做了一个垂直标签管理器。即使你打开了 50 个网页，也能在侧边栏一目了然地管理它们，不会像顶部标签栏那样挤成一团蚂蚁。

## 🛠️ 技术实现与思考

在开发过程中，我选择拥抱 Chrome Manifest V3 标准，虽然限制更多，但更安全、性能更好。

*   **零后端架构**：为了保护隐私，我没有搭建任何后端服务器。所有的配置（自定义引擎、主题设置）都通过 `chrome.storage` 存储在用户本地。
*   **Side Panel API**：放弃了传统的 Popup 弹窗常驻方案，改用 Side Panel，让搜索体验与网页浏览并行，互不打扰。
*   **权限最小化**：我移除了所有不必要的权限（如 `<all_urls>`），只申请最基础的 Tabs 和 Groups 权限，让用户用得放心。

## 📦 如何获取

👉 **[立即前往 Chrome 商店下载 AI Search Hub](https://chromewebstore.google.com/detail/searchhub/lojjckopababijcnckabcilfkbgajnbo?hl=zh-CN&utm_source=ext_sidebar)**

目前 AI Search Hub 已经提交至 Chrome Web Store 审核，最新版本号 v1.2.1。
如果你点击上方链接显示"无法获取"或 404，说明 Google 正在审核中（通常需要 1-2 个工作日），请稍后再试。

你也可以在我的 GitHub 上找到源码。

**主要特性清单：**
*   ✅ 支持 60+ 主流 AI 与搜索引擎
*   ✅ 自定义搜索引擎配置
*   ✅ 快捷键 `Alt+S` 呼出，`Alt+Q` 划词搜索
*   ✅ 只有 1MB 大小，极速启动

---

如果你也是效率工具爱好者，欢迎试用并给我反馈。让我们一起打破信息孤岛，重塑搜索体验。
