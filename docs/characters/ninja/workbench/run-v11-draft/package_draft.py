"""Local image-only keying, fixed-transform registration and review packaging."""
import hashlib
import json
import shutil
import sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent
FORGE = Path(r'C:\Users\anhthaitrong\.codex\skills\generate2dsprite\scripts')
sys.path.insert(0, str(FORGE))
import forge_matte

GENERATED = Path(r'C:\Users\anhthaitrong\.codex\generated_images\01a1c39e-9ef1-79d0-a195-68636701e833')
sources = ['exec-64699477-fbf9-4771-8104-d91e86033c74.png',
           'exec-8b81e525-7f75-4ac7-82c0-1310210a2bac.png',
           'exec-935ce5e5-fc12-48fa-bd82-637be40f2a3c.png',
           'exec-187b6b9c-25a7-4481-8ef7-f8678693f926.png']
earlier = ['exec-584830f9-2839-49a9-bce7-e2484439b753.png',
           'exec-ff2c4e3f-031f-4100-86de-c76ce5fa29e6.png',
           'exec-196733ac-63a4-4995-904d-fda0bfc20d3d.png']
for i, name in enumerate(earlier):
    shutil.copy2(GENERATED / name, ROOT / 'raw' / f'rejected-source-{i}.png')

frames_dir = ROOT / 'frames'
frames_dir.mkdir()
plan = json.loads((ROOT / 'pose-plan.json').read_text(encoding='utf-8'))
# Match the existing runtime's uniform-per-clip FPS without changing its loader.
for item in plan['frames'][:6]:
    item['durationMs'] = 100
plan['clips']['run_start']['durationMs'] = 600
plan['timingDecision'] = 'Final draft start: six100ms frames at10FPS (600ms), replacing the initial560ms variable proposal so loader v1 can play exact timing. Loop20FPS/900ms unchanged.'
records, images, matte = [], [], []
# One common normalization for ALL generated poses: standing source285-ish to251.
# Source reference frame00 is284px tall; no per-frame bbox fitting is performed.
scale = 251 / 284
row_roots = [[398,392],[414,414],[414,400],[414,416]]
for group, name in enumerate(sources):
    raw = Image.open(GENERATED / name).convert('RGBA')
    assert raw.size == (1536,1024), raw.size
    shutil.copy2(GENERATED / name, ROOT / 'raw' / f'group-{group}.png')
    keyed, info = forge_matte.key_still(raw, quality='soft', key='magenta')
    keyed = Image.fromarray(np.asarray(keyed,dtype=np.uint8), 'RGBA')
    keyed.save(ROOT / 'raw' / f'group-{group}-keyed.png')
    matte.append({'group':group,'report':info})
    for local in range(6):
        n = group*6+local
        row, col = divmod(local,3)
        cell = keyed.crop((col*512,row*512,(col+1)*512,(row+1)*512))
        # Premultiplied LANCZOS: same size/scale for all source cells.
        size = round(512*scale)
        reduced = cell.convert('RGBa').resize((size,size),Image.Resampling.LANCZOS).convert('RGBA')
        dx = 192-round(256*scale)
        dy = 289-round(row_roots[group][row]*scale)
        out = Image.new('RGBA',(384,320))
        out.alpha_composite(reduced,(dx,dy))
        before = int((np.asarray(reduced)[...,3]>16).sum())
        after = int((np.asarray(out)[...,3]>16).sum())
        if n == 0:
            out = Image.open(ROOT / 'references/idle.png').convert('RGBA')
        path = frames_dir / f'frame-{n+1:02d}.png'
        out.save(path)
        images.append(out)
        a=np.asarray(out)[...,3]
        yy,xx=np.where(a>16)
        records.append({**plan['frames'][n], 'file':str(path.relative_to(ROOT)),
                        'bbox':[int(xx.min()),int(yy.min()),int(xx.max()+1),int(yy.max()+1)],
                        'source':f'raw/group-{group}.png', 'sharedScale':scale if n else 1,
                        'translation':[dx,dy], 'sourceRoot':[256,row_roots[group][row]],
                        'clippedSolidPixels':max(0,before-after) if n else 0,
                        'status':'EXACT_PRODUCTION_COPY' if n==0 else 'DRAFT_NEEDS_REVIEW',
                        'sha256':hashlib.sha256(path.read_bytes()).hexdigest()})

def atlas(name,indices,cols):
    im=Image.new('RGBA',(384*cols,320*((len(indices)+cols-1)//cols)))
    for j,n in enumerate(indices): im.alpha_composite(images[n],((j%cols)*384,(j//cols)*320))
    im.save(ROOT / name)
atlas('run_start.png',range(6),3)
atlas('run_loop.png',range(6,24),6)
sheet=Image.new('RGB',(384*6,350*4),(237,237,232))
d=ImageDraw.Draw(sheet)
for n,im in enumerate(images):
    x=(n%6)*384; y=(n//6)*350
    if n//6%2: d.rectangle((x,y,x+383,y+349),fill=(36,39,46))
    sheet.paste(im,(x,y),im)
    d.line((x,y+289,x+383,y+289),fill=(100,145,150))
    d.line((x+188,y+289,x+196,y+289),fill=(255,80,0),width=2)
    d.text((x+8,y+324),f'{n+1:02d} {plan["frames"][n]["label"]}',fill=(180,90,50))
sheet.save(ROOT / 'contact-sheet.png')

def preview(name,indices,durations,loop):
    composite=[]
    for n in indices:
        bg=Image.new('RGB',(384,320),(36,39,46)); bg.paste(images[n],(0,0),images[n]); composite.append(bg)
    composite[0].save(ROOT/name,save_all=True,append_images=composite[1:],duration=durations,loop=loop,optimize=False,disposal=2)
preview('run_start.gif',list(range(6)),[f['durationMs'] for f in records[:6]],1)
preview('run_loop.gif',list(range(6,24)),[50]*18,0)
preview('combined.gif',list(range(6))+list(range(6,24))*3,[f['durationMs'] for f in records[:6]]+[50]*54,0)

manifest={'schema':'generate2dsprite.animation_clips.v2','frames':[r['file'] for r in records],
          'anchor_px':[192,289], 'sampling':'linear','pixel_art':False,'art_source':'host_image',
          'body_height_px':251,'clips':{
              'run_start':{'frames':list(range(6)),'duration_ms':[r['durationMs'] for r in records[:6]],'loop_policy':'oneshot'},
              'run_loop':{'frames':list(range(6,24)),'ticks':3,'loop_policy':'cycle'}}}
(ROOT/'clips-input.json').write_text(json.dumps(manifest,indent=2),encoding='utf-8')
runtime={}
for name,indices,cols in [('run_start',list(range(6)),3),('run_loop',list(range(6,24)),6)]:
    runtime[name]={'version':1,'kind':'development','image':name+'.png','filter':'linear',
        'frameWidth':384,'frameHeight':320,'columns':cols,
        'visual':{'width':2.4,'height':2,'offset':{'x':0,'y':0},'scale':{'x':1,'y':1},'anchor':{'x':.5,'y':0}},
        'clips':{name:{'fps':20,'loop':name=='run_loop','frames':[
            {'x':(j%cols)*384,'y':(j//cols)*320,'width':384,'height':320,'sourceWidth':384,'sourceHeight':320,
             'offsetX':0,'offsetY':0,'pivot':{'x':192,'y':289}} for j in range(len(indices))]}}}
    if name=='run_start':
        runtime[name]['clips'][name]['fps']=10
    (ROOT/(name+'-runtime.json')).write_text(json.dumps(runtime[name],indent=2),encoding='utf-8')
(ROOT/'animation-timing.json').write_text(json.dumps({**plan,'frames':records,'registration':{'scale':scale,'perFrameFit':False,'rowSourceRoots':row_roots,'method':'one global scale, declared row roots; no per-frame foot locking'}},indent=2),encoding='utf-8')
(ROOT/'qc/matte-reports.json').write_text(json.dumps(matte,indent=2,default=str),encoding='utf-8')
print(json.dumps({'frames':24,'size':[384,320],'scale':scale,'clippedSolidPixels':sum(r['clippedSolidPixels'] for r in records)}))
