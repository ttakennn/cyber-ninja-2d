$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @'
using System; using System.Drawing; using System.Drawing.Imaging; using System.Runtime.InteropServices;
public static class CrouchThrowInk {
  public static int[] Bounds(Bitmap b) {
    var d=b.LockBits(new Rectangle(0,0,b.Width,b.Height),ImageLockMode.ReadOnly,PixelFormat.Format32bppArgb);
    var a=new byte[b.Width*b.Height*4];Marshal.Copy(d.Scan0,a,0,a.Length);b.UnlockBits(d);
    int l=b.Width,t=b.Height,r=-1,bt=-1;
    for(int y=0;y<b.Height;y++)for(int x=0;x<b.Width;x++)if(a[(y*b.Width+x)*4+3]>=128){l=Math.Min(l,x);t=Math.Min(t,y);r=Math.Max(r,x);bt=Math.Max(bt,y);}
    if(r<0)throw new Exception("No opaque sprite");
    return new int[]{l,t,r,bt};
  }
}
'@
$repo=Split-Path $PSScriptRoot -Parent
$root=Join-Path $repo 'integration/task-009-fire-shuriken/crouch-throw'
$evidence=Join-Path $repo 'docs/map01/commits/task-009-05-crouch-shuriken-art'
$raw=[Drawing.Bitmap]::new((Join-Path $root 'source-v1.png'))
# Manual source rects retain the release fingertips and the following front boot.
$rects=@(@(0,0,512,512),@(512,0,512,512),@(1024,0,512,512),@(0,512,584,512),@(584,512,456,512),@(1040,512,496,512))
$hips=@(235,241,236,235,221,240)
# One scale for the complete clip, based on the existing head/torso; never fit individual poses.
$scale=0.48
$sheet=[Drawing.Bitmap]::new(1536,1024,[Drawing.Imaging.PixelFormat]::Format32bppArgb)
$sg=[Drawing.Graphics]::FromImage($sheet);$frames=@()
for($i=0;$i -lt 6;$i++){
  $r=$rects[$i]
  $cell=$raw.Clone([Drawing.Rectangle]::new($r[0],$r[1],$r[2],$r[3]),[Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $bounds=[CrouchThrowInk]::Bounds($cell)
  $left=[int][Math]::Round(192-$hips[$i]*$scale)
  $top=[int][Math]::Round(353-$bounds[3]*$scale)
  $pose=[Drawing.Bitmap]::new(512,512,[Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $g=[Drawing.Graphics]::FromImage($pose);$g.InterpolationMode=[Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.DrawImage($cell,[Drawing.Rectangle]::new($left,$top,[int][Math]::Round($r[2]*$scale),[int][Math]::Round($r[3]*$scale)));$g.Dispose()
  $x=($i%3)*512;$y=[int][Math]::Floor($i/3)*512
  $sg.DrawImageUnscaled($pose,$x,$y)
  $frames+=@{index=$i;sourceRect=$r;sourceHipX=$hips[$i];sourceInk=$bounds;translation=@($left,$top);rect=@($x,$y,512,512);pivot=@(192,353);candidateInk=[CrouchThrowInk]::Bounds($pose)}
  $pose.Dispose();$cell.Dispose()
}
$sg.Dispose();$sheet.Save((Join-Path $root 'crouch-throw-atlas.png'),[Drawing.Imaging.ImageFormat]::Png);$raw.Dispose()
$utf8=[Text.UTF8Encoding]::new($false)
$meta=[ordered]@{status='CANDIDATE_CROUCH_THROW_REVIEW_ONLY';tool='image_gen.imagegen built-in';source='source-v1.png';sourceOriginal='exec-f2b28835-1ee5-4d8b-8f3a-59d1c70cf51d.png';sourcePixelSize=@(1536,1024);image='crouch-throw-atlas.png';pixelSize=@(1536,1024);frameSize=@(512,512);columns=3;rows=2;uniformScale=$scale;pixelWorldUnit=0.00625;pivot=@(192,353);frameMs=@(85,100,65,70,90,140);releaseFrame=3;releasePoint=@(350,240);frames=$frames;sourceSha256=(Get-FileHash -LiteralPath (Join-Path $root 'source-v1.png') -Algorithm SHA256).Hash.ToLower();candidateSha256=(Get-FileHash -LiteralPath (Join-Path $root 'crouch-throw-atlas.png') -Algorithm SHA256).Hash.ToLower();canonicalChanged=$false;runtimeIntegration='NOT_IMPLEMENTED';timing='PREVIEW_ONLY'}
[IO.File]::WriteAllText((Join-Path $root 'atlas.json'),($meta|ConvertTo-Json -Depth 12),$utf8)
[IO.File]::WriteAllText((Join-Path $root 'review-data.js'),('window.throwReview='+(@{frameMs=$meta.frameMs;releaseFrame=$meta.releaseFrame;releasePoint=$meta.releasePoint}|ConvertTo-Json -Depth 4 -Compress)+';'),$utf8)
$contact=[Drawing.Bitmap]::new(1680,820,[Drawing.Imaging.PixelFormat]::Format32bppArgb)
$cg=[Drawing.Graphics]::FromImage($contact);$cg.Clear([Drawing.Color]::FromArgb(24,38,61))
$font=[Drawing.Font]::new('Segoe UI',13);$pen=[Drawing.Pen]::new([Drawing.Color]::FromArgb(110,130,155))
$crouch=[Drawing.Bitmap]::new((Join-Path $root 'crouch-reference.png'))
$standing=[Drawing.Bitmap]::new((Join-Path $root 'standing-release-reference.png'))
$labels=@('Crouch goc','1. Lay da','2. Xoay vai','3. Vung tay','4. Tha phi tieu','5. Ha tay','6. Thu the','Throw dung da duyet')
for($panel=0;$panel -lt 8;$panel++){
  $px=($panel%4)*420;$py=[int][Math]::Floor($panel/4)*410
  $cg.DrawLine($pen,$px,$py+353,$px+420,$py+353)
  $cg.DrawString($labels[$panel],$font,[Drawing.Brushes]::White,[single]($px+18),[single]($py+375))
  if($panel -eq 0){$cg.DrawImageUnscaled($crouch,$px+18,$py+64)}
  elseif($panel -eq 7){$cg.DrawImageUnscaled($standing,$px+18,$py)}
  else{$i=$panel-1;$cg.DrawImage($sheet,[Drawing.Rectangle]::new($px+18,$py,512,512),[Drawing.Rectangle]::new(($i%3)*512,[int][Math]::Floor($i/3)*512,512,512),[Drawing.GraphicsUnit]::Pixel)}
}
$cg.Dispose();$font.Dispose();$pen.Dispose();$crouch.Dispose();$standing.Dispose();$sheet.Dispose()
$contact.Save((Join-Path $evidence 'crouch-contact-sheet.png'),[Drawing.Imaging.ImageFormat]::Png);$contact.Dispose()
Write-Output 'Authored crouch throw candidate; standing artwork and runtime unchanged.'

