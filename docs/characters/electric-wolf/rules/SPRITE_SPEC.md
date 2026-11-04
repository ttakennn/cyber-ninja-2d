# Ninja Sói Điện — artwork đã duyệt / chưa tích hợp runtime

Kế thừa [sprite chung](../../../rules/SPRITE_SPEC.md), [art chung](../../../rules/ART_STYLE_GUIDE.md). Vai trò: quái thường melee, tên nhóm Côn Đồ Gậy Điện. **Người dùng đã chốt tạo hình v1, di chuyển/nhảy/leo, Electric Baton v2, trúng đòn, cảhai skills và màn xuất hiện từ khói điện**. Chưa tích hợp runtime. [Thư viện preview lâu dài](../animation/preview.html), [danh mục và cách cập nhật](../animation/README.md).

## Danh tính theo yêu cầu

Thanh niên ninja đường phố kết hợp sói dễ thương: mặt vẫn là người, tai sói nhỏ nhọn, hai nanh nhỏ, mắt cyan láu cá; hoodie tím than/đen, khăn, đai vải, quấn tay/chân xám trắng, gậy điện công nghệ cyan. Nhỏ gọn, linh hoạt, hơi thấp hơn Ninja chính; không kinh dị/đột biến.

Hơi chibi là yêu cầu riêng mới của người dùng cho nhân vật này, không thay style/danh tính/tỉ lệ Ninja chính hoặc các nhân vật khác. Giữ sprite2D, chất liệu/viền/shading phù hợp Illustrated textured pixel art. Không dùng bomber/jeans từ brief cũ.

## Candidate và thông số review

- Source nguyên byte: integration/task-010-electric-wolf/source/electric-wolf-ninja-v1.png, **1254×1254 RGBA** thực tế (prompt yêu cầu1024×1024, không khai giả file thật).
- Pose guard nhìn phải hơi3/4; tóc xám trắng, hai tai, gậy một tay, tay còn lại bảo vệ. Tạo hình/khăn hạ dưới môi để lộ nanh đã được chốt qua v1; không tự đổi danh tính trong các pose sau.
- Source/metadata/prompt: art-plan.json, design.json, prompts/design-v1.md cùng thư mục integration; tool image_gen.imagegen built-in, sourceOriginal trong metadata.
- Tỉ lệ đề xuất hiển thị:88% chiều cao alpha≥128 của Ninja tham chiếu, tính cả tai; khoảng220.88px so với251px. Preview tham chiếu160px/world unit, không thay byte/kích thước PNG hoặc scale Ninja. Hệ số vẽ raw khoảng0.1949514563, không phải scale runtime đã chốt.
- Pivot trong design.json chỉ căn ảnh tĩnh. Bộ animation candidate đề xuất kỹ thuật ở phần dưới, không tự thành collider/contract gameplay đã duyệt.

## Animation candidate10.2

Hiện hành: toàn bộ10clip và FX điện mặt đất/khói xuất hiện đã được chốt art. Thư viện xem lại chuyển sang docs/characters/electric-wolf/animation/, chứa đủ10atlas/JSON, bảng pose, dữ liệu và tham chiếu để preview tại chỗ. Nguồn authoring vẫn ở integration; generator xuất về thư viện nhân vật và có -PublishOnly để sao chép nguyên file mà không tạo lại ảnh. Frame/pivot/scale/timing và gameplay giữ nguyên; các cập nhật chờ duyệt bên dưới là lịch sử.

Hiện hành màn xuất hiện: Skill2/body groundShock và FX groundWave đã được chốt. Thêm spawn8pose và spawnSmoke8frame; tổng10sheet/10clip, giữ frame512/pivot(256,416)/160px-unit/chiều cao guard220.88px. Body giữ scale tham chiếu; khói dùng chiều rộng ô300px/scale chung0.78125 và anchor cố định để wisps tan tự nhiên. Preview2320ms, khói1640ms, body hiện dần rồi động tai/nghiêng đầu cười/xoay gậy về guard; không thay PNG cũ hoặc chốt trigger/bất tử/AI. [Báo cáo xuất hiện](../../../map01/commits/task-010-07-electric-wolf-entrance/README.md). Các cập nhật bên dưới giữ lịch sử review.

Hiện hành: Skill1 đã được chốt, thêm groundShock8pose và groundWave8frame FX riêng cho Skill2. Tổng8sheet/9clip, giữ frame512/pivot(256,416)/160px-unit và chiều cao guard220.88px. Body dùng một scale từ guard0; FX dùng một scale từ chiều rộng ô nguồn về256px, không áp chuẩn chiều cao nhân vật cho tia điện. Clip1–7, điện phát tại pose4/480ms; nhịp/quãng/vật cản chỉ minh hoạ art, chưa gameplay. [Báo cáo Skill2](../../../map01/commits/task-010-06-electric-wolf-ground-shock/README.md). Các cập nhật bên dưới giữ lịch sử review.

Mới nhất: người dùng chốt hurt và giao vẽ Skill1 Điện Quang Đột Kích. Thêm dash8pose nguồn (guard0 so cỡ, clip1–7), cảnh báo1–2 tổng500ms theo yêu cầu, sau đó lao/hãm/thu thế. Tổng6sheet/8clip, giữ frame512/pivot(256,416)/160px-unit/chiều cao guard220.88px; chỉ thêm atlas mới, ảnh cũ giữ nguyên. Quãng lao/timing còn lại là minh hoạ art, chưa chốt damage/knockback/AI/cooldown. [Báo cáo skill1](../../../map01/commits/task-010-05-electric-wolf-dash/README.md). Các cập nhật bên dưới giữ lịch sử review.

Cập nhật2026-11-04: người dùng duyệt Electric Baton v2 và giao art trúng đòn. Thêm hurt8pose/795ms minh hoạ, giữ frame/pivot/density/chiều cao và các PNG đã duyệt; tổng5sheet/7clip hiện hành. Không tự chốt hitstun/knockback/damage. [Art hurt/giới hạn](../../../map01/commits/task-010-04-electric-wolf-hurt/README.md). Nội dung review bên dưới giữ lịch sử.

Review2026-11-04: người dùng đã duyệt art đứng/chạy/nhảy/leo lên-xuống; yêu cầu sửa riêng Electric Baton. Combo v2 đổi8pose để vươn tay tự nhiên và cung điện quét xa hơn, nhấn4–5; source/candidate combo-v2 giữ bản cũ để truy vết. Byte3PNG locomotion/jump/climb giữ nguyên. Frame/pivot/chiều cao220.88px/88% và timing không đổi; tầm cung sáng mới chưa là hitbox. [Báo cáo10.3](../../../map01/commits/task-010-03-electric-baton-v2/README.md).

Nguồn integration/task-010-electric-wolf/animation/animation-plan.json, source/prompts và scripts/prepare_electric_wolf_animation.ps1. Đầu ra4atlas2048×1024, mỗi sheet8ô512×512/pivot(256,416);160px/world unit và visual3.2×3.2 giữ chiều cao tham chiếu220.88px. Không thay atlas/cỡ/pivot của Ninja chính.

Clip: idle2pose/run6pose, jump8pose, climbUp4pose/climbDown4pose độc lập, combo8pose chứa hai lần vung và recovery. Mỗi source sheet một scale chung từ pose tham chiếu, không fit bbox từng frame. Chỉ dịch căn chân khi grounded; airborne/climb giữ điểm neo nguồn để không kéo chân co xuống mặt đất. Tỉ lệ đầu/thân và chuyển clip vẫn cần review animation.

Leo dùng góc lưng, gậy cài đai, hai tay/chân luân phiên. Không dùng mirror cả người để giả đổi tay/chân; leo lên và xuống dùng nhóm pose khác nhau. Thang nét vẽ ở preview tách khỏi PNG; khớp bậc, phase và mọi chuyển tiếp runtime chưa kiểm tra.

Timing trong animation-plan chỉ phục vụ art, chưa chốt tốc độ/chuyển động nhảy/leo, recovery hoặc sự kiện damage. Không dùng alpha ảnh làm collider, không tự recolor/resize Ninja chính. Chưa damage/AI/spawn/boss hoặc special skills. [Preview animation và báo cáo](../../../map01/commits/task-010-02-electric-wolf-animation/README.md). Tạo hình đã duyệt không đồng nghĩa animation/runtime được nghiệm thu.
