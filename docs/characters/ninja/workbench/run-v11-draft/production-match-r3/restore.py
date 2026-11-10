from pathlib import Path
import json, shutil, hashlib
import numpy as np
from PIL import Image, ImageDraw

r=Path(__file__).resolve().parent
old=r.parent/'production-match-r2'
base=r.parent.parents[1]/'animation'
def source(folder,png,clip,i):
    meta=json.loads((base/folder/'animations.json').read_text())
    f=meta['clips'][clip]['frames'][i]
    x,y=f['x'],f['y']
    return Image.open(base/folder/png).convert('RGBA').crop((x,y,x+384,y+320))
idle=source('locomotion','flame-ninja-atlas.png','idle',0)
reach=source('combat-idle','combat-idle-atlas.png','combatEnter',0)
grip=source('combat-idle','combat-idle-atlas.png','combatIdle',0)
def belt(im):
    a=np.array(im).astype(float)
    red=(a[:,:,0]>1.9*a[:,:,1])&(a[:,:,0]>55)&(a[:,:,3]>180)
    sums=red[105:172,153:239].sum(axis=1)
    y=105+int(np.argmax(np.convolve(sums,np.ones(5),'same')))
    x=153+int(np.median(np.where(red[y,153:239])[0]))
    return x,y
(r/'frames').mkdir(exist_ok=True)
frames=[]
for n in range(1,25):
    p=old/f'frames/frame-{n:02}.png'
    im=Image.open(p).convert('RGBA')
    if 2<=n<=4:
        im=[source('locomotion','flame-ninja-atlas.png','idle',1),reach,grip][n-2]
    elif 5<=n<=24:
        x,y=([(190,160),(179,166)]+[(202,145)]*6+[(202,145)]*3+[(202,151)]*3+[(202,151)]*6)[n-5]; sx,sy=194,139
        # Keep original eye and hood pixels. Shear below the neckline around the belt.
        # Attach the production sash to the moving hips; retain the V11 leg phase.
        lift=[1,3,2,4,5,3,2,0,-2,-1,1,3,4,3,2,1,0,-1,0,1][n-5]
        join=sy+lift
        out=Image.new('RGBA',im.size)
        xx=np.arange(384); pixels=np.asarray(im)
        lower=np.zeros_like(pixels)
        for yy in range(join+1,320):
            start=y+np.clip((xx-x)*.19,-7,7)
            src=np.rint(start+(yy-join)*(289-start)/(289-join)).astype(int) if yy<=289 else np.full(384,yy)
            lower[yy]=pixels[src,xx]
            if n<=18 and yy<join+18:lower[yy,(xx>x+28)|(xx<x-48)]=0
        out=Image.fromarray(lower)
        for yy in range(150):
            shift=x-sx+round(min(sy-yy,sy-67)*(.08 if n==5 else .15))
            strip=grip.crop((0,yy,384,yy+1))
            if yy>sy:strip.paste((0,0,0,0),(149,0,221,1))
            out.alpha_composite(strip,(shift,yy+lift))
        im=out
    dest=r/f'frames/frame-{n:02}.png'
    if n==1:shutil.copyfile(p,dest)
    else:im.save(dest)
    frames.append(im)
def sheet(name,seq,cols,label=False):
    step=342 if label else 320
    result=Image.new('RGBA',(384*cols,step*((len(seq)+cols-1)//cols)),(238,237,232,255) if label else (0,0,0,0))
    for i,im in enumerate(seq):
        x=i%cols*384;y=i//cols*step;result.alpha_composite(im,(x,y))
        if label:ImageDraw.Draw(result).text((x+8,y+322),str(i+1).zfill(2),fill='black')
    result.save(r/name)
sheet('contact-sheet.png',frames,6,True)
sheet('run_start.png',frames[:6],3)
sheet('run_loop.png',frames[6:],6)
seq=frames+frames[6:]*2
preview=[]
for im in seq:
    bg=Image.new('RGB',im.size,'#303139');bg.paste(im,mask=im.getchannel('A'));preview.append(bg)
preview[0].save(r/'combined.gif',save_all=True,append_images=preview[1:],duration=[100]*6+[50]*(len(seq)-6),loop=0,disposal=2)
for name in ['run_start-runtime.json','run_loop-runtime.json']:shutil.copyfile(old/name,r/name)
