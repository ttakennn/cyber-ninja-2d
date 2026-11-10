# Ninja Hỏa — animation chốt cho production

**Bản chạy đang review — Task 10.54:** [preview 12 frame vẽ lại](../../../map01/commits/task-010-54-ninja-run-compact/preview.html). 10.53 đã bị bác vì sai kích thước/tỷ lệ và mở chân quá rộng. Bản mới đối chiếu trực tiếp chuẩn 10.51 + run production, giữ một tỷ lệ chung, thân hướng tới khoảng 30° và thu gọn vòng chân. Có GIF/tua/chậm/so cùng pixel; chưa chốt production hoặc đưa game. Các mục 10.53 dưới đây là lịch sử trước phản hồi.

**Candidate chạy mới — Task10.53:** [preview riêng](../../../map01/commits/task-010-53-ninja-run-reference/preview.html), lấy tạo hình51 đã chốt và cơ học12pose người dùng gửi.12frame sải chạy, tay phải giữ chuôi sau gáy/tay trái ngang ngực; có so chuẩn51 và run hiện tại, frame trước/sau, ảnh soi và GIF.18FPS là nhịp đề xuất. Chưa duyệt/publish/runtime/commit; production51 và run cũ giữ nguyên. Đã rà ảnh và đóng gói, browser/test/build NOT_RUN.

**Vào thế chiến đấu chính thức:10.51 — người dùng đã CHỐT.** [Preview production](combat-idle/preview.html), [atlas/metadata/approval](combat-idle/README.md), [hồ sơ publish10.52](../../../map01/commits/task-010-52-ninja-combat-production-51/README.md). Hai frame vào thế và sáu frame thở giữ đúng PNG/rect/pivot/timing đã duyệt;40asset cũ không đổi, Idle10.47 vẫn chính thức. Chưa đưa vào game. Các mục candidate49–51 bên dưới giữ lịch sử trước lúc chốt; các candidate attack khác chưa được phê duyệt theo lần này.

**Candidate chiến đấu mới nhất — Task10.51:** [sửa bàn tay và thêm hai khung đầu](../../../map01/commits/task-010-51-ninja-combat-grip-entry/preview.html), giữ tạo hình50 đã được người dùng xác nhận sạch ảnh dư. Tay phải sửa ngón cái/cổ tay;2frame Nâng tay vào kiếm/Đưa tay về chuôi kiếm rồi6frame thở. Ngoài vùng tay sửa, sáu pose50 giữ nguyên RGBA. Đã soi ảnh và đóng gói; chờ duyệt, chưa production/runtime/commit, browser/test/build NOT_RUN.

**Candidate chiến đấu mới nhất — Task10.50:** [bản sửa](../../../map01/commits/task-010-50-ninja-combat-idle-pose-fix/preview.html) theo phản hồi10.49 còn ảnh tay cũ và sai tư thế.6pose vẽ liền khối, khuỷu phải cao gần đầu/cẳng tay thoải, tay trái lên trước ngực, thân ngả nhẹ sau; cân tỷ lệ theo Idle10.47. Có so nguồn/bản cũ/bản sửa và soi eo. Chờ duyệt, không thay production10.47/runtime/commit. Đã xem ảnh và đóng gói; browser/test/build NOT_RUN.10.49 dưới đây giữ lịch sử bản bị phản hồi.

**Candidate Idle chiến đấu — Task10.49:** [preview riêng](../../../map01/commits/task-010-49-ninja-combat-idle/preview.html), dựa trên Idle10.47 đã chốt: tay phải nắm chuôi kiếm sau gáy, tay trái gập giữ thế trước thân.2frame vào thế +6frame thở, ô/pivot/tỷ lệ giữ chuẩn; có so nguồn, ảnh soi và GIF. Chờ duyệt, chưa thay atlas/metadata production hoặc runtime, chưa commit. Đã xem PNG và kiểm tra đóng gói; browser/test/build NOT_RUN.

**Idle chính thức hiện hành:10.47 — người dùng đã CHỐT.** [Hồ sơ publish10.48](../../../map01/commits/task-010-48-ninja-idle-production-47/README.md), [xem lại đúng bản được duyệt](../../../map01/commits/task-010-47-ninja-idle-sash-alignment/preview.html). Canonical atlas đã nhận đúng6frame, không regenerate artwork; USER_APPROVED trong manifest/catalog/source plan. Các bản Idle10.37–46 dưới đây là lịch sử. Chưa cập nhật game runtime; browser/test/build NOT_RUN ở lượt publish.

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

**Candidate mới nhất:** [Task10.36 · xoay người chém](../../../map01/commits/task-010-36-ninja-spin-combo/preview.html), giữ đòn1,16pose xoay mới cho đòn2/3 và vòng mỏng từ nhịp2. Chưa duyệt/tích hợp game; Chrome đã tua được pose quay lưng body-only, chưa xác nhận đầy đủ toàn chuyển động/vòng/chống spam. Snapshot10.35 giữ lịch sử.

**Candidate mới:** [Ground Attacks Task10.35](../../../map01/commits/task-010-35-ninja-ground-attacks/preview.html),16pose body/12FX riêng, một đòn chờ/hồi220–320ms đề xuất. Người dùng chọn nhóm trên mặt đất trước; chưa duyệt art/timing hoặc đưa vào game. Chrome tải được trang/atlas; tương tác chống spam và độ mượt chưa xác nhận đầy đủ.

**Bản đang chờ duyệt, tách khỏi production:** [combo16pose Task10.33](../../../map01/commits/task-010-33-ninja-clean-combo/preview.html), sửa theo đà/thu guard và tách khung theo phản hồi mới. Giữ ảnh/metadata production hiện tại; chưa áp gameplay, chưa xác nhận chuyển động trong trình duyệt hoặc chạy test/build.

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

Task10.28: cơ bản còn 5 lựa chọn ghép, leo thang riêng; thêm Frame trước/sau, combo 1–2–3 và nhân vật đứng/cúi phóng phi tiêu. [Lịch sử](../../../map01/commits/task-010-28-ninja-preview-sequences/README.md). Preview mới chưa kiểm tra trình duyệt; không đổi art/runtime.

Task10.29: [candidate vẽ lại chạy/trúng đòn](../../../map01/commits/task-010-29-ninja-run-hurt-art/preview.html), có so Art cũ/mới. Chờ duyệt; PNG production/runtime hiện tại giữ nguyên.

Task10.30: run/hurt Task10.29 đã được người dùng chốt và publish nguyên byte vào atlas locomotion thư viện này. Runtime chưa thay. [Combo mới đang chờ duyệt](../../../map01/commits/task-010-30-ninja-combo-art/preview.html) có16pose, xem từng đòn/cả chuỗi và thử click với nhịp hồi thế.

Task10.31: người dùng bác hướng kiếm/VFX và thế hai tay Task10.30; [combo một tay mới](../../../map01/commits/task-010-31-ninja-one-hand-combo/preview.html) tham chiếu trực tiếp kiếm Hỏa/lửa gốc ở attacks/, chờ duyệt. Bộ attacks production hiện hành không bị thay.

Task10.32: [candidate phối hợp một/hai tay](../../../map01/commits/task-010-32-ninja-power-combo/preview.html) theo chỉ dẫn mới; nối theo đà kiếm, hồi thế sau chuỗi. Các candidate trước giữ lịch sử; chưa thay attack production/runtime.
