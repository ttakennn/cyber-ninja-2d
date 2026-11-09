# Task10.42 · bỏ cán cũ cạnh tay và nối gốc chuôi vào khăn/lưng

Ngày2026-11-08, candidate chưa duyệt. Người dùng đánh dấu đỏ phần cán cũ cạnh nắm tay và vàng khe hở gốc chuôi. Chỉ sửa hai vùng này trên snapshot10.41; không tạo lại cơ thể, mắt hoặc bụng.

## Nguồn

- Production vẫn là `docs/characters/ninja/animation/locomotion/`, contract384×320/pivot192,289/160px-unit; snapshot10.41 giữ đúng6pose và nhịp production.
- `hand-source.png` là crop6vùng55×37 tại(120,145) từ atlas10.41, phóng4× bằng nearest-neighbor để soi. `hand-before.png` là ảnh soi có nhãn.
- `hand-cleanup-source.png` do imagegen chỉnh từ đúng ảnh crop trên; prompt tại `prompt.txt`. Chỉ lấy alpha làm hướng dẫn bỏ đoạn cán nhô ra, không lấy màu/găng tay được AI vẽ lại thay vào cơ thể.
- `plan.json` ghi source snapshot, crop, giới hạn tay từng frame, độ hạ chuôi và độ chồng sau khăn. Generator `scripts/prepare_ninja_idle_contact_fix.ps1`; GIF packer riêng `scripts/assemble_ninja_idle_contact_review.mjs` giữ nguyên các task cũ.

## Authoring

Xóa pixel cán nâu/đen/red-wrap ngoài đường viền nắm tay. Phần contour ngoài được tỉa theo màu găng và ngón tay còn có trong snapshot, giới hạn trong vùng nhỏ153–179px chiềuY. Các pixel giữ lại vẫn mang nguyên RGBA của bản trước; không recolor hoặc vẽ mới cả cánh tay.

Hạ cả kiếm8px tương đối so10.41, giữ nguyên dịch vai từng pose. Điểm tiếp xúc lấy từ alpha thật của khăn/lưng tại trục kiếm mỗi frame, không dùng một đường cắt y58 cố định. Vẽ phần gốc đi sâu thêm3px sau lớp cơ thể, vì vậy không tạo khe alpha rỗng giữa chuôi và khăn; vẫn không lộ đầu bao bên dưới.

Output `docs/map01/commits/task-010-42-ninja-idle-contact-fix/`: atlas6pose, bảng soi hai vùng trước/sau, GIF trước/sau, preview và provenance. Đã xem bảng chi tiết cả6frame và atlas. Đầu/bụng/đai0pixel khác10.41 trong các ROI đã ghi; dọc trục nối chuôi–khăn0pixel hở. Đây là phép kiểm tra vùng cụ thể, không phải nghiệm thu toàn artwork/browser.

Chưa publish production/runtime, chưa sửa gặp quái/chạy hoặc commit/merge/push. Browser/test/build/lint/typecheck/formatter NOT_RUN cho task42.
