import os
from PIL import Image, ImageDraw, ImageFont
import io
import sys

# 设置输出编码
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def create_promo_images():
    """创建Chrome商店所需的宣传图块"""

    # 尺寸配置
    SMALL_TILE = (440, 280)   # 小型宣传图块
    LARGE_BANNER = (1400, 560)  # 顶部宣传图块

    # 创建输出目录
    output_dir = "chrome_promo_images"
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    print("🎨 开始创建Chrome商店宣传图块...")

    # 尝试加载字体
    try:
        # 尝试使用微软雅黑字体
        title_font_large = ImageFont.truetype("msyh.ttc", 72)
        title_font_medium = ImageFont.truetype("msyh.ttc", 48)
        title_font_small = ImageFont.truetype("msyh.ttc", 36)
        desc_font_large = ImageFont.truetype("msyh.ttc", 32)
        desc_font_small = ImageFont.truetype("msyh.ttc", 24)
    except:
        try:
            # 回退到Arial
            title_font_large = ImageFont.truetype("arial.ttf", 72)
            title_font_medium = ImageFont.truetype("arial.ttf", 48)
            title_font_small = ImageFont.truetype("arial.ttf", 36)
            desc_font_large = ImageFont.truetype("arial.ttf", 32)
            desc_font_small = ImageFont.truetype("arial.ttf", 24)
        except:
            # 使用默认字体
            title_font_large = ImageFont.load_default()
            title_font_medium = ImageFont.load_default()
            title_font_small = ImageFont.load_default()
            desc_font_large = ImageFont.load_default()
            desc_font_small = ImageFont.load_default()

    def create_gradient_background(width, height, colors):
        """创建渐变背景"""
        image = Image.new('RGB', (width, height))
        draw = ImageDraw.Draw(image)

        if len(colors) == 2:
            # 两色渐变
            start_color, end_color = colors
            for y in range(height):
                ratio = y / height
                r = int(start_color[0] * (1 - ratio) + end_color[0] * ratio)
                g = int(start_color[1] * (1 - ratio) + end_color[1] * ratio)
                b = int(start_color[2] * (1 - ratio) + end_color[2] * ratio)
                draw.line([(0, y), (width, y)], fill=(r, g, b))
        else:
            # 多色渐变
            num_colors = len(colors)
            for y in range(height):
                ratio = y / height
                if ratio <= 0.5:
                    # 前半部分
                    sub_ratio = ratio * 2
                    r = int(colors[0][0] * (1 - sub_ratio) + colors[1][0] * sub_ratio)
                    g = int(colors[0][1] * (1 - sub_ratio) + colors[1][1] * sub_ratio)
                    b = int(colors[0][2] * (1 - sub_ratio) + colors[1][2] * sub_ratio)
                else:
                    # 后半部分
                    sub_ratio = (ratio - 0.5) * 2
                    r = int(colors[1][0] * (1 - sub_ratio) + colors[2][0] * sub_ratio)
                    g = int(colors[1][1] * (1 - sub_ratio) + colors[2][1] * sub_ratio)
                    b = int(colors[1][2] * (1 - sub_ratio) + colors[2][2] * sub_ratio)
                draw.line([(0, y), (width, y)], fill=(r, g, b))

        return image

    # 1. 创建小型宣传图块 (440x280)
    print("\n📱 创建小型宣传图块 (440x280)...")

    # 渐变背景
    small_bg = create_gradient_background(
        SMALL_TILE[0], SMALL_TILE[1],
        [(66, 133, 244), (219, 68, 55)]   # 蓝色到红色
    )

    draw = ImageDraw.Draw(small_bg)

    # 添加SearchHub标志
    title_text = "SearchHub"
    title_bbox = draw.textbbox((0, 0), title_text, font=title_font_medium)
    title_width = title_bbox[2] - title_bbox[0]
    title_x = (SMALL_TILE[0] - title_width) // 2
    draw.text((title_x, 40), title_text, fill='white', font=title_font_medium)

    # 添加副标题
    subtitle_text = "Smart Multi-Engine Search"
    subtitle_bbox = draw.textbbox((0, 0), subtitle_text, font=title_font_small)
    subtitle_width = subtitle_bbox[2] - subtitle_bbox[0]
    subtitle_x = (SMALL_TILE[0] - subtitle_width) // 2
    draw.text((subtitle_x, 100), subtitle_text, fill='white', font=title_font_small)

    # 添加核心功能
    features = [
        "• One Search, All Results",
        "• Support AI Search Engines",
        "• Vertical Tab Management"
    ]

    y_offset = 160
    for feature in features:
        feature_bbox = draw.textbbox((0, 0), feature, font=desc_font_small)
        feature_width = feature_bbox[2] - feature_bbox[0]
        feature_x = (SMALL_TILE[0] - feature_width) // 2
        draw.text((feature_x, y_offset), feature, fill='white', font=desc_font_small)
        y_offset += 30

    # 保存小型宣传图块
    small_tile_png = os.path.join(output_dir, "small_tile_440x280.png")
    small_tile_jpg = os.path.join(output_dir, "small_tile_440x280.jpg")

    small_bg.save(small_tile_png, 'PNG', optimize=True)
    small_bg.convert('RGB').save(small_tile_jpg, 'JPEG', quality=95, optimize=True)

    print(f"✅ 小型宣传图块已创建:")
    print(f"   PNG: {small_tile_png}")
    print(f"   JPG: {small_tile_jpg}")

    # 2. 创建顶部宣传图块 (1400x560)
    print("\n🎭 创建顶部宣传图块 (1400x560)...")

    # 渐变背景
    large_bg = create_gradient_background(
        LARGE_BANNER[0], LARGE_BANNER[1],
        [(52, 168, 83), (66, 133, 244), (156, 39, 176)]  # 绿-蓝-紫三色渐变
    )

    draw = ImageDraw.Draw(large_bg)

    # 添加主标题
    title_text = "SearchHub"
    title_bbox = draw.textbbox((0, 0), title_text, font=title_font_large)
    title_width = title_bbox[2] - title_bbox[0]
    title_x = (LARGE_BANNER[0] - title_width) // 2
    draw.text((title_x, 80), title_text, fill='white', font=title_font_large)

    # 添加标语
    tagline_text = "One Search, All Results - Smart Multi-Engine Search Tool"
    tagline_bbox = draw.textbbox((0, 0), tagline_text, font=title_font_medium)
    tagline_width = tagline_bbox[2] - tagline_bbox[0]
    tagline_x = (LARGE_BANNER[0] - tagline_width) // 2
    draw.text((tagline_x, 180), tagline_text, fill='white', font=title_font_medium)

    # 添加功能分类（多列布局）
    feature_categories = [
        {
            "title": "🤖 AI Search",
            "items": ["ChatGPT", "Claude", "Gemini", "Kimi", "Bard"]
        },
        {
            "title": "🔍 Traditional Search",
            "items": ["Google", "Baidu", "Bing", "DuckDuckGo", "Yahoo"]
        },
        {
            "title": "💬 Social Media",
            "items": ["Zhihu", "Weibo", "Reddit", "Twitter", "Douban"]
        },
        {
            "title": "🎵 Video & Music",
            "items": ["YouTube", "Bilibili", "TikTok", "NetEase Music"]
        },
        {
            "title": "🛒 Shopping",
            "items": ["Taobao", "JD.com", "Amazon", "Pinduoduo"]
        },
        {
            "title": "👨‍💻 Developer",
            "items": ["GitHub", "Stack Overflow", "MDN", "Juejin"]
        }
    ]

    # 计算布局
    columns = 3
    column_width = LARGE_BANNER[0] // columns
    row_height = 80
    start_y = 280

    for i, category in enumerate(feature_categories):
        col = i % columns
        row = i // columns
        x = col * column_width + 50
        y = start_y + row * row_height

        # 分类标题
        draw.text((x, y), category["title"], fill='white', font=desc_font_large)

        # 功能项目
        items_text = " • ".join(category["items"][:4])  # 最多显示4个
        draw.text((x, y + 35), items_text, fill='lightgray', font=desc_font_small)

    # 保存顶部宣传图块
    large_banner_png = os.path.join(output_dir, "large_banner_1400x560.png")
    large_banner_jpg = os.path.join(output_dir, "large_banner_1400x560.jpg")

    large_bg.save(large_banner_png, 'PNG', optimize=True)
    large_bg.convert('RGB').save(large_banner_jpg, 'JPEG', quality=95, optimize=True)

    print(f"✅ 顶部宣传图块已创建:")
    print(f"   PNG: {large_banner_png}")
    print(f"   JPG: {large_banner_jpg}")

    print(f"\n📊 宣传图块创建完成！")
    print(f"📁 输出目录: {output_dir}")
    print("\n📋 符合Chrome商店要求:")
    print("✅ 小型宣传图块: 440x280px")
    print("✅ 顶部宣传图块: 1400x560px")
    print("✅ 格式: 24位PNG + JPEG")
    print("✅ 无alpha透明层")
    print("✅ 使用中文界面")

    return output_dir

if __name__ == "__main__":
    create_promo_images()