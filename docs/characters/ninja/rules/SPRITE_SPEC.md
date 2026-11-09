# Sprite Spec — riêng nhân vật ninja

Task10.52: người dùng chốt Vào thế chiến đấu10.51 cho art production tại [combat-idle/](../animation/combat-idle/README.md). combatEnter2frame100ms/không loop → combatIdle6frame140ms/loop; ô384×320/pivot192,289/160px-unit giữ chuẩn. Đây là sheet riêng đã duyệt, không thay Idle10.47 hoặc atlas locomotion, chưa đưa vào game. [Approval và bằng chứng](../../../map01/commits/task-010-52-ninja-combat-production-51/README.md).

Task10.48: người dùng chốt Idle10.47 làm chuẩn production; [approval và nguồn](../../../map01/commits/task-010-48-ninja-idle-production-47/README.md). Dùng chính6frame này khi tham chiếu Idle, giữ384×320/pivot192,289/FPS7.1429. Không tái tạo artwork khi publish hoặc dùng khăn bụng lỗi baseline cũ thay bản đã chốt. Không suy lời chốt Idle thành phê duyệt thêm attack/gặp quái/chạy/runtime.

[Bản chuẩn production người dùng tái xác nhận Task10.43](PRODUCTION_REFERENCE.md): nguồn cụ thể, mặt/mắt/cơ thể/quần áo, kích thước/clip và mốc hash. Đọc cùng spec này trước khi authoring; các candidate Idle/attack vẫn chờ duyệt riêng.

Kế thừa [chuẩn sprite chung](../../../rules/SPRITE_SPEC.md). Hồ sơ này theo nhân vật ninja qua mọi map; không buộc các nhân vật mới có cùng danh tính, màu hoặc canvas.

## Contract ninja hiện hành

Nguồn: public/assets/characters/ninja/animations.json, SpriteRenderer.ts, PlayerAnimator.ts và game.config.ts. Không tự thay các giá trị sau trong task artwork:

| Thuộc tính | Giá trị |
| --- | --- |
| Atlas PNG | flame-ninja-atlas.png, 3136×1968 RGBA |
| Ô frame/source | 384×320, 8 cột; rect cụ thể trong JSON |
| Visual width/height | 2.4×2.0 world unit |
| Visual scale | (1,1) |
| Visual offset | (0,0) |
| Anchor metadata | (0.5,0) |
| Pivot từng frame | (192,289) px trong source frame |
| Mật độ render | 0.00625 world unit/px = 160 px/world unit |
| Filter | linear |

Không nhầm 160 px/unit của nhân vật với 128 px/unit authoring môi trường. Collider đứng0.8×1.6, cúi0.8×0.9 là dữ liệu physics riêng, không phải kích thước sprite/canvas. Không resize sprite để khớp collider.

Giữ frameWidth/Height, sourceWidth/Height, offset, pivot và khoảng trống trong ô. Không auto-trim/repack/recenter sprite rồi sửa pivot bù cho vừa mắt. Không fit từng frame theo bbox riêng; thay pose chỉ được thay silhouette tự nhiên của chuyển động, không phồng/thu đầu/thân giữa frame.

## Animation

**Bản chốt production hiện hành:** [thư viện tổng hợp theo nhóm](../animation/preview.html), [basic preview](../animation/basic-preview.html), [production.json](../animation/production.json). Người dùng chốt toàn bộ art đã làm, gồm leo v2, combo, phi tiêu, hai tuyệt kỹ, Giáng Lâm và Tái Lâm. Nguồn leo active đã bỏ hậu tố: integration/ninja-climb/climb-poses.png, scripts/create_ninja_climb.ps1; PNG runtime canonical giữ nguyên hash. Không có walk riêng: đi/chạy dùng run. Các mục chờ duyệt bên dưới giữ lịch sử art trước khi gom; không ghi đè final bằng candidate. Theo [ANIMATION_PRODUCTION](../../../rules/ANIMATION_PRODUCTION.md), task vẫn phải ghi commits. Spawn/respawn chưa tích hợp game.

Art hồi sinh mới: [Thiên Hỏa Tái Lâm](../animation/heavenly-fire-respawn/preview.html), [nguồn/thông số](../animation/heavenly-fire-respawn/README.md),750ms theo brief0/180/350/600/750; giữ body512×512/pivot(192,353)/160px-unit và chuẩn chiều cao Idle251px. Silhouette35ms/hiện rõ420ms, glow tan cuối; chưa duyệt bản mới hoặc áp dụng respawn/input. Bộ Giáng Lâm người dùng đã phản hồi ổn, không đổi ảnh/nhịp trong lượt này.

Art mới chưa áp dụng: [Thiên Hỏa Giáng Lâm](../animation/heavenly-fire-entrance/preview.html), [nguồn/thông số](../animation/heavenly-fire-entrance/README.md). Candidate xuất hiện1650ms theo brief, body512×512/pivot(192,353)/160px-unit, chiều cao guard theo Idle251px; FX riêng và cuối preview blend sang Idle gốc. Chưa duyệt ảnh, chưa trigger/input/runtime; không thay contract bên trên.

Giữ các clip/FPS/loop/frame order trong JSON nếu task không yêu cầu đổi. Chỉ sửa clip đã giao; các pixel ngoài frame được giao phải không đổi. Khi chỉnh atlas phải bảo toàn gutter và các clip không liên quan.

Leo hiện có 8 slot climbUp +8 slot climbDown, FPS11.1111, cùng pivot. Artwork được chọn ở12959ca có4 tư thế chính giữ2 frame/tư thế, cùng pha cho hai chiều; đây là baseline được người dùng chọn, không phải8 tư thế độc lập. Không lặp lại pose chỉ tay phải cao. Tay trái/phải và chân đối bên phải thay phiên, không lật toàn người làm đổi bên bao kiếm/khăn. Giữ dừng frame khi đứng giữa thang và không tự flip theo hướng ngang khi leo.

Đổi animation logic, thời lượng, chu kỳ leo0.8 world unit, tốc độ hoặc phase khi đổi chiều là phạm vi khác với sửa ảnh. Không sửa để che lỗi asset.

## Sửa pose ninja và sử dụng qua map khác

Phản hồi Task10.41: tiếp tục lấy art đã chốt trong `docs/characters/` làm chuẩn, không dùng cơ thể ở candidate để thay danh tính. Idle chuyển kiếm lên lưng hiện vẫn chờ duyệt: kiếm ngắn, chỉ thấy phần đầu phía trên, phần dưới được che; phải bám mốc lưng theo từng frame. Khi sửa vùng kiếm hông cần giữ liên tục bụng/đai/quần áo theo đúng pose production, không vá một mảng vẽ lại lệch scale/vị trí. Review seam và chuyển động thực tế ngoài kiểm tra pixel vùng được giữ; đây là ràng buộc authoring, không phải duyệt candidate10.41 hoặc thay contract/runtime.

Attack đã được người dùng duyệt riêng: public/assets/characters/ninja/attacks/, ô512×512, pivot(192,353), visual3.2×3.2 vẫn160px/world unit. Đây là sheet đệm cho hiệu ứng, không thay các giá trị ô384×320 của locomotion. Thứ tự frame nguồn đã chọn ở integration/task-009-player-attacks/combo-plan.json; nguồn JSON runtime được sinh bằng scripts/promote_ninja_attacks.mjs. Click trái nối1→2→3, khoảng nghỉ≥0.5s reset1; phần hiện tại chỉ animation, chưa damage/hit detection.

Theo yêu cầu09.18, combo-plan có playbackSpeedMultiplier0.8: cả3đòn phát chậm20% so với candidate đã duyệt, thời lượng tăng25%. Generator sinh speed nguồn×0.8, giữ FPS/frame/pivot và thời gian reset click0.5s. Không áp hệ số này lên skill/locomotion hoặc tự giảm thêm khi sinh lại metadata. Chưa chạy test/build/chơi thử lượt giảm tốc.

Phi tiêu hoả/bộ đứng và cúi phóng đã được người dùng duyệt: public/assets/characters/ninja/skills/fire-shuriken/. Cả hai giữ ô512×512/pivot(192,353)/160px/unit; không đổi atlas locomotion/combo. Nguồn integration/task-009-fire-shuriken/runtime-plan.json và metadata art; promote bằng scripts/promote_ninja_shuriken.mjs. Click phải grounded khi đứng/cúi, không chồng combo/special; đổi stance huỷ pose, giữ phi tiêu đã bay. Theo yêu cầu mới tốc độ11.25unit/s, không TTL, quét tâm qua solid và dọn ngoài level. Chưa damage/quái/cooldown hoặc kiểm tra runtime/test/build. Không tự áp cooldown5s của special1 cho phi tiêu.

Minh Vương Bạo Viêm: public/assets/characters/ninja/skills/special-01/, caster6 pose ô512×512/pivot(192,353)/160px/unit, orb4 pha và explosion8 pha giữ PNG/rect/pivot đã duyệt. Source integration/task-009-special-01/{art-plan.json,atlas.json,runtime-plan.json}; promote bằng scripts/promote_ninja_special_01.mjs. E thi triển khi đứng grounded, F bám thang; W/S và phím điều hướng leo giữ như trước. Cooldown5s từ lúc bắt đầu, bị ngắt vẫn hồi; không chồng combo/phi tiêu. Có charge/orb/solid impact/nổ, chưa damage/quái/AOE radius và chưa kiểm tra runtime/test/build. Không suy kích thước FX thành collider hoặc radius damage.

Khi sửa/tạo thêm pose ninja, giữ contract và tỉ lệ nhân vật ở trên. Đưa ninja sang map khác không tự đổi màu, canvas, kích thước cơ thể hoặc điểm tiếp đất. Nhân vật mới lập hồ sơ riêng theo chuẩn chung; các giá trị của ninja không tự áp dụng cho nhân vật đó.

Theo yêu cầu UI special1 mới: tốc độ orb9unit/s (1440px/s, gấp đôi4.5unit/s trước đó); không tăng tốc pose cast. Tên chiêu xuất hiện trên đầu khi cast được chấp nhận và mờ dần1.5s; tên/countdown/thanh hồi hiển thị góc trái trên. Không đổi ảnh/cỡ/pivot nhân vật hoặc cooldown5s.

CỬU LONG HỎA TRẬN hiện theo yêu cầu mới: **Q, cỡ vòng2.0×, độ dày1.0×, cast1s**. Nguồn integration/task-009-nine-dragons/{art-plan.json,atlas.json,runtime-plan.json}; promote bằng scripts/promote_ninja_nine_dragons.mjs vào public/assets/characters/ninja/skills/nine-dragons/. Giữ nguyên byte5PNG đã chọn. Caster8pose ô512×512/pivot(192,353)/160px-unit; aura8pha512×512/pivot(256,256), chỉ scale FX, không tăng/giảm Ninja. [Báo cáo runtime mới](../../../map01/commits/task-009-17-skill-ui-timing-glow/IMPLEMENTATION.md).

Cast1s khi đứng grounded, giữ thế cắm kiếm và chặn input di chuyển/cúi/nhảy/bám thang cùng các action khác trong cast; physics vẫn chạy. Nén đồng bộ nhịp caster/seal/rồng/burst theo5/7, không bỏ pose. Sau đó aura7s theo tâm collider, di chuyển/action lại bình thường. Cooldown12s từ cast, reset/ngắt không hoàn; E/F không đổi. Lớp sáng vàng kem/cam áp sprite Ninja và phi tiêu/charge/orb/nổ Minh Vương đang hiển thị trong Cửu Long, mờ350ms cuối aura và tắt tại8s; không recolor atlas gốc. Q/E chung một card, cooldown riêng. FX quy đổi từ preview1280×720/camera9unit=80CSSpx-unit, khác160px-unit của caster. Brief125px/3waves/damage/Burn chưa là collider hoặc damage gameplay; quái/boss xử lý sau. Chưa chơi thử/test/build/shader GPU; chưa có pose thu kiếm riêng sau cast.

Với sửa pose: dùng source gốc làm nền, ghép riêng vùng được giao; lưu source tạo/prompt và bản review. Quy trình artwork cần đối chiếu kích thước thật, đầu/hông/chân, RGBA và phần ảnh không được phép đổi. Kiểm tra artwork phục vụ yêu cầu không tự cho phép chạy test/build hoặc thay physics.

Task10.30: art run8frame/hurt4frame Task10.29 đã được chốt và publish tại atlas trong thư viện docs/characters/ninja/animation; public/assets vẫn giữ bản runtime trước đó. Source publisher có fileSources riêng để không ghi đè bộ đã chốt bằng atlas runtime cũ. Leo và các clip khác giữ pixel nguyên bản. Combo art/nhịp mới ở [Task10.30](../../../map01/commits/task-010-30-ninja-combo-art/README.md) là candidate, không thay contract/logic runtime đã ghi ở trên.

Ràng buộc người dùng Task10.31: khi sửa combo không tự redesign cây kiếm Hỏa hoặc chất lửa đã duyệt trong animation/attacks/. Giữ cán vàng/lưỡi hỏa đỏ-cam/lõi trắng vàng, vòng lửa lớn nhiều lớp. Theo cập nhật Task10.32, phối hợp một tay/hai tay tùy nhát chém để tạo lực; không bắt buộc luôn một tay. Hai tay đánh phải mở thế, vươn ra trước, tránh khép nép ôm cán sát ngực. Thay pose không cấp phép đổi vũ khí/VFX. Candidate Task10.30 bị bác, bản thay ở Task10.31 chưa được chốt.
