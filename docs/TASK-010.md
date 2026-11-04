# Task10 — artwork quái thường, boss và đòn/skills

Người dùng xác nhận Task09 đã chốt/merge master. Master local ở067ce5e, working tree sạch khi bắt đầu; đã tạo nhánh **codex/task-010-enemy-art** từ đó. Không merge/push/commit trong lượt này.

Toàn bộ art quái01 đã được chốt, gồm màn xuất hiện. Điểm xem lại chính: [characters/electric-wolf/animation/preview.html](characters/electric-wolf/animation/preview.html), [danh mục/source](characters/electric-wolf/animation/README.md). Các báo cáo commits chỉ giữ lịch sử; chưa tích hợp game.

| Bước | Phạm vi | Trạng thái |
| --- | --- | --- |
| 10.1 | Duyệt tạo hình quái thường01 | Người dùng đã chốt v1, [tạo hình](characters/electric-wolf/animation/reference/electric-wolf-ninja-v1.png) |
| 10.2 | Artwork động tác/đánh thường/trúng đòn | Đứng/chạy/nhảy/leo hai chiều/Electric Baton v2/hurt đã được người dùng duyệt art. [Preview](characters/electric-wolf/animation/preview.html) |
| 10.3 | Artwork skills quái01 | Skill1/Skill2 đã được người dùng duyệt art. [Skill2](map01/commits/task-010-06-electric-wolf-ground-shock/README.md); chưa gameplay |
| Xuất hiện quái01 | Khói điện / hiện hình / cử chỉ vào trận | Đã chốt art8pose nhân vật/8frame khói, preview2320ms. [Preview](characters/electric-wolf/animation/preview.html); chưa trigger spawn |
| 10.4 | Quái/boss khác và skills | Chưa có brief thiết kế tiếp; chưa vẽ/chốt vị trí xuất hiện |
| Tích hợp game | AI, damage/hitbox, spawn, boss, cân bằng | Chưa thực hiện/không thuộc lượt tạo hình hiện tại |

Brief bomber đen/jeans/mặt người ban đầu được người dùng thay bằng **Ninja Sói Điện** trước khi chốt ảnh. Không dùng bộ người cầm gậy cũ làm asset được duyệt. Ngoại hình mới cho phép hơi chibi riêng nhân vật này, vẫn giữ ngôn ngữ sprite2D/texture/shading của dự án. Không sửa Ninja chính hoặc rules toàn game thành chibi.

Tạo hình đã được chốt, giữ mức hiển thị88% Ninja cho artwork động tác mới. Atlas animation candidate ô512×512/pivot(256,416)/160px-unit; chưa tích hợp hoặc chốt collider. Nhịp animation/đường nhảy/thang preview chưa phải gameplay. Sát thương/knockback/recovery, vị trí quái/boss, cooldown/AI còn mở. Không chạy test/build/lint/typecheck/formatter; không tuyên bố nghiệm thu gameplay.
