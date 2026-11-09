# Task10.51 — Sửa tay nắm kiếm và khôi phục hai nhịp vào thế

**CANDIDATE_PENDING_REVIEW · 2026-11-09.** Người dùng xác nhận bản10.50 không còn hình ảnh dư, yêu cầu sửa chiều tay nắm kiếm và thêm hai frame mở đầu như10.49, với tạo hình10.50. Lời xác nhận phần ảnh sạch không được hiểu thành chốt toàn clip chiến đấu cho production.

## Xem bản sửa

- [Preview8frame](preview.html): bấm **Vào thế chiến đấu** để xem hai nhịp đầu rồi giữ thế/thở. Có tua từng frame, phát tiếp từ frame đang chọn, tốc độ và nền sáng/đêm/caro.
- [GIF vào thế](entry-preview.gif), [GIF sáu nhịp giữ thế](motion-preview.gif), [atlas8frame](combat-idle-atlas.png), [atlas trên nền sáng](contact-sheet-light.png).
- [Soi tay trước/sau đủ sáu nhịp](grip-review.png), [metadata](review.json), [nguồn/hash](provenance.json), [kiểm tra ảnh](asset-review.json).

Preview so ba cột: Idle10.47 đã chốt / bản50 làm nền / bản51 mới. Bản50 vẫn giữ nguyên để đối chiếu, không chạy lại generator50 hoặc ghi đè snapshot cũ.

## Bàn tay và vùng giữ nguyên

Tay đang nắm chuôi là **tay phải gần máy quay**. Ngón cái đặt về phía trên/cạnh ngón trỏ và ôm chéo vào chuôi, thay phần ngón cái ở dưới gây cảm giác bàn tay ngược. Bốn ngón cuộn quanh cán từ ngón trỏ đến ngón út; mu găng đen tiếp tục nối với cổ tay và giáp, không lật cánh tay/cẳng tay. Chuôi vẫn dựng thẳng và kiếm nằm trong bao sau lưng.

Chỉ chép vùng bàn tay/cổ tay nhỏ28×27px đã vẽ lại vào sáu pose giữ thế của50. Vùng này theo vị trí chuôi từng frame, không đứng yên trên canvas khi người thở. **Ngoài vùng tay này, sáu frame giữ thế có0RGBA khác so với bản50 tương ứng**: mặt, cơ thể, khuỷu nâng, tay trái, khăn bụng, quần, chân đều giữ ảnh50. Không dùng ảnh toàn thân mới để thay phần hình sạch đã được người dùng xác nhận.

## Thứ tự và cơ học

| Frame atlas | Động tác | Nhịp |
| --- | --- | --- |
| 1 | **Nâng tay vào kiếm**: cánh tay phải gập nâng ngang phần ngực/cổ, tay chưa nắm chuôi; tay trái giữ thế cao của50 | 100ms |
| 2 | **Đưa tay về chuôi kiếm**: khuỷu nâng, bàn tay mở/khum tiếp cận chuôi sau gáy | 100ms |
| 3–8 | Khép bàn tay đúng chiều, giữ thế và thở theo sáu pose50 | 140ms/frame, vòng840ms |

Hai frame mới được vẽ theo kiểu50, lấy động tác hai nhịp49 làm tham chiếu; không tái dùng ảnh tay/bụng lỗi của49. Phần cánh tay phải và khăn quanh đường tay đi được thay trong một vùng liền mạch có ghi trong plan; mặt/vùng đầu bảo vệ và phần thân dưới giữ ảnh50. Không lồng bóng tay cũ hoặc pha mờ hai thân lên nhau để giả chuyển động. Kiếm, hai vai và quỹ đạo tay được soi ở các khung mới.

## Đóng gói và kiểm tra

Ô384×320, pivot192,289, atlas1536×640 bố cục4×2. Không đổi world scale/physics/clip production. Một hệ số nguồn chung cho ảnh sửa tay, một hệ số chung cho sheet hai nhịp; căn theo chuôi. Atlas output dùng chính các frame50 làm nền, không co giãn lại sáu pose đó.

Đã xem hai khung mới và ảnh tay trước/sau sáu nhịp trên nền sáng/tối, atlas đủ8frame. Audit ảnh ghi0pixel ngoài vùng được sửa,0khác vùng đầu bảo vệ và thân dướiy≥160 ở cả8frame. Không phát hiện mảnh alpha rời lớn hơn3pixel ở alpha≥64; đây là kiểm tra bổ trợ, không thay đánh giá giải phẫu bằng mắt. GIF vòng thở giải mã6frame×140ms; GIF vào thế có14lượt hiển thị, gồm2frame vào thế và hai vòng6frame thở, không phải14pose riêng.

Canonical Idle10.47 và input atlas50 giữ nguyên hash; xem asset-review.json. Browser/runtime/test/build/lint/typecheck/formatter **NOT_RUN**. Chưa publish vào docs/characters hoặc public/assets, không tích hợp phát hiện quái/boss, không commit/merge/push. Bản sửa và hai khung mới đang chờ người dùng review.

## Nguồn

integration/ninja-combat-idle-grip-entry/plan.json, grip-source.png/entry-source.png và hai prompt; ready50-reference-flat.png là ảnh50 được composite để đọc rõ alpha, entry49-pose-only-reference.png chỉ hướng dẫn động tác. scripts/prepare_ninja_combat_grip_entry.ps1 tạo ảnh/metadata/so sánh; scripts/assemble_ninja_combat_grip_entry_review.mjs đóng GIF. Vùng sửa, vị trí neo theo nhịp, số pixel và hash nguồn được lưu riêng.
