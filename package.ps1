# SearchHub 打包脚本 for Chrome Web Store
# 使用方法：在 PowerShell 中运行 .\package.ps1

$version = "1.1.0"
$zipName = "SearchHub-v$version.zip"

Write-Host "📦 开始打包 SearchHub v$version..." -ForegroundColor Green

# 需要包含的文件和文件夹
$filesToInclude = @(
    "manifest.json",
    "index.html",
    "sidebar.html",
    "settings.html",
    "background.js",
    "content.js",
    "content.css",
    "icons",
    "scripts",
    "styles",
    "_locales"
)

# 检查文件是否存在
Write-Host "`n🔍 检查文件..." -ForegroundColor Yellow
$missingFiles = @()
foreach ($file in $filesToInclude) {
    if (Test-Path $file) {
        Write-Host "  ✅ $file" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $file (缺失!)" -ForegroundColor Red
        $missingFiles += $file
    }
}

if ($missingFiles.Count -gt 0) {
    Write-Host "`n❌ 错误：以下文件缺失，无法打包！" -ForegroundColor Red
    $missingFiles | ForEach-Object { Write-Host "  - $_" -ForegroundColor Red }
    exit 1
}

# 删除旧的 ZIP 文件
if (Test-Path $zipName) {
    Write-Host "`n🗑️  删除旧的 ZIP 文件..." -ForegroundColor Yellow
    Remove-Item $zipName -Force
}

# 创建 ZIP 文件
Write-Host "`n📦 创建 ZIP 文件..." -ForegroundColor Yellow
try {
    Compress-Archive -Path $filesToInclude -DestinationPath $zipName -Force
    Write-Host "  ✅ ZIP 文件创建成功: $zipName" -ForegroundColor Green
} catch {
    Write-Host "  ❌ 创建 ZIP 文件失败: $_" -ForegroundColor Red
    exit 1
}

# 检查 ZIP 文件大小
$zipSize = (Get-Item $zipName).Length / 1MB
Write-Host "`n📊 ZIP 文件信息:" -ForegroundColor Cyan
Write-Host "  文件名: $zipName" -ForegroundColor White
Write-Host "  大小: $([math]::Round($zipSize, 2)) MB" -ForegroundColor White

if ($zipSize -gt 20) {
    Write-Host "  ⚠️  警告：ZIP 文件超过 20MB，Chrome Web Store 可能拒绝！" -ForegroundColor Yellow
} else {
    Write-Host "  ✅ 文件大小符合要求（< 20MB）" -ForegroundColor Green
}

Write-Host "`n✅ 打包完成！" -ForegroundColor Green
Write-Host "`n📋 下一步：" -ForegroundColor Cyan
Write-Host "  1. 测试 ZIP 文件（解压并在 Chrome 中加载）" -ForegroundColor White
Write-Host "  2. 访问 https://chrome.google.com/webstore/devconsole" -ForegroundColor White
Write-Host "  3. 上传 $zipName 到 Chrome Web Store" -ForegroundColor White
Write-Host ""

