# Task10.41 · Idle: bụng liền mạch, kiếm ngắn đi theo lưng

Ngày2026-11-08, candidate chờ review. Nguồn chính theo người dùng: `C:\Users\anhthaitrong\Downloads\Games\cyber-ninja-2d`; art nhân vật đã chốt tại `docs/characters/`. Đã đọc lại AGENTS, bản đồ tài liệu, Game Bible, quyết định/trạng thái liên quan, các chuẩn art/atlas/sprite, quy trình animation production và spec Ninja trước khi thực hiện.

## Review lỗi trước

`previous-waist-comparison.png` phóng4× production/candidate10.40: mảng phục hồi hông quá rộng, đai lưng/vùng bụng ghép không cùng vị trí. Kiếm lớp riêng10.40 đặt cố định cùng vị trí cho6frame và dài230px làm lộ đầu bao phía dưới. Kiểm tra mắt0pixel khác ở task trước không chứng nhận chất lượng vùng vá hoặc chuyển động.

## Source và authoring

- Production Idle: `docs/characters/ninja/animation/locomotion/flame-ninja-atlas.png`, rect/6frame/FPS/pivot từ `animations.json` cạnh nó. Các cơ thể vẫn là đúng pixel pose production, không resize.
- `cleanup-source.png`: nguồn imagegen mới để phục hồi kiếm cũ; chỉ tham chiếu6frame Idle production, `cleanup-prompt.txt` giữ nguyên prompt. Không dùng toàn cơ thể được AI vẽ lại làm replacement.
- Kiếm riêng tái sử dụng nguồn `integration/ninja-idle-vertical-sword/weapon-source.png`, nguồn imagegen task trước đã lưu prompt/hash. Không vẽ lại danh tính/vũ khí khi chỉ rút ngắn placement.
- Plan tại `plan.json`; generator `scripts/prepare_ninja_idle_attached_sword.ps1`, GIF packer `scripts/assemble_ninja_idle_review.mjs`.

Vùng sửa hông đi theo tâm phần gold của kiếm cũ trong từng production frame; mask theo đường hình kiếm và vùng phục hồi có trong generator. Giữ lại vùng bụng/đai phía trước và pixel đỏ đai được bảo vệ, thay vì ghi đè cả một hình chữ nhật vẽ lại. Nguồn phục hồi được căn với vùng đai còn thấy trong từng frame; không dịch cơ thể production để bù.

Kiếm rút230→175px, top18 ở frame đầu, chỉ cho lớp kiếm hiện đến y58 rồi bị che sau cơ thể; đầu bao phía dưới không được render. Tâm vùng da vai production trong ROI150,75,46,43 cung cấp độ dịch; loại màu khăn đỏ khỏi việc đo. Không dùng alpha bbox cả nhân vật/khăn để neo kiếm. Độ dịch6frame: `(0,0),(2,-1),(-6,-2),(-6,0),(-8,0),(-6,-2)`px. Chuôi/guard/bao cùng transform, luôn thẳng đứng; không kéo giãn hoặc làm gãy kiếm.

## Kiểm tra ảnh

Audit6frame lưu provenance/review: đầu rect190,30,55,75; bụng rect194,105,35,23; đai phía trước rect204,128,24,17 đều0pixel khác production. Ngoài mask được phép0pixel khác. Phía dưới vùng chuôi nhìn thấy0pixel khác body không kiếm. Các ROI này là giới hạn phép đối chiếu, không phải tuyên bố toàn bộ vùng quần áo được phục hồi trùng pixel gốc vốn bị vũ khí che.

Đã xem atlas toàn6pose, comparison và frame review phóng bụng ở đầu/giữa chu kỳ. GIF là bản review lượng tử màu từ6ảnh PNG, không thay atlas PNG chất lượng nguồn; nhịp140ms/frame xấp xỉ FPS production7.1429. Fullbody/waist preview giữ nguyên các pose production và cùng phase.

Chrome không thể được kiểm tra đầy đủ: Computer Use dừng vì không xác định được URL hiện tại trên Windows để áp chính sách. Không tuyên bố đã duyệt toàn vòng/nút trong browser. Test/build/lint/typecheck/formatter NOT_RUN. Không publish production/runtime, sửa cảnh giác/chạy, commit/merge/push.
