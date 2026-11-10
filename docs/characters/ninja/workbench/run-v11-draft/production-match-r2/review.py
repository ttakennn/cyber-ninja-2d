import hashlib
import json
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw
import sys
sys.path.insert(0,r'C:\Users\anhthaitrong\.codex\skills\generate2dsprite\scripts')
import forge_palette

R=Path(__file__).resolve().parent
old=R.parent
project=old.parents[4]
production=project/'docs/characters/ninja/animation/locomotion'
ref=Image.open(production/'flame-ninja-atlas.png').convert('RGBA')
meta=json.loads((production/'animations.json').read_text(encoding='utf-8'))
new=[Image.open(R/f'frames/frame-{i:02d}.png').convert('RGBA') for i in range(1,25)]
warnings=[]
qc=json.loads((R/'qc/appearance/sheet-qc.json').read_text(encoding='utf-8'))
for c in qc['checks']:
    if c['status'] in ['warn','fail']:
        warnings.append({'file':'qc/appearance/sheet-qc.json',**c})
checks=[]
for i,im in enumerate(new):
    a=np.array(im);edge=np.concatenate([a[0,:,3],a[-1,:,3],a[:,0,3],a[:,-1,3]])
    checks.append({'frame':i+1,'size':list(im.size),'mode':im.mode,'edgeSolidPixels':int((edge>16).sum()),
                   'transparentPixels':int((a[...,3]==0).sum()),'visiblePixels':int((a[...,3]>16).sum())})
assert all(c['size']==[384,320] and c['edgeSolidPixels']==0 and c['transparentPixels']>0 for c in checks)
assert np.array_equal(np.array(new[0]),np.array(Image.open(old/'frames/frame-01.png')))
for name,start,end,cols in [('run_start',0,6,3),('run_loop',6,24,6)]:
    atlas=Image.open(R/(name+'.png'))
    for j,n in enumerate(range(start,end)):
        crop=atlas.crop(((j%cols)*384,(j//cols)*320,(j%cols+1)*384,(j//cols+1)*320))
        assert np.array_equal(np.array(crop),np.array(new[n]))
color_source=json.loads((R/'qc/color-transfer.json').read_text(encoding='utf-8'))
assert hashlib.sha256((production/'flame-ninja-atlas.png').read_bytes()).hexdigest()==color_source['sourceSha256']
canvas=Image.new('RGB',(1152,350*6),(235,235,231));d=ImageDraw.Draw(canvas)
for row,n in enumerate([6,8,10,15,18,23]):
    f=meta['clips']['run']['frames'][row]
    approved=ref.crop((f['x'],f['y'],f['x']+384,f['y']+320))
    for col,(im,label) in enumerate([(approved,'RUN PRODUCTION'),(Image.open(old/f'frames/frame-{n+1:02d}.png').convert('RGBA'),f'OLD {n+1:02d}'),(new[n],f'R2 {n+1:02d}')]):
        canvas.paste(im,(col*384,row*350),im);d.line((col*384,row*350+289,col*384+383,row*350+289),fill=(70,130,140));d.text((col*384+8,row*350+325),label,fill=(40,40,40))
canvas.save(R/'run-production-comparison.png')
report={'status':'DRAFT_USER_REVIEW_PENDING','art_source':'host_image','route':'host:image_gen','model':'host tool does not disclose',
        'approved':False,'scope':'Appearance correction02–24: anatomy, exposure, color, texture. Frame01 preserved.',
        'timing':{'run_start':{'frames':6,'fps':10,'durationMs':600},'run_loop':{'frames':18,'fps':20,'durationMs':900}},
        'checks':checks,'productionUnchanged':True,'frame01ExactRGBA':True,'atlasRoundtripExactFrames':24,
        'warningsVerbatim':warnings,'colorMethod':color_source['method'],
        'visualLimits':['R2 is visibly narrower/darker and less glossy than V11; not a pixel-identical repaint of production.',
                        'Eye slit, cloth folds, sword hilt and some limb widths remain generated details and require user review.',
                        'Pose sequence is retained, but image regeneration is not a guarantee of exactly identical joints.',
                        'Head QA compares relative scale to median and cannot prove master anatomy.',
                        'No new gait approval, browser playback, production promotion or runtime integration.']}
(R/'qc-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
md=['# V11 · Sửa ngoại hình theo production · R2','',
    '**DRAFT — chờ người dùng xem; chưa chốt production.**','',
    '- Đã sửa artwork02–24 bằng host image_gen từ đúng PNG production; frame01 giữ nguyên RGBA.',
    '- Giảm vai/bắp tay phồng, sửa tỷ lệ đầu/thân và màu da, đưa lại texture vải/giáp theo production. Không dùng hệ số brightness chung lên cả ảnh.',
    '- Mẫu màu lấy trực tiếp từ atlas locomotion production, dùng một bộ đường cong OKLab theo nhóm vật liệu trên toàn23frame; alpha giữ nguyên. Quy tắc và mẫu ghi ở qc/color-transfer.json.',
    '- Canvas384×320/pivot(192,289), cùng scale0.96 cho mọi pose mới; chỉ khai báo root theo hàng để xử lý độ lệch bố cục ảnh trả về. Không fit bbox từng frame.',
    '- Giữ24frame: run_start6×100ms=600ms; run_loop18×50ms=900ms. Giữ hướng phải và thứ tự pose.',
    '- Đã mở contact sheet24frame, bảng production/cũ/mới và frame riêng. Bản sửa gần hơn về màu và độ sáng, nhưng không tuyên bố khớp100% texture/anatomy: mắt, nếp vải, cán kiếm và một số bề rộng chi vẫn là ảnh tạo mới.',
    '- Đã kiểm tra ảnh cần thiết:24RGBA đúng kích thước/alpha;0pixel solid chạm biên;0pixel cắt khi đăng ký;24crop atlas khớpPNG; frame01 khớpRGBA gốc; hash atlas production giữ nguyên. Forge clip builder0lint warnings, needs-visual-review.', '',
    '## WARN/FAIL nguyên văn','']
for w in warnings:md+=['```json',json.dumps(w,ensure_ascii=False),'```','']
md+=['## Tệp xem lại','',
     '- preview.html: chọn start/loop/ghép và tua từng frame.',
     '- contact-sheet.png:24frame trên cùng nền sáng để so màu.',
     '- production-comparison.png:Idle production / V11 cũ / R2 ở cùng pixel scale.',
     '- run-production-comparison.png:Run production / V11 cũ / R2; pose khác nhau, không dùng bbox cả người để suy scale.',
     '- forge-clips/review/:onion, filmstrip nền sáng/tối/checker.',
     '- frames/, run_start.png, run_loop.png, GIF, animation-timing.json và metadata runtime giữ contract.', '',
     'Chưa chạy browser/test/build/lint/typecheck/formatter. Không thay production, code nguồn, loader hoặc public/assets; không commit. V11 cũ giữ nguyên, chỉ có bảnR2 mới trong thư mục này. Quy trìnhảnh-only, khôngvideo/API.']
(R/'QC.md').write_text('\n'.join(md),encoding='utf-8')
print(json.dumps({'technical':'pass','visual':'user-review-pending','warnings':warnings},ensure_ascii=False))
