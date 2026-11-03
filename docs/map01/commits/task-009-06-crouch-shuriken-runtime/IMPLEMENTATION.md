# Task09 — cúi phóng phi tiêu, tốc độ x2 và va chạm vật cản

Baseline dd98497 trên codex/task-009-player-attack-art; phần đứng đã commit20d4cd3. Người dùng duyệt art cúi và yêu cầu apply, tăng tốc gấp đôi, phi tiêu chỉ tắt khi gặp vật cản. Đã hỏi riêng trường hợp không trúng và bay khỏi map; người dùng chọn **dọn khi đã ra ngoài màn chơi**. Chưa xử lý quái.

## Thay đổi

- Click phải khi grounded, đứng hoặc cúi: chọn bộ pose tương ứng đã duyệt, cùng550ms và release250ms. Hướng khoá trong mỗi lần phóng. Không co sprite đứng thành cúi hoặc đổi kích thước nhân vật.
- Điểm thả so với chân: đứng(±1.01875,+1.41875), cúi(±0.9875,+0.70625) world unit, tính từ metadata art. Cả hai giữ ô512×512/pivot(192,353)/160px/unit.
- Đổi stance giữa đòn, nhảy hoặc leo huỷ pose đang phóng; phi tiêu đã thả tiếp tục bay. Nhả S nhưng headroom không đủ thì movement vẫn crouching, tiếp tục dùng pose/điểm thả thấp. Combo trái vẫn chỉ đứng, gate/reset/buffer không đổi, không chồng hai action.
- Tốc độ900→1800px/s, tương đương5.625→11.25world unit/s. Bỏ TTL650ms, không thay FPS xoay của phi tiêu hoặc nhịp ra tay.
- Game truyền TestLevel.colliders và cameraBounds cho skill. Va chạm dùng tâm vòng phi tiêu quét liên tục theo đoạn ngang qua AABB solid, gồm cả kiểm tra đoạn từ thân tới tay khi thả để không sinh phi tiêu bên kia vật cản sát người. Chạm collider thì dispose ngay, không đẩy nhân vật hoặc thay PhysicsWorld.
- Chỉ **solids** chặn phi tiêu: tường, thùng, ghế, chậu... có collider. Ảnh trang trí/background, vùng climbable riêng và khoảng rỗng không tự biến thành vật cản. Vật thấp hơn/cao hơn đường tâm không chặn; không suy hitbox từ vệt lửa hoặc alpha sprite.
- Phi tiêu bay ngoài camera hiện tại vẫn tồn tại. Chỉ dọn khi vượt toàn bộ biên ngang level (hợp cameraBounds với các biên collider), cộng biên đệm bằng cả chiều rộng khung projectile để hình đã ra ngoài. Level cũ không cameraBounds dùng phạm vi solids. Stop/blur/đổi tab/respawn/dispose tiếp tục dọn như trước.

Quái, damage, hitbox chiến đấu, hiệu ứng nổ/trúng, cooldown và special Q **chưa triển khai**. Collision hiện tại là đường tâm chạm solid, không phải phần lửa chạm ảnh. Không thêm collider cho đồ trang trí vốn chỉ là ảnh; dữ liệu level/movement/crouch/headroom/camera/physics giữ nguyên.

## Nguồn và file

Nguồn: integration/task-009-fire-shuriken/runtime-plan.json + metadata art đứng/cúi/projectile. Sửa generator scripts/promote_ninja_shuriken.mjs, đã chạy **node scripts/promote_ninja_shuriken.mjs** để copy PNG cúi nguyên byte, sinh crouch-throw.json, manifest và src/config/fire-shuriken.generated.json. Không vẽ lại hoặc chuẩn hoá lại ảnh đã duyệt. PNG/metadata đứng và projectile cũ giữ nội dung.

Runtime: src/entities/PlayerShuriken.ts (load3 sheet, stance, sweep/cleanup), Player.ts (gate phi tiêu riêng, chọn stance), core/Game.ts (gắn world solids/bounds); index.html và rendering/Renderer.ts bổ sung hướng dẫn đứng/cúi. Không sửa PhysicsWorld, SpriteRenderer hoặc AnimationController dùng chung.

Tests/PlayerShuriken.test.ts cập nhật loader/lifecycle3 sheet, PNG/scale/timing cúi, tốc độx2, không TTL, ném trái/phải khi cúi, headroom, đổi stance, quét tường mỏng, vật sát điểm thả, solid đúng độ cao, biên map và giải phóng texture. Đây là test được viết/cập nhật, **chưa chạy**.

## Kiểm tra và còn mở

Đã đọc source/metadata/diff và đối chiếu collider/visual của level để thiết kế thay đổi. **NOT_RUN:** test/build/typecheck/lint/formatter, chơi thử trình duyệt, console và ảnh nghiệm thu runtime. Không tuyên bố va chạm hay chuyển pose đã được kiểm nghiệm trong game. Chưa commit/merge/push lượt này.

Cần review trong game: đứng/cúi ném hai hướng, nhả S dưới mái, đổi stance trước/sau frame thả, ném cạnh thùng/tường mỏng, bay qua prop thuần ảnh, qua nhiều zone và bay khỏi biên. Damage/quái sẽ làm sau theo yêu cầu; chưa bắt đầu special Q.
