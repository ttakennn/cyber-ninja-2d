# Trạng thái toàn dự án

UI mới nhất: **H** ẩn/hiện khung hướng dẫn; tên chiêu trên đầu chỉ còn chữ sáng, nhỏ hơn2px, giữ fade1.5s. [Báo cáo](map01/commits/task-009-10-help-callout/IMPLEMENTATION.md); chưa chạy test/build/runtime hoặc commit lượt này.

Skills nhân vật: art “Minh Vương Bạo Viêm” đã được người dùng duyệt và tích hợp bằng **E**, **F** bám thang; [tích hợp](map01/commits/task-009-08-special-01-runtime/IMPLEMENTATION.md), [UI mới](map01/commits/task-009-09-special-01-ui/IMPLEMENTATION.md). Orb tăng từ4.5 lên9unit/s, tên chiêu trên đầu mờ dần1.5s, HUD tên/countdown ở góc trái trên. Cooldown5s từ lúc bắt đầu, bị ngắt vẫn hồi; có orb/nổ khi chạm solid. Chưa damage/AOE combat/quái, chưa chạy test/build/gameplay hoặc commit/merge lượt mới. Phi tiêu đứng/cúi/tốc độx2/collision vẫn ở baseline25d85cd.

Task09 trên nhánh codex/task-009-player-attack-art từ a26fcd3: [kế hoạch chia phần](TASK-009.md). Art combo được duyệt, commit1442907; click trái nối1→2→3, nghỉ≥0.5s về1; [báo cáo09.2](map01/commits/task-009-02-player-combo/IMPLEMENTATION.md). Chưa merge master, chưa chạy test/build/runtime mới. Phi tiêu/special xem trạng thái ở trên; damage/hitbox combat, quái và boss chưa thực hiện.

Cập nhật 2026-11-02. Baseline code/asset gần nhất4ce0146; task tổ chức tài liệu không đổi runtime và không chạy test/build.

| Phạm vi | Nguồn trạng thái |
| --- | --- |
| Toàn game | Style chung Illustrated textured pixel art; palette/chủ đề theo map, contract theo nhân vật |
| Map01 | [Trạng thái riêng](map01/TASK_STATUS.md), [hồ sơ](map01/README.md); palette đêm vẫn giữ cho Map01 |
| Ninja | [Contract](characters/ninja/rules/SPRITE_SPEC.md), [báo cáo leo](characters/ninja/reports/NINJA-CLIMB-V2.md); artwork đã chọn, test/build/runtime mới nhất chưa chạy |
| Map02/03 và nhân vật mới | Chưa có thiết kế triển khai trong task này; sẽ lập hồ sơ riêng theo brief |
| Nghiệm thu tổng thể | Chưa có bằng chứng mới để khoá final production; không lấy log/ảnh cũ chứng nhận baseline hiện tại |

Quy tắc/đường dẫn tài liệu đã tách theo docs/README.md. Không đổi asset, source game hoặc bằng chứng lịch sử. File backgrounds/buildings-shop.png vốn untracked không nằm trong phạm vi task. Chưa commit tài liệu.
