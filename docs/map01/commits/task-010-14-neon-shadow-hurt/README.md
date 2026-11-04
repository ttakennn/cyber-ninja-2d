# Task10.14 — Sát Thủ Bóng Neon / trúng đòn

Người dùng chốt Thiên Ảnh Liên Trảm và giao art khi nhân vật bị trúng chiêu. Phạm vi là phản ứng chịu lực/hồi thế, chưa hệ thống HP/hitstun/knockback runtime hoặc tử vong.

## Artwork / preview

[Preview](preview.html), [bảng8pose](hurt-contact.png). Mở mặc định Trúng đòn/hồi thế; vẫn có9clip đã chốt để đối chiếu. Phát/dừng/xem lại, frame kế, tua thời gian, tốc độ1/0.5/0.25×, zoom/nền đêm/sáng/caro, bóng ngoại hình chuẩn và Ninja Hỏa so tỷ lệ.

8pose:0 guard trước đòn,1 giật vai/nheo mắt,2 ngả lùi đỉnh chịu lực,3 lùi nửa bước chân sau đỡ thân,4 hạ gối lấy thăng bằng,5 dựng thân,6 về thế thủ,7 guard. Mặt vẫn hướng phải, phản lực thân ngả trái; giữ2đoản đao trong hai tay, khăn/đai phản ứng theo quán tính. Không vẽ projectile/đối thủ/máu/death, không dùng hit flash phủ thân thay cho pose.

Nguồn1536×1024 RGBA/grid4×2, candidate2048×1024/8ô512×512/pivot256,416/160px-unit. Chuẩn đứng238.45px =95% Ninja Hỏa; một scale theo guard0 cho cả sheet, grounded căn chân, không fit từng pose. Co/ngả thấp thay đổi chiều cao tự nhiên, không đổi đầu/thân thành cỡ mới. Giữ danh tính/palette/trang bị/cỡ của bản đã chốt.

ImageGen built-in: exec-4579bba8-6604-4dc5-bf7e-340b3f0337a5.png; source nguyên byte/prompts/hurt.md/plan/hash/alphaBounds/crop/anchor/translation ở integration/task-010-neon-shadow/animation/ và [atlas.json](atlas.json). Tổng hiện hành12sheet/10clip,113frame tính cả reference và FX; hurt mới chờ duyệt.

## Nhịp art và bộ được chốt

Hurt860ms:100/60/90/110/110/100/110/180ms. Đây là nhịp trình bày để duyệt, chưa hitstun/recovery/knockback/bất tử hoặc thời gian mất điều khiển đã chốt. Preview không tự dịch vị trí bằng physics, không thêm sát thương hoặc trạng thái hiệu ứng lửa/điện.

Skill2 vừa được duyệt đã promote đúng11sheet/9clip vào [production](../../../characters/neon-shadow/animation/preview.html), source snapshot10.13/approved-plan.json và publisher copy PNG nguyên byte, không sinh lại ảnh. Hurt candidate chỉ ở integration/commits; snapshot10.8–10.13 giữ nguyên.

Đổi plan trước rồi authoring -OnlySheet hurt, copy11PNG cũ nguyên file. Không sửa generator/ảnh hoặc nhịp đã chốt, src/public/assets/map/gameplay. Prompt/reference/provenance mới lưu đầy đủ.

## Thực tế đã làm / còn mở

Đã đọc AGENTS/rules/source/metadata/generator và prompt hurt Sói Điện để tham khảo chuỗi phản ứng; xem PNG design Bóng Neon và Skill2 đã chốt. Đã xem output AI/bảng pose sau chuẩn hoá, sinh metadata/contact/HTML bằng generator chế độ ghi; không nghiệm thu browser.

Chờ người dùng duyệt mức giật/ngả/lùi, nhịp hồi thế và khả năng nối Idle. Chưa mở HTML qua trình duyệt, chưa runtime/hitstun/AI/damage/collision/spawn/death. Test/build/lint/typecheck/formatter NOT_RUN theo AGENTS. Chưa commit/merge/push.
