# SearchHub 国际化 (i18n) 使用指南

## 📁 文件结构

```
SearchHub/
├── _locales/                    # 国际化文件夹
│   ├── en/                      # 英文（默认语言）
│   │   └── messages.json        # 英文翻译
│   └── zh_CN/                   # 简体中文
│       └── messages.json        # 中文翻译
├── scripts/
│   └── i18n.js                  # i18n 辅助函数
└── manifest.json                # 已配置 default_locale: "en"
```

## 🌍 支持的语言

- **English (en)** - 默认语言
- **简体中文 (zh_CN)** - 中文

浏览器会根据用户的语言设置自动选择语言。

## 📝 如何使用

### 方法 1: 在 HTML 中使用 data-i18n 属性

```html
<!-- 文本内容 -->
<h1 data-i18n="extName">SearchHub</h1>
<p data-i18n="extSubtitle">One search, all results</p>

<!-- placeholder -->
<input type="text" data-i18n-placeholder="searchPlaceholder">

<!-- title 属性 -->
<button data-i18n-title="settings">
  <svg>...</svg>
</button>

<!-- 支持 HTML 的内容 -->
<div data-i18n-html="footerHint"></div>
```

### 方法 2: 在 JavaScript 中使用 t() 函数

```javascript
// 导入 i18n.js
// <script src="scripts/i18n.js"></script>

// 获取翻译文本
const searchButtonText = t('searchButton');  // "Search" or "搜索"
const subtitle = t('extSubtitle');           // "One search, all results" or "一次搜索，全部结果"

// 带参数的翻译（未来支持）
const message = t('enginesSelected', ['3']); // "3 engines selected" or "3 个引擎已选择"

// 更新所有页面元素的语言
updateUILanguage();
```

### 方法 3: 在 manifest.json 中使用

```json
{
  "name": "__MSG_extName__",
  "description": "__MSG_extDescription__"
}
```

## 🔧 添加新的翻译

### 1. 在 `_locales/en/messages.json` 添加英文：

```json
{
  "myNewText": {
    "message": "Hello World",
    "description": "Greeting message"
  }
}
```

### 2. 在 `_locales/zh_CN/messages.json` 添加中文：

```json
{
  "myNewText": {
    "message": "你好世界",
    "description": "问候消息"
  }
}
```

### 3. 在 HTML 中使用：

```html
<p data-i18n="myNewText">Hello World</p>
```

或在 JavaScript 中：

```javascript
const greeting = t('myNewText');
```

## 📋 现有的翻译键

### 通用
- `extName` - SearchHub
- `extDescription` - 扩展描述
- `extSubtitle` - 副标题
- `settings` - 设置
- `selectAll` - 全选
- `clearAll` - 清空

### 搜索相关
- `searchPlaceholder` - 搜索框占位符
- `searchButton` - 搜索按钮
- `enginesSelected` - 已选引擎数

### 分类
- `categoryAISearch` - AI 搜索
- `categoryAIChat` - AI 对话
- `categoryTraditional` - 传统搜索
- `categorySocial` - 社交媒体
- `categoryVideo` - 视频
- `categoryDeveloper` - 开发者
- `categoryShopping` - 购物
- `categoryKnowledge` - 知识

### 快速组合
- `comboAIAll` - 全部 AI
- `comboMainstream` - 主流搜索
- `comboChinese` - 中文平台
- `comboDev` - 开发者

### 设置页面
- `settingsTitle` - 设置标题
- `settingsAppearance` - 外观
- `settingsTheme` - 主题
- `settingsLanguage` - 语言
- `settingsBehavior` - 行为
- `settingsCustomEngines` - 自定义引擎
- `settingsSave` - 保存设置

### 侧边栏
- `sidebarTitle` - 垂直标签页
- `sidebarRefresh` - 刷新
- `sidebarCollapseAll` - 全部折叠
- `sidebarExpandAll` - 全部展开
- `sidebarUngrouped` - 未分组标签
- `sidebarNoTabs` - 无标签提示

完整列表请查看 `_locales/en/messages.json`

## 🎨 如何更新现有页面

### 更新 index.html

在 `<head>` 中添加：
```html
<script src="scripts/i18n.js"></script>
```

在需要翻译的元素上添加属性：
```html
<!-- 之前 -->
<h1>SearchHub</h1>
<input type="text" placeholder="输入搜索关键词...">

<!-- 之后 -->
<h1 data-i18n="extName">SearchHub</h1>
<input type="text" data-i18n-placeholder="searchPlaceholder">
```

在页面加载时调用：
```javascript
document.addEventListener('DOMContentLoaded', () => {
  updateUILanguage();  // 更新所有翻译
  // 其他初始化代码...
});
```

## 🔄 语言切换

Chrome 扩展会自动根据浏览器语言选择：

- 浏览器语言为中文（zh, zh-CN, zh-TW 等）→ 显示中文
- 其他语言 → 显示英文（默认）

### 如何切换浏览器语言（用于测试）

**Chrome:**
1. 打开 `chrome://settings/languages`
2. 添加或移动语言到顶部
3. 重新启动浏览器
4. 重新加载扩展

**Edge:**
1. 打开 `edge://settings/languages`
2. 同上

## 🧪 测试

### 1. 测试英文界面

```bash
# 1. 将浏览器语言设置为 English
# 2. 打开 chrome://extensions/
# 3. 重新加载 SearchHub
# 4. 打开扩展，检查所有文本是否为英文
```

### 2. 测试中文界面

```bash
# 1. 将浏览器语言设置为简体中文
# 2. 打开 chrome://extensions/
# 3. 重新加载 SearchHub
# 4. 打开扩展，检查所有文本是否为中文
```

### 3. 在控制台测试

```javascript
// 打开任意 SearchHub 页面的开发者工具
console.log(chrome.i18n.getUILanguage());  // 查看当前语言
console.log(t('extName'));                  // 测试翻译
console.log(t('searchButton'));             // 测试翻译
```

## ✅ 已完成

- ✅ 创建 `_locales/en/messages.json` - 英文翻译
- ✅ 创建 `_locales/zh_CN/messages.json` - 中文翻译
- ✅ 更新 `manifest.json` - 添加 `default_locale`
- ✅ 创建 `scripts/i18n.js` - i18n 辅助函数

## 📋 待完成

- ⬜ 更新 `index.html` - 添加 data-i18n 属性
- ⬜ 更新 `popup.html` - 添加 data-i18n 属性
- ⬜ 更新 `settings.html` - 添加 data-i18n 属性
- ⬜ 更新 `sidebar.html` - 添加 data-i18n 属性
- ⬜ 更新对应的 JS 文件 - 调用 updateUILanguage()

## 🚀 快速开始

1. **重新加载扩展**
   ```
   chrome://extensions/ → SearchHub → 刷新按钮
   ```

2. **扩展名称和描述会自动翻译**（已在 manifest.json 配置）

3. **页面内容需要更新 HTML**（添加 data-i18n 属性）

4. **测试不同语言**
   - 切换浏览器语言
   - 重新加载扩展
   - 查看效果

---

**注意：** 目前 i18n 框架已经搭建完成，但各个页面的 HTML 文件还需要添加 `data-i18n` 属性来使用翻译。您可以逐步更新各个页面。
