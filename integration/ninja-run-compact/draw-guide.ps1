$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Drawing
$source=Split-Path $MyInvocation.MyCommand.Path -Parent
$data=Get-Content -LiteralPath (Join-Path $source 'pose-guide.json') -Raw -Encoding UTF8|ConvertFrom-Json
$img=[System.Drawing.Bitmap]::new(1536,960)
$g=[System.Drawing.Graphics]::FromImage($img);$g.Clear([System.Drawing.Color]::FromArgb(20,35,55));$g.SmoothingMode=[System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$far=[System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(85,105,130),27);$near=[System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(154,171,192),31);$shin=[System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(182,194,209),17);$arm=[System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(184,151,116),24);$gauntlet=[System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(171,185,203),17);$axis=[System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(240,126,86),2)
foreach($pose in $data.poses){$ox=($pose.frame%4)*384;$oy=[int][Math]::Floor($pose.frame/4)*320;$h=$pose.hip;$sh=$pose.shoulder;$by=$h[1]-165
$g.DrawLine([System.Drawing.Pens]::SlateGray,($ox+65),($oy+289),($ox+330),($oy+289))
foreach($side in @('left','right')){$leg=$pose.$side;$p=if($side -eq 'left'){$far}else{$near};$g.DrawLine($p,[single]($ox+$h[0]),[single]($oy+$h[1]),[single]($ox+$leg.knee[0]),[single]($oy+$leg.knee[1]));$g.DrawLine($shin,[single]($ox+$leg.knee[0]),[single]($oy+$leg.knee[1]),[single]($ox+$leg.ankle[0]),[single]($oy+$leg.ankle[1]));$g.FillRectangle([System.Drawing.Brushes]::Gray,[single]($ox+$leg.ankle[0]-8),[single]($oy+$leg.ankle[1]+1),26,13)}
$torso=@([System.Drawing.PointF]::new(($ox+$h[0]-23),($oy+$h[1]-7)),[System.Drawing.PointF]::new(($ox+$h[0]+25),($oy+$h[1]+8)),[System.Drawing.PointF]::new(($ox+$sh[0]+30),($oy+$sh[1]+7)),[System.Drawing.PointF]::new(($ox+$sh[0]-25),($oy+$sh[1]-13)))
$g.FillPolygon([System.Drawing.Brushes]::DimGray,$torso);$g.DrawLine($axis,[single]($ox+$h[0]),[single]($oy+$h[1]),[single]($ox+$sh[0]),[single]($oy+$sh[1]));$g.FillEllipse([System.Drawing.Brushes]::LightSlateGray,($ox+225),($oy+48+$by),44,48)
$g.DrawLine($arm,($ox+213),($oy+112+$by),($ox+165),($oy+88+$by));$g.DrawLine($gauntlet,($ox+165),($oy+88+$by),($ox+204),($oy+75+$by));$g.FillRectangle([System.Drawing.Brushes]::Gray,($ox+204),($oy+63+$by),18,22);$g.DrawLine([System.Drawing.Pens]::Gold,($ox+216),($oy+44+$by),($ox+216),($oy+86+$by))
$g.DrawLine($arm,($ox+235),($oy+110+$by),($ox+239),($oy+140+$by));$g.DrawLine($gauntlet,($ox+239),($oy+140+$by),($ox+265),($oy+135+$by));$g.FillEllipse([System.Drawing.Brushes]::Gray,($ox+259),($oy+128+$by),17,17)
}
$g.Dispose();$img.Save((Join-Path $source 'mechanics-guide.png'));$img.Dispose();foreach($p in @($far,$near,$shin,$arm,$gauntlet,$axis)){$p.Dispose()}
$old=[System.Drawing.Bitmap]::new((Join-Path $source 'old-run-reference.png'));$flat=[System.Drawing.Bitmap]::new(1536,640);$fg=[System.Drawing.Graphics]::FromImage($flat);$fg.Clear([System.Drawing.Color]::FromArgb(20,35,55));$fg.DrawImageUnscaled($old,0,0);$fg.Dispose();$flat.Save((Join-Path $source 'production-run-reference.png'));$flat.Dispose();$old.Dispose()
