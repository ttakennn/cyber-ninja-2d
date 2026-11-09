# Nguồn sửa Idle chiến đấu — Task10.50

CANDIDATE_PENDING_REVIEW. [Preview](../../docs/map01/commits/task-010-50-ninja-combat-idle-pose-fix/preview.html), [hồ sơ](../../docs/map01/commits/task-010-50-ninja-combat-idle-pose-fix/README.md).

Nguồn chọn trong plan.json: pose-proportions-source.png,6pose vẽ liền khối, sau chỉnh alpha và tỷ lệ thân/đai. pose-source.png, pose-alpha-source.png cùng ba prompt lưu trình tự authoring, không phải production. Chuẩn tạo hình Idle10.47 đã được xem trực tiếp; ảnh ninja xanh người dùng gửi chỉ tham chiếu cơ học tư thế.

Chạy scripts/prepare_ninja_combat_pose_fix.ps1 để đóng atlas384×320/pivot192,289 trong reviewDirectory riêng. Một hệ số chung theo chiều cao chuẩn251px; tịnh tiến theo đế chân, không ghép lại từng mảng tay10.49. Chỉ có vòng giữ thế6frame, không tái dùng hai frame vào thế cũ. Chưa publish/runtime/commit.
