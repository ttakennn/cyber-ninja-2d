# Ninja climb v2 — prompt chỉnh bản chọn

Công cụ: image_gen.imagegen built-in; nền trong suốt. Bản thử để người dùng duyệt.

Edit only the pose details of this transparent 2x2 ninja climbing sprite sheet. Preserve exact canvas dimensions, four cell boundaries, character size, head size, hip anchors, costume, red/black palette and rendering style. This must be a continuous four-frame loop ordered top-left -> top-right -> bottom-left -> bottom-right.
KEEP top-left pose unchanged: left arm high/right knee high.
KEEP bottom-left body pose (right arm high/left knee high), but FIX its sword scabbard: remove the sword projecting to viewer's RIGHT and put it diagonally trailing toward viewer's LEFT at the belt exactly like the other three frames. Do not mirror the whole body.
CHANGE top-right into an INTERMEDIATE climbing transition, not another raised-arm peak: both hands around head/shoulder height with elbows bent, left hand at eye height and right hand slightly ABOVE head moving upward, both knees moderately bent with right boot moving down and left knee beginning to rise. Same torso/pelvis anchor and same head dimensions as top-left. Bottom boot remains same baseline.
CHANGE bottom-right into the OPPOSITE intermediate transition: right hand at eye height pulling down and left hand slightly ABOVE head reaching upward, left boot moving down and right knee beginning to rise. Both elbows and knees visibly bent, limbs must differ from top-left peak pose. Keep scabbard left.
Scarf trails viewer left throughout. Both feet and both hands visible. Empty clenched gripping hands on invisible ladder rungs. No ladder, no text, no outlines/grid, no background, actual transparent alpha. Do not add/remove frames. Keep character pixel size identical across four frames. Do not enlarge or shrink the ninja.

