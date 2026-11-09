# Task10.35 — Ground Attacks, body/VFX riêng và chống spam

[Preview](preview.html) · [Body](body-atlas.png) · [Cung lửa](fire-slash-atlas.png) · [Ảnh ghép tĩnh](impact-registration.png) · [Nguồn/prompt](../../../../integration/ninja-ground-attacks/README.md) · [Plan](../../../../integration/ninja-ground-attacks/plan.json) · [Hash](provenance.json).

## Phạm vi và kết quả

Người dùng chọn **Ground Attacks trước** sau yêu cầu làm lại Ninja Hỏa theo ảnh minh hoạ, chú trọng cơ học cơ thể, liên tục tay–kiếm và cung lửa biến thiên. Chưa làm cúi/lướt/treo/tường. Màu cung khác trong vùng đỏ chỉ là tham khảo, chưa xác định là buff của game gốc hoặc gán tăng sức mạnh cho Ninja Hỏa.

- 16 pose body+kiếm: guard, lấy đà/gia tốc/chạm/theo đà và thu riêng; ngang→ngược lên→bổ chéo. Tay phải giữ kiếm, tay trái phối hợp ở đòn2/3; xoay hông/vai, vươn tay, chân trụ/hãm lực. Chờ duyệt anatomy và độ tự nhiên.
- 12 frame FX riêng, ba hướng và bốn giai đoạn: hình thành→đạt đỉnh→theo đà→tan. Giữ kiếm cán vàng, trắng vàng/cam/đỏ; không chuyển sang cyan/tím của nhân vật tham khảo.
- Bodyframe512²/pivot192,353/160px-unit/một scale230/176. FXframe768² và điểm căn riêng; render FX trước rồi body để tay/kiếm đọc được. Đã chỉnh từ đặt đuôi tại tay sang đặt mốc nóng gần đầu kiếm. Hai mức FX0.65/0.85 chỉ là hình ảnh, không đổi body/hitbox/damage.
- Preview một đòn, chuỗi1→2rồi dừng, combo đủ và tự thử; tua/frame trước–sau/tốc độ1×/0.5×/0.25×; chọn16pose/12FX; body-only/FX-only/ghép; đối chiếu Idle hoặc art cũ theo tiến độ, không giả lập timing runtime cũ.
- Bảng quy tắc, slider hồi sớm/cuối, nhật ký click nhận/bỏ và nút mô phỏng46click cách65ms trong khoảng3giây. Đổi thông số bắt đầu lại bản xem.

## Nhịp chống spam đề xuất

| Quy tắc | Mặc định |
| --- | --- |
| Đòn chờ | Tối đa1, chỉ nhận trong cửa sổ nối |
| Nối1→2 | 160–410ms của đòn1 |
| Nối2→3 | 120–360ms của đòn2 |
| Quá sớm/trễ, thu kiếm/hồi | Bỏ click; không tích vào combo sau |
| Dừng sớm | Thu guard rồi nghỉ220ms |
| Sau đòn3 | Nghỉ320ms, đợi lần nhấn mới |
| Giữ chuột/J | Không tự lặp; bỏ key-repeat |

Phần chính đòn1=450ms, thu170ms; đòn2=395ms, thu175ms; đòn3gồm thu685ms. Combo đủ450+395+685+320=1850ms. Đánh đơn1/2/3 lần lượt840/790/1005ms. Tất cả là đề xuất preview, chưa chốt gameplay.

## Đã xem và giới hạn

Đã đọc quy tắc/source/plan và xem tham chiếu; tạo body2lượt/FX riêng, lưu nguồn/prompt/hash. Đo mốc chân; cả16ô body không có pixel alpha>32 chạm đường cắt. Đã chạy generator ghi authoring và xem ảnh ghép ba điểm chạm để căn FX. Ảnh ghép tĩnh không phải ảnh browser hay bằng chứng animation.

Đã mở đúng URL file Task10.35 trong **Chrome**: atlas/Idle/art cũ tải xong,16nút pose/12nút FX xuất hiện, demo tới1850/1850ms; screenshot cửa sổ cho thấy Idle và guard trên canvas. Đây là xác nhận trang tải/script chạy, chưa duyệt chuyển động từng đòn.

**Chưa xác nhận đầy đủ tương tác chống spam và cảm nhận animation trong Chrome.** Lệnh click/phím qua công cụ chưa đổi trạng thái nút như kỳ vọng; không dùng làm bằng chứng chống spam đã đạt. Chưa kiểm console/mọi pose/viewport. Người dùng có thể thử trực tiếp nút/sliders.

Test/build/lint/typecheck/formatter **NOT_RUN**. Chưa thay art production/runtime, chưa damage/hitbox/root motion/cường hóa; chưa commit/merge/push. Giữ sửa đổi có sẵn từ task trước, không ghi đè snapshot10.33.

File mới: `integration/ninja-ground-attacks/`, generator `scripts/prepare_ninja_ground_attacks.ps1`, output/báo cáo tại đây. Chỉ thêm link/trạng thái vào TASK_STATUS toàn dự án/Map01, README thư viện Ninja và ghi quyết định phạm vi trong DECISION_LOG; không đổi PNG/metadata production hoặc src/public.
