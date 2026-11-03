# Task09 — UI Minh Vương Bạo Viêm

Ngày2026-11-03, nhánh codex/task-009-player-attack-art, HEAD25d85cd. Tiếp tục các thay đổi art/runtime special1 chưa commit; không commit/merge/push trong lượt này.

## Thay đổi

- Cầu bay nhanhx2:4.5→9world unit/s. Sửa nguồn integration/task-009-special-01/runtime-plan.json (720→1440px/s ở160px/unit), chạy node scripts/promote_ninja_special_01.mjs để sinh config/manifest runtime. Không đổi nhịp cast700ms, mốc phóng360ms, ảnh/cỡ/pivot hoặc cooldown5s tính từ bắt đầu cast.
- Tên “Minh Vương Bạo Viêm” hiện trên đầu chỉ khi cast được chấp nhận. Chữ gradient kem/vàng/hồng, nền navy và viền sáng để tương phản; nổi lên20px và mờ dần trong1500ms bằng animation trình duyệt. Bám vị trí/chiều cao nội suy của nhân vật qua camera, giới hạn vị trí gần mép màn hình; thu animation khi kết thúc, stop/blur/ẩn tab/respawn/dispose. Request bị từ chối do cooldown/stance/bận/tải asset không hiện tên.
- HUD góc trái trên: phím E, tên skill, trạng thái, countdown làm tròn lên0.1s, thanh hồi có nhãn accessibility. Navy/amber/coral; chữ số cố định độ rộng, chỉ cập nhật trạng thái/countdown khi đổi. Có trạng thái đang tải/lỗi/sẵn sàng/thi triển/hồi chiêu.
- Bỏ dòng countdown trùng trong help phía dưới; giữ hướng dẫn E. Bố trí debug bên dưới HUD; viewport≤600px dùng card nhỏ hơn, title/debug hạ xuống để tránh chồng HUD.
- Tham khảo thẻ tên/key/countdown/thanh hồi tại C:/Users/anhthaitrong/Downloads/Games/cyber-ninja-basic/index.html. File tham khảo không bị sửa; không nhập health/score, gameplay hoặc cơ chế skill của dự án đó.

## File liên quan

- src/ui/SpecialSkillHud.ts: HUD, vòng đời callout và chiếu vị trí world ra màn hình.
- src/core/Game.ts: tạo/cập nhật/dọn HUD và hiện tên khi cast thành công.
- src/entities/Player.ts: trả boolean kết quả requestSpecialSkill1 để UI phân biệt cast được chấp nhận.
- src/styles/main.css, index.html: diện mạo/bố trí HUD, callout và help.
- runtime-plan, src/config/special-01.generated.json, public/assets/characters/ninja/skills/special-01/manifest.json: tốc độ mới từ generator. PNG không chỉnh artwork.
- tests/PlayerSpecialSkill01.test.ts: bổ sung kỳ vọng tốc độx2 và kết quả chấp nhận/từ chối request; chỉ viết, chưa chạy.
- TASK_STATUS, TASK-009, DECISION_LOG và contract ninja: cập nhật nguồn trạng thái, giữ báo cáo runtime trước làm lịch sử.

## Kiểm tra và còn mở

Đã đọc source, metadata, tài liệu và diff để rà phạm vi. Đã chạy generator chế độ ghi để authoring output; không chạy chế độ check. **NOT_RUN:** test, build, typecheck, lint, formatter, trình duyệt/gameplay/console, resize và chụp ảnh UI. Yêu cầu hiện tại không cấp phép các lệnh validation; không lấy ảnh art hoặc log cũ làm bằng chứng UI mới.

Cần người dùng chạy và review độ rõ/độ cao chữ, countdown, các viewport, bám nhân vật khi camera cuộn và va chạm ở tốc độ mới. Giữ E/F, physics, input, animation/pivot và kích thước nhân vật. Enemy/damage/AOE combat vẫn chưa triển khai ở bước này. Chưa tuyên bố nghiệm thu production.
