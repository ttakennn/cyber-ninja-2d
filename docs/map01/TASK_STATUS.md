# Trạng thái Map01

2026-11-04/Task10-library: toàn bộ art Sói Điện, kể cả xuất hiện từ khói điện, đã được chốt. Xem lại tại [thư viện nhân vật](../characters/electric-wolf/animation/preview.html), không cần vào commits; nguồn và báo cáo cũ giữ làm lịch sử. Đã gom atlas/JSON/VFX/bảng pose/tham chiếu bằng copy nguyên file, không đổi map/src/public/ảnh/timing/gameplay. Chưa runtime/test/build/browser tại vị trí mới/commit/merge. Các mục chờ duyệt bên dưới là lịch sử.

2026-11-04/Task10-entrance: Skill2 đã được người dùng chốt; [art xuất hiện từ khói điện](commits/task-010-07-electric-wolf-entrance/README.md) và [preview](commits/task-010-02-electric-wolf-animation/preview.html) mới chờ duyệt. Body/khói tách sheet, hiện dần rồi động tai/cười/xoay gậy vào guard; giữ art cũ/cỡ/pivot/map/src/public/gameplay. Chưa spawn/AI/runtime/test/build/browser/commit/merge. Các mục Skill2 chờ duyệt bên dưới giữ lịch sử.

2026-11-04/Task10-skill2: người dùng chốt Điện Quang Đột Kích; [art Skill2 Điện Chấn Mặt Đất](commits/task-010-06-electric-wolf-ground-shock/README.md) và [preview](commits/task-010-02-electric-wolf-animation/preview.html) mới chờ duyệt. Body/FX tách lớp, điện sinh tại điểm đập và minh hoạ bị chặn; giữ art cũ/cỡ/pivot/map/src/public/gameplay. Chưa runtime/collision/damage/AI/test/build/browser/commit/merge. Các mục Skill1 chờ duyệt bên dưới là lịch sử.

2026-11-04/Task10-skill1: hurt Sói Điện đã được người dùng chốt; [art Điện Quang Đột Kích](commits/task-010-05-electric-wolf-dash/README.md) và [preview](commits/task-010-02-electric-wolf-animation/preview.html) mới chờ duyệt. Cảnh báo hạ người/gậy lóe500ms, lao/thu thế minh hoạ; giữ art cũ/cỡ/pivot/map/src/public/gameplay. Chưa Skill2/runtime/AI/damage/knockback/test/build/browser/commit/merge. Các mục hurt chờ duyệt bên dưới giữ lịch sử.

2026-11-04/Task10-hurt: người dùng đã duyệt Electric Baton v2 và giao art trúng đòn Sói Điện. Có [8pose candidate/báo cáo](commits/task-010-04-electric-wolf-hurt/README.md), [preview](commits/task-010-02-electric-wolf-animation/preview.html); giữ PNG đã duyệt, chưa đổi map/src/public/gameplay. Hurt chờ duyệt, test/build/browser NOT_RUN, chưa commit/merge. Các mục combo chờ duyệt bên dưới giữ lịch sử.

2026-11-04/Task10.3: người dùng duyệt các động tác Sói Điện khác, yêu cầu sửa riêng Electric Baton. Đã có [combo-v2/preview](commits/task-010-02-electric-wolf-animation/preview.html) với tay và cung điện xa hơn; giữ byte art di chuyển/nhảy/leo. [Trước-sau/báo cáo](commits/task-010-03-electric-baton-v2/README.md). Combo mới chưa duyệt, chưa tích hợp/test/build/commit/merge.

Task10.2: tạo hình Sói Điện v1 đã chốt; đã có [preview animation mới](commits/task-010-02-electric-wolf-animation/preview.html) với đứng/chạy/nhảy/leo hai chiều/combo2đòn. Giữ tỉ lệ88% Ninja;4atlas candidate, chờ review, chưa special skills/runtime/AI/damage hoặc đổi map/collision/src. Task10 ở codex/task-010-enemy-art, chưa commit/merge/test/build. Task09 đã được người dùng chốt/merge master067ce5e; các mục bên dưới giữ lịch sử.

09.18: người dùng review UI/Cửu Long ổn và yêu cầu commit hiện trạng; thêm giảm tốc combo20% (speed0.8), giữ reset0.5s. [Bàn giao09.11–18](commits/task-009-18-combo-speed/IMPLEMENTATION.md); chưa merge/push hoặc chạy test/build/chơi thử phần giảm tốc. Các trạng thái chưa commit dưới đây là lịch sử từng lượt.

Sửa preview Cửu Long09.11 mở trực tiếp file://: aura dùng dữ liệu ảnh đóng gói để tránh lỗi getImageData; [báo cáo](commits/task-009-16-preview-local-file/IMPLEMENTATION.md). Giữ lựa chọn độ dày, artwork và runtime; chưa kiểm tra trình duyệt/test/build lượt sửa này.

UI Task09: H ẩn/hiện khung hướng dẫn phía dưới, tên chiêu bỏ khung/nền và nhỏ hơn2px; người dùng review ổn, đã commit **08294d4** cùng special1. [Báo cáo](commits/task-009-10-help-callout/IMPLEMENTATION.md). Chưa chạy test/build hoặc nghiệm thu game mới.

Task09 mới nhất: **Q / vòng2.0× / độ dày1.0× / cast1s**, aura7s/CD12s giữ nguyên. Phi tiêu và Minh Vương sáng cùng Ninja trong Cửu Long, fade chung350ms cuối; Q/E gộp một card/chữ nhỏ. Không đổi layout/collision/asset môi trường. [Báo cáo](commits/task-009-17-skill-ui-timing-glow/IMPLEMENTATION.md). Chưa damage/quái/boss, commit/merge hoặc nghiệm thu runtime; test/build/chơi thử/shader GPU **NOT_RUN**. Báo cáo/preview trước là lịch sử.

Phạm vi Map01; xem [trạng thái toàn dự án](../TASK_STATUS.md), [style riêng](rules/ART_STYLE_GUIDE.md) và [atlas riêng](rules/ATLAS_SPEC.md). Palette Map01 được giữ cho Map01, không giới hạn palette của map mới.

2026-11-03: Task09 special1 thêm HUD tên/countdown góc trái trên, tên chiêu mờ dần1.5s trên đầu nhân vật và tăng tốc orb lên9unit/s; [báo cáo UI](commits/task-009-09-special-01-ui/IMPLEMENTATION.md). Không đổi bố trí/collision Map01 hoặc artwork; đã commit08294d4, chưa merge, chưa chạy test/build hoặc nghiệm thu game mới. Trạng thái baseline môi trường bên dưới là lịch sử của lượt tài liệu2026-11-02.

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
