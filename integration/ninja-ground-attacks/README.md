# Ninja Hỏa — Ground Attacks / Task10.35

Người dùng chọn **Ground Attacks trước** trong lượt2026-11-08. Làm mới art/preview theo ảnh động tác tham khảo, chú trọng cơ học cơ thể, liên tục tay–kiếm và cung lửa thay đổi theo giai đoạn. Không triển khai cúi/lướt/treo/tường hoặc tích hợp game trong lượt này.

## Tạo ảnh và provenance

- `body-prompt.txt`: image_gen với4ảnh gần nhất: Ground Attacks người dùng khoanh đỏ, `integration/ninja-combo-separated/reference/ground-combo-motion.png`, attack1 đã chốt và Idle. Nháp đầu có mũi kiếm sát mép và lửa quanh kiếm quá rộng nên không chọn làm source pack.
- `body-fix-prompt.txt`: sửa ảnh vừa tạo, tham chiếu1ảnh gần nhất. PNG chọn giữ nguyên byte tại `body-source.png`,1254×1254 RGBA, grid4×4. Nháp đầu chỉ nằm trong lịch sử ảnh lượt tạo, không có file local riêng trong pack này.
- `fx-prompt.txt`: image_gen với5ảnh gần nhất: ảnh động tác, attack1, Idle và hai lượt body. PNG chọn `fx-source.png`,1448×1086 RGBA, grid4×3. Chỉ VFX, không có cơ thể hoặc vũ khí.
- Tất cả dùng `transparent_background=true`. Dùng ảnh hội thoại vì tool không nhận đường dẫn Windows ở lượt trước. Không tuyên bố giữ nguyên pixel ảnh cũ; giữ thiết kế/identity/chất lửa và đưa bản mới chờ duyệt.

## Authoring

`plan.json` giữ nguồn, frame/pivot, mốc chân/tay/đầu kiếm, FX và timing. `scripts/prepare_ninja_ground_attacks.ps1` đóng gói hai atlas, copy HTML/JS/ảnh đối chiếu vào `docs/map01/commits/task-010-35-ninja-ground-attacks/`, ghi metadata và hash. Không vẽ lại artwork bằng code.

Body dùng một scale230/176 cho16pose, frame512²/pivot192,353/160px-unit, dịch theo mốc chân tường minh; không fit/scale từng pose hoặc xoá thành phần ảnh. FXframe768² có mốc riêng theo hướng/giai đoạn; mốc nóng đặt gần đầu kiếm, đuôi thể hiện quỹ đạo. Mốc tay/đầu kiếm là estimate thủ công để review, không phải hitbox. Không tăng body theo bbox lửa.

Preview mở file:// bằng HTML/JS/PNG cạnh nhau, không fetch/dependency ngoài. Generator chế độ ghi là authoring; chưa chạy test/build/validation. Trạng thái CANDIDATE_PENDING_REVIEW, chưa thay thư viện art đã chốt hoặc public/assets/runtime.
