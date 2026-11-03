# Task09.18 — giảm tốc combo20% và bàn giao commit

Người dùng review bản Q/E/Cửu Long mới là ổn, yêu cầu giảm tốc độ attack combo20% và commit code hiện tại. Phạm vi commit gồm art/preview/runtime Cửu Long09.11–17 đã có trong working tree cùng thay đổi combo này; không merge/push.

Thêm playbackSpeedMultiplier0.8 trong integration/task-009-player-attacks/combo-plan.json. scripts/promote_ninja_attacks.mjs nhân speed nguồn với0.8 khi sinh metadata/manifest runtime; mỗi lần sinh đều lấy candidate nên không nhân chồng. Giữ PNG/frames/FPS/pivot/scale và không sửa shared AnimationController, PlayerAttack hoặc delta mô phỏng.

Tốc độ còn80%: thời lượng từng đòn tăng25%, từ khoảng0.25/0.214286/0.2625s thành0.3125/0.267857/0.328125s. Click1→2→3, khoảng nghỉ≥0.5s reset, giới hạn buffer và điều kiện đứng grounded giữ nguyên; E/Q/phi tiêu/locomotion không đổi tốc độ.

Đã chạy generator authoring `node scripts/promote_ninja_attacks.mjs`, cập nhật kỳ vọng test PlayerAttack.test.ts cho speed/timing mới và giữ kiểm tra reset0.5s. Đã đọc source/diff. Test/build/lint/formatter/typecheck/chơi thử **NOT_RUN** theo hướng dẫn hiện tại; review “ổn” của người dùng không thay kết quả test tự động.

Các ghi chú “chưa commit” trong báo cáo09.11–17 là trạng thái ở từng lượt trước; commit bàn giao của lượt này lưu toàn bộ phần đó. Giới hạn chưa có damage/quái/boss và thiếu clip thu kiếm riêng vẫn giữ.
