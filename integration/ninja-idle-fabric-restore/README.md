# Nguồn Task10.46 — Idle fabric restore

Release art theo quyền người dùng giao tự review trước khi release. Không phải ghi nhận người dùng đã trực tiếp duyệt ảnh10.46; chưa đổi runtime.

Baseline native gốc và animations.json lưu bất biến ở production-reference-atlas.png / production-reference-animations.json. fabric-guide.png là source imagegen từ6crop production130,75,105,108; prompt.txt ghi yêu cầu giữ nếp khăn, tà đỏ và xoá phụ kiện cũ. Guide chỉ vào footprint được chỉ định trong generator; không kéo màu theo hàng hoặc thay toàn thân. plan.json ghi output, mask và quyền release.

Ảnh/metadata cuối và audit: [snapshot10.46](../../docs/map01/commits/task-010-46-ninja-idle-fabric-restore/README.md). Source authoring/package/publish liệt kê trong báo cáo. canonical-before-hashes.json và3file production-reference-manifest/review-data/production-plan-before là bằng chứng trước publish. Không dùng candidate10.45 hoặc atlas production đã release làm baseline tái tạo.
