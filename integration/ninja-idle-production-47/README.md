# Production Idle10.47

User đã chốt10.47 cho Ninja Hỏa production. release-plan.json khoá source/hash của PNG được duyệt; không regenerate artwork. canonical-before-hashes.json ghi40asset/JSON trước publish. Backup manifest/catalog/production-plan ghi từ bản trước publish.

Package: scripts/package_ninja_idle_production_47.ps1. Publish scoped: scripts/publish_ninja_idle_production_47.mjs. Guard chặn nếu baseline production đã đổi hoặc approved PNG không khớp hash. Không chạy lại publisher sau khi đã publish; dùng evidence để xem kết quả.

[Hồ sơ](../../docs/map01/commits/task-010-48-ninja-idle-production-47/README.md). Thay đúng Idle và metadata approval, chưa runtime.
