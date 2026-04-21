param(
  [string]$SourceDir = "store-assets/screenshots/src",
  [string]$OutDir = "store-assets/screenshots/out",
  [int]$Width = 1280,
  [int]$Height = 800,
  [switch]$AlsoGenerateSmall
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

if (!(Test-Path $SourceDir)) { New-Item -ItemType Directory -Path $SourceDir | Out-Null }
if (!(Test-Path $OutDir)) { New-Item -ItemType Directory -Path $OutDir | Out-Null }

Add-Type -AssemblyName System.Drawing

function Save-Jpeg24 {
  param(
    [System.Drawing.Bitmap]$Bitmap,
    [string]$Path,
    [int]$Quality = 92
  )
  $encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
  $encParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
  $qualityEnc = [System.Drawing.Imaging.Encoder]::Quality
  $encParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter($qualityEnc, [int64]$Quality)
  $Bitmap.Save($Path, $encoder, $encParams)
}

function Cover-Crop {
  param(
    [System.Drawing.Image]$Image,
    [int]$DstW,
    [int]$DstH
  )
  $srcW = $Image.Width
  $srcH = $Image.Height
  if ($srcW -le 0 -or $srcH -le 0) { throw "Invalid source image size" }
  $scaleW = $DstW / [double]$srcW
  $scaleH = $DstH / [double]$srcH
  $scale = [Math]::Max($scaleW, $scaleH)
  $scaledW = [int]([Math]::Ceiling($srcW * $scale))
  $scaledH = [int]([Math]::Ceiling($srcH * $scale))
  $offsetX = - [int](($scaledW - $DstW) / 2)
  $offsetY = - [int](($scaledH - $DstH) / 2)

  $bmp = New-Object System.Drawing.Bitmap($DstW, $DstH, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.Clear([System.Drawing.Color]::White)
  $g.DrawImage($Image, $offsetX, $offsetY, $scaledW, $scaledH)
  $g.Dispose()
  return $bmp
}

$files = @(Get-ChildItem -Path $SourceDir -File | Where-Object { $_.Extension -match '(?i)\.(png|jpg|jpeg)$' })
if ($files.Count -eq 0) {
  Write-Host "No source images found in $SourceDir. Please add 1–5 PNG/JPG screenshots." -ForegroundColor Yellow
  exit 0
}

if ($files.Count -gt 5) {
  Write-Host "Warning: Chrome Web Store allows up to 5 screenshots. Found $($files.Count)." -ForegroundColor Yellow
}

foreach ($f in $files) {
  $img = [System.Drawing.Image]::FromFile($f.FullName)
  try {
    $main = Cover-Crop -Image $img -DstW $Width -DstH $Height
    $outMain = Join-Path $OutDir "$($f.BaseName)-${Width}x${Height}.jpg"
    Save-Jpeg24 -Bitmap $main -Path $outMain -Quality 92
    $main.Dispose()

    if ($AlsoGenerateSmall) {
      $small = Cover-Crop -Image $img -DstW 640 -DstH 400
      $outSmall = Join-Path $OutDir "$($f.BaseName)-640x400.jpg"
      Save-Jpeg24 -Bitmap $small -Path $outSmall -Quality 92
      $small.Dispose()
    }

    Write-Host "✓ Processed: $($f.Name) -> $outMain" -ForegroundColor Green
  } finally {
    $img.Dispose()
  }
}

Write-Host "Done. Upload 1–5 files from: $OutDir" -ForegroundColor Cyan
