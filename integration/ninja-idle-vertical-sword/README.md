# Task10.40 · mắt production và kiếm đứng giữa lưng

Ngày2026-11-08. Chỉ sửa Idle đứng/thở; chưa duyệt/publish. Tham chiếu chính xác file người dùng chỉ định: `docs/characters/ninja/animation/locomotion/flame-ninja-atlas.png`,6frame `clips.idle` trong `animations.json` cạnh nó. Đã xem trực tiếp toàn atlas và trích6frame nguyên kích thước vào `production-idle-sheet.png`.

## Review và nguồn tạo ảnh

`previous-face-comparison.png`: trái production/phải candidate10.39, phóng4×. Candidate trước làm đổi độ mở mắt, đường cắt mặt nạ/mũ và hình khối đầu. Chỉ mô tả bằng prompt không bảo đảm các nét này trùng gốc.

`cleanup-source.png` do imagegen chỉnh từ sheet Idle production làm nguồn duy nhất, prompt tại `cleanup-prompt.txt`. Chỉ sử dụng vùng phục hồi kiếm cũ ở hông khi đóng gói; phần cơ thể/đầu được imagegen vẽ lại không làm nền output cuối.

`weapon-source.png` do imagegen tạo riêng một kiếm có bao thẳng đứng, tham chiếu hình weapon trong cleanup-source. Prompt tại `weapon-prompt.txt`. Đây là artwork riêng để lắp thành một lớp cứng, không ghép chuôi và đầu bao từ hai vị trí khác nhau của hình nhân vật.

## Bảo toàn pixel

`plan.json` khai báo3vùng sửa kiếm cũ ở hông và dải đặt kiếm đứng. Generator `scripts/prepare_ninja_idle_vertical_sword.ps1`:

1. Crop từng Idle production384×320 theo rect metadata, không resize cơ thể.
2. Lấy phần phục hồi trong hipRepairPolygons từ cleanup-source đã đưa về cùng ô bằng một transform đồng đều; giữ pixel production ngoài vùng này.
3. Chuẩn hóa riêng artwork kiếm vào lớp384×320, cao230px, top9, trụcX174; luôn không xoay và cùng vị trí trong6frame. Lớp kiếm nằm sau thân/khăn/tay/quần gốc.
4. Khôi phục nguyên RGBA production ngoài các vùng cho phép; đối chiếu pixel theo yêu cầu người dùng, lưu kết quả trong provenance/review metadata.

Audit6frame: vùng đầu–mắt rect(190,30,55,75) có0pixel khác production; ngoài vùng hông/kiếm cho phép có0pixel khác. Điều này chứng minh các vùng được bảo vệ, không chứng nhận mỹ thuật vùng phục hồi hoặc độ mượt browser.

Output ở `docs/map01/commits/task-010-40-ninja-idle-vertical-sword/`: atlas ghép, body-atlas, lớp back-sword, crop production, ảnh so toàn thân/đầu, preview, metadata/provenance. `cleanup-inspection.png` chỉ để xem transform vùng phục hồi, không phải art được chọn. Giữ source/hash; chưa sửa production/runtime, cảnh giác/chạy hoặc commit. Browser/test/build NOT_RUN.
