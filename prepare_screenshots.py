#!/usr/bin/env python3
"""
Prepare screenshots for Chrome Web Store submission
Requirements:
- 1280x800 or 640x400
- JPEG or 24-bit PNG (no alpha)
- English interface
- 1-5 screenshots
"""

from PIL import Image
import os
import sys

def process_screenshot(input_path, output_path, target_size=(1280, 800)):
    """
    Process screenshot to meet Chrome Web Store requirements
    """
    try:
        # Open image
        img = Image.open(input_path)
        print(f"Original size: {img.size}")
        print(f"Original mode: {img.mode}")
        
        # Convert RGBA to RGB if needed (remove alpha channel)
        if img.mode == 'RGBA':
            # Create white background
            background = Image.new('RGB', img.size, (255, 255, 255))
            background.paste(img, mask=img.split()[3])  # Use alpha channel as mask
            img = background
            print("Converted RGBA to RGB")
        elif img.mode != 'RGB':
            img = img.convert('RGB')
            print(f"Converted to RGB")
        
        # Resize to target size (maintain aspect ratio, then crop or pad)
        img.thumbnail(target_size, Image.Resampling.LANCZOS)
        
        # Create new image with exact target size
        new_img = Image.new('RGB', target_size, (255, 255, 255))
        
        # Calculate position to center the image
        x_offset = (target_size[0] - img.size[0]) // 2
        y_offset = (target_size[1] - img.size[1]) // 2
        
        # Paste resized image onto new canvas
        new_img.paste(img, (x_offset, y_offset))
        
        # Save as PNG (24-bit, no alpha)
        new_img.save(output_path, 'PNG', optimize=True)
        print(f"✅ Saved: {output_path} ({new_img.size[0]}x{new_img.size[1]})")
        return True
        
    except Exception as e:
        print(f"❌ Error processing {input_path}: {e}")
        return False

def main():
    # Screenshot files
    screenshots = [
        'ScreenShot_2025-11-27_210820_950.png',
        'ScreenShot_2025-11-27_210941_315.png',
        'ScreenShot_2025-11-27_211036_390.png'
    ]
    
    # Create store-assets directory
    os.makedirs('store-assets', exist_ok=True)
    
    print("🖼️  Processing screenshots for Chrome Web Store...")
    print("=" * 60)
    
    # Process each screenshot
    for i, screenshot in enumerate(screenshots, 1):
        if not os.path.exists(screenshot):
            print(f"⚠️  File not found: {screenshot}")
            continue
        
        # Output filename
        output_name = f"store-assets/screenshot_{i}_1280x800.png"
        
        print(f"\n📸 Processing {i}/3: {screenshot}")
        process_screenshot(screenshot, output_name, target_size=(1280, 800))
    
    # Also create 640x400 versions
    print("\n" + "=" * 60)
    print("📐 Creating 640x400 versions...")
    
    for i, screenshot in enumerate(screenshots, 1):
        if not os.path.exists(screenshot):
            continue
        
        output_name = f"store-assets/screenshot_{i}_640x400.png"
        print(f"\n📸 Processing {i}/3: {screenshot}")
        process_screenshot(screenshot, output_name, target_size=(640, 400))
    
    print("\n" + "=" * 60)
    print("✅ All screenshots processed!")
    print("\n📁 Output directory: store-assets/")
    print("\n💡 Recommendation:")
    print("   - Use 1280x800 versions for better quality")
    print("   - All images are 24-bit PNG (no alpha channel)")
    print("   - Ready for Chrome Web Store submission!")

if __name__ == '__main__':
    main()


