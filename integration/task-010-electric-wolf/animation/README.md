# Sói Điện — artwork animation candidate

**Thư viện hiện hành:** người dùng đã chốt toàn bộ art, gồm spawn/spawnSmoke. Xem lại tại [docs/characters/electric-wolf/animation/preview.html](../../../docs/characters/electric-wolf/animation/preview.html), [danh mục](../../../docs/characters/electric-wolf/animation/README.md), không dùng commits làm điểm cập nhật preview. Authoring source/plan/prompt ở đây giữ nguyên; generator xuất bảng pose và đồng bộ selected atlas/JSON/tham chiếu về thư viện mới. -PublishOnly chỉ ghi metadata/copy file, không xử lý lại PNG; lượt tổ chức đã dùng chế độ này. Chưa runtime/test/build/browser tại vị trí mới/commit/merge. Các trạng thái chờ duyệt và đường dẫn commits bên dưới là lịch sử.

**Hiện hành màn xuất hiện:** Skill2 đã được người dùng chốt. Thêm spawn8pose và spawnSmoke8frame; tổng10sheet/10clip, [preview](../../../docs/map01/commits/task-010-02-electric-wolf-animation/preview.html) mở sẵn Xuất hiện từ khói điện. [Báo cáo/nguồn](../../../docs/map01/commits/task-010-07-electric-wolf-entrance/README.md). Source1536×1024, candidate2048×1024/8ô512/pivot(256,416); body giữ guard220.88px, khói width300/scale0.78125/anchor cố định. Clip2320ms, khói1640ms, reveal260–860ms chỉ để review art; chưa gameplay. Chỉ authoring spawn/spawnSmoke,8PNG cũ giữ nguyên. Các trạng thái bên dưới là lịch sử.

**Hiện hành Skill2:** Skill1 đã được người dùng chốt. Thêm groundShock8pose nhân vật và groundWave8frame FX riêng; tổng8sheet/9clip. [Preview](../../../docs/map01/commits/task-010-02-electric-wolf-animation/preview.html) mở sẵn Điện Chấn Mặt Đất, [nguồn/báo cáo](../../../docs/map01/commits/task-010-06-electric-wolf-ground-shock/README.md). Source mỗi sheet1536×1024, candidate2048×1024/8ô512/pivot(256,416). Body giữ chiều cao guard220.88px; FX dùng targetCellWidthPx256/scale2/3 cho cả sheet, không fit từng frame. Chỉ authoring -OnlySheet groundShock rồi groundWave,6PNG cũ giữ nguyên. Skill2 chờ duyệt, nhịp/quãng/box minh hoạ chưa là gameplay; các trạng thái bên dưới giữ lịch sử.

**Hiện hành Skill1:** hurt đã được người dùng chốt. Thêm Điện Quang Đột Kích,6sheet/8clip tổng cộng; [preview mở sẵn dash](../../../docs/map01/commits/task-010-02-electric-wolf-animation/preview.html), [báo cáo/nguồn](../../../docs/map01/commits/task-010-05-electric-wolf-dash/README.md). Source dash1774×887 dùng sourceRects tường minh; candidate2048×1024/8ô512, cùng pivot/density/cỡ. Pose0 so cỡ, clip1–7/1100ms với1–2 cảnh báo đúng500ms; quãng lao/timing khác chưa là gameplay. Chỉ authoring -OnlySheet dash,5PNG cũ giữ nguyên. Skill1 chờ duyệt, Skill2 chưa vẽ; các trạng thái phía dưới là lịch sử.

**Mới nhất:** Electric Baton v2 đã được người dùng duyệt. Thêm hurt8pose trúng đòn/hồi thế, đang chờ duyệt; [preview](../../../docs/map01/commits/task-010-02-electric-wolf-animation/preview.html) mở sẵn hurt, [báo cáo/provenance](../../../docs/map01/commits/task-010-04-electric-wolf-hurt/README.md). Source hurt1536×1024, candidate2048×1024/8ô512/pivot(256,416)/160px-unit/chiều cao tham chiếu220.88px. Tổng5sheet/7clip. Chỉ authoring -OnlySheet hurt, các PNG cũ không sinh lại; timing795ms là minh hoạ art, chưa hitstun/knockback/damage/runtime. Các mục10.3 bên dưới là lịch sử trước duyệt combo.

**Cập nhật10.3:** người dùng đã duyệt đứng/chạy/nhảy/leo lên-xuống; chỉ Electric Baton cần sửa. Preview hiện dùng combo-v2 với tay/gậy vươn ra trước và cung điện xa hơn, nhất là frame4–5. [Báo cáo / trước-sau](../../../docs/map01/commits/task-010-03-electric-baton-v2/README.md). Combo mới chưa duyệt;3PNG locomotion/jump/climb giữ nguyên byte theo SHA256. Không đổi timing hoặc runtime.

Tạo hình v1 được người dùng chốt (“Ok chốt”), yêu cầu thêm di chuyển, nhảy, leo lên/xuống và đánh thường. Giữ ngoại hình, palette, tỉ lệ đã review88% chiều cao Ninja. Không thêm skill Điện Quang Đột Kích/Điện Chấn Mặt Đất hoặc gameplay.

## Nguồn và atlas

Bốn sheet chọn được vẽ bằng **image_gen.imagegen built-in** từ PNG v1 đã duyệt. Không CLI/API fallback. Prompt nguyên văn trong prompts/, output gốc và các lượt sửa leo trong source/. Không ghi đè tạo hình gốc, Ninja hoặc public/assets.

| Sheet | Output gốc được chọn | Pose |
| --- | --- | --- |
| locomotion | exec-e72d660f-d0c3-4fdc-9589-e28d646a2c6e.png | idle0–1, run2–7 |
| jump | exec-ad29dba8-279d-4a16-a252-7b860dfd48aa.png | 8pha chuẩn bị/bật/bay/rơi/tiếp đất |
| climb | exec-8ded4c8e-51df-4a87-af0d-3af74adc68e0.png | up0–3, down4–7 |
| combo v2 | exec-86a2fa60-0488-44c0-918e-1e611ed1529b.png | 8pha, vung1 ở2, vung2 ở5, recovery6–7; tay/cung sáng vươn xa |
| hurt | exec-54adeb7c-b3c3-4e56-8c00-8e4167a1c52f.png | 8pha:thủ/giật/ngả/lùi/lấy thăng bằng/hồi thế;795ms minh hoạ |
| dash | exec-8b9ba1c0-2bfb-40b1-9d35-4bc3521da006.png | guard0 tham chiếu; cảnh báo1–2/500ms, lao3–5, thu6–7 |
| groundShock | exec-7b0ce408-698a-4696-aac2-a6ffa7a26585.png | guard0; lấy đà/giơ1–2, bổ3/chạm4, giữ5/thu6–7 |
| groundWave | exec-4cdec00b-5aeb-452f-a1f6-07a438a96e37.png | FX sinh0/lan1–4/hết tầm5/bị chặn6/tan7 |
| spawn | exec-00136fb0-8dda-4ea2-8a03-025381cf3793.png | guard0; hiện1–2/tai3/cười4/xoay5/bắt6/sẵn sàng7 |
| spawnSmoke | exec-b52ff188-3301-4b23-92eb-a2813296d700.png | bật0/nở1–2/tách3–4/tan5–7 |

Leo đã sửa bằng công cụ ảnh ba lượt có chủ đích: source/climb-first.png (exec-f4377fa1-34ba-4353-aeb0-6f5adebcb758) còn lặp tay phải; climb-hands.png (exec-e7f9ec59-b216-4eb7-be22-169fa68af30e) sửa tay; climb-legs.png (exec-86f5cb64-fb17-4706-a661-3de1f7c8a4c4) sửa chân nhưng còn nền mờ; source/climb.png là lượt sửa alpha cuối. Giữ các lượt/prompt để thấy provenance, không dùng bản nền mờ trong candidate.

animation-plan.json là nguồn authoring. `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/prepare_electric_wolf_animation.ps1` ghi candidate4PNG/4JSON, atlas.json, review-data.js và contact sheet. Thêm `-OnlySheet combo` để cập nhật riêng combo, giữ ảnh các sheet khác. Ba source locomotion/jump/climb1536×1024/4cột2hàng; combo-v2 có source thật1086×1448/2cột4hàng. Đầu ra đang dùng đều2048×1024,8ô512×512/pivot(256,416), visual3.2×3.2unit ở160px/unit. File combo.png/.json cũ giữ làm lịch sử; metadata hiện trỏ candidate/combo-v2.png. Đây là đề xuất kỹ thuật riêng Sói Điện, không đổi contract Ninja chính.

Mỗi sheet chỉ dùng một scale từ chiều cao pose đầu về220.88px, không fit bbox từng frame. Frame đứng/đỡ đất chỉ dịch theo chân; airborne/climb giữ anchor nguồn cố định để không kéo chân co xuống sàn. Cùng hệ quy chiếu ngang nguồn, có ghi sourceAnchor/translation/audit trong metadata. Nhịp và anatomy mới vẫn cần người dùng review trước dùng trong game.

Ở combo v1, plan đã mở rect2 từ384 lên420px để giữ gậy. Bản v2 dùng các sourceRect mới theo grid2×4 và khoảng trống giữa hàng, có sourceAnchor tương ứng; xem báo cáo10.3. Không cắt đầu gậy/cung điện hoặc scale riêng pose2/5.

## Preview / giới hạn

[Preview](../../../docs/map01/commits/task-010-02-electric-wolf-animation/preview.html) dùng classic JS và drawImage, mở được trong repo qua file:// hoặc localhost, không getImageData/fetch/module. Có6clip, pause/tua/frame kế, tốc độ/zoom/nền, bóng tạo hình, Ninja so tỉ lệ và thang nét tham chiếu tách khỏiPNG. Chưa chạy preview HTML trực tiếp ở trình duyệt trong lượt này.

Đã xem các sheet và contact sheet; đã đọc alpha ngoài hình của bản leo sửa cuối bằng0. Nhịp/đường nhảy/thang chỉ phục vụ art; chưa chứng minh tay/chân khớp mọi bậc thang runtime hoặc chuyển clip không giật. Chưa damage/hitbox/AI/spawn/cooldown hoặc world physics. Test/build/lint/typecheck/formatter NOT_RUN; chưa commit/merge/push hoặc gọi animation được duyệt.
