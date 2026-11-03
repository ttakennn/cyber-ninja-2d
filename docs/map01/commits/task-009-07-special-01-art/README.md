# Task09.3.3 — Minh Vương Bạo Viêm / thiết kế art

Cập nhật sau review: art đã được duyệt và tích hợp bằng **E**, **F** bám thang, thay dự kiến Q cũ. Xem [báo cáo runtime](../task-009-08-special-01-runtime/IMPLEMENTATION.md); các mô tả candidate/chưa tích hợp dưới đây ghi lịch sử lượt artwork, không phải trạng thái runtime hiện tại.

Ngày2026-11-03. Đã commit phần cúi phóng phi tiêu/tốc độx2/solid collision tại **25d85cd — feat(ninja): support crouched shuriken throws and solid collisions**, nhánh codex/task-009-player-attack-art. Không merge/push. Task mới chỉ tạo art special1 theo yêu cầu và kế hoạch Task3→review→Task4 apply Q.

[Preview động](preview.html) · [Bảng thiết kế](overview.png) · [So tỉ lệ caster](cast-contact-sheet.png) · [Nguồn/atlas/prompt](../../../../integration/task-009-special-01/README.md).

## Bộ art mới

1. **6 pose thi triển:** tụ lực ở hông → nén cầu giữa tay → dồn lực → hai tay đẩy cầu → theo đà → hoàn thế. Giữ danh tính/trang phục ninja, không dùng lại động tác phi tiêu. Căn tỉ lệ đầu/thân và chân cạnh idle gốc.
2. **4 pha cầu hắc hoả:** lõi than đen, các khe magma đỏ thẫm, lửa cuộn burgundy/đỏ tím và viền cam nóng; vệt lửa kéo về sau khi bay. Phân biệt với phi tiêu kim loại. Tâm orb đăng ký thủ công theo lõi, không căn bbox vệt lửa.
3. **8 pha va chạm/nổ:** điểm chạm → nổ nhỏ → bung mạnh → cực đại → tách cuộn lửa → khói → tàn lửa → gần tan hết. Cùng điểm neo để giữ nổ tại vị trí va chạm; không vẽ sẵn quái/mặt đất.

Tạo bằng **image_gen.imagegen built-in**, mỗi asset một prompt/call; source nguyên bản và prompt được lưu. Art là candidate, chưa người dùng duyệt, chưa promote runtime. Nhịp/màu/kiểu thi triển/cỡ hiệu ứng là đề xuất để review, không tự nâng thành art contract đã chốt.

## Kỹ thuật và preview

- Source cast1536×1024 → candidate1536×1024, sáu ô512×512, pivot(192,353). Một scale0.55 cho toàn clip theo đầu/thân, chỉ dịch để căn hông/chân; vẫn160px/world unit, không fit từng pose. Timing minh hoạ120/140/100/90/100/150ms =700ms, release360ms.
- Source orb1254×1254, bốn ô627×627; candidate copy nguyên byte, pivot thủ công theo từng pha. Preview12fps, cỡ khung200/240/288px (mặc định240), không phải collider hoặc bán kính orb được chốt. Cần review độ ổn định lõi/pha lửa khi phát động.
- Source explosion1536×1024,4×2 ô384×512. Candidate2048×1024, mỗi ô512×512 bằng cách thêm64px padding ngang, không resize FX hay fit pha nhỏ thành pha lớn. Pivot(256,256), preview16fps; cỡ khung512/640/768px, mặc định640. Bán kính ảnh nổ không tự quyết định radius damage.
- Preview mô phỏng tụ lực, bay và nổ tại vật cản xám, chu kỳ cooldown5s. Có pause, tua timeline, tiến50ms, tốc độ chậm, nền sáng/tối, chọn cỡ effect và overlay idle. Không import engine hoặc bind Q, không có enemy/damage/hitbox/collision game. Cooldown5s là yêu cầu của người dùng; mốc bắt đầu cooldown ở preview chỉ minh hoạ để xem, chưa phải thiết kế runtime đã chốt.

Nguồn authoring: integration/task-009-special-01/art-plan.json + source/*.png; generator scripts/prepare_ninja_special_01.ps1 sinh candidate/*.png, atlas.json, review-data.js và hai ảnh báo cáo. Đã chạy **powershell -NoProfile -ExecutionPolicy Bypass -File scripts/prepare_ninja_special_01.ps1** để authoring, không phải test/build. Metadata ghi kích thước/rect thật, phép dịch, tool/original và SHA256, giữ provenance.

## File và kiểm tra

Thêm integration/task-009-special-01/{README.md,art-plan.json,atlas.json,review-data.js,source/,candidate/,prompts/}, scripts/prepare_ninja_special_01.ps1 và thư mục preview/báo cáo này. Cập nhật docs/TASK-009.md và docs/TASK_STATUS.md để ghi commit phi tiêu và art special đang chờ duyệt. Không sửa src/, public/, physics, input, camera, collision, sprite/pivot locomotion hoặc bộ phi tiêu/combo đang chạy.

Đã xem nguồn art và contact sheet/overview trên nền tối, đối chiếu cỡ đầu/thân/đường chân với idle và kiểm đủ tay/chân; bảng thiết kế không có quầng nền của các pixel alpha0. **NOT_RUN:** test/build/typecheck/lint/formatter, preview trong trình duyệt, gameplay/console. Không có ảnh/log nghiệm thu runtime mới, không gọi đây là final production. Art special hiện chưa commit hoặc promote; commit25d85cd chỉ lưu phần phi tiêu trước đó.

## Cần review/chốt trước Task4

- Dáng tụ lực/đẩy hai tay, chuyển idle→cast→idle, tỉ lệ và vị trí phát cầu.
- Màu hắc hoả, độ đọc lõi trên nền sáng/tối, độ ổn định khi lặp; nhịp nổ/tan và cỡ hiệu ứng.
- Khi sang tích hợp: điều kiện cast, ngắt chiêu, mốc tính cooldown5s, collision orb và các quy tắc damage/AOE cần thiết. Chưa tự đặt số damage/radius hoặc triển khai quái. Không coi chữ “cực lớn” là một số gameplay cụ thể.
