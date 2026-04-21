$v = "1.2.5"
$zip = "AI-Search-Hub-v$v.zip"
$files = @("manifest.json","index.html","sidebar.html","settings.html","popup.html","popup.js","background.js","content.js","content.css","icons","scripts","styles","_locales")
if (Test-Path $zip) { Remove-Item $zip }
Compress-Archive -Path $files -DestinationPath $zip -Force
$s = (Get-Item $zip).Length / 1MB
Write-Host "Created: $zip ($([math]::Round($s,2)) MB)"
