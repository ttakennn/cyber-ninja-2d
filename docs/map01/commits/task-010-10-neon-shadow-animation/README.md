# Task10.10 — hoạt ảnh di chuyển Sát Thủ Bóng Neon

Người dùng chốt ngoại hình v1 và chiều cao95% Ninja Hỏa, giao vẽ đi/chạy/nhảy/leo để review tương tự Sói Điện. Tiếp tục nhánh codex/task-010-enemy-art, không tự commit/merge hoặc áp vào game.

## Art / preview

[Mở preview](preview.html):6clip đứng/thở, đi bộ, chạy, nhảy/tiếp đất, leo lên và leo xuống. Có phát/dừng, xem lại, frame kế, thanh tua, tốc độ1/0.5/0.25×, phóng0.75/1/1.5×, nền đêm/sáng/caro, bóng tạo hình đã chốt, Ninja Hỏa so cỡ, thang đứng yên và đường nhảy minh hoạ. Khi dừng giữ nguyên frame. HTML/script/PNG cục bộ, không getImageData/fetch/module.

| Sheet | PNG nguồn thực tế | Candidate | Pose/clip |
| --- | --- | --- | --- |
| locomotion |1536×1024 /4×2 |2048×1024 |0–1 thở,2–7 đi bộ |
| run |1536×1024 /4×2 |2048×1024 |0 chuẩn đứng,1–6 chạy,7 hãm |
| jump |1536×1024 /4×2 |2048×1024 |0–7 chuẩn bị/bật/co chân/rơi/đáp |
| climb |1254×1254 /3×3 |1536×1536 |0 lưng đứng chuẩn,1–4 lên,5–8 xuống |

Tổng4sheet/33pose,6clip candidate. Art mới chờ duyệt; không có đánh thường hoặc skills mới trong lượt này. Ngoại hình đã được chốt không đồng nghĩa animation đã được duyệt.

## Kích thước và tạo ảnh

Frame512×512, pivot(256,416),160px/world unit, visual tham chiếu3.2×3.2. Chuẩn đứng238.45px =95% Idle Ninja Hỏa251px. Mỗi sheet một scale từ pose0, không fit riêng bbox từng pose. Grounded căn chân theo alpha; nhảy trên không/leo dùng anchor nguồn cố định, giữ chân co đúng tư thế. Chuẩn hoá raster có làm tròn số pixel; chiều cao các pose thay đổi tự nhiên theo chuyển động. Không đổi Ninja Hỏa/Sói Điện, không dùng alpha làm collider. Contract này là đề xuất authoring chờ review trước runtime.

ImageGen built-in dùng PNG ngoại hình đã chốt làm reference. Nguồn nguyên byte/prompt/plan ở integration/task-010-neon-shadow/animation/. Sheet leo lần đầu dồn chân phải ở nhiều pose; đã sửa chi bằng ImageGen, giữ bản đầu source/climb-first.png làm lịch sử, không lật cả nhân vật. Leo cài dao hai bên đai và để hai tay bám. [atlas.json](atlas.json) lưu tên output gốc, prompt, hash/source size, crop, scale, anchor/translation/frame/pivot.

Authoring bằng scripts/prepare_neon_shadow_animation.ps1 (Windows PowerShell5.1); có -OnlySheet để không sinh lại các sheet khác khi chỉnh một bộ. Plan là nguồn clip/timing/frame; generator sinh JSON/JS/candidate/contact sheets vào reviewDirectory. scripts/prepare_neon_shadow_preview.ps1 đồng bộ metadata duyệt ngoại hình từ art-plan vào snapshot mới. PNG design và snapshot88%/95% trước giữ nguyên.

## Nhịp chỉ để review

Idle600ms, walk780ms, run500ms; jump1070ms (0..7), climbUp/climbDown600ms mỗi chu kỳ. Đường nhảy minh hoạ không phải physics, thang không nằm trong PNG. Vận tốc đi/chạy/nhảy/leo, collider, chuyển phase Up↔Down trong engine, AI/spawn/damage chưa được quyết định/tích hợp.

## Kiểm tra thực sự / còn mở

Đã đọc rules và source SpriteSheetLoader/AnimationClip/SpriteRenderer, xem PNG design, các sheet AI và4bảng pose sau chuẩn hoá; đọc kích thước/alpha nguồn phục vụ authoring, lưu hash và provenance. Sinh candidate/metadata/contact bằng generator chế độ ghi. Nguồn locomotion/run/jump có RGB tím ở pixel alpha0; không coi RGB ẩn là nền opaque hoặc tự xoá màu tím của nhân vật.

Chưa mở preview qua trình duyệt, chưa nghiệm thu nhịp chuyển động trong game hoặc mọi chuyển tiếp; cần người dùng review. Test/build/lint/typecheck/formatter **NOT_RUN** theo AGENTS. Không sửa src/ hoặc public/assets/, không có runtime/AI/combat/spawn. Candidate chỉ ở commits và integration; chưa đưa animation chưa duyệt vào thư mục art production. Chưa commit/merge/push.
