# Ninja Hỏa — animation chốt cho production

- [Mở preview tổng hợp](preview.html): chọn nhóm động tác cơ bản, combo, phi tiêu, hai tuyệt kỹ, xuất hiện và hồi sinh theo bố cục đã chọn cho Boss Khan. [Basic preview](basic-preview.html) giữ bộ điều khiển tua/frame kế, tốc độ, nền và so Idle của bản trước; từng nhóm combo/skill dùng cùng renderer với danh sách clip riêng, không đổi ảnh hay metadata.
- [Thiên Hỏa Giáng Lâm1,65s](heavenly-fire-entrance/preview.html) và [Thiên Hỏa Tái Lâm0,75s](heavenly-fire-respawn/preview.html): art đã chốt, chưa tích hợp spawn/respawn vào game.
- [Hồ sơ production / nguồn / hash](production.json).
- [Contract nhân vật hiện hành](../rules/SPRITE_SPEC.md).

Theo lời chốt của người dùng, thư mục này là nguồn **art final cho production**. Không đặt bản thử vào đây. [Quy tắc production và lịch sử](../../../rules/ANIMATION_PRODUCTION.md); mỗi task vẫn phải có hồ sơ/snapshot trong commits. Art final không đồng nghĩa gameplay/damage/AI hoặc runtime mới đã nghiệm thu.

## Danh mục

| Nhóm | File/điểm xem |
| --- | --- |
| Đứng, đi/chạy, nhảy/rơi/tiếp đất, cúi/vào cúi, trúng đòn, leo lên/xuống/dừng | locomotion/animations.json và flame-ninja-atlas.png |
| Đánh thường combo1–2–3 | attacks/; giữ speed0,8 đã chốt |
| Phi tiêu đứng/cúi và projectile | skills/fire-shuriken/ |
| Skill1 E — Minh Vương Bạo Viêm | skills/special-01/; cast/orb/explosion và manifest |
| Skill2 Q — Cửu Long Hỏa Trận | skills/nine-dragons/; cast/dragon/seal/burst/aura và manifest |
| Xuất hiện / hồi sinh | heavenly-fire-entrance/ và heavenly-fire-respawn/ |

Đi/chạy dùng cùng clip run hiện hành; chưa có walk riêng, không tự vẽ/đặt alias mới. Tất cả runtime PNG/JSON/manifest được sao chép nguyên file, không repack/resize/recolor hoặc sửa FPS/frame/pivot. Có15sheet/26clip nguồn hiện hành và hai bộ xuất hiện/hồi sinh riêng. Menu còn cho xem FX độc lập; chế độ ghép chỉ minh hoạ artwork bằng Canvas2D, chưa chứng nhận khớp shader/physics/gameplay.

## Leo đã chốt

Bản v2 đã nằm trong atlas runtime canonical từ trước, SHA256432f63db6c14141940c4bf07e622df55381143348f7dcbde46aaa0013eadf2c2. Không có atlas leo cũ đang dùng để thay lại. Đã bỏ hậu tố ở nguồn/script active: integration/ninja-climb/climb-poses.png và scripts/create_ninja_climb.ps1. Production chỉ lấy atlas canonical này; bản cũ chỉ ở Git/lịch sử, không trộn vào thư viện. Atlas debug riêng không phải bản leo cũ và được giữ nguyên.

## Nguồn và cập nhật

Plan: integration/ninja-animation-library/production-plan.json. scripts/publish_ninja_animation_library.mjs copy đúng danh sách đã duyệt, tạo production.json/review-data.js và cập nhật approval metadata hai bộ xuất hiện từ plan; không tạo lại PNG hoặc ghi public/assets. Source/promote script cũ vẫn giữ provenance, không chạy trong lượt gom thư viện.

Artwork mới phải authoring/review trong commits theo task; chỉ copy bộ đã chốt vào đây rồi publish catalog. Hai generator Ninja và Sói Điện đã đổi đường ra authoring về reviewDirectory trong commits; mode publish Sói Điện mới cập nhật production. Mỗi task chọn reviewDirectory riêng để không ghi đè snapshot cũ.

Lịch sử lượt gom: docs/map01/commits/task-010-ninja-production/. [Lịch sử đổi bố cục preview](../../../map01/commits/task-010-27-ninja-preview-layout/README.md). Đã mở preview file cục bộ trong Chrome, thấy nhóm combo/phi tiêu và Canvas con tải được; chưa duyệt hết các nhóm bằng mắt. Test/build/lint/typecheck/formatter **NOT_RUN**. Không thay src/public/assets/physics/input hoặc tích hợp spawn/respawn.
