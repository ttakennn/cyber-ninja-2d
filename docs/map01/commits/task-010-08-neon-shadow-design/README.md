# Task10.8 — tạo hình Sát Thủ Bóng Neon

Baseline4a693a4, nhánh codex/task-010-enemy-art. Người dùng giao quái thường02: ranged/cơ động trên cao, ninja dễ thương tinh nghịch tím đen, khăn che mặt, mắt đỏ nhẹ, hai đoản đao và phi tiêu neon.

## Kết quả

- [PNG v1](assets/neon-shadow-v1.png), [preview](preview.html), [ảnh so kích thước](comparison.png). Một pose toàn thân, hai dao ở hai tay, phi tiêu tím hồng ở đai; giữ ngôn ngữ texture/shading sprite2D dự án.
- Preview tự chứa PNG/reference/data.js, có nền đêm/sáng/caro và tỷ lệ88/92/100% để review. Mặc định88% so Ninja Hỏa; đây là đề xuất ngoại hình chưa được duyệt. Ảnh Ninja và Sói Điện được copy nguyên byte làm tham chiếu.
- PNG thực tế1254×1254 RGBA; alpha0:1166341px, alpha1..254:405562px, alpha255:613px. Ngưỡng128 bbox(271,74,780,1111), pivot review(660.5,1184), scale chung0.198811881188 để thân cao220.88px. Không chỉnh pixel nguồn hoặc biến bbox thành collider.
- ImageGen built-in; sourceOriginal exec-af4276b2-a1fd-4593-a97d-0dac2513d9e7.png; SHA256523fe5c275efd2d2ea276fbc569672eadd59e65ec3a4004474883193ddd04fa3. [Prompt đầy đủ](../../../../integration/task-010-neon-shadow/prompts/design-v1.md), [plan](../../../../integration/task-010-neon-shadow/art-plan.json), [metadata](design.json).

File mới: integration/task-010-neon-shadow/, scripts/prepare_neon_shadow_preview.ps1, docs/characters/neon-shadow/{README.md,rules/SPRITE_SPEC.md}, thư mục snapshot này. Cập nhật chỉ mục nhân vật/Task10/trạng thái chung và Map01. Candidate không ghi vào docs/characters/neon-shadow/animation/; chưa có lời chốt để publish.

## Đã thực hiện / còn mở

Đã đọc rules, xem PNG Ninja Hỏa/Sói Điện và output ImageGen; sinh metadata/ảnh so bằng script authoring. Script ban đầu chạy trong PowerShell7 lỗi tham chiếu System.Drawing; đã chạy bằng Windows PowerShell5.1 theo workflow hiện có để sinh output. Xem ảnh so để review ngoại hình và đường chân; chưa thao tác HTML trong trình duyệt. Preview dùng drawImage, không getImageData/fetch/module để hỗ trợ mở local.

Chờ người dùng duyệt thiết kế, tỷ lệ, palette/vũ khí. Chưa có animation/atlas/skills, AI/damage/hitbox/spawn hoặc tích hợp runtime. Không sửa src/, public/assets/, art đã chốt hoặc gameplay. Test/build/lint/typecheck/formatter **NOT_RUN**. Chưa commit/merge/push.
