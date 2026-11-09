param([string]$PlanPath = 'integration/ninja-spin-combo/plan.json')
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @'
using System;using System.Drawing;using System.Drawing.Imaging;using System.Runtime.InteropServices;
public static class SpinFrameCopy {
  public static void Copy(Bitmap src,Bitmap dst,int sx,int sy,int dx,int dy,int size){
    var a=src.LockBits(new Rectangle(sx,sy,size,size),ImageLockMode.ReadOnly,PixelFormat.Format32bppArgb);
    var b=dst.LockBits(new Rectangle(dx,dy,size,size),ImageLockMode.WriteOnly,PixelFormat.Format32bppArgb);
    try{var row=new byte[size*4];for(int y=0;y<size;y++){Marshal.Copy(IntPtr.Add(a.Scan0,y*a.Stride),row,0,row.Length);Marshal.Copy(row,0,IntPtr.Add(b.Scan0,y*b.Stride),row.Length);}}
    finally{src.UnlockBits(a);dst.UnlockBits(b);}
  }
}
'@
$repo = Split-Path $PSScriptRoot -Parent
$plan = Get-Content (Join-Path $repo $PlanPath) -Raw -Encoding UTF8 | ConvertFrom-Json
$out = Join-Path $repo $plan.reviewDirectory
$base = Join-Path $repo $plan.baseReview
New-Item -ItemType Directory -Force $out | Out-Null
$metadata = Get-Content (Join-Path $base 'review.json') -Raw -Encoding UTF8 | ConvertFrom-Json
$old = [System.Drawing.Bitmap]::new((Join-Path $base 'body-atlas.png'))
$source = [System.Drawing.Bitmap]::new((Join-Path $repo $plan.bodySource))
$body = [System.Drawing.Bitmap]::new(2048,3072,[System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
for($i=0;$i -lt 6;$i++){[SpinFrameCopy]::Copy($old,$body,($i%4*512),([int][Math]::Floor($i/4)*512),($i%4*512),([int][Math]::Floor($i/4)*512),512)}
$hands = [System.Collections.Generic.List[object]]::new(); $tips = [System.Collections.Generic.List[object]]::new(); $fxByPose = [System.Collections.Generic.List[object]]::new()
for($i=0;$i -lt 6;$i++){$hands.Add($metadata.hands[$i]);$tips.Add($metadata.tips[$i]);$fxByPose.Add($metadata.fxByPose[$i])}
$g = [System.Drawing.Graphics]::FromImage($body)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
for($i=0;$i -lt 16;$i++){
  $col=$i%4;$row=[int][Math]::Floor($i/4);$slot=$i+6
  $x=[int][Math]::Floor($source.Width*$col/4);$y=[int][Math]::Floor($source.Height*$row/4)
  $w=[int][Math]::Floor($source.Width*($col+1)/4)-$x;$h=[int][Math]::Floor($source.Height*($row+1)/4)-$y
  $pose=$source.Clone([System.Drawing.Rectangle]::new($x,$y,$w,$h),[System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $dx=$slot%4*512;$dy=[int][Math]::Floor($slot/4)*512;$scale=$plan.bodySourceScale
  $g.SetClip([System.Drawing.Rectangle]::new($dx,$dy,512,512))
  $g.DrawImage($pose,[System.Drawing.RectangleF]::new(($dx+192-$plan.sourcePivotX*$scale),($dy+353-$plan.sourceGround[$i]*$scale),($w*$scale),($h*$scale)))
  $pose.Dispose()
  $hands.Add(@((192+($plan.sourceHands[$i][0]-$plan.sourcePivotX)*$scale),(353+($plan.sourceHands[$i][1]-$plan.sourceGround[$i])*$scale)))
  $tips.Add(@((192+($plan.sourceTips[$i][0]-$plan.sourcePivotX)*$scale),(353+($plan.sourceTips[$i][1]-$plan.sourceGround[$i])*$scale)))
  $fxByPose.Add($plan.fxByNewPose[$i])
}
$g.Dispose();$body.Save((Join-Path $out 'body-atlas.png'));$source.Dispose();$old.Dispose()
$ringSource=[System.Drawing.Bitmap]::new((Join-Path $repo $plan.ringSource))
$ring=[System.Drawing.Bitmap]::new(2048,1024,[System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g=[System.Drawing.Graphics]::FromImage($ring);$g.InterpolationMode=[System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
for($i=0;$i -lt 8;$i++){
  $col=$i%4;$row=[int][Math]::Floor($i/4);$x=[int][Math]::Floor($ringSource.Width*$col/4);$y=[int][Math]::Floor($ringSource.Height*$row/2)
  $w=[int][Math]::Floor($ringSource.Width*($col+1)/4)-$x;$h=[int][Math]::Floor($ringSource.Height*($row+1)/2)-$y
  $pose=$ringSource.Clone([System.Drawing.Rectangle]::new($x,$y,$w,$h),[System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $g.SetClip([System.Drawing.Rectangle]::new($col*512,$row*512,512,512));$g.DrawImage($pose,[System.Drawing.Rectangle]::new($col*512,$row*512,512,512));$pose.Dispose()
}
$g.Dispose();$ring.Save((Join-Path $out 'combo-ring-atlas.png'));$ringSource.Dispose()
$metadata.reviewDirectory=$plan.reviewDirectory;$metadata.bodySource=$plan.bodySource;$metadata.bodyGrid=@(4,6)
$metadata.hands=$hands.ToArray();$metadata.tips=$tips.ToArray();$metadata.fxByPose=$fxByPose.ToArray()
$metadata.labels=@($metadata.labels[0..5])+@($plan.labels);$metadata.clips=$plan.clips
$metadata.normalization=$plan.notes
foreach($key in @('sourceHands','sourceTips','bodySourceGround','bodySourceReferenceHeight','bodySourcePivotX','bodyScale')){$metadata.PSObject.Properties.Remove($key)}
$metadata | Add-Member -NotePropertyName ring -NotePropertyValue $plan.ring
$metadata | Add-Member -NotePropertyName spinBodyScale -NotePropertyValue $plan.bodySourceScale
$metadata | Add-Member -NotePropertyName spinSourceGround -NotePropertyValue $plan.sourceGround
$metadata | Add-Member -NotePropertyName spinSourcePivotX -NotePropertyValue $plan.sourcePivotX
$metadata | Add-Member -NotePropertyName ringSource -NotePropertyValue $plan.ringSource
$metadata | Add-Member -NotePropertyName preservedBodySlots -NotePropertyValue @(0,1,2,3,4,5)
$metadata | Add-Member -NotePropertyName baseReview -NotePropertyValue $plan.baseReview
[System.IO.File]::WriteAllText((Join-Path $out 'review.json'),($metadata|ConvertTo-Json -Depth 18),[System.Text.UTF8Encoding]::new($false))
[System.IO.File]::WriteAllText((Join-Path $out 'review-data.js'),('window.groundReview='+($metadata|ConvertTo-Json -Depth 18 -Compress)+';'),[System.Text.UTF8Encoding]::new($false))
foreach($name in @('fire-slash-atlas.png','idle-reference.png')){Copy-Item -LiteralPath (Join-Path $base $name) -Destination (Join-Path $out $name)}
New-Item -ItemType Directory -Force (Join-Path $out 'reference') | Out-Null
Get-ChildItem (Join-Path $base 'reference') -File | ForEach-Object {Copy-Item -LiteralPath $_.FullName -Destination (Join-Path (Join-Path $out 'reference') $_.Name)}
foreach($name in @('preview.html','preview.js')){Copy-Item -LiteralPath (Join-Path $repo "integration/ninja-spin-combo/$name") -Destination (Join-Path $out $name)}
$board=[System.Drawing.Bitmap]::new(1600,1200,[System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g=[System.Drawing.Graphics]::FromImage($board);$g.Clear([System.Drawing.Color]::FromArgb(255,16,28,48));$g.InterpolationMode=[System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$font=[System.Drawing.Font]::new('Arial',20);$pen=[System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(255,70,90,120))
for($i=0;$i -lt 4;$i++){
  $poseIndex=@(3,8,9,19)[$i];$ox=$i%2*800;$oy=[int][Math]::Floor($i/2)*600;$rootX=$ox+400;$ground=$oy+450
  $g.SetClip([System.Drawing.Rectangle]::new($ox,$oy,800,600));$g.DrawLine($pen,$ox+20,$ground,$ox+780,$ground)
  $g.DrawString($metadata.labels[$poseIndex],$font,[System.Drawing.Brushes]::Wheat,($ox+25),($oy+25))
  if($i -gt 0){$attributes=[System.Drawing.Imaging.ImageAttributes]::new();$matrix=[System.Drawing.Imaging.ColorMatrix]::new();$matrix.Matrix33=$plan.ring.opacity;$attributes.SetColorMatrix($matrix)
    $size=[int](512*$plan.ring.scale);$dest=[System.Drawing.Rectangle]::new(($rootX-$size/2),($ground-$plan.ring.centerAboveGround-$size/2),$size,$size)
    $g.DrawImage($ring,$dest,1536,0,512,512,[System.Drawing.GraphicsUnit]::Pixel,$attributes);$attributes.Dispose()}
  $g.DrawImage($body,[System.Drawing.Rectangle]::new(($rootX-192),($ground-353),512,512),[System.Drawing.Rectangle]::new(($poseIndex%4*512),([int][Math]::Floor($poseIndex/4)*512),512,512),[System.Drawing.GraphicsUnit]::Pixel)
}
$g.Dispose();$font.Dispose();$pen.Dispose();$body.Dispose();$ring.Dispose();$board.Save((Join-Path $out 'spin-review.png'));$board.Dispose()
$files=@($PlanPath,$plan.bodySource,$plan.ringSource,'integration/ninja-spin-combo/body-prompt.txt','integration/ninja-spin-combo/ring-prompt.txt','integration/ninja-spin-combo/preview.js',"$($plan.reviewDirectory)/body-atlas.png","$($plan.reviewDirectory)/combo-ring-atlas.png","$($plan.reviewDirectory)/fire-slash-atlas.png","$($plan.reviewDirectory)/spin-review.png")
$hashes=foreach($file in $files){@{path=$file;sha256=(Get-FileHash -LiteralPath (Join-Path $repo $file) -Algorithm SHA256).Hash.ToLower()}}
@{status=$plan.status;tool='image_gen.imagegen';referenceTransport='Body: five recent images including user spin references, old body/Idle. Ring: last five images including new body.';baseReview=$plan.baseReview;preservedSlots=@(0,1,2,3,4,5);copyMethod='ARGB row copy without resampling for preserved slots';files=$hashes;runtimeChanged=$false}|ConvertTo-Json -Depth 8|Set-Content -Encoding UTF8 (Join-Path $out 'provenance.json')
Write-Output 'Authored spin body, separate combo ring and review snapshot; gameplay unchanged.'
