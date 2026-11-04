# Ninja Hỏa — gom animation production / chuẩn hoá leo

Ngày2026-11-04, nhánh codex/task-010-enemy-art. Người dùng chốt các hoạt ảnh Ninja đã làm, chọn leo v2, yêu cầu bộ final nằm trong docs/characters/<nhan-vat>/animation/ nhưng task vẫn phải cập nhật commits. Không được giao commit/push/merge hoặc chạy test/build.

[Preview production hiện hành](../../../characters/ninja/animation/preview.html) · [Snapshot của task này](animation/preview.html) · [Rules](../../../rules/ANIMATION_PRODUCTION.md).

## Đã làm

- Gom nguyên file runtime đã chốt vào production: locomotion12clip (đứng/run/nhảy/rơi/tiếp đất/cúi/vào cúi/trúng đòn/leo lên-xuống-dừng và alias), combo3đòn giữ speed0,8, phi tiêu đứng/cúi/projectile, Skill1 E cast/orb/explosion, Skill2 Q cast/dragon/seal/burst/aura. Tổng15sheet/26clip nguồn và hai bộ xuất hiện/hồi sinh riêng. Không có clip walk riêng; ghi rõ đi/chạy dùng run, không tự tạo hình hoặc alias mới.
- Thêm preview tổng hợp, playback/frame kế/tua/tốc độ/nền/so Idle; xem từng clip/FX và ghép minh hoạ hai tuyệt kỹ. Mô phỏng Canvas2D chỉ để xem art; không tuyên bố khớp mọi lớp/shader/physics trong game. Spawn/respawn chỉ là art, chưa thêm trigger hoặc input.
- production.json/review-data.js lấy từ integration/ninja-animation-library/production-plan.json bằng scripts/publish_ninja_animation_library.mjs; danh sách file đã duyệt tường minh, lưu nguồn/hash/approval và trạng thái runtime. Copy nguyên PNG/JSON/manifest, không gọi ImageGen hoặc chuẩn hoá lại ảnh. Giáng Lâm/Tái Lâm chỉ cập nhật approval metadata theo plan, không sinh lại PNG.
- Thêm docs/rules/ANIMATION_PRODUCTION.md và liên kết AGENTS.md/SPRITE_SPEC/docs index: production chỉ chứa bộ chốt; review, báo cáo và snapshot từng task vẫn trong commits; giữ nguồn/hash/frame/pivot/timing, không tự coi art final là nghiệm thu runtime.
- scripts/prepare_ninja_entrance.ps1 và prepare_electric_wolf_animation.ps1 chuyển authoring về reviewDirectory trong commits; chế độ publish riêng mới cập nhật bộ chốt. Chưa chạy các mode authoring ảnh trong lượt gom. Mỗi task tiếp theo phải chọn reviewDirectory mới để không ghi đè snapshot task cũ.

## Leo đã xác định từ source

Runtime flame-ninja-atlas.png đã là bản v2 được chọn từ trước. SHA256 hiện hành432f63db6c14141940c4bf07e622df55381143348f7dcbde46aaa0013eadf2c2 trùng báo cáo v2; giữ nguyên byte atlas và animations.json. Không có atlas leo cũ còn active để thay lại; bản trước nằm trong Git. Atlas debug ninja-atlas.png/development-animations.json là bộ khác nên không xoá nhầm.

Đổi tên active, không xử lý ảnh:

| Trước | Canonical hiện tại |
| --- | --- |
| integration/ninja-climb-v2/ | integration/ninja-climb/ |
| climb-poses-v2.png | climb-poses.png |
| scripts/create_ninja_climb_v2.ps1 | scripts/create_ninja_climb.ps1 |

Đã cập nhật đường dẫn trong script ghép và rules Map01; báo cáo NINJA-CLIMB-V2.md giữ làm lịch sử với link canonical. Không chạy lại script ghép atlas hoặc sửa animation controller.

## File và lịch sử

Thay đổi gồm: production-plan/publisher mới; docs/characters/ninja/animation/ (atlas/metadata/preview/catalog/hướng dẫn/approval); nguồn/script leo được rename; source plan hai bộ xuất hiện; generator Ninja/Sói Điện; AGENTS, rules chung, rules Ninja/Map01, docs index, TASK_STATUS/DECISION_LOG và báo cáo này. Nguồn/prompt task trước vẫn giữ trong integration.

animation/ tại đây là bản sao file preview/PNG/JSON/JS đã chốt của lượt gom để xem lịch sử, không phải screenshot trình duyệt hoặc bản runtime mới. Không đổi ảnh/scale/pivot/frame rect/FPS/input/camera/physics/collider/src/public/assets hoặc asset Sói Điện.

Đã đọc consumer/renderer/metadata để giữ cách dựng pivot/visual/timing, đối chiếu hash atlas leo và inventory nguồn. Chưa mở preview tổng hợp trong trình duyệt. Test/build/lint/typecheck/formatter **NOT_RUN**, chưa commit/merge/push. Giới hạn còn lại: chưa có walk riêng, preview composite là minh hoạ, chưa tích hợp spawn/respawn hoặc damage/quái/boss.
