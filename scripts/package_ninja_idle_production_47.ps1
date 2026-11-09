$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Drawing
Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @'
using System;
using System.Drawing;
public class IdleRelease48 {
  public static void Replace(Bitmap atlas,Bitmap idle,int index,int x,int y){int sx=(index%3)*384,sy=(index/3)*320;for(int py=0;py<320;py++)for(int px=0;px<384;px++)atlas.SetPixel(x+px,y+py,idle.GetPixel(sx+px,sy+py));}
  public static int WaistAudit(Bitmap baseline,Bitmap packed,Bitmap mask,int[][] rects){int n=0;for(int i=0;i<rects.Length;i++)for(int y=0;y<320;y++)for(int x=0;x<384;x++)if(mask.GetPixel((i%3)*384+x,(i/3)*320+y).A==0&&baseline.GetPixel(rects[i][0]+x,rects[i][1]+y).ToArgb()!=packed.GetPixel(rects[i][0]+x,rects[i][1]+y).ToArgb())n++;return n;}
  public static int[] Audit(Bitmap baseline,Bitmap packed,Bitmap idle,int[][] rects){int outside=0,inside=0;for(int y=0;y<baseline.Height;y++)for(int x=0;x<baseline.Width;x++){int frame=-1;for(int i=0;i<rects.Length;i++)if(x>=rects[i][0]&&x<rects[i][0]+384&&y>=rects[i][1]&&y<rects[i][1]+320){frame=i;break;}var p=packed.GetPixel(x,y);if(frame<0){if(p.ToArgb()!=baseline.GetPixel(x,y).ToArgb())outside++;}else{int sx=(frame%3)*384+x-rects[frame][0],sy=(frame/3)*320+y-rects[frame][1];if(p.ToArgb()!=idle.GetPixel(sx,sy).ToArgb())inside++;}}return new int[]{outside,inside};}
}
'@
$repo=Split-Path $PSScriptRoot -Parent
$plan=Get-Content -LiteralPath (Join-Path $repo 'integration/ninja-idle-production-47/release-plan.json') -Raw -Encoding UTF8|ConvertFrom-Json
if($plan.status -ne 'USER_APPROVED_PRODUCTION_ART'){throw 'Art self-review must finish before packaging release.'}
$out=Join-Path $repo $plan.reviewDirectory
New-Item -ItemType Directory -Force $out|Out-Null
$metadata=Get-Content -LiteralPath (Join-Path $repo $plan.baselineMetadata) -Raw -Encoding UTF8|ConvertFrom-Json
$baseline=[System.Drawing.Bitmap]::new((Join-Path $repo $plan.baseline))
$approvedPath=Join-Path $repo $plan.approvedAtlas
if((Get-FileHash -LiteralPath $approvedPath -Algorithm SHA256).Hash.ToLower() -ne $plan.approvedAtlasSha256){throw 'Approved10.47 PNG changed.'}
$idle=[System.Drawing.Bitmap]::new($approvedPath)
$mask=[System.Drawing.Bitmap]::new((Join-Path $repo $plan.sashMask))
if($baseline.Width -ne 3136 -or $baseline.Height -ne 1968 -or $idle.Width -ne 1152 -or $idle.Height -ne 640){throw 'Unexpected atlas dimensions.'}
$packed=$baseline.Clone();$rects=@()
for($i=0;$i -lt 6;$i++){$frame=$metadata.clips.idle.frames[$i];[IdleRelease48]::Replace($packed,$idle,$i,$frame.x,$frame.y);$rects+=,@([int]$frame.x,[int]$frame.y)}
$releasePath=Join-Path $out 'flame-ninja-atlas.png'
$packed.Save($releasePath);$packed.Dispose()
$decoded=[System.Drawing.Bitmap]::new($releasePath)
$audit=[IdleRelease48]::Audit($baseline,$decoded,$idle,[int[][]]$rects)
if($audit[0] -ne 0 -or $audit[1] -ne 0){throw ('RGBA release mismatch: '+($audit -join ','))}
$waistOutside=[IdleRelease48]::WaistAudit($baseline,$decoded,$mask,[int[][]]$rects)
if($waistOutside -ne 0){throw 'Pixels changed outside the approved sash mask.'}
$evidence=@{stage='PREPARED_USER_APPROVED';authority=$plan.authorization;selectedRevision=$plan.selectedRevision;approvedAtlas=$plan.approvedAtlas;approvedAtlasSha256=$plan.approvedAtlasSha256;outsideSashRgbaDifferences=$waistOutside;baseline=$plan.baseline;baselineSha256=(Get-FileHash -LiteralPath (Join-Path $repo $plan.baseline) -Algorithm SHA256).Hash.ToLower();release=($plan.reviewDirectory+'/flame-ninja-atlas.png');releaseSha256=(Get-FileHash -LiteralPath $releasePath -Algorithm SHA256).Hash.ToLower();width=3136;height=1968;changedSourceRects=$rects;nonIdleRgbaDifferences=$audit[0];idleRgbaDifferencesFromReviewedAtlas=$audit[1];metadataChanged=$false;runtimeChanged=$false;browser='NOT_RUN_THIS_TASK';testBuild='NOT_RUN'}
[System.IO.File]::WriteAllText((Join-Path $out 'release-evidence.json'),($evidence|ConvertTo-Json -Depth 10),[System.Text.UTF8Encoding]::new($false))
$baseline.Dispose();$decoded.Dispose();$idle.Dispose();$mask.Dispose()
Write-Output ($evidence|ConvertTo-Json -Depth 10 -Compress)
