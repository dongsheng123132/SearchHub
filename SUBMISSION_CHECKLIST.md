# Chrome Web Store Submission Checklist

## 🎯 Before You Start

### Prerequisites
- [ ] Google Account (for Chrome Developer Dashboard)
- [ ] $5 USD one-time developer registration fee
- [ ] GitHub account (optional, for hosting privacy policy)

---

## 📦 Step 1: Prepare Your Extension Package

### 1.1 Update manifest.json
- [ ] Change `"author": "Your Name"` to your actual name
- [ ] Update `"homepage_url"` to your GitHub repository or website
- [ ] Verify version is `"1.0.0"`

### 1.2 Test Your Extension
- [ ] Load extension in Chrome via `chrome://extensions/`
- [ ] Enable Developer Mode
- [ ] Click "Load unpacked" and select SearchHub folder
- [ ] Test all features:
  - [ ] Search functionality
  - [ ] Add custom engine
  - [ ] Edit engine
  - [ ] Delete custom engine
  - [ ] Save combo
  - [ ] Delete combo
  - [ ] Edit combo
  - [ ] Theme toggle
  - [ ] Compact mode
  - [ ] Language toggle
  - [ ] Keyboard shortcuts (Alt+S, Alt+Q)
  - [ ] Sidebar panel

### 1.3 Create ZIP Package
```bash
# Navigate to SearchHub folder parent directory
cd "C:\Users\ZhuanZ\Desktop\claude\侧边多标签浏览工具 - claude版本"

# Create ZIP (exclude unnecessary files)
# Include these files/folders:
- manifest.json
- index.html
- sidebar.html
- settings.html
- background.js
- content.js
- popup.js
- icons/
- scripts/
- styles/
- _locales/

# EXCLUDE these:
- *.md (all markdown files except README if you want it)
- .git/
- node_modules/
- store-assets/
- test files
- .DS_Store
```

**Windows ZIP creation:**
1. Select all required files
2. Right-click → Send to → Compressed (zipped) folder
3. Name it: `SearchHub-v1.0.0.zip`

**Important:** Maximum size is 20MB (you should be well under this)

---

## 📸 Step 2: Create Screenshots

### 2.1 Take Screenshots
Follow the guide in `SCREENSHOT_GUIDE.md`

Required screenshots:
- [ ] Screenshot 1: Main interface (1280x800)
- [ ] Screenshot 2: Search results in tabs (1280x800)
- [ ] Screenshot 3: Combo feature (1280x800)
- [ ] Screenshot 4: Edit mode (optional) (1280x800)
- [ ] Screenshot 5: Add engine dialog (optional) (1280x800)

### 2.2 Save Screenshots
Create folder structure:
```
store-assets/
├── screenshots/
│   ├── screenshot-1-main.png
│   ├── screenshot-2-results.png
│   ├── screenshot-3-combos.png
│   ├── screenshot-4-edit.png (optional)
│   └── screenshot-5-add.png (optional)
```

**Requirements:**
- PNG format preferred
- 1280x800 or 640x400 pixels
- Max 2MB per file
- 3-5 screenshots total

---

## 📝 Step 3: Prepare Store Listing Text

### 3.1 Copy Text from CHROME_STORE_LISTING.md

Prepare these in a text file:

- [ ] **Extension Name** (45 chars max)
  ```
  SearchHub - Multi-Engine Search Tool
  ```

- [ ] **Short Description** (132 chars max)
  ```
  Search across all engines at once. AI search, traditional search, social media - open multiple results in organized tabs.
  ```

- [ ] **Detailed Description**
  - Copy from `CHROME_STORE_LISTING.md`
  - Can be up to 16,000 characters
  - Use markdown formatting

- [ ] **Category**
  - Primary: Search Tools
  - Secondary: Productivity

---

## 🔐 Step 4: Setup Privacy Policy

### 4.1 Host Privacy Policy

**Option A: GitHub Gist (Recommended - Free & Easy)**
1. Go to https://gist.github.com/
2. Create new gist
3. Name: `searchhub-privacy-policy.md`
4. Paste content from `PRIVACY_POLICY.md`
5. Click "Create public gist"
6. Copy the URL (e.g., `https://gist.github.com/username/xxxxx`)

**Option B: GitHub Repository**
1. Create public repository: `searchhub`
2. Add `PRIVACY_POLICY.md` to repository
3. URL: `https://github.com/username/searchhub/blob/main/PRIVACY_POLICY.md`

**Option C: Your Website**
1. Upload `PRIVACY_POLICY.md` as HTML
2. URL: `https://yoursite.com/searchhub/privacy`

**Save the Privacy Policy URL - you'll need it!**
- [ ] Privacy Policy URL: ___________________________

---

## 🎨 Step 5: Create Promotional Images (Optional)

### Small Promotional Tile (440x280) - Optional
You can skip this initially and add it later.

**If you want to create it:**
- Use Canva.com (free)
- Template: 440x280px
- Include: Logo, tagline, simple background
- Export as PNG

### Where to create:
- **Canva:** https://www.canva.com/
- **Figma:** https://www.figma.com/
- **Photoshop/GIMP:** If you have it

---

## 🚀 Step 6: Chrome Web Store Submission

### 6.1 Register as Chrome Developer

1. Go to https://chrome.google.com/webstore/devconsole
2. Sign in with Google account
3. Pay $5 USD one-time registration fee
4. Accept terms and conditions

### 6.2 Create New Item

1. Click "New Item" button
2. Upload `SearchHub-v1.0.0.zip`
3. Wait for upload to complete

### 6.3 Fill Store Listing Tab

**Product Details:**
- [ ] Extension name: `SearchHub - Multi-Engine Search Tool`
- [ ] Summary: (Copy short description)
- [ ] Category: `Search Tools`
- [ ] Language: `English`

**Detailed Description:**
- [ ] Paste detailed description from CHROME_STORE_LISTING.md

**Icon:**
- [ ] Upload `icons/icon128.png` (already included in ZIP)

**Screenshots:**
- [ ] Upload 3-5 screenshots from store-assets/screenshots/
- [ ] Add captions for each screenshot (optional but recommended):
  - "Search across multiple engines simultaneously"
  - "Organized results in tab groups"
  - "Quick combos for common searches"
  - "Customize with your own engines"
  - "Add any search engine you want"

**Promotional Images:**
- [ ] Small tile (440x280) - Optional, skip for now
- [ ] Large tile (920x680) - Optional, skip for now
- [ ] Marquee (1400x560) - Optional, skip for now

**Additional Fields:**
- [ ] Official URL: Your GitHub repository or website
- [ ] Homepage URL: (Same as above or leave blank)

### 6.4 Fill Privacy Tab

- [ ] **Single Purpose:**
  ```
  Multi-engine search tool that opens search queries across multiple search engines in organized tabs.
  ```

- [ ] **Permission Justification:**
  ```
  - tabs: Open search results in new tabs
  - tabGroups: Organize search results into groups
  - storage: Save user preferences locally
  - sidePanel: Display search interface in sidebar
  - contextMenus: Enable "search selected text" feature
  - scripting: Detect selected text for search feature
  ```

- [ ] **Privacy Policy URL:** (Enter your hosted privacy policy URL)

- [ ] **Are you using remote code?** NO

- [ ] **Data Usage:**
  - Does this extension handle personal or sensitive user data? **NO**
  - Does this extension collect user data? **NO**

### 6.5 Fill Distribution Tab

- [ ] **Visibility:** Public
- [ ] **Regions:** All regions (or select specific countries)
- [ ] **Pricing:** Free
- [ ] **Target Audience:** Everyone

---

## ✅ Step 7: Final Review

### Pre-Submission Checklist

- [ ] Extension works perfectly in test mode
- [ ] All permissions are justified
- [ ] Privacy policy is accessible
- [ ] Screenshots are clear and professional
- [ ] Description is accurate and complete
- [ ] No grammar/spelling errors in listing
- [ ] Icons are correct and high quality
- [ ] Version number is correct (1.0.0)
- [ ] Author name is correct
- [ ] All links work (homepage, privacy policy)

### Submit for Review

- [ ] Click "Submit for Review" button
- [ ] Confirm submission

**Review Time:** Usually 1-3 business days, can take up to 7 days

---

## 📊 After Submission

### What Happens Next

1. **Automated Review** (Minutes)
   - Virus scan
   - Malware check
   - Policy violation check

2. **Manual Review** (1-7 days)
   - Human reviewer checks functionality
   - Verifies privacy policy
   - Checks for policy violations

3. **Possible Outcomes:**
   - ✅ **Approved:** Extension goes live immediately
   - ⚠️ **Needs Changes:** You'll receive specific feedback
   - ❌ **Rejected:** Detailed reason provided, can resubmit

### If Rejected

Don't worry! Common issues:
- Privacy policy not accessible
- Permissions not justified
- Screenshots don't match functionality
- Description misleading

**Fix the issues and resubmit - no additional fee!**

---

## 🎉 Post-Approval

### Once Approved

- [ ] Extension is live on Chrome Web Store
- [ ] Share the link:
  ```
  https://chrome.google.com/webstore/detail/[your-extension-id]
  ```

- [ ] Promote your extension:
  - Share on social media
  - Post on Reddit (r/chrome, r/firefox)
  - Product Hunt
  - Hacker News

### Monitor Analytics

Chrome Developer Dashboard provides:
- Installation count
- Weekly active users
- Daily active users
- Ratings and reviews
- Crash reports

### Respond to Reviews

- Reply to user reviews
- Fix reported bugs
- Consider feature requests
- Update regularly

---

## 🔄 Future Updates

### How to Update Your Extension

1. Increment version in manifest.json (e.g., 1.0.0 → 1.0.1)
2. Make your changes
3. Test thoroughly
4. Create new ZIP file
5. Go to Developer Dashboard
6. Click on your extension
7. Click "Package" tab
8. Upload new ZIP
9. Click "Submit for Review"

**Note:** Updates are usually reviewed faster than initial submissions

---

## 💡 Quick Tips

### Do's ✅
- Test extensively before submitting
- Write clear, honest descriptions
- Use high-quality screenshots
- Respond to user feedback
- Keep privacy policy updated
- Update regularly

### Don'ts ❌
- Don't request unnecessary permissions
- Don't make false claims
- Don't spam keywords in description
- Don't ignore user reviews
- Don't violate Chrome Web Store policies
- Don't include executable code from remote sources

---

## 📞 Support Resources

### Chrome Web Store Help
- **Help Center:** https://developer.chrome.com/docs/webstore/
- **Program Policies:** https://developer.chrome.com/docs/webstore/program-policies/
- **Best Practices:** https://developer.chrome.com/docs/webstore/best_practices/

### Contact Support
- **Developer Support:** https://support.google.com/chrome_webstore/contact/developer_support
- **Community Forum:** https://groups.google.com/a/chromium.org/g/chromium-extensions

---

## ✨ Good Luck!

You're ready to submit! Follow this checklist step by step and you'll have a successful submission.

**Remember:**
- Take your time
- Test everything
- Be patient with review process
- Don't hesitate to resubmit if rejected

**Questions?** Review the documentation or reach out to Chrome Web Store support.

---

**Estimated Time to Complete:**
- Prepare package: 30 minutes
- Take screenshots: 30 minutes
- Write/review listing: 30 minutes
- Submit: 15 minutes
- **Total: ~2 hours**

**Review Time: 1-7 days**

**Let's ship it! 🚀**
