# Task09.3.2 — áp dụng phi tiêu hoả bằng chuột phải

Người dùng duyệt bộ động tác bằng “Ok good, apply vào nhân vật giúp tôi.” Giữ nhánh codex/task-009-player-attack-art; không commit/merge/push trong lượt này. Artwork trước đó vốn chưa commit được giữ lại.

## Hành vi đã viết

- Click phải một lần trên canvas: phát sáu pose550ms, thả đúng một phi tiêu ở250ms (pose4). Giữ chuột không tự bắn; click trong lúc đang phóng không xếp hàng. Chặn menu chuột phải riêng canvas game.
- Hướng được lấy từ vận tốc ngang hoặc facing hiện tại, khoá trong lần phóng; có cả trái/phải. Giữ điều kiện grounded/standing như combo, có thể di chuyển ngang; không phóng khi cúi, nhảy/rơi hoặc leo. Không thay movement/physics để khoá chân.
- Không chồng hình combo/phi tiêu: hành động đã bắt đầu giữ quyền phát; click hành động còn lại trong thời gian đó bị bỏ qua. Combo trái vẫn dùng controller/buffer/reset0.5s cũ.
- Huỷ động tác khi đổi sang tư thế không hợp lệ. Nếu chưa tới frame mở tay thì không sinh projectile; phi tiêu đã thả vẫn bay độc lập. Stop/blur/visibilitychange/respawn/dispose dọn toàn bộ phi tiêu và pose/buffer.
- Phi tiêu thuộc scene world riêng, không phải con của player.visual; vị trí được cập nhật ở timestep cũ và nội suy khi render. Texture ảnh tải một lần, từng renderer dùng clone sở hữu riêng và dispose khi hết thời gian bay.
- F3 thêm trạng thái/lỗi phi tiêu; help và aria-label bổ sung click phải.

Đây là animation + projectile visual. **Chưa damage, hitbox, va chạm phi tiêu với tường/quái, impact/nổ, tài nguyên hoặc cooldown riêng.** Phi tiêu hiện có thể xuyên cảnh và tự biến mất theo thời gian; không thay collision của nhân vật. Special Q, “Minh Vương Bạo Viêm”, quái/boss chưa làm.

## Asset, nguồn và thông số

PNG đã duyệt được copy nguyên byte từ integration/task-009-fire-shuriken/ vào public/assets/characters/ninja/skills/fire-shuriken/. Không tạo lại ảnh, không đổi atlas locomotion hoặc ba đòn kiếm. Throw1536×1024, ô512×512, pivot(192,353), visual3.2×3.2 =160px/unit như preview/bộ attack. Projectile1254×1254, ô627×627 và pivot tâm vòng đã có.

Nguồn promote: integration/task-009-fire-shuriken/runtime-plan.json + throw/atlas.json + atlas.json; generator scripts/promote_ninja_shuriken.mjs. Đã chạy **node scripts/promote_ninja_shuriken.mjs** để authoring/copy metadata và PNG runtime. Không chạy lại ImageGen hoặc normalization.

Giữ85/100/65/70/90/140ms bằng slot5ms lặp các rect,110 slot ở200fps; controller animation dùng chung giữ nguyên. Đây vẫn là sáu hình, không phải110 tư thế mới. Release tại slot50/250ms. File src/config/fire-shuriken.generated.json do cùng generator sinh, không chỉnh riêng output.

Thông số ban đầu lấy từ preview: khung projectile96px =0.6unit, tốc độ900px/s =5.625unit/s, sống650ms, khoảng bay tối đa3.65625unit. Offset tâm phi tiêu tính từ điểm thả(355,126) và pivot actor, thành(±1.01875,+1.41875)unit so với chân. Đây là giá trị khởi đầu từ minh hoạ đã xem, chưa phải cân bằng combat. Chỉnh nguồn plan và promote khi cần đổi; không tự gán cooldown5s của special Q cho phi tiêu.

## File thay đổi

- src/entities/PlayerShuriken.ts: load/cast/release/flight/lifecycle; src/entities/Player.ts: gate, chọn visual, update và respawn/dispose.
- src/core/Game.ts: input trái/phải theo thứ tự, contextmenu, load, scene world/interpolation và reset khi tạm dừng.
- src/config/fire-shuriken.generated.json; public/assets/characters/ninja/skills/fire-shuriken/{throw.png,throw.json,projectile.png,projectile.json,manifest.json}; runtime-plan.json và generator nêu trên.
- index.html, src/rendering/Renderer.ts, src/debug/DebugOverlay.ts: hướng dẫn và thông tin tải skill.
- tests/PlayerShuriken.test.ts: artwork byte/scale/timing, hai hướng, release một lần, cancel, world/interpolation/expiry, gate/combo/physics, respawn và texture lifecycle. tests/SpriteSheetLoader.test.ts: cập nhật số visual action trong ca fallback, không thay kỳ vọng fallback.
- docs/TASK-009.md, docs/TASK_STATUS.md, docs/DECISION_LOG.md, docs/characters/ninja/rules/SPRITE_SPEC.md và README art: ghi duyệt và tích hợp; nguồn/bằng chứng art cũ giữ nguyên.

## Kiểm tra thực tế và còn mở

Đã đọc source, metadata và diff để rà phạm vi, luồng tải, thứ tự input và lifecycle. **NOT_RUN:** mọi test/build/typecheck/lint/formatter, trình duyệt/gameplay/console. Không dùng việc thêm test làm bằng chứng test đã đạt. Chưa có ảnh hoặc log nghiệm thu runtime.

Cần review trong game: click phải hai hướng/đứng/chạy; liên tục click/giữ chuột; đổi hướng giữa đòn; trái/phải đan xen; nhảy/cúi/leo trước/sau frame thả; blur/đổi tab/respawn; chân/tay và cỡ projectile trên các level. Sau khi được phép chạy kiểm tra mới ghi kết quả thực tế. Chưa tuyên bố hoàn tất production.
