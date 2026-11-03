# Trạng thái toàn dự án

Lượt09.18: người dùng review Q/E/Cửu Long ổn, yêu cầu giảm tốc combo20% và commit hiện trạng. Combo dùng speed0.8 từ plan, giữ frame/pivot/reset0.5s. [Báo cáo bàn giao](map01/commits/task-009-18-combo-speed/IMPLEMENTATION.md); phạm vi commit09.11–18, không merge/push. Chưa test/build/chơi thử lượt giảm tốc. Các trạng thái chưa commit bên dưới ghi lại từng lượt trước.

Preview Cửu Long09.11 đã sửa cách tải aura để hỗ trợ file://, giữ đủ tùy chọn độ dày và localhost; [báo cáo](map01/commits/task-009-16-preview-local-file/IMPLEMENTATION.md). Đã sinh dữ liệu ảnh đóng gói, chưa kiểm tra trình duyệt/test/build trong lượt sửa này; không đổi runtime.

UI mới nhất: **H** ẩn/hiện khung hướng dẫn; tên chiêu trên đầu chỉ còn chữ sáng, nhỏ hơn2px, giữ fade1.5s. Người dùng review ổn và yêu cầu commit; đã lưu cùng special1 ở **08294d4**. [Báo cáo UI](map01/commits/task-009-10-help-callout/IMPLEMENTATION.md); chưa chạy test/build hoặc nghiệm thu game mới.

**CỬU LONG HỎA TRẬN: Q, vòng2.0×, độ dày1.0×, cast1s** theo yêu cầu mới. Aura7s/CD12s giữ nguyên; Ninja và các hiệu ứng phi tiêu/Minh Vương phát sáng cùng nhau, mờ350ms cuối và tắt tại8s. Q/E gộp một card với chữ nhỏ hơn. [Báo cáo runtime mới](map01/commits/task-009-17-skill-ui-timing-glow/IMPLEMENTATION.md). E/F và contract sprite giữ nguyên. Chưa damage/quái/boss, chưa commit/merge; test/build/chơi thử/shader GPU **NOT_RUN**. Báo cáo09.15 và preview09.11–14 giữ làm lịch sử, không phải nghiệm thu bản mới.

Skills nhân vật: art “Minh Vương Bạo Viêm” đã được người dùng duyệt và tích hợp bằng **E**, **F** bám thang; [tích hợp](map01/commits/task-009-08-special-01-runtime/IMPLEMENTATION.md), [UI mới](map01/commits/task-009-09-special-01-ui/IMPLEMENTATION.md). Orb tăng từ4.5 lên9unit/s, tên chiêu trên đầu mờ dần1.5s, HUD tên/countdown ở góc trái trên. Cooldown5s từ lúc bắt đầu, bị ngắt vẫn hồi; có orb/nổ khi chạm solid. Đã commit08294d4, chưa merge; chưa damage/AOE combat/quái hoặc chạy test/build/nghiệm thu gameplay. Phi tiêu đứng/cúi/tốc độx2/collision vẫn từ25d85cd.

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
