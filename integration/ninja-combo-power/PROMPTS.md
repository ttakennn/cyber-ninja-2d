# Combo phối hợp lực — Ninja Hỏa

Nguồn tạo: image_gen tích hợp, tham chiếu trực tiếp ba atlas attack production và Idle. Nguồn combo-source.png lưu nguyên ảnh sinh. Thiết kế kiếm Hỏa/lửa theo bản gốc; quỹ đạo/pose sinh mới không phải sao chép pixel VFX cũ.

## Prompt

Create a transparent 4x4 16-pose animation sheet of EXACT Flame Ninja. The three supplied APPROVED attack sheets are authoritative for weapon/fire design; supplied Idle locks anatomy and size. Illustrated textured pixel art identical to references. Preserve Flame Ninja black/red costume, red scarf, black hood/mask, bare muscular arms, dark trousers, shin guards, hip sheath. Preserve SAME GOLD HILT and long RED-ORANGE FLAMING SWORD, brilliant white-gold cutting edge, and SAME original full sweeping orange/red layered FLAME CRESCENTS, sparks and ember texture. NO silver blade, no tiny neon ribbons, no redesign.
Movement direction: powerful agile grounded ninja swordplay, force from legs/hips/shoulders, decisive extension, visible free-arm counterbalance when one-handed and a clear SECOND HAND joining the hilt for forceful cuts. Both hands may wield one sword together, but ONLY in OPEN EXTENDED attacking poses, never a timid compact clasp against chest. One sword total, not dual swords. Physical figure scale fixed across all16; same head/torso/limb anatomy as reference Idle. More athletic force and purposeful reach than previous cautious poses. Do not copy Ninja Gaiden character design; only general forceful sword motion.
16 chronological poses, left-to-right/top-to-bottom:
0 open low guard, right hand holding original fire sword low-forward, left arm free, knees loose.
1 broad ONE-HAND horizontal windup, sword arm drawn behind hip, left arm reaches forward to counterbalance, torso coils.
2 hips rotate into horizontal cut, right hand accelerates, chest open.
3 fully extended ONE-HAND horizontal impact far right, original spectacular wide white-gold/orange fire arc, left arm thrown behind.
4 low-forward follow-through, blade still to right, momentum flowing into next upward cut.
5 standalone exit: smoothly return toward open guard, no VFX blocking face.
6 second strike transition: LEFT hand JOINS right on hilt held LOW FORWARD and AWAY from chest, knees compress, blade angled low right.
7 TWO-HAND reverse rising slash acceleration, both arms extending upward-forward, hips drive upward.
8 TWO-HAND rising strike impact, arms extended high-forward diagonally, broad original flame crescent rising right, no crouched timid clasp.
9 upper follow-through sword above right shoulder with arms open, ready to flow directly into overhead final.
10 standalone exit: release left hand to side and lower sword toward guard.
11 heavy final anticipation: BOTH hands on original hilt ABOVE AND BEHIND HEAD, elbows open, torso coils, rear leg loads; fully upright silhouette same anatomy.
12 explosive TWO-HAND diagonal downward acceleration, hips turn first, front knee braces, chest leans forward, hands reach away from face.
13 decisive FINISHING TWO-HAND impact FAR FORWARD RIGHT: both hands extend at nearly straight-arm length, rear leg pushes, front leg planted, sword tip low right, huge original white-gold/orange-red flame crescent ahead. Strong striking reach without growing body, no giant torso. Do not cover face.
14 low follow-through, two hands still extended low right, knees absorb force, flames dissipate.
15 controlled exit to original low open guard, left hand frees for balance.
Composition: 16 equal square cells in4x4. Each figure and all effects fully INSIDE its own cell with blank alpha margins, no cross-cell overlap. Feet baseline80% cell height, pelvis around40% cell width, standing-equivalent body55% cell height, reserve right side for sword and flame. No root teleport or jumps. All poses same apparent body scale. Sword remains in same gripping hand when second hand joins/releases. No text, guides, backdrop, shadow or labels. Actual alpha transparency. Fluid motion and purposeful weight shift.

## Tham chiếu video và chuẩn hóa

https://www.youtube.com/watch?v=1gfD8P0iSHM — Ninja Gaiden: Ragebound Review (IGN). Đã mở YouTube, phát và quan sát một số đoạn gameplay; có quảng cáo xen kẽ, không phân tích toàn11:37 hoặc trích được chu kỳ combat từng frame. Không dùng screenshot video làm sprite hoặc sao thiết kế nhân vật; cách phân bổ một/hai tay là đề xuất từ brief.

Đo anatomy từ đầu/chân frame guard0 (y103..287 của nguồn1263×1245), không lấy bbox lửa làm chiều cao cơ thể. Target guard230px do hạ đầu gối, Idle chuẩn251px. Một scale cố định16pose; baseline từng hàng được ghi thủ công trong sourceRowGround, không auto-fit/scale mỗi frame. Ô512²/pivot192,353/160px-unit giữ contract. preserveEffects=true giữ các lớp alpha/fire/ember khi cắt. Source plan giữ thời lượng; chainFrames đi tiếp theo đà, không quay về guard giữa combo.

