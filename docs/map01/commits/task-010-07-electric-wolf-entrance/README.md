# Sói Điện — xuất hiện từ khói điện (art chờ duyệt)

Ngày2026-11-04, nhánh codex/task-010-enemy-art. Người dùng đã chốt Skill2 và giao art xuất hiện: khói ninja tím nhạt cuộn trên đất, tia cyan nhỏ trong khói, nhân vật hiện dần, động tai/mắt sáng, nghiêng đầu cười tinh nghịch, xoay nhẹ gậy rồi sẵn sàng chiến đấu. Chưa được giao tích hợp spawn hoặc commit.

[Mở preview động](../task-010-02-electric-wolf-animation/preview.html) — mở sẵn màn xuất hiện, có dừng/tua/frame kế/tốc độ/nền/Ninja so cỡ. Bật/tắt riêng Nhân vật, Khói điện, Hiện dần / bóng dáng; tắt khói và hiện dần để xem rõ cử chỉ. Giữ cấu trúc repo khi mở file:// hoặc localhost. [8pose nhân vật](spawn-contact.png), [8frame khói](spawnSmoke-contact.png).

## Thiết kế / nhịp preview

| Lớp | Nội dung |
| --- | --- |
| spawn | 0guard so cỡ;1nhẹ khuỵu/mắt khép;2nâng người/hiện rõ;3tai khẽ động/mắt cyan;4nghiêng đầu cười;5xoay nhẹ gậy;6bắt gậy/vào thế;7guard sẵn sàng |
| spawnSmoke | 0khói bật thấp;1–2cuộn nở/điện lóe;3–4tách giữa để lộ người;5–7wisps/tan |

Nhân vật giữ mặt người/tai sói nhỏ/tóc trắng/hoodie tím than/đai tím/quấn xám và một gậy ngắn tay phải, cùng tỷ lệ/kích thước đã chốt. Không vẽ khói vào sheet nhân vật hoặc bóng người vào sheet khói. Tia cyan đổi vị trí giữa các frame để có cảm giác lóe không đều; đây là artwork, không dùng random runtime hoặc chớp trắng cả người. Ánh gậy nhẹ ở pose đã hiện hoàn toàn.

Clip body dùng frame1,1,2,3,4,5,6,7 với180/300/260/260/340/180/200/600ms, tổng2320ms; pose0 là chuẩn so cỡ, không thêm thời gian cast. Body hiện dần260–860ms bằng alpha; giai đoạn đầu tối như bóng dáng, tăng độ sáng từ540 đến860ms về đúng màu gốc. Khói ghép phía trước nhân vật, chuyển mềm giữa8frame với140/180/180/220/200/220/250/250ms (1640ms), giảm opacity và tan hẳn trước cuối guard. Khói bật nhanh70ms đầu; các khe giữa mây và fade tạo cảm giác lộ bóng người.

Tai/mắt ở740–1000ms, nghiêng đầu cười1000–1340ms, xoay gậy1340–1520ms, bắt gậy1520–1720ms, guard1720–2320ms. Nhịp này là lựa chọn thiết kế để review art, chưa là thời gian spawn, trạng thái bất tử, AI hoặc quyền tấn công trong game. Preview lặp nghỉ450ms rồi chạy lại, chưa phải trigger xuất hiện thật.

## Source / atlas / file thay đổi

- Công cụ image_gen.imagegen built-in, transparent_background=true. Đã xem tạo hình v1 và bảng groundShock được duyệt trước khi tạo; body tham chiếu cảhai, khói tham chiếu palette tạo hình v1. Prompt nguyên văn tại integration/task-010-electric-wolf/animation/prompts/spawn.md và spawn-smoke.md.
- Source body exec-00136fb0-8dda-4ea2-8a03-025381cf3793.png và khói exec-b52ff188-3301-4b23-92eb-a2813296d700.png giữ nguyên byte ở animation/source/spawn.png và spawnSmoke.png. Cảhai1536×1024 RGBA thực,4cột×2hàng.
- animation-plan.json thêm2sheet, clip spawn và appearance/smoke; ghi nhận groundShock/groundWave đã được duyệt. scripts/prepare_electric_wolf_animation.ps1 thêm tên2sheet và xuất approvedEffects cùng metadata. Chỉ authoring -OnlySheet spawn rồi spawnSmoke; không sinh lại8PNG cũ.
- Candidate mỗi sheet2048×1024/8ô512×512/pivot(256,416),160px/world unit. Body một scale từ guard0 về220.88px/88% Ninja, không fit từng pose. Khói một scale cố định theo targetCellWidthPx300 (source ô384, scale0.78125), đủ bao quanh người và còn margin trong bảng/canvas ở zoom1,5×. Khói dùng cùng anchor nguồn của frame0 cho cảsheet để wisps cuối giữ cao độ tự nhiên, không ép đáy từng frame xuống nền.
- Source rect/alpha bounds/anchor/translation/scale/size/hash trong candidate JSON, atlas.json và review-data.js sinh từ plan. Tổng10sheet/10clip, trong đó2sheet/1clip mới của màn xuất hiện. Tạo hình/8PNG cũ và Ninja chính giữ nguyên.
- Preview hiện có thêm clip/bảng/controls, alpha hiện dần và crossfade khói; source atlas không bị recolor hoặc thay alpha nhân vật. Hồ sơ nhân vật/TASK_STATUS/DECISION_LOG cập nhật approval Skill2 và trạng thái candidate xuất hiện. Không sửa src/public/assets/map hoặc engine.

## Thực tế đã xem / giới hạn

Đã xem ảnh tham chiếu, output và hai bảng pose sau đóng atlas. Pixel mẫu vùng trống source alpha0; khe giữa khói tách có alpha0, vùng đỉnh mây có alpha cao để che nhân vật lúc đầu. Đã căn envelope khói để bảng không cắt đỉnh/mép; body giữ baseline/cỡ. Đã đối chiếu hash8PNG cũ theo metadata, không đổi ảnh đã duyệt.

Chưa thao tác HTML trong trình duyệt hoặc nghiệm thu chuyển sang idle runtime. Test/build/lint/typecheck/formatter **NOT_RUN** theo yêu cầu hiện hành. Chưa spawn/AI/damage/collision, vị trí xuất hiện, điều kiện miễn sát thương, sound hoặc boss; không tự chốt các cơ chế này từ art. Chờ duyệt màn xuất hiện, chưa commit/merge/push hoặc gọi production.
