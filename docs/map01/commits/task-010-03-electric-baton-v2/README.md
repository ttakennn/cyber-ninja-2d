# Task10.3 — sửa riêng Electric Baton hai đòn

Ngày2026-11-04, nhánh codex/task-010-enemy-art. Người dùng xác nhận các động tác khác ổn; yêu cầu sửa combo8pose, nhất là4–5: tay vươn xa tự nhiên, vệt chém sáng dài/xa hơn. Đứng/chạy/nhảy/leo lên-xuống được ghi nhận duyệt art; Electric Baton v2 vẫn chờ review.

## Kết quả và preview

- [Preview hiện hành](../task-010-02-electric-wolf-animation/preview.html) mở sẵn clip Electric Baton. Giữ tua/frame kế/tốc độ/nền/zoom và timing cũ.
- [Trước](combo-before.png), [sau](combo-after.png). Frame0 giữ guard,1 xoay vai nạp,2 vung ngang với cung xa hơn,3 follow-through,4 nạp gậy cao/mở vai,5 vươn tay và quét cung chéo trắng-cyan lớn trước người,6 đuôi cung tàn/follow-through,7 thu thế. Xem lại cả chuỗi8pose, không chỉ tăng kích thước một vệt điện.
- Giữ chiều cao tham chiếu220.88px/88% Ninja, frame512×512/pivot(256,416)/160px-unit. Một scale cho toàn sheet, không kéo dài tay bằng biến dạng ảnh hoặc scale riêng đòn mạnh. Không sửa timing, damage/hitbox hoặc gameplay.

## Nguồn và authoring

Vẽ/chỉnh bằng **image_gen.imagegen built-in**. Hai prompt mới lưu tại integration/task-010-electric-wolf/animation/prompts/combo-v2.md và combo-v2-layout.md. Lượt đầu exec-c86724e5-7e58-4443-8658-79d78b0266fc.png ở source/combo-v2-first.png; lượt được chọn exec-86a2fa60-0488-44c0-918e-1e611ed1529b.png ở source/combo-v2.png. Giữ nguyên PNG gốc để truy vết. Không CLI/API fallback hoặc sửa artwork bằng hình vẽ mã.

Source được chọn thật1086×1448, chia2cột4hàng (543×362), khác khổ1536×2048 yêu cầu trong prompt. Khung nguồn rộng hơn để đủ tay/vệt sáng. Đóng lại về cùng atlas4cột2hàng2048×1024 để giữ contract candidate. Rect pose2/3 dừng ở dải trống sau chân; pose4/5 lấy thêm phần đầu dải trống phía trên để giữ cả gậy/cung điện. Đã xem vùng alpha quanh ranh giới trước khi chọn sourceRect, tránh lấy nhầm tia điện của hàng sau làm lệch điểm đặt chân.

Sửa animation-plan.json trước, generator thêm chọn OnlySheet và grid/source/image theo từng sheet. Đã chạy authoring `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/prepare_electric_wolf_animation.ps1 -OnlySheet combo`. Candidate mới ở candidate/combo-v2.png/.json, atlas.json/review-data.js trỏ vào đó; source/combo.png và candidate/combo.png/.json v1 vẫn giữ. Bảng pose hiện hành rộng1600px để không cắt cung điện mới.

## Phạm vi bảo toàn và kiểm tra thực tế

Đã xem source/reference và bảng pose sau đóng gói; vùng nền trống mẫu có alpha0. Đã đối chiếu SHA256 của3PNG candidate locomotion/jump/climb với hash metadata trước sửa: **cả3khớp, byte ảnh giữ nguyên**. Generator chỉ ghi combo và metadata chung, không sinh lại các ảnh đã duyệt; không sửa src/ hoặc public/assets.

Chưa thao tác HTML trong trình duyệt hoặc xem chuyển động mới ở runtime. Test/build/lint/formatter/typecheck/gameplay **NOT_RUN**. Bộ combo mới chờ người dùng review; chưa commit/merge/push. Không suy cung điện dài hơn thành hitbox hoặc tầm damage mới.
