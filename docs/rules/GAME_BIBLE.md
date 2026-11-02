# Game Bible — chung toàn dự án

## Thế giới và định hướng

Game ninja 2D nhìn ngang, dùng Illustrated textured pixel art. Các map có thể khác chủ đề, kiến trúc, palette, độ sáng và ánh sáng theo brief riêng. Giữ cùng bản chất sprite 2D, texture/shading và chất lượng tạo hình; không ép tất cả map thành phố đêm Map01.

Map01 hiện là phố Việt/Sài Gòn ban đêm với mái nhà, hẻm, cửa hàng và neon. Ninja hiện có danh tính/contract riêng. Đây là nội dung đầu tiên và tham chiếu chất lượng, không phải khuôn màu hoặc khuôn cơ thể cho mọi map/nhân vật mới. Map mới dùng hồ sơ riêng; nhân vật dùng chung giữ danh tính khi đi qua nhiều map.

## Nguồn hiện hành

| Nội dung | Nguồn |
| --- | --- |
| Style chung | [ART_STYLE_GUIDE](ART_STYLE_GUIDE.md) |
| Kỹ thuật sprite/atlas | [SPRITE_SPEC](SPRITE_SPEC.md), [ATLAS_SPEC](ATLAS_SPEC.md) |
| Map01 | [Hồ sơ và nguồn Map01](../map01/README.md) |
| Nhân vật | [Danh mục nhân vật](../characters/README.md) |
| Trạng thái/quyết định | [TASK_STATUS](../TASK_STATUS.md), [DECISION_LOG](../DECISION_LOG.md) |

Hồ sơ đúng map quyết định palette/theme của map; hồ sơ đúng nhân vật quyết định danh tính/contract của nhân vật. Thông số source/metadata hiện hành phải được kiểm tra trước khi sửa, không lấy báo cáo lịch sử thay contract đang dùng. Nếu brief chưa xác định một quyết định quan trọng, hỏi riêng phần đó; không tự chốt thiết kế.

## Phạm vi gameplay hiện tại

Giữ chạy, nhảy, crouch/headroom, leo hai chiều, dừng/rời thang, collision, camera và fall/respawn hiện có. Task visual không được thay gameplay để phù hợp ảnh.

- Hình học, camera, spawn, deathY và cơ chế riêng của từng map nằm trong hồ sơ/source của map đó; không sao camera bounds hoặc collider Map01 sang mọi map mới.
- Các level playground, small, tiles, map01-graybox và map đã tích hợp phải giữ tương thích trong task không nhắm đến chúng.

Nội dung mới phải nối tiếp quy chuẩn art/sprite/atlas. Không tự mở rộng sang combat, checkpoint, cổng khoá, editor hoặc map production khi chưa được giao.
