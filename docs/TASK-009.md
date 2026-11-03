# Task09 — attack/skills, quái và boss

09.18: người dùng review bản mới ổn, giảm tốc attack combo20% và yêu cầu commit hiện trạng09.11–18. [Báo cáo](map01/commits/task-009-18-combo-speed/IMPLEMENTATION.md). Metadata attack speed0.8, frame/pivot/FPS và reset0.5s giữ nguyên; test cập nhật nhưng không chạy. Không merge/push.

Cập nhật09.17 theo yêu cầu mới: Cửu Long cast1s/vòng2.0×/độ dày1.0×, aura7s/CD12s; phi tiêu và Minh Vương phát sáng cùng lúc Cửu Long, Q/E chung card nhỏ. [Báo cáo](map01/commits/task-009-17-skill-ui-timing-glow/IMPLEMENTATION.md). Đã sinh dữ liệu runtime, cập nhật test nhưng chưa chạy; test/build/chơi thử **NOT_RUN**, chưa commit/merge. Các mốc1.4s/2.5× bên dưới là lịch sử.

Baseline a26fcd3, nhánh codex/task-009-player-attack-art. Chưa merge master. Các phần dưới là chia nhỏ phạm vi theo yêu cầu, không phải quyền tự thực hiện tất cả ngay.

| Phần | Kết quả cần có | Trạng thái |
| --- | --- | --- |
| 09.1 — artwork nhân vật hoả | Review nguồn, chuẩn hoá tỉ lệ/pivot, preview từng đòn và combo; người dùng chốt ảnh | Người dùng đã duyệt combo và yêu cầu tích hợp; [báo cáo](map01/commits/task-009-01-player-art/REVIEW.md) |
| 09.2 — attack/combo nhân vật | Tích hợp ảnh đã chốt, input/buffer và combat theo thiết kế được duyệt | Đã tích hợp animation click trái, nối1→2→3 và reset0.5s; [báo cáo](map01/commits/task-009-02-player-combo/IMPLEMENTATION.md). Damage/hit detection chưa triển khai; runtime/test/build chưa chạy |
| 09.3 — skills nhân vật | Chốt từng skill, hiệu ứng, điều kiện dùng, cooldown/resource; tạo/tích hợp asset còn thiếu | Phi tiêu25d85cd. Art special1 đã duyệt, tích hợp09.3.4 bằng **E**, **F** bám thang, cooldown5s từ đầu cast và giữ khi bị ngắt; [báo cáo](map01/commits/task-009-08-special-01-runtime/IMPLEMENTATION.md). Có solid impact/nổ, chưa damage/quái/AOE combat; test/build/runtime chưa chạy |
| 09.4 — quái | Chốt loại quái, bộ sprite, trạng thái attack/hurt/death và tương tác combat | Chưa bắt đầu |
| 09.5 — boss | Chốt boss, bộ đòn/phase/telegraph và sprite tương ứng | Chưa bắt đầu |
| 09.6 — nghiệm thu/merge | Kiểm thử được cho phép, chơi thử và duyệt; commit/merge khi được yêu cầu | Chưa bắt đầu; không tự merge master |

Lượt đầu chỉ thực hiện09.1. Sau khi người dùng duyệt combo và chốt click trái, đã thực hiện phần animation/input09.2; physics và sprite đi/chạy/nhảy/leo giữ nguyên. Không nhập logic damage của project khác từ JSON asset vào engine này. Không chạy test/build/validation nếu task hiện tại chưa cho phép.

Phần phi tiêu đứng20d4cd3, art cúi dd98497 và runtime cúi/collision25d85cd đã commit theo yêu cầu. Người dùng duyệt art special1, thay phím Q dự kiến bằng E và chuyển bám thang sang F; đã tích hợp. Quái/damage để sau; chưa chạy test/build/runtime mới, commit hoặc merge lượt special.

Cập nhật UI theo yêu cầu: orb special1 nhanhx2 (9unit/s), tên chiêu theo đầu nhân vật và mờ dần1.5s; HUD gọn góc trái trên gồm E/tên/trạng thái/countdown/thanh hồi. Tham khảo bố cục cyber-ninja-basic/index.html; giữ cast/cooldown/gameplay. [Báo cáo](map01/commits/task-009-09-special-01-ui/IMPLEMENTATION.md); chưa kiểm tra runtime/test/build.

Sau H ẩn hướng dẫn và tên chiêu bỏ nền/viền, người dùng review ổn và yêu cầu commit: đã lưu **08294d4**. Lượt kế chỉ tạo [art CỬU LONG HỎA TRẬN](map01/commits/task-009-11-nine-dragons-art/README.md),4atlas/preview1.4s, brief12s/3waves/125px; chờ duyệt, chưa commit/apply game. Chưa giải quyết binding E trùng skill cũ hoặc chốt mốc camera gameplay, không tự thêm damage/quái/boss.

Cập nhật theo yêu cầu tiếp: [vòng Bạo Viêm7s](map01/commits/task-009-12-nine-dragons-aura/README.md) bắt đầu sau1.4s, thêm atlas8pha lặp và chọn1.5×/2×/2.5× trong preview. Chưa apply runtime/commit; sát thương vòng lên quái/boss xử lý sau, không lấy tổng126HP cũ làm tổng skill mới.

Lượt chỉnh tiếp: [độ dày/glow](map01/commits/task-009-13-aura-character-glow/README.md) có0.3/0.5/0.7, ánh viền vàng kem/quầng cam cho Ninja, fade cuối350ms và trở lại ảnh gốc tại8.4s. Chỉ preview render, chưa apply/commit, không đổi PNG/pivot/scale nhân vật.

2026-11-03 — 09.3.5: người dùng chốt **độ dày1.0×, kích thước2.5×, phím Q** và yêu cầu apply. Đã tích hợp art Cửu Long, cast1.4s/aura7s/CD12s, ánh sáng Ninja và HUD; E Minh Vương/F bám thang giữ nguyên. [Báo cáo](map01/commits/task-009-15-nine-dragons-runtime/IMPLEMENTATION.md). Damage/Burn/knockback/quái/boss vẫn chưa triển khai. Đã thêm/cập nhật test nhưng **không chạy**; chưa build/chơi thử/nghiệm thu shader hoặc commit/merge. Các đoạn preview trên là lịch sử trước quyết định apply.
