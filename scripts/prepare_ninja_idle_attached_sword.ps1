$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Drawing
Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @'
using System;
using System.Drawing;
using System.Drawing.Drawing2D;
public class IdleAttached41 {
  public static Rectangle Bounds(Bitmap b){int l=b.Width,t=b.Height,r=-1,d=-1;for(int y=0;y<b.Height;y++)for(int x=0;x<b.Width;x++){if(b.GetPixel(x,y).A<16)continue;l=Math.Min(l,x);t=Math.Min(t,y);r=Math.Max(r,x);d=Math.Max(d,y);}return Rectangle.FromLTRB(l,t,r+1,d+1);}
  public static bool InBand(int x,int y,int[] b){return x>=b[0]&&y>=b[1]&&x<b[0]+b[2]&&y<b[1]+b[3];}
  public static bool InRepair(int x,int y,int[][][] polys){double px=x+.5,py=y+.5;foreach(var p in polys){bool inside=false;for(int i=0,j=p.Length-1;i<p.Length;j=i++){if((p[i][1]>py)!=(p[j][1]>py)&&px<(double)(p[j][0]-p[i][0])*(py-p[i][1])/(p[j][1]-p[i][1])+p[i][0])inside=!inside;}if(inside)return true;}return false;}
  public static int[] Track(Bitmap reference,Bitmap target,int[] rect,int sx,int sy){double best=double.MaxValue;int bx=0,by=0;for(int dy=-sy;dy<=sy;dy++)for(int dx=-sx;dx<=sx;dx++){double cost=0;for(int y=rect[1];y<rect[1]+rect[3];y++)for(int x=rect[0];x<rect[0]+rect[2];x++){var a=reference.GetPixel(x,y);var b=target.GetPixel(x+dx,y+dy);cost+=Math.Abs(a.R-b.R)+Math.Abs(a.G-b.G)+Math.Abs(a.B-b.B)+2*Math.Abs(a.A-b.A);}cost+=.001*(dx*dx+dy*dy);if(cost<best){best=cost;bx=dx;by=dy;}}return new int[]{bx,by};}
  public static bool Tube(int x,int y,int[] t){double vx=t[2]-t[0],vy=t[3]-t[1],den=vx*vx+vy*vy,u=den==0?0:Math.Max(0,Math.Min(1,((x-t[0])*vx+(y-t[1])*vy)/den));double dx=x-t[0]-u*vx,dy=y-t[1]-u*vy;return dx*dx+dy*dy<=t[4]*t[4];}
  public static int[] GoldCenter(Bitmap b){double sx=0,sy=0,n=0;for(int y=123;y<156;y++)for(int x=154;x<205;x++){var c=b.GetPixel(x,y);if(c.A>150&&c.R>125&&c.G>65&&c.R>1.1*c.G&&c.G>1.5*c.B){sx+=x;sy+=y;n++;}}return new int[]{(int)Math.Round(sx/Math.Max(1,n)),(int)Math.Round(sy/Math.Max(1,n))};}
  public static double[] ShoulderCenter(Bitmap b){double sx=0,sy=0,n=0;for(int y=75;y<118;y++)for(int x=150;x<196;x++){var c=b.GetPixel(x,y);if(c.A>200&&c.R>120&&c.G>55&&c.B>20&&c.R<2.7*c.G&&c.G<2.4*c.B){sx+=x;sy+=y;n++;}}return new double[]{sx/Math.Max(1,n),sy/Math.Max(1,n)};}
  public static bool[,] Mask(Bitmap original,int[][] tubes,int[] external,int[] shift){var m=new bool[384,320];int[][][] polygon=new int[][][]{new int[][]{new int[]{148,123},new int[]{183,121},new int[]{207,125},new int[]{209,153},new int[]{166,165},new int[]{147,161}}};for(int y=0;y<320;y++)for(int x=0;x<384;x++){int lx=x-shift[0],ly=y-shift[1];bool ext=InBand(lx,ly,external),inside=ext||InRepair(lx,ly,polygon);foreach(var t in tubes)inside|=Tube(lx,ly,t);if(!inside)continue;var c=original.GetPixel(x,y);bool belt=(c.A>0&&c.R>65&&c.R>2.5*c.G&&c.B>=.8*c.G&&lx>=188&&ly<=143)||(x>=204&&x<228&&y>=128&&y<145);bool abdomen=x>=194&&x<229&&y>=105&&y<128;bool hand=c.A>0&&((ext&&lx>=135&&ly<174)||(lx>=135&&lx<=156&&ly>=122&&ly<175));m[x,y]=!belt&&!hand&&!abdomen;}return m;}
  public static Bitmap Body(Bitmap original,Bitmap cleanup,bool[,] mask,int[] shift){var b=(Bitmap)original.Clone();for(int y=0;y<320;y++)for(int x=0;x<384;x++)if(mask[x,y])b.SetPixel(x,y,cleanup.GetPixel(Math.Max(0,Math.Min(383,x+shift[0])),Math.Max(0,Math.Min(319,y+shift[1]))));return b;}
  public static int[] Preserve(Bitmap output,Bitmap original,Bitmap body,bool[,] mask,int[] band,int[] head,int[] abdomen,int[] belt,int lower){int outside=0,headDiff=0,abd=0,bd=0,lowerDiff=0;for(int y=0;y<320;y++)for(int x=0;x<384;x++){if(y>=lower)output.SetPixel(x,y,body.GetPixel(x,y));if(!mask[x,y]&&!InBand(x,y,band))output.SetPixel(x,y,original.GetPixel(x,y));if(output.GetPixel(x,y).ToArgb()!=original.GetPixel(x,y).ToArgb()){if(!mask[x,y]&&!InBand(x,y,band))outside++;if(InBand(x,y,head))headDiff++;if(InBand(x,y,abdomen))abd++;if(InBand(x,y,belt))bd++;}if(y>=lower&&output.GetPixel(x,y).ToArgb()!=body.GetPixel(x,y).ToArgb())lowerDiff++;}return new int[]{outside,headDiff,abd,bd,lowerDiff};}
}
'@
$repo=Split-Path $PSScriptRoot -Parent
$sourceDir=Join-Path $repo 'integration/ninja-idle-attached-sword'
$plan=Get-Content (Join-Path $sourceDir 'plan.json') -Raw -Encoding UTF8|ConvertFrom-Json
$out=Join-Path $repo $plan.reviewDirectory;New-Item -ItemType Directory -Force $out|Out-Null
$tubes=[int[][]]$plan.repairTubes;$external=[int[]]$plan.externalRepairRect;$head=[int[]]$plan.headAuditRect
$meta=Get-Content (Join-Path $repo $plan.productionMetadata) -Raw -Encoding UTF8|ConvertFrom-Json
$original=[System.Drawing.Bitmap]::new((Join-Path $repo $plan.productionAtlas))
$cleanupSource=[System.Drawing.Bitmap]::new((Join-Path $repo $plan.cleanupSource))
$weaponSource=[System.Drawing.Bitmap]::new((Join-Path $repo $plan.weaponSource))
$bounds=[IdleAttached41]::Bounds($weaponSource);$weaponScale=$plan.weaponHeight/$bounds.Height
$weapon=[System.Drawing.Bitmap]::new(384,320,[System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g=[System.Drawing.Graphics]::FromImage($weapon);$g.InterpolationMode=[System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.DrawImage($weaponSource,[System.Drawing.RectangleF]::new(($plan.weaponAxisX-$bounds.Width*$weaponScale/2),$plan.weaponTop,($bounds.Width*$weaponScale),$plan.weaponHeight),$bounds,[System.Drawing.GraphicsUnit]::Pixel);$g.Dispose();$weapon.Save((Join-Path $out 'back-sword.png'))
$atlas=[System.Drawing.Bitmap]::new(1152,640,[System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$reference=[System.Drawing.Bitmap]::new(1152,640,[System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$cleanAtlas=[System.Drawing.Bitmap]::new(1152,640,[System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$bodyAtlas=[System.Drawing.Bitmap]::new(1152,640,[System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$frames=@();$audits=@();$attachments=@();$baseRef=$null
for($i=0;$i -lt 6;$i++){
  $col=$i%3;$row=[int][Math]::Floor($i/3);$f=$meta.clips.idle.frames[$i]
  $ref=$original.Clone([System.Drawing.Rectangle]::new($f.x,$f.y,384,320),[System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  if($i -eq 0){$baseRef=$ref.Clone()}
  $baseShoulder=[IdleAttached41]::ShoulderCenter($baseRef);$shoulderCenter=[IdleAttached41]::ShoulderCenter($ref)
  $shoulder=[int[]]@(([int][Math]::Round($shoulderCenter[0]-$baseShoulder[0])),([int][Math]::Round($shoulderCenter[1]-$baseShoulder[1])))
  $baseGold=[IdleAttached41]::GoldCenter($baseRef);$gold=[IdleAttached41]::GoldCenter($ref);$hip=[int[]]@(($gold[0]-$baseGold[0]),($gold[1]-$baseGold[1]))
  $x=[int][Math]::Floor($cleanupSource.Width*$col/3);$y=[int][Math]::Floor($cleanupSource.Height*$row/2)
  $w=[int][Math]::Floor($cleanupSource.Width*($col+1)/3)-$x;$h=[int][Math]::Floor($cleanupSource.Height*($row+1)/2)-$y
  $raw=$cleanupSource.Clone([System.Drawing.Rectangle]::new($x,$y,$w,$h),[System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $clean=[System.Drawing.Bitmap]::new(384,320,[System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $g=[System.Drawing.Graphics]::FromImage($clean);$g.InterpolationMode=[System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.DrawImage($raw,[System.Drawing.RectangleF]::new((192-$plan.cleanupPivotX*$plan.cleanupScale),(289-$plan.cleanupRowGround[$row]*$plan.cleanupScale),($w*$plan.cleanupScale),($h*$plan.cleanupScale)));$g.Dispose();$raw.Dispose()
  $cleanupShift=[IdleAttached41]::Track($ref,$clean,[int[]]$plan.tracking.hipRect,8,8)
  $mask=[IdleAttached41]::Mask($ref,$tubes,$external,$hip)
  $body=[IdleAttached41]::Body($ref,$clean,$mask,$cleanupShift)
  $pose=[System.Drawing.Bitmap]::new(384,320,[System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $visibleBottom=$plan.weaponVisibleBottom+$shoulder[1]
  $g=[System.Drawing.Graphics]::FromImage($pose);$g.SetClip([System.Drawing.Rectangle]::new(0,0,384,$visibleBottom));$g.DrawImageUnscaled($weapon,$shoulder[0],$shoulder[1]);$g.ResetClip();$g.DrawImageUnscaled($body,0,0);$g.Dispose()
  $band=[int[]]@(($plan.weaponAxisX+$shoulder[0]-11),0,23,$visibleBottom)
  $audit=[IdleAttached41]::Preserve($pose,$ref,$body,$mask,$band,$head,[int[]]$plan.abdomenAuditRect,[int[]]$plan.beltAuditRect,$visibleBottom)
  $audits+=@{frame=$i;headPixelDifferences=$audit[1];abdomenPixelDifferences=$audit[2];beltPixelDifferences=$audit[3];lowerSwordVisiblePixels=$audit[4];differencesOutsideEditableRegions=$audit[0]}
  $attachments+=@{frame=$i;shoulderOffset=$shoulder;shoulderCenter=$shoulderCenter;hipOffset=$hip;cleanupAlignment=$cleanupShift;swordAxisX=($plan.weaponAxisX+$shoulder[0]);swordTop=($plan.weaponTop+$shoulder[1]);visibleBottom=$visibleBottom}
  foreach($pair in @(@($atlas,$pose),@($reference,$ref),@($cleanAtlas,$clean),@($bodyAtlas,$body))){$g=[System.Drawing.Graphics]::FromImage($pair[0]);$g.DrawImageUnscaled($pair[1],($col*384),($row*320));$g.Dispose()}
  $frames+=@{x=$col*384;y=$row*320;width=384;height=320;pivot=@{x=192;y=289}}
  $pose.Dispose();$body.Dispose();$ref.Dispose();$clean.Dispose()
}
$atlas.Save((Join-Path $out 'idle-atlas.png'));$reference.Save((Join-Path $out 'production-idle-atlas.png'));$cleanAtlas.Save((Join-Path $out 'cleanup-inspection.png'));$bodyAtlas.Save((Join-Path $out 'body-atlas.png'))
$data=@{status=$plan.status;fps=$meta.clips.idle.fps;loop=$true;frames=$frames;pivot=@(192,289);attachments=$attachments;axis=@(@($plan.weaponAxisX,$plan.weaponTop),@($plan.weaponAxisX,$plan.weaponVisibleBottom));scope=$plan.scope;pixelAudit=$audits}
[System.IO.File]::WriteAllText((Join-Path $out 'review.json'),($data|ConvertTo-Json -Depth 12),[System.Text.UTF8Encoding]::new($false))
[System.IO.File]::WriteAllText((Join-Path $out 'review-data.js'),('window.idleReview='+($data|ConvertTo-Json -Depth 12 -Compress)+';'),[System.Text.UTF8Encoding]::new($false))
foreach($name in @('preview.html','preview.js')){Copy-Item -LiteralPath (Join-Path $sourceDir $name) -Destination (Join-Path $out $name)}
$comparison=[System.Drawing.Bitmap]::new(1000,480,[System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g=[System.Drawing.Graphics]::FromImage($comparison);$g.Clear([System.Drawing.Color]::FromArgb(255,16,28,48));$font=[System.Drawing.Font]::new('Arial',18);$pen=[System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(255,80,105,135))
for($i=0;$i -lt 2;$i++){$cx=250+$i*500;$image=if($i -eq 0){$reference}else{$atlas};$label=if($i -eq 0){'Idle production'}else{'Production body / short attached sword'};$g.DrawString($label,$font,[System.Drawing.Brushes]::Wheat,($i*500+25),25);foreach($level in @(38,224,264,289)){$gy=380-289+$level;$g.DrawLine($pen,($i*500+30),$gy,($i*500+470),$gy)};$g.DrawImage($image,[System.Drawing.Rectangle]::new(($cx-192),91,384,320),[System.Drawing.Rectangle]::new(0,0,384,320),[System.Drawing.GraphicsUnit]::Pixel)}
$g.Dispose();$font.Dispose();$pen.Dispose();$comparison.Save((Join-Path $out 'comparison.png'));$comparison.Dispose()
$detail=[System.Drawing.Bitmap]::new(560,340,[System.Drawing.Imaging.PixelFormat]::Format32bppArgb);$g=[System.Drawing.Graphics]::FromImage($detail);$g.Clear([System.Drawing.Color]::FromArgb(255,20,35,55));$g.InterpolationMode=[System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
$g.DrawImage($reference,[System.Drawing.Rectangle]::new(30,20,220,300),[System.Drawing.Rectangle]::new(190,30,55,75),[System.Drawing.GraphicsUnit]::Pixel);$g.DrawImage($atlas,[System.Drawing.Rectangle]::new(310,20,220,300),[System.Drawing.Rectangle]::new(190,30,55,75),[System.Drawing.GraphicsUnit]::Pixel);$g.Dispose();$detail.Save((Join-Path $out 'face-comparison.png'));$detail.Dispose()
$motionDir=Join-Path $out 'motion-frames';New-Item -ItemType Directory -Force $motionDir|Out-Null
$font=[System.Drawing.Font]::new('Arial',17)
for($i=0;$i -lt 6;$i++){
  $f=$frames[$i];$motion=[System.Drawing.Bitmap]::new(1000,820,[System.Drawing.Imaging.PixelFormat]::Format32bppArgb);$g=[System.Drawing.Graphics]::FromImage($motion);$g.Clear([System.Drawing.Color]::FromArgb(255,16,28,48))
  for($side=0;$side -lt 2;$side++){
    $img=if($side -eq 0){$reference}else{$atlas};$label=if($side -eq 0){'PRODUCTION'}else{'CANDIDATE - attached short sword'};$cx=250+500*$side
    $g.DrawString(($label+' / Frame '+($i+1)),$font,[System.Drawing.Brushes]::Wheat,($side*500+25),25)
    $g.DrawImage($img,[System.Drawing.Rectangle]::new(($cx-192),91,384,320),[System.Drawing.Rectangle]::new($f.x,$f.y,384,320),[System.Drawing.GraphicsUnit]::Pixel)
    $g.DrawString('Waist / original belt alignment',$font,[System.Drawing.Brushes]::Wheat,($side*500+25),430)
    $g.InterpolationMode=[System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
    $g.DrawImage($img,[System.Drawing.Rectangle]::new(($side*500),460,500,340),[System.Drawing.Rectangle]::new(($f.x+95),($f.y+112),125,85),[System.Drawing.GraphicsUnit]::Pixel)
  }
  $g.Dispose();$motion.Save((Join-Path $motionDir ('frame-'+$i+'.png')));$motion.Save((Join-Path $motionDir ('frame-'+$i+'.gif')),[System.Drawing.Imaging.ImageFormat]::Gif);$motion.Dispose()
}
$font.Dispose()
& node (Join-Path $repo 'scripts/assemble_ninja_idle_review.mjs')
if($LASTEXITCODE -ne 0){throw 'Unable to author motion review GIF'}
$files=@($plan.productionAtlas,$plan.productionMetadata,$plan.cleanupSource,$plan.weaponSource,'integration/ninja-idle-attached-sword/cleanup-prompt.txt','integration/ninja-idle-vertical-sword/weapon-prompt.txt','integration/ninja-idle-attached-sword/plan.json','scripts/prepare_ninja_idle_attached_sword.ps1','scripts/assemble_ninja_idle_review.mjs',($plan.reviewDirectory+'/idle-atlas.png'),($plan.reviewDirectory+'/back-sword.png'),($plan.reviewDirectory+'/motion-preview.gif'))
$hashes=foreach($file in $files){@{path=$file;sha256=(Get-FileHash -LiteralPath (Join-Path $repo $file) -Algorithm SHA256).Hash.ToLower()}}
@{status=$plan.status;tool='image_gen.imagegen';method='Fresh imagegen cleanup used only on traced old weapon silhouette; original red cloth preserved. Existing isolated sword shortened and attached by production shoulder tracking, lower section fully occluded. Original body unscaled.';files=$hashes;pixelAudit=$audits;attachments=$attachments;productionChanged=$false;runtimeChanged=$false}|ConvertTo-Json -Depth 12|Set-Content -Encoding UTF8 (Join-Path $out 'provenance.json')
$atlas.Dispose();$reference.Dispose();$cleanAtlas.Dispose();$bodyAtlas.Dispose();$weapon.Dispose();$original.Dispose();$cleanupSource.Dispose();$weaponSource.Dispose();$baseRef.Dispose()
Write-Output (@{audit=$audits;attachments=$attachments}|ConvertTo-Json -Depth 8 -Compress)
