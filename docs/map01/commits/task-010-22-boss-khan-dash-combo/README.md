# Task 10.22 — Khan lướt nhanh rồi đánh combo

[Xem preview lướt → combo](preview.html) · [6 pose lướt](dash-contact.png) · [combo X đã chốt](../../../characters/boss-khan/animation/combo/preview.html).

Người dùng đã chốt art Song Đao Liên Trảm ở [Task10.21](../task-010-21-boss-khan-combo-x-forward/README.md). Hai sheet combo được sao chép nguyên PNG vào `docs/characters/boss-khan/animation/combo/`; `production.json` giữ nguồn và hash. Bản lướt **mới là candidate chờ duyệt**, chỉ nằm trong snapshot này và `integration/task-010-boss-khan/dash-combo/`.

Chuỗi art mới: giữ thế → nén người → bật chân sau → lướt thân thấp, hai đao thu gọn và vệt đỏ–cyan mảnh sau áo → hãm chân → vào thế đánh. Preview ghép tiếp 16 frame combo đã chốt, không sinh lại ảnh combo. Có bóng mờ nhẹ trong chuyển động preview; bản atlas dash chỉ giữ vệt ánh sáng ngắn. Art gốc ImageGen/những lần sửa, source rect đã chọn và hash ở [plan](../../../../integration/task-010-boss-khan/dash-combo/animation-plan.json) và [prompt](../../../../integration/task-010-boss-khan/dash-combo/prompts/dash.md).

Sheet review 2048×1024, sáu frame 512×512, pivot (256,456), tham chiếu 160px/world unit; một scale thống nhất theo frame đứng để giữ chiều cao mực 376,5px. Hai pose thử quá rộng bị loại khỏi dãy sử dụng, vẫn giữ trong source lịch sử. Bản preview chứa bản sao các PNG combo đã duyệt để mở độc lập từ thư mục này.

Cập nhật 2026-11-05: người dùng chốt bộ lướt này. File PNG review được sao chép nguyên byte vào [art production Khan](../../../characters/boss-khan/animation/dash/preview.html); snapshot và câu mô tả candidate phía trên giữ làm lịch sử tại thời điểm tạo. Skill 1 mới ở [Task10.23](../task-010-23-boss-khan-shadow-step/README.md) chờ duyệt.

Đã xem bảng frame dash và combo X; chân/kiếm trong sáu pose dash không bị cắt ở mép ô. Chưa kiểm tra chuyển động trong trình duyệt hoặc game. Tốc độ 0,56s dash, đoạn dịch 520px trong preview và vị trí Ninja chỉ để duyệt hình; chưa chốt AI, tầm lướt, cooldown, hitbox, sát thương hoặc va chạm với vật cản. Test/build/lint/typecheck/formatter NOT_RUN theo hướng dẫn hiện hành.
