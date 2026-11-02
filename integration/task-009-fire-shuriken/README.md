# Fire shuriken — Task09.3.1

Cập nhật sau review: người dùng đã duyệt và yêu cầu apply. Nguồn phê duyệt/thông số runtime tại [runtime-plan.json](runtime-plan.json), promote bằng scripts/promote_ninja_shuriken.mjs; [báo cáo tích hợp](../../docs/map01/commits/task-009-04-fire-shuriken-runtime/IMPLEMENTATION.md). Các mô tả candidate và metadata bên dưới giữ bối cảnh lượt artwork; không phải trạng thái nghiệm thu runtime. Đã copy ảnh vào public, chưa test/build/gameplay.

Art candidate bằng ImageGen built-in, lưu PNG nguyên bản, chưa promote vào public hoặc load trong game. Xem [preview](../../docs/map01/commits/task-009-03-fire-shuriken-art/preview.html).

File thực1254×1254, bốn ô627×627; không resize về kích thước prompt1024×1024. atlas.json ghi rect và điểm neo thủ công tại tâm vòng kim loại để giảm trôi do vệt lửa bất đối xứng. Không fit/resize từng frame riêng; cần review độ ổn định lõi và hình kim loại khi xoay trước tích hợp.

Prompt, công cụ, nguồn gốc và SHA256 đã lưu. Cỡ64/96/128px trong preview chỉ đề xuất cho projectile mới để so với ninja gốc, chưa phải quyết định collider/worldSize/damage. Không thay character scale, frame hoặc pivot của runtime.

Người dùng nhận xét phi tiêu khá đẹp và yêu cầu bổ sung động tác phóng. Đã thêm candidate riêng tại [throw/](throw/README.md), [preview động tác](../../docs/map01/commits/task-009-03-fire-shuriken-art/throw-preview.html). Chưa promote pose mới hoặc projectile vào game; cần duyệt bộ động tác và nhịp thả.
