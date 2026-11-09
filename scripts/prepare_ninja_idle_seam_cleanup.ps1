$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Drawing
Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @'
using System;
using System.Drawing;
public class IdleSeam45 {
  public static bool[,] LastProtected;
  public static bool Poly(int x,int y,int[][] p,int dx,int dy){double px=x-dx+.5,py=y-dy+.5;bool inside=false;for(int i=0,j=p.Length-1;i<p.Length;j=i++){if((p[i][1]>py)!=(p[j][1]>py)&&px<(double)(p[j][0]-p[i][0])*(py-p[i][1])/(p[j][1]-p[i][1])+p[i][0])inside=!inside;}return inside;}
  public static int[] Match(Bitmap a,Bitmap b,int x0,int y0,int w,int h,int range){long best=long.MaxValue;int bx=0,by=0;for(int dy=-range;dy<=range;dy++)for(int dx=-range;dx<=range;dx++){long cost=0;for(int y=y0;y<y0+h;y++)for(int x=x0;x<x0+w;x++){var p=a.GetPixel(x,y);var q=b.GetPixel(x+dx,y+dy);cost+=Math.Abs(p.R-q.R)+Math.Abs(p.G-q.G)+Math.Abs(p.B-q.B)+2*Math.Abs(p.A-q.A);}cost+=Math.Abs(dx)+Math.Abs(dy);if(cost<best){best=cost;bx=dx;by=dy;}}return new int[]{bx,by};}
  public static bool Gray(Color c){return c.A>150&&c.R<95&&c.G<95&&c.B>=c.R&&c.B<110;}
  public static int GloveLeft(Bitmap b,int y,int center){for(int x=center-16;x<center+8;x++)if(Gray(b.GetPixel(x,y))&&Gray(b.GetPixel(x+1,y))&&Gray(b.GetPixel(x+2,y)))return x;return center-6;}
  public static int[] Cap(Bitmap b){int min=140;for(int y=155;y<199;y++)for(int x=85;x<132;x++){var c=b.GetPixel(x,y);if(c.A>150&&c.R>100&&c.G>55&&c.G>1.5*c.B)min=Math.Min(min,x);}double sx=0,sy=0,n=0;for(int y=155;y<199;y++)for(int x=min;x<Math.Min(132,min+14);x++){var c=b.GetPixel(x,y);if(c.A>150&&c.R>100&&c.G>55&&c.G>1.5*c.B){sx+=x;sy+=y;n++;}}if(n==0)throw new Exception("Old scabbard cap not found");return new int[]{(int)Math.Round(sx/n),(int)Math.Round(sy/n)};}
  public static bool Shaft(int x,int y,int[] cap,int[] fist){double ax=cap[0],ay=cap[1],vx=142+fist[0]-ax,vy=164+fist[1]-ay,den=vx*vx+vy*vy,t=Math.Max(0,Math.Min(1,((x-ax)*vx+(y-ay)*vy)/den));double dx=x-ax-t*vx,dy=y-ay-t*vy;return dx*dx+dy*dy<=81;}
  public static void Paste(Bitmap dst,Bitmap src,int dx,int dy){for(int y=0;y<src.Height;y++)for(int x=0;x<src.Width;x++)dst.SetPixel(x+dx,y+dy,src.GetPixel(x,y));}
  public static void Mask(Bitmap dst,int dx,int dy){for(int y=0;y<320;y++)for(int x=0;x<384;x++)if(LastProtected[x,y])dst.SetPixel(x+dx,y+dy,Color.FromArgb(160,40,235,180));}
  public static void Compose(Bitmap pose,Bitmap body,int bottom,int axis){for(int y=0;y<320;y++)for(int x=0;x<384;x++)if(y>=bottom||x<axis-10||x>axis+10)pose.SetPixel(x,y,body.GetPixel(x,y));}
  public static Bitmap Current;
  public static int[] Belt(Bitmap b,int dx){int top=128,bottom=139;for(int y=119;y<140;y++){var p=b.GetPixel(210+dx,y);if(p.R>90&&p.G<70&&p.R>3*p.G){top=y;break;}}for(int y=top+5;y<151;y++){var p=b.GetPixel(210+dx,y);if(p.R<65){bottom=y;break;}}return new int[]{top,bottom};}
  public static Bitmap Restore(Bitmap original,Bitmap guide,int[][] upper,int[][] fore,int[][] hand,int[][] weapon,int[][] outside,int[] shoulder,int[] arm,int[] fist,int[] hip,int[] shift,out int changed,out int protectedPixels,out int armDiff,out int visibleDiff){
    var b=(Bitmap)Current.Clone();var pm=new bool[384,320];var edit=new bool[384,320];var cap=Cap(original);changed=0;protectedPixels=0;armDiff=0;visibleDiff=0;
    for(int y=0;y<320;y++)for(int x=0;x<384;x++){bool protect=Poly(x,y,upper,shoulder[0],shoulder[1])||Poly(x,y,fore,arm[0],arm[1])||Poly(x,y,hand,fist[0],fist[1]);var p=original.GetPixel(x,y);bool inHand=Poly(x,y,hand,fist[0],fist[1]);if(inHand&&y<173+fist[1]){int left=GloveLeft(original,y,148+fist[0]);if(x<left&&p.R>p.G&&p.R>p.B)protect=false;}pm[x,y]=protect;if(protect)protectedPixels++;bool oldEdit=Poly(x,y,weapon,hip[0],hip[1])||Poly(x,y,outside,hip[0],hip[1])||Shaft(x,y,cap,fist);if(protect||!oldEdit)b.SetPixel(x,y,p);}
    // Recover the complete native gauntlet silhouette and transparent corridor, not a fixed polygon edge.
    for(int y=114+arm[1];y<146+arm[1];y++){int firstGap=-1;for(int x=150+arm[0];x<175+arm[0];x++)if(original.GetPixel(x,y).A<80){firstGap=x;break;}for(int x=133+arm[0];x<175+arm[0];x++){var p=original.GetPixel(x,y);if((firstGap>=0&&x<firstGap)||p.A<80){b.SetPixel(x,y,p);edit[x,y]=true;}}}
    var belt=Belt(original,hip[0]);var gb=Belt(guide,hip[0]);int top=belt[0],bottom=belt[1];
    // Guide only supplies cloth hidden by the removed fittings and the previously over-thick sash patch.
    for(int y=top-1;y<bottom+11;y++)for(int x=174+hip[0];x<205+hip[0];x++){if(pm[x,y])continue;int sy=y; if(y<=bottom)sy=gb[0]+(int)Math.Round((y-top)*(double)(gb[1]-gb[0])/Math.Max(1,bottom-top));else sy=gb[1]+y-bottom;sy=Math.Max(75,Math.Min(182,sy));b.SetPixel(x,y,guide.GetPixel(x,sy));edit[x,y]=true;}
    // Native visible sash and its original lower boundary take precedence over the reconstruction.
    for(int y=top-2;y<bottom;y++)for(int x=194+hip[0];x<228+hip[0];x++){var p=original.GetPixel(x,y);bool fitting=p.G>18&&p.G>p.R*.38;if(!fitting||x>=204+hip[0])b.SetPixel(x,y,p);edit[x,y]=true;}
    for(int y=top-3;y<bottom+13;y++)for(int x=204+hip[0];x<234+hip[0];x++){b.SetPixel(x,y,original.GetPixel(x,y));edit[x,y]=true;}
    // Reuse the candidate's natural left outline, continue clean native sash rows without importing old fittings.
    for(int y=top-1;y<=bottom;y++){
      for(int x=165+hip[0];x<204+hip[0];x++){b.SetPixel(x,y,Current.GetPixel(x,y));edit[x,y]=true;}
      int left=204+hip[0];for(int x=204+hip[0];x>=165+hip[0];x--){if(Current.GetPixel(x,y).A<80){left=x+1;break;}left=x;}
      for(int x=left;x<204+hip[0];x++){var q=original.GetPixel(210+hip[0],y);var edge=original.GetPixel(204+hip[0],y);double mix=Math.Max(0,Math.Min(1,(x-(194+hip[0]))/10.0));double shade=.78+.22*Math.Min(1,(x-left)/17.0);b.SetPixel(x,y,Color.FromArgb(q.A,(int)((q.R*(1-mix)+edge.R*mix)*shade),(int)((q.G*(1-mix)+edge.G*mix)*shade),(int)((q.B*(1-mix)+edge.B*mix)*shade)));edit[x,y]=true;}
    }
    for(int y=0;y<320;y++)for(int x=0;x<384;x++)if(pm[x,y])b.SetPixel(x,y,original.GetPixel(x,y));
    for(int y=0;y<320;y++)for(int x=0;x<384;x++){var p=b.GetPixel(x,y);if(p.ToArgb()!=Current.GetPixel(x,y).ToArgb()){changed++;if(!edit[x,y]&&p.A>0&&Current.GetPixel(x,y).A>0&&Math.Abs(p.R-Current.GetPixel(x,y).R)+Math.Abs(p.G-Current.GetPixel(x,y).G)+Math.Abs(p.B-Current.GetPixel(x,y).B)>6)visibleDiff++;}if(pm[x,y]&&p.ToArgb()!=original.GetPixel(x,y).ToArgb())armDiff++;}LastProtected=pm;return b;
  }
  public static int[] Gold(Bitmap b){double sx=0,sy=0,n=0;for(int y=123;y<156;y++)for(int x=154;x<205;x++){var c=b.GetPixel(x,y);if(c.A>150&&c.R>125&&c.G>65&&c.R>1.1*c.G&&c.G>1.5*c.B){sx+=x;sy+=y;n++;}}return new int[]{(int)Math.Round(sx/Math.Max(1,n)),(int)Math.Round(sy/Math.Max(1,n))};}
  public static int Diff(Bitmap a,Bitmap b,int x0,int y0,int w,int h){int n=0;for(int y=y0;y<y0+h;y++)for(int x=x0;x<x0+w;x++)if(a.GetPixel(x,y).ToArgb()!=b.GetPixel(x,y).ToArgb())n++;return n;}
  public static int Contact(Bitmap b,int x){for(int y=45;y<100;y++)if(b.GetPixel(x,y).A>=180&&b.GetPixel(x+1,y).A>=180)return y;throw new Exception("No back contact");}
}
'@
$repo=Split-Path $PSScriptRoot -Parent;$source=Join-Path $repo 'integration/ninja-idle-seam-cleanup'
$plan=Get-Content (Join-Path $source 'plan.json') -Raw -Encoding UTF8|ConvertFrom-Json;$out=Join-Path $repo $plan.reviewDirectory;New-Item -ItemType Directory -Force $out|Out-Null
$meta=Get-Content (Join-Path $repo $plan.productionMetadata) -Raw -Encoding UTF8|ConvertFrom-Json
$previous=Join-Path $repo $plan.previousDirectory;$oldMeta=Get-Content (Join-Path $previous 'review.json') -Raw -Encoding UTF8|ConvertFrom-Json
$body44=[System.Drawing.Bitmap]::new((Join-Path $previous 'body-atlas.png'))
$production=[System.Drawing.Bitmap]::new((Join-Path $repo $plan.productionAtlas));$old=[System.Drawing.Bitmap]::new((Join-Path $previous 'idle-atlas.png'));$weapon=[System.Drawing.Bitmap]::new((Join-Path $repo $plan.weaponLayer));$guides=[System.Drawing.Bitmap]::new((Join-Path $repo $plan.guide))
$atlas=[System.Drawing.Bitmap]::new(1152,640,[System.Drawing.Imaging.PixelFormat]::Format32bppArgb);$refs=[System.Drawing.Bitmap]::new(1152,640,[System.Drawing.Imaging.PixelFormat]::Format32bppArgb);$bodies=[System.Drawing.Bitmap]::new(1152,640,[System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$frames=@();$audit=@();$anchors=@();$base=$null
$protectedAtlas=[System.Drawing.Bitmap]::new(1152,640,[System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
for($i=0;$i -lt 6;$i++){
  $f=$meta.clips.idle.frames[$i];$col=$i%3;$row=[int][Math]::Floor($i/3)
  $ref=$production.Clone([System.Drawing.Rectangle]::new($f.x,$f.y,384,320),[System.Drawing.Imaging.PixelFormat]::Format32bppArgb);if($i -eq 0){$base=$ref.Clone()}
  $arm=[IdleSeam45]::Match($base,$ref,139,120,21,32,10);$fist=[IdleSeam45]::Match($base,$ref,141,154,22,20,10)
  $g0=[IdleSeam45]::Gold($base);$gi=[IdleSeam45]::Gold($ref);$hip=[int[]]@(($gi[0]-$g0[0]),($gi[1]-$g0[1]));$shoulder=[int[]]$oldMeta.attachments[$i].shoulderOffset
  $gx=[int][Math]::Floor($guides.Width*$col/3);$gy=[int][Math]::Floor($guides.Height*$row/2);$gw=[int][Math]::Floor($guides.Width*($col+1)/3)-$gx;$gh=[int][Math]::Floor($guides.Height*($row+1)/2)-$gy
  $guide=[System.Drawing.Bitmap]::new(384,320,[System.Drawing.Imaging.PixelFormat]::Format32bppArgb);$g=[System.Drawing.Graphics]::FromImage($guide);$g.InterpolationMode=[System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic;$g.DrawImage($guides,[System.Drawing.Rectangle]::new(130,75,105,108),[System.Drawing.Rectangle]::new($gx,$gy,$gw,$gh),[System.Drawing.GraphicsUnit]::Pixel);$g.Dispose()
  $alignment=[IdleSeam45]::Match($ref,$guide,205,118,18,32,4)
  [IdleSeam45]::Current=$body44.Clone([System.Drawing.Rectangle]::new(($col*384),($row*320),384,320),[System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $changed=0;$protected=0;$armDiff=0;$visibleDiff=0
  $body=[IdleSeam45]::Restore($ref,$guide,[int[][]]$plan.upperArm,[int[][]]$plan.forearm,[int[][]]$plan.hand,[int[][]]$plan.weaponMask,[int[][]]$plan.externalWeapon,$shoulder,$arm,$fist,$hip,$alignment,[ref]$changed,[ref]$protected,[ref]$armDiff,[ref]$visibleDiff)
  [IdleSeam45]::Mask($protectedAtlas,($col*384),($row*320))
  $a=$oldMeta.attachments[$i];$axis=[int]$a.swordAxisX;$contact=[IdleSeam45]::Contact($body,$axis);$bottom=$contact+3;$dy=[int]$a.shoulderOffset[1]+8
  $pose=[System.Drawing.Bitmap]::new(384,320,[System.Drawing.Imaging.PixelFormat]::Format32bppArgb);$g=[System.Drawing.Graphics]::FromImage($pose);$g.SetClip([System.Drawing.Rectangle]::new(0,0,384,$bottom));$g.DrawImageUnscaled($weapon,[int]$a.shoulderOffset[0],$dy);$g.ResetClip();$g.DrawImageUnscaled($body,0,0);$g.Dispose()
  [IdleSeam45]::Compose($pose,$body,$bottom,$axis)
  foreach($pair in @(@($atlas,$pose),@($refs,$ref),@($bodies,$body))){[IdleSeam45]::Paste($pair[0],$pair[1],($col*384),($row*320))}
  $frames+=@{x=$col*384;y=$row*320;width=384;height=320;pivot=@{x=192;y=289}}
  $audit+=@{frame=$i;protectedArmPixels=$protected;armDifferences=$armDiff;outsideCleanupVisibleChangesVs44=$visibleDiff;headDifferences=[IdleSeam45]::Diff($pose,$ref,190,30,55,75);farArmDifferences=[IdleSeam45]::Diff($pose,$ref,224,95,40,88);cleanupChangedPixels=$changed}
  $anchors+=@{frame=$i;shoulderOffset=$shoulder;forearmOffset=$arm;handOffset=$fist;hipOffset=$hip;guideAlignment=$alignment;swordAxisX=$axis;swordTop=$a.swordTop;visibleBottom=$bottom}
  [IdleSeam45]::Current.Dispose();$guide.Dispose();$ref.Dispose();$body.Dispose();$pose.Dispose()
}
$atlas.Save((Join-Path $out 'idle-atlas.png'));$refs.Save((Join-Path $out 'production-idle-atlas.png'));$bodies.Save((Join-Path $out 'body-atlas.png'));$protectedAtlas.Save((Join-Path $out 'protected-arm-mask.png'));Copy-Item -LiteralPath (Join-Path $previous 'idle-atlas.png') -Destination (Join-Path $out 'before-atlas.png')
$data=@{status=$plan.status;fps=$meta.clips.idle.fps;loop=$true;frames=$frames;attachments=$anchors;pixelAudit=$audit;scope=$plan.scope}
[System.IO.File]::WriteAllText((Join-Path $out 'review.json'),($data|ConvertTo-Json -Depth 12),[System.Text.UTF8Encoding]::new($false));[System.IO.File]::WriteAllText((Join-Path $out 'review-data.js'),('window.idleReview='+($data|ConvertTo-Json -Depth 12 -Compress)+';'),[System.Text.UTF8Encoding]::new($false))
foreach($name in @('preview.html','preview.js')){Copy-Item -LiteralPath (Join-Path $source $name) -Destination (Join-Path $out $name)}
$detail=[System.Drawing.Bitmap]::new(1260,2520,[System.Drawing.Imaging.PixelFormat]::Format32bppArgb);$g=[System.Drawing.Graphics]::FromImage($detail);$g.Clear([System.Drawing.Color]::FromArgb(255,20,35,55));$g.InterpolationMode=[System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor;$font=[System.Drawing.Font]::new('Arial',14)
for($i=0;$i -lt 6;$i++){ $f=$frames[$i];for($s=0;$s -lt 3;$s++){ $img=@($refs,$old,$atlas)[$s];$label=@('PRODUCTION','TASK10.44','RESTORED')[$s];$x=$s*420;$y=$i*420;$g.DrawString(($label+' / F'+($i+1)),$font,[System.Drawing.Brushes]::Wheat,($x+5),($y+2));$g.DrawImage($img,[System.Drawing.Rectangle]::new($x,($y+20),420,400),[System.Drawing.Rectangle]::new(($f.x+130),($f.y+80),105,100),[System.Drawing.GraphicsUnit]::Pixel)}}
$g.Dispose();$font.Dispose();$detail.Save((Join-Path $out 'arm-waist-review.png'));$detail.Dispose()
$motionDir=Join-Path $out 'motion-frames';New-Item -ItemType Directory -Force $motionDir|Out-Null
for($i=0;$i -lt 6;$i++){$f=$frames[$i];$motion=[System.Drawing.Bitmap]::new(1200,760,[System.Drawing.Imaging.PixelFormat]::Format32bppArgb);$g=[System.Drawing.Graphics]::FromImage($motion);$g.Clear([System.Drawing.Color]::FromArgb(255,20,35,55));$font=[System.Drawing.Font]::new('Arial',16)
  for($s=0;$s -lt 3;$s++){$img=@($refs,$old,$atlas)[$s];$label=@('PRODUCTION','TASK10.44','RESTORED')[$s];$g.DrawString(($label+' / F'+($i+1)),$font,[System.Drawing.Brushes]::Wheat,($s*400+10),10);$g.DrawImage($img,[System.Drawing.Rectangle]::new(($s*400+8),60,384,320),[System.Drawing.Rectangle]::new($f.x,$f.y,384,320),[System.Drawing.GraphicsUnit]::Pixel);$g.InterpolationMode=[System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor;$g.DrawImage($img,[System.Drawing.Rectangle]::new(($s*400+40),430,315,300),[System.Drawing.Rectangle]::new(($f.x+130),($f.y+80),105,100),[System.Drawing.GraphicsUnit]::Pixel)}
  $g.Dispose();$font.Dispose();$motion.Save((Join-Path $motionDir ('frame-'+$i+'.png')));$motion.Save((Join-Path $motionDir ('frame-'+$i+'.gif')),[System.Drawing.Imaging.ImageFormat]::Gif);$motion.Dispose()}
& node (Join-Path $repo 'scripts/assemble_ninja_idle_seam_review.mjs');if($LASTEXITCODE -ne 0){throw 'Cannot export review GIF'}
$files=@(($plan.previousDirectory+'/body-atlas.png'),($plan.previousDirectory+'/idle-atlas.png'),($plan.previousDirectory+'/review.json'),'scripts/assemble_ninja_idle_seam_review.mjs',$plan.productionAtlas,$plan.productionMetadata,$plan.guide,$plan.weaponLayer,'integration/ninja-idle-seam-cleanup/plan.json','integration/ninja-idle-seam-cleanup/prompt.txt','scripts/prepare_ninja_idle_seam_cleanup.ps1',($plan.reviewDirectory+'/idle-atlas.png'))
$hashes=foreach($file in $files){@{path=$file;sha256=(Get-FileHash -LiteralPath (Join-Path $repo $file) -Algorithm SHA256).Hash.ToLower()}}
@{status=$plan.status;method='Task44 body; restore native gauntlet alpha corridor and thin visible sash boundary; imagegen only in left occluded sash/cloth. Back sword unchanged.';files=$hashes;pixelAudit=$audit;productionChanged=$false;runtimeChanged=$false}|ConvertTo-Json -Depth 12|Set-Content -Encoding UTF8 (Join-Path $out 'provenance.json')
$atlas.Dispose();$refs.Dispose();$bodies.Dispose();$protectedAtlas.Dispose();$production.Dispose();$old.Dispose();$weapon.Dispose();$guides.Dispose();$base.Dispose();Write-Output (@{audit=$audit;anchors=$anchors}|ConvertTo-Json -Depth 10 -Compress)
