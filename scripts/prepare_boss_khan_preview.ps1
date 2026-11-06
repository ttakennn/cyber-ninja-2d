$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
Add-Type -ReferencedAssemblies System.Drawing @'
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;
public static class BossKhanInk {
  public static long[] Read(Bitmap image) {
    using(var b=image.Clone(new Rectangle(0,0,image.Width,image.Height),PixelFormat.Format32bppArgb)) {
      var data=b.LockBits(new Rectangle(0,0,b.Width,b.Height),ImageLockMode.ReadOnly,PixelFormat.Format32bppArgb);
      var bytes=new byte[Math.Abs(data.Stride)*b.Height]; Marshal.Copy(data.Scan0,bytes,0,bytes.Length); b.UnlockBits(data);
      int left=b.Width,top=b.Height,right=-1,bottom=-1; long clear=0,partial=0,solid=0;
      for(int y=0;y<b.Height;y++)for(int x=0;x<b.Width;x++) {
        var alpha=bytes[y*Math.Abs(data.Stride)+x*4+3];
        if(alpha==0)clear++; else if(alpha==255)solid++; else partial++;
        if(alpha>=128){left=Math.Min(left,x);top=Math.Min(top,y);right=Math.Max(right,x);bottom=Math.Max(bottom,y);}
      }
      if(right<0)throw new Exception("No visible character pixels");
      return new long[]{left,top,right,bottom,clear,partial,solid};
    }
  }
}
'@
$repo = Split-Path $PSScriptRoot -Parent
$root = Join-Path $repo 'integration/task-010-boss-khan'
$plan = Get-Content -LiteralPath (Join-Path $root 'design-plan.json') -Raw -Encoding UTF8 | ConvertFrom-Json
$review = Join-Path $repo $plan.reviewDirectory
$bossPath = Join-Path $root $plan.image
$heroPath = Join-Path $repo $plan.reference
$neonPath = Join-Path $repo $plan.neonReference
$boss = [Drawing.Bitmap]::new($bossPath)
$hero = [Drawing.Bitmap]::new($heroPath)
$neon = [Drawing.Bitmap]::new($neonPath)
try {
  $ink = [BossKhanInk]::Read($boss)
  $heroInk = [BossKhanInk]::Read($hero)
  $neonInk = [BossKhanInk]::Read($neon)
  $heroHeight = $heroInk[3]-$heroInk[1]+1
  $bossHeight = $ink[3]-$ink[1]+1
  $neonHeight = $neonInk[3]-$neonInk[1]+1
  $target = $heroHeight*$plan.reviewHeightRatio
  $bossScale = $target/$bossHeight
  $neonScale = ($heroHeight*0.95)/$neonHeight
  $metadata = [ordered]@{
    status=$plan.status;id=$plan.id;name=$plan.name;image='assets/boss-khan-v1.png'
    pixelSize=@($boss.Width,$boss.Height);sourceRect=@(0,0,$boss.Width,$boss.Height)
    inkBounds128=@($ink[0],$ink[1],($ink[2]-$ink[0]+1),$bossHeight)
    alpha=[ordered]@{transparentPixels=$ink[4];partialPixels=$ink[5];opaquePixels=$ink[6]}
    review=[ordered]@{heightRatio=$plan.reviewHeightRatio;heroInkHeightPx=$heroHeight;targetInkHeightPx=$target;uniformDrawScale=$bossScale;pivot=@((($ink[0]+$ink[2])/2),$ink[3]);pixelsPerWorldUnit=$plan.reviewDensityPxPerWorldUnit;status='DISPLAY_ONLY_NOT_COLLIDER_OR_ATLAS'}
    references=[ordered]@{hero='assets/ninja-idle.png';neon='assets/neon-shadow-v1.png';neonHeightRatio=0.95;neonUniformDrawScale=$neonScale;heroPivot=@((($heroInk[0]+$heroInk[2])/2),$heroInk[3]);neonPivot=@((($neonInk[0]+$neonInk[2])/2),$neonInk[3])}
    sourceOriginal=$plan.original;tool=$plan.tool;prompt=$plan.prompt;source=$plan.image
    sha256=(Get-FileHash -LiteralPath $bossPath -Algorithm SHA256).Hash.ToLower()
    referenceSha256=(Get-FileHash -LiteralPath $heroPath -Algorithm SHA256).Hash.ToLower()
    neonSha256=(Get-FileHash -LiteralPath $neonPath -Algorithm SHA256).Hash.ToLower()
    artworkApproved=$plan.artworkApproved;runtimeIntegration=$plan.runtimeIntegration
  }
  $utf8 = [Text.UTF8Encoding]::new($false)
  [IO.File]::WriteAllText((Join-Path $root 'design.json'),($metadata|ConvertTo-Json -Depth 10),$utf8)
  [IO.File]::WriteAllText((Join-Path $review 'design.json'),($metadata|ConvertTo-Json -Depth 10),$utf8)
  [IO.File]::WriteAllText((Join-Path $review 'review-data.js'),('window.bossKhanReview='+($metadata|ConvertTo-Json -Depth 10 -Compress)+';'),$utf8)
  $board = [Drawing.Bitmap]::new(1300,610)
  $g = [Drawing.Graphics]::FromImage($board)
  $font = [Drawing.Font]::new('Segoe UI',16)
  $pen = [Drawing.Pen]::new([Drawing.Color]::FromArgb(115,133,166))
  try {
    $g.Clear([Drawing.Color]::FromArgb(7,22,56))
    $g.DrawLine($pen,45,500,1255,500)
    $g.InterpolationMode = [Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $s = 1.0
    $g.DrawImage($hero,[Drawing.RectangleF]::new([single](205-$metadata.references.heroPivot[0]*$s),[single](500-$metadata.references.heroPivot[1]*$s),[single]($hero.Width*$s),[single]($hero.Height*$s)))
    $s = [double]$neonScale
    $g.DrawImage($neon,[Drawing.RectangleF]::new([single](540-$metadata.references.neonPivot[0]*$s),[single](500-$metadata.references.neonPivot[1]*$s),[single]($neon.Width*$s),[single]($neon.Height*$s)))
    $s = [double]$bossScale
    $g.DrawImage($boss,[Drawing.RectangleF]::new([single](1020-$metadata.review.pivot[0]*$s),[single](500-$metadata.review.pivot[1]*$s),[single]($boss.Width*$s),[single]($boss.Height*$s)))
    $g.DrawString('Ninja Hoa - 100%',$font,[Drawing.Brushes]::White,100,530)
    $g.DrawString('Bong Neon - 95%',$font,[Drawing.Brushes]::Plum,430,530)
    $g.DrawString('Huyet Dao Khan - 150%',$font,[Drawing.Brushes]::LightCyan,895,530)
    $board.Save((Join-Path $review 'comparison.png'),[Drawing.Imaging.ImageFormat]::Png)
  } finally { $g.Dispose();$font.Dispose();$pen.Dispose();$board.Dispose() }
  Write-Output ($metadata | ConvertTo-Json -Depth 10 -Compress)
} finally { $boss.Dispose();$hero.Dispose();$neon.Dispose() }
