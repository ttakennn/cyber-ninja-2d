# Ninja Sói Điện — thư viện hoạt ảnh đã duyệt

[Mở preview tổng hợp](preview.html). Đây là nơi xem lại nhân vật lâu dài; không cần vào docs/map01/commits/. Người dùng đã chốt tạo hình, toàn bộ hoạt ảnh, hai kỹ năng và màn xuất hiện từ khói điện. Phê duyệt art chưa đồng nghĩa đã tích hợp quái/AI/damage/spawn vào game.

## Danh mục

| Hoạt ảnh | Sheet / bảng pose |
| --- | --- |
| Đứng / thở | [locomotion](locomotion-contact.png), frame0–1 |
| Di chuyển | [locomotion](locomotion-contact.png), frame2–7 |
| Nhảy / rơi / tiếp đất | [jump](jump-contact.png) |
| Leo lên / leo xuống | [climb](climb-contact.png), nhóm0–3/4–7 |
| Electric Baton hai đòn | [combo v2](combo-contact.png) |
| Trúng đòn / hồi thế | [hurt](hurt-contact.png) |
| Skill1 — Điện Quang Đột Kích | [dash](dash-contact.png), cảnh báo500ms |
| Skill2 — Điện Chấn Mặt Đất | [groundShock](groundShock-contact.png), [điện riêng](groundWave-contact.png) |
| Xuất hiện từ khói điện | [spawn](spawn-contact.png), [khói riêng](spawnSmoke-contact.png) |

Preview có10clip, dừng/chạy/tua/frame kế, tốc độ/zoom/nền, so Ninja chính và bóng tạo hình; các lớp khói/hiện dần/điện mặt đất có nút bật tắt riêng. Mở preview.html trực tiếp bằng file:// hoặc qua localhost, giữ đầy đủ thư mục này. Trang không dùng fetch/module/getImageData, mọi PNG/script phục vụ hiển thị đều nằm tại đây.

## Cấu trúc / thông số

```text
animation/
  preview.html          # Điểm xem lại chính
  atlas.json            # Danh mục sheet, frame, pivot, clip và approval
  review-data.js        # Dữ liệu dùng cho preview mở trực tiếp
  candidate/            # 10PNG atlas đã chọn + JSON tương ứng
  reference/            # Tạo hình Sói Điện, Ninja so cỡ, design-data.js
  *-contact.png         # 10bảng pose để xem từng frame
```

Tên candidate/ giữ tương thích đường dẫn metadata authoring;10sheet được chọn ở đây đã duyệt art, không phải tích hợp runtime. Combo dùng combo-v2.png, không đưa bản combo v1 hoặc các lần tạo ảnh bị bỏ vào thư viện này.

Giữ atlas2048×1024,8ô512×512/pivot(256,416),160px/world unit và chiều cao guard220.88px/88% Ninja. Không resize/repack/recolor hoặc chỉnh timing trong lượt tổ chức thư mục. Bản gốc/source/prompt/provenance vẫn ở [integration/task-010-electric-wolf/animation](../../../../integration/task-010-electric-wolf/animation/README.md), [plan](../../../../integration/task-010-electric-wolf/animation/animation-plan.json). Các trường source/prompt/plan trong JSON tính từ thư mục authoring này; image tính từ thư mục preview. [Rules nhân vật](../rules/SPRITE_SPEC.md).

## Cập nhật về sau

Quy định mới2026-11-04: thư mục animation/ là art final production theo [ANIMATION_PRODUCTION](../../../rules/ANIMATION_PRODUCTION.md). Authoring -OnlySheet giờ ghi reviewDirectory trong commits; chỉ -PublishOnly sau lời chốt mới đồng bộ vào production. Mỗi task vẫn lưu báo cáo/ảnh/snapshot trong commits và phải chọn reviewDirectory mới. Mô tả xuất trực tiếp về đây bên dưới giữ lịch sử workflow trước thay đổi này.

scripts/prepare_electric_wolf_animation.ps1 xuất bảng pose về thư mục này, đồng bộ atlas/JSON/script dữ liệu và ảnh tham chiếu sau authoring. Dùng -OnlySheet <tên> khi được giao cập nhật riêng một sheet. Dùng -PublishOnly để đồng bộ metadata và sao chép nguyên file đã chọn, không tạo lại hoặc xử lý PNG. Preview HTML được duy trì tại đây; bản trong commits giữ làm lịch sử, không còn là nơi cập nhật thư viện.

Lượt tổ chức2026-11-04 đã dùng -PublishOnly, bổ sung approval spawn/spawnSmoke theo lời chốt của người dùng và các liên kết tài liệu. Tất cả ảnh được sao chép nguyên file từ pack đã chọn, giữ bản nguồn/lịch sử; không gọi ImageGen hoặc chạy lại normalization. Không sửa src/public/assets/map/gameplay, không commit/merge/push.

Chưa thao tác preview ở vị trí mới trong trình duyệt. Test/build/lint/typecheck/formatter **NOT_RUN** theo yêu cầu hiện hành. Thời gian/cự ly/VFX và vật cản trong preview phục vụ xem art, chưa chứng nhận hành vi combat hoặc spawn trong game.
