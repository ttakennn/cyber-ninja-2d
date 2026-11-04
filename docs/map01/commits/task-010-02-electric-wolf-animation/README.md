# Task10.2 — Sói Điện: di chuyển, nhảy, leo và đánh thường

Hiện hành màn xuất hiện: Skill2 đã được chốt; [preview](preview.html) mở sẵn Xuất hiện từ khói điện,8pose body/8frame khói riêng, hiện dần/cử chỉ vào thế. Tổng10sheet/10clip, màn xuất hiện chờ duyệt, chưa spawn runtime. [Báo cáo mới](../task-010-07-electric-wolf-entrance/README.md). Các bản bàn giao bên dưới giữ lịch sử.

Hiện hành Skill2: người dùng đã chốt Skill1; [preview](preview.html) mở sẵn Điện Chấn Mặt Đất, body8pose/FX8frame riêng, minh hoạ điện lan/hết quãng/bị chặn. Tổng8sheet/9clip; Skill2 chờ duyệt, chưa runtime. [Báo cáo mới](../task-010-06-electric-wolf-ground-shock/README.md). Các trạng thái bên dưới giữ lịch sử.

Hiện hành: hurt đã được chốt; [preview](preview.html) mở sẵn Skill1 Điện Quang Đột Kích, cảnh báo500ms rồi lao/thu thế. [Báo cáo skill1](../task-010-05-electric-wolf-dash/README.md). Tổng6sheet/8clip, giữ ảnh đã duyệt; Skill1 mới chờ duyệt, chưa runtime. Các bản bàn giao bên dưới là lịch sử.

Mới nhất2026-11-04: người dùng đã duyệt Electric Baton v2, tiếp tục giao art trúng đòn. [Preview](preview.html) mở sẵn hurt8pose; tổng5sheet/7clip, các PNG cũ giữ nguyên. [Báo cáo hurt](../task-010-04-electric-wolf-hurt/README.md). Hurt chờ duyệt, chưa runtime; số liệu4sheet/6clip và trạng thái chờ duyệt bên dưới là lịch sử bàn giao10.2.

Cập nhật sau review: người dùng xác nhận đứng/chạy/nhảy/leo ổn, yêu cầu sửa riêng Electric Baton. Preview/bảng combo hiện làv2; [báo cáo mới và ảnh v1 lưu trữ](../task-010-03-electric-baton-v2/README.md). Những mô tả source/crop combo v1 bên dưới là lịch sử10.2.

Nhánh codex/task-010-enemy-art từ master067ce5e. Người dùng chốt tạo hình v1 và giao artwork động tác; **chưa yêu cầu tích hợp gameplay**. Ảnh tạo hình đã duyệt, animation mới vẫn candidate.

## Bàn giao

- [Preview động](preview.html): đứng/thở2pose, chạy6pose, nhảy8pose, leo lên4pose, xuống4pose và combo8pose với hai đòn khác nhau. Tổng4sheet/32ô,6clip.
- [Bảng di chuyển](locomotion-contact.png), [nhảy](jump-contact.png), [leo](climb-contact.png), [combo](combo-contact.png). PNG candidate/source/prompt/metadata ở integration/task-010-electric-wolf/animation/.
- Combo có lấy đà, vung ngang đầu tiên, vung chéo mạnh thứhai với vệt cyan lớn hơn, hụt đòn và hồi phục. Mốc vung2/5 chỉ đánh dấu art, không tạo event damage/hitbox.
- Leo dùng camera lưng để nhìn rõ hai tay; gậy cài sau đai, tay/chân đổi pha. Up/down là hai nhóm pose độc lập, không mirror cả người hoặc dùng lại cùng pose một tay cao. Đã chỉnh tay, chân và alpha bằng image_gen; giữ phiên bản trung gian/provenance.
- Giữ tạo hình/chiều cao tham chiếu88% Ninja; không recolor/resize Ninja, không sửa engine hoặc atlas runtime. Đề xuất frame512×512/pivot(256,416)/160px-unit được ghi riêng trong contract candidate.

## Authoring và rà ảnh thực tế

Đã dùng **image_gen.imagegen built-in**, lưu prompt/sourceOriginal. Đã chạy generator authoring scripts/prepare_electric_wolf_animation.ps1, xem4contact sheet. Phát hiện lớp nền mờ ở bản leo trung gian và vệt gậy vượt ô nguồn2; đã yêu cầu công cụ ảnh sửa alpha, mở sourceRect hợp lý trong plan rồi sinh lại. Đã đọc3pixel vùng trống ở output alpha cuối bằng0. Không sửa alpha bằng threshold/chroma key, không bỏ vệt điện để che lỗi.

Mỗi source sheet có một scale chung từ pose tham chiếu, không fit riêng pose theo bbox; chỉ căn chân bằng translation cho grounded, giữ anchor cho airborne/climb. SourceRect/anchor/translation/hash/size thực trong atlas.json và4JSON. Màu/kích thước nhân vật chính và PNG tạo hình v1 giữ nguyên.

Preview có thang đứng yên tách lớp, frame pause, tua, tốc độ0.25/0.5/1×, nền đêm/sáng/caro, zoom và so hình gốc. Không đọc pixel Canvas nên không phụ thuộc localhost cho lỗi CORS file://. **Chưa thao tác HTML trong trình duyệt**; không ghi là đã nghiệm thu browser hoặc gameplay.

## Mục còn mở

- Chờ người dùng review/chốt animation, nhất là nhịp chạy/nhảy, chuyển hướng leo và độ đọc combo. Timing/rung spacing/đường nhảy hiện là minh hoạ, chưa là thông số physics. Dáng mới vẫn có thể cần chỉnh khi ghép/chuyển clip thực tế.
- Chưa AI/điều kiện nhảy hoặc leo của quái, damage/knockback/recovery combat, collider, spawn, boss, special skills hoặc tích hợp runtime. Không tự áp giờ/cooldown/tốc độ từ Ninja chính cho quái.
- Test/build/lint/typecheck/formatter/validation gameplay **NOT_RUN**. Chưa commit/merge/push. Tạo hình được duyệt không đồng nghĩa animation mới hoặc gameplay đã được duyệt.
