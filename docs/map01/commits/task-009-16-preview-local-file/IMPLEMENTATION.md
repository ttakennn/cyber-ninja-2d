# Sửa preview Cửu Long khi mở bằng file://

Nguyên nhân: review-effects.js gọi getImageData trên canvas vẽ từ PNG local. Trình duyệt xem nguồn file:// là nguồn không cùng origin cho việc đọc pixel, nên chặn bộ tạo các độ dày1.0/1.3/1.5/1.7 và khiến preview dừng ở bước tải.

Đã thêm scripts/prepare_nine_dragons_preview.mjs, sinh integration/task-009-nine-dragons/review-aura.generated.js chứa data URL từ nguyên byte candidate/aura.png. preview.html09.11 dùng dữ liệu này riêng cho aura khi mở file://; HTTP/localhost vẫn dùng PNG cũ. Không yêu cầu tắt bảo mật trình duyệt, không bỏ bộ chọn độ dày hoặc thay bằng hiệu ứng khác. Nếu thiếu/sai đường dẫn nguồn trong dữ liệu đóng gói, hiển thị lỗi rõ thay vì fallback âm thầm.

Giữ nguyên mọi PNG/atlas/pivot/scale/animation/glow, source runtime và các thay đổi tích hợp Q đang có. Chỉ đóng gói lại byte ảnh phục vụ đọc pixel trong preview; không chạy công cụ tạo ảnh.

Đã chạy generator authoring `node scripts/prepare_nine_dragons_preview.mjs` để tạo dữ liệu. Đã đọc source/diff; test/build/lint/formatter/typecheck, thao tác trình duyệt và console **NOT_RUN** trong lượt này. Chưa commit/merge. Mở lại đúng docs/map01/commits/task-009-11-nine-dragons-art/preview.html và tải lại trang để người dùng review; không di chuyển riêng HTML ra khỏi repo.
