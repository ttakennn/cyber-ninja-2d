param([string]$PlanPath = 'integration/ninja-ground-attacks/plan.json')
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$repo = Split-Path $PSScriptRoot -Parent
$plan = Get-Content (Join-Path $repo $PlanPath) -Raw -Encoding UTF8 | ConvertFrom-Json
$out = Join-Path $repo $plan.reviewDirectory
New-Item -ItemType Directory -Force $out | Out-Null
$body = [System.Drawing.Bitmap]::new((Join-Path $repo $plan.bodySource))
$fx = [System.Drawing.Bitmap]::new((Join-Path $repo $plan.fxSource))
$bodyPixelSize = @($body.Width, $body.Height); $fxPixelSize = @($fx.Width, $fx.Height)
$scale = $plan.bodyGuardHeight / $plan.bodySourceReferenceHeight
$bodyAtlas = [System.Drawing.Bitmap]::new(2048, 2048, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($bodyAtlas)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$hands = @()
$tips = @()
for ($i = 0; $i -lt 16; $i++) {
  $col = $i % 4; $row = [int][Math]::Floor($i / 4)
  $x = [int][Math]::Floor($body.Width * $col / 4); $y = [int][Math]::Floor($body.Height * $row / 4)
  $w = [int][Math]::Floor($body.Width * ($col + 1) / 4) - $x
  $h = [int][Math]::Floor($body.Height * ($row + 1) / 4) - $y
  $pose = $body.Clone([System.Drawing.Rectangle]::new($x, $y, $w, $h), [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $g.SetClip([System.Drawing.Rectangle]::new($col * 512, $row * 512, 512, 512))
  $g.DrawImage($pose, [System.Drawing.RectangleF]::new(($col * 512 + 192 - $plan.bodySourcePivotX * $scale), ($row * 512 + 353 - $plan.bodySourceGround[$i] * $scale), ($w * $scale), ($h * $scale)))
  $pose.Dispose()
  $hands += ,@((192 + ($plan.sourceHands[$i][0] - $plan.bodySourcePivotX) * $scale), (353 + ($plan.sourceHands[$i][1] - $plan.bodySourceGround[$i]) * $scale))
  $tips += ,@((192 + ($plan.sourceTips[$i][0] - $plan.bodySourcePivotX) * $scale), (353 + ($plan.sourceTips[$i][1] - $plan.bodySourceGround[$i]) * $scale))
}
$g.Dispose(); $bodyAtlas.Save((Join-Path $out 'body-atlas.png')); $bodyAtlas.Dispose()
$fxAtlas = [System.Drawing.Bitmap]::new(3072, 2304, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($fxAtlas)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
for ($i = 0; $i -lt 12; $i++) {
  $col = $i % 4; $row = [int][Math]::Floor($i / 4)
  $x = [int][Math]::Floor($fx.Width * $col / 4); $y = [int][Math]::Floor($fx.Height * $row / 3)
  $w = [int][Math]::Floor($fx.Width * ($col + 1) / 4) - $x
  $h = [int][Math]::Floor($fx.Height * ($row + 1) / 3) - $y
  $pose = $fx.Clone([System.Drawing.Rectangle]::new($x, $y, $w, $h), [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $g.SetClip([System.Drawing.Rectangle]::new($col * 768, $row * 768, 768, 768))
  $g.DrawImage($pose, [System.Drawing.Rectangle]::new($col * 768, $row * 768, 768, 768))
  $pose.Dispose()
}
$g.Dispose(); $fxAtlas.Save((Join-Path $out 'fire-slash-atlas.png')); $body.Dispose(); $fx.Dispose()
$composite = [System.Drawing.Bitmap]::new(1600, 2280, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$cg = [System.Drawing.Graphics]::FromImage($composite)
$cg.Clear([System.Drawing.Color]::FromArgb(255, 16, 28, 48))
$cg.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$bodyReview = [System.Drawing.Bitmap]::new((Join-Path $out 'body-atlas.png'))
$font = [System.Drawing.Font]::new('Arial', 22)
$pen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(255, 80, 105, 140))
$caption = ConvertFrom-Json '"\u0110\u00f2n {0} - C\u01a1 th\u1ec3 + cung l\u1eeda ri\u00eang (\u1ea3nh c\u0103n l\u1edbp)"'
for ($row = 0; $row -lt 3; $row++) {
  $poseIndex = @(3,8,13)[$row]; $ground = $row * 760 + 580; $rootX = 790
  $tip = $tips[$poseIndex]; $hx = $rootX - 192 + $tip[0] + $plan.fxTipOffset[$row][0]; $hy = $ground - 353 + $tip[1] + $plan.fxTipOffset[$row][1]
  $pivot = $plan.fxPivots[$row][1]; $effectScale = $plan.fxScales.extended
  $cg.DrawLine($pen, 45, $ground, 1555, $ground)
  $cg.DrawString(($caption -f ($row + 1)), $font, [System.Drawing.Brushes]::Wheat, 45, ($row * 760 + 30))
  $cg.DrawImage($fxAtlas, [System.Drawing.RectangleF]::new(($hx - $pivot[0] * $effectScale), ($hy - $pivot[1] * $effectScale), (768 * $effectScale), (768 * $effectScale)), [System.Drawing.RectangleF]::new(768, ($row * 768), 768, 768), [System.Drawing.GraphicsUnit]::Pixel)
  $cg.DrawImage($bodyReview, [System.Drawing.Rectangle]::new(($rootX - 192), ($ground - 353), 512, 512), [System.Drawing.Rectangle]::new(($poseIndex % 4 * 512), ([int][Math]::Floor($poseIndex / 4) * 512), 512, 512), [System.Drawing.GraphicsUnit]::Pixel)
}
$cg.Dispose(); $font.Dispose(); $pen.Dispose(); $bodyReview.Dispose(); $fxAtlas.Dispose()
$composite.Save((Join-Path $out 'impact-registration.png')); $composite.Dispose()
$plan | Add-Member -NotePropertyName hands -NotePropertyValue $hands
$plan | Add-Member -NotePropertyName tips -NotePropertyValue $tips
$plan | Add-Member -NotePropertyName bodyScale -NotePropertyValue $scale
$refs = Join-Path $out 'reference'; New-Item -ItemType Directory -Force $refs | Out-Null
$legacy = @()
foreach ($name in @('attack_1', 'attack_2', 'attack_3')) {
  $metadata = Get-Content (Join-Path $repo "docs/characters/ninja/animation/attacks/$name.json") -Raw -Encoding UTF8 | ConvertFrom-Json
  $legacy += $metadata.clips.$name
  Copy-Item -LiteralPath (Join-Path $repo "docs/characters/ninja/animation/attacks/$name.png") -Destination (Join-Path $refs "$name.png")
}
$plan | Add-Member -NotePropertyName legacy -NotePropertyValue $legacy
[System.IO.File]::WriteAllText((Join-Path $out 'review.json'), ($plan | ConvertTo-Json -Depth 16), [System.Text.UTF8Encoding]::new($false))
[System.IO.File]::WriteAllText((Join-Path $out 'review-data.js'), ('window.groundReview=' + ($plan | ConvertTo-Json -Depth 16 -Compress) + ';'), [System.Text.UTF8Encoding]::new($false))
Copy-Item -LiteralPath (Join-Path $repo 'integration/ninja-ground-attacks/preview.html') -Destination (Join-Path $out 'preview.html')
Copy-Item -LiteralPath (Join-Path $repo 'integration/ninja-ground-attacks/preview.js') -Destination (Join-Path $out 'preview.js')
Copy-Item -LiteralPath (Join-Path $repo 'integration/ninja-run-hurt-revision/idle-reference.png') -Destination (Join-Path $out 'idle-reference.png')
Copy-Item -LiteralPath (Join-Path $repo 'integration/ninja-combo-separated/reference/ground-combo-motion.png') -Destination (Join-Path $refs 'motion-reference.png')
$hashFiles = @($plan.bodySource, $plan.fxSource, $PlanPath, 'integration/ninja-ground-attacks/body-prompt.txt', 'integration/ninja-ground-attacks/body-fix-prompt.txt', 'integration/ninja-ground-attacks/fx-prompt.txt', 'integration/ninja-ground-attacks/preview.js', "$($plan.reviewDirectory)/body-atlas.png", "$($plan.reviewDirectory)/fire-slash-atlas.png", "$($plan.reviewDirectory)/impact-registration.png")
$hashes = foreach ($file in $hashFiles) { @{ path = $file; sha256 = (Get-FileHash -LiteralPath (Join-Path $repo $file) -Algorithm SHA256).Hash.ToLower() } }
@{ status = $plan.status; tool = 'image_gen.imagegen'; bodySourceSize = $bodyPixelSize; fxSourceSize = $fxPixelSize; bodyReviewRound = 2; referenceTransport = 'Conversation images: user marked Ground Attacks, local motion reference, approved attack1 and Idle. Body revision references preceding draft; FX references last five images.'; files = $hashes; artApproval = 'PENDING'; runtimeChanged = $false } | ConvertTo-Json -Depth 8 | Set-Content -Encoding UTF8 (Join-Path $out 'provenance.json')
Write-Output 'Authored separate body/FX atlases, metadata and Ground Attacks review preview.'
