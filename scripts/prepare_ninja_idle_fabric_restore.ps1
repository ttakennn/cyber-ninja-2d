$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Drawing
Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @'
using System;
using System.Drawing;
public class IdleFabric46 {
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
    var b=(Bitmap)original.Clone();var pm=new bool[384,320];var edited=new bool[384,320];var cap=Cap(original);changed=0;protectedPixels=0;armDiff=0;visibleDiff=0;
    int[][] flap=new int[][]{new int[]{176,137},new int[]{201,138},new int[]{197,150},new int[]{175,168},new int[]{154,174},new int[]{157,163},new int[]{168,146}};
    for(int y=0;y<320;y++)for(int x=0;x<384;x++){
      var p=original.GetPixel(x,y);bool inHand=Poly(x,y,hand,fist[0],fist[1]);bool nearHand=x>=139+fist[0]&&x<=162+fist[0]&&y>=156+fist[1]&&y<=173+fist[1];
      bool protect=Poly(x,y,upper,shoulder[0],shoulder[1])||Poly(x,y,fore,arm[0],arm[1])||inHand||(nearHand&&Gray(p));
      bool oldGrip=x<=140+fist[0]&&x>=126+fist[0]&&y>=157+fist[1]&&y<=180+fist[1]&&p.A>40&&p.R>p.B*1.15&&p.R>p.G*1.2;
      bool bracerLeather=x>=151+arm[0]&&x<=167+arm[0]&&y>=136+arm[1]&&y<=155+arm[1]&&p.G>p.R*.35&&p.B<p.R*.6;
      if(oldGrip||bracerLeather)protect=false;
      bool inner=x>=151+arm[0]&&x<=168+arm[0]&&y>=139+arm[1]&&y<=155+arm[1];bool inFlap=Poly(x,y,flap,hip[0],hip[1]);
      bool handClear=x<137+fist[0]&&x>=124+fist[0]&&y>=156+fist[1]&&y<=175+fist[1];
      bool edit=Poly(x,y,weapon,hip[0],hip[1])||Poly(x,y,outside,hip[0],hip[1])||Shaft(x,y,cap,fist)||inFlap||inner||oldGrip||handClear||bracerLeather;
      pm[x,y]=protect;if(protect){protectedPixels++;continue;}edited[x,y]=edit;if(!edit)continue;
      int sx=x+shift[0],sy=y+shift[1];var q=sx>=130&&sx<235&&sy>=75&&sy<183?guide.GetPixel(sx,sy):Color.FromArgb(0,0,0,0);
      if((inner&&!inFlap)||oldGrip||handClear||bracerLeather)q=Color.FromArgb(0,0,0,0);
      b.SetPixel(x,y,q);
    }
    // Keep genuinely visible production sash pixels; hidden fittings use textured reconstruction, never row stretching.
    var belt=Belt(original,hip[0]);for(int y=belt[0];y<belt[1];y++){int rel=y-belt[0];int left=204+hip[0];for(int x=left;x<228+hip[0];x++){var p=original.GetPixel(x,y);b.SetPixel(x,y,p);edited[x,y]=true;}}
    for(int y=0;y<320;y++)for(int x=0;x<384;x++){var p=b.GetPixel(x,y);if(p.ToArgb()!=original.GetPixel(x,y).ToArgb()){changed++;if(!edited[x,y])visibleDiff++;}if(pm[x,y]&&p.ToArgb()!=original.GetPixel(x,y).ToArgb())armDiff++;}LastProtected=pm;return b;
  }
  public static int[] Gold(Bitmap b){double sx=0,sy=0,n=0;for(int y=123;y<156;y++)for(int x=154;x<205;x++){var c=b.GetPixel(x,y);if(c.A>150&&c.R>125&&c.G>65&&c.R>1.1*c.G&&c.G>1.5*c.B){sx+=x;sy+=y;n++;}}return new int[]{(int)Math.Round(sx/Math.Max(1,n)),(int)Math.Round(sy/Math.Max(1,n))};}
  public static int Diff(Bitmap a,Bitmap b,int x0,int y0,int w,int h){int n=0;for(int y=y0;y<y0+h;y++)for(int x=x0;x<x0+w;x++)if(a.GetPixel(x,y).ToArgb()!=b.GetPixel(x,y).ToArgb())n++;return n;}
  public static int Contact(Bitmap b,int x){for(int y=45;y<100;y++)if(b.GetPixel(x,y).A>=180&&b.GetPixel(x+1,y).A>=180)return y;throw new Exception("No back contact");}
}
'@
$repo=Split-Path $PSScriptRoot -Parent;$source=Join-Path $repo 'integration/ninja-idle-fabric-restore'
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
  $arm=[IdleFabric46]::Match($base,$ref,139,120,21,32,10);$fist=[IdleFabric46]::Match($base,$ref,141,154,22,20,10)
  $g0=[IdleFabric46]::Gold($base);$gi=[IdleFabric46]::Gold($ref);$hip=[int[]]@(($gi[0]-$g0[0]),($gi[1]-$g0[1]));$shoulder=[int[]]$oldMeta.attachments[$i].shoulderOffset
  $gx=[int][Math]::Floor($guides.Width*$col/3);$gy=[int][Math]::Floor($guides.Height*$row/2);$gw=[int][Math]::Floor($guides.Width*($col+1)/3)-$gx;$gh=[int][Math]::Floor($guides.Height*($row+1)/2)-$gy
  $guide=[System.Drawing.Bitmap]::new(384,320,[System.Drawing.Imaging.PixelFormat]::Format32bppArgb);$g=[System.Drawing.Graphics]::FromImage($guide);$g.InterpolationMode=[System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic;$g.DrawImage($guides,[System.Drawing.Rectangle]::new(130,75,105,108),[System.Drawing.Rectangle]::new($gx,$gy,$gw,$gh),[System.Drawing.GraphicsUnit]::Pixel);$g.Dispose()
  $alignment=[IdleFabric46]::Match($ref,$guide,205,118,18,32,4)
  [IdleFabric46]::Current=$body44.Clone([System.Drawing.Rectangle]::new(($col*384),($row*320),384,320),[System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $changed=0;$protected=0;$armDiff=0;$visibleDiff=0
  $body=[IdleFabric46]::Restore($ref,$guide,[int[][]]$plan.upperArm,[int[][]]$plan.forearm,[int[][]]$plan.hand,[int[][]]$plan.weaponMask,[int[][]]$plan.externalWeapon,$shoulder,$arm,$fist,$hip,$alignment,[ref]$changed,[ref]$protected,[ref]$armDiff,[ref]$visibleDiff)
  [IdleFabric46]::Mask($protectedAtlas,($col*384),($row*320))
  $a=$oldMeta.attachments[$i];$axis=[int]$a.swordAxisX;$contact=[IdleFabric46]::Contact($body,$axis);$bottom=$contact+3;$dy=[int]$a.shoulderOffset[1]+8
  $pose=[System.Drawing.Bitmap]::new(384,320,[System.Drawing.Imaging.PixelFormat]::Format32bppArgb);$g=[System.Drawing.Graphics]::FromImage($pose);$g.SetClip([System.Drawing.Rectangle]::new(0,0,384,$bottom));$g.DrawImageUnscaled($weapon,[int]$a.shoulderOffset[0],$dy);$g.ResetClip();$g.DrawImageUnscaled($body,0,0);$g.Dispose()
  [IdleFabric46]::Compose($pose,$body,$bottom,$axis)
  foreach($pair in @(@($atlas,$pose),@($refs,$ref),@($bodies,$body))){[IdleFabric46]::Paste($pair[0],$pair[1],($col*384),($row*320))}
  $frames+=@{x=$col*384;y=$row*320;width=384;height=320;pivot=@{x=192;y=289}}
  $audit+=@{frame=$i;protectedArmPixels=$protected;armDifferences=$armDiff;outsideEditVsProductionDifferences=$visibleDiff;headDifferences=[IdleFabric46]::Diff($pose,$ref,190,30,55,75);farArmDifferences=[IdleFabric46]::Diff($pose,$ref,224,95,40,88);editedPixelsVsProduction=$changed}
  $anchors+=@{frame=$i;shoulderOffset=$shoulder;forearmOffset=$arm;handOffset=$fist;hipOffset=$hip;guideAlignment=$alignment;swordAxisX=$axis;swordTop=$a.swordTop;visibleBottom=$bottom}
  [IdleFabric46]::Current.Dispose();$guide.Dispose();$ref.Dispose();$body.Dispose();$pose.Dispose()
}
$atlas.Save((Join-Path $out 'idle-atlas.png'));$refs.Save((Join-Path $out 'production-idle-atlas.png'));$bodies.Save((Join-Path $out 'body-atlas.png'));$protectedAtlas.Save((Join-Path $out 'protected-arm-mask.png'));Copy-Item -LiteralPath (Join-Path $previous 'idle-atlas.png') -Destination (Join-Path $out 'before-atlas.png')
$data=@{status=$plan.status;fps=$meta.clips.idle.fps;loop=$true;frames=$frames;attachments=$anchors;pixelAudit=$audit;scope=$plan.scope}
[System.IO.File]::WriteAllText((Join-Path $out 'review.json'),($data|ConvertTo-Json -Depth 12),[System.Text.UTF8Encoding]::new($false));[System.IO.File]::WriteAllText((Join-Path $out 'review-data.js'),('window.idleReview='+($data|ConvertTo-Json -Depth 12 -Compress)+';'),[System.Text.UTF8Encoding]::new($false))
foreach($name in @('preview.html','preview.js')){Copy-Item -LiteralPath (Join-Path $source $name) -Destination (Join-Path $out $name)}
$detail=[System.Drawing.Bitmap]::new(1260,2520,[System.Drawing.Imaging.PixelFormat]::Format32bppArgb);$g=[System.Drawing.Graphics]::FromImage($detail);$g.Clear([System.Drawing.Color]::FromArgb(255,20,35,55));$g.InterpolationMode=[System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor;$font=[System.Drawing.Font]::new('Arial',14)
for($i=0;$i -lt 6;$i++){ $f=$frames[$i];for($s=0;$s -lt 3;$s++){ $img=@($refs,$old,$atlas)[$s];$label=@('PRODUCTION','TASK10.45','RESTORED')[$s];$x=$s*420;$y=$i*420;$g.DrawString(($label+' / F'+($i+1)),$font,[System.Drawing.Brushes]::Wheat,($x+5),($y+2));$g.DrawImage($img,[System.Drawing.Rectangle]::new($x,($y+20),420,400),[System.Drawing.Rectangle]::new(($f.x+130),($f.y+80),105,100),[System.Drawing.GraphicsUnit]::Pixel)}}
$g.Dispose();$font.Dispose();$detail.Save((Join-Path $out 'arm-waist-review.png'));$detail.Dispose()
$motionDir=Join-Path $out 'motion-frames';New-Item -ItemType Directory -Force $motionDir|Out-Null
for($i=0;$i -lt 6;$i++){$f=$frames[$i];$motion=[System.Drawing.Bitmap]::new(1200,760,[System.Drawing.Imaging.PixelFormat]::Format32bppArgb);$g=[System.Drawing.Graphics]::FromImage($motion);$g.Clear([System.Drawing.Color]::FromArgb(255,20,35,55));$font=[System.Drawing.Font]::new('Arial',16)
  for($s=0;$s -lt 3;$s++){$img=@($refs,$old,$atlas)[$s];$label=@('PRODUCTION','TASK10.45','RESTORED')[$s];$g.DrawString(($label+' / F'+($i+1)),$font,[System.Drawing.Brushes]::Wheat,($s*400+10),10);$g.DrawImage($img,[System.Drawing.Rectangle]::new(($s*400+8),60,384,320),[System.Drawing.Rectangle]::new($f.x,$f.y,384,320),[System.Drawing.GraphicsUnit]::Pixel);$g.InterpolationMode=[System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor;$g.DrawImage($img,[System.Drawing.Rectangle]::new(($s*400+40),430,315,300),[System.Drawing.Rectangle]::new(($f.x+130),($f.y+80),105,100),[System.Drawing.GraphicsUnit]::Pixel)}
  $g.Dispose();$font.Dispose();$motion.Save((Join-Path $motionDir ('frame-'+$i+'.png')));$motion.Save((Join-Path $motionDir ('frame-'+$i+'.gif')),[System.Drawing.Imaging.ImageFormat]::Gif);$motion.Dispose()}
& node (Join-Path $repo 'scripts/assemble_ninja_idle_fabric_review.mjs');if($LASTEXITCODE -ne 0){throw 'Cannot export review GIF'}
$files=@(($plan.previousDirectory+'/body-atlas.png'),($plan.previousDirectory+'/idle-atlas.png'),($plan.previousDirectory+'/review.json'),'scripts/assemble_ninja_idle_fabric_review.mjs',$plan.productionAtlas,$plan.productionMetadata,$plan.guide,$plan.weaponLayer,'integration/ninja-idle-fabric-restore/plan.json','integration/ninja-idle-fabric-restore/prompt.txt','scripts/prepare_ninja_idle_fabric_restore.ps1',($plan.reviewDirectory+'/idle-atlas.png'))
$hashes=foreach($file in $files){@{path=$file;sha256=(Get-FileHash -LiteralPath (Join-Path $repo $file) -Algorithm SHA256).Hash.ToLower()}}
@{status=$plan.status;method='Native production body; surgical textured fabric guide for hidden hip weapons and missing flap, original visible sash pixels, tightened arm silhouette and no leftover grip. Back sword unchanged.';files=$hashes;pixelAudit=$audit;phase='AUTHORING_ONLY';authoringWritesProduction=$false;releaseEvidence='release-evidence.json';runtimeChanged=$false}|ConvertTo-Json -Depth 12|Set-Content -Encoding UTF8 (Join-Path $out 'provenance.json')
$atlas.Dispose();$refs.Dispose();$bodies.Dispose();$protectedAtlas.Dispose();$production.Dispose();$old.Dispose();$weapon.Dispose();$guides.Dispose();$base.Dispose();Write-Output (@{audit=$audit;anchors=$anchors}|ConvertTo-Json -Depth 10 -Compress)
