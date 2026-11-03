$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Drawing
Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @'
using System; using System.Drawing; using System.Drawing.Imaging; using System.Runtime.InteropServices;
public static class SpecialInk {
  public static int[] Bounds(Bitmap b) {
    var d=b.LockBits(new Rectangle(0,0,b.Width,b.Height),ImageLockMode.ReadOnly,PixelFormat.Format32bppArgb);
    var a=new byte[b.Width*b.Height*4];Marshal.Copy(d.Scan0,a,0,a.Length);b.UnlockBits(d);
    int l=b.Width,t=b.Height,r=-1,bt=-1;
    for(int y=0;y<b.Height;y++)for(int x=0;x<b.Width;x++)if(a[(y*b.Width+x)*4+3]>=128){l=Math.Min(l,x);t=Math.Min(t,y);r=Math.Max(r,x);bt=Math.Max(bt,y);}
    return new int[]{l,t,r,bt};
  }
}
'@
$repo=Split-Path $PSScriptRoot -Parent
$root=Join-Path $repo 'integration/task-009-special-01'
$evidence=Join-Path $repo 'docs/map01/commits/task-009-07-special-01-art'
$plan=Get-Content -LiteralPath (Join-Path $root 'art-plan.json') -Raw -Encoding UTF8 | ConvertFrom-Json
New-Item -ItemType Directory -Force (Join-Path $root 'candidate'),$evidence | Out-Null
$utf8=[Text.UTF8Encoding]::new($false);$assets=[ordered]@{}
foreach($name in @('cast','orb','explosion')){
  $spec=$plan.$name
  $sourcePath=Join-Path $root $spec.source
  $raw=[Drawing.Bitmap]::new($sourcePath)
  if($raw.Width -ne $spec.cell[0]*$spec.columns -or $raw.Height -ne $spec.cell[1]*$spec.rows){throw "Unexpected source dimensions: $name"}
  $frames=@();$audit=@()
  $fw=if($name -eq 'orb'){627}else{512};$fh=$fw
  $sheet=[Drawing.Bitmap]::new(($fw*$spec.columns),($fh*$spec.rows),[Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $sg=[Drawing.Graphics]::FromImage($sheet)
  for($i=0;$i -lt $spec.columns*$spec.rows;$i++){
    $sx=($i%$spec.columns)*$spec.cell[0];$sy=[int][Math]::Floor($i/$spec.columns)*$spec.cell[1]
    $r=[Drawing.Rectangle]::new($sx,$sy,$spec.cell[0],$spec.cell[1])
    $cell=$raw.Clone($r,[Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $ink=[SpecialInk]::Bounds($cell)
    $pose=[Drawing.Bitmap]::new($fw,$fh,[Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g=[Drawing.Graphics]::FromImage($pose)
    if($name -eq 'cast'){
      $left=[int][Math]::Round($spec.pivot[0]-$spec.hips[$i]*$spec.scale)
      $top=[int][Math]::Round($spec.pivot[1]-$ink[3]*$spec.scale)
      $g.InterpolationMode=[Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
      $g.DrawImage($cell,[Drawing.Rectangle]::new($left,$top,[int][Math]::Round($spec.cell[0]*$spec.scale),[int][Math]::Round($spec.cell[1]*$spec.scale)))
      $pivot=$spec.pivot
    }elseif($name -eq 'explosion'){
      $left=$spec.paddingX;$top=0;$g.DrawImageUnscaled($cell,$left,$top);$pivot=$spec.pivot
    }else{
      $left=0;$top=0;$g.DrawImageUnscaled($cell,0,0);$pivot=$spec.pivots[$i]
    }
    $g.Dispose();$x=($i%$spec.columns)*$fw;$y=[int][Math]::Floor($i/$spec.columns)*$fh
    $sg.DrawImageUnscaled($pose,$x,$y)
    $frames+=@{rect=@($x,$y,$fw,$fh);pivot=$pivot}
    $audit+=@{index=$i;sourceRect=@($sx,$sy,$spec.cell[0],$spec.cell[1]);sourceInk=$ink;translation=@($left,$top);candidateInk=[SpecialInk]::Bounds($pose)}
    $cell.Dispose();$pose.Dispose()
  }
  $sg.Dispose()
  $target=Join-Path $root $spec.image
  if($name -eq 'orb'){Copy-Item -LiteralPath $sourcePath -Destination $target}else{$sheet.Save($target,[Drawing.Imaging.ImageFormat]::Png)}
  $sheet.Dispose()
  $assets[$name]=[ordered]@{image=$spec.image;pixelSize=@(($fw*$spec.columns),($fh*$spec.rows));frameSize=@($fw,$fh);frames=$frames;source=$spec.source;sourcePixelSize=@($raw.Width,$raw.Height);original=$spec.original;tool='image_gen.imagegen built-in';sourceSha256=(Get-FileHash -LiteralPath $sourcePath -Algorithm SHA256).Hash.ToLower();sha256=(Get-FileHash -LiteralPath $target -Algorithm SHA256).Hash.ToLower();authoring=$audit}
  $raw.Dispose()
}
$metadata=[ordered]@{status=$plan.status;plan='art-plan.json';cooldownSeconds=$plan.cooldownSeconds;runtimeIntegration='NOT_IMPLEMENTED';characterPixelWorldUnit=0.00625;assets=$assets}
[IO.File]::WriteAllText((Join-Path $root 'atlas.json'),($metadata|ConvertTo-Json -Depth 14),$utf8)
$review=@{status=$plan.status;cooldownSeconds=$plan.cooldownSeconds;cast=@{frames=$assets.cast.frames;frameMs=$plan.cast.frameMs;releaseFrame=$plan.cast.releaseFrame;releasePoint=$plan.cast.releasePoint;chargePoints=$plan.cast.chargePoints;chargeWidths=$plan.cast.chargeWidths};orb=@{frames=$assets.orb.frames;fps=$plan.orb.fps;previewWidth=$plan.orb.previewWidth};explosion=@{frames=$assets.explosion.frames;fps=$plan.explosion.fps;previewWidth=$plan.explosion.previewWidth};preview=$plan.preview}
[IO.File]::WriteAllText((Join-Path $root 'review-data.js'),('window.specialReview='+($review|ConvertTo-Json -Depth 10 -Compress)+';'),$utf8)
# Same-size reference and cast poses, not independently fitted per panel.
$cast=[Drawing.Bitmap]::new((Join-Path $root $plan.cast.image));$idle=[Drawing.Bitmap]::new((Join-Path $root 'source/idle-reference.png'))
$contact=[Drawing.Bitmap]::new(1680,820,[Drawing.Imaging.PixelFormat]::Format32bppArgb)
$cg=[Drawing.Graphics]::FromImage($contact);$cg.Clear([Drawing.Color]::FromArgb(19,30,49))
$font=[Drawing.Font]::new('Segoe UI',13);$title=[Drawing.Font]::new('Segoe UI',23,[Drawing.FontStyle]::Bold)
$pen=[Drawing.Pen]::new([Drawing.Color]::FromArgb(95,116,145))
$labels=$plan.labels.cast
for($p=0;$p -lt 7;$p++){
  $px=($p%4)*420;$py=[int][Math]::Floor($p/4)*410
  $cg.DrawLine($pen,$px,$py+353,$px+420,$py+353)
  $cg.DrawString($labels[$p],$font,[Drawing.Brushes]::White,[single]($px+18),[single]($py+375))
  if($p -eq 0){$cg.DrawImageUnscaled($idle,$px+18,$py+64)}
  else{$i=$p-1;$cg.DrawImage($cast,[Drawing.Rectangle]::new($px+18,$py,512,512),[Drawing.Rectangle]::new(($i%3)*512,[int][Math]::Floor($i/3)*512,512,512),[Drawing.GraphicsUnit]::Pixel)}
}
$cg.Dispose();$contact.Save((Join-Path $evidence 'cast-contact-sheet.png'),[Drawing.Imaging.ImageFormat]::Png);$contact.Dispose()
$board=[Drawing.Bitmap]::new(1440,600,[Drawing.Imaging.PixelFormat]::Format32bppArgb)
$bg=[Drawing.Graphics]::FromImage($board);$bg.Clear([Drawing.Color]::FromArgb(15,25,44))
$bg.DrawString($plan.labels.title,$title,[Drawing.Brushes]::White,40,28)
$bg.DrawString($plan.labels.subtitle,$font,[Drawing.Brushes]::LightSteelBlue,40,74)
$bg.DrawLine($pen,30,480,1410,480)
$bg.DrawImage($cast,[Drawing.Rectangle]::new(58,127,512,512),[Drawing.Rectangle]::new(0,512,512,512),[Drawing.GraphicsUnit]::Pixel)
$orb=[Drawing.Bitmap]::new((Join-Path $root $plan.orb.image));$f=$assets.orb.frames[0];$s=$plan.orb.previewWidth/627
$bg.DrawImage($orb,[Drawing.Rectangle]::new([int](720-$f.pivot[0]*$s),[int](330-$f.pivot[1]*$s),$plan.orb.previewWidth,$plan.orb.previewWidth),[Drawing.Rectangle]::new(0,0,627,627),[Drawing.GraphicsUnit]::Pixel)
$explosion=[Drawing.Bitmap]::new((Join-Path $root $plan.explosion.image));$f=$assets.explosion.frames[3];$size=$plan.explosion.previewWidth
$bg.DrawImage($explosion,[Drawing.Rectangle]::new([int](1100-$size/2),[int](310-$size/2),$size,$size),[Drawing.Rectangle]::new($f.rect[0],$f.rect[1],512,512),[Drawing.GraphicsUnit]::Pixel)
$bg.DrawString($plan.labels.captions[0],$font,[Drawing.Brushes]::White,160,535)
$bg.DrawString($plan.labels.captions[1],$font,[Drawing.Brushes]::White,600,535)
$bg.DrawString($plan.labels.captions[2],$font,[Drawing.Brushes]::White,1000,535)
$bg.DrawString($plan.labels.footer,$font,[Drawing.Brushes]::LightSteelBlue,40,574)
$bg.Dispose();$board.Save((Join-Path $evidence 'overview.png'),[Drawing.Imaging.ImageFormat]::Png)
$board.Dispose();$cast.Dispose();$idle.Dispose();$orb.Dispose();$explosion.Dispose();$font.Dispose();$title.Dispose();$pen.Dispose()
Write-Output 'Authored special-skill art candidates, provenance and preview board; runtime untouched.'

