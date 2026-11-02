$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @'
using System; using System.Drawing; using System.Drawing.Imaging; using System.Runtime.InteropServices;
public static class AttackArt {
  public static int[] Measure(Bitmap b, int rightLimit) {
    var data=b.LockBits(new Rectangle(0,0,b.Width,b.Height),ImageLockMode.ReadOnly,PixelFormat.Format32bppArgb);
    var a=new byte[b.Width*b.Height*4]; Marshal.Copy(data.Scan0,a,0,a.Length); b.UnlockBits(data);
    int l=b.Width,t=b.Height,r=-1,bt=-1,foot=-1;
    for(int y=0;y<b.Height;y++)for(int x=0;x<b.Width;x++) {int p=(y*b.Width+x)*4;
      if(a[p+3]>=16){l=Math.Min(l,x);t=Math.Min(t,y);r=Math.Max(r,x);bt=Math.Max(bt,y);}
      if(y>b.Height*0.6 && x<rightLimit && a[p+3]>=128 && a[p]<150 && a[p+1]<140 && a[p+2]<140) foot=Math.Max(foot,y);
    }
    int fl=b.Width,fr=-1;
    for(int y=Math.Max(0,foot-18);y<=foot;y++)for(int x=0;x<Math.Min(b.Width,rightLimit);x++){int p=(y*b.Width+x)*4;
      if(a[p+3]>=128 && a[p]<150 && a[p+1]<140 && a[p+2]<140){fl=Math.Min(fl,x);fr=Math.Max(fr,x);}
    }
    if(r<0 || foot<0 || fr<0)throw new Exception("Missing artwork/foot contact");
    return new int[]{l,t,r,bt,(fl+fr)/2,foot};
  }
}
'@
$repo = Split-Path $PSScriptRoot -Parent
$root = Join-Path $repo 'integration/task-009-player-attacks'
$out = Join-Path $root 'candidate'
$evidence = Join-Path $repo 'docs/map01/commits/task-009-01-player-art'
New-Item -ItemType Directory -Force $out,$evidence | Out-Null
$utf8 = [Text.UTF8Encoding]::new($false)
$review=@(); $audit=@()
foreach($attack in 1..3) {
  $name='attack_'+$attack
  $meta=Get-Content -LiteralPath (Join-Path $root ('source/flame_ninja_'+$name+'.json')) -Raw | ConvertFrom-Json
  $sourcePath=Join-Path $root ('source/flame_ninja_'+$name+'_atlas.png')
  if($attack -eq 3){$sourcePath=Join-Path $root 'source/attack-3-identity-candidate.png'}
  $raw=[Drawing.Bitmap]::new($sourcePath)
  $source=[Drawing.Bitmap]::new($meta.width,$meta.height,[Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $g=[Drawing.Graphics]::FromImage($source)
  $g.DrawImage($raw,[Drawing.Rectangle]::new(0,0,$meta.width,$meta.height));$g.Dispose();$raw.Dispose()
  # Một hệ số cho cả clip, theo cỡ đầu/thân; không fit bbox lửa hoặc từng frame.
  $scale=if($attack -eq 3){0.5}else{0.625}
  $atlas=[Drawing.Bitmap]::new($meta.columns*512,$meta.rows*512,[Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $g=[Drawing.Graphics]::FromImage($atlas);$g.CompositingMode=[Drawing.Drawing2D.CompositingMode]::SourceCopy
  $frames=@();$measurements=@()
  foreach($frame in $meta.frames) {
    $cell=$source.Clone([Drawing.Rectangle]::new($frame.x,$frame.y,768,512),[Drawing.Imaging.PixelFormat]::Format32bppArgb)
    if($attack -eq 3 -and $frame.index -eq 7){
      $cleanup=[Drawing.Graphics]::FromImage($cell);$cleanup.CompositingMode=[Drawing.Drawing2D.CompositingMode]::SourceCopy
      $cleanup.FillRectangle([Drawing.Brushes]::Transparent,0,0,64,512);$cleanup.Dispose()
    }
    $limit=if($attack -eq 2 -and $frame.index -eq 0){350}else{768}
    $m=[AttackArt]::Measure($cell,$limit)
    # Finisher che một chân bằng lửa; không lấy chân còn thấy làm tâm người.
    if($attack -eq 3){$m[4]=@(270,240,300,295,300,270,300,360)[$frame.index]}
    $left=[int][Math]::Round(192-$m[4]*$scale);$top=[int][Math]::Round(353-$m[5]*$scale)
    if($left+$m[0]*$scale -lt 0 -or $left+$m[2]*$scale -ge 512 -or $top+$m[1]*$scale -lt 0 -or $top+$m[3]*$scale -ge 512){throw "Artwork exceeds candidate canvas: $name/$($frame.index), ink=$m, left=$left, top=$top, scale=$scale"}
    $pose=[Drawing.Bitmap]::new(512,512,[Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $pg=[Drawing.Graphics]::FromImage($pose);$pg.InterpolationMode=[Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $pg.DrawImage($cell,[Drawing.Rectangle]::new($left,$top,[int](768*$scale),[int](512*$scale)));$pg.Dispose()
    $x=($frame.index%$meta.columns)*512;$y=[int][Math]::Floor($frame.index/$meta.columns)*512
    $g.DrawImageUnscaled($pose,$x,$y)
    $frames+=@{x=$x;y=$y;width=512;height=512;sourceWidth=512;sourceHeight=512;offsetX=0;offsetY=0;pivot=@{x=192;y=353}}
    $measurements+=@{index=$frame.index;sourceInk=$m[0..3];sourceFoot=@($m[4],$m[5]);translation=@($left,$top);uniformScale=$scale}
    $pose.Dispose();$cell.Dispose()
  }
  $g.Dispose();$source.Dispose()
  $image=$name+'.png';$atlas.Save((Join-Path $out $image),[Drawing.Imaging.ImageFormat]::Png);$atlas.Dispose()
  $sheet=@{version=1;kind='production';image=$image;filter='linear';frameWidth=512;frameHeight=512;columns=$meta.columns;
    visual=@{width=3.2;height=3.2;offset=@{x=0;y=0};scale=@{x=1;y=1};anchor=@{x=0.5;y=0}};
    clips=@{$name=@{fps=$meta.frameCount/0.3;loop=$false;frames=$frames}}}
  [IO.File]::WriteAllText((Join-Path $out ($name+'.json')),($sheet|ConvertTo-Json -Depth 12),$utf8)
  $review+=@{id=$name;image=$image;count=$meta.frameCount;columns=$meta.columns;frameMs=300/$meta.frameCount}
  $audit+=@{id=$name;sourceSha256=(Get-FileHash -LiteralPath $sourcePath -Algorithm SHA256).Hash.ToLower();candidateSha256=(Get-FileHash -LiteralPath (Join-Path $out $image) -Algorithm SHA256).Hash.ToLower();measurements=$measurements}
}
[IO.File]::WriteAllText((Join-Path $out 'review-data.js'),('window.attackReview='+($review|ConvertTo-Json -Depth 5 -Compress)+';'),$utf8)
[IO.File]::WriteAllText((Join-Path $root 'normalization-report.json'),(@{status='CANDIDATE_NOT_APPROVED';pixelWorldUnit=0.00625;measurements=$audit}|ConvertTo-Json -Depth 12),$utf8)
Write-Output 'Authored three candidate sheets; runtime metadata unchanged.'
