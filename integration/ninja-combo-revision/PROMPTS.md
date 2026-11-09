# Combo Ninja Hỏa — nguồn image_gen

Tham chiếu danh tính: integration/ninja-run-hurt-revision/idle-reference.png. Đã xem ba atlas attack production trước khi tạo. Không đổi locomotion/skill ngoài bộ run/hurt đã chốt riêng. Công cụ image_gen tích hợp, nền alpha; lưu nguồn đầu và cleanup.

## Prompt nguồn

Create a TRANSPARENT sprite sheet for this exact FLAME NINJA, illustrated textured pixel art matching the supplied Idle, no redesign. CRITICAL fixed anatomy and scale, head diameter and shoulder breadth identical across every pose. Exactly 16 equal cells in a FOUR by FOUR grid, chronological left to right then next row. Same camera facing RIGHT three-quarter side, hips centered horizontally, grounded feet baseline at 80% cell height, standing-equivalent figure height 55% cell height. Large empty margins allow sword and fire arcs. Consistent adult muscular red/black ninja, red trailing scarf, black mask/hood, bare arms, dark baggy trousers, shin armor, one straight katana with gold hilt, sheath left hip, no extra weapon. Palette locked. Make movements technically coherent and weight grounded, hands follow sword hilt, hips rotate before shoulders, no changes of body size. Original Idle anatomy must match exactly.
16 POSES:
0) standing combat guard, sword held low forward with both hands, knees lightly bent.
1) first strike anticipation: draw hands and blade toward left/back hip, weight back.
2) horizontal cut starts: torso rotates right, blade crossing front.
3) horizontal cut contact: arms extend forward right, brilliant narrow curved orange/gold fire trail following blade, face unobscured.
4) follow-through blade extended low right; flame fading.
5) return naturally to SAME low-forward guard as cell0.
6) second strike windup from low guard, sword angled low right.
7) reverse rising cut starts, hands drive blade upward.
8) rising slash contact reaching diagonally high right, narrow amber white-core fire arc with red edge.
9) follow-through blade high beside right shoulder, body same proportions.
10) lower sword to SAME low-forward guard as cell0.
11) third strike anticipation: both hands raise sword over shoulder, feet brace wider modestly.
12) decisive downward diagonal cut begins, body leans forward modestly, arms extend.
13) strongest finishing impact: blade cutting forward down right, long crisp fiery crescent IN FRONT OF BODY, gold-white core orange red edges; do not hide silhouette.
14) low right follow-through, knees absorb momentum, fire dissipates.
15) controlled return to SAME low-forward guard as cell0.
Only one figure per cell, exact 4x4 grid. No numbers/text/labels/background/ground shadow. Actual transparent alpha. Same head, chest, limbs scale throughout. No jumps, spinning, body teleport or horizontal translation; only grounded swordwork. Smooth bridges between all poses and back to guard. Match idle body NOT the oversized historical attack sheets.

## Prompt cleanup

Edit this 4x4 Flame Ninja 16-pose sprite sheet. Preserve ALL 16 exact body poses, order, costume, weapon, rendering style and uniform body scale. Correct ONLY fire trail containment and consistency: no flame or ember may spill into another cell, remove the stray orange fragments around cell8 (third row first cell) crossing right into next cell and around cell13. Clean all tiny stray pixels outside each character's own cell. Fire crescents must be fully contained in their corresponding equal grid cell with at least 5% blank margin from each cell edge. Make each arc slim crisp fiery gold-white core with orange red fringe, without dark opaque smudges. Cell3 horizontal fire slash, cell8 upward crescent, cell13 downward crescent; cell4 and14 just fading smaller trails. Preserve actual transparency. Do NOT add backdrop, text, gridlines, drop shadows, new poses or new characters. Sheet must remain exact 4x4, equal square cells. Body is locked; no enlarging head/torso. Keep smooth short single-katana motions. This is precision cleanup of a sprite animation sheet, not a new character design.

## Chuẩn hóa

scripts/prepare_ninja_combo_revision.ps1 chia grid4×4; bỏ thành phần alpha rời không thuộc thân/kiếm/vệt chính để tránh nhiễu ô bên cạnh. Dùng duy nhất một transform cho toàn16pose dựa guard0 cao240px (đầu gối hạ so Idle251px), không fit bbox từng pose. Ô512²/pivot192,353/160px-unit. Target authoring để review, không tuyên bố sai số ảnh sinh bằng0; người dùng duyệt trước publish.

