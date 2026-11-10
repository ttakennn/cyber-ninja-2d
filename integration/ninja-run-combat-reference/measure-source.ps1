param([string]$Image='run-arm-source.png')
$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Drawing
Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @'
using System;using System.Drawing;public class RunMeasure53{public static int[] Read(Bitmap b){int floor=0,lo=b.Width,hi=0;for(int y=b.Height/2;y<b.Height;y++)for(int x=0;x<b.Width;x++)if(b.GetPixel(x,y).A>128)floor=Math.Max(floor,y);int by=0,bx=0,best=0;for(int y=(int)(b.Height*.46);y<b.Height*.65;y++){int start=-1;for(int x=(int)(b.Width*.30);x<b.Width*.70;x++){var c=b.GetPixel(x,y);bool red=c.A>128&&c.R>85&&c.R>1.8*c.G&&c.R>1.8*c.B;if(red&&start<0)start=x;if((!red||x==(int)(b.Width*.70)-1)&&start>=0){int len=x-start;if(len>=26&&(start+x)/2>b.Width*.41){if(by==0){by=y;bx=(start+x)/2;best=len;}break;}start=-1;}}if(by!=0)break;}for(int y=floor-3;y<=floor;y++)for(int x=0;x<b.Width;x++)if(b.GetPixel(x,y).A>128){lo=Math.Min(lo,x);hi=Math.Max(hi,x);}return new[]{floor,lo,hi,bx,by,best};}}
'@
$basePath=Split-Path $PSScriptRoot -Parent
$src53=[System.Drawing.Bitmap]::new((Join-Path $basePath ('ninja-run-combat-reference/'+$Image)))
$res53=for($i53=0;$i53 -le 12;$i53++){$col53=$i53%4;$row53=[int][Math]::Floor($i53/4);$x53=[int][Math]::Floor($col53*$src53.Width/4);$y53=[int][Math]::Floor($row53*$src53.Height/4);$x253=[int][Math]::Floor(($col53+1)*$src53.Width/4);$y253=[int][Math]::Floor(($row53+1)*$src53.Height/4);$cell53=$src53.Clone([System.Drawing.Rectangle]::new($x53,$y53,($x253-$x53),($y253-$y53)),[System.Drawing.Imaging.PixelFormat]::Format32bppArgb);$m53=[RunMeasure53]::Read($cell53);$cell53.Dispose();@{slot=$i53;sourceRect=@($x53,$y53,($x253-$x53),($y253-$y53));floor=$m53[0];soleSpan=@($m53[1],$m53[2]);beltAnchor=@($m53[3],$m53[4]);redRunLength=$m53[5]}}
[System.IO.File]::WriteAllText((Join-Path $PSScriptRoot 'source-measurements.json'),($res53|ConvertTo-Json -Depth 5),[System.Text.UTF8Encoding]::new($false))
$res53|ConvertTo-Json -Depth 5 -Compress
$src53.Dispose()
