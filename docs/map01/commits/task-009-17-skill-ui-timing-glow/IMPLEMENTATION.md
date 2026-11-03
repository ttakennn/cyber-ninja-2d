# Task09.17 — nhịp Cửu Long, sáng skill và HUD chung

Người dùng yêu cầu: vòng Bạo Viêm2.5→2.0, cast1.4→1s; phi tiêu/Minh Vương phát sáng khi Cửu Long còn hiệu lực; gộp Q/E vào một card với chữ nhỏ hơn. Thay thế các giá trị runtime của09.15, không sửa bằng chứng lịch sử.

## Triển khai

- Sửa runtime-plan.json trước, thêm castSeconds1, ringScale2 và phạm vi glow; cập nhật promote_ninja_nine_dragons.mjs rồi sinh metadata/config/manifest. PNG giữ nguyên byte, cỡ/pivot Ninja không đổi.
- Cả8pose và nhịp seal/rồng/burst nén theo5/7: charge0.25s, orbit khoảng0.571429s, burst khoảng0.178571s, tổng1s. Metadata caster/burst tăng từ200 lên280fps cho cùng slot ảnh; không bỏ frame/pose. Aura bắt đầu1s, tồn tại7s và tắt tại8s, vẫn grow250ms/fade350ms/16fps/0.35vòng-s. Giữ độ dày1.0 và cooldown12s từ đầu cast.
- PlayerSkillGlow nhận thêm các root phi tiêu/projectile, pose/charge Minh Vương và orb/explosion ở world. Cùng cường độ sáng với Ninja trong Cửu Long, fade/tắt theo aura; không buff damage, speed hoặc thay collision. Khi Cửu Long tắt, projectile đang bay trở về hình gốc. Projectile có sẵn cũng sáng trong thời gian này. Không ghi glow vĩnh viễn vào PNG/material gốc.
- Mỗi mesh tái dùng lớp shader qua các frame, theo cùng geometry/UV/pivot/facing; dọn lớp sáng khi projectile bị gỡ/dispose. Không thêm texture per-frame hoặc thay thế tài nguyên sprite gốc. Khi không có Cửu Long, shader overlay bị ẩn.
- Game tạo một aside.skill-hud, hai section.skill-entry E/Q, tiêu đề chung một lần, ngăn cách bằng đường mảnh; cooldown/trạng thái/thanh hồi độc lập. Khung240px, tên11px, phím12px, countdown10px. Thu padding/khoảng cách; bố trí lại nhãn mobile/debug. Tên chiêu trên đầu vẫn nằm trong container game để giữ tọa độ/mờ1.5s, không bị giới hạn theo card.
- Các phím, điều kiện đứng grounded, khoá cast và chính sách reset/cooldown giữ như trước; movement trở lại sau1s. Không đổi physics/collider/camera/atlas hoặc thêm damage/quái/boss.

## File liên quan

Nguồn/generator: integration/task-009-nine-dragons/runtime-plan.json, scripts/promote_ninja_nine_dragons.mjs. Đầu ra: src/config/nine-dragons.generated.json và metadata/manifest dưới public/assets/characters/ninja/skills/nine-dragons/.

Runtime/UI: PlayerNineDragons.ts, PlayerSkillGlow.ts, Player.ts, Game.ts, SpecialSkillHud.ts, styles/main.css. Cập nhật test PlayerNineDragons.test.ts theo1s/2× và PlayerSkillGlow.test.ts cho root FX/world, fade/tắt/dispose. Cập nhật contract ninja, status toàn dự án/Map01, TASK-009, DECISION_LOG và README nguồn.

## Đã thực hiện và chưa kiểm tra

Đã chạy **generator authoring** `node scripts/promote_ninja_nine_dragons.mjs` để sinh dữ liệu từ plan mới; đã đọc source/diff. Không chạy script tạo artwork. Preview art09.11/file:// giữ lịch sử1.4s và các option cũ; runtime-plan là nguồn mới cho game.

**NOT_RUN:** test cũ/mới, build, lint, formatter, typecheck, browser/viewport/console, compile shader GPU và gameplay. Chưa có ảnh runtime mới hoặc kết quả pass; cần review độ sáng phi tiêu/orb/nổ và card trong game. Giới hạn artwork thu kiếm riêng từ09.15 vẫn còn. Chưa commit/merge/push.
