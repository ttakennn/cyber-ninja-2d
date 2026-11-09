param([string]$PlanPath = 'integration/ninja-combo-separated/combo-plan.json')
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$repo = Split-Path $PSScriptRoot -Parent
$plan = Get-Content (Join-Path $repo $PlanPath) -Raw -Encoding UTF8 | ConvertFrom-Json
$out = Join-Path $repo $plan.reviewDirectory
New-Item -ItemType Directory -Force $out | Out-Null
$source = [System.Drawing.Bitmap]::new((Join-Path $repo $plan.source))
$sourcePixelSize = @($source.Width, $source.Height)
$scale = $plan.guardReferenceHeight / ($plan.sourceBodyReference[1] - $plan.sourceBodyReference[0] + 1)
$atlas = [System.Drawing.Bitmap]::new(2048, 2048, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($atlas)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
for ($i = 0; $i -lt 16; $i++) {
  $col = $i % 4; $row = [int][Math]::Floor($i / 4)
  $x = [int][Math]::Floor($source.Width * $col / 4); $y = [int][Math]::Floor($source.Height * $row / 4)
  $w = [int][Math]::Floor($source.Width * ($col + 1) / 4) - $x
  $h = [int][Math]::Floor($source.Height * ($row + 1) / 4) - $y
  $pose = $source.Clone([System.Drawing.Rectangle]::new($x, $y, $w, $h), [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $g.SetClip([System.Drawing.Rectangle]::new($col * 512, $row * 512, 512, 512))
  $target = [System.Drawing.RectangleF]::new(($col * 512 + 192 - $plan.sourcePivotX * $scale), ($row * 512 + 353 - $plan.sourceGround[$i] * $scale), ($w * $scale), ($h * $scale))
  $g.DrawImage($pose, $target)
  $pose.Dispose()
}
$g.Dispose()
$atlas.Save((Join-Path $out 'combo-atlas.png'))
$atlas.Dispose(); $source.Dispose()
$plan | Add-Member -NotePropertyName normalization -NotePropertyValue @{ scale = $scale; perFrameScale = $false; ground = $plan.sourceGround }
$json = $plan | ConvertTo-Json -Depth 12
[System.IO.File]::WriteAllText((Join-Path $out 'combo.json'), $json, [System.Text.UTF8Encoding]::new($false))
[System.IO.File]::WriteAllText((Join-Path $out 'combo-data.js'), ('window.comboReview=' + ($plan | ConvertTo-Json -Depth 12 -Compress) + ';'), [System.Text.UTF8Encoding]::new($false))
Copy-Item -LiteralPath (Join-Path $repo 'integration/ninja-combo-separated/preview.html') -Destination (Join-Path $out 'preview.html')
Copy-Item -LiteralPath (Join-Path $repo 'integration/ninja-run-hurt-revision/idle-reference.png') -Destination (Join-Path $out 'idle-reference.png')
$refs = Join-Path $out 'reference'
New-Item -ItemType Directory -Force $refs | Out-Null
foreach ($name in @('attack_1.png', 'attack_2.png', 'attack_3.png')) {
  Copy-Item -LiteralPath (Join-Path $repo "docs/characters/ninja/animation/attacks/$name") -Destination (Join-Path $refs $name)
}
$files = @($plan.source, 'integration/ninja-combo-separated/PROMPT.txt', 'integration/ninja-combo-separated/reference/ground-combo-motion.png', "$($plan.reviewDirectory)/combo-atlas.png")
$hashes = foreach ($file in $files) { @{ path = $file; sha256 = (Get-FileHash -LiteralPath (Join-Path $repo $file) -Algorithm SHA256).Hash.ToLower() } }
@{ tool = 'image_gen.imagegen'; sourcePixelSize = $sourcePixelSize; status = $plan.status; references = @('integration/ninja-combo-separated/reference/ground-combo-motion.png', 'docs/map01/commits/task-010-32-ninja-power-combo/combo-atlas.png', 'docs/characters/ninja/animation/attacks/attack_1.png', 'docs/characters/ninja/animation/attacks/attack_3.png', 'integration/ninja-run-hurt-revision/idle-reference.png'); referenceTransport = 'Five recent conversation images; old Task10.32 sheet is a negative reference. Direct Windows paths were rejected by image tool.'; files = $hashes; productionChanged = $false; runtimeChanged = $false } | ConvertTo-Json -Depth 8 | Set-Content -Encoding UTF8 (Join-Path $out 'provenance.json')
Write-Output 'Authored candidate atlas, metadata and review preview; production/runtime unchanged.'
