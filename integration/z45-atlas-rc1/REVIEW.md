# Review graybox Zone4–5
## Kết luận
Có thể chuyển sang tích hợp art RC1. Chưa đủ điều kiện duyệt production hoặc đóng Step09.
Review source và ảnh có sẵn, không điều khiển lại game, không chạy test/build/lint/typecheck/formatter.

## Baseline và bằng chứng
Code: 12244bf98183262bb312b164c4d550ad6e968945.
Docs cuối lượt: fe4ff7d5c6540053857394357ff70dec9b092d3a; đầu lượt thấy f58847b và 3 spawn JPG modified, sau đó bên ngoài cập nhật commit docs. Không ghi đè các ảnh đó.
Đã đọc generator five zones, design manifest/placements, parser, renderer, docs/MAP01-FIVE-ZONES.md, runtime-observations, log test/build.
Ảnh trực tiếp xem: noodle-shop1920, market540, arena1920/540, landing1280, arena-debug1024, noodle-shop540, exit1280. Không tuyên bố đã xem toàn bộ32 ảnh hoặc tự đi lại tuyến.
Log của Sol ghi388/388 test (30 file) và build thành công; bundle1,120.50kB, gzip158.68kB còn cảnh báo>500kB. Đây là bằng chứng build graybox, không xác nhận atlas mới.
File1920×1080 thực tế1920×1061; docs công khai khác biệt. DPR/browser version chưa có.

## Điểm đạt cho graybox
- 11 collider cũ và một thang giữ nguyên; thêm duy nhất đường64×1.5, tâm112,-3.25.
- Vùng80..88 để trống; runtime Sol ghi tiếp đất82.4,-1.7 không respawn.
- Zone4/5 nềnphẳngY=-2.5; core120..136 không thêm collider/foreground/boss.
- Generator mở grid288×32×6, giữ physics/cameraY; bỏ marker kết thúc cũ riêng alias mới.
- ID placeholder và asset tách rõ. Parser/renderer đã hỗ trợ sourceRect, không cần sửa engine để dùng atlas.
- Ảnh được xem cho thấy player không bị UI che ở vị trí đứng và help còn đọc được; không đủ bằng chứng để cam kết mọi trạng thái UI sạch.

## Việc còn mở, theo ưu tiên
| Mức | Phát hiện | Xử lý |
|---|---|---|
| P1 production | 12 asset còn là khung có chữ placeholder, không thể nghiệm thu mỹ thuật | Gói này cung cấp đủ12; thay20 placement theoID, bỏ placeholder tương ứng |
| P1 production | Chưa có bằng chứng chạy atlas mới, seams/alpha/UV/thứ tự lớp/chữ ở4viewport chưa xác nhận | Sol tích hợp rồi chụp ảnh runtime thật; không dùng ảnh ghép trong gói làm bằng chứng |
| P1 trước combat | Camera follow hiện không thấy toàn bộ core16unit ở4:3/portrait | Giữ gameplay hiện tại trong lượt art; quyết định camera/telegraph cho boss trước Task009 |
| P2 art | Crate/pallet source là nét phẳng lệch tường mới, rõ ở exit1280 và ảnh ghép | Đã bổ sung2PNG mới trong atlas, thay2placement Zone5; không thay prop ởA/B/C |
| P2 art/UI | Biển7unit có thể cắt chữ khi portrait, đặc biệt một dòng | RC1 dùng hai dòng Hủ tiếu / nam vang giữa biển; Siêu thị một dòng; cần kiểm khi player đứng trước quán |
| P2 art | Nền phố còn có nhịp lặp dày; ở landing1280 còn thấy mảng foundation đơn sắc dưới khối mái và prop mái cũ lệch phong cách | Theo dõi closure toànMap1; không coi packZ45 đã sửa toàn bộA/B/C |
| P2 evidence | 1920×1080 chưa đúng kích thước capture; DPR và browser thiếu; chưa thử mọi biến thể mép mái trênbrowser | Ghi đúng thông số và bổ sung khi nghiệm thu cuối |
| P2 perf evidence | arena-debug1024 có HUD52FPS; không có trace | Không kết luận lỗi hiệu năng từmộtframe, cũng không cam kết60FPS; đánh giá bản art nếu cần khi được yêu cầu |

## Giới hạn thiết kế giữ nguyên
Từ máiY3 xuống đườngY-2.5 là một chiều; không thể nhảy lại5.5unit với physics hiện tại. Không tự thêm thang.
Không boss sprite, AI, HP, hitbox, cổng khóa, win trigger hoặc checkpoint; tên sân boss chỉ chỉ định khu vực.
Tường phụ hai bên dùng chung một module; atlas không giải quyết thiết kế hình ảnh hoặc UI còn mở ởzonecũ.

