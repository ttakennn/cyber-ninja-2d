# Task 10.31 — sửa hướng art combo Ninja Hỏa

[Preview một tay](preview.html) · [Atlas16pose](combo-atlas.png) · [Prompt/nguồn](../../../../integration/ninja-combo-one-hand/PROMPTS.md) · [Plan](../../../../integration/ninja-combo-one-hand/combo-plan.json).

Người dùng bác hướng Task10.30: kiếm bị đổi sang bạc, lửa bị làm mỏng và thế hai tay khép không hợp Ninja. Bản đó giữ lịch sử, không phải art được chọn. Task này dùng ba atlas attack production gốc làm tham chiếu trực tiếp cho kiếm Hỏa cán vàng/lưỡi đỏ-cam sáng và hiệu ứng lửa lớn nhiều lớp. Các file gốc giữ nguyên; bản copy ở reference/ để mở so trực tiếp. Candidate mới tái tạo pose/quỹ đạo, không tuyên bố VFX mới trùng từng pixel với bản gốc.

## Động tác mới

- Tay phải vung kiếm một tay; tay còn lại mở tự do để cân bằng. Vai/hông xoay, tay kiếm vươn ra trước, thế đứng mở và linh hoạt hơn bản hai tay.
- Chém ngang → chém ngược lên → bổ chéo kết thúc.16pose cùng tỷ lệ authoring, guard0 dùng chung ở đầu/cuối để nối. Idle gốc ở bên trái preview để so.
- Giữ phương án nhịp540/560/760ms; dừng sớm hồi220ms, hết chuỗi hồi320ms; tối đa1đòn chờ, không lưu click trong hồi thế. Chưa có quyết định mới thay nhịp nên không tăng tốc gameplay hoặc tự giảm thời gian nghỉ.
- Ô512×512/pivot192,353/160px-unit, duy nhất một transform toàn sheet; không fit từng frame. Giữ các lớp alpha/fire/embers khi chuẩn hóa, không dùng bước bỏ mọi component rời vốn làm mất chi tiết lửa. Metadata ghi trong combo.json.

## Thực hiện và giới hạn

Đã xem lại ba atlas attack gốc, ảnh nguồn sinh và atlas chuẩn hóa; đã đọc plan/preview/generator. Có nút xem từng đòn, combo, thử click, Frame trước/sau, tốc độ chậm và bảng16pose. Bộ gốc tham chiếu được lưu nguyên byte. Art này chờ người dùng duyệt, không thay atlas attack production/runtime hoặc các animation khác. Chưa kiểm tra phát/click preview trong trình duyệt; test/build/lint/typecheck/formatter NOT_RUN. Chưa commit.

Sinh lại candidate bằng scripts/prepare_ninja_combo_revision.ps1 -PlanPath integration/ninja-combo-one-hand/combo-plan.json. Nguồn/prompt giữ riêng, không ghi đè snapshot Task10.30.

Task10.32: người dùng làm rõ không bắt buộc luôn một tay; [bản phối hợp lực](../task-010-32-ninja-power-combo/preview.html) là candidate mới theo chỉ dẫn này. Bản một tay giữ để theo dõi lịch sử.
