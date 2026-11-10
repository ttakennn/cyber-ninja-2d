"""Record visual decisions and exact machine warnings; never approve the draft."""
import hashlib
import json
import shutil
import subprocess
import sys
from pathlib import Path
import numpy as np
from PIL import Image

ROOT=Path(__file__).resolve().parent
FORGE=Path(r'C:\Users\anhthaitrong\.codex\skills\generate2dsprite\scripts')
data=json.loads((ROOT/'animation-timing.json').read_text(encoding='utf-8'))
(ROOT/'review-data.js').write_text('window.RUN_V11 = '+json.dumps(data,ensure_ascii=False)+';\n',encoding='utf-8')
reports=[]
for i in range(4):
    args=[sys.executable,str(FORGE/'sheet_qc.py'),'spill','--input',str(ROOT/f'raw/group-{i}-keyed.png'),
          '--rows','2','--cols','3','--output-dir',str(ROOT/f'qc/spill-{i}')]
    r=subprocess.run(args,capture_output=True,text=True,encoding='utf-8')
    reports.append({'tool':'sheet_qc spill','group':i,'exit':r.returncode,'stdout':r.stdout,'stderr':r.stderr})
args=[sys.executable,str(FORGE/'sheet_qc.py'),'frames','--frames',*[str(ROOT/f'frames/frame-{i:02d}.png') for i in range(1,7)],
      '--no-loop','--cycle','none','--master',str(ROOT/'references/idle.png'),'--output-dir',str(ROOT/'qc/run-start')]
r=subprocess.run(args,capture_output=True,text=True,encoding='utf-8')
reports.append({'tool':'sheet_qc frames start','exit':r.returncode,'stdout':r.stdout,'stderr':r.stderr})
(ROOT/'qc/command-results.json').write_text(json.dumps(reports,indent=2),encoding='utf-8')
shutil.copy2(ROOT/'forge-clips/review/onion-00.png',ROOT/'onion-run_start.png')
shutil.copy2(ROOT/'forge-clips/review/onion-01.png',ROOT/'onion-run_loop.png')

rgba=[Image.open(ROOT/r['file']).convert('RGBA') for r in data['frames']]
checks=[]
for i,im in enumerate(rgba):
    a=np.asarray(im)[...,3]
    checks.append({'frame':i+1,'mode':im.mode,'size':list(im.size),'alphaZero':int((a==0).sum()),
                   'alphaVisible':int((a>16).sum()),'edgeSolidPixels':int((a[0]>16).sum()+(a[-1]>16).sum()+(a[:,0]>16).sum()+(a[:,-1]>16).sum())})
for name,seq,cols in [('run_start',range(6),3),('run_loop',range(6,24),6)]:
    atlas=Image.open(ROOT/(name+'.png')).convert('RGBA')
    for j,n in enumerate(seq):
        tile=atlas.crop(((j%cols)*384,(j//cols)*320,(j%cols+1)*384,(j//cols+1)*320))
        assert np.array_equal(np.asarray(tile),np.asarray(rgba[n]))
assert np.array_equal(np.asarray(rgba[0]),np.asarray(Image.open(ROOT/'references/idle.png')))
assert all(r['size']==[384,320] and r['alphaZero']>0 and r['alphaVisible']>0 and r['edgeSolidPixels']==0 for r in checks)
gif=[]
for im in rgba[:6]:
    bg=Image.new('RGB',(384,320),(36,39,46)); bg.paste(im,(0,0),im); gif.append(bg)
gif[0].save(ROOT/'run_start-once.gif',save_all=True,append_images=gif[1:],duration=[100]*6,optimize=False,disposal=2)
gifchecks=[]
for name in ['run_start-once.gif','run_loop.gif','combined.gif']:
    im=Image.open(ROOT/name); durations=[]
    for i in range(im.n_frames):
        im.seek(i);durations.append(im.info.get('duration'))
    gifchecks.append({'file':name,'decodedFrames':im.n_frames,'durationMs':sum(durations),'frameDurations':durations})

warnings=[]
for path in sorted((ROOT/'qc').glob('*/sheet-qc.json')):
    q=json.loads(path.read_text(encoding='utf-8'))
    for c in q.get('checks',[]):
        if c.get('status') in ['warn','warning','fail','failed']:
            warnings.append({'file':str(path.relative_to(ROOT)),**c})
matte=json.loads((ROOT/'qc/matte-reports.json').read_text(encoding='utf-8'))
matte_summary=[{'group':r['group'],'qa':r['report'].get('qa')} for r in matte]
perframe=[]
for n in range(1,25):
    issues=[]
    if n>1: issues.append('Generated musculature, face/eye rendering and smoother cloth differ from exact production texture; identity/scale lock not proven.')
    if n==3: issues.append('Raised hand approaches handle but transition02->03 remains large.')
    if n in [6,7]:issues.append('Start-to-loop upper-body size/placement discontinuity; requires local redrawing.')
    if n>=7:issues.append('Torso lean appears less than target30degrees; torso/holding arm too static, slight intergroup drift.')
    if n>=13:issues.append('Opposite-leg half-cycle still ambiguous after targeted edit; do not accept gait alternation.')
    if n in [13,16,19,24]:issues.append('Inspect adjacent-group join / loop seam and foot clearance; actual generated pose does not necessarily match planned phase.')
    perframe.append({'frame':n,'status':'REFERENCE_ONLY' if n==1 else 'REJECTED_FOR_ACCEPTANCE', 'issues':issues})
qc={'status':'DRAFT_REJECTED_FOR_PRODUCTION','visualApproval':False,'technicalChecks':checks,
    'atlasRoundTrip':'24 exact RGBA matches','idleProductionCopy':'exact RGBA match','gifDecoded':gifchecks,
    'warningsVerbatim':warnings,'matte':matte_summary,'perFrameVisualReview':perframe,
    'limitations':['All frames inspected in contact sheet and source groups. This is not proof of physically accurate gait.',
                   'No browser playback or actual in-game travel/foot-slide validation performed.',
                   '24frames delivered as diagnostic draft; rejected poses retained for review, not silently approved.']}
(ROOT/'qc-report.json').write_text(json.dumps(qc,ensure_ascii=False,indent=2),encoding='utf-8')
lines=['# Run V11 — QC bản nháp','', '**DRAFT — CHƯA DUYỆT. Không đủ điều kiện thay production.**','',
       '24 PNG RGBA384×320, pivot(192,289); run_start6frame×100ms=600ms, run_loop18frame×50ms=900ms/20FPS. Tạo bằng host image_gen; không video/API. Frame01 là pixel production gốc. Các frame mới dùng cùng scale251/284, không fit bbox từng frame; row roots được ghi trong animation-timing.json. Scale chung không bảo đảm mô hình giữ tỷ lệ anatomy.', '',
       '## Kết quả kiểm tra ảnh', '',
       '- 24frame đúng mode/kích thước, có alpha thật, không pixel solid chạm biên.',
       '- 24crop atlas khớp RGBA tuyệt đối với frame nguồn; frame01 khớp Idle production.',
       '- Forge clip builder:0lint warnings, preview WebP được tool giải mã kiểm tra; trạng thái vẫn needs-visual-review.',
       '- Nguồn nền/quầng đầu tiên bị loại, đã sửa cục bộ thành chroma rồi key mềm bằng Forge. Nhóm giữa được sửa riêng leg depth. Các nguồn trước được giữ trong raw/.','',
       '## Lỗi thị giác còn lại — không chấp nhận các pose02–24', '',
       '- Texture/tạo khối mới mượt hơn production; vai và bắp tay phồng, tỷ lệ đầu/thân chưa giữ chính xác. Đặc biệt rõ ở06→07.',
       '- Góc thân khi chạy chưa đạt chắc chắn30°; nửa thân trên và tay giữ kiếm quá tĩnh, xoay vai/hông chưa đủ.',
       '- Nửa chu kỳ chân đối bên13–24 còn mơ hồ dù đã chỉnh riêng; contact/flight thực tế có chỗ không khớp nhãn kế hoạch.',
       '- Có nhảy pose ở ranh nhóm; khăn đổi shape theo nhóm. Vòng24→07 vẫn cần chỉnh biên độ chân và timing sau khi sửa anatomy.',
       '- Chưa chứng minh chân không trượt khi di chuyển. Không dùng gán pivot làm bằng chứng chân trụ ổn định.',
       '- Không tự duyệt bàn tay/grip chỉ dựa QC số; cần đối chiếu phóng lớn reference10.51 trước khi chốt.', '',
       '## WARN/FAIL nguyên văn từ QA', '']
for w in warnings:lines.extend(['```json',json.dumps(w,ensure_ascii=False),'```',''])
lines += ['## Bàn giao / giới hạn','',
          'preview.html có chọn start/loop/ghép, tua từng frame, nền sáng/tối/checker, tốc độ và onion-skin. Mở trực tiếp file cục bộ; review-data.js tránh fetch JSON qua file://. Chưa chạy browser để xác minh UI. GIF chuẩn start là run_start-once.gif; run_start.gif giữ bản thử lặp trước đó. run_loop.gif và combined.gif có lặp.', '',
          'run_start-runtime.json và run_loop-runtime.json theo loader hiện tại, kind development; không tích hợp. Canonical PNG/JSON, loader, physics và code production không thay. Không build/lint/typecheck/test/commit. Tất cả file mới trong workbench này theo brief, không ghi báo cáo ngoài thư mục đã chỉ định.', '',
          'Image-only dễ lệch anatomy/texture, mất phân biệt chân gần/xa; các thông số pose là ý định prompt, không phải bằng chứng hình đã đạt. Cần chỉnh cục bộ anatomy/grip/pha chân còn lỗi trước khi xin duyệt production.']
(ROOT/'QC.md').write_text('\n'.join(lines),encoding='utf-8')
provenance={'route':'host:image_gen','art_source':'host_image','apiCalls':False,'videoGeneration':False,
            'model':'not exposed by host tool','cost':'not exposed; host subscription route',
            'initialPrompts':'prompts/group-0.txt through group-3.txt; final calls additionally imposed flat magenta and used preceding group as continuity reference',
            'attempts':['group0 initial:alpha/glow rejected','group0 scale/background edit:halo remained rejected','group0 flat-magenta edit:selected draft source',
                        'group1 six loop poses:selected draft source','group2 six continuation poses:near/far unclear, rejected original',
                        'group2 targeted leg-depth edit:selected for diagnostic draft, gait still not approved','group3 six final loop poses:selected diagnostic draft'],
            'files':[{'file':str(p.relative_to(ROOT)),'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in sorted((ROOT/'raw').glob('*.png'))]}
(ROOT/'provenance.json').write_text(json.dumps(provenance,indent=2),encoding='utf-8')
print(json.dumps({'frames':24,'technical':'pass','visual':'rejected_for_acceptance','warnings':len(warnings),'gif':gifchecks},ensure_ascii=False))
