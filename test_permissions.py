#!/usr/bin/env python3
import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
"""
测试SearchHub扩展权限配置
验证所有必需的域名都包含在host_permissions中
"""

import json
import re

def load_manifest(filename):
    """加载manifest文件"""
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"❌ 文件不存在: {filename}")
        return None
    except json.JSONDecodeError as e:
        print(f"❌ JSON解析错误 {filename}: {e}")
        return None

def get_domains_from_config():
    """从config.js中提取所有域名"""
    domains = set()

    try:
        with open('scripts/config.js', 'r', encoding='utf-8') as f:
            content = f.read()

        # 提取URL中的域名
        url_pattern = r"https://([^/]+)/"
        urls = re.findall(url_pattern, content)

        for url in urls:
            # 清理域名，移除动态部分
            clean_url = re.sub(r'[^a-zA-Z0-9.-]', '', url)
            if '.' in clean_url and len(clean_url) > 5:
                domains.add(clean_url)

    except FileNotFoundError:
        print("⚠️  scripts/config.js 不存在")

    return domains

def get_domains_from_background():
    """从background.js中提取所有域名"""
    domains = set()

    try:
        with open('background.js', 'r', encoding='utf-8') as f:
            content = f.read()

        # 提取URL中的域名
        url_pattern = r"https://([^/]+)/"
        urls = re.findall(url_pattern, content)

        for url in urls:
            # 清理域名，移除动态部分
            clean_url = re.sub(r'[^a-zA-Z0-9.-]', '', url)
            if '.' in clean_url and len(clean_url) > 5:
                domains.add(clean_url)

    except FileNotFoundError:
        print("⚠️  background.js 不存在")

    return domains

def check_permissions(manifest, required_domains):
    """检查manifest是否包含所需的权限"""
    if not manifest:
        return False

    host_permissions = manifest.get('host_permissions', [])
    permissions = manifest.get('permissions', [])

    print(f"\n📋 权限检查结果:")
    print(f"   host_permissions: {len(host_permissions)} 项")
    print(f"   permissions: {len(permissions)} 项")

    # 检查activeTab权限
    has_active_tab = 'activeTab' in permissions
    print(f"   activeTab: {'✅' if has_active_tab else '❌'}")

    # 检查必需域名
    missing_domains = []
    matched_domains = []

    for domain in required_domains:
        domain_pattern = f"https://*.{domain}/*" if '.' in domain.split('.')[0] else f"https://{domain}/*"
        found = any(domain in perm for perm in host_permissions)

        if found:
            matched_domains.append(domain)
        else:
            missing_domains.append(domain)

    print(f"\n🔍 域名匹配结果:")
    print(f"   ✅ 已匹配: {len(matched_domains)} 个")
    print(f"   ❌ 缺失: {len(missing_domains)} 个")

    if missing_domains:
        print(f"\n⚠️  缺失的域名:")
        for domain in missing_domains:
            print(f"   - {domain}")

    return len(missing_domains) == 0

def test_manifests():
    """测试所有manifest版本"""
    print("🧪 开始测试SearchHub权限配置...")

    # 获取所有必需的域名
    config_domains = get_domains_from_config()
    background_domains = get_domains_from_background()
    all_domains = config_domains.union(background_domains)

    print(f"\n📊 发现的域名总数: {len(all_domains)}")

    # 测试各版本manifest
    manifests = [
        ('manifest.json', '当前版本'),
        ('manifest_optimized.json', '优化版本'),
        ('manifest_minimal.json', '最小版本')
    ]

    results = {}

    for filename, description in manifests:
        print(f"\n{'='*50}")
        print(f"📄 测试 {description} ({filename})")
        print(f"{'='*50}")

        manifest = load_manifest(filename)
        if manifest:
            is_complete = check_permissions(manifest, all_domains)
            results[filename] = {
                'description': description,
                'complete': is_complete,
                'loaded': True
            }
        else:
            results[filename] = {
                'description': description,
                'complete': False,
                'loaded': False
            }

    # 总结
    print(f"\n{'='*50}")
    print("📊 测试总结")
    print(f"{'='*50}")

    for filename, result in results.items():
        status = "✅ 完整" if result['complete'] else "❌ 不完整" if result['loaded'] else "⚠️  加载失败"
        print(f"   {result['description']:<15} {status}")

    print(f"\n💡 建议:")
    print("   1. 使用 manifest.json (已优化版本) 提交审核")
    print("   2. 权限已从 <all_urls> 优化为具体域名")
    print("   3. 保留 activeTab 权限确保用户控制")
    print("   4. 所有功能应该正常工作")

if __name__ == "__main__":
    test_manifests()