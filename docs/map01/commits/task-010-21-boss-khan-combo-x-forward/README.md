# Task 10.21 — X vươn xa

[Xem preview](preview.html) · [8 frame kết](combo-b-contact.png) · [nguồn, plan và prompt](../../../../integration/task-010-boss-khan/combo-x-forward/animation-plan.json).

Theo dấu X người dùng vẽ ở bên phải `combo-b/5`, đã vẽ lại nhịp `combo-b/4` lấy đà và `combo-b/5` kết đòn: Khan chúi thân, trụ chân trước, **hai tay duỗi tới**, hai đao giao nhau thành X phía trước cơ thể. Nhịp này mạnh hơn về tư thế và ánh sáng; không chốt sát thương.

Chỉ hai khung `combo-b/4–5` lấy art mới. Các khung `combo-b/0–3,6–7` và toàn bộ `combo-a` lấy lại source của Task10.20. Script `compose-selected-frames.ps1` ghép ô nguyên pixel, sau đó `prepare_boss_khan_animation.ps1 -Profile combo-x-forward` chuẩn hoá theo plan: review frame 512×512, pivot (256,456), tham chiếu 160 px/world unit, một scale cho mỗi sheet, chiều cao mực tham chiếu 376,5px. Không đổi timing 1,35 giây, không đổi chuyển động preview `offsetX` đã có. Preview dùng chính X trong art, không thêm lớp X cũ lên trên hai tay.

Đã xem bảng tám khung sau khi sinh: hai tay ra trước, X nằm trong ô và không bị cắt ở mép bảng. Chưa mở preview trong trình duyệt, chưa tích hợp game hoặc kiểm tra gameplay. Test/build/lint/typecheck/formatter NOT_RUN theo yêu cầu hiện tại. Candidate đang chờ người dùng duyệt; Task10.20 giữ nguyên để so sánh.

Cập nhật ở Task10.22: người dùng đã chốt bộ art này. Hai sheet được sao chép nguyên PNG vào [thư viện production](../../../characters/boss-khan/animation/combo/preview.html); phần lướt mới vẫn chờ duyệt riêng.
