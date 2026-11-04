# Task10.15 — NGUYỆT ẢNH HIỆN THÂN

Sau preview, người dùng đã chốt toàn bộ Sát Thủ Bóng Neon và yêu cầu cập nhật production/commit. Bộ xuất hiện trong snapshot này đã được publish nguyên PNG vào [thư viện production](../../../characters/neon-shadow/animation/preview.html); manifest/hash ở [production.json](../../../characters/neon-shadow/animation/production.json). Những câu “chờ duyệt” bên dưới mô tả thời điểm tạo bản review, không còn là trạng thái hiện tại. Chưa tích hợp runtime.

Người dùng chốt hurt và giao màn xuất hiện1.0–1.3s: khói tím đậm/hồng neon, mắt đỏ/bóng dáng hiện ra, khăn lay nhẹ, hai đao sáng, xoay một đao rồi hạ trọng tâm/guard. Phong thái bình tĩnh, nguy hiểm, chuyên nghiệp; đứng ngay tại spawn, không nhảy/nhào lộn/dịch chuyển.

## Art và preview

[Preview](preview.html), [8pose nhân vật](spawn-contact.png), [8frame khói](spawnSmoke-contact.png). Chọn mở mặc định NGUYỆT ẢNH HIỆN THÂN; vẫn có10clip cũ để so. Tắt Nhân vật xem riêng khói, tắt Khói xem động tác, tắt Hiện dần/nối Idle xem màu và pose gốc. Có slow motion/frame kế/tua thời gian/nền sáng-đêm-caro/so Ninja Hỏa/bóng tạo hình.

Body0 guard chuẩn scale,1 bất động đầu hơi hạ,2 mắt đỏ/đao bắt đầu sáng,3 hiện rõ,4 xoay một đao,5 bắt/thu đao,6 hạ trọng tâm,7 guard. Giữ design v1/chiều cao95% =238.45px, frame512/pivot256,416/160px-unit; một scale theo guard0 cả sheet, grounded căn chân. Không đổi cỡ đầu/thân, không dùng thân trưởng thành/monster để tạo vẻ lạnh lùng. Khói tách PNG; body luôn vẽ đủ màu/opacity, reveal ở Canvas.

VFX0 khói bật thấp,1–2 cuộn nở có tia/seam hồng,3–4 tách khe giữa,5–7 loãng/tan thành wisps và motes. Hai PNG nguồn thực tế1536×1024/grid4×2, candidate2048×1024/8ô512. Khói dùng một scale từ cellWidth340px, nguồn neo(192,458), outputpivot256,416; không căn lại mỗi frame theo bbox để tránh giật khi wisps tan. Bảng pose khói riêng400×500/cell để không cắt phần nở cao; không đổi PNG vì bố trí bảng.

Giữ đúng một nhân vật/một đôi mắt đỏ theo anatomy đã chốt; cụm “hai đôi mắt” trong mô tả được hiểu là hai mắt phát sáng, không tự thêm4mắt/nhân vật thứhai. Tinh thần chuyên nghiệp thể hiện ở ánh mắt, động tác cổ tay và tư thế, không thay danh tính/style.

## Nhịp và nối Idle

Chọn1200ms trong khoảng yêu cầu. Body dùng frame1/1/2/3/4/5/6/7 với100/120/160/180/140/140/160/200ms:
-0–100ms khói bật/chưa lộ body.
-100–300ms bóng dáng tăng alpha; mắt/đao hiện ở pose2 từ220ms.
-300–580ms độ sáng thân từ silhouette lên đầy đủ; khói tách giữa.
-560–840ms xoay/bắt đao, scarf lay nhẹ.
-840–1200ms hạ trọng tâm, ổn định guard; blend sang Idle gốc1100–1200ms.

Khói8frame80/100/140/160/180/180/170/190ms, tổng1200ms; crossfade frame và opacity giảm dần, tắt hoàn toàn cuối chuỗi. Preview thêm400ms Idle thật để xem nối, tổng vòng1600ms; không gọi phần hold là thời gian xuất hiện.

Canvas spawn không gán motionX/Y, nhân vật ở nguyên điểm neo. Nhịp1200ms/reveal/blend chỉ là authoring art, chưa trigger spawn, khoá input, bất tử, collider, điều khiển hoặc cơ chế runtime được duyệt. Không respawn hay gameplay mới.

## Nguồn / production / lịch sử

ImageGen built-in tạo2sheet mới, source nguyên byte/prompts và tên output gốc lưu integration/task-010-neon-shadow/animation/. [atlas.json](atlas.json) giữ hash, size, crop, scale, anchor/translation/pivot và timing. Tổng14sheet/11clip/129frame tính guard reference/FX. Spawn mới chờ duyệt, chưa vào production.

Hurt vừa chốt đã promote cùng9clip trước vào [production10clip/12sheet](../../../characters/neon-shadow/animation/preview.html) qua approved-plan.json từ snapshot10.14; copy đúng PNG nguyên byte, không tạo lại. Snapshot10.8–10.14 giữ nguyên.

Plan trước, generator authoring -OnlySheet spawn/spawnSmoke sau;12PNG cũ copy nguyên file. Generator chỉ thêm thông số bảng pose smoke với default cũ giữ nguyên. Không sửa src/public/assets/map/physics/AI.

## Thực tế / giới hạn

Đã đọc AGENTS/rules/source/generator/metadata và tham khảo workflow xuất hiện Sói Điện; xem PNG design/hurt Bóng Neon cùng2bảng pose mới sau chuẩn hoá. Đọc kích thước/alpha thật (góc body alpha0, khói alpha1 do haze gần trong suốt); giữ alpha gốc và không xoá màu tím. Sinh PNG/JSON/JS/contact/HTML bằng generator chế độ ghi, lưu prompt/provenance/hash.

Chưa mở HTML qua trình duyệt hoặc nghiệm thu chuyển tiếp runtime. Chờ duyệt phong thái, xoay đao, độ dày/tan khói, mắt đỏ, nhịp1.2s và nối Idle. Test/build/lint/typecheck/formatter NOT_RUN theo AGENTS. Chưa runtime/spawn/AI/input hoặc commit/merge/push.
