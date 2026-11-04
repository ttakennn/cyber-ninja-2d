# Skill1 — Điện Quang Đột Kích (art chờ duyệt)

Cập nhật sau bàn giao: người dùng “Oke chốt” Skill1 và giao vẽ [Skill2 Điện Chấn Mặt Đất](../task-010-06-electric-wolf-ground-shock/README.md). Trạng thái chờ duyệt bên dưới là lịch sử lúc bàn giao Skill1; approval art không phải nghiệm thu runtime.

Ngày2026-11-04, nhánh codex/task-010-enemy-art. Người dùng đã chốt art trúng đòn và giao vẽ Skill1: gậy điện lóe, hạ người cảnh báo0,5s rồi lao nhanh về phía người chơi; sát thương/đẩy lùi để bước tích hợp. Chưa commit/merge hoặc tích hợp game.

[Mở preview động](../task-010-02-electric-wolf-animation/preview.html) — mở sẵn Điện Quang Đột Kích, có dừng/tua/frame kế/nền/so tỉ lệ và bật/tắt “Minh hoạ lao tới”. Giữ cấu trúc repo khi mở file:// hoặc localhost. [Bảng8pose](dash-contact.png).

## Art và nhịp preview

| Pose nguồn | Nội dung | Nhịp ở tốc độ1× |
| --- | --- | --- |
| 0 | Guard so cỡ / tham chiếu chiều cao | Chỉ ở bảng pose, không tính thời gian cast |
| 1 | Hạ gối, nén lực, gậy điện bắt đầu sáng | 200ms cảnh báo |
| 2 | Thấp người, rút gậy về vai, lóe cyan | 300ms cảnh báo; cộng pose1 đúng500ms |
| 3 | Đạp chân bật lao, gậy đưa ra trước | 60ms minh hoạ |
| 4 | Đỉnh lao, thân nghiêng, vệt điện kéo sau | 75ms minh hoạ |
| 5 | Xuyên đà, chân trước đỡ lực | 85ms minh hoạ |
| 6 | Hãm đà, thu gậy | 160ms minh hoạ |
| 7 | Trở về thế thủ | 220ms minh hoạ |

Clip7frame/1100ms; pose0 chỉ dùng tham chiếu scale. Ngoài500ms cảnh báo theo yêu cầu, timing còn lại và quãng tịnh tiến200px ở zoom1× chỉ là quyết định trình bày để review art, chưa chốt tốc độ/cự ly/cooldown/recovery gameplay. Preview lặp có nghỉ450ms và trở về vị trí đầu; không mô phỏng AI đuổi mục tiêu hay knockback. Không tự thêm cú đánh thứhai, sóng điện mặt đất hoặc quái đối thủ.

Giữ mặt người/tai sói/tóc trắng/hoodie tím than/đai tím/quấn xám/gậycyan tay phải và tỉ lệ đã duyệt. Vệt điện đi về sau để đọc hướng lao; không dùng afterimage nhân vật lặp, không che mặt hoặc phóng to toàn nhân vật.

## Source, atlas và file thay đổi

- Công cụ image_gen.imagegen built-in; tham chiếu tạo hình v1 và bảng Electric Baton đã duyệt. Prompt nguyên văn: integration/task-010-electric-wolf/animation/prompts/dash.md.
- Output exec-8b9ba1c0-2bfb-40b1-9d35-4bc3521da006.png giữ nguyên byte ở animation/source/dash.png; kích thước thật1774×887 RGBA (prompt yêu cầu2048×1024). Không giả metadata kích thước.
- animation-plan.json thêm sheet/clip dash, ghi nhận hurt đã duyệt. Source được chia thành rect nguyên pixel444/442px rộng,444/443px cao, đúng ranh từng ô và nằm trong ảnh. Không resize source để ép grid. SourceRect/anchor/translation/hash thực được ghi ở candidate/dash.json và atlas.json.
- scripts/prepare_electric_wolf_animation.ps1: thêm dash; cho phép source kích thước không chia hết khi plan đã chỉ rõ sourceRects. Grid không có rect tường minh vẫn yêu cầu chia hết như cũ. Bảng dash dùng panel400px để thấy đủ vệt điện.
- Chỉ authoring -OnlySheet dash; candidate/dash.png2048×1024 với8frame512×512, pivot(256,416),160px/world unit. Scale chung0.6439650145772595 dựa guard0 về220.88px/88% Ninja; không fit riêng từng pose. Các pose thấp tự giảm silhouette do cúi, không làm to đầu/thân. Căn chân bằng dịch ảnh, không thêm physics.
- atlas.json/review-data.js được sinh từ plan; preview hiện có thêm bảng/clip/nhãn pha và minh hoạ tịnh tiến riêng dash. Hồ sơ nhân vật/TASK_STATUS/DECISION_LOG cập nhật duyệt hurt và trạng thái skill1.
- Ảnh locomotion/jump/climb/combo-v2/hurt đã duyệt giữ nguyên; không đổi src, public/assets, Ninja chính, map hoặc gameplay.

## Đã xem và chưa kiểm tra

Đã xem PNG tham chiếu, output mới và contact sheet đóng atlas; nền vùng trống nguồn alpha0, chân các pose được căn cùng baseline, vệt điện nằm trong frame. Đây là rà ảnh phục vụ tạo art, không phải nghiệm thu chuyển clip runtime. Chưa thao tác preview trong trình duyệt; test/build/lint/typecheck/formatter **NOT_RUN** theo yêu cầu hiện hành.

Chờ người dùng duyệt pose/nhịp/độ sáng và cảm giác lao. Chưa AI, điều kiện thi triển, collision khi lao, hitbox/damage/knockback, cooldown, spawn/boss hoặc Skill2 Điện Chấn Mặt Đất. Không gọi bản art này production.
