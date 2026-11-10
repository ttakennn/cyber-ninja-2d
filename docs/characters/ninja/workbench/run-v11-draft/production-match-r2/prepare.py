import json
from pathlib import Path
from PIL import Image

ROOT=Path(__file__).resolve().parent
OLD=ROOT.parent
for sub in ['references','targets','raw','frames','qc','prompts']:
    (ROOT/sub).mkdir(exist_ok=True)
for name in ['idle','combatIdle','combatEnter']:
    Image.open(OLD/f'references/{name}.png').save(ROOT/f'references/{name}.png')
# Identity reference: production crops shown at native pixel scale, no enlargement.
panel=Image.new('RGBA',(1152,320))
for i,name in enumerate(['idle','combatEnter','combatIdle']):
    panel.alpha_composite(Image.open(ROOT/f'references/{name}.png'),(384*i,0))
panel.save(ROOT/'references/identity.png')
for g in range(4):
    target=Image.new('RGBA',(1536,1024))
    guide=Image.new('RGBA',(1536,1024))
    for j in range(6):
        pos=((j%3)*512+64,(j//3)*512+64)
        target.alpha_composite(Image.open(OLD/f'frames/frame-{g*6+j+1:02d}.png'),pos)
        guide.alpha_composite(Image.open(ROOT/'references/idle.png'),pos)
    target.save(ROOT/f'targets/group-{g}.png')
    if g==0:guide.save(ROOT/'references/scale-guide.png')
base='''Precise sprite identity/style correction for an existing animation. FIRST IMAGE is the APPROVED PRODUCTION CHARACTER and is the absolute authority for color, exposure, palette, head/body proportions, muscle size, fabric texture, lighting and detailing. SECOND IMAGE is the EDIT TARGET: keep exactly its six poses, limb articulation, sword grip, pose order and registrations. THIRD IMAGE repeats the PRODUCTION CHARACTER at the required physical size and root in each cell.
Repaint the six target sprites to look like the FIRST production image, not a similar new hero. Shrink the overly large heads/shoulders/biceps in target to match production anatomy, restore leaner production arm/torso widths and original leg length. Original illustrated TEXTURED pixel sprite, dark fine grain and crisp small pixels, NOT smooth glossy high-resolution cartoon or plastic muscles. Match production's exact black hood and trousers, deep textured crimson scarf/sash, muted warm skin/shadows, silver armor highlights and original dark outlines. Do not brighten skin, do not saturate red into orange, no new light source. Copy the precise small narrow eye/slit and mask from production. Preserve back sword and same anatomical right hand gripping its handle; preserve hand/handle attachment. Preserve movement, do not revert running poses to standing. Do not copy standing legs from first image. The reference upright body251px is the scale; running bbox may compress naturally. Head and all body parts must stay same production pixel scale through ALL poses.
Canvas1536x1024, exactly3columns2rows of512x512cells. Content already has an inset384x320 game canvas per cell from(64,64) to(448,384), ground/root(256,353). Keep original target placement and root. Do not enlarge figures to fill cells. No text, numbers, labels, grid, shadows, glow, floor or particles. Solid uniform pure MAGENTA #FF00FF outside sprites, opaque character, local keying later. Only change character identity/rendering/proportions/color to match production, not pose choreography. Output all six cells, no extra figures.
'''
for g in range(4):
    (ROOT/f'prompts/group-{g}.txt').write_text(base+f'Correct global frames{g*6+1:02d}–{g*6+6:02d}. '+('Cell1 is exact production, keep it pixel-identical if possible; it will be replaced with source production during packaging.' if g==0 else 'All six are full-speed running with same sword-holding hand. Preserve near/far limb overlaps of edit target.'),encoding='utf-8')
print(ROOT)
