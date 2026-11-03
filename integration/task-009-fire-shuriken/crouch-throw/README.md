# Crouch phóng phi tiêu — bộ pose để review

Cập nhật sau review: người dùng đã duyệt và yêu cầu apply, tốc độx2, va chạm solid/dọn ngoài level. Đã promote qua scripts/promote_ninja_shuriken.mjs; [báo cáo runtime](../../../docs/map01/commits/task-009-06-crouch-shuriken-runtime/IMPLEMENTATION.md). Phần bên dưới giữ hồ sơ giai đoạn art candidate, không phải kết quả nghiệm thu game.

[Preview](../../../docs/map01/commits/task-009-05-crouch-shuriken-art/preview.html) · [So tỉ lệ](../../../docs/map01/commits/task-009-05-crouch-shuriken-art/crouch-contact-sheet.png) · [Prompt ImageGen](image-prompt.md) · [Metadata](atlas.json).

Yêu cầu: commit phần hiện tại, bổ sung artwork khi nhân vật ngồi/cúi phóng phi tiêu. Phần đứng/runtime đã commit20d4cd3; lượt này tạo bộ art cúi riêng để review, không promote hoặc đổi gate/runtime đã duyệt.

- crouch-reference.png: crop nguyên pixel rect(788,988,384,320), clip crouch của flame-ninja-atlas.png.
- standing-release-reference.png: crop rect(0,512,512,512) từ bộ đứng đã duyệt, làm tham chiếu danh tính/tay phóng.
- source-v1.png: PNG nguyên bản1536×1024 tạo bằng image_gen.imagegen built-in; exec-f2b28835-1ee5-4d8b-8f3a-59d1c70cf51d.png. Alpha thật; RGB màu ở pixel trong suốt không phải nền runtime.
- crouch-throw-atlas.png: sáu ô512×512/pivot(192,353), giữ160px/world unit, tương thích canvas đệm bộ đứng. Một scale0.48 cho toàn source theo đầu/thân của crouch gốc; chỉ dịch từng pose theo hông và đường chân, không co đứng thành cúi hoặc fit từng bbox.
- atlas.json: rect source thực (release584px, pose kế456px, recovery496px để giữ đủ tay/chân), scale, dịch, bounds alpha≥128 và SHA256. Không giả source là grid512 hoàn hảo khi ngón tay/toe vượt ô.
- review-data.js: dữ liệu preview. Generator authoring: scripts/prepare_ninja_crouch_throw.ps1 ở gốc repo.

Sáu pose: giữ crouch thấp, lấy đà, xoay vai, vung ngang, thả/mở tay, hạ tay và thu về guard. Điểm thả đề xuất(350,240) trong ô, thấp hơn bộ đứng. Timing85/100/65/70/90/140ms, release250ms, chỉ để review và so với nhịp đứng hiện có; chưa phải runtime mới.

Đã xem contact sheet cạnh crouch gốc và standing-release gốc ở cùng mật độ pixel để đối chiếu tỉ lệ, nền alpha và đủ tay/chân. Chưa xem animation trong trình duyệt/game; cần người dùng review chuyển tiếp crouch→phóng→crouch, đầu/thân, nhịp và vị trí thả trước tích hợp. **NOT_RUN:** test/build/lint/formatter/typecheck. Không sửa src/, public/, physics/collider/headroom, input hoặc clip đứng/đi/chạy/leo/combo.
