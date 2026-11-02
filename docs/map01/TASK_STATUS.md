# Trạng thái Map01

Phạm vi Map01; xem [trạng thái toàn dự án](../TASK_STATUS.md), [style riêng](rules/ART_STYLE_GUIDE.md) và [atlas riêng](rules/ATLAS_SPEC.md). Palette Map01 được giữ cho Map01, không giới hạn palette của map mới.

Cập nhật 2026-11-02. Baseline code/asset trước bộ quy chuẩn này: **4ce0146**; animation v2: **12959ca**. Repo ở master do người dùng đang làm việc tại nhánh đó; không suy rằng cần tự merge/push trong task sau.

| Hạng mục | Trạng thái thực tế |
| --- | --- |
| Phong cách/palette Map01 | Giữ baseline Map01 theo rules/; ninja dùng hồ sơ nhân vật chung, không ràng buộc art direction map mới |
| Leo ninja v2 | Người dùng chọn (“Ok good”), đã tích hợp và chuyển tên canonical; không đồng nghĩa nghiệm thu mọi trường hợp runtime |
| Props/BG canonical | Bộ mới thay bộ cũ tại4ce0146; backgrounds/, props/, flame-ninja-atlas.png |
| Bố trí Map01/5 zones RC3 | Đã tích hợp các sửa theo ảnh; chi tiết trong reports/MAP01-POLISH-RC3.md |
| Test/build/runtime mới nhất | Các lượt sửa RC3, ninja v2 và chuẩn hoá tên chưa chạy test/build/runtime; không dùng log cũ chứng nhận baseline này |
| Step09/final production | Chưa có nghiệm thu tổng thể mới đủ để khoá final production |
| buildings-shop.png | File backgrounds/buildings-shop.png chưa được theo dõi ở lúc lập trạng thái; chưa đặt runtime, chưa tự coi là asset duyệt |

Tác vụ hiện tại chỉ bổ sung tài liệu/rules; không đổi gameplay/asset và không chạy lệnh validation. Không tự commit/push nếu chưa được giao. Trước task mới đọc git status và source, giữ thay đổi chưa commit của người dùng.

Khi có thay đổi đáng kể: ghi baseline mới, phạm vi được duyệt, kiểm tra thực sự đã chạy/kết quả, NOT_RUN và mục còn mở. Không đánh dấu một task “approved/done production” chỉ vì đã sửa code hoặc tạo ảnh.
