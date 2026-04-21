# 图标文件说明

## 需要的图标文件

请在此文件夹中放置以下图标文件：

- `icon16.png` - 16x16 像素
- `icon32.png` - 32x32 像素
- `icon48.png` - 48x48 像素
- `icon128.png` - 128x128 像素

## 快速生成图标

### 方法1：使用在线工具
访问 https://favicon.io/ 或 https://realfavicongenerator.net/
上传一张图片即可自动生成所有尺寸的图标

### 方法2：使用设计软件
1. 使用 Photoshop、Figma、Sketch 等设计软件
2. 创建一个简单的图标设计（建议使用放大镜图标）
3. 导出为 PNG 格式，分别保存为以上4种尺寸

### 方法3：使用命令行工具 (需要 ImageMagick)
```bash
# 假设你有一张 icon.png (建议至少 512x512)
convert icon.png -resize 16x16 icon16.png
convert icon.png -resize 32x32 icon32.png
convert icon.png -resize 48x48 icon48.png
convert icon.png -resize 128x128 icon128.png
```

## 临时方案

如果暂时没有图标，可以使用 Chrome 的默认图标，或者从 SeekAll 复制图标文件。

## 推荐设计

建议设计一个简洁的放大镜或搜索图标，配色可以使用：
- 主色：#4f46e5 (靛蓝色)
- 辅助色：#6366f1 (浅靛蓝色)

保持简洁和现代感，确保在小尺寸下仍然清晰可见。
