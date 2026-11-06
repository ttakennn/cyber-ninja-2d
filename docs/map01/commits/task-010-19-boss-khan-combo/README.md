# Task 10.19 — Song Đao Liên Trảm

Người dùng đã chốt art [Huyết Nguyệt Giáng Lâm](../../../characters/boss-khan/animation/entrance/preview.html) và yêu cầu bốn nhát đánh thường của Huyết Đao Khan: chém ngang, chém ngược, xoay chém thấp, kết bằng X có lóe sáng rõ. [Preview combo](preview.html) phát minh họa 1,2 giây, có tua, duyệt từng frame và đổi tốc độ. Nhịp này chưa là tốc độ tấn công gameplay.

| Nhát | Frame chính | Hình ảnh |
| --- | --- | --- |
| 1 · Ngang | combo-a/2 | Tay phải vươn, vệt đỏ/cyan ở ngang ngực |
| 2 · Ngược | combo-a/5 | Đổi vai và tay, vệt quét ngược |
| 3 · Thấp | combo-b/1 | Hạ trọng tâm, xoay quét qua tầm chân |
| 4 · X | combo-b/5 | Hai đao giao nhau, lõi trắng đỏ lóe mạnh |

Hai sheet nguồn ImageGen 1774×887 RGBA, 4×2 pose, được chuẩn hóa từ [plan và source](../../../../integration/task-010-boss-khan/combo/animation-plan.json) qua scripts/prepare_boss_khan_animation.ps1 -Profile combo thành candidate/combo-a.png và candidate/combo-b.png, mỗi sheet 2048×1024, ô512×512, pivot review(256,456), tham chiếu160px/world unit. Mỗi sheet dùng một scale cố định tính từ pose đứng (combo-a frame0, combo-b frame7) để giữ chiều cao tham chiếu376,5px; không co giãn từng frame. Prompt gốc nằm trong integration/task-010-boss-khan/combo/prompts/. Bản combo-b đầu có mảng đỏ/xám tràn giữa ô; source/combo-b-first.png và source/combo-b-cleanup.png giữ lịch sử, source/combo-b.png là bản được chọn sau khi thu đầu vệt quét thấp khỏi mép ô. Atlas JSON ghi crop/source/hash.

Lớp lóe X phụ trong preview là bản sao nguyên byte của cross.png đã được duyệt ở màn xuất hiện, hash SHA256 0fa910f42b6326a4a20afb2d5c66a55bea7fe2b6e9d6a948bc1e4e8136e8adc5; không làm lại artwork production. Đã xem hai bảng frame: tạo hình/màu và tầm tay còn nhất quán, bốn nhát phân biệt được, chân đặt trên cùng đường nền; đầu vệt quét thấp combo-b/1 đã nằm trong ô. Cần người dùng xem chuyển động trong preview trước khi chốt. Hai sheet là **candidate chờ duyệt**, chưa đặt trong docs/characters/boss-khan/animation/ hoặc public/assets/.

Chưa mở preview trong trình duyệt, chưa kiểm tra viewport hoặc chuyển động thực tế trong game; test/build/lint/typecheck/formatter NOT_RUN theo yêu cầu hiện tại. Chưa sửa src/game, AI, damage, hitbox, collider, spawn hoặc vị trí boss. Không suy mốc bốn nhát trong preview thành khung gây sát thương.
