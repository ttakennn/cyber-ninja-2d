# Quyết định đã chốt

Chỉ ghi quyết định có căn cứ từ người dùng; đề xuất chưa duyệt nằm trong trạng thái/mục còn mở, không tự nâng thành quy tắc. Các mục dưới tóm tắt lịch sử chat và source đã tích hợp, không phải log nghiệm thu runtime.

| Mốc | Quyết định | Căn cứ/ảnh hưởng |
| --- | --- | --- |
| Map01, trước RC3 | Giữ illustrated textured pixel art của bộ phố Việt ban đêm, ninja hiện có; không tự đổi gameplay để che ảnh | Các yêu cầu Task004..008 và sửa theo ảnh; metadata foreground/props là nguồn palette/contract |
| RC3/d88fc92 | Bố trí theo ảnh: ghế/đèn đổi chỗ cụm3 thùng; lan can chỉ trang trí; chậu/props mái căn chân, đổi scale theo từng yêu cầu | Generator/input hiện hành giữ quyết định cuối; không lấy tọa độ cũ trong báo cáo đè source |
| 2026-11-02/12959ca | Chọn artwork leo v2, chỉ thay hai clip leo; không tự tăng/giảm kích thước nhân vật | Người dùng “Ok good” sau bản v2; giữ frame/pivot/scale/FPS và pixel các clip khác |
| 2026-11-02/4ce0146 | Xoá bộ runtime cũ và dùng bộ v2 với tên canonical không suffix | Người dùng yêu cầu flame-ninja-atlas-v2 → flame-ninja-atlas, backgrounds-v2 → backgrounds, props-v2 → props; xem ASSET-CANONICAL-PATHS |
| 2026-11-02/bộ rules | Lưu và khoá art style, sprite, atlas, kích thước, palette/danh tính ninja trong repo; map/nhân vật sau phải kế thừa | Yêu cầu trực tiếp của người dùng trong task này; khác biệt mỹ thuật/kỹ thuật cần được giao/duyệt rõ |
| 2026-11-02/phân phạm vi rules | Làm rõ/thay giới hạn palette toàn game của bộ rules trước: style chung là Illustrated textured pixel art; từng map có màu, độ sáng/chủ đề riêng, Map02/03 có thể tươi sáng hơn. Danh tính/contract theo nhân vật, không áp khuôn ninja cho mọi nhân vật | Người dùng yêu cầu tách docs/rules/, docs/map01/rules/ và hướng mở rộng nhiều map/nhân vật; Map01 vẫn giữ palette riêng đã chốt. Không phải phép tự recolor/resize asset hiện có |

Nếu người dùng chốt thay đổi mới, thêm mục ghi yêu cầu, phạm vi, nguồn metadata và trạng thái kiểm tra; cập nhật spec liên quan. Không sửa/xoá lịch sử để giả rằng baseline cũ chưa từng tồn tại. Yêu cầu rõ ràng mới có thể thay quyết định cũ trong phạm vi được giao.

Task09: người dùng duyệt combo artwork/canvas đệm, yêu cầu commit rồi áp dụng. Đã lưu art ở1442907. Điều khiển được chốt: click trái một lần ra đòn1; click liên tiếp nối1→2→3; dừng0.5s thì bắt đầu lại. Chưa chốt damage/skills/quái/boss hoặc nghiệm thu runtime. Không merge master ở lượt này.

Task09.3: sau preview phi tiêu và sáu pose phóng, người dùng chốt “Ok good, apply vào nhân vật giúp tôi.” Tích hợp bộ ảnh đã duyệt bằng chuột phải theo Task2 được giao trước đó; giữ cỡ nhân vật. Nguồn/approval ở integration/task-009-fire-shuriken/runtime-plan.json, [báo cáo](map01/commits/task-009-04-fire-shuriken-runtime/IMPLEMENTATION.md). Chỉ animation/projectile visual; không suy thành duyệt damage/collision, cân bằng skill hoặc nghiệm thu runtime. Special Q tiếp tục tách riêng.

Sau art cúi dd98497: người dùng duyệt và yêu cầu apply, tốc độ phi tiêux2, chỉ tắt khi gặp vật cản; quái chưa có xử lý sau. Với phi tiêu không trúng, người dùng chọn “Dọn khi đã ra ngoài màn chơi”. Đã tích hợp crouch riêng, va chạm solid và cleanup ngoài level; [báo cáo](map01/commits/task-009-06-crouch-shuriken-runtime/IMPLEMENTATION.md). Không suy thành nghiệm thu runtime hoặc phép thêm damage/quái/special Q.
