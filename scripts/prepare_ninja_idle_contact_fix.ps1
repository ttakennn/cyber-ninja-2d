$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Drawing
Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @'
using System;
using System.Drawing;
public class IdleContact42 {
  public static int CleanHand(Bitmap body,Bitmap guide,int left){int count=0;for(int y=153;y<180;y++)for(int x=124;x<=left+1;x++){var c=body.GetPixel(x,y);if(c.A==0)continue;var a=guide.GetPixel(x-120,y-145).A;bool core=x<left-2&&a<100;bool brown=c.R>c.G+1&&c.R>c.B+1&&a<180;bool skin=x>=left-1&&c.G>45&&c.B>25;bool edge=x<left&&c.R<22&&c.G<22&&c.B<22&&a<40;if((core||brown||edge)&&!skin){body.SetPixel(x,y,Color.Transparent);count++;}}return count;}
  public static bool Glove(Color c){return c.A>180&&c.R>=15&&c.R<80&&c.G>=15&&c.G<80&&c.B>=c.R+1&&c.B<95;}
  public static int TrimExterior(Bitmap body,int left){int n=0,previous=left;for(int y=158;y<178;y++){int first=-1;for(int x=128;x<164;x++)if(Glove(body.GetPixel(x,y))&&Glove(body.GetPixel(x+1,y))&&Glove(body.GetPixel(x+2,y))){first=x;break;}if(first<0){for(int x=Math.Max(128,previous-1);x<165;x++){var c=body.GetPixel(x,y);if(c.A>180&&c.R>90&&c.G>45&&c.B>25&&c.R>1.15*c.G){first=x;break;}}}if(first<0)continue;int edge=Math.Min(first-1,left+2);previous=edge;for(int x=124;x<edge;x++)if(body.GetPixel(x,y).A>0){body.SetPixel(x,y,Color.Transparent);n++;}}return n;}
  public static int Contact(Bitmap body,int axis,int start,int end){for(int y=start;y<end;y++){int solid=0;for(int x=axis-1;x<=axis+1;x++)if(body.GetPixel(x,y).A>=180)solid++;if(solid>=2)return y;}throw new Exception("Back contact not found");}
  public static int Gaps(Bitmap output,int axis,int top,int bottom){int n=0;for(int y=top;y<=bottom;y++)if(output.GetPixel(axis,y).A<128)n++;return n;}
  public static int Differences(Bitmap a,Bitmap b,int x0,int y0,int width,int height){int n=0;for(int y=y0;y<y0+height;y++)for(int x=x0;x<x0+width;x++)if(a.GetPixel(x,y).ToArgb()!=b.GetPixel(x,y).ToArgb())n++;return n;}
}
'@
$repo=Split-Path $PSScriptRoot -Parent;$source=Join-Path $repo 'integration/ninja-idle-contact-fix'
$plan=Get-Content (Join-Path $source 'plan.json') -Raw -Encoding UTF8|ConvertFrom-Json
$base=Join-Path $repo $plan.baseDirectory;$out=Join-Path $repo $plan.reviewDirectory;New-Item -ItemType Directory -Force $out|Out-Null
$data=Get-Content (Join-Path $base 'review.json') -Raw -Encoding UTF8|ConvertFrom-Json
$old=[System.Drawing.Bitmap]::new((Join-Path $base 'idle-atlas.png'))
$bodySource=[System.Drawing.Bitmap]::new((Join-Path $base 'body-atlas.png'))
$weapon=[System.Drawing.Bitmap]::new((Join-Path $base 'back-sword.png'))
$guideSource=[System.Drawing.Bitmap]::new((Join-Path $repo $plan.handGuide))
$atlas=[System.Drawing.Bitmap]::new(1152,640,[System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$bodies=[System.Drawing.Bitmap]::new(1152,640,[System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$attachment=@();$audit=@()
for($i=0;$i -lt 6;$i++){
  $f=$data.frames[$i];$col=$i%3;$row=[int][Math]::Floor($i/3)
  $body=$bodySource.Clone([System.Drawing.Rectangle]::new($f.x,$f.y,384,320),[System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $gx=[int][Math]::Floor($guideSource.Width*$col/3);$gy=[int][Math]::Floor($guideSource.Height*$row/2)
  $gw=[int][Math]::Floor($guideSource.Width*($col+1)/3)-$gx;$gh=[int][Math]::Floor($guideSource.Height*($row+1)/2)-$gy
  $guide=[System.Drawing.Bitmap]::new(55,37,[System.Drawing.Imaging.PixelFormat]::Format32bppArgb);$g=[System.Drawing.Graphics]::FromImage($guide)
  $g.InterpolationMode=[System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor;$g.DrawImage($guideSource,[System.Drawing.Rectangle]::new(0,0,55,37),[System.Drawing.Rectangle]::new($gx,$gy,$gw,$gh),[System.Drawing.GraphicsUnit]::Pixel);$g.Dispose()
  $removed=[IdleContact42]::CleanHand($body,$guide,$plan.gloveLeft[$i]);$removed+=[IdleContact42]::TrimExterior($body,$plan.gloveLeft[$i]);$guide.Dispose()
  $a=$data.attachments[$i];$axis=[int]$a.swordAxisX;$dy=[int]$a.shoulderOffset[1]+$plan.swordSinkY
  $contact=[IdleContact42]::Contact($body,$axis,$plan.contactSearchStart,$plan.contactSearchEnd);$bottom=$contact+$plan.underlapPixels
  $pose=[System.Drawing.Bitmap]::new(384,320,[System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $g=[System.Drawing.Graphics]::FromImage($pose);$g.SetClip([System.Drawing.Rectangle]::new(0,0,384,$bottom));$g.DrawImageUnscaled($weapon,[int]$a.shoulderOffset[0],$dy);$g.ResetClip();$g.DrawImageUnscaled($body,0,0);$g.Dispose()
  # Preserve exact body RGBA everywhere except the visible top-weapon strip.
  for($y=0;$y -lt 320;$y++){for($x=0;$x -lt 384;$x++){if($y -ge $bottom -or $x -lt $axis-10 -or $x -gt $axis+10){$pose.SetPixel($x,$y,$body.GetPixel($x,$y))}}}
  $oldFrame=$old.Clone([System.Drawing.Rectangle]::new($f.x,$f.y,384,320),[System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $gaps=[IdleContact42]::Gaps($pose,$axis,([int]$a.swordTop+$plan.swordSinkY+27),$contact)
  $audit+=@{frame=$i;oldGripPixelsRemoved=$removed;contactGapPixels=$gaps;headDifferences=[IdleContact42]::Differences($pose,$oldFrame,190,30,55,75);abdomenDifferences=[IdleContact42]::Differences($pose,$oldFrame,194,105,35,23);beltDifferences=[IdleContact42]::Differences($pose,$oldFrame,204,128,24,17);lowerSwordDifferences=[IdleContact42]::Differences($pose,$body,0,$bottom,384,(320-$bottom))}
  $attachment+=@{frame=$i;shoulderOffset=$a.shoulderOffset;swordAxisX=$axis;swordTop=([int]$a.swordTop+$plan.swordSinkY);scarfContactY=$contact;visibleBottom=$bottom}
  foreach($pair in @(@($atlas,$pose),@($bodies,$body))){$g=[System.Drawing.Graphics]::FromImage($pair[0]);$g.DrawImageUnscaled($pair[1],$f.x,$f.y);$g.Dispose()}
  $oldFrame.Dispose();$pose.Dispose();$body.Dispose()
}
$atlas.Save((Join-Path $out 'idle-atlas.png'));$bodies.Save((Join-Path $out 'body-atlas.png'))
Copy-Item -LiteralPath (Join-Path $base 'production-idle-atlas.png') -Destination (Join-Path $out 'production-idle-atlas.png')
Copy-Item -LiteralPath (Join-Path $base 'idle-atlas.png') -Destination (Join-Path $out 'before-atlas.png')
$review=@{status=$plan.status;fps=$data.fps;loop=$true;frames=$data.frames;pivot=@(192,289);attachments=$attachment;axis=@(@(174,22),@(174,62));pixelAudit=$audit;scope=$plan.scope}
[System.IO.File]::WriteAllText((Join-Path $out 'review.json'),($review|ConvertTo-Json -Depth 12),[System.Text.UTF8Encoding]::new($false))
[System.IO.File]::WriteAllText((Join-Path $out 'review-data.js'),('window.idleReview='+($review|ConvertTo-Json -Depth 12 -Compress)+';'),[System.Text.UTF8Encoding]::new($false))
foreach($name in @('preview.html','preview.js')){Copy-Item -LiteralPath (Join-Path $source $name) -Destination (Join-Path $out $name)}
$detail=[System.Drawing.Bitmap]::new(1000,1080,[System.Drawing.Imaging.PixelFormat]::Format32bppArgb);$g=[System.Drawing.Graphics]::FromImage($detail);$g.Clear([System.Drawing.Color]::FromArgb(255,20,35,55));$g.InterpolationMode=[System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor;$font=[System.Drawing.Font]::new('Arial',13)
for($i=0;$i -lt 6;$i++){
  $f=$data.frames[$i];$y=$i*180;$axis=$attachment[$i].swordAxisX
  $g.DrawString(('F'+($i+1)+' hand before / after'),$font,[System.Drawing.Brushes]::Wheat,5,($y+5));$g.DrawString('back contact before / after',$font,[System.Drawing.Brushes]::Wheat,505,($y+5))
  $g.DrawImage($old,[System.Drawing.Rectangle]::new(5,($y+30),220,148),[System.Drawing.Rectangle]::new(($f.x+120),($f.y+145),55,37),[System.Drawing.GraphicsUnit]::Pixel)
  $g.DrawImage($atlas,[System.Drawing.Rectangle]::new(255,($y+30),220,148),[System.Drawing.Rectangle]::new(($f.x+120),($f.y+145),55,37),[System.Drawing.GraphicsUnit]::Pixel)
  $g.DrawImage($old,[System.Drawing.Rectangle]::new(505,($y+30),140,140),[System.Drawing.Rectangle]::new(($f.x+$axis-17),($f.y+35),35,35),[System.Drawing.GraphicsUnit]::Pixel)
  $g.DrawImage($atlas,[System.Drawing.Rectangle]::new(755,($y+30),140,140),[System.Drawing.Rectangle]::new(($f.x+$axis-17),($f.y+35),35,35),[System.Drawing.GraphicsUnit]::Pixel)
}
$g.Dispose();$font.Dispose();$detail.Save((Join-Path $out 'contact-review.png'));$detail.Dispose()
$motionDir=Join-Path $out 'motion-frames';New-Item -ItemType Directory -Force $motionDir|Out-Null
for($i=0;$i -lt 6;$i++){
  $f=$data.frames[$i];$motion=[System.Drawing.Bitmap]::new(800,400,[System.Drawing.Imaging.PixelFormat]::Format32bppArgb);$g=[System.Drawing.Graphics]::FromImage($motion);$g.Clear([System.Drawing.Color]::FromArgb(255,20,35,55));$font=[System.Drawing.Font]::new('Arial',15)
  for($s=0;$s -lt 2;$s++){$img=if($s -eq 0){$old}else{$atlas};$label=if($s -eq 0){'Before'}else{'After'};$g.DrawString(($label+' / Frame '+($i+1)),$font,[System.Drawing.Brushes]::Wheat,($s*400+20),15);$g.DrawImage($img,[System.Drawing.Rectangle]::new(($s*400+8),65,384,320),[System.Drawing.Rectangle]::new($f.x,$f.y,384,320),[System.Drawing.GraphicsUnit]::Pixel)}
  $g.Dispose();$font.Dispose();$motion.Save((Join-Path $motionDir ('frame-'+$i+'.png')));$motion.Save((Join-Path $motionDir ('frame-'+$i+'.gif')),[System.Drawing.Imaging.ImageFormat]::Gif);$motion.Dispose()
}
& node (Join-Path $repo 'scripts/assemble_ninja_idle_contact_review.mjs');if($LASTEXITCODE -ne 0){throw 'Cannot author review GIF'}
$files=@('integration/ninja-idle-contact-fix/plan.json',$plan.handGuide,'integration/ninja-idle-contact-fix/prompt.txt','scripts/prepare_ninja_idle_contact_fix.ps1',($plan.baseDirectory+'/idle-atlas.png'),($plan.reviewDirectory+'/idle-atlas.png'),($plan.reviewDirectory+'/contact-review.png'),($plan.reviewDirectory+'/motion-preview.gif'))
$hashes=foreach($file in $files){@{path=$file;sha256=(Get-FileHash -LiteralPath (Join-Path $repo $file) -Algorithm SHA256).Hash.ToLower()}}
@{status=$plan.status;tool='image_gen.imagegen';method='Generated local hand cleanup used as alpha guide only. Original Task10.41 pixels retained; brown old grip removed near fist. Same short rigid sword/shoulder offsets, deeper insertion and per-frame actual scarf contact.';files=$hashes;pixelAudit=$audit;attachments=$attachment;productionChanged=$false;runtimeChanged=$false}|ConvertTo-Json -Depth 12|Set-Content -Encoding UTF8 (Join-Path $out 'provenance.json')
$atlas.Dispose();$bodies.Dispose();$old.Dispose();$bodySource.Dispose();$weapon.Dispose();$guideSource.Dispose()
Write-Output (@{audit=$audit;attachments=$attachment}|ConvertTo-Json -Depth 10 -Compress)
