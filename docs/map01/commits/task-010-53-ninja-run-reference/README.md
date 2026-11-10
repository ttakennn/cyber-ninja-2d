> **ĐÃ BỊ NGƯỜI DÙNG BÁC / SUPERSEDED BY 10.54.** Sai kích thước, tỷ lệ cơ thể và mở hai chân quá rộng. Không dùng để publish. Nội dung/metadata bên dưới giữ hồ sơ tại lúc tạo bản 10.53. Xem [bản vẽ lại 10.54](../task-010-54-ninja-run-compact/preview.html).

# Task10.53 — Ninja Hoả: chạy theo chuẩn10.51

**CANDIDATE_PENDING_REVIEW · 2026-11-09.** Người dùng yêu cầu sửa tư thế chạy, lấy bản10.51 làm chuẩn nhân vật và tham khảo cơ học/chuyển động từ ảnh ninja xanh12pose. Bản chạy mới chưa được chốt production.

## Xem chuyển động

- [Preview so sánh](preview.html): trái chuẩn51 đã chốt, giữa vòng chạy hiện tại8frame, phải candidate12frame. Có phát/dừng, frame trước/sau, tua, tốc độ0,25/0,5/1x, phóng và nền sáng/đêm/caro.
- [GIF vòng chạy](motion-preview.gif), [atlas12frame](run-atlas.png), [bảng nền sáng](contact-sheet-light.png), [soi thân trên12frame](upper-body-review.png).
- [Metadata](review.json), [nguồn/hash](provenance.json), [kiểm tra ảnh/GIF](asset-review.json), [pose dùng căn tỷ lệ nguồn](source-calibration.png).

## Tư thế và cơ học

Tạo hình bám10.51: hood/mặt nạ và khe mắt, cơ vai–tay, áo đen viền đỏ, khăn/đai/tà đỏ, quần đen, giáp bạc và màu trang bị. Ảnh ninja xanh chỉ làm tham chiếu động tác. Thân nghiêng tới khi chạy, tay phải gần máy quay giữ chuôi kiếm sau gáy; tay trái gập và đánh ngang trước ngực, có nhịp đưa ra/thu vào. Kiếm và tay nắm theo thân, chỉ lộ chuôi, không để lại kiếm cũ ở hông.

Sải chân mở qua chống chân, đạp sau, bay, thu/đón đất. Có hai pha bay mở sải ở frame4/10, không ép đế chân về cùng hàng trong mọi frame. Chân co ở nhịp chuyển, duỗi khi mở sải. Khăn và tà vải kéo về sau theo chuyển động; giữ liên tục nách, cổ tay, eo/đai, hai tay và hai chân.

| Frame | Nhịp review |
| --- | --- |
| 1–3 | Tiếp đất A → chống/nén gối → đạp/rời đất |
| 4–6 | Bay mở sải → đưa chân xuống → đón bước B |
| 7–9 | Tiếp đất B → chống/đổi hông → đạp lượt hai |
| 10–12 | Bay mở sải → thu/hạ chân → đón đất trả vòng |

Hai pose cuối nguồn được xếp lại theo độ hạ chân để nối về bước đầu; mapping cụ thể ghi sourceCell trong metadata. Nhãn pha mô tả vòng art để review, không phải collision/IK hoặc dữ liệu điều khiển chuyển động của game.

## Tỷ lệ và đóng gói

Nguồn chọn là run-arm-source.png, sheet4×4 gồm1pose đứng chuẩn,12pose chạy và3ô trống. Chỉ lấy12pose chạy vào atlas6×2. Nguồn đầu được chỉnh hai pose cuối rồi chỉnh tay trái ngang ngực; giữ các bước nguồn/prompt để đối chiếu.

**Một hệ số chung0,9296296296** lấy từ pose đứng nguồn: hood y38 đến đế chân y308, đưa chiều cao giải phẫu về chuẩn251px. Cả12pose dùng cùng hệ số; không fit mỗi bbox chạy thành251px hoặc làm phồng frame co chân. Căn ngang theo mốc đai/hông từng cell và dùng **một độ dịch dọc chung10,111111px** từ bước chạm đất đầu; giữ khoảng hở dưới chân ở nhịp bay. Frame4/10 có đế thấp nhất cách mặt phẳng34px trong bản đã đóng gói.

Atlas2304×640 RGBA, ô384×320, pivot192,289, cùng mật độ160px/unit. Không tự trim/recenter theo alpha từng pose. Đề xuất **18FPS cho12frame**, vòng666,67ms, bằng nhịp vòng8frame/12FPS hiện tại; chưa đổi tốc độ hoặc animation runtime. GIF dùng tick10ms, làm tròn50/60ms mỗi frame thành670ms/vòng. Preview Canvas dùng18FPS.

## Review đã làm và giới hạn

Đã xem bảng đủ12frame trên nền sáng và thân trên phóng lớn, đối chiếu mẫu51/vòng chạy hiện tại, soi các nhịp đầu/bay/cuối. Đếm vùng alpha≥64 không phát hiện mảnh rời lớn hơn3px ở cả12frame; kiểm tra này chỉ bổ trợ review giải phẫu/đường hình. GIF đã giải mã12frame, PNG có alpha và đủ12rect. Đây là artwork vẽ lại theo51, không phải phép đo motion capture hoặc nghiệm thu physics.

Combat51 và atlas locomotion đã chốt giữ nguyên SHA256, ghi trong asset-review.json. Không thay PNG/metadata production hoặc src/public/assets, không tích hợp vào game, không commit/merge/push. Browser/runtime/test/build/lint/typecheck/formatter **NOT_RUN**. Chờ người dùng review pose, tỷ lệ và nhịp chạy.

## Nguồn và tái tạo

integration/ninja-run-combat-reference/: plan.json, run-source.png, run-loop-source.png, run-arm-source.png, ba prompt tương ứng, combat51-reference.png, reference-contract.json và source-measurements.json. Ảnh tham chiếu chạy xanh là tệp người dùng đính kèm trong hội thoại; không bịa một đường dẫn file nguồn cho ảnh đó.

measure-source.ps1 đọc mốc đai/đế từ nguồn được chọn; chạy bằng Windows PowerShell5. scripts/prepare_ninja_run_combat_reference.ps1 đóng atlas/metadata/bảng so, scripts/assemble_ninja_run_reference_review.mjs đóng GIF. Không chạy publisher hoặc generator51. Nguồn4×4 chỉ là sheet authoring có control; atlas run12frame mới là output đang chờ review.
