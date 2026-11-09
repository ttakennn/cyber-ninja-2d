# Ninja Hỏa — animation chốt cho production

**Idle hiện hành · Task10.46:** đã release theo yêu cầu người dùng giao tự review rồi phát hành: cạnh tay sạch, khăn bụng có nếp và tà đỏ phục hồi; kiếm ngắn sau lưng. [So production gốc/10.45/bản release](../../../map01/commits/task-010-46-ninja-idle-fabric-restore/preview.html), [hồ sơ và giới hạn](../../../map01/commits/task-010-46-ninja-idle-fabric-restore/README.md).0RGBA khác ngoài6rect Idle,39file khác giữ hash; không phải người dùng trực tiếp xem/duyệt10.46. Browser bị dừng vì URL Chrome không xác định; runtime/test/build NOT_RUN, chưa commit. Các candidate Idle bên dưới giữ lịch sử, chưa chọn cho gặp quái/chạy.

**Candidate Idle mới nhất, sửa hai vùng khoanh vàng:** [Task10.45](../../../map01/commits/task-010-45-ninja-idle-seam-cleanup/preview.html), lấy lại silhouette/alpha sát giáp và mép đai production, nối texture đai ở phần phụ kiện cũ che. Có so production/10.44/bản sửa cùng frame, chi tiết4× và GIF6frame. Chờ duyệt; chưa publish/runtime/commit, browser/test/build NOT_RUN.10.44 bên dưới giữ lịch sử còn lỗi theo phản hồi mới.

**Candidate Idle mới nhất, sửa bụng/cánh tay:** [Task10.44](../../../map01/commits/task-010-44-ninja-idle-production-restore/preview.html), lấy lại6frame native production, giữ cơ/giáp/găng và bụng–đai gốc; chỉ phục hồi phần bị kiếm hông che. Giữ kiếm sau lưng bám vai. So3cột production/10.42/bản sửa, crop4× và GIF6frame; đã xem PNG/audit, browser/test/build NOT_RUN. Chưa duyệt/publish/runtime. Bản10.42 dưới đây là lịch sử phản hồi còn lỗi; gặp quái/chạy vẫn hoãn.

**Bản chuẩn đã tái xác nhận:** [PRODUCTION_REFERENCE](../rules/PRODUCTION_REFERENCE.md), ghi từ4file người dùng gửi Task10.43 và đối chiếu atlas/metadata/manifest repo. Đây là chuẩn tạo hình/kỹ thuật để tiếp tục sửa; các candidate dưới đây giữ trạng thái chờ duyệt, chưa được chọn thay bộ production.

**Candidate Idle sửa hai vùng đánh dấu:** [Task10.42](../../../map01/commits/task-010-42-ninja-idle-contact-fix/preview.html), bỏ đoạn cán cũ bên nắm tay và nối gốc chuôi sau mép khăn; giữ mắt/bụng/đai và chuyển động10.41. Có bảng soi hai vùng đủ6frame/GIF trước-sau, đã xem atlas/chi tiết. Chưa duyệt/publish/runtime; browser/test/build NOT_RUN. Gặp quái/chạy vẫn chờ.

**Candidate Idle sửa bụng/đồng bộ trang bị:** [Task10.41](../../../map01/commits/task-010-41-ninja-idle-attached-sword/preview.html), thân/đầu production, kiếm rút ngắn chỉ lộ chuôi, neo vai6frame và phục hồi hông theo đúng pose; có GIF toàn thân/bụng4×. Đã xem PNG/audit, GIF nhận6frame; browser dừng do Computer Use không xác định URL Windows. Chưa duyệt/publish/runtime, test/build NOT_RUN; gặp quái/chạy vẫn chờ.

**Candidate Idle theo phản hồi mắt/kiếm mới nhất:** [Task10.40 · giữ mắt gốc/kiếm đứng giữa lưng](../../../map01/commits/task-010-40-ninja-idle-vertical-sword/preview.html). Đầu và vùng cơ thể không sửa giữ pixel atlas production,0pixel khác trong audit6frame; kiếm là lớp cứng đứng sau thân, chỉ phục hồi vùng kiếm hông. Chờ duyệt riêng Idle, chưa publish/runtime; ảnh/atlas đã xem, browser/test/build NOT_RUN. Gặp quái/chạy vẫn chờ.

**Candidate Idle mới theo phản hồi:** [Task10.39 · chỉ đứng/thở](../../../map01/commits/task-010-39-ninja-idle-production-correction/preview.html), lấy6frame Idle production làm nguồn ảnh duy nhất, sửa ống chân/gấu quần và trục kiếm–bao kiếm sau lưng. Chờ duyệt riêng Idle, hoãn sửa gặp quái/chạy. Đã xem so sánh/atlas, browser/test/build NOT_RUN. Chưa publish/runtime; ảnh production ở đây giữ nguyên.

**Candidate locomotion thay10.37 theo phản hồi mới:** [Task10.38 · Idle đứng thẳng/chạy sải dài](../../../map01/commits/task-010-38-ninja-upright-locomotion/preview.html). Hai Idle đều buông tay, giữ chuẩn kích thước Idle gốc; chạy tay trái ngang ngực, dùng cùng hệ số kích thước. Có so/chồng ảnh gốc. Chưa duyệt/publish/runtime; đã xem atlas, Chrome tải Idle, toàn chuyển động chưa xác nhận. Bản10.37 dưới đây giữ lịch sử, không phải art được chọn.

**Candidate locomotion mới:** [Task10.37 · kiếm sau lưng](../../../map01/commits/task-010-37-ninja-back-sword-locomotion/preview.html), Idle8/cảnh giác8/đi8/chạy12frame, tham khảo tư thế từ ảnh người dùng và giữ tạo hình Ninja Hỏa. Chưa duyệt/publish/tích hợp game. Đã xem atlas; Chrome tải preview và trạng thái Idle, chưa xác nhận toàn vòng chuyển động. Bản locomotion production bên dưới vẫn là bộ đã chốt trước đó.

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
