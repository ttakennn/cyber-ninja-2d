"""Non-destructive preparation for the user-requested V11 draft."""
import json
import shutil
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent
PROJECT = ROOT.parents[4]
REF = ROOT / 'references'
REF.mkdir(exist_ok=True)
for name in ('raw', 'prompts', 'guides', 'qc'):
    (ROOT / name).mkdir(exist_ok=True)
motion = Path(r'C:\Users\ANHTHA~1\AppData\Local\Temp\codex-clipboard-aa686660-1d22-4f64-bf7b-f0b098cea39b.png')
shutil.copy2(motion, REF / 'motion-only-24.png')
for folder, image in [('locomotion', 'flame-ninja-atlas.png'), ('combat-idle', 'combat-idle-atlas.png')]:
    base = PROJECT / 'docs/characters/ninja/animation' / folder
    meta = json.loads((base / 'animations.json').read_text(encoding='utf-8'))
    atlas = Image.open(base / image).convert('RGBA')
    clips = ['idle'] if folder == 'locomotion' else ['combatEnter', 'combatIdle']
    for clip in clips:
        rect = meta['clips'][clip]['frames'][0]
        atlas.crop((rect['x'], rect['y'], rect['x']+384, rect['y']+320)).save(REF / (clip + '.png'))
    shutil.copy2(base / 'animations.json', REF / (folder + '-metadata.json'))

# Six 512px reference cells. The 384x320 production canvas is inset by (64,64).
# No source sprite is resized. A single scale of 1 is shared by the entire draft.
guide = Image.new('RGBA', (1536, 1024))
source = Image.open(REF / 'combatIdle.png')
for i in range(6):
    guide.alpha_composite(source, ((i % 3)*512+64, (i // 3)*512+64))
guide.save(ROOT / 'guides/exact-scale-6.png')
identity = Image.new('RGBA', (1152, 320))
for i, name in enumerate(['idle', 'combatEnter', 'combatIdle']):
    identity.alpha_composite(Image.open(REF / (name+'.png')), (i*384, 0))
identity.save(REF / 'production-identity.png')

poses = [
('Idle exact production', 'upright, both feet planted, right arm relaxed', 120, 'reference01'),
('Preparation', 'slight weight transfer, shoulder begins rising, feet remain planted', 100, 'reference02'),
('Reach', 'RIGHT anatomical arm lifts naturally to the handle behind head; lean 8 degrees', 100, 'reference03'),
('Grip', 'RIGHT hand grips handle like combatIdle reference; left fist before chest; lean 12 degrees', 100, 'reference04'),
('Anticipation', 'hips move forward, NEAR leg supports, FAR heel lifts; lean 22 degrees', 80, 'reference05'),
('Launch', 'FAR leg pushes backward, NEAR knee advances; lean 28 degrees', 60, 'reference06'),
('NEAR contact', 'NEAR foot lands just ahead of hip, FAR heel folds up behind', 50, 'reference07'),
('NEAR loading', 'NEAR knee flexes under weight, FAR knee starts moving forward', 50, 'reference08'),
('NEAR midstance', 'NEAR foot under hip, FAR knee passes the support knee', 50, 'reference09'),
('NEAR late stance', 'NEAR leg moves behind hip, FAR thigh comes forward', 50, 'reference10'),
('NEAR push', 'NEAR heel raises, NEAR toe pushes; FAR knee compact and forward', 50, 'reference11'),
('NEAR toe-off', 'NEAR toe leaves ground, FAR knee ahead; body rises 3px', 50, 'reference12'),
('Flight toward FAR', 'both feet clear ground 7px, NEAR knee folds behind, FAR shin opens', 50, 'reference13'),
('FAR descent', 'FAR foot descends under forward hip, NEAR heel tucks; clearance 4px', 50, 'reference14'),
('FAR precontact', 'FAR foot 1px above ground ahead of hip, NEAR knee tucked', 50, 'reference15'),
('FAR contact', 'FAR foot lands ahead of hip, NEAR heel folds up behind; opposite of frame07', 50, 'reference16'),
('FAR loading', 'FAR knee flexes under weight, NEAR knee starts moving forward', 50, 'reference17'),
('FAR midstance', 'FAR foot under hip, NEAR knee passes the support knee', 50, 'reference18'),
('FAR late stance', 'FAR leg behind hip, NEAR thigh advances', 50, 'reference19'),
('FAR push', 'FAR heel raises, FAR toe pushes, NEAR knee compact and forward', 50, 'reference20'),
('FAR toe-off', 'FAR toe leaves ground, NEAR knee advances; body rises 3px', 50, 'reference21'),
('Flight toward NEAR', 'both feet clear ground 7px, FAR knee folds behind, NEAR shin opens', 50, 'reference22'),
('NEAR descent', 'NEAR foot descends toward ground, FAR heel tucks; clearance 4px', 50, 'reference23'),
('NEAR precontact', 'NEAR foot 1px above ground ahead of hip, FAR knee tucked; continues into frame07', 50, 'reference24'),
]
plan = {'status':'DRAFT_NOT_APPROVED', 'art_source':'host_image', 'route':'host:image_gen',
        'canvas':[384,320], 'pivot':[192,289], 'bodyHeightReference':251, 'facing':'right',
        'sourceCell':[512,512], 'sourceCanvasInset':[64,64], 'sharedScale':1,
        'frames':[{'frame':i+1,'label':p[0],'pose':p[1],'durationMs':p[2],'motionReference':p[3]} for i,p in enumerate(poses)],
        'motionAnalysis': 'Reference01-06 form preparation/reach/grip/weight shift/lean/launch. Reference07-12 show support and extension; 13-18 show compact folded-leg recovery and opposite support; 19-24 return the other lead to contact. NEAR/FAR attribution in tiny blue reference is partially occluded: explicit nine-phase-per-lead plan here is interpretation, not a claim of certain anatomical handedness. Scarf flows backward; sword remains sheathed. Sword-side RIGHT hand remains on handle; free LEFT arm counterbalances, not symmetrical arm pumping.',
        'clips':{'run_start':{'frames':list(range(1,7)),'loop':False,'durationMs':560}, 'run_loop':{'frames':list(range(7,25)),'loop':True,'fps':20,'durationMs':900}}}
(ROOT / 'pose-plan.json').write_text(json.dumps(plan,ensure_ascii=False,indent=2),encoding='utf-8')
base = '''Asset: six sequential sprite poses of EXACT SAME approved Flame Ninja, illustrated textured pixel art, for a side-scrolling HTML5 game. First input is exact production identity (idle, reach, grip), SECOND is an exact-scale placement reference, THIRD blue character is MOTION ONLY, never copy its colors, anatomy or costume.
Output exactly 1536x1024, THREE equal columns by TWO rows, each cell512x512. Six full bodies, row-major, no text, labels, lines, shadows, floor, effects, grid or background. TRUE TRANSPARENT RGBA. Character identity must match first image: muscular adult anatomy, narrow eyes, black hood/red forehead strip and metal plate, black mask, dark sleeveless red-trimmed vest, broad black trousers, silver forearm/shin armor, black-red boots, red scarf and waist sash with original detailed texture. Same sheathed short sword on back, golden handle above shoulder. Anatomical RIGHT hand holds handle behind head exactly like the rightmost production reference, elbow naturally raised, correct thumb/wrist. LEFT fist counterbalances in front of chest. Never unsheathe. Camera fixed, facing RIGHT, torso leans 30 degrees during run. Compact athletic stride, no exaggerated stretched legs, same leg lengths and head/body proportions as production. NEAR leg closer/brighter in front, FAR leg darker behind. Preserve which anatomical hand grips sword throughout. Grip arm cannot pump freely; shoulder rotation and free arm counterbalance the legs.
Exact physical scale from second image: reference upright body251px, head about48px, same widths and limb lengths. Do NOT fill the cells. In EVERY512px cell final384x320 game canvas lies from(64,64) to(448,384), root(256,353), ground y353. Keep whole moving silhouette within that rectangle, plenty of transparent padding. Same single body scale; a crouch or lean shortens vertical bbox naturally. No per-pose scale changes. Secondary scarf motion is smooth and trailing LEFT, equipment attached to torso. Carefully draw distinct natural successive phases, no duplicates or extra limbs.\nSix poses in row-major order:\n'''
for group in range(4):
    text = base + '\n'.join(f'cell{j+1} global frame{group*6+j+1:02d}: {poses[group*6+j][0]} — {poses[group*6+j][1]}.' for j in range(6))
    if group == 0:
        text += '\nFor frames01-03 the right arm progresses from relaxed to lifting, not already gripping. Exact neutral silhouette in01. Scarf slowly accelerates. No abrupt jump to30degree lean.'
    else:
        text += '\nAll six poses full-speed30degree forward lean, sheathed sword grip fixed to moving shoulder. Natural 2-4px torso bob only. Feet planted only during contact/support phases, flight stays airborne.'
    (ROOT / 'prompts' / f'group-{group}.txt').write_text(text,encoding='utf-8')
print(ROOT)
