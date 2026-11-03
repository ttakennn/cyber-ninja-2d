# CỬU LONG HỎA TRẬN — vòng Bạo Viêm7giây

Ngày2026-11-03, nhánh codex/task-009-player-attack-art, HEAD08294d4. Tiếp tục bộ art chưa commit, không commit/merge/push trong lượt này. Cập nhật [preview hiện có](../task-009-11-nine-dragons-art/preview.html) theo yêu cầu mới; không apply runtime hoặc thêm sát thương.

## Hành vi preview

- Giữ350ms tụ hỏa,800ms xoáy rồng,250ms bạo viêm =1.4s. Sau đó vòng Bạo Viêm tồn tại7s: **1400≤t<8400ms**. Có nở, lửa/rồng xoay và nhấp nhô bằng atlas8pha lặp16fps; không phải giữ nguyên một ảnh nổ tĩnh.
- Chọn1.5×/2×/2.5× so với **khung Bạo Viêm gốc290px** của preview, tương ứng435/580/725px ở kích thước canvas1280×720. Cùng hệ số hai chiều; nhân vật giữ nguyên cỡ160px/world unit và được vẽ0.5× theo camera tham chiếu. Mặc định2× chỉ để xem; chưa coi là lựa chọn gameplay cuối.
- Nối4pha nổ đầu sang vòng lửa bằng crossfade150ms; aura nở trong250ms và mờ350ms cuối, đều tính trong7s. Xoay0.35vòng/s quanh thân; tâm trống alpha giúp đọc người. Không sửa PNG burst cũ hoặc đặt thêm mốc damage thứ4.
- Thêm nút đến pha vòng lửa3500ms và gần tắt8300ms; countdown riêng số giây vòng còn lại. Thanh tua/chu kỳ nhanh kéo đến9.4s, vẫn có tùy chọn đủ12s cooldown. Đổi kích thước ngoài pha aura tự chuyển vào pha này để xem; nút thi triển lại luôn xem từ đầu.
- Chuyển điểm chân dựng preview Y500→425 để mức2.5× không bị cắt khung720px; chỉ bố cục preview, không sửa vị trí/spawn/camera/physics trong game. Vòng125px nét đứt vẫn là tham chiếu ban đầu, không phải collider vòng lửa mở rộng.

## Art và file

- ImageGen built-in, prompt đầy đủ integration/task-009-nine-dragons/prompts/aura-loop.md; tham chiếu atlas burst hiện có và hình vòng rồng do người dùng gửi. Bản tham chiếu được lưu source/aura-reference.png.
- Source mới source/aura.png thực1774×887 (tool không xuất đúng2048×1024 như prompt). Generator dùng8rect443/444px được khai đúng trong art-plan.json, pad alpha về8ô512×512; candidate/aura.png cuối2048×1024, pivot(256,256). Không kéo giãn từng frame hoặc làm mới kích thước nhân vật.
- art-plan.json là nguồn timing/kích thước/lớp mới. scripts/prepare_ninja_nine_dragons.ps1 sinh atlas.json, review-data.js, candidate và board; đã chạy authoring bằng Windows PowerShell5.1. Metadata lưu hash, source rect và offset padding. Source/candidate caster, dragon, seal, burst tiếp tục dùng ảnh cũ.
- [aura-options.png](aura-options.png): so3cỡ vòng và cùng một Ninja. overview.png/cast-contact-sheet.png tại lượt này do generator sinh từ source cũ; không ghi đè bằng chứng Task09.11. Bảng3giai đoạn cũ vẫn minh họa phần đầu, không thay thế board7s mới.
- HTML preview tại docs/map01/commits/task-009-11-nine-dragons-art/preview.html cập nhật để link cũ của người dùng tiếp tục dùng được. Source/runtime game và public/assets không chỉnh.

## Sát thương và phần còn mở

Người dùng yêu cầu quái/boss chạm vòng sẽ chịu sát thương nhưng **xử lý sau**. Chưa có collider, damage/tick, enemy-ID tracking, Burn hoặc boss interaction của aura. Chưa đặt tổng sát thương mới:126HP trong brief cũ chỉ là ba đợt ban đầu+Burn tham khảo. Chưa tự chọn bán kính world theo hệ số ảnh hoặc thay phím E đang trùng skill cũ. Chuyển tiếp thu kiếm/tra vỏ vẫn chưa có clip riêng.

## Kiểm tra thực sự

- Đã xem artwork/source và board3cỡ, thấy alpha trống quanh/trong vòng trên nền navy. Đã mở preview mới qua **IAB**, đổi1.5×/2×/2.5× tại3500ms: cả3lựa chọn hiện đúng, cùng nhân vật, countdown còn4.90s.
- Đã dùng nút8300ms, thấy còn0.10s; tiến4bước25ms đến8400ms, trạng thái “Vòng lửa đã tắt”. Console preview ở lượt xem không ghi nhận warn/error. Không suy việc tua từng mốc thành đã quan sát liên tục mọi frame/cả7s ở mọi cỡ.
- **NOT_RUN:** test/build/lint/typecheck/formatter, game/runtime/production, combat/quái/boss và nghiệm thu mọi viewport. Đây là candidate art/preview, chưa người dùng duyệt cỡ cuối, chưa production hoặc commit.
