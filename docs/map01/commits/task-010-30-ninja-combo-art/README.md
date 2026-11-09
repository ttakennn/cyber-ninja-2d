# Task 10.30 — Ninja Hỏa: art và nhịp combo mới

[Mở preview](preview.html) · [Atlas mới](combo-atlas.png) · [Nguồn/prompt](../../../../integration/ninja-combo-revision/PROMPTS.md) · [Plan nguồn](../../../../integration/ninja-combo-revision/combo-plan.json).

## Review bản cũ

Đã xem attack_1/2/3.png, metadata production, combo-plan cũ và src/entities/PlayerAttack.ts. Các sheet cũ xuất phát từ bộ pose riêng, góc thân và cách thu kiếm chưa thống nhất. Runtime giữ tối đa hai đòn chờ, chọn bước bằng modulo3 và khởi động đòn tiếp ngay khi clip kết thúc; không có hồi thế bắt buộc sau combo3. Giảm speed0,8 trước đây chỉ làm clip chậm hơn, không tạo khóa sau combo. Đây là nhận xét từ source/art; chưa chơi thử runtime trong task này.

## Phương án mới để duyệt

Một sheet16pose vẽ cùng lượt để đồng bộ cơ thể/trang phục. Ba đường kiếm: ngang, ngược lên, bổ chéo. Từng đòn gồm guard/lấy đà/bắt đầu/chạm đòn/theo đà/thu thế; tất cả trở về chính frame guard0, không dùng ba tư thế nghỉ khác nhau. Bảng frame và điều khiển frame trước/sau có trong preview. Không thêm damage/hit-stop/di chuyển root.

| Nhịp | Thời lượng | Cửa sổ nhận đúng 1 đòn chờ |
| --- | --- | --- |
| Đòn1 | 540ms | 140–460ms |
| Đòn2 | 560ms | 140–480ms |
| Đòn3 | 760ms | Không nối sang đòn1 |
| Dừng chuỗi sớm | 220ms hồi thế | Bỏ click |
| Hoàn tất combo3 | 320ms hồi thế | Bỏ click, xóa đòn chờ |

Tổng full combo 1860ms +320ms hồi thế =2180ms. Giữ chuột không auto-attack. Không dồn click trong hồi thế sang combo sau. Các con số là đề xuất để thử, không phải giá trị gameplay người dùng đã duyệt. Không tuyên bố đây là chuẩn tối ưu của mọi game ninja; phương án được chọn để giải quyết vấn đề cụ thể của source hiện tại.

Preview có xem một đòn, toàn combo, tự thử click trái, tốc độ0,5×/0,25×, thanh tua, mốc tỷ lệ và16pose bấm xem riêng. Nhân vật Idle bên trái giữ nguyên251px; guard mới hơi hạ trọng tâm240px. Một transform chung cho16pose, không fit/scale từng frame. Ô512×512/pivot192,353 và160px-unit như attack hiện hành. Alpha rời nhiễu ô lân cận được bỏ khi cắt sprite. Cần người dùng review sai lệch anatomy nhỏ của ảnh sinh và nhịp liên kết; chưa gọi candidate là final.

## Bộ run/hurt vừa chốt

Người dùng đã chốt Task10.29. Đã copy nguyên byte atlas candidate vào docs/characters/ninja/animation/locomotion/flame-ninja-atlas.png, cập nhật nguồn publisher/catalog/hash. Snapshot atlas trước đó giữ ở Task10.29 để lựa chọn Art cũ không bị đổi sau publish. Các pixel ngoài hai clip đã được so nguyên vẹn ở task trước. Không thay public/assets hoặc runtime. Leo vẫn giữ nguyên pixel bảnv2; hash toàn atlas mới được cập nhật trong catalog.

## Kiểm tra và giới hạn

- Đã xem atlas cũ, Idle, ảnh nguồn mới và atlas chuẩn hóa; đã rà source state machine preview và generator.
- Thử mở Chrome bị chặn vì phát hiện người dùng đang thao tác cửa sổ; chưa mở/kiểm tra phát preview trong trình duyệt, chưa thử click thực tế. Không tác động trang người dùng đang mở.
- Không chạy test/build/lint/typecheck/formatter. Chưa commit, chưa áp combo mới vào game.
- Nguồn PNG/prompt và cleanup giữ ở integration/ninja-combo-revision; generator scripts/prepare_ninja_combo_revision.ps1 tạo bản review từ plan. Chưa sửa source gameplay cũ hoặc physics/input.

## Phản hồi sau review

Người dùng bác hướng kiếm bạc/lửa mỏng và hai tay cầm kiếm. Không dùng candidate này làm bản chốt. Bản sửa một tay, tham chiếu kiếm/VFX gốc ở [Task10.31](../task-010-31-ninja-one-hand-combo/preview.html).
