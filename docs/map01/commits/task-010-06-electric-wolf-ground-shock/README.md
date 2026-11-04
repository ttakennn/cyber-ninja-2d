# Skill2 — Điện Chấn Mặt Đất (art chờ duyệt)

Cập nhật sau bàn giao: người dùng “Ok chốt” Skill2 và giao vẽ [màn xuất hiện từ khói điện](../task-010-07-electric-wolf-entrance/README.md). Trạng thái chờ duyệt bên dưới là lịch sử lúc bàn giao Skill2; approval art không phải nghiệm thu gameplay.

Ngày2026-11-04, nhánh codex/task-010-enemy-art. Người dùng đã chốt Skill1 và giao vẽ Skill2: đập gậy xuống đường, tạo điện chạy sát đất một đoạn ngắn, người chơi nhảy tránh; điện có thể bị vật cản chặn. Phạm vi lượt này là artwork/preview, chưa tích hợp gameplay hoặc commit.

[Mở preview động](../task-010-02-electric-wolf-animation/preview.html) — mở sẵn Điện Chấn Mặt Đất. Có tua/dừng/frame kế/tốc độ/nền/Ninja so cỡ, bật/tắt luồng điện và vật cản minh hoạ. Giữ cấu trúc repo khi mở file:// hoặc localhost; classic JS/drawImage, không đọc pixel Canvas. [8pose đập gậy](groundShock-contact.png), [8frame điện](groundWave-contact.png).

## Artwork

| Sheet | Các frame |
| --- | --- |
| groundShock | 0guard so cỡ;1lấy đà;2giơ gậy/tụ điện;3bổ xuống;4đầu gậy chạm nền;5giữ lực/phóng điện;6thu gậy;7hồi thế |
| groundWave | 0phát sinh;1–4lan sát nền;5hết tầm;6tóe khi bị chặn;7tan |

Giữ mặt người/tai sói nhỏ/tóc trắng/mắt cyan/hoodie tím than/đai tím/quấn xám và gậy ngắn tay phải. Không đổi danh tính, tỉ lệ đầu/thân hoặc cỡ nhân vật; không biến động tác này thành lao/nhảy hay thêm đòn thứhai. Điện trắng-cyan/viền tím lạnh, thấp và nằm trên đường baseline để đọc được hướng nhảy tránh. Body và FX tách sheet, không gắn sóng điện lớn vào atlas nhân vật.

## Preview và các lựa chọn chỉ để review

Clip nhân vật dùng pose1–7 với180/220/80/110/120/170/1000ms, tổng1880ms; pose0 chỉ dùng chuẩn chiều cao/bảng pose. Điện phát ở480ms, đúng bắt đầu pose4 đầu gậy chạm nền. FX sinh80ms, lan tối đa600ms/220px tham chiếu ở zoom1×, tan180ms. Guard cuối giữ lâu để xem điện lan/tan; vòng preview nghỉ450ms rồi chạy lại.

Mặc định có hình hộp ghi “Vật cản minh hoạ”; preview căn mép trước FX theo alpha bbox để dừng trước hộp, dùng frame6/7 tóe/tan và cắt phần vẽ tại mặt hộp. Tắt vật cản để xem frame5/7 khi hết quãng. Luồng điện sinh gần đầu gậy, không kéo nhân vật theo. Tắt luồng điện để xem riêng pose. Các thông số nhịp/quãng/box đều là quyết định trình bày art, **chưa là tốc độ/cự ly/collision/hitbox/cooldown hoặc luật nhảy của gameplay**; không tuyên bố đã kiểm collision trong game.

## Nguồn / pipeline / file thay đổi

- image_gen.imagegen built-in, transparent_background=true. Tham chiếu tạo hình v1 và bảng Skill1 đã duyệt; prompt nguyên văn tại integration/task-010-electric-wolf/animation/prompts/ground-shock.md và ground-wave.md.
- Output body exec-7b0ce408-698a-4696-aac2-a6ffa7a26585.png và FX exec-4cdec00b-5aeb-452f-a1f6-07a438a96e37.png giữ nguyên byte lần lượt ở animation/source/groundShock.png và groundWave.png. Cảhai1536×1024 RGBA thực,4cột×2hàng.
- animation-plan.json thêm2sheet và clip groundShock/effect, ghi nhận dash đã được duyệt. scripts/prepare_electric_wolf_animation.ps1 chỉ thêm tên sheet, hỗ trợ targetCellWidthPx cho FX và xuất effectScalePolicy; các sheet nhân vật cũ vẫn dùng cùng công thức scale.
- Authoring -OnlySheet groundShock rồi -OnlySheet groundWave; output mỗi sheet2048×1024,8ô512×512/pivot(256,416). Body một scale chung theo guard0 về220.88px/88% Ninja; FX một scale chung từ chiều rộng ô nguồn384 về256px (2/3), không fit riêng từng frame/bbox để tránh nụ điện nhỏ bị phóng to. Cảhai căn đáy bằng translation; sourceRect/anchor/translation/size/hash trong candidate JSON tương ứng.
- atlas.json/review-data.js sinh từ plan. Tổng8sheet/9clip:6sheet cũ được giữ, thêm body/FX Skill2. Preview hiện có thêm bảng/clip/điện tịnh tiến/vật cản minh hoạ; hồ sơ nhân vật/TASK_STATUS/DECISION_LOG cập nhật trạng thái.
- Không sửa src/public/assets/Ninja chính/map hoặc engine. Không thêm dependency, không commit/merge/push trong lượt này.

## Rà art và giới hạn

Đã xem ảnh tham chiếu, output và hai contact sheet sau đóng atlas. Pixel mẫu vùng trống nguồn alpha0, không có nền hình chữ nhật trên bảng pose; đầu gậy/chân sát baseline ở pose4, luồng điện nằm thấp. Các PNG locomotion/jump/climb/combo-v2/hurt/dash đã duyệt không sinh lại, hash giữ nguyên theo metadata. Chưa thao tác HTML trong trình duyệt hoặc kiểm chuyển clip runtime. Test/build/lint/typecheck/formatter **NOT_RUN**.

Chờ duyệt art Skill2. Chưa AI/điều kiện sử dụng/cooldown/damage/hitbox/knockback, collision điện với địa hình/vật cản thật, tương tác lúc người chơi nhảy hoặc spawn/boss. Chưa gọi bản này production.
