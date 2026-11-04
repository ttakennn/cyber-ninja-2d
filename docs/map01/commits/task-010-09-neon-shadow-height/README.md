# Task10.9 — Bóng Neon cao95% Ninja Hỏa

Người dùng yêu cầu tăng chiều cao88%→95%. Đổi reviewHeightRatio ở art-plan.json rồi sinh lại metadata/ảnh so bằng scripts/prepare_neon_shadow_preview.ps1 (Windows PowerShell5.1, authoring mode).

[Preview95%](preview.html), [ảnh so](comparison.png), [metadata](design.json). Mặc định95% tương ứng238.45px so Idle Ninja Hỏa251px. Scale đồng nhất giữ aspect, pivot căn chân và PNG gốc; Sói Điện giữ88%. Có tuỳ chọn88% và100% để so sánh.

[Bản88% trước](../task-010-08-neon-shadow-design/preview.html) giữ nguyên làm lịch sử. Snapshot mới chứa PNG/reference/HTML/data riêng. Source/prompt vẫn ở integration/task-010-neon-shadow/; không tạo lại artwork. Tỷ lệ95% theo yêu cầu; ngoại hình vẫn chờ duyệt trước khi publish production.

Đã sinh metadata/ảnh so và xem bảng tỷ lệ; chưa mở HTML qua trình duyệt. Test/build/lint/typecheck/formatter NOT_RUN. Không đổi runtime/gameplay; chưa animation/skills hoặc commit/merge/push.
