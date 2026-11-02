$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @'
using System; using System.Drawing; using System.Drawing.Imaging; using System.Runtime.InteropServices;
public static class ThrowInk {
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
$repo = Split-Path $PSScriptRoot -Parent
$root = Join-Path $repo 'integration/task-009-fire-shuriken/throw'
$evidence = Join-Path $repo 'docs/map01/commits/task-009-03-fire-shuriken-art'
$raw = [Drawing.Bitmap]::new((Join-Path $root 'source-v2.png'))
# Các rect source đo theo PNG thật. Pose release có tay vượt grid đề nghị;
# rect rộng hơn giữ đủ đầu ngón tay, không cắt hoặc vẽ lại bộ phận.
$rects = @(@(0,0,512,512),@(512,0,512,512),@(1024,0,512,512),@(0,512,566,512),@(566,512,458,512),@(1024,512,512,512))
$hips = @(280,288,281,277,241,266)
# Một scale cho toàn clip, theo đầu/thân và idle gốc; không fit từng bbox.
$scale = 0.6
$sheet = [Drawing.Bitmap]::new(1536,1024,[Drawing.Imaging.PixelFormat]::Format32bppArgb)
$sg = [Drawing.Graphics]::FromImage($sheet)
$frames = @()
for($i=0;$i -lt 6;$i++){
  $r=$rects[$i]
  $cell=$raw.Clone([Drawing.Rectangle]::new($r[0],$r[1],$r[2],$r[3]),[Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $bounds=[ThrowInk]::Bounds($cell)
  $left=[int][Math]::Round(192-$hips[$i]*$scale)
  $top=[int][Math]::Round(353-$bounds[3]*$scale)
  $pose=[Drawing.Bitmap]::new(512,512,[Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $g=[Drawing.Graphics]::FromImage($pose)
  $g.InterpolationMode=[Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.DrawImage($cell,[Drawing.Rectangle]::new($left,$top,[int][Math]::Round($r[2]*$scale),[int][Math]::Round($r[3]*$scale)))
  $g.Dispose()
  $x=($i%3)*512;$y=[int][Math]::Floor($i/3)*512
  $sg.DrawImageUnscaled($pose,$x,$y)
  $frames+=@{index=$i;sourceRect=$r;sourceHipX=$hips[$i];sourceInk=$bounds;translation=@($left,$top);rect=@($x,$y,512,512);pivot=@(192,353);candidateInk=[ThrowInk]::Bounds($pose)}
  $pose.Dispose();$cell.Dispose()
}
$sg.Dispose();$sheet.Save((Join-Path $root 'throw-atlas.png'),[Drawing.Imaging.ImageFormat]::Png)
$raw.Dispose()
$utf8=[Text.UTF8Encoding]::new($false)
$meta=[ordered]@{status='CANDIDATE_THROW_NOT_APPROVED_PREVIEW_ONLY';tool='image_gen.imagegen built-in';source='source-v2.png';sourceOriginal='exec-c0bdfacb-3093-412a-9eec-aa0b87f1b83d.png';sourcePixelSize=@(1536,1024);image='throw-atlas.png';pixelSize=@(1536,1024);frameSize=@(512,512);columns=3;rows=2;uniformScale=$scale;pixelWorldUnit=0.00625;pivot=@(192,353);frameMs=@(85,100,65,70,90,140);releaseFrame=3;releasePoint=@(355,126);frames=$frames;sourceSha256=(Get-FileHash -LiteralPath (Join-Path $root 'source-v2.png') -Algorithm SHA256).Hash.ToLower();candidateSha256=(Get-FileHash -LiteralPath (Join-Path $root 'throw-atlas.png') -Algorithm SHA256).Hash.ToLower();canonicalChanged=$false;runtimeIntegration='NOT_IMPLEMENTED';timing='PREVIEW_ONLY'}
[IO.File]::WriteAllText((Join-Path $root 'atlas.json'),($meta|ConvertTo-Json -Depth 12),$utf8)
[IO.File]::WriteAllText((Join-Path $root 'review-data.js'),('window.throwReview='+(@{frameMs=$meta.frameMs;releaseFrame=$meta.releaseFrame;releasePoint=$meta.releasePoint}|ConvertTo-Json -Depth 4 -Compress)+';'),$utf8)
# Contact sheet: idle + sáu pose, giữ nguyên kích thước pixel trên từng panel.
$contact=[Drawing.Bitmap]::new(1680,820,[Drawing.Imaging.PixelFormat]::Format32bppArgb)
$cg=[Drawing.Graphics]::FromImage($contact);$cg.Clear([Drawing.Color]::FromArgb(24,38,61))
$font=[Drawing.Font]::new('Segoe UI',13)
$pen=[Drawing.Pen]::new([Drawing.Color]::FromArgb(110,130,155))
$idle=[Drawing.Bitmap]::new((Join-Path $root 'idle-reference.png'))
$labels=@('Idle goc','1. Lay da','2. Xoay vai','3. Vung tay','4. Tha phi tieu','5. Ha tay','6. Thu the')
for($panel=0;$panel -lt 7;$panel++){
  $col=$panel%4;$row=[int][Math]::Floor($panel/4);$px=$col*420;$py=$row*410
  $cg.DrawLine($pen,$px,$py+353,$px+420,$py+353)
  $cg.DrawString($labels[$panel],$font,[Drawing.Brushes]::White,[single]($px+18),[single]($py+375))
  if($panel -eq 0){$cg.DrawImageUnscaled($idle,$px+18,$py+64)}
  else{$i=$panel-1;$cg.DrawImage($sheet,[Drawing.Rectangle]::new($px+18,$py,512,512),[Drawing.Rectangle]::new(($i%3)*512,[int][Math]::Floor($i/3)*512,512,512),[Drawing.GraphicsUnit]::Pixel)}
}
$cg.Dispose();$font.Dispose();$pen.Dispose();$idle.Dispose();$sheet.Dispose()
$contact.Save((Join-Path $evidence 'throw-contact-sheet.png'),[Drawing.Imaging.ImageFormat]::Png);$contact.Dispose()
Write-Output 'Authored throw candidate and art-only contact sheet. Runtime unchanged.'

