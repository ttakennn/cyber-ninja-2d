# Sát Thủ Bóng Neon —11clip art đã chốt

Hiện hành: người dùng chốt toàn bộ nhân vật, gồm [NGUYỆT ẢNH HIỆN THÂN](../animation/preview.html). [Production11clip/14sheet](../animation/production.json) lấy nguyên PNG từ snapshot10.15. Xuất hiện8pose body/8frame khói,1200ms rồi preview nối Idle400ms; vị trí nhân vật cố định, không dịch chuyển. Giữ design v1, chiều cao95% Ninja Hỏa=238.45px, frame512×512/pivot(256,416)/160px-unit; khói có scale riêng và cùng neo chân. Đây là contract art đã chốt, chưa trigger spawn/AI/collider/damage/runtime hoặc nghiệm thu game. Các mục “chờ duyệt” bên dưới là lịch sử trước lời chốt này.

Hiện hành: người dùng chốt hurt; [production10clip/12sheet](../animation/preview.html) copy nguyên byte từ snapshot10.14. [NGUYỆT ẢNH HIỆN THÂN](../../../map01/commits/task-010-15-neon-shadow-entrance/preview.html) mới chờ duyệt:8pose body/8frame khói tím đậm-hồng neon, mắt đỏ/xoay một đao/hạ guard,1200ms rồi nối Idle. Giữ design/95%/body512/pivot256,416/160px-unit, một đôi mắt đúng anatomy; phong thái lạnh lùng qua pose không redesign. Khói dùng scale riêng/neo chân cố định, không motionX/Y; chưa trigger spawn/input/runtime. Các trạng thái cũ bên dưới giữ lịch sử.

Hiện hành: người dùng chốt Thiên Ảnh Liên Trảm; [production9clip/11sheet](../animation/preview.html) copy nguyên byte từ snapshot10.13. [Hurt8pose mới](../../../map01/commits/task-010-14-neon-shadow-hurt/preview.html) giật/ngả/lùi/hồi thế, giữ2dao/danh tính/95%/frame512/pivot256,416/160px-unit; một scale theo guard0, grounded căn chân. Nhịp860ms chỉ để review, chưa hitstun/knockback/damage hoặc runtime. Các trạng thái chờ duyệt cũ bên dưới giữ lịch sử.

Hiện hành: người dùng chốt Nguyệt Nhận Hồi Sát; [production8clip/8sheet](../animation/preview.html) copy nguyên byte từ snapshot10.12, giữ95%/frame/pivot/nhịp. [Skill2 THIÊN ẢNH LIÊN TRẢM](../../../map01/commits/task-010-13-aerial-multi-slash/preview.html) mới chờ duyệt:16pose bật/chém2lần/xoay/bổ dọc/đáp/nghỉ và2sheet8frame FX bán nguyệt/va đất-luồng nhỏ. Body512/pivot256,416/chuẩn đứng238.45px; FX tâm256,256 và sát nền256,416. Preview2380ms/chém560-870/đáp1420/nghỉ450 chỉ authoring art; chưa physics/mobility/damage/recovery-lock/AI/gameplay. Các mục chờ duyệt trước bên dưới giữ lịch sử.

Hiện hành: người dùng chốt Neon Shuriken; [production7clip/6sheet](../animation/preview.html) copy nguyên byte từ snapshot10.11, giữ95%/frame/pivot/nhịp. [Skill1 NGUYỆT NHẬN HỒI SÁT](../../../map01/commits/task-010-12-moon-boomerang/preview.html) mới chờ duyệt:12pose rút/tụ/phóng/chờ/bắt/thu thế và8frame FX nguyệt nhận hìnhC mở, hồng neon/lõi trắng/mảnh tím. Body giữ512/pivot256,416, FX512/pivot256,256; một scale mỗi sheet. Preview3250ms/rời660/dừng180/về đến2460 chỉ minh hoạ; Double Hit/damage/AI/collision chưa triển khai. Các trạng thái chờ duyệt trước bên dưới là lịch sử.

Hiện hành: người dùng chốt6clip idle/walk/run/jump/climbUp/climbDown; [art production](../animation/preview.html), manifest production.json. Đã copy đúng4sheet từ snapshot10.10, giữ PNG/pivot/nhịp/cỡ. [Đánh thường Neon Shuriken](../../../map01/commits/task-010-11-neon-shuriken/preview.html) mới chờ duyệt:12pose phóng2lần +8frame FX riêng; frame512/pivot body256,416/FX256,256. Rời tay380/640ms, góc0/±8độ và tốc độ chỉ minh hoạ, chưa AI/damage/né/collision/runtime. Các trạng thái candidate di chuyển bên dưới giữ lịch sử.

Người dùng đã chốt ngoại hình v1 và chiều cao95%. [Preview6clip mới](../../../map01/commits/task-010-10-neon-shadow-animation/preview.html), [báo cáo/crop/timing](../../../map01/commits/task-010-10-neon-shadow-animation/README.md). Nội dung mô tả candidate bên dưới giữ lịch sử của giai đoạn thiết kế; không phải trạng thái duyệt animation mới.

Đề xuất kỹ thuật animation:4sheet/33pose, ô512×512/pivot(256,416)/160px-unit, chuẩn đứng238.45px. Đi bộ và chạy là hai clip riêng; leo góc lưng/dao cài đai,4pose lên/4pose xuống. Một scale từ pose0 mỗi sheet; grounded căn chân, airborne/leo giữ anchor gốc. Frame/nhịp là contract authoring chờ review, chưa runtime/collider/gameplay. Nguồn integration/task-010-neon-shadow/animation/animation-plan.json; chưa đưa animation candidate vào production.

Kế thừa [style](../../../rules/ART_STYLE_GUIDE.md), [sprite](../../../rules/SPRITE_SPEC.md), [atlas](../../../rules/ATLAS_SPEC.md) và [production](../../../rules/ANIMATION_PRODUCTION.md) chung.

## Brief được giao

Quái thường 02, ranged, cơ động trên cao. Ninja dễ thương/tinh nghịch, đường phố tím đen, khăn che mặt, mắt phát sáng đỏ nhẹ. Mang hai đoản đao và phi tiêu neon. Illustrated textured pixel art, sprite 2D.

## Đề xuất ngoại hình v1

Một pose toàn thân nhìn phải hơi 3/4, hoodie tím đen, quấn tay chân xám tím, mắt đỏ và viền vũ khí/neon tím hồng; mặt người, không kế thừa tai/nanh sói. Mỗi tay giữ một đoản đao, phi tiêu ở đai. Mẫu này mới chờ duyệt, không thay danh tính/rules của Ninja Hỏa hoặc Sói Điện.

- PNG nguồn: integration/task-010-neon-shadow/source/neon-shadow-v1.png; kích thước thật1254×1254 RGBA, alpha thật. Prompt yêu cầu1024×1024, không đổi pixel source để khớp số yêu cầu.
- design.json ghi hash, alphaBounds ở ngưỡng128, pivot căn chân và hệ số vẽ đồng nhất.
- Chiều cao theo yêu cầu mới:238.45px, bằng95% Idle Ninja Hỏa251px, thay mức88% trước đó; preview cho so95/88/100%. Giữ aspect và căn chân bằng scale đồng nhất;160px/world unit chỉ dùng tham chiếu, chưa chốt collider hoặc contract runtime.
- Chưa định nghĩa frame/pivot/clip/FPS runtime. Trước khi làm animation hoặc tích hợp cần đọc source schema và chốt contract phù hợp; không suy collider từ alpha.
- [Preview/báo cáo95%](../../../map01/commits/task-010-09-neon-shadow-height/README.md), [bản88% lịch sử](../../../map01/commits/task-010-08-neon-shadow-design/README.md). Source/prompt ở integration/task-010-neon-shadow/; candidate không đưa vào animation/.

Chưa thiết kế kỹ năng, damage, AI, thời gian/điểm spawn hoặc boss; chưa runtime/test/build/browser.
