# Minh Vương Bạo Viêm — art candidate / Task09.3.3

Cập nhật sau review: người dùng đã duyệt và yêu cầu tích hợp bằng **E**, chuyển bám thang sang **F**; cooldown5s tính từ đầu cast, bị ngắt vẫn hồi. Đã promote ảnh nguyên byte qua scripts/promote_ninja_special_01.mjs; runtime-plan.json là nguồn runtime, [báo cáo](../../docs/map01/commits/task-009-08-special-01-runtime/IMPLEMENTATION.md). Chưa test/build/gameplay hoặc commit lượt mới; phần art candidate dưới giữ bối cảnh lượt tạo/preview, không phải nghiệm thu runtime.

Ngày2026-11-03. Yêu cầu người dùng: cooldown5 giây; bắn cầu năng lượng hắc hoả về trước, nổ khi va chạm, gây AOE cực lớn cho kẻ địch gần đó. Task này thiết kế artwork + preview; chưa tích hợp Q, damage/hitbox/quái hoặc cooldown runtime.

## Thiết kế

- Nhân vật: ninja hiện tại, giữ danh tính, đầu/thân/trang phục/cỡ. Sáu pose tụ lực hai tay, nén khí, đẩy cầu và hoàn thế; khác động tác ném phi tiêu.
- Orb: lõi than đen có khe magma đỏ thẫm, lửa cuộn đỏ/đỏ tím với viền cam nóng, ít ánh vàng/trắng. Bốn pha xoáy/lửa, vệt kéo phía sau khi bay; không có cánh kim loại.
- Explosion: điểm chạm nhỏ → bung lửa → đỉnh nổ tròn rộng → các cuộn hắc hoả tách ra → khói/tàn lửa tan. Tách khỏi caster/orb để sau này đặt ở vị trí va chạm bất kỳ, không vẽ sẵn quái hoặc mặt đất.

Cooldown5s là yêu cầu đã chốt. Nhịp thi triển, tốc độ bay, cỡ hiệu ứng ở preview chỉ là đề xuất mỹ thuật. Chưa chốt mốc tính cooldown, damage, radius AOE, resource, cast trên không/cúi, ngắt chiêu hoặc tương tác quái; không tự lấy bán kính ảnh nổ làm phạm vi damage.

Tạo bằng ImageGen built-in; source PNG và prompt riêng từng asset ở source/ và prompts/. Không thay atlas canonical, phi tiêu/combo, physics/input/timestep/camera hoặc dữ liệu level. Không chạy test/build/lint/formatter/typecheck trong task art. Bộ này cần người dùng review trước khi promote vào runtime.

## Xem và tái tạo

[Preview động](../../docs/map01/commits/task-009-07-special-01-art/preview.html) · [Bảng thiết kế](../../docs/map01/commits/task-009-07-special-01-art/overview.png) · [Báo cáo](../../docs/map01/commits/task-009-07-special-01-art/README.md).

Nguồn input: art-plan.json; source/{cast.png,orb.png,explosion.png,idle-reference.png}; prompts/{cast.md,orb.md,explosion.md}. Original IDs và hash của từng ảnh ImageGen nằm trong atlas.json. Ref caster là idle canonical + standing-release của bộ đã duyệt; ref orb là lửa của fire-shuriken đã duyệt, ref explosion là orb mới. Prompt ghi rõ vai trò ref; không dùng ref phi tiêu để biến orb thành vũ khí kim loại.

Chạy scripts/prepare_ninja_special_01.ps1 ở gốc repo chỉ khi cần authoring lại candidate từ source/plan. Script không gọi ImageGen và không ghi public/src. Candidate caster dùng một scale0.55, pivot(192,353), ô512×512,160px/unit; orb copy nguyên byte; explosion chỉ đệm ngang64px/ô từ384×512 thành512×512. Source giữ nguyên. Mọi kích thước/rect là số đo file thật; không sửa metadata giả theo kích thước yêu cầu trong prompt.

Output: candidate/cast.png1536×1024 (6 pose), candidate/orb.png1254×1254 (4 pha), candidate/explosion.png2048×1024 (8 pha), atlas.json và review-data.js. Cỡ orb240px/nổ640px và timing trong art-plan là đề xuất để so cạnh ninja, không phải quyết định gameplay. Không fit bbox từng pha VFX; growth/dissipation của vụ nổ được vẽ trong source.

Đã xem contact sheet/overview và nguồn, chưa chạy trình duyệt preview hoặc test/build. Chưa commit, duyệt art hoặc promote. **Không tự tích hợp Q từ folder này trước khi người dùng chốt bộ ảnh.**
