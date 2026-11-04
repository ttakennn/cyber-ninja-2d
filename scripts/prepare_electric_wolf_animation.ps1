param([string]$OnlySheet = '', [switch]$PublishOnly)
$ErrorActionPreference = 'Stop'
if(!$PublishOnly) {
Add-Type -AssemblyName System.Drawing
Add-Type -ReferencedAssemblies System.Drawing @'
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;
public static class WolfMotionInk {
  public static int[] Bounds(Bitmap image) {
    using(var b=image.Clone(new Rectangle(0,0,image.Width,image.Height),PixelFormat.Format32bppArgb)) {
      var d=b.LockBits(new Rectangle(0,0,b.Width,b.Height),ImageLockMode.ReadOnly,PixelFormat.Format32bppArgb);
      var bytes=new byte[Math.Abs(d.Stride)*b.Height]; Marshal.Copy(d.Scan0,bytes,0,bytes.Length); b.UnlockBits(d);
      int left=b.Width,top=b.Height,right=-1,bottom=-1;
      for(int y=0;y<b.Height;y++)for(int x=0;x<b.Width;x++)if(bytes[y*Math.Abs(d.Stride)+x*4+3]>=128) {
        left=Math.Min(left,x);top=Math.Min(top,y);right=Math.Max(right,x);bottom=Math.Max(bottom,y);
      }
      if(right<0)throw new Exception("No sprite pixels in source cell");
      return new int[]{left,top,right,bottom};
    }
  }
}
'@
}
$repo = Split-Path $PSScriptRoot -Parent
$root = Join-Path $repo 'integration/task-010-electric-wolf/animation'
$production = Join-Path $repo 'docs/characters/electric-wolf/animation'
$plan = Get-Content -LiteralPath (Join-Path $root 'animation-plan.json') -Raw -Encoding UTF8 | ConvertFrom-Json
$evidence = if($PublishOnly){$production}else{Join-Path $repo $plan.reviewDirectory}
$legacyEvidence = Join-Path $repo 'docs/map01/commits/task-010-02-electric-wolf-animation'
foreach($directory in @($evidence,(Join-Path $evidence 'candidate'),(Join-Path $evidence 'reference'))) { New-Item -ItemType Directory -Path $directory -Force | Out-Null }
$assets = [ordered]@{}
if($OnlySheet -or $PublishOnly) {
  if($OnlySheet -and $plan.sheets.PSObject.Properties.Name -notcontains $OnlySheet) { throw "Unknown source sheet: $OnlySheet" }
  $existing = Get-Content -LiteralPath (Join-Path $root 'atlas.json') -Raw -Encoding UTF8 | ConvertFrom-Json
  foreach($property in $existing.assets.PSObject.Properties) { $assets[$property.Name]=$property.Value }
}
$utf8 = [Text.UTF8Encoding]::new($false)
foreach($name in @('locomotion','jump','climb','combo','hurt','dash','groundShock','groundWave','spawn','spawnSmoke')) {
  if($PublishOnly) { continue }
  if($OnlySheet -and $name -ne $OnlySheet) { continue }
  $spec = $plan.sheets.$name
  $sourcePath=if($spec.source){$spec.source}else{"source/$name.png"}
  $imagePath=if($spec.image){$spec.image}else{"candidate/$name.png"}
  $source = Join-Path $root $sourcePath
  $raw = [Drawing.Bitmap]::new($source)
  $columns=if($spec.sourceColumns){$spec.sourceColumns}else{$plan.sourceColumns}
  $rows=if($spec.sourceRows){$spec.sourceRows}else{$plan.sourceRows}
  if(!$spec.sourceRects -and ($raw.Width%$columns -or $raw.Height%$rows)) { throw "Source grid is not divisible: $name" }
  $sw = [int]($raw.Width/$columns); $sh = [int]($raw.Height/$rows)
  $first = $raw.Clone([Drawing.Rectangle]::new(0,0,$sw,$sh),[Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $referenceInk = [WolfMotionInk]::Bounds($first);$first.Dispose()
  $scale = if($spec.targetCellWidthPx){$spec.targetCellWidthPx/$sw}else{$plan.targetInkHeightPx/($referenceInk[3]-$referenceInk[1]+1)}
  $fw = $plan.frameSize[0];$fh = $plan.frameSize[1]
  $sheet = [Drawing.Bitmap]::new(($fw*4),($fh*2),[Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $sg = [Drawing.Graphics]::FromImage($sheet)
  $frames = @()
  for($i=0;$i -lt 8;$i++) {
    $r=if($spec.sourceRects){$spec.sourceRects[$i]}else{@((($i%$columns)*$sw),([int][Math]::Floor($i/$columns)*$sh),$sw,$sh)}
    $sx=$r[0];$sy=$r[1]
    $cell=$raw.Clone([Drawing.Rectangle]::new($sx,$sy,$r[2],$r[3]),[Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $ink=[WolfMotionInk]::Bounds($cell)
    $anchorY=if($spec.groundedFrames -contains $i){$ink[3]}else{$referenceInk[3]}
    $anchorX=($i%$columns)*$sw+$sw*$plan.sourceHipXRatio-$sx
    $left=[int][Math]::Round($plan.pivot[0]-$anchorX*$scale)
    $top=[int][Math]::Round($plan.pivot[1]-$anchorY*$scale)
    $pose=[Drawing.Bitmap]::new($fw,$fh,[Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $pg=[Drawing.Graphics]::FromImage($pose)
    $pg.InterpolationMode=[Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $pg.DrawImage($cell,[Drawing.Rectangle]::new($left,$top,[int][Math]::Round($r[2]*$scale),[int][Math]::Round($r[3]*$scale)))
    $pg.Dispose();$cell.Dispose()
    $x=($i%4)*$fw;$y=[int][Math]::Floor($i/4)*$fh
    $sg.DrawImageUnscaled($pose,$x,$y)
    $frames+=@{index=$i;sourceRect=$r;sourceInk128=$ink;sourceAnchor=@($anchorX,$anchorY);translation=@($left,$top);rect=@($x,$y,$fw,$fh);pivot=$plan.pivot;ink128=[WolfMotionInk]::Bounds($pose)}
    $pose.Dispose()
  }
  $sg.Dispose()
  $target=Join-Path $root $imagePath
  $sheet.Save($target,[Drawing.Imaging.ImageFormat]::Png)
  $asset=[ordered]@{image=$imagePath;source=$sourcePath;pixelSize=@($sheet.Width,$sheet.Height);sourcePixelSize=@($raw.Width,$raw.Height);frameSize=$plan.frameSize;uniformScale=$scale;referenceInk128=$referenceInk;frames=$frames;original=$spec.original;prompt=$spec.prompt;tool=$plan.tool;sourceSha256=(Get-FileHash -LiteralPath $source -Algorithm SHA256).Hash.ToLower();sha256=(Get-FileHash -LiteralPath $target -Algorithm SHA256).Hash.ToLower()}
  $assets[$name]=$asset
  [IO.File]::WriteAllText([IO.Path]::ChangeExtension($target,'json'),($asset|ConvertTo-Json -Depth 10),$utf8)
  $panelWidth=if($name -eq 'combo' -or $name -eq 'dash'){400}else{320}
  $board=[Drawing.Bitmap]::new(($panelWidth*4),720)
  $bg=[Drawing.Graphics]::FromImage($board);$bg.Clear([Drawing.Color]::FromArgb(9,21,42))
  $font=[Drawing.Font]::new('Segoe UI',12);$pen=[Drawing.Pen]::new([Drawing.Color]::FromArgb(90,115,145))
  for($i=0;$i -lt 8;$i++) {
    $cx=($i%4)*$panelWidth+$panelWidth/2;$baseY=[int][Math]::Floor($i/4)*360+290
    $state=$bg.Save();$bg.SetClip([Drawing.Rectangle]::new((($i%4)*$panelWidth),([int][Math]::Floor($i/4)*360),$panelWidth,360))
    $bg.DrawLine($pen,($cx-$panelWidth/2+10),$baseY,($cx+$panelWidth/2-10),$baseY)
    $bg.DrawImage($sheet,[Drawing.Rectangle]::new(($cx-$plan.pivot[0]),($baseY-$plan.pivot[1]),$fw,$fh),[Drawing.Rectangle]::new((($i%4)*$fw),([int][Math]::Floor($i/4)*$fh),$fw,$fh),[Drawing.GraphicsUnit]::Pixel)
    $bg.Restore($state);$bg.DrawString(($name+' / '+$i),$font,[Drawing.Brushes]::LightCyan,[single]($cx-120),[single]($baseY+20))
  }
  $bg.Dispose();$font.Dispose();$pen.Dispose();$board.Save((Join-Path $evidence "$name-contact.png"),[Drawing.Imaging.ImageFormat]::Png)
  $board.Dispose();$sheet.Dispose();$raw.Dispose()
}
$metadata=[ordered]@{status=$plan.status;approvedClips=$plan.approvedClips;approvedEffects=$plan.approvedEffects;characterDesign=$plan.characterDesign;plan='animation-plan.json';frameSize=$plan.frameSize;pivot=$plan.pivot;pixelsPerWorldUnit=$plan.densityPxPerWorldUnit;visualWorldSize=@(($plan.frameSize[0]/$plan.densityPxPerWorldUnit),($plan.frameSize[1]/$plan.densityPxPerWorldUnit));scalePolicy=$plan.scalePolicy;effectScalePolicy=$plan.effectScalePolicy;timingStatus=$plan.timingStatus;assets=$assets;clips=$plan.clips;gameplay=$plan.gameplay}
[IO.File]::WriteAllText((Join-Path $root 'atlas.json'),($metadata|ConvertTo-Json -Depth 14),$utf8)
[IO.File]::WriteAllText((Join-Path $root 'review-data.js'),('window.wolfAnimationReview='+($metadata|ConvertTo-Json -Depth 14 -Compress)+';'),$utf8)
foreach($name in $assets.Keys) {
  $asset=$assets[$name];$sourceImage=Join-Path $root $asset.image;$previewImage=Join-Path $evidence $asset.image
  Copy-Item -LiteralPath $sourceImage -Destination $previewImage -Force
  Copy-Item -LiteralPath ([IO.Path]::ChangeExtension($sourceImage,'json')) -Destination ([IO.Path]::ChangeExtension($previewImage,'json')) -Force
  $contact=Join-Path $evidence "$name-contact.png";$legacyContact=Join-Path $legacyEvidence "$name-contact.png"
  if(!(Test-Path -LiteralPath $contact) -and (Test-Path -LiteralPath $legacyContact)) { Copy-Item -LiteralPath $legacyContact -Destination $contact }
}
foreach($file in @('atlas.json','review-data.js')) { Copy-Item -LiteralPath (Join-Path $root $file) -Destination (Join-Path $evidence $file) -Force }
foreach($file in @('electric-wolf-ninja-v1.png','ninja-idle-reference.png')) { Copy-Item -LiteralPath (Join-Path $root "../source/$file") -Destination (Join-Path $evidence "reference/$file") -Force }
Copy-Item -LiteralPath (Join-Path $root '../review-data.js') -Destination (Join-Path $evidence 'reference/design-data.js') -Force
if(!$PublishOnly) { Copy-Item -LiteralPath (Join-Path $production 'preview.html') -Destination (Join-Path $evidence 'preview.html') -Force }
if($PublishOnly) { Write-Output 'Published approved wolf art and metadata to the character preview library without regenerating PNGs. Runtime unchanged.' }
else { Write-Output 'Authored wolf animation review in commits; production library and runtime unchanged.' }
