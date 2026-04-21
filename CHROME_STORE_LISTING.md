# Chrome Web Store Listing Guide

## 📋 Required Materials Checklist

### ✅ 1. Extension Icons (Complete)
- [x] 16x16 - icon16.png
- [x] 32x32 - icon32.png
- [x] 48x48 - icon48.png
- [x] 128x128 - icon128.png (also used for Chrome Web Store)

### 📸 2. Screenshots (REQUIRED - Need to Create)

You need **3-5 screenshots** showing your extension in action.

**Recommended screenshots:**

1. **Main Interface** (1280x800 or 640x400)
   - Show the full SearchHub interface with multiple search engines displayed
   - Capture: Search input, category sections, engine cards

2. **Search in Action** (1280x800 or 640x400)
   - Show tabs being opened after a search
   - Highlight: Multiple search results in different tabs

3. **Edit Mode** (1280x800 or 640x400)
   - Show the edit mode with custom engine options
   - Highlight: Add engine, edit engine features

4. **Combo Feature** (1280x800 or 640x400)
   - Show combo selection and quick combos
   - Highlight: AI Search, Traditional Search combos

5. **Compact Mode** (Optional) (1280x800 or 640x400)
   - Show the difference between normal and compact mode

**How to create screenshots:**
1. Open SearchHub (index.html)
2. Press F12 → Console → Type: `document.body.style.width = '1280px'`
3. Take screenshots with Windows Snipping Tool or Snip & Sketch
4. Save as PNG format

---

## 📝 3. Store Listing Text

### Extension Name (45 characters max)
```
SearchHub - Multi-Engine Search Tool
```

### Short Description (132 characters max)
```
Search across all engines at once. AI search, traditional search, social media - open multiple results in organized tabs.
```

### Detailed Description (16,000 characters max)

```markdown
# SearchHub - One Search, All Results

Search smarter, not harder. SearchHub lets you search across multiple search engines simultaneously, opening all results in organized tabs or a convenient sidebar.

## 🚀 Key Features

### Multi-Engine Search
- Search across 50+ engines at once
- AI Search: Perplexity, ChatGPT, Claude, Gemini, and more
- Traditional: Google, Bing, DuckDuckGo
- Social Media: Twitter, Reddit, Xiaohongshu, Weibo
- Developer Tools: GitHub, Stack Overflow, MDN, NPM
- Shopping: Amazon, Taobao, JD, Pinduoduo
- Knowledge: Wikipedia, Zhihu, Baidu Baike

### Smart Combos
- Pre-configured search combos (🤖 All AI, 🔍 Traditional, 👨‍💻 Dev Tools)
- Save up to 2 custom combos with your favorite engines
- One-click to activate your preferred search group

### Customization
- Add your own custom search engines
- Edit existing engines
- Compact mode for minimal interface
- Dark/Light theme support
- English & Chinese language support

### Organized Results
- Tab grouping for easy navigation
- Sidebar panel for vertical tab management
- Search selected text with Alt+Q
- Quick open with Alt+S

## 🎯 Perfect For

- **Researchers**: Search academic papers across multiple sources
- **Developers**: Query documentation, Stack Overflow, GitHub simultaneously
- **Shoppers**: Compare prices across different platforms
- **Content Creators**: Monitor multiple social media platforms
- **Students**: Cross-reference information from various sources

## 🔒 Privacy First

- No data collection
- No tracking
- All searches happen directly on the respective search engines
- Your search history stays private

## ⚡ Quick Start

1. Install SearchHub
2. Click the extension icon or press Alt+S
3. Enter your search query
4. Select search engines or use a combo
5. Click Search - all results open in organized tabs!

## 🛠️ Advanced Features

- **Edit Mode**: Customize your search engines
- **Custom Engines**: Add any search engine with URL pattern
- **Auto-favicon**: Logos automatically generated from URLs
- **Keyboard Shortcuts**:
  - Alt+S: Open SearchHub
  - Alt+Q: Search selected text
- **Tab Management**: Automatic grouping and sidebar support

## 📊 Supported Categories

- 🤖 AI Search (12 engines)
- 💬 AI Chat (11 engines)
- 🔍 Traditional Search (7 engines)
- 📱 Social Media (12 engines)
- 👨‍💻 Developer Tools (4 engines)
- 🎥 Video (3 engines)
- 🛒 Shopping (4 engines)
- 📚 Knowledge (3 engines)

## 🌟 Why SearchHub?

Stop switching between tabs and manually opening each search engine. SearchHub saves you time by letting you search everywhere at once, with results neatly organized for easy comparison.

Perfect for power users who need comprehensive search results across multiple platforms.

---

**Support & Feedback**
Found a bug or have a feature request? Please report issues on our GitHub page.

**Version**: 1.0.0
**Last Updated**: November 2025
```

---

## 🌍 4. Category Selection

**Primary Category:**
- Search Tools

**Alternative Categories:**
- Productivity
- Developer Tools

---

## 🎨 5. Promotional Images (Optional but Recommended)

### Small Promotional Tile (440x280)
Create a simple banner with:
- SearchHub logo
- Text: "Search All Engines at Once"
- Clean gradient background

### Large Promotional Tile (920x680) (Optional)
- Feature showcase
- Screenshots montage
- Key benefits listed

### Marquee Promotional Tile (1400x560) (Optional)
- Full feature showcase
- Used if selected as "Featured" extension

**Design Tips:**
- Use your brand colors (accent: #4f46e5)
- Keep text minimal and readable
- Show the interface in action
- Use Canva.com for easy design

---

## 🔐 6. Privacy Policy (REQUIRED)

You need to host a privacy policy page. Here's the content:

```markdown
# Privacy Policy for SearchHub

Last updated: November 27, 2025

## Data Collection

SearchHub does NOT collect, store, or transmit any personal data.

## What We Don't Collect

- Search queries
- Browsing history
- Personal information
- Usage statistics
- Analytics data

## How SearchHub Works

- All search queries are sent directly to the search engines you select
- Your search preferences are stored locally in your browser only
- No data leaves your device except for the searches you explicitly perform
- No third-party tracking or analytics

## Permissions Explained

SearchHub requires the following permissions:

- **tabs**: To open search results in new tabs
- **storage**: To save your preferences locally
- **sidePanel**: To display results in sidebar
- **contextMenus**: To enable "Search selected text" feature

## Third-Party Services

When you perform a search, you interact directly with the search engines you selected (Google, Bing, etc.). Their respective privacy policies apply to those interactions.

## Changes to Privacy Policy

We may update this privacy policy from time to time. Any changes will be posted on this page.

## Contact

For privacy concerns, please contact us through the Chrome Web Store support page.
```

**Where to host:**
- Create a GitHub Gist (https://gist.github.com/)
- Or add to your GitHub repository as PRIVACY.md
- URL example: `https://gist.github.com/yourusername/xxxxx`

---

## 📋 7. Manifest.json Check

Let me verify your manifest.json has all required fields:
