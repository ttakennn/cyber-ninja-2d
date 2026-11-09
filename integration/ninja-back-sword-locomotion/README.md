# Ninja Hỏa · kiếm sau lưng · nguồn authoring

Task10.37, ngày 2026-11-08. Candidate theo ba ảnh tư thế người dùng gửi: Idle thả lỏng, Idle cảnh giác và chạy. Đi bộ được tách thành chu kỳ riêng trong nhóm Đi/Chạy. Chưa được duyệt và chưa thay art production/runtime.

## Nguồn hình ảnh

- Ba ảnh ninja xanh do người dùng đính kèm chỉ tham khảo tư thế, nhịp thân thể và cách giữ chuôi kiếm; không lấy danh tính/trang phục/palette xanh.
- Đã xem trực tiếp `integration/ninja-run-hurt-revision/idle-reference.png` và bảng chạy `docs/map01/commits/task-010-29-ninja-run-hurt-art/run-poses.png` để giữ Ninja Hỏa đen/đỏ, khăn đỏ, tay trần và giáp ống chân bạc.
- Dùng `image_gen` tạo ba PNG nền trong suốt. Prompt nguyên văn ở `idle-prompt.txt`, `walk-prompt.txt`, `run-prompt.txt`. Các lần tạo sau tham chiếu cả ảnh mới trước đó để giữ tạo hình.
- Thay đổi trang bị được yêu cầu: chuyển kiếm và bao kiếm lên lưng; chuôi ở sau vai phải. Không thêm kiếm phụ ở hông. Tay phải giữ nhẹ chuôi trong hai Idle và chạy; đi bộ thả tay đánh nhịp.

## Chuẩn hóa

`plan.json` là input cho `scripts/prepare_ninja_back_sword_locomotion.ps1`. Source PNG được lưu nguyên; generator cắt theo lưới, dùng một hệ số scale cho cả sheet rồi đặt vào frame 384×320, pivot (192,289), 160px/world unit.

| Nguồn | Kích thước thật | Lưới | Frame | Scale |
| --- | --- | --- | --- | --- |
| idle-source.png | 1247×1261 | 4×4 | Idle0–7, cảnh giác8–15 | 251/269 |
| walk-source.png | 1774×887 | 4×2 | 0–7 | 248/348 |
| run-source.png | 1448×1086 | 4×3 | 0–11 | 230/278 |

Mỗi hàng dùng một mốc đất từ plan; không kéo từng bàn chân xuống đất hoặc fit riêng từng pose. Chạy frame3/9 (đánh số từ0) giữ khoảng bay so với mốc đất. Kích thước cơ thể ở pose gập/nghiêng được giữ theo artwork, không kéo thành chiều cao đứng thẳng.

Output review ở `docs/map01/commits/task-010-37-ninja-back-sword-locomotion/`. `provenance.json` lưu hash nguồn/prompt/plan/preview và atlas. Để tái tạo output authoring, chạy generator ở repo root bằng Windows PowerShell; thao tác này không publish asset.

Đã xem overview và cả ba atlas. Chrome tải được trang/dữ liệu/ảnh và hiển thị trạng thái Idle; chưa xác nhận toàn vòng chuyển động bằng mắt trong trình duyệt. Test/build/lint/typecheck/formatter NOT_RUN.
