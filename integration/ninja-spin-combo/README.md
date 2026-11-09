# Ninja Hỏa — xoay người chém / Task10.36

Người dùng yêu cầu xoay toàn thân như sprite minh hoạ và vòng sáng nhẹ khi thực hiện combo từ đòn2 trở lên. Chỉ chỉnh Ground Attacks đang review; chưa runtime hoặc production.

## Nguồn

- `body-prompt.txt`: image_gen,5ảnh gần nhất gồm hai ảnh xoay/vòng người dùng vừa gửi, ảnh động tác local `integration/ninja-combo-separated/reference/ground-combo-motion.png`, body atlas10.35 và Idle gốc. Giữ danh tính Ninja Hỏa/kiếm cán vàng/lưỡi lửa; tạo16pose mới cho đòn2/3 với lưng3/4→lưng→nghiêng trái→ngực3/4→hướng đánh. PNG nguyên byte `body-source.png`,1254×1254/grid4×4.
- `ring-prompt.txt`: image_gen,5ảnh gần nhất (crop tham khảo, ảnh động tác, body10.35, Idle và body mới). PNG nguyên byte `ring-source.png`,1774×887/grid4×2,8frame mở/duy trì/tan. Palette amber/vàng cam, không dùng cyan/tím của nhân vật tham khảo; không gán buff/lá chắn.
- Hai lần tạo đều `transparent_background=true`, dùng ảnh hội thoại vì đường dẫn Windows không được image tool hỗ trợ ở lượt trước. Không vẽ lại ảnh bằng code.

## Authoring

`plan.json` là input; `scripts/prepare_ninja_spin_combo.ps1` sinh snapshot tại `docs/map01/commits/task-010-36-ninja-spin-combo/`.

Slot0..5 copy ARGB từ body atlas10.35, không resample, giữ đòn1/guard cũ. Slot6..21 lấy16pose mới, cùng một scale1.23, nguồn pivotX160 và mốc chân tường minh; không fit/scale từng frame, không mirror để giả quay. Output body2048×3072/22slot dùng, frame512²/pivot192,353/160px-unit. Mốc tay/đầu kiếm chỉ để căn VFX, không phải hitbox.

Atlas cung chém10.35 copy nguyên byte. Combo2 mới dùng cung ngang, combo3 dùng bổ chéo. Ring atlas2048×1024/frame512² riêng; preview tách nửa trước/sau cơ thể bằng clipping, không sửa PNG. Vòng mặc định32%/scale0.78, tâm cao115px so với chân; có điều chỉnh độ rõ trong UI.

HTML/JS nguồn tại đây; output mở file:// được. Giữ source/hash trong provenance; trạng thái CANDIDATE_PENDING_REVIEW. Chưa ghi vào docs/characters/ninja/animation/ hoặc public/assets. Script chỉ authoring output, không tự chạy test/build.
