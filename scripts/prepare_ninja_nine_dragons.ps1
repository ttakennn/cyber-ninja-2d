$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Drawing
Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @'
using System; using System.Drawing; using System.Drawing.Imaging; using System.Runtime.InteropServices;
public static class DragonInk {
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
$root=Join-Path $repo 'integration/task-009-nine-dragons'
$plan=Get-Content -LiteralPath (Join-Path $root 'art-plan.json') -Raw -Encoding UTF8 | ConvertFrom-Json
$evidence=Join-Path $repo $(if($plan.evidenceDirectory){$plan.evidenceDirectory}else{'docs/map01/commits/task-009-11-nine-dragons-art'})
New-Item -ItemType Directory -Force (Join-Path $root 'candidate'),$evidence | Out-Null
$utf8=[Text.UTF8Encoding]::new($false);$assets=[ordered]@{}
foreach($name in @('cast','dragon','seal','burst','aura')){
  $spec=$plan.$name
  $sourcePath=Join-Path $root $spec.source
  $raw=[Drawing.Bitmap]::new($sourcePath)
  $cell=if($name -eq 'cast'){$spec.sourceCell}elseif($name -eq 'aura'){$spec.frameSize}else{$spec.cell}
  $expected=if($name -eq 'aura'){$spec.sourcePixelSize}else{@(($cell[0]*$spec.columns),($cell[1]*$spec.rows))}
  if($raw.Width -ne $expected[0] -or $raw.Height -ne $expected[1]){throw "Unexpected authoring source dimensions: $name"}
  $fw=if($name -eq 'cast'){512}else{$cell[0]};$fh=if($name -eq 'cast'){512}else{$cell[1]}
  $sheet=[Drawing.Bitmap]::new(($fw*$spec.columns),($fh*$spec.rows),[Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $sg=[Drawing.Graphics]::FromImage($sheet);$frames=@();$audit=@()
  for($i=0;$i -lt $spec.columns*$spec.rows;$i++){
    $r=if($name -eq 'aura'){$spec.sourceRects[$i]}else{@((($i%$spec.columns)*$cell[0]),([int][Math]::Floor($i/$spec.columns)*$cell[1]),$cell[0],$cell[1])}
    $sx=$r[0];$sy=$r[1]
    $pose=$raw.Clone([Drawing.Rectangle]::new($sx,$sy,$r[2],$r[3]),[Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $ink=[DragonInk]::Bounds($pose);$left=0;$top=0
    $pivot=if($name -eq 'seal'){$spec.pivots[$i]}else{$spec.pivot}
    $x=($i%$spec.columns)*$fw;$y=[int][Math]::Floor($i/$spec.columns)*$fh
    if($name -eq 'cast'){
      # One global anatomy scale, never independently fit each pose to its silhouette.
      $left=[int][Math]::Round($pivot[0]-$spec.hipX*$spec.scale)
      $top=[int][Math]::Round($pivot[1]-$ink[3]*$spec.scale)
      $sg.InterpolationMode=[Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
      $sg.DrawImage($pose,[Drawing.Rectangle]::new(($x+$left),($y+$top),[int][Math]::Round($cell[0]*$spec.scale),[int][Math]::Round($cell[1]*$spec.scale)))
    }elseif($name -eq 'aura'){
      # Preserve source pixels; only center/pad the 443/444px cells into a fixed512px canvas.
      $left=[int][Math]::Round($pivot[0]-$r[2]/2);$top=[int][Math]::Round($pivot[1]-$r[3]/2)
      $sg.DrawImageUnscaled($pose,($x+$left),($y+$top))
    }else{$sg.DrawImageUnscaled($pose,$x,$y)}
    $frames+=@{rect=@($x,$y,$fw,$fh);pivot=$pivot}
    $audit+=@{index=$i;sourceRect=$r;sourceInk=$ink;translation=@($left,$top)}
    $pose.Dispose()
  }
  $sg.Dispose();$target=Join-Path $root $spec.image
  if($name -in @('cast','aura')){$sheet.Save($target,[Drawing.Imaging.ImageFormat]::Png)}else{Copy-Item -LiteralPath $sourcePath -Destination $target}
  $sheet.Dispose()
  $assets[$name]=[ordered]@{image=$spec.image;pixelSize=@(($fw*$spec.columns),($fh*$spec.rows));frameSize=@($fw,$fh);frames=$frames;source=$spec.source;sourcePixelSize=@($raw.Width,$raw.Height);original=$spec.original;tool='image_gen.imagegen built-in';sourceSha256=(Get-FileHash -LiteralPath $sourcePath -Algorithm SHA256).Hash.ToLower();sha256=(Get-FileHash -LiteralPath $target -Algorithm SHA256).Hash.ToLower();authoring=$audit}
  $raw.Dispose()
}
$metadata=[ordered]@{status=$plan.status;plan='art-plan.json';runtimeIntegration='NOT_IMPLEMENTED';characterPixelWorldUnit=0.00625;assets=$assets}
[IO.File]::WriteAllText((Join-Path $root 'atlas.json'),($metadata|ConvertTo-Json -Depth 14),$utf8)
$review=@{plan=$plan;assets=$assets}
[IO.File]::WriteAllText((Join-Path $root 'review-data.js'),('window.nineDragonsReview='+($review|ConvertTo-Json -Depth 16 -Compress)+';'),$utf8)
if($plan.previewEffectsOnly){Write-Output 'Authored preview metadata for thickness/glow; existing artwork and runtime unchanged.';exit}
$pictures=@{}
foreach($name in @('cast','dragon','seal','burst','aura')){$pictures[$name]=[Drawing.Bitmap]::new((Join-Path $root $plan.$name.image))}
$idle=[Drawing.Bitmap]::new((Join-Path $root 'source/idle-reference.png'))
function Draw-ArtFrame($g,$name,$index,[double]$x,[double]$y,[double]$width){
  $f=$assets[$name].frames[$index];$s=$width/$f.rect[2]
  $g.DrawImage($pictures[$name],[Drawing.RectangleF]::new([single]($x-$f.pivot[0]*$s),[single]($y-$f.pivot[1]*$s),[single]($f.rect[2]*$s),[single]($f.rect[3]*$s)),[Drawing.RectangleF]::new($f.rect[0],$f.rect[1],$f.rect[2],$f.rect[3]),[Drawing.GraphicsUnit]::Pixel)
}
$contact=[Drawing.Bitmap]::new(1140,1200);$cg=[Drawing.Graphics]::FromImage($contact);$cg.Clear([Drawing.Color]::FromArgb(19,30,49))
$font=[Drawing.Font]::new('Segoe UI',14);$title=[Drawing.Font]::new('Segoe UI',24,[Drawing.FontStyle]::Bold)
$pen=[Drawing.Pen]::new([Drawing.Color]::FromArgb(95,116,145))
for($p=0;$p -lt 9;$p++){
  $px=($p%3)*380;$py=[int][Math]::Floor($p/3)*400
  $cg.DrawLine($pen,$px+16,$py+330,$px+364,$py+330)
  $label=if($p -eq 0){'Idle gốc · cùng tỉ lệ'}else{"$p. "+$plan.cast.labels[$p-1]}
  $cg.DrawString($label,$font,[Drawing.Brushes]::White,[single]($px+18),[single]($py+356))
  if($p -eq 0){$cg.DrawImageUnscaled($idle,$px-2,$py+41)}else{Draw-ArtFrame $cg 'cast' ($p-1) ($px+190) ($py+330) 512}
}
$cg.Dispose();$contact.Save((Join-Path $evidence 'cast-contact-sheet.png'),[Drawing.Imaging.ImageFormat]::Png);$contact.Dispose()
$board=[Drawing.Bitmap]::new(1440,760);$bg=[Drawing.Graphics]::FromImage($board);$bg.Clear([Drawing.Color]::FromArgb(12,22,41))
$bg.DrawString($plan.name,$title,[Drawing.Brushes]::Gold,32,22)
$bg.DrawString('Art candidate · 0,35s tụ hỏa → 0,8s ba đợt → 0,25s bạo viêm · chưa tích hợp game',$font,[Drawing.Brushes]::LightSteelBlue,32,66)
$centers=@(240,720,1200);$labels=@('TỤ HỎA · cắm kiếm','LONG VIÊM TOÀN VŨ · 9 rồng','BẠO VIÊM · kết thúc đợt 3')
for($panel=0;$panel -lt 3;$panel++){
  $cx=$centers[$panel];$floor=540
  $bg.DrawLine($pen,($cx-215),$floor,($cx+215),$floor)
  Draw-ArtFrame $bg 'seal' ([Math]::Min($panel+1,3)) $cx ($floor+4) 400
  if($panel -eq 1){
    for($d=0;$d -lt 9;$d++){
      $angle=$d*2*[Math]::PI/9;$dx=$cx+[Math]::Cos($angle)*160;$dy=($floor-150)+[Math]::Sin($angle)*115
      $state=$bg.Save();$bg.TranslateTransform([single]$dx,[single]$dy);$bg.RotateTransform([single]($angle*180/[Math]::PI+90))
      Draw-ArtFrame $bg 'dragon' ($d%4) 0 0 150;$bg.Restore($state)
    }
  }
  Draw-ArtFrame $bg 'cast' (@(2,5,7)[$panel]) $cx $floor 512
  if($panel -eq 2){Draw-ArtFrame $bg 'burst' 2 $cx ($floor-145) 450}
  $bg.DrawString($labels[$panel],$font,[Drawing.Brushes]::White,[single]($cx-205),598)
}
$bg.DrawString('Cooldown 12s · 3 × 30 HP · Burn 12 HP/s × 3s = tối đa126 HP (brief; chưa có damage/quái)',$font,[Drawing.Brushes]::LightSteelBlue,32,666)
$bg.DrawString('Giữ ninja160px/world unit. Bán kính125px chỉ tại mốc camera preview1280×720; không suy collider từ FX.',$font,[Drawing.Brushes]::LightSteelBlue,32,705)
$bg.Dispose();$board.Save((Join-Path $evidence 'overview.png'),[Drawing.Imaging.ImageFormat]::Png);$board.Dispose()
$board=[Drawing.Bitmap]::new(1920,860);$bg=[Drawing.Graphics]::FromImage($board);$bg.Clear([Drawing.Color]::FromArgb(12,22,41))
$bg.DrawString('CỬU LONG HỎA TRẬN · VÒNG BẠO VIÊM 7 GIÂY',$title,[Drawing.Brushes]::Gold,32,24)
$bg.DrawString('Sau1,4s thi triển · 8pha lửa lặp · nhân vật giữ nguyên cỡ · chưa có sát thương',$font,[Drawing.Brushes]::LightSteelBlue,32,70)
for($panel=0;$panel -lt 3;$panel++){
  $cx=320+$panel*640;$cy=425;$scale=$plan.aura.scaleOptions[$panel]
  $bg.DrawImage($idle,[Drawing.RectangleF]::new([single]($cx-96),[single]($cy+64-144.5),192,160))
  Draw-ArtFrame $bg 'aura' ($panel*2) $cx $cy ($plan.preview.burstFrameWidthPx*$scale)
  $bg.DrawString(($scale.ToString('0.0',[Globalization.CultureInfo]::InvariantCulture)+'× · tồn tại7s'),$title,[Drawing.Brushes]::White,[single]($cx-150),748)
}
$bg.DrawString('Các hệ số áp vào vòng Bạo Viêm gốc; không đổi sprite/pivot/collider nhân vật. Đây là board art để review.',$font,[Drawing.Brushes]::LightSteelBlue,32,812)
$bg.Dispose();$board.Save((Join-Path $evidence 'aura-options.png'),[Drawing.Imaging.ImageFormat]::Png);$board.Dispose()
foreach($img in $pictures.Values){$img.Dispose()};$idle.Dispose();$font.Dispose();$title.Dispose();$pen.Dispose()
Write-Output 'Authored nine-dragons candidates, metadata and art preview boards. Runtime untouched.'
