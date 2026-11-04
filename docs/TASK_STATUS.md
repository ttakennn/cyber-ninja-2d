# Trạng thái toàn dự án

2026-11-04/Task10-library: người dùng chốt màn xuất hiện, toàn bộ art Sói Điện hiện đã được duyệt. Thư viện xem lại chính chuyển sang [characters/electric-wolf/animation/preview.html](characters/electric-wolf/animation/preview.html), đủ10atlas/JSON/10clip/VFX/bảng pose/tham chiếu. Dùng -PublishOnly sao chép nguyên file và cập nhật metadata, không tạo lại ảnh. [Danh mục/cách cập nhật](characters/electric-wolf/animation/README.md). Chưa runtime/test/build/browser tại vị trí mới/commit/merge. Các trạng thái chờ duyệt bên dưới giữ lịch sử.

2026-11-04/Task10-entrance: người dùng chốt Skill2; đã thêm [art xuất hiện từ khói điện](map01/commits/task-010-07-electric-wolf-entrance/README.md), [preview](map01/commits/task-010-02-electric-wolf-animation/preview.html) với8pose body/8frame khói và hiện dần/cử chỉ vào thế. Tổng10sheet/10clip;8PNG cũ/cỡ/pivot giữ nguyên. Màn xuất hiện chờ duyệt, chưa runtime/spawn/AI/test/build/browser/commit/merge. Các mục Skill2 chờ duyệt bên dưới là lịch sử.

2026-11-04/Task10-skill2: người dùng chốt Skill1; đã thêm [Điện Chấn Mặt Đất](map01/commits/task-010-06-electric-wolf-ground-shock/README.md), [preview](map01/commits/task-010-02-electric-wolf-animation/preview.html) với8pose đập gậy/8frame FX riêng và tuỳ chọn vật cản minh hoạ. Tổng8sheet/9clip, giữ6PNG cũ/cỡ/pivot. Skill2 chờ duyệt; chưa runtime/AI/damage/collision thật/test/build/browser/commit/merge. Các mục Skill1 chờ duyệt bên dưới là lịch sử.

2026-11-04/Task10-skill1: người dùng đã chốt art hurt Sói Điện. Đã tạo [Điện Quang Đột Kích8pose](map01/commits/task-010-05-electric-wolf-dash/README.md), [preview](map01/commits/task-010-02-electric-wolf-animation/preview.html) với cảnh báo500ms và tuỳ chọn minh hoạ lao. Tổng6sheet/8clip; Skill1 chờ duyệt, các ảnh cũ giữ nguyên. Chưa gameplay/Skill2/test/build/browser/commit/merge. Các mục hurt chờ duyệt bên dưới là lịch sử.

2026-11-04/Task10-hurt: Electric Baton v2 đã được người dùng duyệt; đã thêm [art trúng đòn8pose](map01/commits/task-010-04-electric-wolf-hurt/README.md), [preview mở sẵn hurt](map01/commits/task-010-02-electric-wolf-animation/preview.html). Tổng5sheet/7clip, giữ ảnh/tỉ lệ các bộ đã duyệt; hurt mới chờ duyệt. Chưa runtime/damage/test/build/commit/merge. Các mục chờ duyệt combo bên dưới là lịch sử.

2026-11-04/Task10: art đứng/chạy/nhảy/leo Sói Điện đã được người dùng duyệt; chỉ Electric Baton được sửa v2 với tay/cung điện vươn xa và rà lại8pose. [Preview mở sẵn combo](map01/commits/task-010-02-electric-wolf-animation/preview.html), [báo cáo](map01/commits/task-010-03-electric-baton-v2/README.md). Giữ nguyên byte3atlas khác; combo mới chờ review, chưa runtime/damage/test/build/commit.

Task09 đã được người dùng chốt và merge master; master local067ce5e. Đang làm [Task10](TASK-010.md) trên nhánh **codex/task-010-enemy-art**. **Ninja Sói Điện v1 đã được chốt**, hiện có [4atlas/6clip animation candidate](map01/commits/task-010-02-electric-wolf-animation/preview.html): đứng/chạy/nhảy/leo lên-xuống/combo2đòn; giữ tỉ lệ88%. Chờ review animation, chưa special skills/damage/AI/boss/spawn/runtime hoặc test/build/commit/merge Task10. Các trạng thái Task09 chưa merge bên dưới là lịch sử trước xác nhận mới.

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
