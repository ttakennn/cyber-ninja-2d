# Task10.1 — Ninja Sói Điện, tạo hình v1

Cập nhật sau review: người dùng đã chốt v1 và yêu cầu vẽ di chuyển/nhảy/leo/đánh thường. [Bộ animation mới](../task-010-02-electric-wolf-animation/preview.html). Phần bên dưới giữ báo cáo của lượt tạo hình trước khi được duyệt.

Người dùng đóng Task09/merge master; đã xác nhận master local067ce5e và tạo **codex/task-010-enemy-art**. Sau đó người dùng thay brief người bomber/jeans bằng Ninja Sói Điện và giới hạn lượt này: **chốt hình ảnh rồi mới làm skills**.

## Kết quả

- [Tạo hình gốc](../../../../integration/task-010-electric-wolf/source/electric-wolf-ninja-v1.png): một pose guard toàn thân, tóc/tai xám trắng, mặt người/nanh nhỏ, hoodie tím than, wraps và gậy cyan. Hơi chibi theo ngoại lệ riêng nhân vật mới; không đổi Ninja chính hoặc art map.
- [Preview](preview.html) có ảnh lớn và bảng so với Ninja, lựa chọn nền đêm/sáng/caro; [ảnh so tỉ lệ](comparison.png). Đề xuất88% chiều cao Ninja, kể cả tai, cùng đường chân. Không phải collider hoặc kích thước cuối đã được duyệt.
- Pose đề xuất hạ khăn dưới môi để thấy hai nanh; người dùng cần duyệt phần này cùng khuôn mặt/độ chibi/trang phục/vũ khí/tỉ lệ.
- Prompt/source/provenance/hash/alpha và kích thước thật nằm tại integration/task-010-electric-wolf/. Built-in image_gen.imagegen tạo PNG gốc1254×1254; copy nguyên byte vào repo, không resize/tạo lại ảnh để khớp kích thước prompt.

Các file mới: docs/TASK-010.md, docs/characters/electric-wolf/rules/SPRITE_SPEC.md, integration/task-010-electric-wolf/{art-plan.json,design.json,review-data.js,README.md,prompts/design-v1.md,source/*.png}, scripts/prepare_electric_wolf_preview.ps1, thư mục preview/báo cáo này. Cập nhật chỉ mục nhân vật/trạng thái/quyết định. Không sửa src/, public/assets hoặc Ninja hiện hành.

## Kiểm tra đã thực hiện và giới hạn

Đã đọc quy chuẩn/source loader/renderer để tách ảnh khỏi gameplay; xem PNG tham chiếu, output AI và comparison.png. Generator authoring đã đọc kích thước/alpha thật, hash, sinh metadata và bảng so, không sửa pixel source. Preview chỉ drawImage, không getImageData hoặc đọc pixel Canvas local. **Chưa thao tác preview HTML qua trình duyệt** trong lượt này.

Test/build/lint/typecheck/formatter/validation gameplay **NOT_RUN**. Không có pose/atlas animation được duyệt, chưa tạo skills/FX mới, damage/knockback/recovery/AI/hitbox/spawn hoặc boss. Hai đòn vung gậy vẫn chỉ là brief: lần2 mạnh hơn, nghỉ sau hụt; không tự chốt số liệu gameplay. Chưa commit/merge/push hoặc gọi production. Chờ người dùng chốt tạo hình trước bước tiếp.
