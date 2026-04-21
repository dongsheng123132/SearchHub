# Simple package script for Chrome Web Store
$version = "1.2.0"
$zipName = "AI-Search-Hub-v$version.zip"

Write-Host "Starting package..." -ForegroundColor Green

# Files to include
$files = @(
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

# Check files
Write-Host "Checking files..." -ForegroundColor Yellow
$missing = @()
foreach ($f in $files) {
    if (Test-Path $f) {
        Write-Host "  OK: $f" -ForegroundColor Green
    } else {
        Write-Host "  MISSING: $f" -ForegroundColor Red
        $missing += $f
    }
}

if ($missing.Count -gt 0) {
    Write-Host "ERROR: Missing files!" -ForegroundColor Red
    exit 1
}

# Remove old zip
if (Test-Path $zipName) {
    Remove-Item $zipName -Force
    Write-Host "Removed old zip file" -ForegroundColor Yellow
}

# Create zip
Write-Host "Creating ZIP..." -ForegroundColor Yellow
try {
    Compress-Archive -Path $files -DestinationPath $zipName -Force
    Write-Host "SUCCESS: $zipName created!" -ForegroundColor Green
} catch {
    Write-Host "ERROR: $_" -ForegroundColor Red
    exit 1
}

# Check size
$size = (Get-Item $zipName).Length / 1MB
Write-Host "File size: $([math]::Round($size, 2)) MB" -ForegroundColor Cyan

if ($size -gt 20) {
    Write-Host "WARNING: File size > 20MB!" -ForegroundColor Yellow
} else {
    Write-Host "File size OK" -ForegroundColor Green
}

Write-Host "Done! File: $zipName" -ForegroundColor Green