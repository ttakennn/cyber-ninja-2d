# Sói Điện — art bị trúng đòn

Cập nhật sau bàn giao: người dùng đã chốt hurt (“Ok chốt”) và giao vẽ [Skill1 Điện Quang Đột Kích](../task-010-05-electric-wolf-dash/README.md). Nội dung chờ duyệt bên dưới ghi lại trạng thái lúc bàn giao hurt; approval art không phải nghiệm thu runtime.

Ngày2026-11-04, nhánh codex/task-010-enemy-art. Người dùng đã duyệt Electric Baton v2 (“Oke good”) và giao vẽ art bị trúng đòn. **Hurt mới là candidate chờ duyệt**, chưa tích hợp game hoặc commit.

[Mở preview động](../task-010-02-electric-wolf-animation/preview.html) — mở sẵn Trúng đòn / hồi thế; có dừng, tua, frame kế, tốc độ, nền sáng/đêm/caro và Ninja so tỉ lệ. Giữ thư mục trong repo; dùng file:// hoặc localhost, không đọc pixel Canvas. [Bảng8pose](hurt-contact.png).

## Động tác

0thế thủ →1giật vai/nhắm mắt →2ngả người chịu lực →3lùi nhẹ →4hạ gối lấy lại thăng bằng →5dựng người →6thu thế →7trở về thủ. Gậy vẫn cầm tay phải, tai/khăn/đai phản ứng theo người; không thêm máu, ngã chết hoặc đòn tấn công mới. Giữ danh tính/màu/độ nhỏ gọn đã duyệt.

Nhịp đề xuất xem art:100/60/85/110/100/100/100/140ms, tổng795ms, không loop trong clip; nút Lặp preview chỉ phục vụ duyệt. Đây chưa là hitstun, khoảng bất tử, knockback hoặc timing gameplay đã chốt.

## Nguồn và cách dựng

- image_gen.imagegen built-in, tham chiếu PNG tạo hình v1 đã duyệt. Output gốc exec-54adeb7c-b3c3-4e56-8c00-8e4167a1c52f.png được lưu nguyên byte tại integration/task-010-electric-wolf/animation/source/hurt.png;1536×1024 RGBA,4cột×2hàng. Prompt nguyên văn tại animation/prompts/hurt.md.
- Sửa animation-plan.json trước; thêm sheet/clip hurt, ghi nhận combo được duyệt. Generator scripts/prepare_electric_wolf_animation.ps1 thêm đúng sheet mới; chỉ authoring với -OnlySheet hurt, không sinh lại ảnh đã duyệt.
- Candidate hurt.png2048×1024,8frame512×512/pivot(256,416),160px/world unit. Một scale chung0.48017391304347826 từ pose đầu về220.88px (88% Ninja), không fit riêng từng frame. Chỉ dịch căn chân các pose tiếp đất. SourceRect/anchor/translation/kích thước/hash nằm trong candidate/hurt.json và atlas.json.
- Preview dùng metadata/review-data.js đã sinh, thêm bảng hurt và mở sẵn clip mới. Hồ sơ nhân vật/TASK_STATUS/DECISION_LOG cập nhật phạm vi duyệt; không sửa src, public/assets hoặc gameplay.

## Thực tế đã xem và giới hạn

Đã xem sheet tham chiếu và bảng8pose hurt sau đóng atlas; nền vùng trống trong source có alpha0, không có hình chữ nhật nền trên contact sheet. Các PNG locomotion/jump/climb/combo-v2 không được sinh lại. Chưa thao tác preview trong trình duyệt, chưa kiểm chuyển clip runtime hoặc phản ứng khi bị đánh từ phía còn lại/trên thang/trên không. Không tự thêm các trạng thái này trong lượt art hiện tại.

Test/build/lint/typecheck/formatter **NOT_RUN** theo yêu cầu hiện hành. Chưa AI, damage/hitbox, hit flash runtime, knockback, death, spawn, boss hoặc special skills. Chờ người dùng duyệt art hurt; không gọi bản này production.
