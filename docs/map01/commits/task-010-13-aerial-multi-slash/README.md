# Task10.13 — Skill2 / THIÊN ẢNH LIÊN TRẢM

Người dùng chốt Nguyệt Nhận Hồi Sát và giao Skill2 aerial/multi-slash/mobility: bật cao, hai đoản đao đỏ hồng chém2lưỡi năng lượng xuống hai góc, xoay bổ dọc/va đất và luồng nhỏ sát nền, có nhịp nghỉ sau đáp để phản công.

## Review và nội dung mới

[Preview](preview.html), [16pose](aerialCombo-contact.png), [lưỡi bán nguyệt/VFX giaoX](aerialArc-contact.png), [VFX va đất/luồng sát nền](aerialGround-contact.png).

Mở mặc định Skill2; có8clip cũ để so sánh. Tắt/bật đường nhảy/di chuyển, bóng mờ và VFX; tốc độ1/0.5/0.25×, dừng/tua từng frame, zoom/nền đêm/sáng/caro, bóng ngoại hình và Ninja Hỏa so tỷ lệ. Canvas review tăng800px cao để không khuất pose trên cao. Góc bay Skill2 cố định35/55độ trong plan; dropdown ngang/±8 chỉ dùng Neon Shuriken/Nguyệt Nhận.

| Sheet mới | Nguồn | Candidate | Nội dung |
| --- | --- | --- | --- |
| aerialCombo |1254×1254,4×4 |2048×2048 |16pose chuẩn bị/bật/chém2lần/xoay/bổ dọc/đáp/nghỉ/hồi |
| aerialArc |1536×1024,4×2 |2048×1024 |8frame sinh/bay/giaoX/vỡ/tan |
| aerialGround |1536×1024,4×2 |2048×1024 |8frame bổ dọc/va đất/luồng sát nền/tan |

Body giữ design v1/95%: chuẩn đứng238.45px so Ninja Hỏa251px, frame512/pivot256,416/160px-unit. Một scale từ guard0 cho cả16pose; frame airborne dùng anchor nguồn, không kéo chân co xuống nền hoặc fit riêng từng frame. Grid nguồn313/314px dùng16sourceRect nguyên pixel trong plan. Shader/glow body đã nằm trong art đao đỏ hồng mới, không sửa PNG cũ.

FX không dùng chiều cao body để scale: một scale từ cellWidth240px. aerialArc pivot256,256/anchor tâm; aerialGround pivot256,416 và sourceAnchors là điểm sáng sát nền từng hàng nguồn (458px hàng1,426px hàng2 trong cell). Căn contact vào đường nền; không suy bbox thành collider. Contact sheet FX tâm bố trí riêng để thấy đủ hai phía lưỡi sáng.

Bóng mờ trong preview lấy2pose trễ55/110ms, opacity0.18/0.08; không vẽ thêm clone vào PNG nhân vật. Hai lưỡi crescent phát độc lập35/55độ, vệt giaoX xuất hiện ở nhịp8, va đất có flash/mảnh vỡ và luồng nhỏ chạy ngắn về trước. Tất cả mới là art candidate chờ duyệt.

## Timeline minh hoạ

Tổng2380ms: chuẩn bị0–320, bật/lấy đà320–560; chém1 tại560, chém2 tại870, giaoX960–1100; xoay/bổ dọc1100–1420; va đất1420; giữ hồi thế thấp1520–1970 (450ms để thấy cửa phản công), đứng lên/guard1970–2380.

MotionY cao tối đa150px/motionX tiến100px tại zoom1× là đường trình bày, không đổi physics. Lưỡi bay460px/s, tối đa1400ms nhưng tản khi chạm đường nền minh hoạ; không kiểm collider thật. Impact0–2 cách60ms; luồng ground bắt đầu60ms sau impact, range150px/travel500ms rồi fade160ms. Các số này là lựa chọn art để review, chưa cooldown/range/speed/damage/hitbox/recovery-lock/AI hoặc cơ chế phản công được duyệt. Ninja Hỏa chỉ ảnh tham chiếu, không có hit/HP/né.

## Nguồn và bộ được chốt

ImageGen built-in3sheet mới; prompt/source gốc/hash/grid/crop/scale/anchor/translation ở integration/task-010-neon-shadow/animation/ và [atlas.json](atlas.json). Tổng hiện hành11sheet/9clip nhân vật +FX,105frame tính cả guard reference.

Nguyệt Nhận vừa chốt đã promote cùng7clip cũ: [production8clip/8sheet](../../../characters/neon-shadow/animation/preview.html) đọc snapshot10.12 qua approved-plan.json, copy PNG nguyên byte, không tạo lại. Skill2 mới chỉ trong commits/source. Snapshot10.8–10.12 giữ nguyên, không ghi đè lịch sử.

Generator authoring -OnlySheet tạo3bộ mới;8PNG cũ được copy nguyên file. Thêm sourceAnchors cho FX sát nền, fallback nhân vật/FX cũ giữ nguyên; bố trí contact FX tâm phù hợp. Không đổi source runtime hoặc physics.

## Thực tế đã làm / giới hạn

Đã đọc metadata/generator/source/rules và xem PNG design/jump/Skill1 tham chiếu; xem3bảng pose mới sau chuẩn hoá, đọc kích thước/alpha thật (góc3PNG alpha0), lưu prompt/provenance/hash; sinh PNG/JSON/JS/contact/preview bằng generator chế độ ghi.

Chưa mở HTML qua trình duyệt, chưa nghiệm thu đường nhảy/luồng năng lượng/va chạm/né/phản công trong game. Chờ người dùng duyệt16pose, hai góc chém, nhịp bổ dọc, bóng mờ, VFX và khoảng nghỉ. Test/build/lint/typecheck/formatter NOT_RUN theo AGENTS. Chưa runtime/AI/damage/hitbox/spawn hoặc commit/merge/push; không sửa src/public/assets/map.
