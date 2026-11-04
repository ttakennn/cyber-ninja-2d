param([string]$OnlySheet = '')
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
Add-Type -ReferencedAssemblies System.Drawing @'
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;
public static class NeonMotionInk {
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
$repo = Split-Path $PSScriptRoot -Parent
$root = Join-Path $repo 'integration/task-010-neon-shadow/animation'
$plan = Get-Content -LiteralPath (Join-Path $root 'animation-plan.json') -Raw -Encoding UTF8 | ConvertFrom-Json
$evidence = Join-Path $repo $plan.reviewDirectory
foreach($directory in @($evidence,(Join-Path $evidence 'candidate'),(Join-Path $evidence 'assets'))) { New-Item -ItemType Directory -Path $directory -Force | Out-Null }
Copy-Item -LiteralPath (Join-Path $root '../source/neon-shadow-v1.png') -Destination (Join-Path $evidence 'assets/neon-shadow-v1.png') -Force
Copy-Item -LiteralPath (Join-Path $repo 'integration/task-010-electric-wolf/source/ninja-idle-reference.png') -Destination (Join-Path $evidence 'assets/ninja-idle.png') -Force
Copy-Item -LiteralPath (Join-Path $repo 'integration/task-010-electric-wolf/source/electric-wolf-ninja-v1.png') -Destination (Join-Path $evidence 'assets/electric-wolf.png') -Force
$assets = [ordered]@{}
if($OnlySheet) {
  if($OnlySheet -and $plan.sheets.PSObject.Properties.Name -notcontains $OnlySheet) { throw "Unknown source sheet: $OnlySheet" }
  $existing = Get-Content -LiteralPath (Join-Path $root 'atlas.json') -Raw -Encoding UTF8 | ConvertFrom-Json
  foreach($property in $existing.assets.PSObject.Properties) { $assets[$property.Name]=$property.Value }
}
$utf8 = [Text.UTF8Encoding]::new($false)
foreach($name in $plan.sheets.PSObject.Properties.Name) {
  if($OnlySheet -and $name -ne $OnlySheet) { continue }
  $spec = $plan.sheets.$name
  $sourcePath=if($spec.source){$spec.source}else{"source/$name.png"}
  $imagePath=if($spec.image){$spec.image}else{"candidate/$name.png"}
  $source = Join-Path $root $sourcePath
  $raw = [Drawing.Bitmap]::new($source)
  $columns=$spec.columns
  $rows=$spec.rows
  if(!$spec.sourceRects -and ($raw.Width%$columns -or $raw.Height%$rows)) { throw "Source grid is not divisible: $name" }
  $sw = [int]($raw.Width/$columns); $sh = [int]($raw.Height/$rows)
  $first = $raw.Clone([Drawing.Rectangle]::new(0,0,$sw,$sh),[Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $referenceInk = [NeonMotionInk]::Bounds($first);$first.Dispose()
  $scale = if($spec.targetCellWidthPx){$spec.targetCellWidthPx/$sw}else{$plan.targetInkHeightPx/($referenceInk[3]-$referenceInk[1]+1)}
  $fw = $plan.frameSize[0];$fh = $plan.frameSize[1]
  $pivot=if($spec.pivot){$spec.pivot}else{$plan.pivot}
  $sheet = [Drawing.Bitmap]::new(($fw*$columns),($fh*$rows),[Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $sg = [Drawing.Graphics]::FromImage($sheet)
  $frames = @()
  for($i=0;$i -lt $spec.count;$i++) {
    $r=if($spec.sourceRects){$spec.sourceRects[$i]}else{@((($i%$columns)*$sw),([int][Math]::Floor($i/$columns)*$sh),$sw,$sh)}
    $sx=$r[0];$sy=$r[1]
    $cell=$raw.Clone([Drawing.Rectangle]::new($sx,$sy,$r[2],$r[3]),[Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $ink=[NeonMotionInk]::Bounds($cell)
    $anchorY=if($spec.sourceAnchors){$spec.sourceAnchors[$i][1]}elseif($spec.sourceAnchorRatio){$sh*$spec.sourceAnchorRatio[1]}elseif($spec.groundedFrames -contains $i){$ink[3]}else{$referenceInk[3]}
    $anchorX=if($spec.sourceAnchors){$spec.sourceAnchors[$i][0]}elseif($spec.sourceAnchorRatio){$sw*$spec.sourceAnchorRatio[0]}else{($i%$columns)*$sw+$sw*$plan.sourceHipXRatio-$sx}
    $left=[int][Math]::Round($pivot[0]-$anchorX*$scale)
    $top=[int][Math]::Round($pivot[1]-$anchorY*$scale)
    $pose=[Drawing.Bitmap]::new($fw,$fh,[Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $pg=[Drawing.Graphics]::FromImage($pose)
    $pg.InterpolationMode=[Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $pg.DrawImage($cell,[Drawing.Rectangle]::new($left,$top,[int][Math]::Round($r[2]*$scale),[int][Math]::Round($r[3]*$scale)))
    $pg.Dispose();$cell.Dispose()
    $x=($i%$columns)*$fw;$y=[int][Math]::Floor($i/$columns)*$fh
    $sg.DrawImageUnscaled($pose,$x,$y)
    $frames+=@{index=$i;sourceRect=$r;sourceInk128=$ink;sourceAnchor=@($anchorX,$anchorY);translation=@($left,$top);rect=@($x,$y,$fw,$fh);pivot=$pivot;ink128=[NeonMotionInk]::Bounds($pose)}
    $pose.Dispose()
  }
  $sg.Dispose()
  $target=Join-Path $root $imagePath
  $sheet.Save($target,[Drawing.Imaging.ImageFormat]::Png)
  $asset=[ordered]@{image=$imagePath;source=$sourcePath;pixelSize=@($sheet.Width,$sheet.Height);sourcePixelSize=@($raw.Width,$raw.Height);frameSize=$plan.frameSize;uniformScale=$scale;referenceInk128=$referenceInk;frames=$frames;original=$spec.original;prompt=$spec.prompt;tool=$plan.tool;sourceSha256=(Get-FileHash -LiteralPath $source -Algorithm SHA256).Hash.ToLower();sha256=(Get-FileHash -LiteralPath $target -Algorithm SHA256).Hash.ToLower()}
  $assets[$name]=$asset
  [IO.File]::WriteAllText([IO.Path]::ChangeExtension($target,'json'),($asset|ConvertTo-Json -Depth 10),$utf8)
  $panelWidth=if($spec.contactPanelWidth){$spec.contactPanelWidth}elseif($name -eq 'combo' -or $name -eq 'dash'){400}else{320}
  $panelHeight=if($spec.contactPanelHeight){$spec.contactPanelHeight}else{360}
  $board=[Drawing.Bitmap]::new(($panelWidth*4),([int][Math]::Ceiling($spec.count/4)*$panelHeight))
  $bg=[Drawing.Graphics]::FromImage($board);$bg.Clear([Drawing.Color]::FromArgb(9,21,42))
  $font=[Drawing.Font]::new('Segoe UI',12);$pen=[Drawing.Pen]::new([Drawing.Color]::FromArgb(90,115,145))
  for($i=0;$i -lt $spec.count;$i++) {
    $baseline=if($spec.contactBaseline){$spec.contactBaseline}elseif($pivot[1] -eq 256){180}else{290}
    $cx=($i%4)*$panelWidth+$panelWidth/2;$baseY=[int][Math]::Floor($i/4)*$panelHeight+$baseline
    $labelY=if($pivot[1] -eq 256){$baseY+140}else{$baseY+20}
    $state=$bg.Save();$bg.SetClip([Drawing.Rectangle]::new((($i%4)*$panelWidth),([int][Math]::Floor($i/4)*$panelHeight),$panelWidth,$panelHeight))
    $bg.DrawLine($pen,($cx-$panelWidth/2+10),$baseY,($cx+$panelWidth/2-10),$baseY)
    $bg.DrawImage($sheet,[Drawing.Rectangle]::new(($cx-$pivot[0]),($baseY-$pivot[1]),$fw,$fh),[Drawing.Rectangle]::new((($i%$columns)*$fw),([int][Math]::Floor($i/$columns)*$fh),$fw,$fh),[Drawing.GraphicsUnit]::Pixel)
    $bg.Restore($state);$bg.DrawString(($name+' / '+$i),$font,[Drawing.Brushes]::LightCyan,[single]($cx-120),[single]$labelY)
  }
  $bg.Dispose();$font.Dispose();$pen.Dispose();$board.Save((Join-Path $evidence "$name-contact.png"),[Drawing.Imaging.ImageFormat]::Png)
  $board.Dispose();$sheet.Dispose();$raw.Dispose()
}
$design=Get-Content -LiteralPath (Join-Path $root '../design.json') -Raw -Encoding UTF8 | ConvertFrom-Json
$metadata=[ordered]@{status=$plan.status;approvedClips=$plan.approvedClips;characterDesign=$plan.characterDesign;design=$design;plan='animation-plan.json';frameSize=$plan.frameSize;pivot=$plan.pivot;pixelsPerWorldUnit=$plan.densityPxPerWorldUnit;visualWorldSize=@(($plan.frameSize[0]/$plan.densityPxPerWorldUnit),($plan.frameSize[1]/$plan.densityPxPerWorldUnit));scalePolicy=$plan.scalePolicy;timingStatus=$plan.timingStatus;assets=$assets;clips=$plan.clips;gameplay=$plan.gameplay}
[IO.File]::WriteAllText((Join-Path $root 'atlas.json'),($metadata|ConvertTo-Json -Depth 14),$utf8)
[IO.File]::WriteAllText((Join-Path $root 'review-data.js'),('window.neonAnimationReview='+($metadata|ConvertTo-Json -Depth 14 -Compress)+';'),$utf8)
foreach($name in $assets.Keys) {
  $asset=$assets[$name]
  Copy-Item -LiteralPath (Join-Path $root $asset.image) -Destination (Join-Path $evidence $asset.image) -Force
  Copy-Item -LiteralPath ([IO.Path]::ChangeExtension((Join-Path $root $asset.image),'json')) -Destination ([IO.Path]::ChangeExtension((Join-Path $evidence $asset.image),'json')) -Force
}
foreach($file in @('atlas.json','review-data.js')) { Copy-Item -LiteralPath (Join-Path $root $file) -Destination (Join-Path $evidence $file) -Force }
Write-Output 'Authored Neon Shadow animation review; runtime unchanged.'

