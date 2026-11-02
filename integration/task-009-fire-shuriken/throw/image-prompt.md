# Prompt — ninja phóng phi tiêu

ImageGen built-in, identity-preserve, RGBA. Ảnh tham chiếu: idle-reference.png (crop rect4,4,384,320 từ atlas canonical) và ../fire-shuriken-atlas.png (chỉ tham chiếu projectile). Candidate để review; không thay canonical.

```text
Use case: identity-preserve. Asset: six-frame 2D ninja throwing-shuriken animation sprite sheet for an existing game. Image 1 is the exact approved character identity/style reference. Image 2 is only the projectile design reference, not a body size reference.
Create exactly 6 DIFFERENT sequential full-body poses, in a clean 3-column by 2-row uniform grid, reading left-to-right then top-to-bottom. Transparent RGBA background, no floor, no labels, no panel borders. Requested sheet 1536x1024, each cell 512x512. A single identical character in every cell, facing screen right, side view with a little three-quarter volume, matching the supplied sprite's Illustrated textured pixel art, crisp textured clusters, dark outline, detailed shaded anatomy. Not a redesign.
Identity invariants: same adult muscular tan bare arms, same black sleeveless hood and mask, narrow red headband across eyes, red scarf with trailing tattered cloth on left, red waist sash, black baggy pants, dark grey metal forearm and shin armor with red accents. Same body proportions/head size, same costume and colors, same sword/scabbard worn sheathed at belt (NOT a sword attack, do NOT draw a sword in hands). Do not turn into chibi or realistic 3D. No new golden head ornament.
Animation: a confident technically readable grounded overarm shuriken throw, coordinated weight shift and shoulder/hip rotation. Same foot contact baseline and consistent pelvis anchor. Do NOT repeat six similar idle frames.
1 (top left) wind-up: slightly bent knees, throwing elbow folded, near hand draws back beside right shoulder/ear; far arm forward for balance.
2 (top middle) maximum anticipation: shoulder rotated backward, near throwing elbow raised and hand just behind ear, torso coiled, weight on rear foot.
3 (top right) forward acceleration: hips turn forward, near upper arm swings forward, elbow opening, wrist approaches eye height; far arm pulls toward ribs.
4 (bottom left) RELEASE: near arm fully extended toward screen right slightly above shoulder height, wrist snaps and fingers OPEN, body leans naturally forward; far hand drawn to ribs. Clear different silhouette from previous frame.
5 (bottom middle) follow-through: near arm passes diagonally downward across front, torso rotated, knees absorb motion, cloth follows.
6 (bottom right) recovery: arm retracts down to waist, torso settles toward the idle reference, ready for the next throw.
Keep all six body/head/torso scales identical, never shrink the body to fit an outstretched arm. Both feet stay on baseline y440 in their respective 512px cells, pelvis center x235, head-to-foot standing height approximately333px (reference character at 4/3 scale). Leave room to the right for the release hand and left for scarf. Keep every complete body within its own cell, no cross-cell overlap, no cropped fingertips/feet/scarf.
IMPORTANT: draw ONLY the character, no loose projectile or fire VFX in these six poses. The separate existing projectile will be composited at the release frame in preview. Hands must be anatomically readable, no extra arms/fingers. Preserve art identity from image 1; changing action does not authorize changing proportions.
```

## Lần chỉnh thứ hai

Loại quầng nền, giữ tay trong ô, bỏ chi tiết trán tự thêm và sửa pose chuyển tiếp.

```text
Edit target Image1: the six-pose ninja sprite sheet. Image2 is the approved original character reference for exact identity. Keep the six throwing-motion poses, full-body black/red ninja and side-view visual language. Correct this sheet for actual sprite use, keeping same head/torso proportions and limbs.
CRITICAL corrections:
1. REMOVE ALL background, atmospheric color, red/grey glow, ground, shadows, gradients, halos outside the character. Every pixel outside the crisp silhouette must be fully transparent alpha0. Not a preview on colored background. Pure cutout sprites on actual transparent canvas.
2. Use a uniform 3x2 cell grid on1536x1024. Each cell512x512. Make all six characters UNIFORMLY smaller within their cells so there is ample empty margin: head-to-foot about330px, boots on y440 of each cell, pelvis x235. Maximum ink horizontal localx30..480. Frame4 extended fingers must be INSIDE its own cell, not cross into frame5. No clipping.
3. The red headband must stay plain and narrow like Image2, remove the bright metallic forehead logo/plate currently added. No redesign of armor/scarf/sheathed sword.
4. Top-right pose3 should be a transitional throw with BENT elbow halfway forward, hand near face height, not already identical to fully extended release pose4. Bottom-left pose4 is the only full straight-arm release. Bottom-middle followthrough down. Last pose recovery toward original idle.
5. Maintain coherent feet and body scale in all six poses, no foot slide. Far hand must balance naturally and never multiply. No text, no extra projectiles or fire painted into the frames.
```


