# Task10.49 — Ninja Hoả: Idle chiến đấu

**CANDIDATE_PENDING_REVIEW · 2026-11-09.** Bản vẽ mới theo yêu cầu tư thế khi gặp quái/boss. Idle10.47 vẫn là bản đứng thở production đã duyệt; bản chiến đấu này chưa được người dùng chốt.

## Xem bản vẽ

- [Preview so sánh với Idle10.47](preview.html): gặp quái/về Idle thường, giữ thế chiến đấu, phát/dừng, tua từng frame, tốc độ và nền.
- [GIF vòng đứng chiến đấu](motion-preview.gif): 6 frame × 140ms, vòng 840ms.
- [GIF đưa tay vào thế](entry-preview.gif): 2 frame chuyển tiếp × 100ms rồi hai vòng giữ thế; 14 lượt hiển thị, không phải 14 pose riêng.
- [Atlas RGBA](combat-idle-atlas.png): 8 frame, ô 384×320, bố cục 4×2. [Metadata](review.json), [nguồn/hash](provenance.json), [vùng chỉnh](arm-edit-mask.png).

## Tư thế và tạo hình

Tay phải gần máy quay (bên trái ảnh) nâng khuỷu ra ngoài, cẳng tay gập lên, bàn tay tiếp xúc chuôi kiếm dựng sau gáy. Tay trái xa máy quay gập trước bụng trong thế thủ. Kiếm còn trong bao sau lưng; không thêm lưỡi kiếm hoặc bao kiếm lộ dưới thân. Giữ hai tay, đường vai–khuỷu–cổ tay liền mạch; khăn đỏ nằm sau tay nâng và tiếp tục bay theo nhịp nguồn.

Ảnh ninja xanh người dùng gửi chỉ làm tham chiếu động tác. Đầu/mắt, tỷ lệ thân–chân, trang phục và màu Ninja Hoả lấy từ bản10.47 đã chốt. Chân đứng nguyên vị trí; người thở nhẹ, tay và điểm nắm chuôi cùng đi theo vai.

Nguồn cứng là đúng PNG Idle10.47 đã duyệt. Hai ảnh mới được tạo để lấy phần tay/vùng khuất rồi ghép theo mask lên sáu frame nguồn; không thay toàn thân bằng nhân vật mới. Phần vải xuất hiện sau khi tay cũ nâng lên được phục hồi từ nguồn pose. Khăn bụng ở ngoài vùng tay che giữ pixel nguồn. Mỗi ảnh nguồn có một hệ số kích thước cố định theo chiều cao đầu–đế chân251px, căn chuôi tại174,26; không tự co giãn từng frame. Pivot192,289 và mật độ160px/unit giữ chuẩn.

## Phạm vi và kiểm tra

Đã xem atlas đủ8frame và các bảng phóng lớn vai/tay/chuôi. Audit trong review.json ghi0RGBA khác ngoài mask chỉnh,0 khác vùng đầu bảo vệ và phần dưới y≥188 so với từng frame Idle10.47 tương ứng. Audit chỉ chứng minh vùng giữ nguyên, không thay thế đánh giá thẩm mỹ.

[Kiểm tra đóng gói ảnh/GIF](asset-review.json) ghi kích thước, số frame giải mã và hash canonical. Browser, game runtime, test/build/lint/typecheck/formatter **NOT_RUN**. Preview Canvas là bản mô phỏng artwork, chưa nối phát hiện quái/boss, AI, hitbox hoặc gameplay. Nhịp200ms vào thế là đề xuất để review, chưa phải quyết định combat.

Không publish PNG/metadata vào docs/characters hoặc public/assets, không sửa production10.47, không commit/merge/push. Bản vẽ chờ người dùng review.

## Tái tạo

Nguồn nằm ở integration/ninja-combat-idle/: plan.json, idle47-reference.png, combat-master.png, combat-enter-source.png và prompt tương ứng. scripts/prepare_ninja_combat_idle.ps1 ghép ảnh theo vùng chỉnh, xuất atlas/metadata/ảnh soi; scripts/assemble_ninja_combat_idle_review.mjs đóng GIF từ các frame đã vẽ. Preview nguồn đặt cùng plan rồi được copy vào snapshot này. Không chạy publisher production trong bước authoring.
