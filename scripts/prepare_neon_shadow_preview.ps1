$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
Add-Type -ReferencedAssemblies System.Drawing @'
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;
public static class NeonDesignInk {
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
$root = Join-Path $repo 'integration/task-010-neon-shadow'
$plan = Get-Content -LiteralPath (Join-Path $root 'art-plan.json') -Raw -Encoding UTF8 | ConvertFrom-Json
$review = Join-Path $repo $plan.reviewDirectory
$wolf = Get-Content -LiteralPath (Join-Path $repo 'integration/task-010-electric-wolf/design.json') -Raw -Encoding UTF8 | ConvertFrom-Json
$image = [Drawing.Bitmap]::new((Join-Path $root $plan.image))
$ninja = [Drawing.Bitmap]::new((Join-Path $review 'assets/ninja-idle.png'))
$wolfImage = [Drawing.Bitmap]::new((Join-Path $review 'assets/electric-wolf.png'))
try {
  $ink = [NeonDesignInk]::Read($image)
  $ninjaInk = [NeonDesignInk]::Read($ninja)
  $target = ($ninjaInk[3]-$ninjaInk[1]+1)*$plan.reviewHeightRatio
  $height = $ink[3]-$ink[1]+1
  $metadata = [ordered]@{
    status=$plan.status;id=$plan.id;name=$plan.name;image='assets/neon-shadow-v1.png'
    pixelSize=@($image.Width,$image.Height);sourceRect=@(0,0,$image.Width,$image.Height)
    inkBounds128=@($ink[0],$ink[1],($ink[2]-$ink[0]+1),$height)
    alpha=[ordered]@{transparentPixels=$ink[4];partialPixels=$ink[5];opaquePixels=$ink[6]}
    review=[ordered]@{heightRatio=$plan.reviewHeightRatio;targetInkHeightPx=$target;uniformDrawScale=($target/$height);pivot=@((($ink[0]+$ink[2])/2),$ink[3]);pixelsPerWorldUnit=$plan.reviewDensityPxPerWorldUnit;status='PROPOSED_DISPLAY_ONLY_NOT_COLLIDER_OR_ATLAS'}
    reference=[ordered]@{image='assets/ninja-idle.png';pixelSize=@($ninja.Width,$ninja.Height);pivot=@(192,289)}
    wolf=[ordered]@{image='assets/electric-wolf.png';pixelSize=$wolf.pixelSize;review=$wolf.review}
    sourceOriginal=$plan.original;tool=$plan.tool;prompt=$plan.prompt;source=$plan.image
    sha256=(Get-FileHash -LiteralPath (Join-Path $root $plan.image) -Algorithm SHA256).Hash.ToLower()
    referenceSha256=(Get-FileHash -LiteralPath (Join-Path $review 'assets/ninja-idle.png') -Algorithm SHA256).Hash.ToLower()
    wolfSha256=(Get-FileHash -LiteralPath (Join-Path $review 'assets/electric-wolf.png') -Algorithm SHA256).Hash.ToLower()
    artworkApproved=$plan.artworkApproved;runtimeIntegration=$plan.runtimeIntegration
  }
  $utf8 = [Text.UTF8Encoding]::new($false)
  $json = $metadata | ConvertTo-Json -Depth 10
  [IO.File]::WriteAllText((Join-Path $root 'design.json'),$json,$utf8)
  [IO.File]::WriteAllText((Join-Path $review 'design.json'),$json,$utf8)
  [IO.File]::WriteAllText((Join-Path $review 'review-data.js'),('window.neonShadowReview='+($metadata|ConvertTo-Json -Depth 10 -Compress)+';'),$utf8)
  $board = [Drawing.Bitmap]::new(1200,430)
  $g = [Drawing.Graphics]::FromImage($board)
  $font = [Drawing.Font]::new('Segoe UI',15)
  $pen = [Drawing.Pen]::new([Drawing.Color]::FromArgb(115,133,166))
  try {
    $g.Clear([Drawing.Color]::FromArgb(7,22,56))
    $g.DrawLine($pen,50,350,1150,350)
    $g.DrawImageUnscaled($ninja,38,61)
    $g.InterpolationMode = [Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $s = [double]$wolf.review.uniformDrawScale
    $g.DrawImage($wolfImage,[Drawing.RectangleF]::new([single](600-$wolf.review.pivot[0]*$s),[single](350-$wolf.review.pivot[1]*$s),[single]($wolfImage.Width*$s),[single]($wolfImage.Height*$s)))
    $s = [double]$metadata.review.uniformDrawScale
    $g.DrawImage($image,[Drawing.RectangleF]::new([single](970-$metadata.review.pivot[0]*$s),[single](350-$metadata.review.pivot[1]*$s),[single]($image.Width*$s),[single]($image.Height*$s)))
    $g.DrawString('Ninja Hoa - 100%',$font,[Drawing.Brushes]::White,125,380)
    $g.DrawString('Soi Dien - 88%',$font,[Drawing.Brushes]::LightCyan,515,380)
    $g.DrawString(('Bong Neon - '+($plan.reviewHeightRatio*100)+'%'),$font,[Drawing.Brushes]::Plum,830,380)
    $board.Save((Join-Path $review 'comparison.png'),[Drawing.Imaging.ImageFormat]::Png)
  } finally { $g.Dispose();$font.Dispose();$pen.Dispose();$board.Dispose() }
  Write-Output ($metadata | ConvertTo-Json -Depth 10 -Compress)
} finally { $image.Dispose();$ninja.Dispose();$wolfImage.Dispose() }
