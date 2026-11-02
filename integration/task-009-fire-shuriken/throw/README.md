# Ninja phóng phi tiêu — candidate sáu pose

Cập nhật sau review: người dùng đã duyệt và yêu cầu apply; xem [báo cáo runtime](../../../docs/map01/commits/task-009-04-fire-shuriken-runtime/IMPLEMENTATION.md). Phần candidate dưới là hồ sơ lượt tạo ảnh. Ảnh được copy nguyên byte vào public/assets/characters/ninja/skills/fire-shuriken/throw.png; không chạy lại script normalization hoặc sửa nguồn art. Chưa kiểm tra trong game.

[Preview động](../../../docs/map01/commits/task-009-03-fire-shuriken-art/throw-preview.html) · [So tỉ lệ](../../../docs/map01/commits/task-009-03-fire-shuriken-art/throw-contact-sheet.png) · [Prompt](image-prompt.md) · [Metadata](atlas.json).

Người dùng yêu cầu thêm động tác nhân vật sau khi xem projectile. Chỉ authoring/preview, chưa dùng trong runtime, chưa được duyệt. Không thay ảnh đi/chạy/nhảy/leo/combo hoặc kích thước nhân vật đang chạy.

- idle-reference.png: crop rect(4,4,384,320) từ public/assets/characters/ninja/flame-ninja-atlas.png; không resize.
- source-v1.png: ImageGen built-in, exec-4f6e2b8a-fac1-420b-87b3-b94165967362.png, lần đầu, không được chọn.
- source-v2.png: ImageGen built-in, exec-c0bdfacb-3093-412a-9eec-aa0b87f1b83d.png, source được chọn; cả hai PNG nguồn giữ nguyên.
- throw-atlas.png:1536×1024, sáu ô512×512. Một scale0.6 cho cả clip để khớp cỡ đầu/thân/chiều cao idle; dịch hông/chân theo metadata, không resize riêng từng frame. Padding/pivot(192,353) theo bộ attack đã có, vẫn160px/world unit.
- atlas.json: nguồn/kích thước/rect thật, các phép dịch, bounds alpha≥128, hash và timing đề xuất. Crop release rộng566px và pose tiếp458px vì tay source vượt grid512. Không repack hoặc sửa atlas canonical.
- review-data.js: dữ liệu tối thiểu cho preview chạy từ file local, không fetch JSON.
- scripts/prepare_ninja_throw.ps1 ở gốc repo: nguồn authoring phép crop/căn/ghép và contact sheet. Đã chạy chế độ authoring để tạo candidate; không phải test/build hoặc runtime integration.

Nhịp đề xuất85/100/65/70/90/140ms, release index3 (pose4), điểm thả(355,126) trong ô. Các số này chỉ minh hoạ để review, chưa chốt nhịp chơi, cooldown, damage, projectile speed hoặc collision. Pose nhân vật không chứa phi tiêu/lửa; preview ghép projectile riêng đúng thời điểm mở tay.

Đã xem ảnh contact sheet, đối chiếu idle gốc, căn chân và đủ đầu ngón tay. Source có RGB màu dưới alpha0; compositor dùng alpha và không đưa màu nền đó vào sprite. Chưa xem chuyển động trong trình duyệt/game. **NOT_RUN:** test/build/lint/formatter/typecheck. Chưa commit hoặc promote. Chờ người dùng duyệt động tác, tỉ lệ và chuyển tiếp.
