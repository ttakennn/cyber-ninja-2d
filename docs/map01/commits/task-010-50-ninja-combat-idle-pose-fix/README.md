# Task10.50 — Sửa tư thế Idle chiến đấu Ninja Hoả

**CANDIDATE_PENDING_REVIEW · 2026-11-09.** Thay candidate10.49 bị người dùng phản hồi sai tư thế và còn ảnh thừa. Không thay bản đứng/thở Idle10.47 đã chốt.

## Mở bản sửa

- [Preview3cột](preview.html): trái Idle10.47 đã chốt, giữa10.49 còn lỗi, phải10.50 mới. Có phát/dừng, frame trước/sau, thanh tua, tốc độ0,25/0,5/1x, nền sáng/đêm/caro và bảng6frame.
- [GIF6frame](motion-preview.gif), [atlas1152×640 RGBA](combat-idle-atlas.png), [ảnh trên nền sáng](contact-sheet-light.png), [soi eo/tay đủ6frame](waist-review.png).
- [Metadata](review.json), [nguồn/hash](provenance.json), [kiểm tra đóng gói](asset-review.json).

## Phản hồi và thay đổi

| Phản hồi người dùng | Xử lý trong10.50 |
| --- | --- |
| Còn dính tay cũ, mảnh rời cạnh eo; ảnh ghép lệch | Vẽ lại6pose liền khối. Không chồng các mask tay lên silhouette tay thả cũ; không lấy lại tay/eo10.49. Khoảng trống nách và eo có alpha sạch. |
| Góc tay cầm kiếm và thân chưa theo ảnh | Khuỷu tay phải gần máy quay nâng gần ngang đầu, cẳng tay thoải về chuôi sau gáy. Đường vai–khuỷu–cổ tay liền mạch; thân có độ ngả nhẹ về sau. |
| Tay trái đặt ngang bụng sai tham chiếu | Tay trái xa máy quay gập cao trước phần ngực dưới, khuỷu mở ra ngoài; cẳng tay chéo về nắm tay, tách khỏi đai bụng. |
| Cần review tỉ mỉ hơn | So từng frame/crop, nền sáng và âm bản quanh eo; kiểm tra hai tay, chuôi kiếm và vùng vải liên tục. Ghi giới hạn thật, không dùng chỉ số mask để kết luận art đã đạt. |

Sáu frame giữ tư thế chiến đấu và thở nhẹ. Kiếm vẫn trong bao sau lưng, chỉ lộ chuôi thẳng; không có lưỡi kiếm dưới tay hoặc bao kiếm chạy xuống hông. Đai bụng đã được nâng lại ở nguồn vẽ để phần áo đen không dài hơn chuẩn. Hai khung vào thế cũ10.49 không đưa vào bản sửa này vì góc tay đã thay; đây là vòng tư thế mới để review trước.

## Chuẩn và cách đóng gói

Nguồn danh tính vẫn là Idle10.47 trong production, bản đã được người dùng chốt và publish ở10.48. Ảnh ninja xanh trong hội thoại là tham chiếu tư thế, không là nguồn palette hay thiết kế nhân vật. Nhận diện giữ Ninja Hoả: mắt hẹp, mũ/mặt nạ đen, headband/miếng kim loại, khối cơ, áo đen viền đỏ, khăn/đai/tà đỏ, quần rộng và giáp bạc.

Nguồn mới là sheet6pose được vẽ lại hoàn chỉnh bằng imagegen, sau đó chỉnh tỷ lệ thân–đai theo bản10.47. **Không tuyên bố pixel đầu/chân/quần áo giống nguyên byte bản10.47**, vì đây là pose vẽ lại, khác phương pháp mask của10.49. Kiểm soát chiều cao đầu–đế chân251px bằng một hệ số chung cho cả sheet, không fit/co giãn từng pose. Mỗi cell512×512 chỉ được tịnh tiến để neo đế chân vềy289/giữa chân192,5; ô output384×320, pivot192,289, cùng mật độ160px/unit. Viền alpha bàn chân giữa các pose vẽ lại có dao động nhỏ1–2px; không đổi scale từng frame để bù.

Atlas mới có6frame bố cục3×2, FPS7,142857, mỗi frame140ms, vòng840ms. Không sửa FPS/pivot hoặc PNG của bản Idle chính thức.

## Review đã làm và giới hạn

Đã xem bảng so sánh từng frame, atlas toàn bộ và crop eo/tay trên nền sáng; hai tay được vẽ đúng số lượng, không còn bàn tay thả xuống hông từ10.49. Đếm vùng ảnh liên thông ở alpha≥64 không phát hiện mảnh rời lớn hơn3pixel ở cả6frame; phép đếm này không phát hiện mọi lỗi giải phẫu hoặc lỗi liền khối nên chỉ là kiểm tra bổ trợ. GIF đã giải mã6frame, timing140ms; PNG có alpha,1152×640. Xem asset-review.json cho số đo thực tế.

Canonical Idle10.47 giữ SHA256 d5559f90565cdc00eec69d7692eac7e48ce0b6bdd9bd070e59d69d551d523e48. Không publish art/metadata vào docs/characters hoặc public/assets, không tích hợp phát hiện quái/boss hay gameplay, không commit/merge/push. Browser/runtime/test/build/lint/typecheck/formatter **NOT_RUN**. Bản sửa chờ người dùng review, chưa được chốt production.

## Nguồn

integration/ninja-combat-idle-pose-fix/plan.json chọn pose-proportions-source.png. Giữ pose-source.png và pose-alpha-source.png làm các bước nguồn; prompt tương ứng lưu riêng, có bản Idle47 tham chiếu nguyên byte ở integration/ninja-combat-idle/idle47-reference.png. Hai ảnh nguồn trước bước cân tỷ lệ không phải candidate được chọn. RGB ở pixelalpha0 của nguồn có thể mang màu nền; bộ đóng gói alpha-composite lên canvas RGBA trong suốt, không lấy RGB đó làm nền hiển thị.

scripts/prepare_ninja_combat_pose_fix.ps1 đóng atlas/metadata/bảng so; scripts/assemble_ninja_combat_pose_fix_review.mjs đóng GIF từ6frame. Không sửa hoặc chạy lại generator10.49; snapshot đó giữ lịch sử phản hồi.
