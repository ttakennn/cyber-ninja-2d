$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Drawing
Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @'
using System;
using System.Drawing;
public class SpriteMeasure38 {
  public static string Bounds(Bitmap b,int ox,int oy,int w,int h,int lx,int ly,int rx,int ry,bool dark){
    int minX=w,minY=h,maxX=-1,maxY=-1;
    for(int y=ly;y<Math.Min(h,ry);y++)for(int x=lx;x<Math.Min(w,rx);x++){
      var c=b.GetPixel(ox+x,oy+y);
      if(c.A<180 || (dark && (c.R>85 || c.G>85 || c.B>90)))continue;
      minX=Math.Min(minX,x);minY=Math.Min(minY,y);maxX=Math.Max(maxX,x);maxY=Math.Max(maxY,y);
    }
    return minX+","+minY+".."+maxX+","+maxY+" w="+(maxX-minX+1)+" h="+(maxY-minY+1);
  }
}
'@
$repo=Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
$original=[System.Drawing.Bitmap]::new((Join-Path $repo 'integration/ninja-run-hurt-revision/idle-reference.png'))
Write-Output ('original hood '+[SpriteMeasure38]::Bounds($original,0,0,384,320,180,38,245,58,$true))
$original.Dispose()
foreach($name in 'idle','run'){
  $b=[System.Drawing.Bitmap]::new((Join-Path $PSScriptRoot ($name+'-source.png')));$rows=if($name -eq 'idle'){4}else{3}
  Write-Output "$name $($b.Width)x$($b.Height)"
  $w=[int][Math]::Floor($b.Width/4);$h=[int][Math]::Floor($b.Height/$rows)
  if($name -eq 'idle'){Write-Output ('hood '+[SpriteMeasure38]::Bounds($b,0,0,$w,$h,180,21,245,41,$true))}
  else{Write-Output ('hood '+[SpriteMeasure38]::Bounds($b,0,0,$w,$h,222,52,290,72,$true))}
  for($i=0;$i -lt 4*$rows;$i++){
    $col=$i%4;$row=[int][Math]::Floor($i/4);$x=[int][Math]::Floor($b.Width*$col/4);$y=[int][Math]::Floor($b.Height*$row/$rows)
    Write-Output ("pose$i "+[SpriteMeasure38]::Bounds($b,$x,$y,$w,$h,0,0,$w,$h,$false))
  }
  $b.Dispose()
}
