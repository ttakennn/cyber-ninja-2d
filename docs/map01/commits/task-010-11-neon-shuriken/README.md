# Task10.11 — Neon Shuriken / hai phi tiêu

Người dùng chốt6clip di chuyển và giao art đánh thường: phóng2phi tiêu liên tiếp về phía người chơi, bay ngang hoặc hơi chéo theo mục tiêu; có thể né bằng nhảy/cúi/di chuyển ở bước gameplay sau.

## Kết quả và nơi review

[Preview mới](preview.html), [12pose nhân vật](shurikenThrow-contact.png), [8frame VFX](neonShuriken-contact.png). Giữ6clip di chuyển trong các nút để so sánh; mở mặc định Neon Shuriken. Có ba góc0/−8/+8độ, bật/tắt phi tiêu, tốc độ1/0.5/0.25×, tua từng frame, nền đêm/sáng/caro và so Ninja Hỏa.

Nhân vật cài hai đoản đao ở đai, rút/lấy đà/phóng lần1, lấy phi tiêu thứ2/phóng, thu thế/rút dao và về guard. Giữ ngoại hình tím đen/mắt đỏ/khăn/đai cùng chuẩn đứng95% (238.45px), frame512/pivot256,416/160px-unit. Một scale từ guard0 cho toàn bộ12pose, grounded căn chân; không fit riêng từng pose. PNG nguồn1254×1254 thực tế, grid4×3; plan khai báo12sourceRect nguyên pixel313/314×418, output2048×1536.

VFX riêng: nguồn1536×1024 grid4×2, output2048×1024/frame512/pivot256,256; scale từ cellWidth160px, anchor tâm ô. Phi tiêu kim loại neon tím hồng, lõi trắng lavender, vệt/sparkle về sau. Frame0lóe,1–4spin,5–7impact/tan dự trữ; preview bay chỉ dùng1–4, không tự phát sinh hit/collision.

Tổng hiện hành6sheet/7clip nhân vật và VFX, trong đó4sheet/6clip di chuyển đã được duyệt;2sheet mới chờ review. Nguồn ImageGen built-in nguyên byte/prompt/plan/hash/crop/anchor ở integration/task-010-neon-shadow/animation/; [atlas.json](atlas.json) là metadata sinh từ plan, không phải schema runtime đã tích hợp.

## Nhịp minh hoạ, chưa gameplay

12pose tổng1240ms, rời tay ở380/640ms (pose4/7), cách260ms. Phi tiêu tốc độ330px/s tại zoom1×, FXscale0.55; preview thêm1750ms để xem đường bay, tổng2990ms. Tham số này là lựa chọn trình bày để review art, chưa chốt tốc độ bắn/tầm/cooldown/tốc độ bay thật.

Ba góc bắn áp cho VFX theo đường thẳng; chưa IK xoay toàn thân/AI tự nhắm mục tiêu. Ninja Hỏa là ảnh so tỷ lệ, không tham gia collision/damage. Khả năng nhảy/cúi/di chuyển để né là brief gameplay còn mở, chưa nghiệm thu trong lượt art. Impact5–7 chưa tự chạy vì chưa có va chạm thật.

## Art đã duyệt và lịch sử

Đã promote đúng4PNG/JSON/6clip di chuyển từ snapshot10.10 vào [thư viện production](../../../characters/neon-shadow/animation/preview.html) theo lời chốt; copy nguyên byte, không tạo lại PNG. approved-plan.json và scripts/publish_neon_shadow_animation.mjs giới hạn danh sách được duyệt, production.json lưu nguồn/hash. Đòn mới không đưa vào production. Snapshot10.8/10.9/10.10 giữ nguyên.

Đã cập nhật plan trước rồi chạy authoring -OnlySheet shurikenThrow và -OnlySheet neonShuriken;4PNG di chuyển được copy nguyên file từ output hiện có. Generator thêm hỗ trợ pivot/anchor riêng cho FX; mặc định nhân vật cũ giữ nguyên. Không sửa src/ hoặc public/assets/.

## Đã thực hiện / còn mở

Đã đọc rules/source liên quan, xem PNG design/di chuyển đã chốt và2bảng pose mới sau chuẩn hoá; đọc kích thước/alpha thật và lưu hash/provenance phục vụ authoring. Sinh metadata/contact/preview; chưa mở HTML trong trình duyệt. PNG có alpha thật, không xoá RGB tím ẩn ở alpha0.

Chờ duyệt nhịp2lần phóng, động tác tay, VFX, tỷ lệ phi tiêu và góc bay minh hoạ. Chưa runtime/AI/damage/hitbox/né/spawn/skills mới; test/build/lint/typecheck/formatter NOT_RUN theo AGENTS. Chưa commit/merge/push.
