# Task 10.18 — Huyết Nguyệt Giáng Lâm

Người dùng đã chốt tạo hình và các động tác cơ bản Huyết Đao Khan, giao vẽ màn xuất hiện điện ảnh. [Preview 3 giây](preview.html) gồm Huyết Nguyệt, khoanh tay trên cao, mắt lóe đỏ, lao xuống với vệt đỏ/cyan, quỳ một gối tiếp đất, rút song đao chém X và hạ trọng tâm vào Combat Ready. Không có khói, biến hình hoặc vụ nổ lớn.

| Lớp art | Nguồn review | Vai trò |
| --- | --- | --- |
| Body giáng xuống | candidate/descent.png, descent-contact.png | 8 pose khoanh tay → lao xuống → quỳ |
| Body khai chiến | candidate/draw.png, draw-contact.png | 8 pose đứng dậy → rút đao → chém X → guard |
| Huyết nguyệt | candidate/moon.png, moon-contact.png | 8 frame vòng trăng khuyết sau boss |
| Tiếp đất | candidate/impact.png, impact-contact.png | 8 frame sóng năng lượng thấp sát nền |
| Chém X | candidate/cross.png, cross-contact.png | 8 frame vệt kiếm đỏ/lõi sáng |

Source gốc ImageGen, prompt đầy đủ và kế hoạch trình tự tại integration/task-010-boss-khan/entrance/. Mọi source 1774×887 RGBA, chia 4×2 với sourceRects ghi trong plan. Script scripts/prepare_boss_khan_animation.ps1 -Profile entrance sinh atlas candidate 2048×1024, ô512×512. Body dùng pivot review(256,456) và một scale theo pose đứng của từng sheet để giữ chiều cao chuẩn 376,5px; FX có neo/tỷ lệ riêng và không thay đổi kích thước nhân vật. PNG giáng xuống lần đầu có nền trắng mờ; source/descent-first.png giữ lịch sử, bản source/descent.png được ImageGen bóc nền alpha rồi mới đưa vào candidate. Metadata atlas.json ghi nguồn, hash và crop.

Đã xem năm bảng frame và ảnh nguồn sau bóc nền: boss giữ mặt nạ, áo trắng xám, chi tiết đỏ/cyan và hai đoản đao; trăng khuyết rõ, sóng tiếp đất thấp, dấu X sắc. Neon nhấp nháy, vệt đỏ ngang và bóng mờ lao xuống được ghép trong HTML để review nhịp; chúng chưa là asset/runtime đã duyệt. Timeline 0–3 giây là phương án trình bày theo các mốc người dùng đề xuất. Vị trí trên cao và chuyển động trên preview chỉ minh họa, chưa định spawn gameplay.

Art màn xuất hiện mới **chờ người dùng duyệt**, chưa đưa vào docs/characters/boss-khan/animation/ hoặc public/assets/. Chưa mở preview trong trình duyệt hoặc kiểm tra viewport; không chạy test/build/lint/typecheck/formatter. Chưa sửa src/game, AI, hitbox, damage, collider hay vị trí spawn. Khi tích hợp sau này cần bảo đảm spawn hợp lệ, không kích hoạt AI/hitbox gây sát thương trong intro, và chém X trình diễn không gây damage; yêu cầu đó chưa được triển khai ở task art này.

Cập nhật 2026-11-05: người dùng đã chốt màn xuất hiện ở lượt sau. Năm sheet được sao chép nguyên byte vào [thư viện production](../../../characters/boss-khan/animation/entrance/preview.html); đoạn trên giữ lại trạng thái lúc tạo candidate. Chưa tích hợp boss vào game.
