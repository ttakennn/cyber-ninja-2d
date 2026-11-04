# Task10.12 — Skill1 / NGUYỆT NHẬN HỒI SÁT

Người dùng chốt Neon Shuriken và giao art Skill1: nguyệt nhận hình trăng khuyết, tụ hồng neon, phóng xoay ra/dừng ở cuối tầm/quay về tay. Brief Double Hit cho cả lượt đi và về; gameplay/damage/AI xử lý sau.

## Bản review

[Preview](preview.html), [12pose nhân vật](moonCast-contact.png), [8frame VFX](moonBlade-contact.png). Mở mặc định Skill1, vẫn có7clip cũ để đối chiếu. Có xem chậm/tua từng frame, ba góc ngang/±8độ, ẩn/hiện projectile/đường đi-về, nền đêm/sáng/caro, bóng ngoại hình và Ninja Hỏa so cỡ. Nhãn giai đoạn tách rõ LƯỢT ĐI / DỪNG-ĐẢO CHIỀU / LƯỢT VỀ / BẮT LẠI.

Body12pose:0 guard,1 rút/cài dao,2 tụ hồng quang,3 lấy đà,4 phóng,5 theo đà,6 quan sát,7 đưa tay đón,8 bắt,9 cài nguyệt nhận,10 rút dao,11 guard. Giữ design v1 và chuẩn đứng95% =238.45px, frame512×512/pivot256,416/160px-unit; một scale theo guard0, không fit riêng từng pose. Nguồn1254×1254 grid4×3, sourceRect313/314×418 khai trong plan, candidate2048×1536.

VFX riêng: nguyệt nhận kim loại tím hồng hìnhC mở, hai mũi cong và phần tay nắm, lõi trắng/lavender, vòng xoáy/mảnh năng lượng tím hồng.0charge,1–4spin,5vortex đảo chiều,6lượt về,7tia bắt. Nguồn1536×1024 grid4×2, candidate2048×1024, frame512/pivot256,256, scale theo cellWidth220px; preview FXscale0.55. Chỉ scale FX, không tăng nhân vật. Tâm FX neo theo ô để preview quay quanh tâm.

## Nhịp / đường bay chỉ minh hoạ

Tổng3250ms: rút/tụ/lấy đà660ms, rời tay660ms, lượt đi800ms đến1460ms, dừng180ms đến1640ms, về820ms đến2460ms, bắt140ms, cài/rút dao/guard đến3250ms. Body8 bắt đúng lúc đường về kết thúc. Cuối đường về nội suy về vị trí nguyệt nhận trong pose bắt; tia bắt tắt khi hoàn tất pose8.

Tầm400px tại zoom1×, easing làm chậm khi ra cuối tầm/tiếp tay, vòng xoay4πrad/s trong Canvas, ba góc0/±8độ và các timing là lựa chọn trình bày art, chưa chốt range/speed/cooldown/hitbox/cast-lock/gameplay. Lượt đi dùng frame1 xoay liên tục để không giật góc của hìnhC khi lặp các ảnh đã xoay sẵn; frame2–4 vẫn có trong bảng pose. Dừng dùng5, về dùng6, bắt dùng7. Vũ khí đi rồi về cùng tuyến chính; không tự bám mục tiêu hoặc xuyên/chặn collider. Ninja Hỏa chỉ là ảnh so cỡ, chưa trúng đòn/né/flash. Double Hit được giữ là yêu cầu cho bước combat, chưa thực hiện tính HP hoặc số lần hit.

## Nguồn / bảo toàn bản chốt

ImageGen built-in,2sheet mới. Prompt/source tên output gốc/hash/alpha/crop/anchor lưu trong integration/task-010-neon-shadow/animation/ và [atlas.json](atlas.json). Plan trước, generator sau; authoring -OnlySheet moonCast / moonBlade,6PNG cũ được copy nguyên byte, không tạo lại. Snapshot10.8–10.11 giữ nguyên.

Neon Shuriken vừa được chốt đã promote cùng6clip di chuyển: [production7clip](../../../characters/neon-shadow/animation/preview.html),6sheet. approved-plan.json giới hạn đúng source snapshot10.11, publisher chỉ copy PNG đã duyệt và sinh manifest/hash. Skill1 mới chỉ ở review, chưa đưa vào production.

## Thực tế đã làm / giới hạn

Đã đọc rules/source/plan liên quan, xem PNG design/bộ ném đã chốt và2bảng pose Skill1 sau chuẩn hoá. Đã đọc kích thước/alpha thật để authoring; moonCast góc alpha0, moonBlade góc alpha1 (glow gần trong suốt), không tự xoá màu tím hoặc flatten nền. Đã sinh PNG/JSON/JS/contact/preview bằng generator write-mode.

Chưa mở HTML qua trình duyệt, chưa nghiệm thu chuyển động runtime hoặc Double Hit. Chờ người dùng duyệt hình nguyệt nhận, tụ năng lượng, lượt đi/dừng/về/bắt, nhịp và độ lớn VFX. Test/build/lint/typecheck/formatter NOT_RUN theo AGENTS. Không sửa src/public/assets/gameplay, chưa AI/damage/hitbox/spawn hoặc Skill2; chưa commit/merge/push.
