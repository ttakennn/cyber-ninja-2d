import hashlib
import json
import shutil
import sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw

ROOT=Path(__file__).resolve().parent
OLD=ROOT.parent
sys.path.insert(0,r'C:\Users\anhthaitrong\.codex\skills\generate2dsprite\scripts')
import forge_matte
import forge_palette

GEN=Path(r'C:\Users\anhthaitrong\.codex\generated_images\01a1c39e-9ef1-79d0-a195-68636701e833')
NAMES=['exec-3b3b983e-d941-42c6-bfcf-1967ed27d2f1.png','exec-dbadefca-12f2-4e76-8422-857ea5165237.png',
       'exec-36b48df0-cacf-4dff-9bca-18b6c2554600.png','exec-ed20cd86-441d-445e-84f9-1ea0d3f08bff.png']
SCALE=.96
ROOTS=[[353,353],[385,384],[365,358],[365,366]]
outframes=[]; matte=[]; geometry=[]
for g,name in enumerate(NAMES):
    shutil.copy2(GEN/name,ROOT/f'raw/group-{g}.png')
    raw=Image.open(GEN/name).convert('RGBA')
    assert raw.size==(1536,1024)
    keyed,info=forge_matte.key_still(raw,quality='soft',key='magenta')
    keyed=Image.fromarray(np.asarray(keyed,dtype=np.uint8))
    keyed.save(ROOT/f'raw/group-{g}-keyed.png')
    matte.append({'group':g,'report':info})
    for j in range(6):
        row,col=divmod(j,3)
        cell=keyed.crop((col*512,row*512,col*512+512,row*512+512))
        size=round(512*SCALE)
        cell=cell.convert('RGBa').resize((size,size),Image.Resampling.LANCZOS).convert('RGBA')
        dx=192-round(256*SCALE);dy=289-round(ROOTS[g][row]*SCALE)
        out=Image.new('RGBA',(384,320));out.alpha_composite(cell,(dx,dy))
        before=int((np.asarray(cell)[...,3]>16).sum());after=int((np.asarray(out)[...,3]>16).sum())
        if g==0 and j==0:out=Image.open(ROOT/'references/idle.png').convert('RGBA')
        outframes.append(np.array(out))
        geometry.append({'frame':g*6+j+1,'scale':SCALE,'sourceRoot':[256,ROOTS[g][row]],'translation':[dx,dy],
                         'clippedPixels':0 if g==0 and j==0 else before-after,'perFrameFit':False})

def material(rgb):
    a=np.asarray(rgb,dtype=float);r,g,b=a[...,0],a[...,1],a[...,2]
    cat=np.zeros(r.shape,dtype=np.uint8)
    cat[(r>g*1.35)&(r>b*1.25)&(r>35)]=1
    cat[(r>g*1.08)&(g>b*1.13)&(g/r.clip(1)>.48)&(r>55)]=2
    cat[(g/r.clip(1)>.74)&(b/g.clip(1)<.56)&(r>60)]=3
    return cat

# One shared material transfer across all23frames. No independent frame grading.
# Production samples are the actual approved locomotion atlas, not generated peers.
PRODUCTION=OLD.parents[4]/'docs/characters/ninja/animation/locomotion/flame-ninja-atlas.png'
ref=np.array(Image.open(PRODUCTION).convert('RGBA'))
ref_rgb=ref[ref[...,3]>=240,:3]
src_rgb=np.concatenate([a[a[...,3]>=240,:3] for a in outframes[1:]])
src_cat=material(src_rgb);ref_cat=material(ref_rgb)
src_lab=forge_palette.to_oklab(src_rgb);ref_lab=forge_palette.to_oklab(ref_rgb)
q=np.linspace(0,1,257);transfers=[]
for c,label in enumerate(['dark-cloth-metal','crimson','skin','gold']):
    s=src_lab[src_cat==c];t=ref_lab[ref_cat==c]
    sq=np.quantile(s,q,axis=0);tq=np.quantile(t,q,axis=0)
    transfers.append((sq,tq))

stats=[]
for i,a in enumerate(outframes):
    if i:
        active=a[...,3]>0;rgb=a[active,:3];cat=material(rgb);lab=forge_palette.to_oklab(rgb)
        for c,(sq,tq) in enumerate(transfers):
            m=cat==c
            for channel in range(3):
                x,unique=np.unique(sq[:,channel],return_index=True)
                lab[m,channel]=np.interp(lab[m,channel],x,tq[unique,channel])
        a[active,:3]=forge_palette.from_oklab(lab)
        a[a[...,3]==0,:3]=0
    im=Image.fromarray(a,'RGBA');im.save(ROOT/f'frames/frame-{i+1:02d}.png')
    stats.append({'frame':i+1,'opaquePixels':int((a[...,3]>=240).sum()),'rgba':True,'size':[384,320],
                  'productionCopy':i==0,'geometry':geometry[i]})

# Reuse only the old packaging code after artwork creation; it reads the new PNGs.
timing=json.loads((OLD/'animation-timing.json').read_text(encoding='utf-8'))
for i,f in enumerate(timing['frames']):
    f['file']=f'frames/frame-{i+1:02d}.png';f['status']='DRAFT_VISUAL_REVIEW_PENDING'
    f['source']=f'raw/group-{i//6}.png';f['registration']=geometry[i]
    f['sha256']=hashlib.sha256((ROOT/f['file']).read_bytes()).hexdigest()
timing['revision']='production-match-r2';timing['registration']={'sharedScale':SCALE,'perFrameFit':False,'rowRoots':ROOTS}
(ROOT/'animation-timing.json').write_text(json.dumps(timing,ensure_ascii=False,indent=2),encoding='utf-8')
(ROOT/'review-data.js').write_text('window.RUN_V11 = '+json.dumps(timing,ensure_ascii=False)+';',encoding='utf-8')
shutil.copy2(OLD/'preview.html',ROOT/'preview.html')
shutil.copy2(OLD/'clips-input.json',ROOT/'clips-input.json')
for name in ['run_start-runtime.json','run_loop-runtime.json']:shutil.copy2(OLD/name,ROOT/name)
images=[Image.fromarray(a) for a in outframes]
for name,start,end,cols in [('run_start',0,6,3),('run_loop',6,24,6)]:
    atlas=Image.new('RGBA',(cols*384,((end-start+cols-1)//cols)*320))
    for j,n in enumerate(range(start,end)):atlas.alpha_composite(images[n],((j%cols)*384,(j//cols)*320))
    atlas.save(ROOT/(name+'.png'))
def sheet(name,rows,cols):
    canvas=Image.new('RGB',(cols*384,len(rows)*350),(235,235,231));d=ImageDraw.Draw(canvas)
    for row,entries in enumerate(rows):
        for col,(im,label) in enumerate(entries):
            x=col*384;y=row*350;canvas.paste(im,(x,y),im)
            d.line((x,y+289,x+383,y+289),fill=(90,145,150))
            d.text((x+8,y+325),label,fill=(45,45,45))
    canvas.save(ROOT/name)
sheet('contact-sheet.png',[[ (images[i],f'Frame{i+1:02d}') for i in range(r*6,r*6+6)] for r in range(4)],6)
comparison=[]
prod=Image.open(ROOT/'references/idle.png').convert('RGBA')
for i in [1,3,6,12,18,23]:
    comparison.append([(prod,'PRODUCTION — native pixels'),(Image.open(OLD/f'frames/frame-{i+1:02d}.png').convert('RGBA'),f'V11 OLD {i+1:02d}'),(images[i],f'R2 {i+1:02d}')])
sheet('production-comparison.png',comparison,3)
for name,indices,loop in [('run_start-once.gif',list(range(6)),False),('run_loop.gif',list(range(6,24)),True),('combined.gif',list(range(6))+list(range(6,24))*3,True)]:
    seq=[]
    for i in indices:
        im=Image.new('RGB',(384,320),(36,39,46));im.paste(images[i],(0,0),images[i]);seq.append(im)
    kw={'loop':0} if loop else {}
    seq[0].save(ROOT/name,save_all=True,append_images=seq[1:],duration=[100 if i<6 else 50 for i in indices],optimize=False,disposal=2,**kw)
(ROOT/'qc/matte-reports.json').write_text(json.dumps(matte,indent=2),encoding='utf-8')
(ROOT/'qc/technical.json').write_text(json.dumps(stats,indent=2),encoding='utf-8')
(ROOT/'qc/color-transfer.json').write_text(json.dumps({'sourceAtlas':str(PRODUCTION),'sourceSha256':hashlib.sha256(PRODUCTION.read_bytes()).hexdigest(),
    'method':'Shared OKLab quantile curves per material over ALL23new frames; mapped to actual production locomotion samples. Alpha preserved. Exact original frame01 bypasses transfer.',
    'curves':[{'material':c,'source':s.tolist(),'production':t.tolist()} for c,(s,t) in enumerate(transfers)]},indent=2),encoding='utf-8')
print(json.dumps({'frames':24,'clipped':sum(x['clippedPixels'] for x in geometry),'sharedScale':SCALE}))
