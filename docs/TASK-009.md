# Task09 — attack/skills, quái và boss

Baseline a26fcd3, nhánh codex/task-009-player-attack-art. Chưa merge master. Các phần dưới là chia nhỏ phạm vi theo yêu cầu, không phải quyền tự thực hiện tất cả ngay.

| Phần | Kết quả cần có | Trạng thái |
| --- | --- | --- |
| 09.1 — artwork nhân vật hoả | Review nguồn, chuẩn hoá tỉ lệ/pivot, preview từng đòn và combo; người dùng chốt ảnh | Người dùng đã duyệt combo và yêu cầu tích hợp; [báo cáo](map01/commits/task-009-01-player-art/REVIEW.md) |
| 09.2 — attack/combo nhân vật | Tích hợp ảnh đã chốt, input/buffer, startup/active/recovery, quy tắc cancel/di chuyển và hit detection theo thiết kế được duyệt | Chưa bắt đầu; chưa chốt phím, damage, thời lượng hay cửa sổ combo |
| 09.3 — skills nhân vật | Chốt từng skill, hiệu ứng, điều kiện dùng, cooldown/resource; tạo/tích hợp asset còn thiếu | Chưa bắt đầu; ba sheet hiện tại chỉ là ba đòn kiếm, không tự coi là bộ skills hoàn chỉnh |
| 09.4 — quái | Chốt loại quái, bộ sprite, trạng thái attack/hurt/death và tương tác combat | Chưa bắt đầu |
| 09.5 — boss | Chốt boss, bộ đòn/phase/telegraph và sprite tương ứng | Chưa bắt đầu |
| 09.6 — nghiệm thu/merge | Kiểm thử được cho phép, chơi thử và duyệt; commit/merge khi được yêu cầu | Chưa bắt đầu; không tự merge master |

Chỉ 09.1 được thực hiện trong lượt này. Source/runtime hiện tại, physics, input, sprite đi/chạy/nhảy/leo và Map01 không đổi. Không nhập logic damage của project khác từ JSON asset vào engine này. Không chạy test/build/validation nếu task hiện tại chưa cho phép.
