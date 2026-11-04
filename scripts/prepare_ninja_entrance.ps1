param([ValidateSet('entrance','respawn')][string]$Profile='entrance')
$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Drawing
Add-Type -ReferencedAssemblies System.Drawing @'
using System;using System.Drawing;using System.Drawing.Imaging;using System.Runtime.InteropServices;
public static class EntranceInk {
 public static int[] Bounds(Bitmap b){
  var d=b.LockBits(new Rectangle(0,0,b.Width,b.Height),ImageLockMode.ReadOnly,PixelFormat.Format32bppArgb);
  var a=new byte[Math.Abs(d.Stride)*b.Height];Marshal.Copy(d.Scan0,a,0,a.Length);b.UnlockBits(d);
  int l=b.Width,t=b.Height,r=-1,bt=-1;
  for(int y=0;y<b.Height;y++)for(int x=0;x<b.Width;x++)if(a[y*Math.Abs(d.Stride)+x*4+3]>=128){l=Math.Min(l,x);t=Math.Min(t,y);r=Math.Max(r,x);bt=Math.Max(bt,y);}
  if(r<0)throw new Exception("Empty entrance frame");return new int[]{l,t,r,bt};
 }
}
'@
$repo=Split-Path $PSScriptRoot -Parent
$root=Join-Path $repo "integration/task-010-ninja-$Profile"
$plan=Get-Content (Join-Path $root 'art-plan.json') -Raw -Encoding UTF8 | ConvertFrom-Json
$out=Join-Path $repo $plan.reviewDirectory
foreach($dir in @($out,(Join-Path $out 'assets'),(Join-Path $out 'reference'))){New-Item -ItemType Directory -Force $dir | Out-Null}
$reference=[Drawing.Bitmap]::new((Join-Path $root $plan.reference))
$referenceInk=[EntranceInk]::Bounds($reference);$targetHeight=$referenceInk[3]-$referenceInk[1]+1;$reference.Dispose()
$assets=[ordered]@{}
foreach($name in @('body','beam','ring')){
 $spec=$plan.sheets.$name;$source=Join-Path $root "source/$name.png";$raw=[Drawing.Bitmap]::new($source)
 if($raw.Width%4 -or $raw.Height%2){throw "Source grid must have 4 columns and 2 rows: $name"}
 $sw=[int]($raw.Width/4);$sh=[int]($raw.Height/2)
 $first=$raw.Clone([Drawing.Rectangle]::new(0,0,$sw,$sh),[Drawing.Imaging.PixelFormat]::Format32bppArgb)
 $refInk=[EntranceInk]::Bounds($first);$first.Dispose()
 $scale=if($name -eq 'body'){$targetHeight/($refInk[3]-$refInk[1]+1)}else{$spec.targetCellWidthPx/$sw}
 $pivot=if($name -eq 'body'){$plan.characterPivot}else{$plan.effectPivot}
 $sheet=[Drawing.Bitmap]::new(2048,1024,[Drawing.Imaging.PixelFormat]::Format32bppArgb);$g=[Drawing.Graphics]::FromImage($sheet)
 $frames=@()
 for($i=0;$i -lt 8;$i++){
  $sx=($i%4)*$sw;$sy=[int][Math]::Floor($i/4)*$sh
  $cell=$raw.Clone([Drawing.Rectangle]::new($sx,$sy,$sw,$sh),[Drawing.Imaging.PixelFormat]::Format32bppArgb);$ink=[EntranceInk]::Bounds($cell)
  $anchorY=if($null -ne $spec.sourceAnchorY){$spec.sourceAnchorY}else{$ink[3]}
  $left=[int][Math]::Round($pivot[0]-$sw*.5*$scale);$top=[int][Math]::Round($pivot[1]-$anchorY*$scale)
  $pose=[Drawing.Bitmap]::new(512,512,[Drawing.Imaging.PixelFormat]::Format32bppArgb);$pg=[Drawing.Graphics]::FromImage($pose)
  $pg.InterpolationMode=[Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $pg.DrawImage($cell,[Drawing.Rectangle]::new($left,$top,[int][Math]::Round($sw*$scale),[int][Math]::Round($sh*$scale)));$pg.Dispose();$cell.Dispose()
  $x=($i%4)*512;$y=[int][Math]::Floor($i/4)*512;$g.DrawImageUnscaled($pose,$x,$y)
  $frames+=@{rect=@($x,$y,512,512);pivot=$pivot;sourceRect=@($sx,$sy,$sw,$sh);sourceInk128=$ink;sourceAnchor=@(($sw*.5),$anchorY);translation=@($left,$top);ink128=[EntranceInk]::Bounds($pose)}
  $pose.Dispose()
 }
 $g.Dispose();$target=Join-Path $out "assets/$name.png";$sheet.Save($target,[Drawing.Imaging.ImageFormat]::Png)
 $assets[$name]=[ordered]@{image="assets/$name.png";source="source/$name.png";sourcePixelSize=@($raw.Width,$raw.Height);pixelSize=@(2048,1024);uniformScale=$scale;original=$spec.original;prompt=$spec.prompt;sourceSha256=(Get-FileHash $source -Algorithm SHA256).Hash.ToLower();sha256=(Get-FileHash $target -Algorithm SHA256).Hash.ToLower();frames=$frames}
 $board=[Drawing.Bitmap]::new(1600,1120);$bg=[Drawing.Graphics]::FromImage($board);$bg.Clear([Drawing.Color]::FromArgb(12,23,42));$font=[Drawing.Font]::new('Segoe UI',12);$pen=[Drawing.Pen]::new([Drawing.Color]::SlateGray)
 for($i=0;$i -lt 8;$i++){
  $cx=($i%4)*400+200;$floor=[int][Math]::Floor($i/4)*560+500
  $bg.DrawLine($pen,($cx-190),$floor,($cx+190),$floor)
  $bg.DrawImage($sheet,[Drawing.Rectangle]::new(($cx-$pivot[0]),($floor-$pivot[1]),512,512),[Drawing.Rectangle]::new((($i%4)*512),([int][Math]::Floor($i/4)*512),512,512),[Drawing.GraphicsUnit]::Pixel)
  $bg.DrawString("$name / $i",$font,[Drawing.Brushes]::LightCyan,[single]($cx-170),[single]($floor+20))
 }
 $bg.Dispose();$board.Save((Join-Path $out "$name-contact.png"),[Drawing.Imaging.ImageFormat]::Png)
 $board.Dispose();$font.Dispose();$pen.Dispose();$sheet.Dispose();$raw.Dispose()
}
Copy-Item -LiteralPath (Join-Path $root $plan.reference) -Destination (Join-Path $out 'reference/idle.png') -Force
Copy-Item -LiteralPath (Join-Path $repo 'public/assets/characters/ninja/flame-ninja-atlas.png') -Destination (Join-Path $out 'reference/locomotion.png') -Force
$locomotion=Get-Content (Join-Path $repo 'public/assets/characters/ninja/animations.json') -Raw -Encoding UTF8 | ConvertFrom-Json
$data=[ordered]@{status=$plan.status;name=$plan.name;runtimeIntegration=$plan.runtimeIntegration;pixelsPerWorldUnit=$plan.pixelsPerWorldUnit;referenceInk128=$referenceInk;referenceHeightPx=$targetHeight;phasesMs=$plan.phasesMs;idlePreviewHoldMs=$plan.idlePreviewHoldMs;body=$plan.body;ring=$plan.ring;beam=$plan.beam;glow=$plan.glow;assets=$assets;idle=$locomotion.clips.idle;tool='image_gen.imagegen built-in'}
$utf8=[Text.UTF8Encoding]::new($false)
[IO.File]::WriteAllText((Join-Path $out 'atlas.json'),($data|ConvertTo-Json -Depth 14),$utf8)
[IO.File]::WriteAllText((Join-Path $out 'review-data.js'),('window.fireEntrance='+($data|ConvertTo-Json -Depth 14 -Compress)+';'),$utf8)
Write-Output 'Authored entrance preview assets and metadata. Existing runtime assets unchanged.'

