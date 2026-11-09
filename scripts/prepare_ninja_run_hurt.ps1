$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$repo = Split-Path $PSScriptRoot -Parent
$sourceDir = Join-Path $repo 'integration/ninja-run-hurt-revision'
$out = Join-Path $repo 'docs/map01/commits/task-010-29-ninja-run-hurt-art'
New-Item -ItemType Directory -Force $out | Out-Null
$original = [System.Drawing.Bitmap]::new((Join-Path $repo 'docs/characters/ninja/animation/locomotion/flame-ninja-atlas.png'))
$atlas = $original.Clone([System.Drawing.Rectangle]::new(0,0,$original.Width,$original.Height),[System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$metadata = Get-Content (Join-Path $repo 'docs/characters/ninja/animation/locomotion/animations.json') -Raw | ConvertFrom-Json
$audit = @()
foreach ($name in 'run','hurt') {
  $source = [System.Drawing.Bitmap]::new((Join-Path $sourceDir ($name+'-source.png')))
  $columns = if ($name -eq 'run') {4} else {2}
  $cellW = $source.Width / $columns
  $cellH = $source.Height / 2
  $top=$cellH; $bottom=-1
  for ($y=0;$y -lt $cellH;$y++) { for ($x=0;$x -lt $cellW;$x++) {
    if ($source.GetPixel($x,$y).A -ge 16) { $top=[Math]::Min($top,$y); $bottom=[Math]::Max($bottom,$y) }
  } }
  if ($bottom -lt 0) { throw 'Empty source pose' }
  # One uniform transform per complete clip; never fit each frame independently.
  $targetHeight = if ($name -eq 'run') {242} else {251}
  $scale = $targetHeight / ($bottom-$top+1)
  $sheet = [System.Drawing.Bitmap]::new(384*$columns,640,[System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  for ($i=0;$i -lt $metadata.clips.$name.frames.Count;$i++) {
    $cell = $source.Clone([System.Drawing.Rectangle]::new(($i%$columns)*$cellW,[Math]::Floor($i/$columns)*$cellH,$cellW,$cellH),[System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $pose = [System.Drawing.Bitmap]::new(384,320,[System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g=[System.Drawing.Graphics]::FromImage($pose)
    $g.InterpolationMode=[System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.DrawImage($cell,[System.Drawing.RectangleF]::new((192-$cellW/2*$scale),(289-($bottom+1)*$scale),($cellW*$scale),($cellH*$scale)))
    $g.Dispose(); $cell.Dispose()
    $g=[System.Drawing.Graphics]::FromImage($sheet); $g.DrawImageUnscaled($pose,($i%$columns)*384,[Math]::Floor($i/$columns)*320); $g.Dispose()
    $f=$metadata.clips.$name.frames[$i]
    $g=[System.Drawing.Graphics]::FromImage($atlas)
    $g.CompositingMode=[System.Drawing.Drawing2D.CompositingMode]::SourceCopy
    $g.DrawImageUnscaled($pose,[int]$f.x,[int]$f.y)
    $g.Dispose(); $pose.Dispose()
  }
  $sheet.Save((Join-Path $out ($name+'-poses.png'))); $sheet.Dispose(); $source.Dispose()
  $audit += [pscustomobject]@{clip=$name;scale=$scale;sourceBaseline=$bottom+1;targetReferenceHeight=$targetHeight;perFrameFit=$false}
}
$atlas.Save((Join-Path $out 'flame-ninja-atlas-candidate.png'))
# Artwork invariant check requested by scope: compare every pixel outside the two edited clips.
$allowed=@($metadata.clips.run.frames)+@($metadata.clips.hurt.frames)
for ($y=0;$y -lt $original.Height;$y++) { for ($x=0;$x -lt $original.Width;$x++) {
  $editable=$false
  foreach($f in $allowed) { if($x -ge $f.x -and $x -lt $f.x+$f.width -and $y -ge $f.y -and $y -lt $f.y+$f.height) {$editable=$true;break} }
  if(!$editable -and $original.GetPixel($x,$y).ToArgb() -ne $atlas.GetPixel($x,$y).ToArgb()) {throw 'Pixel changed outside run/hurt'}
} }
$audit | ConvertTo-Json | Set-Content -Encoding UTF8 (Join-Path $out 'normalization.json')
$atlas.Dispose(); $original.Dispose()
Write-Output 'Candidate saved; pixels outside run/hurt preserved.'
