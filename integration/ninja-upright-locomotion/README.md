# Ninja Hỏa · sửa Idle và chạy theo phản hồi Task10.38

Nguồn authoring ngày2026-11-08, chưa được duyệt. Thay hướng candidate10.37 theo phản hồi: hai Idle buông tay, giữ dáng gốc; cảnh giác đứng thẳng; chạy sải dài/tay trái ngang ngực, bớt dáng thô. Không tạo lại walk hoặc sửa attack.

## Nguồn tạo ảnh

- Idle gốc xem trực tiếp: `integration/ninja-run-hurt-revision/idle-reference.png`,384×320, mốc đầu38/chân289, chiều cao251px.
- Ảnh ninja xanh12pose do người dùng đính kèm chỉ tham khảo cơ học chạy, không lấy danh tính/palette xanh.
- `idle-initial.png` và `idle-initial-prompt.txt`: lần vẽ đầu của task này; không đóng gói vào clip mới vì độ mở chân chưa gần Idle gốc.
- `idle-source.png`, `idle-prompt.txt`: lần sửa tiếp, tham chiếu trực tiếp chỉ Idle gốc, nhấn giữ độ mở chân/đầu/thân/tay và chuyển kiếm lên lưng.
- `run-source.png`, `run-prompt.txt`:12pose, tham chiếu ảnh chạy người dùng, Idle gốc và ảnh Idle lần đầu của task này.
- Công cụ tạo art: `image_gen.imagegen`, nền trong suốt. `scale-study.png` chỉ là montage nghiên cứu từ lần Idle đầu, không phải output được chọn.

## Chuẩn hóa cùng kích thước

Nguồn Idle1374×1145/lưới4×4; chạy1586×992/lưới4×3. `plan.json` cấp cả hai sheet **cùng hệ số251/255**, lấy đầu21/chân276 của Idle mới so với251px Idle gốc. Không chọn chiều cao riêng cho chạy, không fit mỗi pose, không scale riêng chiều ngang/dọc. Vị trí trong ô384×320/pivot192,289 giữ contract; nguồn chạy giữ tư thế nghiêng và khoảng bay tự nhiên qua mốc đất theo hàng.

`measure-source.ps1` phục vụ đối chiếu hình theo yêu cầu: đo bounding alpha và vùng20px trên mũ để phân biệt kích thước đầu với chuôi/khăn. Bề ngang mũ trong vùng đó: gốc47, Idle mới47, chạy44px ở góc nghiêng; đây là một mốc tham khảo, không chứng minh toàn bộ giải phẫu giống từng pixel. Plan ghi phạm vi chuẩn hóa; không sửa collider để bù ảnh.

Generator: `scripts/prepare_ninja_upright_locomotion.ps1`, output `docs/map01/commits/task-010-38-ninja-upright-locomotion/`. Source prompt/PNG/plan và output atlas có hash trong provenance. Không publish art hoặc thay runtime.
