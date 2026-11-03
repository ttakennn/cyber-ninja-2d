# Task09 — attack/skills, quái và boss

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
