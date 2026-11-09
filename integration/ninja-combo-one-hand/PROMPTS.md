# Ninja Hỏa — combo một tay, giữ thiết kế kiếm/VFX gốc

Công cụ: image_gen tích hợp. Ba ảnh tham chiếu vũ khí/VFX: docs/characters/ninja/animation/attacks/attack_1.png, attack_2.png, attack_3.png. Idle là tham chiếu anatomy. Nguồn ảnh sinh lưu nguyên ở combo-source.png; không dùng bộ kiếm bạc/hai tay Task10.30 làm tham chiếu.

## Prompt

Use these THREE ORIGINAL Flame Ninja attack sheets as the authoritative weapon and fire reference; the fourth image Idle is the authoritative anatomy scale. The previous redesign was WRONG: do NOT use a dull silver sword, thin weak orange strokes, or a cramped TWO-HANDED stance.
Create a NEW 4 columns x 4 rows TRANSPARENT sprite sheet, EXACTLY16 equally spaced poses. Same illustrated textured pixel art as original sheets. KEEP the original GOLD HILT, dark/red grip, LONG glowing RED-ORANGE FIRE BLADE with bright yellow-white cutting edge, and the same LARGE sweeping spectacular orange/red/white FLAME CRESCENTS and ember texture as original attacks. Flames should be rich, full, bright and layered as ORIGINAL references, not reduced to thin neon lines. Follow sword arc, keep face visible. This is the SAME existing weapon and approved fire visual design, not a new weapon or magic. No silver/scimitar redesign.
Animate LIGHT, AGILE, OPEN ninja one-handed swordwork. RIGHT hand alone wields sword; LEFT hand is FREE counterbalancing behind/side, NEVER touches the sword, NEVER clasps the right wrist or hilt. Dynamic open shoulders, hips turn, front arm reaches outward, clean controlled weight shifts, no timid hunched two-hand guard. Do not copy another character's costume.
Flame Ninja identity EXACT original: adult muscular but agile, black hood/mask, red scarf streaming left, black sleeveless red-trim suit, bare arms, shin guards, red sash, original sheath at hip. Same head/torso/limb physical sizes ALL16poses; use Idle anatomy. Mild knee bends can change height naturally, NEVER zoom between poses.
Frame0 open one-handed low guard; left arm relaxed to side/back, original sword held right hand low forward.
1: side windup, right arm pulls fiery sword back, left hand extends freely forward for balance.
2: hip-led horizontal cut beginning, right arm moving outward.
3: full extended horizontal strike right, original LARGE FLAME CRESCENT sweeping across front at waist/chest height, left arm counterbalances behind.
4: sword follows through low right, original fire trailing, silhouette clear.
5: return open low guard as0, left hand free.
6: low one-hand preparation for reverse rising cut, left arm side.
7: right hand whips sword upward forward, torso rises slightly.
8: long diagonal rising strike right, original LARGE sweeping white-gold/orange-red fire arc, arm extended, left arm behind.
9: follow-through high right, right hand alone overhead, left hand free.
10: return to same open low guard0.
11: finisher side coil, right-hand sword cocked over back shoulder, left arm extended for balance.
12: right arm drives long downward diagonal strike, front leg braces, body leans slightly forward.
13: strongest one-hand diagonal finish, right arm extends FAR forward, large original fiery blade and crescent white-hot core, bright amber/orange/red flame curls, free left arm flung behind; feel decisive and agile.
14: low follow-through, flames dissipating, hips unwind.
15: controlled return open low guard0, left arm free.
Composition: each figure stays in its own equal cell with all flame arcs contained. Blank alpha margins. All feet share baseline80% cell height. Standing-equivalent body height about55% cell height, pelvis centered40%cell width to leave room for extended sword+fire on right. No horizontal root teleport, no jumps. No text, no labels, no shadows, actual alpha. Emphasize original long fiery sword and rich original fire effects AND one-handed free-left-hand movement.

## Bất biến và chuẩn hóa

Giữ thiết kế kiếm Hỏa cán vàng, lưỡi đỏ-cam/lõi trắng vàng, chất lửa lớn nhiều lớp và texture ember theo art cũ. Ảnh sinh tạo lại pose/quỹ đạo, KHÔNG phải bản sao pixel của VFX cũ. Ba atlas production gốc được giữ nguyên byte và copy vào reference/ để so. Chỉ candidate thay động tác. Một tay cầm kiếm, tay còn lại cân bằng tự do; không khóa hai tay vào cán. Scale toàn sheet bằng một transform; không fit mỗi frame. Ô512²/pivot192,353/160px-unit. preserveEffects=true bỏ bước cắt chỉ giữ component lớn nhất của Task10.30 để không làm mỏng/rụng lớp lửa. Nhịp/cửa sổ nối/hồi thế kế thừa phương án preview trước, chưa áp gameplay.

