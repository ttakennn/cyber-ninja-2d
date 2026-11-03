# CỬU LONG HỎA TRẬN — nguồn art và runtime

## Trạng thái hiện hành

Preview hỗ trợ mở trực tiếp bằng file://: ảnh aura cần đọc pixel được đóng gói nguyên byte thành data URL trong review-aura.generated.js, sinh bằng `node scripts/prepare_nine_dragons_preview.mjs`. Khi cập nhật candidate/aura.png, sinh lại file này sau bước authoring artwork. HTTP/localhost vẫn tải PNG theo đường dẫn cũ; không đổi thuật toán độ dày, ảnh nguồn hoặc runtime. Giữ preview trong repo để tải các ảnh/script còn lại bằng đường dẫn tương đối.

Người dùng cập nhật runtime: **Q / kích thước2.0× / độ dày1.0× / cast1s**, aura7s/CD12s giữ nguyên. Phi tiêu và Minh Vương (pose/charge/orb/nổ) phát sáng cùng Ninja trong lúc Cửu Long còn hiệu lực; Q/E chung một card nhỏ. runtime-plan.json là nguồn quyết định tích hợp; scripts/promote_ninja_nine_dragons.mjs copy đúng5PNG candidate, sinh metadata runtime/manifest và src/config/nine-dragons.generated.json. Nén cả nhịp cast/FX theo5/7, không đổi PNG/kích thước Ninja. [Báo cáo mới](../../docs/map01/commits/task-009-17-skill-ui-timing-glow/IMPLEMENTATION.md). Chưa test/build/chơi thử/shader GPU/commit. art-plan.json, atlas.json, review-data.js và preview09.11 giữ trạng thái authoring lịch sử1.4s, không thay runtime-plan.json.

## Lịch sử authoring trước khi apply

Lựa chọn độ dày hiện hành: **1.0/1.3/1.5/1.7**, mặc định1.0; thay bộ0.3/0.5/0.7 theo yêu cầu tiếp. [Báo cáo](../../docs/map01/commits/task-009-14-aura-thickness-options/README.md). Các ghi chú bộ ba bên dưới mô tả lượt trước; ánh sáng Ninja/7s giữ nguyên.

Trạng thái: **CANDIDATE_ART_PREVIEW_ONLY**. Chưa được người dùng duyệt bộ mới, chưa promote public/assets hoặc gắn vào runtime. Baseline trước art:08294d4 trên codex/task-009-player-attack-art.

**Cập nhật vòng lửa7s:** sau1.4s thi triển có aura lặp8pha, tồn tại đến8.4s. Preview thêm chọn1.5×/2×/2.5× từ cỡ Bạo Viêm gốc; mặc định2× để so sánh, chưa chọn mức gameplay. [Báo cáo mới](../../docs/map01/commits/task-009-12-nine-dragons-aura/README.md). Sát thương aura lên quái/boss để sau;126HP bên dưới là brief ban đầu, không tính aura mới.

**Cập nhật độ dày/glow:** [review mới nhất](../../docs/map01/commits/task-009-13-aura-character-glow/README.md). Thêm độ dày0.3×/0.5×/0.7× giữ đường kính ngoài, Ninja viền vàng kem/quầng cam từ lúc cast đến lúc aura tắt; fade chung350ms cuối. review-effects.js là hiệu ứng Canvas2D/cache của trang preview, không phải PNG tạo lại hoặc mã runtime. art-plan.json giữ thông số; previewEffectsOnly chỉ sinh metadata, không ghi đè board lịch sử. PNG source/candidate không đổi; không cần ImageGen mới trong lượt này.

## Nguồn và công cụ

- Vẽ bằng **image_gen.imagegen built-in**, không dùng CLI/API fallback. Prompt nguyên văn trong prompts/: cast.md, dragon.md, seal.md, burst.md; hai lượt chỉnh alpha trong cast-alpha-edit.md và burst-alpha-edit.md.
- Aura mới: prompts/aura-loop.md, source/aura.png, ảnh tham chiếu do người dùng gửi giữ tại source/aura-reference.png; output gốc exec-e9ae7cc7-372b-49fe-82c3-860fe926c591.png. Atlas burst cũ là tham chiếu thiết kế bổ sung. Không tạo lại caster/dragon/seal/burst hoặc sửa canonical ninja.
- Tham chiếu chính: source/idle-reference.png copy từ idle gốc đã dùng review skill trước. Khi tạo caster còn tham chiếu integration/task-009-special-01/candidate/cast.png; FX tham chiếu explosion.png của skill trước về texture/shading, brief mới đổi chủ đích sang lửa vàng/cam/đỏ son.
- Giữ các PNG sinh thô trong source/. cast.png và burst-source-v1.png là bản đầu; cast-alpha.png và burst.png là lượt chỉnh riêng alpha được chọn. Tên exec gốc nằm trong art-plan.json, hash source/candidate và thông số từng frame nằm trong atlas.json. Không sửa hoặc ghi đè atlas nhân vật hiện hành.
- Khi xem RGB thô, bản tạo có màn sương đỏ/nâu; đã yêu cầu chỉnh alpha bằng công cụ ảnh rồi ghép kiểm trên nền trắng/navy tại alpha-review.png. Chỉ dùng alpha thực khi ghép, không dùng RGB của vùng alpha0 thành background.

## Dữ liệu và chuẩn hoá

art-plan.json là nguồn authoring; atlas.json và review-data.js được sinh bằng scripts/prepare_ninja_nine_dragons.ps1. Chạy trong **Windows PowerShell5.1** trên Windows: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/prepare_ninja_nine_dragons.ps1`. Script UTF-8 BOM để đọc chữ Việt đúng trong shell này, dùng System.Drawing cho crop/scale/pad, metadata, hash và board review; không gọi ImageGen lại và không có chế độ validation.

| Lớp candidate | PNG thật | Ô / số frame | Xử lý |
| --- | --- | --- | --- |
| cast.png | 2048×1024 | 512×512 / 8 | Source1536×1024 gồm8ô384×512; scale chung0.75, không fit mỗi pose; căn chân theo alpha≥128 về pivot(192,353), pad alpha vào ô512 |
| dragon.png | 1254×1254 | 627×627 / 4 | Copy nguyên byte source; prompt yêu cầu1024 nhưng output thực1254, metadata khai đúng kích thước thật |
| seal.png | 1254×1254 | 627×627 / 4 | Copy nguyên byte; pivot từng frame(313,403),(313,403),(313,326),(313,338) theo tâm ellipse để giữ vòng dưới chân |
| burst.png | 1536×1024 | 512×512 / 6 | Copy nguyên byte source đã chọn; cùng pivot(256,256), không auto fit từng pha |
| aura.png | 2048×1024 | 512×512 / 8 | Source thật1774×887; crop8ô443/444px theo sourceRects trong plan, pad về512 với pivot(256,256), không scale pixel nguồn |

Caster giữ160px/world unit, visual3.2×3.2unit, pivot(192,353) như các sheet attack/skills đã duyệt. Scale0.75 là chuẩn hóa từ ảnh tạo sang cỡ cơ thể gốc, không phải tăng scale nhân vật trong game. Không resize/repack atlas locomotion hoặc thay collider. Caster tám pose có rút kiếm → định kiếm → cắm kiếm → trụ giữ trận, khăn/vài chuyển động vai/hông; không dùng lật người để giả pose.

Hỏa long là **một atlas4pha**, được instance9lần và chia3nhóm×3 trong preview; không phải9thiết kế rồng riêng. Rotation/quỹ đạo chỉ áp FX. Vòng trận nằm dưới caster, rồng chia lớp sau/trước theo quỹ đạo, bạo viêm nằm trước nhưng có tâm rỗng để còn đọc người.

## Nhịp và brief gameplay

- Charge350ms → orbit800ms → burst250ms =1400ms. Caster frameMs100/130/120/200/200/200/200/250; burst30/35/55/55/40/35ms. Chữ tên skill1.5s, không nền/viền, mờ dần.
- Preview đề xuất ba mốc483/750/1150ms. Mốc1150ms là đợt3 kèm vụ nổ kết thúc, **không có hit thứ4**. Đây là nhịp art đề xuất, chưa chốt event gameplay.
- Brief được ghi nguyên thông số chính: cooldown12s;360°;3×30HP=90HP;Burn12HP/s×3s=36HP; tối đa126HP khi trúng đủ và Burn chạy đủ. Burn làm mới thời gian, không cộng dồn; mỗi wave chỉ gây damage một lần/enemyID; boss có thể kháng knockback. Chỉ ghi yêu cầu, không tự đặt giá trị knockback hoặc damage thật.
- Bán kính125px chưa có viewport tham chiếu từ người dùng. Preview dùng mốc cụ thể1280×720,DPR1,camera9unit cao →80CSSpx/unit →1.5625unit. Đây là đề xuất để review art, **chưa duyệt bán kính gameplay**; không nhầm160px/unit atlas với scale camera, không lấy alpha/vòng FX làm hitbox.
- Phím E mới trùng Minh Vương Bạo Viêm. Chỉ ghi yêu cầu E trong brief, chưa đổi binding/skill cũ; cần chốt trước tích hợp. Movement lock khi thi triển và Burn/hit flash/knockback của quái để bước sau; không sửa physics.

- Theo cập nhật mới, burst chỉ dùng4pha đầu trong250ms để nối sang aura, thay vì tan hết trước1400ms; PNG burst6pha vẫn giữ nguyên. Crossfade150ms, aura nở250ms lên hệ số chọn, lặp16fps và xoay0.35vòng/s; mờ tắt350ms cuối. Tất cả nằm trong1400..8400ms, không cộng thêm7s sau lúc nở. Cycle preview nhanh đổi2.4s→9.4s để không cắt ngang aura; tùy chọn cooldown12s vẫn có. Các số crossfade/grow/fade/rotation là thiết kế preview, chưa phải quy tắc gameplay được chốt.
- Generator ghi board của lượt mới vào evidenceDirectory task-009-12-nine-dragons-aura, giữ board/pose Task09.11 cũ làm lịch sử. Chỉ dựng lại metadata/candidate từ source hiện có, không chạy lại ImageGen cho caster hoặc đổi scale/pivot của nhân vật.

## Review

[Preview động](../../docs/map01/commits/task-009-11-nine-dragons-art/preview.html), [báo cáo](../../docs/map01/commits/task-009-11-nine-dragons-art/README.md), bảng pose và overview cùng thư mục. HTML dùng PNG + review-data.js, không import game. Có tua, tốc độ0.25/0.5/1×, nền sáng/tối/caro, idle ghost, vòng tham chiếu và chu kỳ nhanh/12s.

Đã xem board/artwork và preview qua IAB; chưa phải nghiệm thu game. Test/build/lint/typecheck/formatter **NOT_RUN**. Không gọi bộ mới là production hoặc tự promote trước khi người dùng duyệt.
