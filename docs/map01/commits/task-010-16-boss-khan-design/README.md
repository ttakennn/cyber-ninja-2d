# Task 10.16 — Huyết Đao Khan, Sát Thủ Mặt Nạ

Người dùng giao tạo art boss Map01: nam cao, săn chắc, áo street-assassin xẻ tà ngắn, nửa mặt đeo mask, mắt đỏ, hai đao cong ngắn/energy blade, chủ đạo trắng xám–đỏ neon–cyan lạnh; vai trò sát thủ tốc độ cao, dash/afterimage, cao bằng1,5 lần Ninja Hỏa. [Preview tạo hình](preview.html), [ảnh so tỉ lệ](comparison.png), [PNG nguồn](assets/boss-khan-v1.png).

## Candidate v1

Một pose toàn thân nhìn phải 3/4, chân trụ, hai tay giữ hai đao cong riêng, tóc ngắn tối, áo trắng xám xẻ tà trên lớp đen linh hoạt; viền và mắt đỏ, điểm công nghệ cyan. Đường nét và texture theo Illustrated textured pixel art sprite2D của nhân vật đã chốt. Chưa có sheet động tác, dash thật hoặc VFX bóng mờ riêng. Toggle bóng mờ trong preview chỉ vẽ lại cùng PNG bằng CSS để xem hướng màu, không phải animation đã duyệt.

Nguồn ImageGen gốc `integration/task-010-boss-khan/source/boss-khan-v1.png`, original `exec-888daae1-0a1d-4a71-a6ae-3b3c09dac570.png`; prompt đầy đủ ở `integration/task-010-boss-khan/prompts/design-v1.md`. Tham chiếu là ảnh Ninja Hỏa Idle, Sát Thủ Bóng Neon và Sói Điện đã duyệt, giữ nguyên byte. Ảnh gốc1199×1312 RGBA, vùng alpha≥128 tại x142..1174/y23..1267, ink height1245px. SHA256 và alpha/sourceRect trong [design.json](design.json).

Ninja Hỏa Idle có ink height251px. Mục tiêu preview là251×1,5=376,5px; một hệ số vẽ0,302409638554 từ pose gốc, pivot review(658,1267). Cùng mật độ tham chiếu160px/world unit, tương ứng chiều cao nhìn2,353125world unit; đây là quy tắc so art, không phải collider hoặc sprite contract runtime. Ảnh nguồn không bị resize/repack; bảng so được sinh riêng.

## Phạm vi và giới hạn

Đã xem ba PNG tham chiếu, ảnh boss gốc và bảng so có cùng đường chân; lấy kích thước, alpha/hash từ ảnh thật. Đã tạo preview HTML không dùng Canvas getImageData, có thể mở qua localhost. Chưa mở preview trong trình duyệt, chưa kiểm tra ở viewport khác; chưa chạy test/build/lint/typecheck/formatter theo AGENTS.md. Chưa sửa src/public/assets, map, physics, input hoặc animation các nhân vật đã duyệt. Candidate chờ người dùng duyệt tạo hình, chiều cao và bảng màu trước khi làm animation/skills; chưa có quyết định về vị trí xuất hiện, thời gian/skill, damage hoặc boss gameplay.

Cập nhật 2026-11-05: người dùng đã chốt tạo hình này và giao vẽ [động tác cơ bản](../task-010-17-boss-khan-motion/README.md). Snapshot tạo hình gốc giữ nguyên làm lịch sử.
