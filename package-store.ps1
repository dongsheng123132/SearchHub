# AI Search Hub 打包脚本 for Chrome Web Store
# 使用方法：在 PowerShell 中运行 .\package-store.ps1

$version = "1.2.1"
$zipName = "AI-Search-Hub-v$version.zip"

Write-Host "📦 开始打包 AI Search Hub v$version..." -ForegroundColor Green

# 需要包含的文件和文件夹（Chrome 商店必需）
$filesToInclude = @(
    "manifest.json",
    "index.html",
    "sidebar.html",
    "settings.html",
    "popup.html",
    "popup.js",
    "background.js",
    "content.js",
    "content.css",
    "icons",
    "scripts",
    "styles",
    "_locales"
)

# 检查必需文件是否存在
Write-Host "`n🔍 检查必需文件..." -ForegroundColor Yellow
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

# 创建临时打包目录
$tempDir = "temp_package_$version"
if (Test-Path $tempDir) {
    Write-Host "`n🗑️  清理临时目录..." -ForegroundColor Yellow
    Remove-Item $tempDir -Recurse -Force
}
New-Item -ItemType Directory -Path $tempDir | Out-Null

# 复制文件到临时目录
Write-Host "`n📋 复制文件到临时目录..." -ForegroundColor Yellow

foreach ($item in $filesToInclude) {
    if (Test-Path $item) {
        $destPath = Join-Path $tempDir $item
        if (Test-Path $item -PathType Container) {
            # 复制文件夹
            Copy-Item -Path $item -Destination $destPath -Recurse -Force
            Write-Host "  ✅ 复制文件夹: $item" -ForegroundColor Green
        } else {
            # 复制文件
            $destDir = Split-Path $destPath -Parent
            if (-not (Test-Path $destDir)) {
                New-Item -ItemType Directory -Path $destDir -Force | Out-Null
            }
            Copy-Item -Path $item -Destination $destPath -Force
            Write-Host "  ✅ 复制文件: $item" -ForegroundColor Green
        }
    }
}

# 删除旧的 ZIP 文件
if (Test-Path $zipName) {
    Write-Host "`n🗑️  删除旧的 ZIP 文件..." -ForegroundColor Yellow
    Remove-Item $zipName -Force
}

# 创建 ZIP 文件
Write-Host "`n📦 创建 ZIP 文件..." -ForegroundColor Yellow
try {
    # 使用 Compress-Archive 压缩整个临时目录
    Compress-Archive -Path "$tempDir\*" -DestinationPath $zipName -Force
    Write-Host "  ✅ ZIP 文件创建成功: $zipName" -ForegroundColor Green
} catch {
    Write-Host "  ❌ 创建 ZIP 文件失败: $_" -ForegroundColor Red
    Remove-Item $tempDir -Recurse -Force -ErrorAction SilentlyContinue
    exit 1
}

# 清理临时目录
Write-Host "`n🧹 清理临时文件..." -ForegroundColor Yellow
Remove-Item $tempDir -Recurse -Force

# 检查 ZIP 文件
$zipFile = Get-Item $zipName -ErrorAction SilentlyContinue
if ($zipFile) {
    $zipSize = $zipFile.Length / 1MB
    Write-Host "`n📊 ZIP 文件信息:" -ForegroundColor Cyan
    Write-Host "  文件名: $zipName" -ForegroundColor White
    Write-Host "  大小: $([math]::Round($zipSize, 2)) MB" -ForegroundColor White
    Write-Host "  位置: $($zipFile.FullName)" -ForegroundColor White
    
    if ($zipSize -gt 20) {
        Write-Host "  ⚠️  警告：ZIP 文件超过 20MB，Chrome Web Store 可能拒绝！" -ForegroundColor Yellow
    } else {
        Write-Host "  ✅ 文件大小符合要求（< 20MB）" -ForegroundColor Green
    }
    
    # 验证 ZIP 文件内容
    Write-Host "`n🔍 验证 ZIP 文件内容..." -ForegroundColor Yellow
    try {
        Add-Type -AssemblyName System.IO.Compression.FileSystem
        $zip = [System.IO.Compression.ZipFile]::OpenRead($zipFile.FullName)
        $entries = $zip.Entries | Select-Object -First 10
        Write-Host "  ✅ ZIP 文件有效，包含以下文件（前10个）：" -ForegroundColor Green
        $entries | ForEach-Object { Write-Host "    - $($_.FullName)" -ForegroundColor Gray }
        $zip.Dispose()
    } catch {
        Write-Host "  ⚠️  无法验证 ZIP 文件内容" -ForegroundColor Yellow
    }
} else {
    Write-Host "  ❌ ZIP 文件创建失败！" -ForegroundColor Red
    exit 1
}

Write-Host "`n✅ 打包完成！" -ForegroundColor Green
Write-Host "`n📋 下一步操作：" -ForegroundColor Cyan
Write-Host "  1. 测试 ZIP 文件（解压并在 Chrome 中加载测试）" -ForegroundColor White
Write-Host "  2. 访问 Chrome Web Store 开发者后台" -ForegroundColor White
Write-Host "     https://chrome.google.com/webstore/devconsole" -ForegroundColor Gray
Write-Host "  3. 选择你的扩展，点击 '上传新程序包'" -ForegroundColor White
Write-Host "  4. 上传 $zipName" -ForegroundColor White
Write-Host "  5. 填写商店信息（使用 CHROME_STORE_COMPLETE_CONTENT.md）" -ForegroundColor White
Write-Host "  6. 提交审核" -ForegroundColor White
Write-Host ""
