$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$root = $PSScriptRoot
$plan = Get-Content -LiteralPath (Join-Path $root 'animation-plan.json') -Raw -Encoding UTF8 | ConvertFrom-Json
$before = [Drawing.Bitmap]::new((Join-Path $root 'source/combo-b-before.png'))
$forward = [Drawing.Bitmap]::new((Join-Path $root 'source/combo-b-forward-generated.png'))
if ($before.Width -ne $forward.Width -or $before.Height -ne $forward.Height) { throw 'Combo source dimensions differ.' }
$sheet = [Drawing.Bitmap]::new($before.Width,$before.Height,[Drawing.Imaging.PixelFormat]::Format32bppArgb)
$graphics = [Drawing.Graphics]::FromImage($sheet)
for ($i=0; $i -lt $plan.sheets.'combo-b'.sourceRects.Count; $i++) {
  $r = $plan.sheets.'combo-b'.sourceRects[$i]
  $rect = [Drawing.Rectangle]::new($r[0],$r[1],$r[2],$r[3])
  $source = if ($plan.sheets.'combo-b'.selectedFrames -contains $i) { $forward } else { $before }
  $cell = $source.Clone($rect,[Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $graphics.DrawImageUnscaled($cell,$rect.X,$rect.Y)
  $cell.Dispose()
}
$graphics.Dispose()
$sheet.Save((Join-Path $root 'source/combo-b.png'),[Drawing.Imaging.ImageFormat]::Png)
$sheet.Dispose(); $before.Dispose(); $forward.Dispose()
