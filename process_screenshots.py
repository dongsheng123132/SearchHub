import os
from PIL import Image, ImageDraw, ImageFont
import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def process_screenshots():
    # Chrome商店要求的截图尺寸
    TARGET_SIZES = [
        (1280, 800),  # 主要截图尺寸
        (640, 400)    # 替代截图尺寸
    ]

    # 输入截图文件
    input_files = [
        "ScreenShot_2025-11-27_210820_950.png",
        "ScreenShot_2025-11-27_210941_315.png",
        "微信图片_2025-11-27_211006_059.png",
        "ScreenShot_2025-11-27_211036_390.png"
    ]

    # 创建输出目录
    output_dir = "chrome_store_screenshots"
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    processed_count = 0

    for i, filename in enumerate(input_files):
        if os.path.exists(filename):
            try:
                # 打开原始图片
                img = Image.open(filename)

                # 选择目标尺寸（前两个使用1280x800，后两个使用640x400）
                if i < 2:
                    target_size = TARGET_SIZES[0]  # 1280x800
                else:
                    target_size = TARGET_SIZES[1]  # 640x400

                # 调整图片尺寸，保持宽高比
                img_resized = img.copy()
                img_resized.thumbnail(target_size, Image.Resampling.LANCZOS)

                # 创建目标尺寸的画布（白色背景）
                canvas = Image.new('RGB', target_size, 'white')

                # 计算居中位置
                x_offset = (target_size[0] - img_resized.width) // 2
                y_offset = (target_size[1] - img_resized.height) // 2

                # 将调整后的图片粘贴到画布中心
                canvas.paste(img_resized, (x_offset, y_offset))

                # 添加标题文字（中文）
                try:
                    # 尝试使用系统中文字体
                    font = ImageFont.truetype("msyh.ttc", 48)  # 微软雅黑
                except:
                    try:
                        font = ImageFont.truetype("arial.ttf", 48)
                    except:
                        font = ImageFont.load_default()

                draw = ImageDraw.Draw(canvas)

                # 根据截图内容添加不同的标题
                titles = [
                    "SearchHub - 智能多引擎搜索工具",
                    "快速组合搜索功能",
                    "垂直标签页管理",
                    "设置与个性化"
                ]

                title = titles[i] if i < len(titles) else f"SearchHub 功能展示 {i+1}"

                # 添加标题到顶部
                draw.text((20, 20), title, fill='black', font=font)

                # 添加页脚说明
                footer_text = "一次搜索，全部结果 - 支持AI搜索、传统搜索、社交媒体等多个平台"
                try:
                    font_small = ImageFont.truetype("msyh.ttc", 24)
                except:
                    try:
                        font_small = ImageFont.truetype("arial.ttf", 24)
                    except:
                        font_small = ImageFont.load_default()

                draw.text((20, target_size[1] - 40), footer_text, fill='gray', font=font_small)

                # 保存为24位PNG
                output_filename = f"screenshot_{i+1}_{target_size[0]}x{target_size[1]}.png"
                output_path = os.path.join(output_dir, output_filename)
                canvas.save(output_path, 'PNG', optimize=True)

                print(f"✅ 已处理: {filename} -> {output_filename}")
                processed_count += 1

                # 同时创建JPEG版本
                jpeg_filename = f"screenshot_{i+1}_{target_size[0]}x{target_size[1]}.jpg"
                jpeg_path = os.path.join(output_dir, jpeg_filename)
                canvas.convert('RGB').save(jpeg_path, 'JPEG', quality=95, optimize=True)
                print(f"✅ 已创建JPEG版本: {jpeg_filename}")

            except Exception as e:
                print(f"❌ 处理 {filename} 时出错: {e}")
        else:
            print(f"⚠️  文件不存在: {filename}")

    print(f"\n📊 处理完成！共处理了 {processed_count} 张截图")
    print(f"📁 输出目录: {output_dir}")
    print(f"📏 支持的尺寸: {TARGET_SIZES}")
    print("📋 符合Chrome商店要求:")
    print("   - 尺寸: 1280x800px 或 640x400px")
    print("   - 格式: 24位PNG 和 JPEG")
    print("   - 数量: 1-5张截图")

if __name__ == "__main__":
    process_screenshots()