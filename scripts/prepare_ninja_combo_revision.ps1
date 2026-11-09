param([string]$PlanPath = 'integration/ninja-combo-revision/combo-plan.json')
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @'
using System.Drawing;
using System.Collections.Generic;
public static class ComboCutout {
  public static void Clean(Bitmap b) {
    int w=b.Width,h=b.Height;var seen=new bool[w*h];var largest=new List<int>();
    for(int y=0;y<h;y++)for(int x=0;x<w;x++) {
      int start=y*w+x;if(seen[start]||b.GetPixel(x,y).A==0)continue;
      var component=new List<int>();var q=new Queue<int>();q.Enqueue(start);seen[start]=true;
      while(q.Count>0){int p=q.Dequeue();component.Add(p);int px=p%w,py=p/w;
        for(int dy=-1;dy<=1;dy++)for(int dx=-1;dx<=1;dx++){int nx=px+dx,ny=py+dy;if(nx<0||ny<0||nx>=w||ny>=h)continue;int n=ny*w+nx;if(!seen[n]&&b.GetPixel(nx,ny).A>0){seen[n]=true;q.Enqueue(n);}}
      }
      if(component.Count>largest.Count)largest=component;
    }
    var keep=new bool[w*h];foreach(int p in largest)keep[p]=true;
    for(int y=0;y<h;y++)for(int x=0;x<w;x++)if(!keep[y*w+x])b.SetPixel(x,y,Color.Transparent);
  }
}
'@
$repo=Split-Path $PSScriptRoot -Parent
$plan=Get-Content (Join-Path $repo $PlanPath) -Raw -Encoding UTF8 | ConvertFrom-Json
$out=Join-Path $repo $plan.reviewDirectory
New-Item -ItemType Directory -Force $out | Out-Null
$source=[System.Drawing.Bitmap]::new((Join-Path $repo $plan.source))
$cw=$source.Width/$plan.columns; $ch=$source.Height/$plan.rows
$top=$ch; $bottom=-1
for($y=0;$y -lt $ch;$y++){for($x=0;$x -lt $cw;$x++){if($source.GetPixel($x,$y).A -ge 16){$top=[Math]::Min($top,$y);$bottom=[Math]::Max($bottom,$y)}}}
if($bottom -lt 0){throw 'Empty reference guard'}
$scale=$plan.guardReferenceHeight/($bottom-$top+1)
if($plan.sourceBodyReference){$scale=$plan.guardReferenceHeight/($plan.sourceBodyReference[1]-$plan.sourceBodyReference[0]+1)}
$sourcePivotX=if($plan.sourcePivotXFraction){$cw*$plan.sourcePivotXFraction}else{$cw/2}
$atlas=[System.Drawing.Bitmap]::new(2048,2048,[System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
for($i=0;$i -lt 16;$i++){
  $pose=$source.Clone([System.Drawing.Rectangle]::new(($i%4)*$cw,[Math]::Floor($i/4)*$ch,$cw,$ch),[System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  # Extraction cleanup: discard disconnected stray pixels from adjacent cells, keep the body/blade/trail component.
  if(!$plan.preserveEffects){[ComboCutout]::Clean($pose)}
  $g=[System.Drawing.Graphics]::FromImage($atlas)
  $g.SetClip([System.Drawing.Rectangle]::new(($i%4)*512,[Math]::Floor($i/4)*512,512,512))
  $g.InterpolationMode=[System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $sourceGround=if($plan.sourceRowGround){$plan.sourceRowGround[[Math]::Floor($i/4)]}else{$bottom+1}
  $g.DrawImage($pose,[System.Drawing.RectangleF]::new((($i%4)*512+192-$sourcePivotX*$scale),([Math]::Floor($i/4)*512+353-$sourceGround*$scale),($cw*$scale),($ch*$scale)))
  $g.Dispose();$pose.Dispose()
}
$atlas.Save((Join-Path $out 'combo-atlas.png'));$atlas.Dispose();$source.Dispose()
$plan | Add-Member -NotePropertyName normalization -NotePropertyValue @{scale=$scale;sourcePivotX=$sourcePivotX;referenceAlphaBaseline=($bottom+1);rowGround=$plan.sourceRowGround;perFrameFit=$false}
$plan | ConvertTo-Json -Depth 10 | Set-Content -Encoding UTF8 (Join-Path $out 'combo.json')
[System.IO.File]::WriteAllText((Join-Path $out 'combo-data.js'),('window.comboReview='+($plan | ConvertTo-Json -Depth 10 -Compress)+';'),[System.Text.UTF8Encoding]::new($false))
$previewSource=if($plan.previewSource){$plan.previewSource}else{'integration/ninja-combo-revision/preview.html'}
Copy-Item -LiteralPath (Join-Path $repo $previewSource) -Destination (Join-Path $out 'preview.html')
Copy-Item -LiteralPath (Join-Path $repo 'integration/ninja-run-hurt-revision/idle-reference.png') -Destination (Join-Path $out 'idle-reference.png')
Write-Output 'Wrote candidate combo atlas and preview timing; production/runtime unchanged.'
