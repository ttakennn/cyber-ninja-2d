$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Drawing
Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @'
using System;
using System.Drawing;
public class IdleSash47 {
  public static bool[,] Mask;
  public static int[] Bounds(Bitmap b,int dx,int dy){int top=128+dy,bottom=139+dy;for(int y=top-2;y<=top+2;y++){var c=b.GetPixel(210+dx,y);if(c.R>90&&c.R>3*c.G){top=y;break;}}for(int y=top+6;y<=top+16;y++)if(b.GetPixel(210+dx,y).R<65){bottom=y;break;}int mid=(top+bottom)/2,left=174+dx,right=224+dx;for(int x=205+dx;x>=160+dx;x--)if(b.GetPixel(x,mid).A<80){left=x+1;break;}for(int x=210+dx;x<=233+dx;x++)if(Skin(b.GetPixel(x,mid))){right=x-1;break;}return new int[]{left,right,top,bottom};}
  public static bool Skin(Color c){return c.A>100&&c.R>65&&c.G>c.R*.34&&c.G<c.R*.84&&c.B<c.R*.7;}
  public static int[] Match(Bitmap a,Bitmap b,int left,int top){long best=long.MaxValue;int bx=0,by=0;for(int dy=-3;dy<=3;dy++)for(int dx=-3;dx<=3;dx++){long cost=0;for(int y=top-12;y<top-3;y++)for(int x=left+7;x<left+35;x++){var p=a.GetPixel(x,y);var q=b.GetPixel(x+dx,y+dy);cost+=Math.Abs(p.R-q.R)+Math.Abs(p.G-q.G)+Math.Abs(p.B-q.B);}cost+=Math.Abs(dx)+Math.Abs(dy);if(cost<best){best=cost;bx=dx;by=dy;}}return new int[]{bx,by};}
  public static Bitmap Repair(Bitmap original,Bitmap guide,int[] bounds,int[] align,out int changed,out int outside){var b=(Bitmap)original.Clone();Mask=new bool[384,320];changed=0;outside=0;int left=bounds[0],right=bounds[1],top=bounds[2],bottom=bounds[3];for(int y=top-2;y<=bottom+2;y++)for(int x=left-1;x<=right;x++){var p=original.GetPixel(x,y);if(p.A<40||Skin(p))continue;int sx=x+align[0],sy=y+align[1];var q=guide.GetPixel(sx,sy);if(q.A<100){int step=x<(left+right)/2?1:-1;for(int k=1;k<=4;k++){var n=guide.GetPixel(sx+step*k,sy);if(n.A>=100){q=n;break;}}}if(q.A<100)continue;Mask[x,y]=true;b.SetPixel(x,y,Color.FromArgb(p.A,q.R,q.G,q.B));}for(int y=0;y<320;y++)for(int x=0;x<384;x++)if(b.GetPixel(x,y).ToArgb()!=original.GetPixel(x,y).ToArgb()){changed++;if(!Mask[x,y])outside++;}return b;}
  public static void Paste(Bitmap dst,Bitmap src,int dx,int dy){for(int y=0;y<src.Height;y++)for(int x=0;x<src.Width;x++)dst.SetPixel(x+dx,y+dy,src.GetPixel(x,y));}
  public static void PasteMask(Bitmap dst,int dx,int dy){for(int y=0;y<320;y++)for(int x=0;x<384;x++)if(Mask[x,y])dst.SetPixel(x+dx,y+dy,Color.FromArgb(170,20,225,210));}
}
'@
$repo=Split-Path $PSScriptRoot -Parent
$source=Join-Path $repo 'integration/ninja-idle-sash-alignment'
$plan=Get-Content -LiteralPath (Join-Path $source 'plan.json') -Raw -Encoding UTF8|ConvertFrom-Json
$out=Join-Path $repo $plan.reviewDirectory;New-Item -ItemType Directory -Force $out|Out-Null
$meta=Get-Content -LiteralPath (Join-Path $repo $plan.productionMetadata) -Raw -Encoding UTF8|ConvertFrom-Json
$sourceAtlas=[System.Drawing.Bitmap]::new((Join-Path $repo $plan.productionAtlas))
$guides=[System.Drawing.Bitmap]::new((Join-Path $repo $plan.guide))
$before=[System.Drawing.Bitmap]::new(1152,640,[System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$after=[System.Drawing.Bitmap]::new(1152,640,[System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$mask=[System.Drawing.Bitmap]::new(1152,640,[System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$frames=@();$audit=@();$registration=@()
for($i=0;$i -lt 6;$i++){
  $f=$meta.clips.idle.frames[$i];$col=$i%3;$row=[int][Math]::Floor($i/3)
  $pose=$sourceAtlas.Clone([System.Drawing.Rectangle]::new($f.x,$f.y,384,320),[System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $gx=[int][Math]::Floor($guides.Width*$col/3);$gy=[int][Math]::Floor($guides.Height*$row/2)
  $gw=[int][Math]::Floor($guides.Width*($col+1)/3)-$gx;$gh=[int][Math]::Floor($guides.Height*($row+1)/2)-$gy
  $guide=[System.Drawing.Bitmap]::new(384,320,[System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $g=[System.Drawing.Graphics]::FromImage($guide);$g.InterpolationMode=[System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.DrawImage($guides,[System.Drawing.Rectangle]::new(160,95,88,88),[System.Drawing.Rectangle]::new($gx,$gy,$gw,$gh),[System.Drawing.GraphicsUnit]::Pixel);$g.Dispose()
  $hip=[int[]]$plan.hipOffsets[$i]
  $bounds=[IdleSash47]::Bounds($pose,$hip[0],$hip[1]);$alignment=[IdleSash47]::Match($pose,$guide,$bounds[0],$bounds[2])
  $changed=0;$outside=0;$result=[IdleSash47]::Repair($pose,$guide,$bounds,$alignment,[ref]$changed,[ref]$outside)
  [IdleSash47]::Paste($before,$pose,($col*384),($row*320));[IdleSash47]::Paste($after,$result,($col*384),($row*320));[IdleSash47]::PasteMask($mask,($col*384),($row*320))
  $frames+=@{x=$col*384;y=$row*320;width=384;height=320;pivot=@{x=192;y=289}}
  $audit+=@{frame=$i;changedSashPixels=$changed;outsideSashRgbaDifferences=$outside}
  $registration+=@{frame=$i;waistBounds=$bounds;guideAlignment=$alignment;hipOffset=$hip}
  $pose.Dispose();$guide.Dispose();$result.Dispose()
}
$before.Save((Join-Path $out 'before-atlas.png'));$after.Save((Join-Path $out 'idle-atlas.png'));$mask.Save((Join-Path $out 'sash-edit-mask.png'))
$data=@{status=$plan.status;fps=$meta.clips.idle.fps;loop=$true;frames=$frames;registration=$registration;pixelAudit=$audit;scope=$plan.scope}
[System.IO.File]::WriteAllText((Join-Path $out 'review.json'),($data|ConvertTo-Json -Depth 10),[System.Text.UTF8Encoding]::new($false))
[System.IO.File]::WriteAllText((Join-Path $out 'review-data.js'),('window.sashReview='+($data|ConvertTo-Json -Depth 10 -Compress)+';'),[System.Text.UTF8Encoding]::new($false))
foreach($name in @('preview.html','preview.js')){Copy-Item -LiteralPath (Join-Path $source $name) -Destination (Join-Path $out $name)}
$font=[System.Drawing.Font]::new('Arial',15)
$detail=[System.Drawing.Bitmap]::new(984,1944);$g=[System.Drawing.Graphics]::FromImage($detail);$g.Clear([System.Drawing.Color]::FromArgb(20,35,55));$g.InterpolationMode=[System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
for($i=0;$i -lt 6;$i++){$f=$frames[$i];for($s=0;$s -lt 2;$s++){$img=@($before,$after)[$s];$label=@('BEFORE 10.46','AFTER 10.47')[$s];$g.DrawString(($label+' / F'+($i+1)),$font,[System.Drawing.Brushes]::Wheat,($s*492+8),($i*324+1));$g.DrawImage($img,[System.Drawing.Rectangle]::new(($s*492),($i*324+30),492,288),[System.Drawing.Rectangle]::new(($f.x+160),($f.y+110),82,48),[System.Drawing.GraphicsUnit]::Pixel)}}
$g.Dispose();$detail.Save((Join-Path $out 'sash-review.png'));$detail.Dispose()
$motionDir=Join-Path $out 'motion-frames';New-Item -ItemType Directory -Force $motionDir|Out-Null
for($i=0;$i -lt 6;$i++){$f=$frames[$i];$motion=[System.Drawing.Bitmap]::new(1024,720);$g=[System.Drawing.Graphics]::FromImage($motion);$g.Clear([System.Drawing.Color]::FromArgb(20,35,55));$g.InterpolationMode=[System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
  for($s=0;$s -lt 2;$s++){$img=@($before,$after)[$s];$label=@('BEFORE 10.46','AFTER 10.47')[$s];$g.DrawString(($label+' / F'+($i+1)),$font,[System.Drawing.Brushes]::Wheat,($s*512+12),12);$g.DrawImage($img,[System.Drawing.Rectangle]::new(($s*512+64),60,384,320),[System.Drawing.Rectangle]::new($f.x,$f.y,384,320),[System.Drawing.GraphicsUnit]::Pixel);$g.DrawImage($img,[System.Drawing.Rectangle]::new(($s*512+50),430,410,240),[System.Drawing.Rectangle]::new(($f.x+160),($f.y+110),82,48),[System.Drawing.GraphicsUnit]::Pixel)}
  $g.Dispose();$motion.Save((Join-Path $motionDir ('frame-'+$i+'.png')));$motion.Save((Join-Path $motionDir ('frame-'+$i+'.gif')),[System.Drawing.Imaging.ImageFormat]::Gif);$motion.Dispose()}
& node (Join-Path $repo 'scripts/assemble_ninja_idle_sash_review.mjs');if($LASTEXITCODE -ne 0){throw 'Cannot package GIF'}
$names=@($plan.productionAtlas,$plan.productionMetadata,$plan.guide,'integration/ninja-idle-sash-alignment/plan.json','integration/ninja-idle-sash-alignment/prompt.txt','scripts/prepare_ninja_idle_sash_alignment.ps1',($plan.reviewDirectory+'/idle-atlas.png'))
$hashes=foreach($name in $names){@{path=$name;sha256=(Get-FileHash -LiteralPath (Join-Path $repo $name) -Algorithm SHA256).Hash.ToLower()}}
@{phase='AUTHORING_ONLY';status=$plan.status;files=$hashes;pixelAudit=$audit;registration=$registration;authoringWritesProduction=$false;runtimeChanged=$false;releaseEvidence='release-evidence.json'}|ConvertTo-Json -Depth 10|Set-Content -LiteralPath (Join-Path $out 'provenance.json') -Encoding UTF8
$sourceAtlas.Dispose();$guides.Dispose();$before.Dispose();$after.Dispose();$mask.Dispose();$font.Dispose()
Write-Output (@{audit=$audit;registration=$registration}|ConvertTo-Json -Depth 10 -Compress)
