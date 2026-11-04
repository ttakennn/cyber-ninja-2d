$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @'
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;
public static class ClimbPixels {
  public static byte[] Read(Bitmap image) {
    var data = image.LockBits(new Rectangle(0,0,image.Width,image.Height), ImageLockMode.ReadOnly, PixelFormat.Format32bppArgb);
    try { var bytes = new byte[image.Width*image.Height*4]; Marshal.Copy(data.Scan0,bytes,0,bytes.Length); return bytes; }
    finally { image.UnlockBits(data); }
  }
  public static Rectangle Bounds(Bitmap image) {
    var bytes=Read(image); int l=image.Width,t=image.Height,r=-1,b=-1;
    for(int y=0;y<image.Height;y++) for(int x=0;x<image.Width;x++) if(bytes[(y*image.Width+x)*4+3]>=16) {
      l=Math.Min(l,x); t=Math.Min(t,y); r=Math.Max(r,x); b=Math.Max(b,y);
    }
    if(r<0) throw new Exception("Empty climbing pose");
    return new Rectangle(l,t,r-l+1,b-t+1);
  }
  public static void PreserveOtherPixels(Bitmap original, Bitmap edited, Rectangle[] allowed) {
    var before=Read(original); var after=Read(edited);
    for(int y=0;y<original.Height;y++) for(int x=0;x<original.Width;x++) {
      bool editable=false; foreach(var rect in allowed) if(rect.Contains(x,y)) {editable=true;break;}
      if(editable) continue;
      int p=(y*original.Width+x)*4;
      for(int c=0;c<4;c++) if(before[p+c]!=after[p+c]) throw new Exception("Pixel changed outside climbing frames");
    }
  }
}
'@
$repo = Split-Path $PSScriptRoot -Parent
$folder = Join-Path $repo 'public/assets/characters/ninja'
$metadata = Get-Content -LiteralPath (Join-Path $folder 'animations.json') -Raw | ConvertFrom-Json
$original = [System.Drawing.Bitmap]::new((Join-Path $folder 'flame-ninja-atlas.png'))
$atlas = $original.Clone([System.Drawing.Rectangle]::new(0,0,$original.Width,$original.Height), [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$source = [System.Drawing.Bitmap]::new((Join-Path $repo 'integration/ninja-climb/climb-poses-source.png'))
$reference = $original.Clone([System.Drawing.Rectangle]::new(1572,988,384,320), [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$bounds = [ClimbPixels]::Bounds($reference)
$reference.Dispose()
$poses = @()
$preview = [System.Drawing.Bitmap]::new(1536,320,[System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$previewGraphics = [System.Drawing.Graphics]::FromImage($preview)
for ($index=0; $index -lt 4; $index++) {
  $cellWidth = [int]($source.Width/2); $cellHeight = [int]($source.Height/2)
  $cell = $source.Clone([System.Drawing.Rectangle]::new(($index%2)*$cellWidth,[Math]::Floor($index/2)*$cellHeight,$cellWidth,$cellHeight), [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $ink = [ClimbPixels]::Bounds($cell)
  if ($index -eq 0) { $poseScale = $bounds.Height / $ink.Height }
  $pose = [System.Drawing.Bitmap]::new(384,320,[System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $graphics = [System.Drawing.Graphics]::FromImage($pose)
  $graphics.CompositingMode = [System.Drawing.Drawing2D.CompositingMode]::SourceCopy
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $width = [int][Math]::Round($ink.Width * $poseScale)
  $height = [int][Math]::Round($ink.Height * $poseScale)
  $left = [int][Math]::Round($bounds.X + ($bounds.Width-$width)/2)
  if ($left -lt 0 -or $left+$width -gt 384) { throw 'Pose exceeds original frame' }
  $graphics.DrawImage($cell,[System.Drawing.Rectangle]::new($left,$bounds.Bottom-$height,$width,$height),$ink,[System.Drawing.GraphicsUnit]::Pixel)
  $graphics.Dispose(); $cell.Dispose()
  $previewGraphics.DrawImageUnscaled($pose,$index*384,0)
  $poses += $pose
}
$previewGraphics.Dispose()
$preview.Save((Join-Path $repo 'integration/ninja-climb/climb-poses.png'),[System.Drawing.Imaging.ImageFormat]::Png)
$preview.Dispose()
$atlasGraphics = [System.Drawing.Graphics]::FromImage($atlas)
$atlasGraphics.CompositingMode = [System.Drawing.Drawing2D.CompositingMode]::SourceCopy
$allowed = @()
foreach ($clip in @($metadata.clips.climbUp,$metadata.clips.climbDown)) {
  for ($index=0; $index -lt $clip.frames.Count; $index++) {
    $frame=$clip.frames[$index]
    $allowed += [System.Drawing.Rectangle]::new($frame.x,$frame.y,$frame.width,$frame.height)
    $atlasGraphics.DrawImageUnscaled($poses[[int][Math]::Floor($index/2)],$frame.x,$frame.y)
  }
}
$atlasGraphics.Dispose()
[ClimbPixels]::PreserveOtherPixels($original,$atlas,[System.Drawing.Rectangle[]]$allowed)
$generatedPath = Join-Path $folder 'flame-ninja-atlas.generated.png'
$atlas.Save($generatedPath,[System.Drawing.Imaging.ImageFormat]::Png)
foreach ($pose in $poses) { $pose.Dispose() }
$atlas.Dispose(); $source.Dispose(); $original.Dispose()
Move-Item -LiteralPath $generatedPath -Destination (Join-Path $folder 'flame-ninja-atlas.png') -Force
Write-Output ('Approved climbing atlas authored; non-climbing pixels preserved; reference ink height={0}px, bottom={1}px.' -f $bounds.Height,$bounds.Bottom)
