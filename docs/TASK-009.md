# Task09 — attack/skills, quái và boss

Baseline a26fcd3, nhánh codex/task-009-player-attack-art. Chưa merge master. Các phần dưới là chia nhỏ phạm vi theo yêu cầu, không phải quyền tự thực hiện tất cả ngay.

| Phần | Kết quả cần có | Trạng thái |
| --- | --- | --- |
| 09.1 — artwork nhân vật hoả | Review nguồn, chuẩn hoá tỉ lệ/pivot, preview từng đòn và combo; người dùng chốt ảnh | Người dùng đã duyệt combo và yêu cầu tích hợp; [báo cáo](map01/commits/task-009-01-player-art/REVIEW.md) |
| 09.2 — attack/combo nhân vật | Tích hợp ảnh đã chốt, input/buffer và combat theo thiết kế được duyệt | Đã tích hợp animation click trái, nối1→2→3 và reset0.5s; [báo cáo](map01/commits/task-009-02-player-combo/IMPLEMENTATION.md). Damage/hit detection chưa triển khai; runtime/test/build chưa chạy |
| 09.3 — skills nhân vật | Chốt từng skill, hiệu ứng, điều kiện dùng, cooldown/resource; tạo/tích hợp asset còn thiếu | Người dùng duyệt09.3.1; đã tích hợp09.3.2 click phải phóng phi tiêu (animation/visual, chưa damage/collision), [báo cáo](map01/commits/task-009-04-fire-shuriken-runtime/IMPLEMENTATION.md). Chưa chạy test/build/runtime.09.3.3 art “Minh Vương Bạo Viêm” (cooldown5s, orb hắc hoả/nổ AOE) và09.3.4 apply Q chưa bắt đầu |
| 09.4 — quái | Chốt loại quái, bộ sprite, trạng thái attack/hurt/death và tương tác combat | Chưa bắt đầu |
| 09.5 — boss | Chốt boss, bộ đòn/phase/telegraph và sprite tương ứng | Chưa bắt đầu |
| 09.6 — nghiệm thu/merge | Kiểm thử được cho phép, chơi thử và duyệt; commit/merge khi được yêu cầu | Chưa bắt đầu; không tự merge master |

Lượt đầu chỉ thực hiện09.1. Sau khi người dùng duyệt combo và chốt click trái, đã thực hiện phần animation/input09.2; physics và sprite đi/chạy/nhảy/leo giữ nguyên. Không nhập logic damage của project khác từ JSON asset vào engine này. Không chạy test/build/validation nếu task hiện tại chưa cho phép.

Phần phi tiêu đứng đã commit20d4cd3 theo yêu cầu. Đã bổ sung [art cúi phóng phi tiêu](map01/commits/task-009-05-crouch-shuriken-art/README.md) với sáu pose/preview riêng; chờ review artwork, chưa đổi gate hoặc runtime cúi. Chưa bắt đầu special Q.
