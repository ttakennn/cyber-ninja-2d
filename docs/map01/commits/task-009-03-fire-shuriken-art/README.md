# Task09.3.1 — art phi tiêu hệ hoả

Cập nhật sau review: người dùng đã duyệt bộ pose và yêu cầu apply; đã tích hợp click phải tại [Task09.3.2](../task-009-04-fire-shuriken-runtime/IMPLEMENTATION.md). Nội dung dưới ghi lại giai đoạn artwork/preview, không phải kết quả kiểm tra runtime.

[Mở preview](preview.html) để xem bốn pha, đổi nền, tốc độ và cỡ projectile cạnh ninja. [Atlas](../../../../integration/task-009-fire-shuriken/fire-shuriken-atlas.png), [metadata](../../../../integration/task-009-fire-shuriken/atlas.json), [prompt](../../../../integration/task-009-fire-shuriken/image-prompt.md).

Đã xem PNG tạo ra và lưu nguyên bản1254×1254; bốn ô627×627. Dùng điểm neo thủ công theo tâm vòng kim loại, không căn bbox vệt lửa. Chưa duyệt cỡ/độ ổn định hình khi phát liên tục; không khẳng định bốn hình là phép quay cứng tuyệt đối của cùng một mesh. Cần xem animation trước khi chốt cho Task2.

Phạm vi ban đầu: tạo artwork projectile và preview cho nhân vật ninja hoả. Sau khi xem, người dùng nhận xét phi tiêu khá đẹp và yêu cầu vẽ thêm động tác phóng. Đã bổ sung sáu pose tại [preview động tác](throw-preview.html), [ảnh so tỉ lệ](throw-contact-sheet.png), [hồ sơ nguồn/căn ảnh](../../../../integration/task-009-fire-shuriken/throw/README.md). Không đổi atlas runtime, không gắn chuột phải, không thêm damage/hitbox/cooldown.

Style tham chiếu: public/assets/characters/ninja/attacks/attack_1.png. Định hướng candidate: phi tiêu bốn cánh bằng thép navy tối, cạnh đỏ nóng, lõi ember, lửa cam–vàng với điểm sáng trắng nhỏ; giữ silhouette kim loại đọc được, không dùng màu/lõi cầu năng lượng của special-skill-01.

Art tạo bằng image_gen.imagegen built-in, nền alpha, bốn pha xoay/lửa. Tệp nguồn được giữ trong integration/task-009-fire-shuriken/, prompt và metadata đi kèm. Ảnh là candidate để người dùng duyệt; không tự gọi là final hoặc đã nghiệm thu trong game.

## Các task kế tiếp theo người dùng

1. Task1 (hiện tại): art phi tiêu + động tác phóng → review. Sáu pose và nhịp phát đang là candidate.
2. Task2: sau khi chốt art, tích hợp phi tiêu vào nhân vật bằng chuột phải; chốt/tích hợp logic cần thiết trong task đó.
3. Task3: art special-skill-01 “Minh Vương Bạo Viêm” → review. Đặc tả đã nêu: cầu năng lượng hắc hoả bay tới trước, nổ khi va chạm, sát thương AOE lớn, cooldown5 giây. Chưa tự chọn damage/radius hoặc thực hiện trong lượt phi tiêu.
4. Task4: sau khi chốt ảnh special, tích hợp bằng phím Q.

Nhân vật và các sprite hiện tại giữ nguyên kích thước, pivot và màu. Preview hiển thị projectile cạnh ninja ở nhiều cỡ để người dùng chọn; đó là cỡ đề xuất của vật thể mới, không thay scale ninja hoặc cấu hình runtime.

**NOT_RUN:** test/build/lint/formatter/typecheck, trình duyệt preview và gameplay. Chỉ thực hiện authoring/xem artwork; không merge hoặc push.

## Bổ sung động tác phóng

Đã dùng ImageGen built-in với crop idle gốc làm tham chiếu. Bộ pose: lấy đà, xoay vai, vung tay, mở tay thả, hạ tay và thu thế. Atlas candidate1536×1024, sáu ô512×512, pivot(192,353), giữ mật độ160px/world unit giống bộ attack. Canvas đệm không làm tăng kích thước nhân vật. Source được đưa về tỉ lệ bằng một hệ số0.6 cho toàn clip, chỉ dịch từng pose để căn chân/hông; không fit từng silhouette hoặc suy collider từ ảnh.

Đã xem contact sheet trên nền tối để đối chiếu với idle gốc, kiểm đủ tay/chân và chân sát đường nền. Ảnh nguồn có RGB màu ở vùng alpha0; bản ghép dùng alpha thật, không có quầng nền đó. Pose release nguồn vượt ô grid đề nghị, nên generator khai báo rect rộng566px cho pose này và rect458px cho pose kế; không cắt mất ngón tay hoặc tự gọi source là grid512 hoàn hảo. Canvas candidate sau ghép vẫn đồng nhất512×512. Prompt/source/rect/scale/translation/hash lưu kèm.

Preview có so idle gốc, pause/step, phát chậm, nền sáng/tối và ghép projectile tại pose4. Timing550ms +600ms idle chỉ phục vụ review, không phải cooldown hoặc logic đã chốt. Chưa xem preview động trong trình duyệt; cần người dùng duyệt chuyển tiếp idle→ném→idle, tư thế tay và nhịp thả trước Task2. Không tuyên bố ảnh đã giữ mọi nét vẽ chính xác như nguồn: đây là pose mới tạo theo tham chiếu, cần review danh tính/độ liền mạch.

File bổ sung: integration/task-009-fire-shuriken/throw/{idle-reference.png,source-v1.png,source-v2.png,throw-atlas.png,atlas.json,review-data.js,image-prompt.md,README.md}; scripts/prepare_ninja_throw.ps1; throw-preview.html và throw-contact-sheet.png trong thư mục báo cáo này. Preview projectile cũ được thêm liên kết; docs/TASK-009.md và docs/TASK_STATUS.md cập nhật phạm vi. Không sửa src/, public/ hoặc input/physics/animation game; chưa commit, merge hoặc push.
