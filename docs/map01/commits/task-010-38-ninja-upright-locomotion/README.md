# Task10.38 · sửa Idle đứng thẳng và chạy Ninja Hỏa

Ngày2026-11-08. **CANDIDATE_PENDING_REVIEW**. Người dùng bác hướng10.37 vì sai tư thế đứng và dáng chạy thô; yêu cầu lấy đúng kích thước/tỉ lệ Idle gốc làm chuẩn. Snapshot10.37 giữ nguyên để đối chiếu lịch sử.

[Mở preview](preview.html) · [Idle gốc và ba bộ mới](overview.png) · [Metadata](review.json) · [Nguồn/hash](provenance.json).

| Clip | Bản10.37 | Bản sửa10.38 |
| --- | --- | --- |
| Idle chưa gặp quái | Tay phải đặt trên chuôi sau vai | Hai tay buông như gốc, chân mở theo Idle gốc, thở nhẹ; kiếm/bao kiếm trên lưng |
| Idle gặp quái | Gối chùng, tay trái nâng thủ | Người đứng thẳng, tay trái buông; ánh nhìn/chin/ngực cảnh giác nhưng điềm tĩnh |
| Chạy | Dáng gập chân nhiều, tay trái thấp | Chân đạp/duỗi dài hơn, có pose mở sải; tay trái gần ngang ngực, tay phải giữ chuôi sau vai |
| Kích thước | Hệ số riêng mỗi sheet | Hai sheet dùng chung251/255 từ chuẩn chiều cao Idle gốc, không fit chiều cao pose chạy |

## Output

- Hai Idle8frame/clip dùng chung `idle-atlas.png`1536×1280; mỗi vòng2000ms ở4fps.
- Chạy12frame `run-atlas.png`1536×960; vòng800ms ở15fps.
- Tất cả ô384×320, pivot192,289 và160px/world unit. Timing chỉ đề xuất cho review; không điều chỉnh physics/tốc độ di chuyển.
- Overview hiển thị Idle gốc cùng ba bộ ở cùng mức phóng, cùng mốc chân. Preview có so cạnh nhau và tùy chọn chồng Idle gốc35%, tua/từng frame/tốc độ/nền để soi đầu–vai–hông–chân. Vệt kiếm/FX không thuộc task này.

## Kiểm tra và giới hạn

Đã xem trực tiếp Idle gốc, nguồn tạo ảnh, montage kích thước, overview và hai atlas sau đóng gói. Mốc đầu/chân Idle mới được đưa về khoảng38/289 như gốc; chạy giữ chiều cao tự nhiên của tư thế và khoảng bay, không phóng cơ thể để lấp ô. Nguồn/đo mũ và công thức chuẩn hóa ghi ở `integration/ninja-upright-locomotion/README.md`/plan; không gọi art mới là pixel-identical với gốc.

Chrome mở được preview mới, trạng thái Idle chạy qua các frame sau sửa điều khiển từ4clip về3clip. Chưa xác nhận toàn vòng bằng mắt, cả ba lựa chọn hoặc tùy chọn chồng ảnh trong browser; ảnh packed đã được xem riêng. Tính liên tục chân/bàn tay–chuôi và độ mượt vẫn cần người dùng review; tên pha trong metadata mô tả chủ đích art, chưa là sự kiện physics.

Test/build/lint/typecheck/formatter **NOT_RUN**. Chưa thay production PNG/JSON, src/public, input/physics/AI/trigger gặp quái; chưa commit/merge/push. Giữ các thay đổi từ task trước. Task này thêm nguồn/prompt/plan/generator/snapshot và cập nhật trạng thái tài liệu; chưa được duyệt để publish.
