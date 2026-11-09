# Task10.37 · Ninja Hỏa: Idle và Đi/Chạy với kiếm sau lưng

Ngày 2026-11-08. **CANDIDATE_PENDING_REVIEW**. Người dùng yêu cầu vẽ lại theo ba ảnh tham khảo tư thế, giữ hình ảnh nhân vật hiện tại. Chưa có lời duyệt art mới/timing mới.

- [Mở preview](preview.html)
- [Ảnh tổng hợp bốn bộ](overview.png)
- [Nguồn và hash](provenance.json)
- [Metadata review](review.json)
- Nguồn/prompt/plan: `integration/ninja-back-sword-locomotion/`.

## Art mới và cơ học tư thế

| Nhóm người dùng | Clip | Frame / nhịp preview | Điểm thể hiện |
| --- | --- | --- | --- |
| 1 · Idle kiếm sau lưng | idle | 8 / 4fps / 2000ms | Đứng tương đối thẳng, chân cố định, tay phải gần chuôi sau vai, tay trái thả; ngực/vai và khăn biến thiên nhẹ |
| 2 · Idle gặp quái | combatIdle | 8 / 5fps / 1600ms | Chân mở rộng hơn, gối chùng, trọng tâm hạ; tay trái nâng thủ, tay phải sẵn trên chuôi |
| 3 · Đi/Chạy | walk | 8 / 9fps / khoảng889ms | Thân tương đối thẳng, tay đối nhịp chân, bước và chuyển trọng lượng nhỏ hơn chạy |
| 3 · Đi/Chạy | run | 12 / 15fps / 800ms | Thân nghiêng trước, tay phải giữ chuôi, tay trái gọn; nhịp chạm đất/nén/đạp/bay/đưa chân tới và chuẩn bị tiếp đất |

Các tên giai đoạn là chủ đích authoring để review, chưa phải sự kiện physics/hitbox. Cần duyệt chuyển chân, cảm giác vòng lặp và độ lệch bàn tay–chuôi khi phát trước khi publish. Không suy FPS preview thành tốc độ di chuyển trong game.

Giữ mục tiêu tạo hình Ninja Hỏa đen/đỏ, khăn đỏ, mặt nạ, tay trần và giáp bạc. Kiếm/bao kiếm nằm trên lưng theo yêu cầu, không cầm lưỡi kiếm hở hoặc thêm kiếm hông. Ảnh ninja xanh chỉ hướng dẫn cơ học tư thế.

## Output và đối chiếu

Ba atlas RGBA: `idle-atlas.png`1536×1280 (hai Idle), `walk-atlas.png`1536×640, `run-atlas.png`1536×960. Mỗi ô384×320, pivot192,289, mật độ160px/world unit. Generator dùng một scale mỗi sheet, mốc đất theo hàng; giữ độ nâng ở các pose chạy bay, không fit từng frame theo alpha bounds. Kích thước nguồn và công thức ở README authoring/plan.

Preview mở trực tiếp bằng file://, không cần server/dependency; có bốn nút nhóm, phát/dừng, từng frame, tua, tốc độ, phóng, nền, mốc chiều cao và so sánh. Bên trái chọn Idle gốc, clip cũ tương ứng hoặc Idle mới. Art cũ được map theo tiến độ vòng để đối chiếu hình, không đại diện timing runtime cũ. Bộ cũ chưa có walk/combatIdle riêng: lựa chọn so clip cũ dùng run cho walk và idle cho combatIdle.

Ảnh đối chiếu được copy vào `reference/` để snapshot tự chứa. Bản Idle gốc là ảnh tham chiếu; clip cũ lấy từ atlas locomotion production đang có trong workspace. Preview không tự chuyển Idle khi phát hiện quái.

## Kiểm tra thực tế và giới hạn

- Đã xem ảnh tổng hợp và cả ba atlas sau chuẩn hóa: các nhân vật nằm trong ô; tư thế đứng/cảnh giác/đi/chạy phân biệt được; chạy có khoảng bay trên mốc đất.
- Chrome tải file preview, hiển thị đủ bốn lựa chọn, các điều khiển, trạng thái Idle và bộ frame. Nội dung tiếng Việt hiển thị đúng. Chưa xác nhận toàn chuyển động/tất cả lựa chọn và độ mượt bằng mắt trong browser; không ghi nhận là nghiệm thu animation.
- Test/build/lint/typecheck/formatter: **NOT_RUN**, theo phạm vi art hiện tại.
- Chưa thay ảnh/JSON production, src/public, physics/input/AI/phát hiện quái hoặc runtime. Chưa commit/merge/push. Giữ các thay đổi chưa commit từ task trước.

Task này tạo nguồn mới, generator, snapshot/preview và cập nhật trạng thái tài liệu; không publish candidate. Task10.35/10.36 về attack giữ nguyên.
