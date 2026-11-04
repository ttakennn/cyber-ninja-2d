$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
Add-Type -ReferencedAssemblies System.Drawing @'
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;
public static class WolfDesignInk {
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
$root = Join-Path $repo 'integration/task-010-electric-wolf'
$plan = Get-Content -LiteralPath (Join-Path $root 'art-plan.json') -Raw -Encoding UTF8 | ConvertFrom-Json
$image = [Drawing.Bitmap]::new((Join-Path $root $plan.image))
$reference = [Drawing.Bitmap]::new((Join-Path $root $plan.reference))
try {
  $ink = [WolfDesignInk]::Read($image)
  $ninjaInk = [WolfDesignInk]::Read($reference)
  $height = $ink[3]-$ink[1]+1
  $target = ($ninjaInk[3]-$ninjaInk[1]+1)*$plan.reviewHeightRatio
  $metadata = [ordered]@{
    status=$plan.status;name=$plan.name;plan='art-plan.json';image=$plan.image;reference=$plan.reference
    pixelSize=@($image.Width,$image.Height);sourceRect=@(0,0,$image.Width,$image.Height)
    inkBounds128=@($ink[0],$ink[1],($ink[2]-$ink[0]+1),$height)
    alpha=[ordered]@{transparentPixels=$ink[4];partialPixels=$ink[5];opaquePixels=$ink[6]}
    review=[ordered]@{heightRatio=$plan.reviewHeightRatio;targetInkHeightPx=$target;uniformDrawScale=($target/$height);pivot=@((($ink[0]+$ink[2])/2),$ink[3]);pixelsPerWorldUnit=$plan.reviewDensityPxPerWorldUnit;status='PROPOSED_DISPLAY_ONLY_NOT_COLLIDER_OR_ATLAS'}
    referencePixelSize=@($reference.Width,$reference.Height);referencePivot=@(192,289)
    sourceOriginal=$plan.original;tool=$plan.tool;prompt=$plan.prompt
    sha256=(Get-FileHash -LiteralPath (Join-Path $root $plan.image) -Algorithm SHA256).Hash.ToLower()
    referenceSha256=(Get-FileHash -LiteralPath (Join-Path $root $plan.reference) -Algorithm SHA256).Hash.ToLower()
    runtimeIntegration=$plan.runtimeIntegration;artworkApproved=$plan.artworkApproved
  }
  $json = $metadata | ConvertTo-Json -Depth 8
  $utf8 = [Text.UTF8Encoding]::new($false)
  [IO.File]::WriteAllText((Join-Path $root 'design.json'),$json,$utf8)
  [IO.File]::WriteAllText((Join-Path $root 'review-data.js'),('window.electricWolfReview='+($metadata|ConvertTo-Json -Depth 8 -Compress)+';'),$utf8)
  $board = [Drawing.Bitmap]::new(1100,430)
  $g = [Drawing.Graphics]::FromImage($board)
  $font = [Drawing.Font]::new('Segoe UI',16)
  $pen = [Drawing.Pen]::new([Drawing.Color]::FromArgb(115,133,166))
  try {
    $g.Clear([Drawing.Color]::FromArgb(7,22,56))
    $g.DrawLine($pen,50,350,1050,350)
    $g.DrawImageUnscaled($reference,108,61)
    $s = [double]$metadata.review.uniformDrawScale
    $pivot = $metadata.review.pivot
    $g.InterpolationMode = [Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.DrawImage($image,[Drawing.RectangleF]::new([single](750-$pivot[0]*$s),[single](350-$pivot[1]*$s),[single]($image.Width*$s),[single]($image.Height*$s)))
    $g.DrawString('Ninja',$font,[Drawing.Brushes]::White,265,380)
    $g.DrawString(($plan.name+' - 88%'),$font,[Drawing.Brushes]::LightCyan,650,380)
    $evidence = Join-Path $repo 'docs/map01/commits/task-010-01-electric-wolf-design'
    $board.Save((Join-Path $evidence 'comparison.png'),[Drawing.Imaging.ImageFormat]::Png)
  } finally { $g.Dispose();$font.Dispose();$pen.Dispose();$board.Dispose() }
  Write-Output ($metadata | ConvertTo-Json -Depth 8 -Compress)
} finally { $image.Dispose();$reference.Dispose() }
