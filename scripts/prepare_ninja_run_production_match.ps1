$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Drawing
Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @'
using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Collections.Generic;
public class NinjaRun55 {
 public static Bitmap Place(Bitmap b,double scale,double x,double y) {
  var dst=new Bitmap(384,320,System.Drawing.Imaging.PixelFormat.Format32bppArgb);
  using(var g=Graphics.FromImage(dst)){g.Clear(Color.Transparent);g.InterpolationMode=InterpolationMode.HighQualityBicubic;g.PixelOffsetMode=PixelOffsetMode.HighQuality;g.DrawImage(b,new RectangleF((float)x,(float)y,(float)(b.Width*scale),(float)(b.Height*scale)),new RectangleF(0,0,b.Width,b.Height),GraphicsUnit.Pixel);}
  return dst;
 }
 public static int[] Bounds(Bitmap b,int startY) {
  int x0=b.Width,y0=b.Height,x1=-1,y1=-1,count=0,border=0;
  for(int y=0;y<b.Height;y++)for(int x=0;x<b.Width;x++)if(b.GetPixel(x,y).A>=128){if(x==0||y==0||x==b.Width-1||y==b.Height-1)border++;if(y<startY)continue;x0=Math.Min(x0,x);y0=Math.Min(y0,y);x1=Math.Max(x1,x);y1=Math.Max(y1,y);count++;}
  return new[]{x0,y0,x1,y1,count,border};
 }
 public static int[] Components(Bitmap b) {
  var seen=new bool[b.Width,b.Height];var sizes=new List<int>();
  for(int y=0;y<b.Height;y++)for(int x=0;x<b.Width;x++){if(seen[x,y]||b.GetPixel(x,y).A<128)continue;int count=0;var q=new Queue<int>();q.Enqueue(y*b.Width+x);seen[x,y]=true;
   while(q.Count>0){var v=q.Dequeue();int vx=v%b.Width,vy=v/b.Width;count++;for(int yy=Math.Max(0,vy-1);yy<=Math.Min(b.Height-1,vy+1);yy++)for(int xx=Math.Max(0,vx-1);xx<=Math.Min(b.Width-1,vx+1);xx++)if(!seen[xx,yy]&&b.GetPixel(xx,yy).A>=128){seen[xx,yy]=true;q.Enqueue(yy*b.Width+xx);}}sizes.Add(count);}
  sizes.Sort();sizes.Reverse();return sizes.ToArray();
 }
}
'@
$repo=Split-Path $PSScriptRoot -Parent
$source=Join-Path $repo 'integration/ninja-run-production-match'
$plan=Get-Content -LiteralPath (Join-Path $source 'plan.json') -Raw -Encoding UTF8|ConvertFrom-Json
if((Get-FileHash -LiteralPath (Join-Path $repo $plan.source) -Algorithm SHA256).Hash.ToLower() -ne $plan.sourceSha256){throw 'Source changed'}
$out=Join-Path $repo $plan.reviewDirectory
New-Item -ItemType Directory -Force $out|Out-Null
$dir=Join-Path $out 'motion-frames'
New-Item -ItemType Directory -Force $dir|Out-Null
$art=[System.Drawing.Bitmap]::new((Join-Path $repo $plan.source))
$old=[System.Drawing.Bitmap]::new((Join-Path $repo $plan.oldRunReference))
$combat=[System.Drawing.Bitmap]::new((Join-Path $repo $plan.referenceCombat))
$meta=Get-Content -LiteralPath (Join-Path $repo $plan.referenceCombatMetadata) -Raw -Encoding UTF8|ConvertFrom-Json
$contract=Get-Content -LiteralPath (Join-Path $repo $plan.referenceContract) -Raw -Encoding UTF8|ConvertFrom-Json
$atlas=[System.Drawing.Bitmap]::new(2304,640,[System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$frames=@();$observations=@()
for($i=0;$i -lt 12;$i++){
 $sx=($i%4)*384;$sy=[int][Math]::Round([Math]::Floor($i/4)*1024/3);$bottom=[int][Math]::Round(([Math]::Floor($i/4)+1)*1024/3)
 $cell=$art.Clone([System.Drawing.Rectangle]::new($sx,$sy,384,($bottom-$sy)),[System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
 $dx=$plan.pelvisTargetX-$plan.sourceWaistAnchors[$i][0]*$plan.scale
 $pose=[NinjaRun55]::Place($cell,$plan.scale,$dx,$plan.verticalTranslation)
 $x=($i%6)*384;$y=[int][Math]::Floor($i/6)*320
 $g=[System.Drawing.Graphics]::FromImage($atlas);$g.CompositingMode=[System.Drawing.Drawing2D.CompositingMode]::SourceCopy;$g.DrawImageUnscaled($pose,$x,$y);$g.Dispose()
 $pose.Save((Join-Path $dir ('pose-'+$i+'.png')))
 $bounds=[NinjaRun55]::Bounds($pose,0);$lower=[NinjaRun55]::Bounds($pose,220);$components=[NinjaRun55]::Components($pose)
 $observations+=@{frame=$i;sourceRect=@($sx,$sy,384,($bottom-$sy));translation=@($dx,$plan.verticalTranslation);bounds=$bounds;lowerRegionY=220;lowerLegEnvelope=($lower[2]-$lower[0]+1);lowestY=$bounds[3];footPlaneGap=(289-$bounds[3]);alphaBorderPixels=$bounds[5];detachedComponentsOver3Pixels=[Math]::Max(0,@($components|Where-Object {$_ -gt 3}).Count-1)}
 $frames+=@{x=$x;y=$y;width=384;height=320;sourceWidth=384;sourceHeight=320;offsetX=0;offsetY=0;pivot=$plan.pivot;label=$plan.frameLabels[$i]}
 $cell.Dispose();$pose.Dispose()
}
$atlas.Save((Join-Path $out 'run-atlas.png'))
Copy-Item -LiteralPath (Join-Path $repo $plan.referenceCombat) -Destination (Join-Path $out 'combat51-atlas.png')
Copy-Item -LiteralPath (Join-Path $repo $plan.oldRunReference) -Destination (Join-Path $out 'old-run-reference.png')
foreach($theme in @('light','dark')){
 $b=[System.Drawing.Bitmap]::new(2304,640);$g=[System.Drawing.Graphics]::FromImage($b)
 if($theme -eq 'light'){$g.Clear([System.Drawing.Color]::FromArgb(222,230,240))}else{$g.Clear([System.Drawing.Color]::FromArgb(20,35,55))}
 $g.DrawImageUnscaled($atlas,0,0);$g.Dispose();$b.Save((Join-Path $out ('contact-sheet-'+$theme+'.png')));$b.Dispose()
}
$font=[System.Drawing.Font]::new('Arial',14)
for($i=0;$i -lt 12;$i++){
 $ms=$i*1000.0/$plan.fps;$bi=[int][Math]::Floor($ms/140)%6;$oi=[int][Math]::Floor($ms*12/1000)%8;$rf=$meta.clips.combatIdle.frames[$bi]
 $b=[System.Drawing.Bitmap]::new(1152,810);$g=[System.Drawing.Graphics]::FromImage($b);$g.Clear([System.Drawing.Color]::FromArgb(20,35,55));$g.InterpolationMode=[System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor;$g.PixelOffsetMode=[System.Drawing.Drawing2D.PixelOffsetMode]::Half
 $images=@($combat,$old,$atlas)
 $rects=@([System.Drawing.Rectangle]::new($rf.x,$rf.y,384,320),[System.Drawing.Rectangle]::new((($oi%4)*384),([int][Math]::Floor($oi/4)*320),384,320),[System.Drawing.Rectangle]::new($frames[$i].x,$frames[$i].y,384,320))
 $labels=@('APPROVED 10.51','PRODUCTION RUN - 8F','REDRAW 10.55 - 12F')
 for($c=0;$c -lt 3;$c++){
  $g.DrawString($labels[$c],$font,[System.Drawing.Brushes]::Wheat,($c*384+10),10)
  $g.DrawImage($images[$c],[System.Drawing.Rectangle]::new(($c*384),45,384,320),$rects[$c],[System.Drawing.GraphicsUnit]::Pixel)
  $g.DrawLine([System.Drawing.Pens]::SlateGray,($c*384+20),334,($c*384+364),334)
  $g.DrawImage($images[$c],[System.Drawing.Rectangle]::new(($c*384+12),405,360,324),[System.Drawing.Rectangle]::new(($rects[$c].X+95),($rects[$c].Y+20),200,180),[System.Drawing.GraphicsUnit]::Pixel)
 }
 $g.DrawString(('FRAME '+($i+1)+'/12 - SAME PIXEL SCALE IN ALL COLUMNS'),$font,[System.Drawing.Brushes]::Wheat,10,770)
 $g.Dispose();$b.Save((Join-Path $dir ('frame-'+$i+'.png')));$b.Save((Join-Path $dir ('frame-'+$i+'.gif')),[System.Drawing.Imaging.ImageFormat]::Gif);$b.Dispose()
 $loop=[System.Drawing.Bitmap]::new(384,320);$lg=[System.Drawing.Graphics]::FromImage($loop);$lg.Clear([System.Drawing.Color]::FromArgb(20,35,55));$lg.DrawImage($atlas,[System.Drawing.Rectangle]::new(0,0,384,320),[System.Drawing.Rectangle]::new($frames[$i].x,$frames[$i].y,384,320),[System.Drawing.GraphicsUnit]::Pixel);$lg.Dispose();$loop.Save((Join-Path $dir ('loop-'+$i+'.gif')),[System.Drawing.Imaging.ImageFormat]::Gif);$loop.Dispose()
}
$data=@{task=$plan.task;status=$plan.status;image='run-atlas.png';frameWidth=384;frameHeight=320;columns=6;frames=$frames;fps=$plan.fps;loop=$true;pivot=$plan.pivot;normalization=@{scale=$plan.scale;verticalTranslation=$plan.verticalTranslation;method=$plan.normalization};reference=@{combatIdleFrames=$meta.clips.combatIdle.frames;combatFps=$meta.clips.combatIdle.fps;oldRunFps=12};observations=$observations;productionChanged=$false;runtimeChanged=$false}
[System.IO.File]::WriteAllText((Join-Path $out 'review.json'),($data|ConvertTo-Json -Depth 12),[System.Text.UTF8Encoding]::new($false))
[System.IO.File]::WriteAllText((Join-Path $out 'review-data.js'),('window.ninjaRun='+($data|ConvertTo-Json -Depth 12 -Compress)+';'),[System.Text.UTF8Encoding]::new($false))
foreach($file in @('preview.html','preview.js')){Copy-Item -LiteralPath (Join-Path $source $file) -Destination (Join-Path $out $file)}
$art.Dispose();$old.Dispose();$combat.Dispose();$atlas.Dispose();$font.Dispose()
Write-Output ($observations|ConvertTo-Json -Compress -Depth 6)
