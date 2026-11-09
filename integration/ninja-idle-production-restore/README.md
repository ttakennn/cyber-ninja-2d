# Nguồn Task10.44 — Idle production restore

Candidate chỉ sửa bụng và tay theo phản hồi Task10.42; không phải bộ production được duyệt.

- production-arm-waist.png:6crop native production x130/y75/w105/h108,3×2, phóng2× để làm tham chiếu tạo guide.
- waist-guide.png: artwork chỉnh sửa bằng imagegen từ crop production, prompt tại prompt.txt; chỉ lấy pixel ở footprint vũ khí cũ, không dùng thay nguyên tay/thân.
- arm-waist-before.png: ảnh đối chiếu ban đầu production/10.42.
- plan.json: nguồn, mask, crop và reviewDirectory.
- preview.html/js: renderer so3cột và crop4×, dùng dữ liệu đóng gói cục bộ.

Authoring: powershell -NoProfile -ExecutionPolicy Bypass -File scripts/prepare_ninja_idle_production_restore.ps1. Sau đó node scripts/assemble_ninja_idle_restore_review.mjs đóng gói GIF từ6ảnh opaque. Đây là lệnh sinh artwork, không phải test/build.

[Snapshot, audit, hash và giới hạn](../../docs/map01/commits/task-010-44-ninja-idle-production-restore/README.md). Snapshot10.42 và production giữ nguyên. Gặp quái/chạy/attack hoãn.
