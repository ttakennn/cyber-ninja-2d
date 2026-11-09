$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Drawing
Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @'
using System;
using System.Drawing;
using System.Drawing.Drawing2D;
public class IdleVertical40 {
  public static Rectangle Bounds(Bitmap b){int l=b.Width,t=b.Height,r=-1,d=-1;for(int y=0;y<b.Height;y++)for(int x=0;x<b.Width;x++){if(b.GetPixel(x,y).A<16)continue;l=Math.Min(l,x);t=Math.Min(t,y);r=Math.Max(r,x);d=Math.Max(d,y);}return Rectangle.FromLTRB(l,t,r+1,d+1);}
  public static bool InBand(int x,int y,int[] b){return x>=b[0]&&y>=b[1]&&x<b[0]+b[2]&&y<b[1]+b[3];}
  public static bool InRepair(int x,int y,int[][][] polys){double px=x+.5,py=y+.5;foreach(var p in polys){bool inside=false;for(int i=0,j=p.Length-1;i<p.Length;j=i++){if((p[i][1]>py)!=(p[j][1]>py)&&px<(double)(p[j][0]-p[i][0])*(py-p[i][1])/(p[j][1]-p[i][1])+p[i][0])inside=!inside;}if(inside)return true;}return false;}
  public static Bitmap Body(Bitmap original,Bitmap cleanup,int[][][] polys){var b=(Bitmap)original.Clone();for(int y=0;y<b.Height;y++)for(int x=0;x<b.Width;x++)if(InRepair(x,y,polys))b.SetPixel(x,y,cleanup.GetPixel(x,y));return b;}
  public static int[] Preserve(Bitmap output,Bitmap original,int[][][] polys,int[] band,int[] head){int outside=0,headDiff=0;for(int y=0;y<320;y++)for(int x=0;x<384;x++){if(!InRepair(x,y,polys)&&!InBand(x,y,band))output.SetPixel(x,y,original.GetPixel(x,y));if(output.GetPixel(x,y).ToArgb()!=original.GetPixel(x,y).ToArgb()){if(!InRepair(x,y,polys)&&!InBand(x,y,band))outside++;if(InBand(x,y,head))headDiff++;}}return new int[]{outside,headDiff};}
}
'@
$repo=Split-Path $PSScriptRoot -Parent
$sourceDir=Join-Path $repo 'integration/ninja-idle-vertical-sword'
$plan=Get-Content (Join-Path $sourceDir 'plan.json') -Raw -Encoding UTF8|ConvertFrom-Json
$out=Join-Path $repo $plan.reviewDirectory;New-Item -ItemType Directory -Force $out|Out-Null
$polys=[int[][][]]$plan.hipRepairPolygons;$band=[int[]]$plan.weaponBand;$head=[int[]]$plan.headAuditRect
$meta=Get-Content (Join-Path $repo $plan.productionMetadata) -Raw -Encoding UTF8|ConvertFrom-Json
$original=[System.Drawing.Bitmap]::new((Join-Path $repo $plan.productionAtlas))
$cleanupSource=[System.Drawing.Bitmap]::new((Join-Path $repo $plan.cleanupSource))
$weaponSource=[System.Drawing.Bitmap]::new((Join-Path $repo $plan.weaponSource))
$bounds=[IdleVertical40]::Bounds($weaponSource);$weaponScale=$plan.weaponHeight/$bounds.Height
$weapon=[System.Drawing.Bitmap]::new(384,320,[System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g=[System.Drawing.Graphics]::FromImage($weapon);$g.InterpolationMode=[System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.DrawImage($weaponSource,[System.Drawing.RectangleF]::new(($plan.weaponAxisX-$bounds.Width*$weaponScale/2),$plan.weaponTop,($bounds.Width*$weaponScale),$plan.weaponHeight),$bounds,[System.Drawing.GraphicsUnit]::Pixel);$g.Dispose();$weapon.Save((Join-Path $out 'back-sword.png'))
$atlas=[System.Drawing.Bitmap]::new(1152,640,[System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$reference=[System.Drawing.Bitmap]::new(1152,640,[System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$cleanAtlas=[System.Drawing.Bitmap]::new(1152,640,[System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$bodyAtlas=[System.Drawing.Bitmap]::new(1152,640,[System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$frames=@();$audits=@()
for($i=0;$i -lt 6;$i++){
  $col=$i%3;$row=[int][Math]::Floor($i/3);$f=$meta.clips.idle.frames[$i]
  $ref=$original.Clone([System.Drawing.Rectangle]::new($f.x,$f.y,384,320),[System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $x=[int][Math]::Floor($cleanupSource.Width*$col/3);$y=[int][Math]::Floor($cleanupSource.Height*$row/2)
  $w=[int][Math]::Floor($cleanupSource.Width*($col+1)/3)-$x;$h=[int][Math]::Floor($cleanupSource.Height*($row+1)/2)-$y
  $raw=$cleanupSource.Clone([System.Drawing.Rectangle]::new($x,$y,$w,$h),[System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $clean=[System.Drawing.Bitmap]::new(384,320,[System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $g=[System.Drawing.Graphics]::FromImage($clean);$g.InterpolationMode=[System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.DrawImage($raw,[System.Drawing.RectangleF]::new((192-$plan.cleanupPivotX*$plan.cleanupScale),(289-$plan.cleanupRowGround[$row]*$plan.cleanupScale+$plan.cleanupOffsetY),($w*$plan.cleanupScale),($h*$plan.cleanupScale)));$g.Dispose();$raw.Dispose()
  $body=[IdleVertical40]::Body($ref,$clean,$polys)
  $pose=[System.Drawing.Bitmap]::new(384,320,[System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $g=[System.Drawing.Graphics]::FromImage($pose);$g.DrawImageUnscaled($weapon,0,0);$g.DrawImageUnscaled($body,0,0);$g.Dispose()
  $audit=[IdleVertical40]::Preserve($pose,$ref,$polys,$band,$head)
  $audits+=@{frame=$i;headPixelDifferences=$audit[1];differencesOutsideEditableRegions=$audit[0]}
  foreach($pair in @(@($atlas,$pose),@($reference,$ref),@($cleanAtlas,$clean),@($bodyAtlas,$body))){$g=[System.Drawing.Graphics]::FromImage($pair[0]);$g.DrawImageUnscaled($pair[1],($col*384),($row*320));$g.Dispose()}
  $frames+=@{x=$col*384;y=$row*320;width=384;height=320;pivot=@{x=192;y=289}}
  $pose.Dispose();$body.Dispose();$ref.Dispose();$clean.Dispose()
}
$atlas.Save((Join-Path $out 'idle-atlas.png'));$reference.Save((Join-Path $out 'production-idle-atlas.png'));$cleanAtlas.Save((Join-Path $out 'cleanup-inspection.png'));$bodyAtlas.Save((Join-Path $out 'body-atlas.png'))
$data=@{status=$plan.status;fps=$meta.clips.idle.fps;loop=$true;frames=$frames;pivot=@(192,289);axis=@(@($plan.weaponAxisX,$plan.weaponTop),@($plan.weaponAxisX,($plan.weaponTop+$plan.weaponHeight)));scope=$plan.scope;pixelAudit=$audits}
[System.IO.File]::WriteAllText((Join-Path $out 'review.json'),($data|ConvertTo-Json -Depth 12),[System.Text.UTF8Encoding]::new($false))
[System.IO.File]::WriteAllText((Join-Path $out 'review-data.js'),('window.idleReview='+($data|ConvertTo-Json -Depth 12 -Compress)+';'),[System.Text.UTF8Encoding]::new($false))
foreach($name in @('preview.html','preview.js')){Copy-Item -LiteralPath (Join-Path $sourceDir $name) -Destination (Join-Path $out $name)}
$comparison=[System.Drawing.Bitmap]::new(1000,480,[System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g=[System.Drawing.Graphics]::FromImage($comparison);$g.Clear([System.Drawing.Color]::FromArgb(255,16,28,48));$font=[System.Drawing.Font]::new('Arial',18);$pen=[System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(255,80,105,135))
for($i=0;$i -lt 2;$i++){$cx=250+$i*500;$image=if($i -eq 0){$reference}else{$atlas};$label=if($i -eq 0){'Idle production'}else{'Original body / vertical back sword'};$g.DrawString($label,$font,[System.Drawing.Brushes]::Wheat,($i*500+25),25);foreach($level in @(38,224,264,289)){$gy=380-289+$level;$g.DrawLine($pen,($i*500+30),$gy,($i*500+470),$gy)};$g.DrawImage($image,[System.Drawing.Rectangle]::new(($cx-192),91,384,320),[System.Drawing.Rectangle]::new(0,0,384,320),[System.Drawing.GraphicsUnit]::Pixel)}
$g.Dispose();$font.Dispose();$pen.Dispose();$comparison.Save((Join-Path $out 'comparison.png'));$comparison.Dispose()
$detail=[System.Drawing.Bitmap]::new(560,340,[System.Drawing.Imaging.PixelFormat]::Format32bppArgb);$g=[System.Drawing.Graphics]::FromImage($detail);$g.Clear([System.Drawing.Color]::FromArgb(255,20,35,55));$g.InterpolationMode=[System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
$g.DrawImage($reference,[System.Drawing.Rectangle]::new(30,20,220,300),[System.Drawing.Rectangle]::new(190,30,55,75),[System.Drawing.GraphicsUnit]::Pixel);$g.DrawImage($atlas,[System.Drawing.Rectangle]::new(310,20,220,300),[System.Drawing.Rectangle]::new(190,30,55,75),[System.Drawing.GraphicsUnit]::Pixel);$g.Dispose();$detail.Save((Join-Path $out 'face-comparison.png'));$detail.Dispose()
$files=@($plan.productionAtlas,$plan.productionMetadata,$plan.cleanupSource,$plan.weaponSource,'integration/ninja-idle-vertical-sword/cleanup-prompt.txt','integration/ninja-idle-vertical-sword/weapon-prompt.txt','integration/ninja-idle-vertical-sword/plan.json','scripts/prepare_ninja_idle_vertical_sword.ps1',($plan.reviewDirectory+'/idle-atlas.png'),($plan.reviewDirectory+'/back-sword.png'))
$hashes=foreach($file in $files){@{path=$file;sha256=(Get-FileHash -LiteralPath (Join-Path $repo $file) -Algorithm SHA256).Hash.ToLower()}}
@{status=$plan.status;tool='image_gen.imagegen';method='Imagegen supplies hip cleanup and isolated vertical sword artwork. Deterministic original-pixel preservation during packaging; original body is not resized. Sword is a single rigid layer behind original body.';files=$hashes;pixelAudit=$audits;productionChanged=$false;runtimeChanged=$false}|ConvertTo-Json -Depth 12|Set-Content -Encoding UTF8 (Join-Path $out 'provenance.json')
$atlas.Dispose();$reference.Dispose();$cleanAtlas.Dispose();$bodyAtlas.Dispose();$weapon.Dispose();$original.Dispose();$cleanupSource.Dispose();$weaponSource.Dispose()
Write-Output ($audits|ConvertTo-Json -Compress)
