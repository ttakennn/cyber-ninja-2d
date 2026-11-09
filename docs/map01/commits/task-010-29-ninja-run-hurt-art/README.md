# Task 10.29 — vẽ lại run/hurt Ninja Hỏa

[Preview so cũ/mới](preview.html) · [8 pose chạy](run-poses.png) · [4 pose trúng đòn](hurt-poses.png) · [Nguồn và prompt](../../../../integration/ninja-run-hurt-revision/PROMPTS.md).

## Phạm vi

Người dùng yêu cầu sửa chạy giật và bốn frame trúng đòn lớn hơn Idle. Hai sheet tạo bằng image_gen tích hợp, tham chiếu trực tiếp Idle Ninja; đã xem locomotion Sói Điện và hurt Khan để đối chiếu chuyển động/tỷ lệ. Candidate chờ duyệt, chưa thay art production hoặc runtime.

Run giữ 8 frame/12fps, nhịp tiếp xúc–nén–đưa chân–bay và luân phiên tay/chân. Hurt giữ 4 frame/13.3333fps: bật nhẹ khi trúng, hấp thụ lực, hồi cân bằng, trở về guard. Preview hồi thế nối Idle nguyên bản.

Ô384×320, pivot192,289,160px/world-unit, rect/FPS/loop gốc giữ nguyên. Authoring dùng một tỷ lệ cố định mỗi sheet, không fit riêng từng frame. Normalization ghi trong normalization.json; nguồn PNG/prompt ở integration/ninja-run-hurt-revision, script scripts/prepare_ninja_run_hurt.ps1.

## Đã thực hiện và giới hạn

- Đã xem hai sheet nguồn và hai sheet chuẩn hóa; ảnh có alpha, nhân vật không bị cắt trong ô.
- Generator đã so từng pixel ngoài 8 ô run + 4 ô hurt với atlas gốc: khớp hoàn toàn. Đây là kiểm tra bất biến artwork theo yêu cầu, không phải test/build.
- Preview có Art mới/Art cũ, Idle so cỡ, Frame trước/sau; chọn Đi/chạy hoặc Trúng đòn/hồi thế. Các chuỗi khác sử dụng frame gốc.
- Chưa xem phát animation trong trình duyệt, chưa chốt độ mượt thực tế. Browser/test/build/lint/typecheck/formatter NOT_RUN. Chưa commit.
- Giữ thay đổi UI Task10.28 đang có; hồ sơ của task đó vẫn độc lập. Không sinh lại metadata production, không đổi physics/input hoặc các clip khác.

## Sau khi người dùng chốt

Người dùng đã chốt cả run và hurt trong yêu cầu Task10.30. Atlas candidate được copy nguyên byte vào thư viện production; runtime vẫn giữ bản cũ. Atlas trước được lưu ở flame-ninja-atlas-before.png và preview Art cũ dùng snapshot này. Lịch sử nguồn tạo candidate ở trên được giữ nguyên.
