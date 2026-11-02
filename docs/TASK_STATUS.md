# Trạng thái toàn dự án

Skills nhân vật: người dùng đã duyệt [art phi tiêu và sáu pose phóng](map01/commits/task-009-03-fire-shuriken-art/README.md), yêu cầu apply. Đã tích hợp animation + projectile visual bằng click phải; [báo cáo09.3.2](map01/commits/task-009-04-fire-shuriken-runtime/IMPLEMENTATION.md). Chưa damage/collision phi tiêu, chưa chạy test/build/gameplay, chưa commit/merge. Task3 art “Minh Vương Bạo Viêm” và Task4 apply Q chưa bắt đầu. Cooldown5s thuộc special-skill-01, không tự gán cho phi tiêu.

Task09 trên nhánh codex/task-009-player-attack-art từ a26fcd3: [kế hoạch chia phần](TASK-009.md). Art được người dùng duyệt, commit1442907. Đã promote ảnh và tích hợp animation: click trái nối1→2→3, nghỉ≥0.5s về1; [báo cáo09.2](map01/commits/task-009-02-player-combo/IMPLEMENTATION.md). Chưa merge master, chưa chạy test/build/runtime. Skills riêng, damage/hitbox, quái và boss chưa thực hiện.

Cập nhật 2026-11-02. Baseline code/asset gần nhất4ce0146; task tổ chức tài liệu không đổi runtime và không chạy test/build.

| Phạm vi | Nguồn trạng thái |
| --- | --- |
| Toàn game | Style chung Illustrated textured pixel art; palette/chủ đề theo map, contract theo nhân vật |
| Map01 | [Trạng thái riêng](map01/TASK_STATUS.md), [hồ sơ](map01/README.md); palette đêm vẫn giữ cho Map01 |
| Ninja | [Contract](characters/ninja/rules/SPRITE_SPEC.md), [báo cáo leo](characters/ninja/reports/NINJA-CLIMB-V2.md); artwork đã chọn, test/build/runtime mới nhất chưa chạy |
| Map02/03 và nhân vật mới | Chưa có thiết kế triển khai trong task này; sẽ lập hồ sơ riêng theo brief |
| Nghiệm thu tổng thể | Chưa có bằng chứng mới để khoá final production; không lấy log/ảnh cũ chứng nhận baseline hiện tại |

Quy tắc/đường dẫn tài liệu đã tách theo docs/README.md. Không đổi asset, source game hoặc bằng chứng lịch sử. File backgrounds/buildings-shop.png vốn untracked không nằm trong phạm vi task. Chưa commit tài liệu.
