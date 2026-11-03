# Cửu Long Hỏa Trận — vành lửa mỏng và Ninja phát sáng

Ngày2026-11-03. Tiếp tục nhánh codex/task-009-player-attack-art, HEAD08294d4, giữ bộ art chưa commit trước đó. [Preview cập nhật](../task-009-11-nine-dragons-art/preview.html). Chưa apply runtime, thêm damage hoặc commit/merge/push.

## Yêu cầu và kết quả

- Bộ chọn **độ dày0.3×/0.5×/0.7×**, mặc định0.5× để review. Hệ số áp vào bề dày theo bán kính của vành lửa: giữ đường kính ngoài/silhouette, ép phần lửa vào một vành hẹp hơn ở phía ngoài. Giữ riêng bộ chọn kích thước1.5×/2×/2.5× của lượt trước; không dùng giảm opacity để giả độ dày, không giảm kích thước Ninja.
- Ninja sáng từ đầu thi triển, kể cả lúc rút/cắm kiếm và idle bên trong vòng7s. Thiết kế: nét viền vàng kem, quầng cam mềm, tăng sáng32%/bão hòa18% ở mức cực đại để giữ texture; pulse chậm1.2Hz với cường độ90–100%, không strobe. Có checkbox “Ninja phát sáng” để so với hình gốc.
- Mờ theo350ms cuối của aura; mốc kết thúc được lấy từ aura.startMs+durationMs, không dùng timer độc lập. Tại8400ms trở về cách vẽ sprite gốc, không còn filter/glow. Vòng lửa vẫn tồn tại1400..8400ms, không thay cooldown12s hoặc nhịp3đợt ban đầu.
- Thêm bảng canvas so cả3độ dày cùng lúc ở một mức đường kính và cùng nhân vật phát sáng. Tua thời gian, pause/slow-motion, nền và idle ghost cũ vẫn có.

## Cách thực hiện và phạm vi

- Không tạo lại PNG hoặc đổi phong cách. Điều chỉnh này là hiệu ứng render Canvas2D từ artwork đã có, không cần ImageGen mới. Atlas gốc/caster/idle vẫn giữ nguyên; cỡ ô, pivot, mật độ160px/world unit và vị trí nhân vật không đổi.
- integration/task-009-nine-dragons/review-effects.js: cache24frame offscreen (8pha×3độ dày) lúc tải trang. Tìm bán kính alpha ngoài theo từng hướng, remap bán kính vào vành mỏng, bilinear có alpha premultiplied để giữ mép lửa. Frame animation chỉ lấy cache, không remap pixel mỗi lượt render. Các canvas cache chỉ sống trong trang; không ghi đè atlas.
- Cùng helper vẽ nhân vật bằng filter brightness/saturate/drop-shadow, save/restore context từng lượt để hiệu ứng không lọt sang vòng lửa hoặc UI. Khi cường độ0, drawImage gốc; idle ghost vẫn không có glow để đối chiếu.
- art-plan.json là nguồn thông số độ dày và ánh sáng. Generator sinh review-data.js/atlas.json; chế độ previewEffectsOnly bỏ sinh các board ảnh cũ, giữ bằng chứng Task09.11/12. Đã chạy authoring bằng Windows PowerShell5.1, không chạy generator --check/test/build.
- HTML preview tại docs/map01/commits/task-009-11-nine-dragons-art/preview.html được cập nhật, giữ URL cũ. Không chỉnh src/, public/assets, physics, input, collider, camera, animation hoặc skill đang chạy trong game.

## Kiểm tra thực tế và giới hạn

- Đã mở preview mới trong IAB, thấy3lựa chọn, đổi0.3/0.5/0.7 và quan sát vành mỏng/nhân vật sáng. Đã bật/tắt checkbox, thấy trạng thái sáng0% khi tắt.
- Đã tua8300ms: aura còn0.10s, cường độ sáng27%; tiến4bước25ms đến8400ms: vòng đã tắt và sáng0%. Lúc mở trang ở200ms thuộc pha tụ hỏa, sáng100%. Đây là kiểm tra các mốc preview, không phải đã chơi thử runtime hoặc xem liên tục mọi frame.
- Console preview tại lượt xem không có warn/error được ghi nhận. Chưa nghiệm thu mọi viewport/thiết bị hoặc Safari; pixel-read của preview cần dùng URLlocalhost cùng nguồn, không bảo đảm file:// do giới hạn canvas của trình duyệt.
- Không xuất được PNG bảng so sánh qua API download của IAB; bảng canvas vẫn xem trực tiếp trong preview. Không dùng ảnh cũ làm bằng chứng hiệu ứng mới. Không thêm nút tải chưa kiểm chứng vào bản cuối.
- **NOT_RUN:** test/build/lint/typecheck/formatter, production/gameplay, damage/quái/boss. Chưa chọn độ dày/cỡ vòng cuối và chưa được người dùng duyệt bản glow mới. Các giá trị ánh sáng chỉ là thiết kế preview, chưa khoá quy tắc runtime.
