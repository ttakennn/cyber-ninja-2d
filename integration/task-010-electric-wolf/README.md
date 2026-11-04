# Ninja Sói Điện v1 — tạo hình đã duyệt

Người dùng đã chốt v1 và giao vẽ bộ di chuyển/nhảy/leo/đánh thường. [Nguồn animation candidate mới](animation/README.md), [preview](../../docs/map01/commits/task-010-02-electric-wolf-animation/preview.html). Giữ PNG tạo hình nguyên byte; chỉ cập nhật trạng thái approval trong plan/metadata. Các ghi chú chờ duyệt dưới đây mô tả lượt tạo hình trước khi chốt, không phải trạng thái hiện hành.

Theo brief mới thay thế côn đồ bomber/jeans. Chỉ vẽ một pose toàn thân để chốt hình trước khi làm combo/skills. Nhánh codex/task-010-enemy-art, master baseline067ce5e.

PNG ở source/electric-wolf-ninja-v1.png copy nguyên byte từ **image_gen.imagegen built-in**, output exec-b5076fb3-b6f0-4a75-92bd-760866d85cca.png. Không dùng CLI/API fallback hoặc dựng nhân vật bằng SVG. Prompt nguyên văn tại prompts/design-v1.md; tham chiếu duy nhất về kỹ thuật/style là ninja-idle-reference.png, copy từ idle gốc hiện có, không sửa Ninja.

Kích thước output thật1254×1254, khác prompt1024×1024, lưu đúng trong design.json. PNG có alpha thật, giữ nguyên các pixel alpha nguồn. Không normalize/resize/crop/recolor file. Preview chỉ dùng một scale hiển thị đồng nhất với mục tiêu88% chiều cao Ninja (kể cả tai) và cùng đường chân; đây là đề xuất, chưa thành contract runtime/collider.

Nguồn authoring: art-plan.json. Chạy `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/prepare_electric_wolf_preview.ps1` để sinh design.json/review-data.js và comparison.png. Script đọc ảnh, ghi thông số thật/hash/alpha và vẽ bảng so tỉ lệ; không sinh lại artwork hoặc đưa vào public/assets. HTML sử dụng PNG local và classic JS, không fetch/module/getImageData nên không cần đọc pixel Canvas khi mở file://.

[Preview](../../docs/map01/commits/task-010-01-electric-wolf-design/preview.html), [báo cáo](../../docs/map01/commits/task-010-01-electric-wolf-design/README.md). Đã xem output gốc và bảng so tỉ lệ, chưa thao tác trình duyệt lượt này. Test/build/lint/typecheck/formatter NOT_RUN. Chưa duyệt ảnh/commit/merge hoặc tích hợp game.
