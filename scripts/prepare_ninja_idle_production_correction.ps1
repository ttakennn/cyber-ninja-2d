$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Drawing
$repo=Split-Path $PSScriptRoot -Parent
$sourceDir=Join-Path $repo 'integration/ninja-idle-production-correction'
$plan=Get-Content (Join-Path $sourceDir 'plan.json') -Raw -Encoding UTF8 | ConvertFrom-Json
$out=Join-Path $repo $plan.reviewDirectory
New-Item -ItemType Directory -Force $out | Out-Null
$src=[System.Drawing.Bitmap]::new((Join-Path $repo $plan.source))
$atlas=[System.Drawing.Bitmap]::new(1152,640,[System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g=[System.Drawing.Graphics]::FromImage($atlas);$g.InterpolationMode=[System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$scale=$plan.targetReferenceHeight/$plan.sourceReferenceHeight
for($i=0;$i -lt 6;$i++){
  $c=$i%3;$r=[int][Math]::Floor($i/3)
  $x=[int][Math]::Floor($src.Width*$c/3);$y=[int][Math]::Floor($src.Height*$r/2)
  $w=[int][Math]::Floor($src.Width*($c+1)/3)-$x;$h=[int][Math]::Floor($src.Height*($r+1)/2)-$y
  $pose=$src.Clone([System.Drawing.Rectangle]::new($x,$y,$w,$h),[System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $g.SetClip([System.Drawing.Rectangle]::new($c*384,$r*320,384,320))
  $g.DrawImage($pose,[System.Drawing.RectangleF]::new(($c*384+192-$plan.sourcePivotX*$scale),($r*320+289-$plan.sourceRowGround[$r]*$scale),($w*$scale),($h*$scale)))
  $pose.Dispose()
}
$g.Dispose();$atlas.Save((Join-Path $out 'idle-atlas.png'));$atlas.Dispose();$src.Dispose()
$oldMeta=Get-Content (Join-Path $repo $plan.productionMetadata) -Raw -Encoding UTF8 | ConvertFrom-Json
$old=[System.Drawing.Bitmap]::new((Join-Path $repo $plan.productionReference))
$ref=[System.Drawing.Bitmap]::new(1152,640,[System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g=[System.Drawing.Graphics]::FromImage($ref)
$frames=@()
for($i=0;$i -lt $oldMeta.clips.idle.frames.Count;$i++){
  $f=$oldMeta.clips.idle.frames[$i];$pose=$old.Clone([System.Drawing.Rectangle]::new($f.x,$f.y,384,320),[System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $g.DrawImageUnscaled($pose,($i%3)*384,([int][Math]::Floor($i/3))*320);$pose.Dispose()
  $frames+=@{x=($i%3)*384;y=([int][Math]::Floor($i/3))*320;width=384;height=320;pivot=@{x=192;y=289}}
}
$g.Dispose();$ref.Save((Join-Path $out 'production-idle-atlas.png'));$old.Dispose()
$axis=@();foreach($pt in $plan.swordAxisSource){$axis+=,@((192+($pt[0]-$plan.sourcePivotX)*$scale),(289+($pt[1]-$plan.sourceRowGround[0])*$scale))}
$data=@{status=$plan.status;fps=$plan.fps;loop=$plan.loop;frames=$frames;pivot=$plan.pivot;scale=$scale;axis=$axis;scope=$plan.scope;normalization=$plan.normalization}
[System.IO.File]::WriteAllText((Join-Path $out 'review.json'),($data|ConvertTo-Json -Depth 12),[System.Text.UTF8Encoding]::new($false))
[System.IO.File]::WriteAllText((Join-Path $out 'review-data.js'),('window.idleReview='+($data|ConvertTo-Json -Depth 12 -Compress)+';'),[System.Text.UTF8Encoding]::new($false))
foreach($name in @('preview.html','preview.js')){Copy-Item -LiteralPath (Join-Path $sourceDir $name) -Destination (Join-Path $out $name)}
$candidate=[System.Drawing.Bitmap]::new((Join-Path $out 'idle-atlas.png'))
$comparison=[System.Drawing.Bitmap]::new(1000,480,[System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g=[System.Drawing.Graphics]::FromImage($comparison);$g.Clear([System.Drawing.Color]::FromArgb(255,16,28,48))
$font=[System.Drawing.Font]::new('Arial',18);$pen=[System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(255,80,105,135))
for($i=0;$i -lt 2;$i++){
  $cx=250+$i*500;$floor=380;$image=if($i -eq 0){$ref}else{$candidate};$label=if($i -eq 0){'Idle production'}else{'Idle candidate - same scale'}
  $g.DrawString($label,$font,[System.Drawing.Brushes]::Wheat,($i*500+35),25)
  foreach($level in @(38,224,264,289)){$gy=$floor-289+$level;$g.DrawLine($pen,($i*500+30),$gy,($i*500+470),$gy)}
  $g.DrawImage($image,[System.Drawing.Rectangle]::new(($cx-192),($floor-289),384,320),[System.Drawing.Rectangle]::new(0,0,384,320),[System.Drawing.GraphicsUnit]::Pixel)
}
$g.Dispose();$font.Dispose();$pen.Dispose();$comparison.Save((Join-Path $out 'comparison.png'));$comparison.Dispose();$ref.Dispose();$candidate.Dispose()
$files=@($plan.source,$plan.productionReference,$plan.productionMetadata,'integration/ninja-idle-production-correction/prompt.txt','integration/ninja-idle-production-correction/plan.json','integration/ninja-idle-production-correction/preview.js','scripts/prepare_ninja_idle_production_correction.ps1',($plan.reviewDirectory+'/idle-atlas.png'),($plan.reviewDirectory+'/production-idle-atlas.png'))
$hashes=foreach($file in $files){@{path=$file;sha256=(Get-FileHash -LiteralPath (Join-Path $repo $file) -Algorithm SHA256).Hash.ToLower()}}
@{status=$plan.status;tool='image_gen.imagegen';reference='Sole imagegen reference: six Idle frames cropped directly from current production atlas using production animations.json. No rejected candidates used as imagegen reference.';files=$hashes;productionChanged=$false;runtimeChanged=$false}|ConvertTo-Json -Depth 8|Set-Content -Encoding UTF8 (Join-Path $out 'provenance.json')
Write-Output 'Authored only Idle candidate and direct production comparison; production/runtime unchanged.'
